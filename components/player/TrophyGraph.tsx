'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import { Battle } from '@/lib/types';
import { formatNumber } from '@/lib/brawlstars-client';

interface TrophyGraphProps {
    battlelog: Battle[];
    currentTrophies: number;
}

export function TrophyGraph({ battlelog, currentTrophies }: TrophyGraphProps) {
    if (!battlelog || battlelog.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-500">
                Not enough data for graph
            </div>
        );
    }

    // Calculate history
    // We start from current and work backwards
    // Battlelog is usually sorted by Most Recent FIRST
    const history = [];
    let runningTrophies = currentTrophies;

    // Add current state (Now)
    history.push({
        index: 0,
        trophies: runningTrophies,
        label: 'Now'
    });

    // We take the first 20 battles to show recent trend
    const recentBattles = battlelog.slice(0, 20);

    for (let i = 0; i < recentBattles.length; i++) {
        const battle = recentBattles[i];
        // Calculate trophies bEFORE this battle
        // If we have result.trophyChange, we subtract it from current running
        const change = battle.battle.trophyChange || 0;
        const trophiesBefore = runningTrophies - change;

        history.push({
            index: i + 1,
            trophies: trophiesBefore,
            label: `-${i + 1}`
        });

        runningTrophies = trophiesBefore;
    }

    // Reverse so it goes from Past -> Present
    const data = history.reverse();

    // Calculate min/max for domain
    const minTrophies = Math.min(...data.map(d => d.trophies));
    const maxTrophies = Math.max(...data.map(d => d.trophies));
    const padding = Math.ceil((maxTrophies - minTrophies) * 0.1) || 10;

    return (
        <div className="w-full h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorTrophies" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="label"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[minTrophies - padding, maxTrophies + padding]}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            borderRadius: '0.75rem',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#fbbf24' }}
                        formatter={(value: number) => [formatNumber(value), 'Trophies']}
                    />
                    <Area
                        type="monotone"
                        dataKey="trophies"
                        stroke="#fbbf24"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTrophies)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
