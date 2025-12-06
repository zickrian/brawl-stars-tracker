import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Shield, Trophy, Users, Crown, Medal, Star,
    ChevronRight, TrendingUp, UserPlus, Lock, AlertCircle
} from 'lucide-react';
import { fetchClub, getClubBadgeUrl, getPlayerIconUrl, formatNumber, parseNameColor } from '@/lib/brawlstars-client';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    return {
        title: `Club #${tag}`,
        description: `View club information and members for #${tag}`,
    };
}

const roleColors: Record<string, { bg: string; text: string; label: string }> = {
    president: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'President' },
    vicePresident: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Vice President' },
    senior: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Senior' },
    member: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: 'Member' },
    unknown: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: 'Member' },
};

const typeLabels: Record<string, { icon: typeof Lock; label: string; color: string }> = {
    open: { icon: UserPlus, label: 'Open', color: 'text-green-400' },
    inviteOnly: { icon: Crown, label: 'Invite Only', color: 'text-amber-400' },
    closed: { icon: Lock, label: 'Closed', color: 'text-red-400' },
    unknown: { icon: Lock, label: 'Unknown', color: 'text-slate-400' },
};

export default async function ClubPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;

    let club;
    let error = null;

    try {
        club = await fetchClub(tag);
    } catch (e) {
        error = e instanceof Error ? e.message : 'Failed to fetch club data';
    }

    if (error || !club) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass-card p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Club Not Found</h1>
                            <p className="text-slate-400 mb-6">
                                {error || `Could not find club with tag #${tag}`}
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

    const typeInfo = typeLabels[club.type] || typeLabels.unknown;
    const TypeIcon = typeInfo.icon;

    // Calculate stats
    const avgTrophies = Math.round(club.members.reduce((acc, m) => acc + m.trophies, 0) / club.members.length);
    const minTrophies = Math.min(...club.members.map(m => m.trophies));
    const maxTrophies = Math.max(...club.members.map(m => m.trophies));

    // Sort members by trophies
    const sortedMembers = [...club.members].sort((a, b) => b.trophies - a.trophies);

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Club Header */}
                    <div className="glass-card p-6 sm:p-8 mb-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            {/* Club Badge */}
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                                    <Image
                                        src={getClubBadgeUrl(club.badgeId)}
                                        alt={club.name}
                                        width={96}
                                        height={96}
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                            </div>

                            {/* Club Info */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                                        {club.name}
                                    </h1>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${typeInfo.color} bg-slate-800/80`}>
                                        <TypeIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{typeInfo.label}</span>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-lg mb-3">#{tag}</p>

                                {club.description && (
                                    <p className="text-slate-400 mb-4 max-w-2xl">
                                        {club.description}
                                    </p>
                                )}

                                {/* Required Trophies */}
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    <span className="text-sm">Required: {formatNumber(club.requiredTrophies)} trophies</span>
                                </div>
                            </div>

                            {/* Total Trophies */}
                            <div className="flex flex-col items-center p-5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl">
                                <Shield className="w-8 h-8 text-cyan-400 mb-2" />
                                <div className="text-3xl sm:text-4xl font-bold text-gradient-cyan">
                                    {formatNumber(club.trophies)}
                                </div>
                                <div className="text-sm text-slate-400 mt-1">Total Trophies</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Users className="w-4 h-4 text-cyan-400" />
                                Members
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {club.members.length}/30
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                Average
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {formatNumber(avgTrophies)}
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Medal className="w-4 h-4 text-amber-400" />
                                Highest
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {formatNumber(maxTrophies)}
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in" style={{ animationDelay: '0.25s' }}>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                <Star className="w-4 h-4 text-purple-400" />
                                Lowest
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {formatNumber(minTrophies)}
                            </div>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-cyan-400" />
                                Members ({club.members.length})
                            </h2>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/50 text-sm font-medium text-slate-400 uppercase tracking-wider">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-5 sm:col-span-4">Player</div>
                            <div className="col-span-3 sm:col-span-3">Role</div>
                            <div className="col-span-3 sm:col-span-3 text-right">Trophies</div>
                            <div className="col-span-1 hidden sm:block"></div>
                        </div>

                        {/* Members */}
                        <div className="divide-y divide-slate-800/50">
                            {sortedMembers.map((member, index) => {
                                const roleStyle = roleColors[member.role] || roleColors.member;
                                const nameColor = parseNameColor(member.nameColor);

                                return (
                                    <Link
                                        key={member.tag}
                                        href={`/player/${member.tag.replace('#', '')}`}
                                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/30 transition-colors group"
                                    >
                                        {/* Rank */}
                                        <div className="col-span-1 text-center text-slate-500 font-medium">
                                            {index + 1}
                                        </div>

                                        {/* Player Info */}
                                        <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                                                <Image
                                                    src={getPlayerIconUrl(member.icon.id)}
                                                    alt={member.name}
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
                                                    {member.name}
                                                </h4>
                                                <p className="text-sm text-slate-400 font-mono truncate">{member.tag}</p>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div className="col-span-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                                                {member.role === 'president' && <Crown className="w-3 h-3" />}
                                                {roleStyle.label}
                                            </span>
                                        </div>

                                        {/* Trophies */}
                                        <div className="col-span-3 flex items-center justify-end gap-2">
                                            <Trophy className="w-4 h-4 text-amber-400" />
                                            <span className="font-bold text-white">{formatNumber(member.trophies)}</span>
                                        </div>

                                        {/* Arrow */}
                                        <div className="col-span-1 hidden sm:flex justify-center">
                                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
