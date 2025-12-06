import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Swords, Star, Zap, ChevronRight, AlertCircle } from 'lucide-react';
import { fetchBrawlers, getBrawlerImageUrl } from '@/lib/brawlstars-client';

export const metadata: Metadata = {
    title: 'Brawlers Database',
    description: 'Explore all Brawl Stars brawlers with their abilities, star powers, and gadgets',
};

// Rarity classification based on brawler IDs (approximate, as API doesn't provide rarity)
const brawlerRarities: Record<number, string> = {
    16000000: 'Starting', // Shelly
    16000001: 'Trophy Road',
    16000002: 'Trophy Road',
    16000003: 'Trophy Road',
    16000004: 'Super Rare',
    16000005: 'Legendary',
    16000006: 'Rare',
    16000007: 'Trophy Road',
    16000008: 'Trophy Road',
    16000009: 'Trophy Road',
    16000010: 'Rare',
    16000011: 'Mythic',
    16000012: 'Legendary',
    16000013: 'Rare',
    16000014: 'Trophy Road',
    16000015: 'Epic',
    16000016: 'Epic',
    16000017: 'Mythic',
    16000018: 'Super Rare',
    16000019: 'Super Rare',
    16000020: 'Epic',
    16000021: 'Mythic',
    16000022: 'Super Rare',
    16000023: 'Legendary',
};

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
    'Starting': { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' },
    'Trophy Road': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
    'Rare': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
    'Super Rare': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
    'Epic': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
    'Mythic': { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
    'Legendary': { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
    'Chromatic': { bg: 'bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-blue-500/20', text: 'text-white', border: 'border-pink-500/30' },
};

export default async function BrawlersPage() {
    let brawlers;
    let error = null;

    try {
        const response = await fetchBrawlers();
        brawlers = response.items;
    } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to fetch brawlers';
    }

    if (error || !brawlers) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Failed to Load Brawlers</h1>
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
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <Swords className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Brawlers</h1>
                                <p className="text-slate-400">Explore all {brawlers.length} brawlers in the game</p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="glass-card p-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search brawlers..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium transition-colors">
                                    All
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-lg text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors">
                                    Legendary
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-lg text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors">
                                    Mythic
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-lg text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors">
                                    <Filter className="w-4 h-4" />
                                    More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Brawler Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {brawlers.map((brawler, index) => {
                            const rarity = brawlerRarities[brawler.id] || 'Epic';
                            const colors = rarityColors[rarity] || rarityColors['Epic'];

                            return (
                                <Link
                                    key={brawler.id}
                                    href={`/brawlers/${brawler.id}`}
                                    className="group relative bg-slate-800/50 hover:bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-fade-in"
                                    style={{ animationDelay: `${0.1 + index * 0.02}s` }}
                                >
                                    {/* Brawler Image */}
                                    <div className="relative aspect-square p-4 bg-gradient-to-b from-transparent to-slate-900/50">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={getBrawlerImageUrl(brawler.id)}
                                                alt={brawler.name}
                                                fill
                                                className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 space-y-2">
                                        <h3 className="font-bold text-white text-center group-hover:text-purple-300 transition-colors">
                                            {brawler.name}
                                        </h3>

                                        {/* Rarity Badge */}
                                        <div className="flex justify-center">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                {rarity}
                                            </span>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-amber-400" />
                                                <span>{brawler.starPowers?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Zap className="w-3 h-3 text-cyan-400" />
                                                <span>{brawler.gadgets?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-5 h-5 text-purple-400" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}
