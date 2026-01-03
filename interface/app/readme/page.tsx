import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

export default function ReadmePage() {
    const readmePath = path.join(process.cwd(), "..", "README.md");
    let content = "";

    try {
        content = fs.readFileSync(readmePath, "utf-8");
    } catch (error) {
        content = "# Error\n\nCould not load README.md";
    }

    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center space-x-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Documentation</h1>
                        <p className="text-muted-foreground">Project README</p>
                    </div>
                </header>

                <div className="prose dark:prose-invert max-w-none p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="leading-7 mb-4" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                            a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
                            code: ({ node, ...props }) => {
                                // Check if inline
                                const inline = props.className ? false : true;
                                return inline
                                    ? <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                                    : <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto my-4" {...props} />
                            },
                            pre: ({ node, ...props }) => <pre className="bg-transparent p-0 border-none m-0" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4" {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
