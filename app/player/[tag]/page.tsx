import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Trophy, Star, Zap, Users, Crown, TrendingUp,
    Medal, Target, Clock, Swords, ChevronRight,
    History, BarChart3, Shield, Award, AlertCircle
} from 'lucide-react';
import { fetchPlayer, fetchPlayerBattlelog, getPlayerIconUrl, formatNumber, parseNameColor, getRankColor, getBrawlerImageUrl } from '@/lib/brawlstars-client';
import { TrophyGraph } from '@/components/player/TrophyGraph';
import { Battle } from '@/lib/types';

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    return {
        title: `Player #${tag}`,
        description: `View statistics and brawlers for player #${tag}`,
    };
}

export default async function PlayerPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;

    let player;
    let battlelog: Battle[] = [];
    let error = null;

    try {
        const [playerData, battlelogData] = await Promise.all([
            fetchPlayer(tag),
            fetchPlayerBattlelog(tag).catch(() => ({ items: [] })) // Fail gracefully for battlelog
        ]);
        player = playerData;
        battlelog = battlelogData.items || [];
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
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Player Not Found</h1>
                            <p className="text-slate-400 mb-6">
                                {error || `Could not find player with tag #${tag}`}
                            </p>
                            <Link href="/" className="btn btn-primary">
                                Go Back Home
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const nameColor = parseNameColor(player.nameColor);

    // Calculate stats
    const totalVictories = player.soloVictories + player.duoVictories + player['3vs3Victories'];
    const maxedBrawlers = player.brawlers.filter(b => b.power === 11).length;
    const avgTrophies = Math.round(player.brawlers.reduce((acc, b) => acc + b.trophies, 0) / player.brawlers.length);
    const rank25Plus = player.brawlers.filter(b => b.rank >= 25).length;

    // Sort brawlers by trophies for display
    const sortedBrawlers = [...player.brawlers].sort((a, b) => b.trophies - a.trophies);

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Profile Header */}
                    <div className="glass-card p-6 sm:p-8 mb-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            {/* Player Icon */}
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-800 ring-4 ring-amber-500/30">
                                    <Image
                                        src={getPlayerIconUrl(player.icon.id)}
                                        alt={player.name}
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                {/* Level Badge */}
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl px-3 py-1 text-sm font-bold text-white shadow-lg">
                                    Lv.{player.expLevel}
                                </div>
                            </div>

                            {/* Player Info */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1
                                        className="text-3xl sm:text-4xl font-bold"
                                        style={{ color: nameColor }}
                                    >
                                        {player.name}
                                    </h1>
                                    {player.isQualifiedFromChampionshipChallenge && (
                                        <div className="badge badge-gold">
                                            <Crown className="w-4 h-4" />
                                            Champion
                                        </div>
                                    )}
                                </div>

                                <p className="text-slate-500 text-lg mb-4">#{tag}</p>

                                {/* Club Link */}
                                {player.club && (
                                    <Link
                                        href={`/club/${player.club.tag.replace('#', '')}`}
                                        className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-xl text-white border border-slate-700 hover:border-cyan-500/50 transition-all group"
                                    >
                                        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                                            <Shield className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Club</span>
                                            <span className="font-bold text-lg leading-none group-hover:text-cyan-300 transition-colors">{player.club.name}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 ml-2 transition-colors" />
                                    </Link>
                                )}
                            </div>

                            {/* Trophy Display */}
                            <div className="flex flex-col items-center p-5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl">
                                <Trophy className="w-8 h-8 text-amber-400 mb-2" />
                                <div className="text-3xl sm:text-4xl font-bold text-gradient-gold">
                                    {formatNumber(player.trophies)}
                                </div>
                                <div className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Highest: {formatNumber(player.highestTrophies)}
                                </div>
                            </div>
                        </div>

                        {/* Trophy Graph */}
                        <div className="mt-6 border-t border-slate-700/50 pt-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                                Recent Trophy Trend
                            </h3>
                            <TrophyGraph battlelog={battlelog} currentTrophies={player.trophies} />
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Medal className="w-4 h-4 text-amber-400" />
                                Total Victories
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {formatNumber(totalVictories)}
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Swords className="w-4 h-4 text-purple-400" />
                                Brawlers
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {player.brawlers.length}
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Star className="w-4 h-4 text-cyan-400" />
                                Maxed
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {maxedBrawlers}
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.25s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Award className="w-4 h-4 text-red-400" />
                                Rank 25+
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {rank25Plus}
                            </div>
                        </div>
                    </div>

                    {/* Victory Breakdown */}
                    <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            Victory Breakdown
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <span className="font-medium text-white">Solo</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">{formatNumber(player.soloVictories)}</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-500"
                                        style={{ width: `${totalVictories > 0 ? (player.soloVictories / totalVictories) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <span className="font-medium text-white">Duo</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">{formatNumber(player.duoVictories)}</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${totalVictories > 0 ? (player.duoVictories / totalVictories) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <span className="font-medium text-white">3v3</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">{formatNumber(player['3vs3Victories'])}</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                        style={{ width: `${totalVictories > 0 ? (player['3vs3Victories'] / totalVictories) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <Link
                            href={`/player/${tag}/brawlers`}
                            className="glass-card p-6 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 group animate-fade-in"
                            style={{ animationDelay: '0.35s' }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Swords className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">Brawlers</h3>
                                    <p className="text-slate-500 text-sm">{player.brawlers.length} brawlers unlocked</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                            </div>
                        </Link>

                        <Link
                            href={`/player/${tag}/battlelog`}
                            className="glass-card p-6 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 group animate-fade-in"
                            style={{ animationDelay: '0.4s' }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <History className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors">Battle Log</h3>
                                    <p className="text-slate-500 text-sm">Recent matches history</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                            </div>
                        </Link>

                        <Link
                            href={`/player/${tag}/progress`}
                            className="glass-card p-6 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-300 group animate-fade-in"
                            style={{ animationDelay: '0.45s' }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors">Progress</h3>
                                    <p className="text-slate-500 text-sm">Trophy tracking charts</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                            </div>
                        </Link>
                    </div>

                    {/* Special Mode Stats */}
                    <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-400" />
                            Special Mode Records
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm">Best Robo Rumble Time</div>
                                    <div className="text-xl font-bold text-white">{formatTime(player.bestRoboRumbleTime)}</div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm">Best Big Brawler Time</div>
                                    <div className="text-xl font-bold text-white">{formatTime(player.bestTimeAsBigBrawler)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Brawlers Preview */}
                    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.55s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Swords className="w-5 h-5 text-purple-400" />
                                Top Brawlers
                            </h2>
                            <Link
                                href={`/player/${tag}/brawlers`}
                                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {sortedBrawlers.slice(0, 5).map((brawler, index) => (
                                <div
                                    key={brawler.id}
                                    className="bg-slate-800/50 rounded-xl p-3 text-center hover:bg-slate-800/80 transition-colors"
                                    style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                                >
                                    <div className="relative w-16 h-16 mx-auto mb-2">
                                        <Image
                                            src={getBrawlerImageUrl(brawler.id)}
                                            alt={brawler.name}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="font-medium text-white text-sm truncate">{brawler.name}</div>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <Trophy className="w-3 h-3 text-amber-400" />
                                        <span className="text-amber-400 text-sm font-bold">{brawler.trophies}</span>
                                    </div>
                                    <div
                                        className="text-xs font-medium mt-0.5"
                                        style={{ color: getRankColor(brawler.rank) }}
                                    >
                                        Rank {brawler.rank}
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
