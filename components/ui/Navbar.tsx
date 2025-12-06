'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Users,
    Trophy,
    Swords,
    Calendar,
    GitCompare,
    Menu,
    X,
    Search,
    Gamepad2,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/leaderboards/players', label: 'Leaderboards', icon: Trophy },
    { href: '/brawlers', label: 'Brawlers', icon: Swords },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/compare', label: 'Compare', icon: GitCompare },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-amber-500/30 transition-shadow">
                                <Gamepad2 className="w-6 h-6 text-slate-900" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-white">Brawl</span>
                            <span className="text-lg font-bold text-gradient-gold">Tracker</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${active
                                            ? 'bg-slate-800 text-cyan-400'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }
                  `}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Search Button (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                            <Search size={18} />
                            <span className="text-sm">Search Player</span>
                            <kbd className="ml-2 px-2 py-0.5 text-xs bg-slate-700 rounded">⌘K</kbd>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50">
                    <div className="px-4 py-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                    transition-all duration-200
                    ${active
                                            ? 'bg-slate-800 text-cyan-400'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }
                  `}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
