'use client';

import { Navbar } from '@/components/ui/Navbar';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    GitCompare, Search, Trophy, Users, Swords,
    Star, Zap, X, Plus, ArrowRight, AlertCircle,
    Loader2, TrendingUp, Medal
} from 'lucide-react';

interface Player {
    tag: string;
    name: string;
    nameColor: string;
    icon: { id: number };
    trophies: number;
    highestTrophies: number;
    expLevel: number;
    soloVictories: number;
    duoVictories: number;
    '3vs3Victories': number;
    brawlers: { id: number; power: number; rank: number; trophies: number }[];
}

interface PlayerInput {
    tag: string;
    loading: boolean;
    error: string | null;
    data: Player | null;
}

function parseNameColor(colorCode: string): string {
    if (colorCode.startsWith('0x')) {
        const hex = colorCode.substring(4);
        return `#${hex}`;
    }
    return colorCode;
}

function formatNumber(num: number): string {
    return num.toLocaleString();
}

function StatComparison({ label, players, getValue, icon: Icon, colorClass }: {
    label: string;
    players: PlayerInput[];
    getValue: (p: Player) => number;
    icon: typeof Trophy;
    colorClass: string;
}) {
    const values = players.filter(p => p.data).map(p => getValue(p.data!));
    const maxValue = Math.max(...values);

    return (
        <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <Icon className={`w-4 h-4 ${colorClass}`} />
                {label}
            </div>
            <div className="flex items-end gap-4 justify-center">
                {players.map((player, idx) => {
                    if (!player.data) return null;
                    const value = getValue(player.data);
                    const isMax = value === maxValue && values.filter(v => v === maxValue).length === 1;

                    return (
                        <div key={idx} className="text-center flex-1">
                            <div className={`text-2xl font-bold mb-1 ${isMax ? 'text-gradient-gold' : 'text-white'}`}>
                                {formatNumber(value)}
                            </div>
                            <div className="text-xs text-slate-500 truncate">{player.data.name}</div>
                            {isMax && (
                                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    Best
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ComparePage() {
    const [players, setPlayers] = useState<PlayerInput[]>([
        { tag: '', loading: false, error: null, data: null },
        { tag: '', loading: false, error: null, data: null },
    ]);

    const updatePlayer = (index: number, updates: Partial<PlayerInput>) => {
        setPlayers(prev => prev.map((p, i) => i === index ? { ...p, ...updates } : p));
    };

    const fetchPlayer = async (index: number) => {
        const tag = players[index].tag.trim().replace('#', '');
        if (!tag) return;

        updatePlayer(index, { loading: true, error: null });

        try {
            const response = await fetch(`/api/player/${tag}`);
            if (!response.ok) {
                throw new Error(response.status === 404 ? 'Player not found' : 'Failed to fetch');
            }
            const data = await response.json();
            updatePlayer(index, { loading: false, data });
        } catch (e) {
            updatePlayer(index, {
                loading: false,
                error: e instanceof Error ? e.message : 'Failed to fetch player'
            });
        }
    };

    const addPlayer = () => {
        if (players.length < 4) {
            setPlayers([...players, { tag: '', loading: false, error: null, data: null }]);
        }
    };

    const removePlayer = (index: number) => {
        if (players.length > 2) {
            setPlayers(players.filter((_, i) => i !== index));
        }
    };

    const handleCompare = () => {
        players.forEach((_, index) => fetchPlayer(index));
    };

    const playersWithData = players.filter(p => p.data);
    const hasComparison = playersWithData.length >= 2;

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <GitCompare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Compare Players</h1>
                                <p className="text-slate-400">Compare stats between 2 or more players</p>
                            </div>
                        </div>
                    </div>

                    {/* Player Input Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {players.map((player, index) => (
                            <div key={index} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-500/20 text-amber-400' :
                                            index === 1 ? 'bg-cyan-500/20 text-cyan-400' :
                                                index === 2 ? 'bg-purple-500/20 text-purple-400' :
                                                    'bg-green-500/20 text-green-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className="text-slate-400 text-sm">Player {index + 1}</span>
                                    </div>
                                    {players.length > 2 && (
                                        <button
                                            onClick={() => removePlayer(index)}
                                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {player.data ? (
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800">
                                            <Image
                                                src={`https://cdn.brawlify.com/profile-icons/regular/${player.data.icon.id}.png`}
                                                alt={player.data.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4
                                                className="font-bold truncate"
                                                style={{ color: parseNameColor(player.data.nameColor) }}
                                            >
                                                {player.data.name}
                                            </h4>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Trophy className="w-3 h-3 text-amber-400" />
                                                <span className="text-amber-400">{formatNumber(player.data.trophies)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updatePlayer(index, { data: null, tag: '' })}
                                            className="p-2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                value={player.tag}
                                                onChange={(e) => updatePlayer(index, { tag: e.target.value })}
                                                placeholder="Enter player tag..."
                                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                                                onKeyDown={(e) => e.key === 'Enter' && fetchPlayer(index)}
                                            />
                                        </div>
                                        {player.loading && (
                                            <div className="flex items-center gap-2 mt-3 text-cyan-400 text-sm">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Loading...
                                            </div>
                                        )}
                                        {player.error && (
                                            <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
                                                <AlertCircle className="w-4 h-4" />
                                                {player.error}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Add More */}
                        {players.length < 4 && (
                            <button
                                onClick={addPlayer}
                                className="glass-card p-6 border-dashed border-2 border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-slate-500" />
                                </div>
                                <span className="text-slate-500 text-sm">Add Player</span>
                            </button>
                        )}
                    </div>

                    {/* Compare Button */}
                    <div className="text-center mb-12">
                        <button
                            onClick={handleCompare}
                            className="btn btn-primary text-lg px-8 py-4"
                            disabled={players.filter(p => p.tag.trim()).length < 2}
                        >
                            <GitCompare className="w-5 h-5" />
                            Compare Players
                        </button>
                    </div>

                    {/* Comparison Results */}
                    {hasComparison ? (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-white text-center mb-8">Comparison Results</h2>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <StatComparison
                                    label="Total Trophies"
                                    players={players}
                                    getValue={(p) => p.trophies}
                                    icon={Trophy}
                                    colorClass="text-amber-400"
                                />
                                <StatComparison
                                    label="Highest Trophies"
                                    players={players}
                                    getValue={(p) => p.highestTrophies}
                                    icon={TrendingUp}
                                    colorClass="text-green-400"
                                />
                                <StatComparison
                                    label="Experience Level"
                                    players={players}
                                    getValue={(p) => p.expLevel}
                                    icon={Star}
                                    colorClass="text-purple-400"
                                />
                                <StatComparison
                                    label="Solo Victories"
                                    players={players}
                                    getValue={(p) => p.soloVictories}
                                    icon={Medal}
                                    colorClass="text-yellow-400"
                                />
                                <StatComparison
                                    label="Duo Victories"
                                    players={players}
                                    getValue={(p) => p.duoVictories}
                                    icon={Users}
                                    colorClass="text-cyan-400"
                                />
                                <StatComparison
                                    label="3v3 Victories"
                                    players={players}
                                    getValue={(p) => p['3vs3Victories']}
                                    icon={Users}
                                    colorClass="text-purple-400"
                                />
                                <StatComparison
                                    label="Brawlers Unlocked"
                                    players={players}
                                    getValue={(p) => p.brawlers.length}
                                    icon={Swords}
                                    colorClass="text-pink-400"
                                />
                                <StatComparison
                                    label="Maxed Brawlers"
                                    players={players}
                                    getValue={(p) => p.brawlers.filter(b => b.power === 11).length}
                                    icon={Zap}
                                    colorClass="text-orange-400"
                                />
                                <StatComparison
                                    label="Rank 25+ Brawlers"
                                    players={players}
                                    getValue={(p) => p.brawlers.filter(b => b.rank >= 25).length}
                                    icon={Star}
                                    colorClass="text-red-400"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-12 text-center animate-fade-in">
                            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
                                <GitCompare className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Players Selected</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-6">
                                Enter at least 2 player tags above and click Compare to see their statistics side by side.
                            </p>

                            {/* What you can compare */}
                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-slate-400">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    Trophies
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-slate-400">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    Victories
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-slate-400">
                                    <Swords className="w-4 h-4 text-purple-400" />
                                    Brawlers
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-slate-400">
                                    <Zap className="w-4 h-4 text-cyan-400" />
                                    Win Streaks
                                </div>
                            </div>
                        </div>
                    )}

                    {/* How It Works */}
                    <div className="mt-12">
                        <h2 className="text-xl font-bold text-white mb-6 text-center">How It Works</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-amber-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">1. Enter Player Tags</h3>
                                <p className="text-slate-400 text-sm">
                                    Add the player tags you want to compare. You can compare up to 4 players at once.
                                </p>
                            </div>

                            <div className="text-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                    <GitCompare className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">2. Compare Stats</h3>
                                <p className="text-slate-400 text-sm">
                                    View side-by-side comparison of trophies, victories, and overall performance.
                                </p>
                            </div>

                            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Swords className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">3. Analyze Brawlers</h3>
                                <p className="text-slate-400 text-sm">
                                    See who has higher ranks on specific brawlers and discover strengths.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
