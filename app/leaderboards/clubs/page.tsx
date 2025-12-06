import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Medal, Crown, ChevronRight, Globe, AlertCircle, Shield, Users } from 'lucide-react';
import { fetchClubRankings, getClubBadgeUrl, formatNumber } from '@/lib/brawlstars-client';

export const metadata: Metadata = {
    title: 'Club Leaderboards',
    description: 'View top Brawl Stars clubs globally and by country',
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

interface PageProps {
    searchParams: Promise<{ region?: string }>;
}

export default async function ClubLeaderboardsPage({ searchParams }: PageProps) {
    const { region = 'global' } = await searchParams;

    let rankings: any[] | undefined;
    let error: string | null = null;

    try {
        const response = await fetchClubRankings(region);
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
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Club Leaderboards</h1>
                                <p className="text-slate-400">Top clubs ranked by total trophies</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scroll-hidden">
                        <Link
                            href="/leaderboards/players"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 rounded-lg whitespace-nowrap transition-colors"
                        >
                            <Trophy className="w-4 h-4" />
                            Players
                        </Link>
                        <Link
                            href="/leaderboards/clubs"
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg whitespace-nowrap"
                        >
                            <Shield className="w-4 h-4" />
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
                                            href={`/leaderboards/clubs?region=${country.code}`}
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
                                    <div className="col-span-5 sm:col-span-5">Club</div>
                                    <div className="col-span-3 sm:col-span-3 text-center">Members</div>
                                    <div className="col-span-3 sm:col-span-2 text-right">Trophies</div>
                                    <div className="col-span-1 hidden sm:block"></div>
                                </div>

                                {/* Rankings */}
                                <div className="divide-y divide-slate-800/50">
                                    {rankings?.map((club) => (
                                        <Link
                                            key={club.tag}
                                            href={`/club/${club.tag.replace('#', '')}`}
                                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/30 transition-colors group"
                                        >
                                            {/* Rank */}
                                            <div className="col-span-1 flex justify-center">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${getRankStyle(club.rank)}`}>
                                                    {club.rank <= 3 ? getRankIcon(club.rank) : club.rank}
                                                </div>
                                            </div>

                                            {/* Club Info */}
                                            <div className="col-span-5 flex items-center gap-3 min-w-0">
                                                <div className="relative w-10 h-10 flex-shrink-0">
                                                    <Image
                                                        src={getClubBadgeUrl(club.badgeId)}
                                                        alt={club.name}
                                                        fill
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold truncate text-base text-white group-hover:text-cyan-400 transition-colors">
                                                        {club.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-400 font-mono truncate">{club.tag}</p>
                                                </div>
                                            </div>

                                            {/* Members */}
                                            <div className="col-span-3 flex items-center justify-center gap-2">
                                                <Users className="w-4 h-4 text-slate-500" />
                                                <span className="text-slate-300">{club.memberCount}/30</span>
                                            </div>

                                            {/* Trophies */}
                                            <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-2">
                                                <Trophy className="w-4 h-4 text-amber-400" />
                                                <span className="font-bold text-white">{formatNumber(club.trophies)}</span>
                                            </div>

                                            {/* Arrow */}
                                            <div className="col-span-1 hidden sm:flex justify-center">
                                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Load More */}
                                <div className="p-4 border-t border-slate-800/50 text-center">
                                    <p className="text-slate-500 text-sm">
                                        Showing top {rankings?.length || 0} clubs
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
