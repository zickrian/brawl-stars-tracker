import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
    const sizes = {
        sm: { spinner: 24, text: 'text-sm' },
        md: { spinner: 40, text: 'text-base' },
        lg: { spinner: 56, text: 'text-lg' },
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="relative">
                <Loader2
                    size={sizes[size].spinner}
                    className="animate-spin text-cyan-400"
                />
                <div
                    className="absolute inset-0 blur-xl opacity-50"
                    style={{
                        background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)',
                    }}
                />
            </div>
            <p className={`${sizes[size].text} text-slate-400`}>{message}</p>
        </div>
    );
}

// Skeleton components for loading states
export function SkeletonText({ className = '' }: { className?: string }) {
    return (
        <div className={`skeleton h-4 rounded ${className}`} />
    );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`skeleton rounded-xl ${className}`}>
            <div className="p-6 space-y-4 opacity-0">
                <div className="h-4 w-3/4" />
                <div className="h-4 w-1/2" />
                <div className="h-8 w-full" />
            </div>
        </div>
    );
}

export function SkeletonProfileCard() {
    return (
        <div className="glass-card p-6 animate-pulse">
            <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-xl bg-slate-700/50" />
                <div className="flex-1 space-y-3">
                    <div className="h-8 w-48 bg-slate-700/50 rounded" />
                    <div className="h-4 w-32 bg-slate-700/50 rounded" />
                    <div className="h-6 w-40 bg-slate-700/50 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-700/50 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

export function SkeletonBrawlerGrid() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-800/50 animate-pulse" />
            ))}
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            <div className="h-12 bg-slate-800/50 rounded-t-lg animate-pulse" />
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-800/30 animate-pulse" />
            ))}
        </div>
    );
}
