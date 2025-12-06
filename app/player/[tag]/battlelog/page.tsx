'use client';

import { Navbar } from '@/components/ui/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import {
    Trophy, ChevronLeft, Swords, Clock, Target,
    TrendingUp, TrendingDown, Minus, Star, Users,
    RefreshCw, AlertCircle, Crown
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatNumber, getBrawlerImageUrl } from '@/lib/brawlstars-client';

interface BattlePlayer {
    tag: string;
    name: string;
    brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
    };
}

interface Battle {
    battleTime: string;
    event: {
        id: number;
        mode: string;
        map: string;
    };
    battle: {
        mode?: string;
        type?: string;
        result?: 'victory' | 'defeat' | 'draw';
        duration?: number;
        trophyChange?: number;
        starPlayer?: BattlePlayer;
        teams?: BattlePlayer[][];
        players?: BattlePlayer[];
    };
}

// Mode icon URL from CDN
function getModeIconUrl(mode: string): string {
    const modeMap: Record<string, string> = {
        'gemGrab': 'Gem-Grab',
        'brawlBall': 'Brawl-Ball',
        'heist': 'Heist',
        'bounty': 'Bounty',
        'siege': 'Siege',
        'hotZone': 'Hot-Zone',
        'knockout': 'Knockout',
        'duels': 'Duels',
        'showdown': 'Showdown',
        'soloShowdown': 'Solo-Showdown',
        'duoShowdown': 'Duo-Showdown',
        'wipeout': 'Wipeout',
        'payload': 'Payload',
    };

    const formattedMode = modeMap[mode] || mode.replace(/([A-Z])/g, '-$1').replace(/^-/, '');
    return `https://cdn.brawlify.com/gamemode/${formattedMode}.png`;
}

function formatBattleTime(battleTime: string): string {
    const year = battleTime.substring(0, 4);
    const month = battleTime.substring(4, 6);
    const day = battleTime.substring(6, 8);
    const hour = battleTime.substring(9, 11);
    const minute = battleTime.substring(11, 13);

    const date = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
    ));

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

function formatMode(mode: string): string {
    return mode
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function BattleCard({ battle, playerTag }: { battle: Battle; playerTag: string }) {
    const result = battle.battle.result;
    const trophyChange = battle.battle.trophyChange || 0;

    // Find the player in the battle
    let playerBrawler: BattlePlayer | null = null;

    if (battle.battle.teams) {
        for (const team of battle.battle.teams) {
            for (const player of team) {
                if (player.tag === `#${playerTag}`) {
                    playerBrawler = player;
                    break;
                }
            }
        }
    } else if (battle.battle.players) {
        playerBrawler = battle.battle.players.find(p => p.tag === `#${playerTag}`) || null;
    }

    const getResultStyle = () => {
        if (result === 'victory') return 'border-green-500/30 bg-green-500/5';
        if (result === 'defeat') return 'border-red-500/30 bg-red-500/5';
        return 'border-slate-700/50';
    };

    const getResultBadge = () => {
        if (result === 'victory') return { bg: 'bg-green-500', text: 'Victory', icon: TrendingUp };
        if (result === 'defeat') return { bg: 'bg-red-500', text: 'Defeat', icon: TrendingDown };
        return { bg: 'bg-slate-500', text: 'Draw', icon: Minus };
    };

    const resultBadge = getResultBadge();
    const ResultIcon = resultBadge.icon;

    return (
        <div className={`glass-card p-4 ${getResultStyle()} hover:border-slate-600/50 transition-all`}>
            <div className="flex items-center gap-4">
                {/* Mode Icon */}
                <div className="relative w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
                    <Image
                        src={getModeIconUrl(battle.event.mode || battle.battle.mode || 'unknown')}
                        alt={formatMode(battle.event.mode || 'Unknown')}
                        fill
                        className="object-contain p-2"
                        unoptimized
                    />
                </div>

                {/* Battle Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">
                            {formatMode(battle.event.mode || battle.battle.mode || 'Unknown')}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${resultBadge.bg}`}>
                            {resultBadge.text}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">{battle.event.map || 'Unknown Map'}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatBattleTime(battle.battleTime)}
                        </span>
                        {battle.battle.duration && (
                            <span className="text-xs text-slate-500">
                                {Math.floor(battle.battle.duration / 60)}:{(battle.battle.duration % 60).toString().padStart(2, '0')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Brawler Used */}
                {playerBrawler && (
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                            <Image
                                src={getBrawlerImageUrl(playerBrawler.brawler.id)}
                                alt={playerBrawler.brawler.name}
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    </div>
                )}

                {/* Trophy Change */}
                <div className="text-right">
                    <div className={`flex items-center gap-1 font-bold ${trophyChange > 0 ? 'text-green-400' : trophyChange < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        <ResultIcon className="w-4 h-4" />
                        {trophyChange > 0 ? '+' : ''}{trophyChange}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        trophies
                    </div>
                </div>
            </div>

            {/* Star Player */}
            {battle.battle.starPlayer && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">Star Player:</span>
                    <span className="text-xs text-amber-400 font-medium">{battle.battle.starPlayer.name}</span>
                    <span className="text-xs text-slate-500">({battle.battle.starPlayer.brawler.name})</span>
                </div>
            )}
        </div>
    );
}

export default function PlayerBattlelogPage({ params }: { params: Promise<{ tag: string }> }) {
    const [tag, setTag] = useState<string>('');
    const [battles, setBattles] = useState<Battle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        params.then(p => setTag(p.tag));
    }, [params]);

    const fetchBattlelog = async () => {
        if (!tag) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/battlelog?tag=${tag}`);
            if (!response.ok) {
                throw new Error('Failed to fetch battlelog');
            }
            const data = await response.json();
            setBattles(data.items || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch battlelog');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tag) {
            fetchBattlelog();
        }
    }, [tag]);

    // Calculate stats
    const victories = battles.filter(b => b.battle.result === 'victory').length;
    const defeats = battles.filter(b => b.battle.result === 'defeat').length;
    const totalTrophyChange = battles.reduce((acc, b) => acc + (b.battle.trophyChange || 0), 0);

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                    <Swords className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Battle Log</h1>
                                    <p className="text-slate-400">Recent matches history</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchBattlelog}
                                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    {!loading && !error && battles.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    Victories
                                </div>
                                <div className="text-2xl font-bold text-green-400">{victories}</div>
                            </div>

                            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                    Defeats
                                </div>
                                <div className="text-2xl font-bold text-red-400">{defeats}</div>
                            </div>

                            <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    Trophy Change
                                </div>
                                <div className={`text-2xl font-bold ${totalTrophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {totalTrophyChange >= 0 ? '+' : ''}{totalTrophyChange}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="glass-card p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Failed to Load Battle Log</h2>
                            <p className="text-slate-400 mb-4">{error}</p>
                            <button onClick={fetchBattlelog} className="btn btn-primary">
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="glass-card p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 skeleton rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 skeleton rounded w-1/3" />
                                            <div className="h-4 skeleton rounded w-1/2" />
                                        </div>
                                        <div className="h-8 w-16 skeleton rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Battles List */}
                    {!loading && !error && (
                        <div className="space-y-3">
                            {battles.length === 0 ? (
                                <div className="glass-card p-8 text-center">
                                    <Swords className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <h2 className="text-xl font-bold text-white mb-2">No Recent Battles</h2>
                                    <p className="text-slate-400">This player has no recent battle history</p>
                                </div>
                            ) : (
                                battles.map((battle, index) => (
                                    <div
                                        key={`${battle.battleTime}-${index}`}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                                    >
                                        <BattleCard battle={battle} playerTag={tag} />
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
