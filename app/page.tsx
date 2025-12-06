import Link from 'next/link';
import {
  Trophy, Users, Swords, Calendar, GitCompare, TrendingUp,
  ArrowRight, Sparkles, Zap, Target, ChevronRight, Star
} from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Navbar } from '@/components/ui/Navbar';

// Feature card data
const features = [
  {
    icon: Trophy,
    title: 'Player Stats',
    description: 'Track trophies, victories, and detailed statistics for any player',
    href: '/player',
    gradient: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(251, 191, 36, 0.3)',
  },
  {
    icon: Users,
    title: 'Club Tracker',
    description: 'View club info, members, rankings and performance metrics',
    href: '/club',
    gradient: 'from-cyan-500 to-blue-500',
    glowColor: 'rgba(34, 211, 238, 0.3)',
  },
  {
    icon: Swords,
    title: 'Brawlers',
    description: 'Explore all brawlers with their abilities and top players',
    href: '/brawlers',
    gradient: 'from-purple-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.3)',
  },
  {
    icon: Calendar,
    title: 'Event Rotation',
    description: 'Live events and upcoming game modes with countdown',
    href: '/events',
    gradient: 'from-green-500 to-emerald-500',
    glowColor: 'rgba(34, 197, 94, 0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Leaderboards',
    description: 'Global and regional rankings for players and clubs',
    href: '/leaderboards/players',
    gradient: 'from-red-500 to-rose-500',
    glowColor: 'rgba(239, 68, 68, 0.3)',
  },
  {
    icon: GitCompare,
    title: 'Compare',
    description: 'Compare stats between multiple players side by side',
    href: '/compare',
    gradient: 'from-indigo-500 to-violet-500',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
];



import { fetchBrawlers, fetchGameModes } from '@/lib/brawlstars-client';

export default async function Home() {
  // Fetch dynamic stats
  let brawlersCount = '80+';
  let modesCount = '15+';

  try {
    const [brawlersData, modesData] = await Promise.all([
      fetchBrawlers(),
      fetchGameModes()
    ]);
    brawlersCount = `${brawlersData.items.length}+`;
    modesCount = `${modesData.items.length}+`;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }

  const quickStats = [
    { label: 'Brawlers', value: brawlersCount, icon: Swords },
    { label: 'Game Modes', value: modesCount, icon: Target },
    { label: 'Players Tracked', value: '1M+', icon: Users },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-300">The Ultimate Brawl Stars Companion</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Track Your</span>
                <br />
                <span className="text-gradient-gold">Brawl Stars</span>
                <span className="text-white"> Journey</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                Comprehensive statistics, real-time tracking, and powerful analytics
                to help you dominate in Brawl Stars
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <SearchBar
                  size="lg"
                  placeholder="Enter player tag (e.g., #2PP)"
                  autoFocus
                />
              </div>

              {/* Helper Text */}
              <p className="text-sm text-slate-500">
                Not sure where to find your tag?{' '}
                <button className="text-cyan-400 hover:underline">Learn how</button>
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section className="relative border-y border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Powerful tools and real-time data to analyze performance,
              track progress, and improve your gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group glass-card p-6 hover:border-slate-600/50 transition-all duration-300"
                  style={{
                    ['--glow-color' as string]: feature.glowColor,
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 8px 24px ${feature.glowColor}` }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient-gold transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500 group-hover:text-cyan-400 transition-colors">
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="glass-card p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-6 animate-pulse-glow">
                <Zap className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start Tracking Now
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">
                Enter your player tag above to see your complete statistics,
                battlelog, and brawler collection
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/leaderboards/players" className="btn btn-primary">
                  <Trophy className="w-5 h-5" />
                  View Leaderboards
                </Link>
                <Link href="/brawlers" className="btn btn-secondary">
                  <Swords className="w-5 h-5" />
                  Browse Brawlers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Star className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <span className="font-bold text-white">Brawl</span>
                  <span className="font-bold text-gradient-gold">Tracker</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span>Not affiliated with Supercell</span>
                <span className="hidden sm:inline">•</span>
                <span>Data from Brawl Stars API</span>
              </div>

              <div className="text-sm text-slate-600">
                © 2024 BrawlTracker
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
