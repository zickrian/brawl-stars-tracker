import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Swords, Star, Zap, ChevronLeft, Trophy, Users, Crown,
    AlertCircle, ChevronRight
} from 'lucide-react';
import { fetchBrawler, fetchBrawlerRankings, getBrawlerImageUrl, getPlayerIconUrl, formatNumber, parseNameColor } from '@/lib/brawlstars-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Brawler #${id}`,
        description: `View detailed information about brawler #${id}`,
    };
}

export default async function BrawlerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const brawlerId = parseInt(id);

    let brawler;
    let topPlayers;
    let error = null;

    try {
        brawler = await fetchBrawler(brawlerId);
        const rankingsResponse = await fetchBrawlerRankings('global', brawlerId);
        topPlayers = rankingsResponse.items.slice(0, 10);
    } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to fetch brawler data';
    }

    if (error || !brawler) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Brawler Not Found</h1>
                            <p className="text-slate-400 mb-6">{error || `Could not find brawler with ID ${id}`}</p>
                            <Link href="/brawlers" className="btn btn-primary">
                                <ChevronLeft className="w-4 h-4" />
                                Back to Brawlers
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
                    {/* Back Link */}
                    <Link
                        href="/brawlers"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Brawlers
                    </Link>

                    {/* Brawler Header */}
                    <div className="glass-card p-6 sm:p-8 mb-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Brawler Image */}
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                                <Image
                                    src={getBrawlerImageUrl(brawler.id)}
                                    alt={brawler.name}
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    unoptimized
                                />
                            </div>

                            {/* Brawler Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                    {brawler.name}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg">
                                        <Star className="w-5 h-5" />
                                        <span className="font-medium">{brawler.starPowers?.length || 0} Star Powers</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
                                        <Zap className="w-5 h-5" />
                                        <span className="font-medium">{brawler.gadgets?.length || 0} Gadgets</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Star Powers */}
                        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-400" />
                                Star Powers
                            </h2>

                            {brawler.starPowers && brawler.starPowers.length > 0 ? (
                                <div className="space-y-3">
                                    {brawler.starPowers.map((sp) => (
                                        <div
                                            key={sp.id}
                                            className="p-4 bg-slate-800/50 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                                    <Star className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{sp.name}</h3>
                                                    <p className="text-sm text-slate-400">ID: {sp.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-center py-8">No star powers available</p>
                            )}
                        </div>

                        {/* Gadgets */}
                        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-cyan-400" />
                                Gadgets
                            </h2>

                            {brawler.gadgets && brawler.gadgets.length > 0 ? (
                                <div className="space-y-3">
                                    {brawler.gadgets.map((gadget) => (
                                        <div
                                            key={gadget.id}
                                            className="p-4 bg-slate-800/50 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                                    <Zap className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{gadget.name}</h3>
                                                    <p className="text-sm text-slate-400">ID: {gadget.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-center py-8">No gadgets available</p>
                            )}
                        </div>
                    </div>

                    {/* Top Players */}
                    {topPlayers && topPlayers.length > 0 && (
                        <div className="glass-card mt-6 overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-400" />
                                    Top Players - Global
                                </h2>
                            </div>

                            <div className="divide-y divide-slate-800/50">
                                {topPlayers.map((player, index) => {
                                    const nameColor = parseNameColor(player.nameColor);

                                    return (
                                        <Link
                                            key={player.tag}
                                            href={`/player/${player.tag.replace('#', '')}`}
                                            className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors group"
                                        >
                                            {/* Rank */}
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${index === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900' :
                                                    index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900' :
                                                        index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' :
                                                            'bg-slate-700/50 text-slate-300'
                                                }`}>
                                                {index + 1}
                                            </div>

                                            {/* Player Info */}
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                                                <Image
                                                    src={getPlayerIconUrl(player.icon.id)}
                                                    alt={player.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4
                                                    className="font-bold truncate group-hover:opacity-80 transition-opacity"
                                                    style={{ color: nameColor }}
                                                >
                                                    {player.name}
                                                </h4>
                                                <p className="text-xs text-slate-500">{player.club?.name || 'No Club'}</p>
                                            </div>

                                            {/* Trophies */}
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-4 h-4 text-amber-400" />
                                                <span className="font-bold text-white">{formatNumber(player.trophies)}</span>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
