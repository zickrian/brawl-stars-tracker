'use client';

import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import {
    Calendar, Clock, MapPin, Gamepad2, Timer,
    ChevronRight, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScheduledEvent {
    event: {
        modeId: number;
        mode: string;
        modifiers: string[];
        id: number;
        map: string;
    };
    slotId: number;
    startTime: string;
    endTime: string;
}

// Mode colors - icons now come from CDN
const modeStyles: Record<string, { color: string }> = {
    'gemGrab': { color: 'from-purple-500 to-pink-500' },
    'brawlBall': { color: 'from-blue-500 to-cyan-500' },
    'heist': { color: 'from-orange-500 to-red-500' },
    'bounty': { color: 'from-amber-500 to-yellow-500' },
    'siege': { color: 'from-indigo-500 to-purple-500' },
    'hotZone': { color: 'from-green-500 to-emerald-500' },
    'knockout': { color: 'from-red-500 to-rose-500' },
    'duels': { color: 'from-violet-500 to-purple-500' },
    'showdown': { color: 'from-gray-500 to-slate-500' },
    'soloShowdown': { color: 'from-gray-500 to-slate-500' },
    'duoShowdown': { color: 'from-teal-500 to-cyan-500' },
    'wipeout': { color: 'from-pink-500 to-rose-500' },
    'payload': { color: 'from-sky-500 to-blue-500' },
    'default': { color: 'from-slate-500 to-gray-500' },
};

// Get mode icon URL from Brawlify CDN
// Helper to determine folder for gamemode icon
function getModeFolder(mode: string) {
    if (mode.includes("solo") || mode.includes("duo") || mode === "showdown") {
        return "showdown";
    }

    const seasonal = [
        "hunters", "takedown", "basketBrawl",
        "volleyBrawl", "bossFight", "bigGame",
        "roboRumble"
    ];
    if (seasonal.includes(mode)) return "seasonal";

    return "regular";
}

function getGamemodeIcon(modeId: number, mode: string) {
    const folder = getModeFolder(mode);
    return `https://cdn.brawlify.com/game-modes/${folder}/${modeId}.png`;
}

function getMapIcon(mapId: number) {
    return `https://cdn.brawlify.com/maps/regular/${mapId}.png`;
}

function formatMode(mode: string): string {
    return mode
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function getModeStyle(mode: string) {
    const key = mode.charAt(0).toLowerCase() + mode.slice(1).replace(/\s+/g, '');
    return modeStyles[key] || modeStyles['default'];
}

function parseApiTime(timeStr: string): Date {
    // Format: "20231217T120000.000Z"
    const year = parseInt(timeStr.substring(0, 4));
    const month = parseInt(timeStr.substring(4, 6)) - 1;
    const day = parseInt(timeStr.substring(6, 8));
    const hour = parseInt(timeStr.substring(9, 11));
    const minute = parseInt(timeStr.substring(11, 13));
    const second = parseInt(timeStr.substring(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
}

function useTimeRemaining(endTime: string) {
    const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const update = () => {
            const end = parseApiTime(endTime);
            const now = new Date();
            const diff = end.getTime() - now.getTime();

            if (diff <= 0) {
                setRemaining({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setRemaining({ hours, minutes, seconds });
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return remaining;
}

function EventCard({ event, isLive }: { event: ScheduledEvent; isLive: boolean }) {
    const { hours, minutes } = useTimeRemaining(isLive ? event.endTime : event.startTime);
    const style = getModeStyle(event.event.mode);

    return (
        <div className="group glass-card overflow-hidden hover:border-slate-600/50 transition-all duration-300">
            {/* Header with Map Background */}
            <div className="relative h-32 overflow-hidden">
                {/* Map Background - Full cover, brighter */}
                <Image
                    src={getMapIcon(event.event.id)}
                    alt={event.event.map}
                    fill
                    className="object-cover brightness-100 group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                />
                {/* Subtle gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30" />

                {/* Content Layer */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    {/* Top row - just countdown */}
                    <div className="flex justify-end">
                        <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 border border-slate-700/50">
                            <Timer className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-bold text-sm">
                                {hours}h {minutes}m
                            </span>
                        </div>
                    </div>

                    {/* Bottom row - Mode badge and modifiers */}
                    <div className="flex items-end justify-between gap-2">
                        {/* Mode name badge */}
                        <div className={`bg-gradient-to-r ${style.color} px-3 py-1.5 rounded-lg shadow-lg`}>
                            <span className="text-white font-bold text-sm drop-shadow-md">
                                {formatMode(event.event.mode)}
                            </span>
                        </div>

                        {/* Modifiers */}
                        {event.event.modifiers && event.event.modifiers.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap justify-end">
                                {event.event.modifiers.map((mod) => (
                                    <span
                                        key={mod}
                                        className="bg-slate-900/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-slate-700/50"
                                    >
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        {mod}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-white mb-1 leading-tight">
                    {formatMode(event.event.mode)}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="truncate">{event.event.map}</span>
                </div>
            </div>
        </div>
    );
}


export default function EventsPage() {
    const [events, setEvents] = useState<ScheduledEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/events');
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            setEvents(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const now = new Date();
    const activeEvents = events.filter(e => {
        const start = parseApiTime(e.startTime);
        const end = parseApiTime(e.endTime);
        return now >= start && now < end;
    });

    const upcomingEvents = events.filter(e => {
        const start = parseApiTime(e.startTime);
        return now < start;
    });

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="https://cdn-misc.brawlify.com/front/Star.svg"
                                        alt="Events"
                                        className="w-full h-full object-contain drop-shadow-xl"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Event Rotation</h1>
                                    <p className="text-slate-400">Current and upcoming events in Brawl Stars</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchEvents}
                                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="glass-card p-8 text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Failed to Load Events</h2>
                            <p className="text-slate-400 mb-4">{error}</p>
                            <button onClick={fetchEvents} className="btn btn-primary">
                                Try Again
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="glass-card overflow-hidden">
                                    <div className="h-32 skeleton" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-6 skeleton w-3/4 rounded" />
                                        <div className="h-4 skeleton w-1/2 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Active Events */}
                            {activeEvents.length > 0 && (
                                <section className="mb-12">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                        <h2 className="text-xl font-bold text-white">Live Now</h2>
                                        <span className="text-slate-500 text-sm">({activeEvents.length} events)</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeEvents.map((event) => (
                                            <EventCard key={event.event.id} event={event} isLive={true} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Upcoming Events */}
                            {upcomingEvents.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <h2 className="text-xl font-bold text-white">Coming Up</h2>
                                    </div>

                                    <div className="glass-card overflow-hidden">
                                        <div className="divide-y divide-slate-800/50">
                                            {upcomingEvents.slice(0, 10).map((event) => {
                                                const style = getModeStyle(event.event.mode);
                                                const startDate = parseApiTime(event.startTime);
                                                const hoursUntil = Math.floor((startDate.getTime() - Date.now()) / (1000 * 60 * 60));
                                                const minutesUntil = Math.floor(((startDate.getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60));

                                                return (
                                                    <div
                                                        key={event.event.id}
                                                        className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors"
                                                    >
                                                        {/* Icon */}
                                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center shadow-lg`}>
                                                            <Gamepad2 className="w-6 h-6 text-white" />
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-white">{formatMode(event.event.mode)}</h4>
                                                            <p className="text-slate-400 text-sm truncate">{event.event.map}</p>
                                                        </div>

                                                        {/* Time until start */}
                                                        <div className="text-right">
                                                            <div className="text-cyan-400 font-medium">
                                                                Starts in {hoursUntil}h {minutesUntil}m
                                                            </div>
                                                            {event.event.modifiers && event.event.modifiers.length > 0 && (
                                                                <div className="flex items-center gap-1 justify-end mt-1">
                                                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                                                    <span className="text-xs text-amber-400">{event.event.modifiers.join(', ')}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {/* Game Modes Quick Link */}
                    <section className="mt-12">
                        <Link href="/gamemodes" className="glass-card p-6 block bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:border-indigo-500/30 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <Gamepad2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Game Modes</h3>
                                        <p className="text-slate-400 text-sm">Explore all available game modes</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-slate-400" />
                            </div>
                        </Link>
                    </section>
                </div>
            </main>
        </>
    );
}
