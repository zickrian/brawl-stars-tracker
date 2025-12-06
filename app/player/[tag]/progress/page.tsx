'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import {
    Trophy, ChevronLeft, BarChart3, TrendingUp, Star,
    Zap, Target, Award, Crown, RefreshCw, AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

interface BrawlerStat {
    id: number;
    name: string;
    trophies: number;
    highestTrophies: number;
    rank: number;
    power: number;
}

interface Player {
    tag: string;
    name: string;
    nameColor: string;
    icon: { id: number };
    trophies: number;
    highestTrophies: number;
    expLevel: number;
    brawlers: BrawlerStat[];
}

export default function PlayerProgressPage({ params }: { params: Promise<{ tag: string }> }) {
    const [tag, setTag] = useState<string>('');
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        params.then(p => setTag(p.tag));
    }, [params]);

    const fetchPlayer = async () => {
        if (!tag) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/player/${tag}`);
            if (!response.ok) {
                throw new Error('Failed to fetch player data');
            }
            const data = await response.json();
            setPlayer(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch player data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tag) {
            fetchPlayer();
        }
    }, [tag]);

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="space-y-6">
                            <div className="h-12 skeleton rounded-xl w-1/3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6 h-80 skeleton" />
                                <div className="glass-card p-6 h-80 skeleton" />
                            </div>
                            <div className="glass-card p-6 h-96 skeleton" />
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error || !player) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Failed to Load Progress</h2>
                            <p className="text-slate-400 mb-4">{error}</p>
                            <Link href={`/player/${tag}`} className="btn btn-primary">
                                Back to Profile
                            </Link>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    // Calculate stats
    const sortedByTrophies = [...player.brawlers].sort((a, b) => b.trophies - a.trophies);
    const top10Brawlers = sortedByTrophies.slice(0, 10);

    // Power Level Distribution
    const powerLevels = Array(11).fill(0);
    player.brawlers.forEach(b => {
        if (b.power >= 1 && b.power <= 11) {
            powerLevels[b.power - 1]++;
        }
    });

    // Rank Distribution
    const rankGroups = {
        '1-9': 0,
        '10-19': 0,
        '20-24': 0,
        '25-29': 0,
        '30-34': 0,
        '35': 0,
    };
    player.brawlers.forEach(b => {
        if (b.rank >= 35) rankGroups['35']++;
        else if (b.rank >= 30) rankGroups['30-34']++;
        else if (b.rank >= 25) rankGroups['25-29']++;
        else if (b.rank >= 20) rankGroups['20-24']++;
        else if (b.rank >= 10) rankGroups['10-19']++;
        else rankGroups['1-9']++;
    });

    // Trophy potential
    const currentTotalTrophies = player.brawlers.reduce((acc, b) => acc + b.trophies, 0);
    const potentialTrophies = player.brawlers.reduce((acc, b) => acc + b.highestTrophies, 0);

    // Chart configurations
    const topBrawlersChartData = {
        labels: top10Brawlers.map(b => b.name),
        datasets: [
            {
                label: 'Current Trophies',
                data: top10Brawlers.map(b => b.trophies),
                backgroundColor: 'rgba(251, 191, 36, 0.8)',
                borderColor: 'rgb(251, 191, 36)',
                borderWidth: 1,
            },
            {
                label: 'Highest Trophies',
                data: top10Brawlers.map(b => b.highestTrophies),
                backgroundColor: 'rgba(34, 211, 238, 0.5)',
                borderColor: 'rgb(34, 211, 238)',
                borderWidth: 1,
            },
        ],
    };

    const powerLevelChartData = {
        labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11'],
        datasets: [
            {
                data: powerLevels,
                backgroundColor: [
                    'rgba(148, 163, 184, 0.8)', // P1 - slate
                    'rgba(148, 163, 184, 0.8)', // P2
                    'rgba(74, 222, 128, 0.8)',   // P3 - green
                    'rgba(74, 222, 128, 0.8)',   // P4
                    'rgba(96, 165, 250, 0.8)',   // P5 - blue
                    'rgba(96, 165, 250, 0.8)',   // P6
                    'rgba(168, 85, 247, 0.8)',   // P7 - purple
                    'rgba(168, 85, 247, 0.8)',   // P8
                    'rgba(251, 191, 36, 0.8)',   // P9 - amber
                    'rgba(251, 191, 36, 0.8)',   // P10
                    'rgba(239, 68, 68, 0.8)',    // P11 - red (maxed)
                ],
                borderWidth: 0,
            },
        ],
    };

    const rankDistributionData = {
        labels: Object.keys(rankGroups),
        datasets: [
            {
                data: Object.values(rankGroups),
                backgroundColor: [
                    'rgba(148, 163, 184, 0.8)', // 1-9
                    'rgba(205, 127, 50, 0.8)',  // 10-19 Bronze
                    'rgba(192, 192, 192, 0.8)', // 20-24 Silver
                    'rgba(255, 215, 0, 0.8)',   // 25-29 Gold
                    'rgba(0, 255, 255, 0.8)',   // 30-34 Cyan
                    'rgba(255, 0, 255, 0.8)',   // 35 Magenta
                ],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'rgb(148, 163, 184)',
                },
            },
        },
        scales: {
            x: {
                ticks: { color: 'rgb(148, 163, 184)' },
                grid: { color: 'rgba(71, 85, 105, 0.3)' },
            },
            y: {
                ticks: { color: 'rgb(148, 163, 184)' },
                grid: { color: 'rgba(71, 85, 105, 0.3)' },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: 'rgb(148, 163, 184)',
                    padding: 10,
                },
            },
        },
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
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
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Progress Tracking</h1>
                                    <p className="text-slate-400">Trophy and brawler statistics</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchPlayer}
                                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Trophy Overview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                Current Trophies
                            </div>
                            <div className="text-2xl font-bold text-gradient-gold">{player.trophies.toLocaleString()}</div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <TrendingUp className="w-4 h-4 text-cyan-400" />
                                Highest Trophies
                            </div>
                            <div className="text-2xl font-bold text-cyan-400">{player.highestTrophies.toLocaleString()}</div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Target className="w-4 h-4 text-purple-400" />
                                Brawler Total
                            </div>
                            <div className="text-2xl font-bold text-white">{currentTotalTrophies.toLocaleString()}</div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.25s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Award className="w-4 h-4 text-green-400" />
                                Trophy Potential
                            </div>
                            <div className="text-2xl font-bold text-green-400">{potentialTrophies.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Trophy Progress Bar */}
                    <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            Trophy Progress
                        </h3>
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-slate-400">Current: {player.trophies.toLocaleString()}</span>
                            <span className="text-slate-400">Highest: {player.highestTrophies.toLocaleString()}</span>
                        </div>
                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                                style={{ width: `${(player.trophies / player.highestTrophies) * 100}%` }}
                            />
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-2">
                            {Math.round((player.trophies / player.highestTrophies) * 100)}% of highest record
                        </p>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Power Level Distribution */}
                        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-green-400" />
                                Power Level Distribution
                            </h3>
                            <div className="h-64">
                                <Bar data={powerLevelChartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Rank Distribution */}
                        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-400" />
                                Rank Distribution
                            </h3>
                            <div className="h-64">
                                <Doughnut data={rankDistributionData} options={doughnutOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Top Brawlers Chart */}
                    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.45s' }}>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            Top 10 Brawlers by Trophies
                        </h3>
                        <div className="h-80">
                            <Bar data={topBrawlersChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
