import { Navbar } from '@/components/ui/Navbar';
import { SearchBar } from '@/components/ui/SearchBar';
import { Metadata } from 'next';
import { Users, Search } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Player Search',
    description: 'Search for Brawl Stars players by tag',
};

export default function PlayerSearchPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-8 shadow-lg shadow-amber-500/20">
                        <Users className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Find Player Stats
                    </h1>

                    <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                        Enter a player tag to view detailed statistics, brawlers, battle logs, and trophy graphs.
                    </p>

                    <div className="bg-slate-800/50 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <SearchBar
                            placeholder="Enter player tag (e.g. #2PP)"
                            size="lg"
                            className="w-full"
                            autoFocus
                        />
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Live Updates
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            Accurate Stats
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            Battle History
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
