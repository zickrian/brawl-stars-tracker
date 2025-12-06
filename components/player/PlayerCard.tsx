import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Star, Zap, Users, Medal, TrendingUp, Crown } from 'lucide-react';
import type { Player } from '@/lib/types';
import { formatNumber, getPlayerIconUrl, parseNameColor } from '@/lib/brawlstars-client';

interface PlayerCardProps {
    player: Player;
    showLink?: boolean;
    compact?: boolean;
}

export function PlayerCard({ player, showLink = true, compact = false }: PlayerCardProps) {
    const nameColor = parseNameColor(player.nameColor);

    const CardWrapper = ({ children }: { children: React.ReactNode }) => {
        if (showLink) {
            return (
                <Link
                    href={`/player/${player.tag.replace('#', '')}`}
                    className="block glass-card hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-300"
                >
                    {children}
                </Link>
            );
        }
        return <div className="glass-card">{children}</div>;
    };

    if (compact) {
        return (
            <CardWrapper>
                <div className="p-4 flex items-center gap-4">
                    {/* Player Icon */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        <Image
                            src={getPlayerIconUrl(player.icon.id)}
                            alt={player.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-bold text-lg truncate"
                            style={{ color: nameColor }}
                        >
                            {player.name}
                        </h3>
                        <p className="text-slate-500 text-sm">{player.tag}</p>
                    </div>

                    {/* Trophies */}
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span className="font-bold text-white">{formatNumber(player.trophies)}</span>
                    </div>
                </div>
            </CardWrapper>
        );
    }

    return (
        <CardWrapper>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-5 mb-6">
                    {/* Player Icon */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 ring-2 ring-amber-500/30">
                            <Image
                                src={getPlayerIconUrl(player.icon.id)}
                                alt={player.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg px-2 py-0.5 text-xs font-bold text-white shadow-lg">
                            Lv.{player.expLevel}
                        </div>
                    </div>

                    {/* Name & Club */}
                    <div className="flex-1">
                        <h2
                            className="text-2xl font-bold mb-1"
                            style={{ color: nameColor }}
                        >
                            {player.name}
                        </h2>
                        <p className="text-slate-500 text-sm mb-2">{player.tag}</p>

                        {player.club && (
                            <Link
                                href={`/club/${player.club.tag.replace('#', '')}`}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg text-sm text-cyan-400 hover:bg-slate-700 transition-colors"
                            >
                                <Users size={14} />
                                {player.club.name}
                            </Link>
                        )}
                    </div>

                    {/* Championship Badge */}
                    {player.isQualifiedFromChampionshipChallenge && (
                        <div className="badge badge-gold">
                            <Crown size={14} />
                            Champion
                        </div>
                    )}
                </div>

                {/* Trophy Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="stat-card">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                            <Trophy size={16} className="text-amber-400" />
                            Current Trophies
                        </div>
                        <div className="text-2xl font-bold text-gradient-gold">
                            {formatNumber(player.trophies)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                            <TrendingUp size={16} className="text-cyan-400" />
                            Highest Trophies
                        </div>
                        <div className="text-2xl font-bold text-cyan-400">
                            {formatNumber(player.highestTrophies)}
                        </div>
                    </div>
                </div>

                {/* Victory Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                            <Star size={12} />
                            Solo
                        </div>
                        <div className="font-bold text-white">{formatNumber(player.soloVictories)}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                            <Zap size={12} />
                            Duo
                        </div>
                        <div className="font-bold text-white">{formatNumber(player.duoVictories)}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                            <Users size={12} />
                            3v3
                        </div>
                        <div className="font-bold text-white">{formatNumber(player['3vs3Victories'])}</div>
                    </div>
                </div>

                {/* Brawler Count */}
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Brawlers Unlocked</span>
                    <span className="font-bold text-white">{player.brawlers.length}</span>
                </div>
            </div>
        </CardWrapper>
    );
}

// Mini player card for rankings
interface PlayerRankCardProps {
    rank: number;
    name: string;
    tag: string;
    trophies: number;
    clubName?: string;
    iconId: number;
    nameColor: string;
}

export function PlayerRankCard({ rank, name, tag, trophies, clubName, iconId, nameColor }: PlayerRankCardProps) {
    const color = parseNameColor(nameColor);

    const getRankStyle = () => {
        if (rank === 1) return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900';
        if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900';
        if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
        return 'bg-slate-700 text-slate-300';
    };

    return (
        <Link
            href={`/player/${tag.replace('#', '')}`}
            className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl transition-colors group"
        >
            {/* Rank */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${getRankStyle()}`}>
                {rank}
            </div>

            {/* Icon */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800">
                <Image
                    src={getPlayerIconUrl(iconId)}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate group-hover:text-cyan-400 transition-colors" style={{ color }}>
                    {name}
                </h4>
                {clubName && (
                    <p className="text-slate-500 text-sm truncate">{clubName}</p>
                )}
            </div>

            {/* Trophies */}
            <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                <span className="font-bold text-white">{formatNumber(trophies)}</span>
            </div>
        </Link>
    );
}
