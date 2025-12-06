import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Medal, Crown, ChevronRight, Globe, AlertCircle } from 'lucide-react';
import { getPlayerIconUrl, formatNumber, parseNameColor, fetchPlayer } from '@/lib/brawlstars-client';

export const metadata: Metadata = {
    title: 'Player Leaderboards',
    description: 'View top Brawl Stars players globally and by country',
};

const countries = [
    { code: 'global', name: 'Global', flag: '🌍' },
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
];

function getRankStyle(rank: number) {
    if (rank === 1) return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 shadow-lg shadow-slate-300/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/30';
    return 'bg-slate-700/50 text-slate-300';
}

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
    if (rank === 2 || rank === 3) return <Medal className="w-5 h-5 text-slate-300" />;
    return null;
}

// Fetch rankings with trophy enrichment for players with invalid data
async function fetchEnrichedPlayerRankings(countryCode: string) {
    const { fetchPlayerRankings } = await import('@/lib/brawlstars-client');
    const response = await fetchPlayerRankings(countryCode);

    if (!response.items || response.items.length === 0) {
        return response;
    }

    // Check if trophy data seems invalid (top players should have 50k+ trophies)
    const firstPlayerTrophies = response.items[0]?.trophies || 0;

    // If trophies seem correct (> 10000 for top player), return as is
    if (firstPlayerTrophies > 10000) {
        return response;
    }

    console.log("Detected possibly invalid trophy data, enriching with player data...");

    // Enrich first 50 players with actual trophy data
    const enrichedItems = await Promise.all(
        response.items.slice(0, 50).map(async (player: any) => {
            try {
                // Only fetch if trophies seem invalid
                if (player.trophies < 10000) {
                    const fullPlayer = await fetchPlayer(player.tag);
                    return {
                        ...player,
                        trophies: fullPlayer.trophies,
                    };
                }
                return player;
            } catch (error) {
                // If fetch fails, return original data
                return player;
            }
        })
    );

    return {
        items: [
            ...enrichedItems,
            ...response.items.slice(50),
        ],
    };
}

interface PageProps {
    searchParams: Promise<{ region?: string }>;
}

export default async function PlayerLeaderboardsPage({ searchParams }: PageProps) {
    const { region = 'global' } = await searchParams;

    let rankings: any[] | undefined;
    let error: string | null = null;

    try {
        const response = await fetchEnrichedPlayerRankings(region);
        rankings = response.items;
    } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to fetch leaderboard';
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Failed to Load Leaderboard</h1>
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
                            <div className="w-14 h-14 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://cdn-misc.brawlify.com/front/Star.svg"
                                    alt="Leaderboards"
                                    className="w-full h-full object-contain drop-shadow-xl"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Player Leaderboards</h1>
                                <p className="text-slate-400">Top players ranked by total trophies</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scroll-hidden">
                        <Link
                            href="/leaderboards/players"
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg whitespace-nowrap"
                        >
                            <Trophy className="w-4 h-4" />
                            Players
                        </Link>
                        <Link
                            href="/leaderboards/clubs"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 rounded-lg whitespace-nowrap transition-colors"
                        >
                            Clubs
                        </Link>
                        <Link
                            href="/leaderboards/brawlers"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 rounded-lg whitespace-nowrap transition-colors"
                        >
                            Brawlers
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Region Selector */}
                        <div className="lg:col-span-1">
                            <div className="glass-card p-4 sticky top-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Globe className="w-5 h-5 text-cyan-400" />
                                    <h3 className="font-bold text-white">Region</h3>
                                </div>
                                <div className="space-y-1">
                                    {countries.map((country) => (
                                        <Link
                                            key={country.code}
                                            href={`/leaderboards/players?region=${country.code}`}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${country.code === region
                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                                }`}
                                        >
                                            <span className="text-lg">{country.flag}</span>
                                            <span className="text-sm font-medium">{country.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Rankings Table */}
                        <div className="lg:col-span-3">
                            <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.15s' }}>
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/50 border-b border-slate-700/50 text-sm font-medium text-slate-400 uppercase tracking-wider">
                                    <div className="col-span-1 text-center">Rank</div>
                                    <div className="col-span-5 sm:col-span-4">Player</div>
                                    <div className="col-span-4 sm:col-span-4 hidden sm:block">Club</div>
                                    <div className="col-span-5 sm:col-span-2 text-right">Trophies</div>
                                    <div className="col-span-1 hidden sm:block"></div>
                                </div>

                                {/* Rankings */}
                                <div className="divide-y divide-slate-800/50">
                                    {rankings?.map((player) => {
                                        const nameColor = parseNameColor(player.nameColor);

                                        return (
                                            <Link
                                                key={player.tag}
                                                href={`/player/${player.tag.replace('#', '')}`}
                                                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/30 transition-colors group"
                                            >
                                                {/* Rank */}
                                                <div className="col-span-1 flex justify-center">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${getRankStyle(player.rank)}`}>
                                                        {player.rank <= 3 ? getRankIcon(player.rank) : player.rank}
                                                    </div>
                                                </div>

                                                {/* Player Info */}
                                                <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0">
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                                                        <Image
                                                            src={getPlayerIconUrl(player.icon.id)}
                                                            alt={player.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4
                                                            className="font-bold truncate text-base group-hover:opacity-80 transition-opacity"
                                                            style={{ color: nameColor }}
                                                        >
                                                            {player.name}
                                                        </h4>
                                                        <p className="text-sm text-slate-400 font-mono truncate">{player.tag}</p>
                                                    </div>
                                                </div>

                                                {/* Club */}
                                                <div className="col-span-4 hidden sm:block">
                                                    <span className={`text-sm truncate block font-medium ${player.club?.name ? 'text-cyan-400' : 'text-slate-500'}`}>
                                                        {player.club?.name || '-'}
                                                    </span>
                                                </div>

                                                {/* Trophies */}
                                                <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-2">
                                                    <Trophy className="w-4 h-4 text-amber-400" />
                                                    <span className="font-bold text-white">{formatNumber(player.trophies)}</span>
                                                </div>

                                                {/* Arrow */}
                                                <div className="col-span-1 hidden sm:flex justify-center">
                                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Load More */}
                                <div className="p-4 border-t border-slate-800/50 text-center">
                                    <p className="text-slate-500 text-sm">
                                        Showing top {rankings?.length || 0} players
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
