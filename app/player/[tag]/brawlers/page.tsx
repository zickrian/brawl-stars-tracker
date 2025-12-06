import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Trophy, Star, Zap, ChevronLeft, Swords, Crown,
    ArrowUpDown, Filter, Award, Shield
} from 'lucide-react';
import { fetchPlayer, getPlayerIconUrl, formatNumber, parseNameColor, getRankColor, getBrawlerImageUrl } from '@/lib/brawlstars-client';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    return {
        title: `Brawlers - Player #${tag}`,
        description: `View all brawlers for player #${tag}`,
    };
}

export default async function PlayerBrawlersPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;

    let player;
    let error = null;

    try {
        player = await fetchPlayer(tag);
    } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to fetch player data';
    }

    if (error || !player) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <Swords className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Could Not Load Brawlers</h1>
                            <p className="text-slate-400 mb-6">{error}</p>
                            <Link href={`/player/${tag}`} className="btn btn-primary">
                                Back to Profile
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const nameColor = parseNameColor(player.nameColor);

    // Sort brawlers by trophies
    const sortedBrawlers = [...player.brawlers].sort((a, b) => b.trophies - a.trophies);

    // Calculate stats
    const totalTrophies = player.brawlers.reduce((acc, b) => acc + b.trophies, 0);
    const maxedBrawlers = player.brawlers.filter(b => b.power === 11).length;
    const rank25Plus = player.brawlers.filter(b => b.rank >= 25).length;
    const rank30Plus = player.brawlers.filter(b => b.rank >= 30).length;
    const avgTrophies = Math.round(totalTrophies / player.brawlers.length);

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Navigation */}
                    <Link
                        href={`/player/${tag}`}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Profile
                    </Link>

                    {/* Header */}
                    <div className="glass-card p-6 mb-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800">
                                <Image
                                    src={getPlayerIconUrl(player.icon.id)}
                                    alt={player.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold mb-1" style={{ color: nameColor }}>
                                    {player.name}&apos;s Brawlers
                                </h1>
                                <p className="text-slate-400">
                                    {player.brawlers.length} brawlers unlocked • {formatNumber(totalTrophies)} total trophies
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Swords className="w-4 h-4 text-purple-400" />
                                Brawlers
                            </div>
                            <div className="text-2xl font-bold text-white">{player.brawlers.length}</div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                Avg Trophies
                            </div>
                            <div className="text-2xl font-bold text-white">{avgTrophies}</div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Star className="w-4 h-4 text-cyan-400" />
                                Maxed
                            </div>
                            <div className="text-2xl font-bold text-white">{maxedBrawlers}</div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.25s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Award className="w-4 h-4 text-red-400" />
                                Rank 25+
                            </div>
                            <div className="text-2xl font-bold text-white">{rank25Plus}</div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Crown className="w-4 h-4 text-pink-400" />
                                Rank 30+
                            </div>
                            <div className="text-2xl font-bold text-white">{rank30Plus}</div>
                        </div>
                    </div>

                    {/* Brawlers Grid */}
                    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Swords className="w-5 h-5 text-purple-400" />
                                All Brawlers
                            </h2>
                            <div className="text-sm text-slate-400">
                                Sorted by Trophies
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {sortedBrawlers.map((brawler, index) => (
                                <div
                                    key={brawler.id}
                                    className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/80 transition-colors animate-fade-in"
                                    style={{ animationDelay: `${0.4 + index * 0.02}s` }}
                                >
                                    {/* Brawler Image */}
                                    <div className="relative w-full aspect-square mb-3">
                                        <Image
                                            src={getBrawlerImageUrl(brawler.id)}
                                            alt={brawler.name}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                        {/* Power Level Badge */}
                                        <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-lg text-xs font-bold ${brawler.power === 11 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900' : 'bg-slate-700 text-white'}`}>
                                            P{brawler.power}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="font-bold text-white text-sm text-center truncate mb-2">
                                        {brawler.name}
                                    </h3>

                                    {/* Trophies */}
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-amber-400 font-bold text-sm">{brawler.trophies}</span>
                                    </div>

                                    {/* Rank */}
                                    <div
                                        className="text-center text-xs font-medium"
                                        style={{ color: getRankColor(brawler.rank) }}
                                    >
                                        Rank {brawler.rank}
                                    </div>

                                    {/* Star Powers & Gadgets */}
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        {brawler.starPowers.length > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                <Star className="w-3 h-3 text-amber-400" />
                                                <span className="text-xs text-slate-400">{brawler.starPowers.length}</span>
                                            </div>
                                        )}
                                        {brawler.gadgets.length > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                <Zap className="w-3 h-3 text-green-400" />
                                                <span className="text-xs text-slate-400">{brawler.gadgets.length}</span>
                                            </div>
                                        )}
                                        {brawler.gears.length > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                <Shield className="w-3 h-3 text-purple-400" />
                                                <span className="text-xs text-slate-400">{brawler.gears.length}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
