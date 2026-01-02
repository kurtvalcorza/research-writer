"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-8">
                    <Card className="max-w-md p-8 space-y-6 text-center">
                        <div className="flex justify-center">
                            <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                Something went wrong
                            </h2>
                            <p className="text-muted-foreground">
                                An unexpected error occurred. Please try refreshing the page.
                            </p>
                        </div>

                        {this.state.error && (
                            <details className="text-left">
                                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                    Error details
                                </summary>
                                <pre className="mt-2 p-4 bg-black/20 rounded-lg text-xs overflow-auto max-h-40">
                                    {this.state.error.message}
                                    {"\n\n"}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                variant="secondary"
                            >
                                Try Again
                            </Button>
                            <Button onClick={() => window.location.href = "/"} variant="primary">
                                Go Home
                            </Button>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook-based alternative for functional components
export function useErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return setError;
}
