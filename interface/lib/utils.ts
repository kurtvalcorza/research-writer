import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import path from "path";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Validates and resolves a relative path, ensuring it stays within allowed directories.
 * Prevents path traversal attacks by normalizing paths and checking boundaries.
 *
 * @param relativePath - The relative path to validate
 * @param allowedDirs - Single allowed directory or array of allowed root directories
 * @param projectRoot - The project root directory to resolve against
 * @returns The resolved absolute path if valid, null otherwise
 *
 * @example
 * // Single allowed directory
 * validatePath("quick-start/prompt.md", "quick-start", "/app")
 *
 * @example
 * // Multiple allowed directories
 * validatePath("settings/config.json", ["settings", "outputs"], "/app")
 */
export function validatePath(
    relativePath: string,
    allowedDirs: string | string[],
    projectRoot: string
): string | null {
    // Normalize and remove leading path traversal sequences
    const normalized = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, "");

    // Convert allowedDirs to array for uniform handling
    const allowedDirArray = Array.isArray(allowedDirs) ? allowedDirs : [allowedDirs];

    // Get the root directory from the normalized path
    const rootDir = normalized.split(path.sep)[0];

    // Check if the path starts with an allowed directory
    const allowedDir = allowedDirArray.find(dir =>
        normalized === dir || normalized.startsWith(dir + path.sep)
    );

    if (!allowedDir) {
        return null;
    }

    // Resolve full paths
    const fullPath = path.resolve(projectRoot, normalized);
    const allowedPath = path.resolve(projectRoot, allowedDir);

    // Ensure resolved path is within allowed directory
    if (!fullPath.startsWith(allowedPath + path.sep) && fullPath !== allowedPath) {
        return null;
    }

    return fullPath;
}
