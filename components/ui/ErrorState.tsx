import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
    title?: string;
    message?: string;
    showRetry?: boolean;
    showHome?: boolean;
    showBack?: boolean;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Something went wrong',
    message = 'We encountered an error while loading the data. Please try again.',
    showRetry = true,
    showHome = true,
    showBack = false,
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Error Icon */}
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={40} className="text-red-400" />
                </div>
                <div
                    className="absolute inset-0 blur-2xl opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Error Text */}
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-slate-400 max-w-md mb-8">{message}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
                {showBack && (
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-secondary"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                )}

                {showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        className="btn btn-secondary"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </button>
                )}

                {showHome && (
                    <Link href="/" className="btn btn-primary">
                        <Home size={18} />
                        Back to Home
                    </Link>
                )}
            </div>
        </div>
    );
}

// Not Found specific error
export function NotFoundError({ type = 'Player' }: { type?: string }) {
    return (
        <ErrorState
            title={`${type} Not Found`}
            message={`The ${type.toLowerCase()} you're looking for doesn't exist or the tag might be incorrect. Please check and try again.`}
            showBack
        />
    );
}

// Rate Limit Error
export function RateLimitError() {
    return (
        <ErrorState
            title="Too Many Requests"
            message="We've hit the API rate limit. Please wait a moment and try again."
            showRetry
        />
    );
}

// API Key Error
export function ApiKeyError() {
    return (
        <ErrorState
            title="Configuration Error"
            message="The API key is not configured properly. Please contact the administrator."
            showRetry={false}
        />
    );
}
