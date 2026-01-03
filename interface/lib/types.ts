// File statistics interface
export interface FileStat {
    name: string;
    size: number;
    modified: string;
    mtime: string;
}

// Files response interface
export interface FilesResponse {
    files: FileStat[];
    total: number;
}

// Content response interface
export interface ContentResponse {
    content: string;
    path?: string;
}

// Dashboard statistics interface
export interface DashboardStats {
    corpusCount: number;
    completedPhases: string[];
}
