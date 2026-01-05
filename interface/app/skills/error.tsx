"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // In production, log the error to an error reporting service (e.g., Sentry)
        // Example: errorReportingService.captureException(error);
    }, [error]);

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center bg-background text-foreground">
            <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md">
                We encountered an error while loading the prompt library.
            </p>
            <p className="text-xs font-mono bg-muted px-2 py-1 rounded text-red-400">
                {error.message}
            </p>
            <Button onClick={reset} variant="primary">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try again
            </Button>
        </div>
    );
}
