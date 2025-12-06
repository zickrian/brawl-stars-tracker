import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, AlertCircle, Search, Filter } from 'lucide-react';
import { fetchGameModes, getModeIconUrl } from '@/lib/brawlstars-client';

export const metadata: Metadata = {
    title: 'Game Modes',
    description: 'Explore all available Brawl Stars game modes',
};

export default async function GameModesPage() {
    let modes;
    let error = null;

    try {
        const response = await fetchGameModes();
        modes = response.items;
    } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to fetch game modes';
    }

    if (error || !modes) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Failed to Load Game Modes</h1>
                            <p className="text-slate-400 mb-6">{error}</p>
                            <Link href="/" className="btn btn-primary">
                                Go Back Home
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Gamepad2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Game Modes</h1>
                                <p className="text-slate-400">Explore all {modes.length} game modes available in Brawl Stars</p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters (Visual only for now) */}
                    <div className="glass-card p-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search game modes..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium transition-colors">
                                    All
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-lg text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors">
                                    3v3
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-lg text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors">
                                    Solo/Duo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {modes.map((mode, index) => (
                            <div
                                key={mode.id}
                                className="group glass-card p-6 hover:border-indigo-500/50 transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
                                        {/* Since API doesn't guarantee icon URL, we use a generic method or fallback */}
                                        <div className="relative w-12 h-12">
                                            <Image
                                                src={getModeIconUrl(mode.name)}
                                                alt={mode.name}
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-slate-500">ID: {mode.id}</div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {mode.name}
                                </h3>
                                <div className="w-full h-1 bg-slate-800/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500/50 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
