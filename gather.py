"""Multi-source open-access PDF gatherer for Research Writer.

A convenience tool that downloads open-access PDFs straight into corpus/ from
Semantic Scholar, Europe PMC (PubMed OA), and arXiv. It is a fast corpus
*bootstrap* for narrative/scoping reviews — NOT a substitute for the rigorous,
reproducible Phase 0 search-strategist agent. It complements that step: given a
documented settings/search-strategy.md, it can auto-fetch the open-access slice
of the strategy (see --strategy).

Every fetch is recorded (title, year, DOI, source, URL, status) to
corpus/gather-manifest.csv so the otherwise-undocumented identification step is
at least auditable.
"""

import argparse
import csv
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from itertools import zip_longest

USER_AGENT = "Mozilla/5.0 (research-writer gather.py)"
REQUEST_TIMEOUT = 30  # seconds
OVERFETCH = 3  # request this many × max_papers candidates to survive validation drops
S2_MAX_LIMIT = 100  # Semantic Scholar caps the search 'limit' parameter at 100
EPMC_MAX_PAGE_SIZE = 1000  # Europe PMC caps pageSize at 1000
MAX_DOWNLOAD_BYTES = 60 * 1024 * 1024  # 60 MB safety cap for a single PDF
MANIFEST_NAME = "gather-manifest.csv"
MANIFEST_FIELDS = ["gathered_at", "source", "title", "year", "doi", "url", "filename", "status"]


def clean_filename(title, year=""):
    clean_title = re.sub(r"[^\w\s-]", "", title)[:60].strip().replace(" ", "_")
    return f"{year}_{clean_title}.pdf" if year else f"{clean_title}.pdf"


def unique_path(output_dir, filename):
    """Return (filepath, filename) that does not collide with an existing file.

    Re-runs, 60-char title truncation, and user-supplied corpus files can all
    produce the same sanitized name; appending a counter prevents silently
    overwriting a PDF that another manifest row still claims exists.
    """
    base, ext = os.path.splitext(filename)
    candidate = filename
    counter = 1
    while os.path.exists(os.path.join(output_dir, candidate)):
        candidate = f"{base}_{counter}{ext}"
        counter += 1
    return os.path.join(output_dir, candidate), candidate


def download_pdf(pdf_url, filepath):
    """Download pdf_url to filepath.

    Returns 'downloaded', 'not-pdf', 'too-large', or 'failed'. The payload is
    validated by its magic bytes so loosened open-access links that resolve to
    an HTML landing page are reported and skipped rather than saved as a bogus
    .pdf. A size cap guards against pathologically large responses.
    """
    cap_mb = MAX_DOWNLOAD_BYTES // (1024 * 1024)
    try:
        req = urllib.request.Request(pdf_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as response:
            length = response.headers.get("Content-Length")
            if length and length.isdigit() and int(length) > MAX_DOWNLOAD_BYTES:
                print(f"      -> Skipped: reported size exceeds {cap_mb} MB cap.")
                return "too-large"
            # Read one byte past the cap so an over-cap stream is detectable.
            data = response.read(MAX_DOWNLOAD_BYTES + 1)
    except Exception as e:
        print(f"      -> Error downloading: {e}")
        return "failed"

    if len(data) > MAX_DOWNLOAD_BYTES:
        print(f"      -> Skipped: file exceeds {cap_mb} MB cap.")
        return "too-large"

    # Tolerate a few stray leading bytes before the %PDF header, but still
    # reject HTML landing pages (which won't contain %PDF near the start).
    if b"%PDF" not in data[:1024]:
        print("      -> Skipped: open-access link resolved to a non-PDF (likely a landing page).")
        return "not-pdf"

    try:
        with open(filepath, "wb") as out_file:
            out_file.write(data)
    except Exception as e:
        print(f"      -> Error saving: {e}")
        return "failed"
    return "downloaded"


def fetch_arxiv(query, limit):
    print("\n--- Querying ArXiv ---")
    base_url = "https://export.arxiv.org/api/query?"
    search_query = f"all:{urllib.parse.quote(query)}"
    url = f"{base_url}search_query={search_query}&start=0&max_results={limit}&sortBy=relevance"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        response = urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT)
        xml_data = response.read()
    except Exception as e:
        print(f"Error querying ArXiv: {e}")
        return []

    root = ET.fromstring(xml_data)
    ns = {
        "atom": "http://www.w3.org/2005/Atom",
        "arxiv": "http://arxiv.org/schemas/atom",
    }

    papers = []
    for entry in root.findall("atom:entry", ns):
        title_el = entry.find("atom:title", ns)
        title = (title_el.text or "Unknown Title").strip().replace("\n", " ")

        pub_el = entry.find("atom:published", ns)
        year = pub_el.text[:4] if pub_el is not None and pub_el.text else ""

        doi_el = entry.find("arxiv:doi", ns)
        doi = doi_el.text.strip() if doi_el is not None and doi_el.text else ""

        pdf_url = None
        for link in entry.findall("atom:link", ns):
            if link.attrib.get("title") == "pdf":
                pdf_url = link.attrib.get("href").replace("http://", "https://") + ".pdf"
                break

        if pdf_url:
            papers.append({"title": title, "year": year, "url": pdf_url, "doi": doi, "source": "arxiv"})

    return papers


def fetch_semantic_scholar(query, limit):
    print("\n--- Querying Semantic Scholar ---")
    base_url = "https://api.semanticscholar.org/graph/v1/paper/search?"
    # Over-query because many results lack an openAccessPdf, but respect the cap.
    query_limit = min(S2_MAX_LIMIT, limit * 2)
    encoded = urllib.parse.quote(query)
    url = (
        f"{base_url}query={encoded}&limit={query_limit}"
        "&fields=title,year,openAccessPdf,externalIds"
    )

    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        response = urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT)
        data = json.loads(response.read())
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print("      -> [WARNING] Semantic Scholar API rate limit exceeded. Skipping this source.")
        else:
            print(f"      -> Error querying Semantic Scholar: {e}")
        return []
    except Exception as e:
        print(f"      -> Error querying Semantic Scholar: {e}")
        return []

    papers = []
    for item in data.get("data", []):
        if len(papers) >= limit:
            break

        # Accept any open-access PDF URL — not only those ending in '.pdf'.
        # download_pdf() validates the payload, so landing pages are filtered
        # at download time instead of dropping most OA hits up front.
        open_access = item.get("openAccessPdf") or {}
        url_str = open_access.get("url")
        if url_str:
            papers.append(
                {
                    "title": (item.get("title") or "Unknown Title").strip(),
                    "year": str(item.get("year") or ""),
                    "url": url_str,
                    "doi": (item.get("externalIds") or {}).get("DOI", "") or "",
                    "source": "s2",
                }
            )

    return papers


def fetch_pubmed(query, limit):
    print("\n--- Querying Europe PMC (PubMed Open Access) ---")
    base_url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?"
    encoded = urllib.parse.quote(f"({query}) AND OPEN_ACCESS:Y")
    page_size = min(EPMC_MAX_PAGE_SIZE, limit * 2)
    url = f"{base_url}query={encoded}&resultType=core&format=json&pageSize={page_size}"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        response = urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT)
        data = json.loads(response.read())
    except Exception as e:
        print(f"Error querying Europe PMC: {e}")
        return []

    papers = []
    for result in data.get("resultList", {}).get("result", []):
        if len(papers) >= limit:
            break

        pdf_url = None
        for ft_url in result.get("fullTextUrlList", {}).get("fullTextUrl", []):
            if ft_url.get("documentStyle") == "pdf":
                pdf_url = ft_url.get("url")
                break

        if pdf_url:
            papers.append(
                {
                    "title": (result.get("title") or "Unknown Title").strip(),
                    "year": str(result.get("pubYear") or ""),
                    "url": pdf_url,
                    "doi": result.get("doi", "") or "",
                    "source": "pmc",
                }
            )

    return papers


def parse_strategy(path):
    """Best-effort: derive a query from a Phase 0 settings/search-strategy.md.

    Reuses the source-agnostic Concept Blocks to build a Boolean query: terms
    OR'd within a block, blocks AND'd together. A new block starts at each
    bullet / sub-header / numbered item; continuation lines (e.g. a term list
    that wraps) fold into the current block so OR-alternatives are not promoted
    to AND-requirements. Lines documenting *excluded* terms are skipped so they
    never become required clauses. Falls back to the Research Question line.
    Returns None if nothing usable is found.

    Note: Europe PMC honors the Boolean query fully; Semantic Scholar and arXiv
    treat it more loosely as a relevance query. This intentionally executes only
    the *open-access slice* of the documented strategy — it does not replace
    running the full per-database searches yourself.
    """
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    blocks = []      # list of term-lists, one per concept block
    current = None   # term-list currently being accumulated
    in_blocks = False

    def flush():
        nonlocal current
        if current:
            blocks.append(current)
        current = None

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("## "):
            flush()
            in_blocks = stripped.lower().startswith("## concept blocks")
            continue
        if not in_blocks or not stripped:
            continue

        # A bullet, sub-header, or numbered item starts a new concept block;
        # anything else is a continuation that folds into the current block.
        is_new_block = stripped.startswith(("-", "*", "+", "###")) or bool(
            re.match(r"^\d+[.)]\s", stripped)
        )
        if is_new_block:
            flush()
            current = []

        # Documented exclusions must never become required terms.
        if "exclud" in stripped.lower():
            if is_new_block:
                current = None
            continue

        terms = re.findall(r'"([^"]+)"', line)
        if terms:
            if current is None:
                current = []
            current.extend(terms)

    flush()

    clauses = []
    for terms in blocks:
        seen, uniq = set(), []
        for t in terms:
            if t.lower() not in seen:
                seen.add(t.lower())
                uniq.append(t)
        clauses.append("(" + " OR ".join(f'"{t}"' for t in uniq) + ")")

    if clauses:
        return " AND ".join(clauses)

    match = re.search(r"##\s*Research Question\s*\n+(.+)", text)
    if match:
        return match.group(1).strip()

    return None


def interleave(lists):
    """Round-robin merge of per-source candidate lists.

    Interleaving (rather than concatenating) keeps any single source from
    dominating the candidate order, so one source's landing-page links can't
    crowd out another source's valid PDFs once the success cap is applied.
    """
    merged = []
    for group in zip_longest(*lists):
        for item in group:
            if item is not None:
                merged.append(item)
    return merged


def dedupe(candidates):
    """Drop duplicate papers, keying on DOI *and* normalized title.

    Registering both keys for every kept paper catches the same paper arriving
    from two sources when only one copy carries a DOI. (Trade-off: two
    genuinely different papers with byte-identical normalized titles would
    collapse — rare for real, specific titles.)
    """
    seen = set()
    deduped = []
    for p in candidates:
        keys = []
        if p.get("doi"):
            keys.append("doi:" + p["doi"].lower().strip())
        title_key = re.sub(r"[^\w]", "", p["title"].lower())
        if title_key:
            keys.append("title:" + title_key)
        if not keys or any(k in seen for k in keys):
            continue
        seen.update(keys)
        deduped.append(p)
    return deduped


def write_manifest(output_dir, rows):
    """Append rows to the manifest, returning the path actually written.

    If a manifest with an incompatible header already exists (schema drift
    across versions), write a fresh sibling file instead of corrupting the old
    one.
    """
    path = os.path.join(output_dir, MANIFEST_NAME)
    if os.path.exists(path):
        with open(path, "r", newline="", encoding="utf-8") as f:
            existing_header = f.readline().rstrip("\r\n")
        if existing_header and existing_header != ",".join(MANIFEST_FIELDS):
            path, name = unique_path(output_dir, MANIFEST_NAME)
            print(f"      -> Manifest schema changed; writing '{name}' to avoid corrupting the existing log.")

    file_exists = os.path.exists(path)
    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=MANIFEST_FIELDS)
        if not file_exists:
            writer.writeheader()
        writer.writerows(rows)
    return path


def gather_pdfs(query, max_papers, source, output_dir="corpus"):
    print(f"Researching query: '{query}'")
    print(f"Target: {max_papers} papers from {source}")

    os.makedirs(output_dir, exist_ok=True)

    # Over-fetch candidates per source so download-time PDF validation has
    # alternatives to fall back on.
    fetch_n = max_papers * OVERFETCH
    source_lists = []
    if source in ["all", "semanticscholar"]:
        source_lists.append(fetch_semantic_scholar(query, fetch_n))
    if source in ["all", "pubmed"]:
        source_lists.append(fetch_pubmed(query, fetch_n))
    if source in ["all", "arxiv"]:
        source_lists.append(fetch_arxiv(query, fetch_n))

    deduped = dedupe(interleave(source_lists))

    if not deduped:
        print("\nNo open-access papers with retrievable PDFs found for this query.")
        return

    print(f"\nFound {len(deduped)} unique open-access candidates. Downloading up to {max_papers}...\n")

    gathered_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    manifest_rows = []
    downloaded = 0
    attempt = 0

    # Cap on *successful* downloads, not on candidates: keep trying alternatives
    # until max_papers PDFs actually land (or candidates run out).
    for p in deduped:
        if downloaded >= max_papers:
            break
        attempt += 1

        base_name = clean_filename(p["title"], p["year"])
        filepath, filename = unique_path(output_dir, base_name)

        print(f"[attempt {attempt}/{len(deduped)} · {downloaded}/{max_papers} kept] ({p['source']}): {p['title']}")
        print(f"      -> {filename}")

        status = download_pdf(p["url"], filepath)
        if status == "downloaded":
            downloaded += 1

        manifest_rows.append(
            {
                "gathered_at": gathered_at,
                "source": p["source"],
                "title": p["title"],
                "year": p["year"],
                "doi": p.get("doi", ""),
                "url": p["url"],
                "filename": filename if status == "downloaded" else "",
                "status": status,
            }
        )

    manifest_path = write_manifest(output_dir, manifest_rows)

    print(f"\n[DONE] Downloaded {downloaded}/{max_papers} PDFs to '{output_dir}/' "
          f"({len(manifest_rows)} attempted).")
    print(f"Provenance (incl. DOIs) recorded in '{manifest_path}'.")


def resolve_query(args, parser):
    """Resolve the search query from an explicit topic or a strategy file."""
    default_strategy = "settings/search-strategy.md"

    if args.strategy:
        if not os.path.exists(args.strategy):
            parser.error(f"strategy file not found: {args.strategy}")
        query = parse_strategy(args.strategy)
        if not query:
            parser.error(f"could not derive a query from {args.strategy}")
        print(f"Derived query from {args.strategy}:\n  {query}\n")
        return query

    if args.topic:
        return args.topic

    # No topic and no --strategy: fall back to the default strategy file if present.
    if os.path.exists(default_strategy):
        query = parse_strategy(default_strategy)
        if query:
            print(f"No topic given; derived query from {default_strategy}:\n  {query}\n")
            return query

    parser.error('provide a TOPIC or --strategy settings/search-strategy.md')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Multi-source open-access PDF gatherer (corpus bootstrap, not the rigorous Phase 0)."
    )
    parser.add_argument("topic", type=str, nargs="?", default=None, help="The research topic to search for")
    parser.add_argument(
        "--strategy",
        type=str,
        nargs="?",
        const="settings/search-strategy.md",
        default=None,
        help="Derive the query from a Phase 0 search-strategy.md (executes its open-access slice). "
        "Use the flag alone to default to settings/search-strategy.md.",
    )
    parser.add_argument("--max-papers", type=int, default=5, help="Maximum number of papers to download")
    parser.add_argument(
        "--source",
        type=str,
        choices=["all", "arxiv", "semanticscholar", "pubmed"],
        default="all",
        help="Academic database to query",
    )
    parser.add_argument("--dir", type=str, default="corpus", help="Output directory")

    args = parser.parse_args()
    if args.max_papers < 1:
        parser.error("--max-papers must be a positive integer")
    query = resolve_query(args, parser)
    gather_pdfs(query, args.max_papers, args.source, args.dir)
