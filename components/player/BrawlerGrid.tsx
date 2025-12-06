'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Trophy, Star, Zap, ChevronUp, ChevronDown, Filter,
    SortAsc, SortDesc, Search, X
} from 'lucide-react';
import type { BrawlerStat } from '@/lib/types';
import { formatNumber, getBrawlerImageUrl, getRankColor } from '@/lib/brawlstars-client';

type SortKey = 'trophies' | 'highestTrophies' | 'power' | 'rank' | 'currentWinStreak' | 'name';
type SortOrder = 'asc' | 'desc';

interface BrawlerGridProps {
    brawlers: BrawlerStat[];
    playerTag: string;
}

export function BrawlerGrid({ brawlers, playerTag }: BrawlerGridProps) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('trophies');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [filterPower, setFilterPower] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const filteredAndSorted = useMemo(() => {
        let result = [...brawlers];

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(b =>
                b.name.toLowerCase().includes(searchLower)
            );
        }

        // Power filter
        if (filterPower !== null) {
            result = result.filter(b => b.power >= filterPower);
        }

        // Sort
        result.sort((a, b) => {
            let aVal: number | string = a[sortKey];
            let bVal: number | string = b[sortKey];

            if (sortKey === 'name') {
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
                return sortOrder === 'asc'
                    ? (aVal as string).localeCompare(bVal as string)
                    : (bVal as string).localeCompare(aVal as string);
            }

            return sortOrder === 'asc'
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
        });

        return result;
    }, [brawlers, search, sortKey, sortOrder, filterPower]);

    const SortButton = ({ sortKeyName, label }: { sortKeyName: SortKey; label: string }) => (
        <button
            onClick={() => handleSort(sortKeyName)}
            className={`
        flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
        ${sortKey === sortKeyName
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
                }
      `}
        >
            {label}
            {sortKey === sortKeyName && (
                sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
            )}
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search brawlers..."
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${showFilters
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'
                        }
          `}
                >
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="glass-card p-4 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-slate-400">Sort by:</span>
                        <SortButton sortKeyName="trophies" label="Trophies" />
                        <SortButton sortKeyName="highestTrophies" label="Highest" />
                        <SortButton sortKeyName="power" label="Power" />
                        <SortButton sortKeyName="rank" label="Rank" />
                        <SortButton sortKeyName="currentWinStreak" label="Win Streak" />
                        <SortButton sortKeyName="name" label="Name" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-slate-400">Min Power:</span>
                        {[null, 9, 10, 11].map((power) => (
                            <button
                                key={power ?? 'all'}
                                onClick={() => setFilterPower(power)}
                                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${filterPower === power
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
                                    }
                `}
                            >
                                {power === null ? 'All' : `${power}+`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm">
                    Showing {filteredAndSorted.length} of {brawlers.length} brawlers
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredAndSorted.map((brawler) => (
                    <BrawlerCard
                        key={brawler.id}
                        brawler={brawler}
                        playerTag={playerTag}
                    />
                ))}
            </div>

            {filteredAndSorted.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-400">No brawlers found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}

interface BrawlerCardProps {
    brawler: BrawlerStat;
    playerTag: string;
}

function BrawlerCard({ brawler, playerTag }: BrawlerCardProps) {
    const rankColor = getRankColor(brawler.rank);
    const isMaxed = brawler.power === 11;

    return (
        <div className="group relative bg-slate-800/50 hover:bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            {/* Maxed Badge */}
            {isMaxed && (
                <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-slate-900 px-2 py-0.5 rounded-full">
                    MAX
                </div>
            )}

            {/* Brawler Image */}
            <div className="relative aspect-square p-4">
                <div className="relative w-full h-full">
                    <Image
                        src={getBrawlerImageUrl(brawler.id)}
                        alt={brawler.name}
                        fill
                        className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                    />
                </div>

                {/* Power Level Badge */}
                <div className="absolute bottom-2 left-2 bg-purple-600/90 backdrop-blur-sm rounded-lg px-2 py-0.5 text-xs font-bold text-white">
                    P{brawler.power}
                </div>

                {/* Rank Badge */}
                <div
                    className="absolute bottom-2 right-2 rounded-lg px-2 py-0.5 text-xs font-bold backdrop-blur-sm"
                    style={{ backgroundColor: `${rankColor}20`, color: rankColor, border: `1px solid ${rankColor}40` }}
                >
                    R{brawler.rank}
                </div>
            </div>

            {/* Info */}
            <div className="p-3 pt-0 space-y-2">
                <h4 className="font-bold text-white text-center truncate">{brawler.name}</h4>

                {/* Trophies */}
                <div className="flex items-center justify-center gap-1.5">
                    <Trophy size={14} className="text-amber-400" />
                    <span className="font-bold text-amber-400">{formatNumber(brawler.trophies)}</span>
                    <span className="text-slate-500 text-xs">/ {formatNumber(brawler.highestTrophies)}</span>
                </div>

                {/* Accessories */}
                <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                    {brawler.gadgets.length > 0 && (
                        <div className="flex items-center gap-1">
                            <Zap size={12} className="text-green-400" />
                            <span>{brawler.gadgets.length}</span>
                        </div>
                    )}
                    {brawler.starPowers.length > 0 && (
                        <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400" />
                            <span>{brawler.starPowers.length}</span>
                        </div>
                    )}
                    {brawler.gears.length > 0 && (
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-purple-400" />
                            <span>{brawler.gears.length}</span>
                        </div>
                    )}
                </div>

                {/* Win Streak */}
                {brawler.currentWinStreak > 0 && (
                    <div className="text-center">
                        <span className="text-xs text-green-400 font-medium">
                            🔥 {brawler.currentWinStreak} Win Streak
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
