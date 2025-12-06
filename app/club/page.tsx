import { Navbar } from '@/components/ui/Navbar';
import { Metadata } from 'next';
import Image from 'next/image';
import { SearchBar } from '@/components/ui/SearchBar';
import { Users, Search } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Club Tracker',
    description: 'Track Brawl Stars clubs, view members and statistics',
};

export default function ClubSearchPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="glass-card p-12">
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            <Image
                                src="https://cdn-misc.brawlify.com/icon/Club.png"
                                alt="Club Icon"
                                fill
                                className="object-contain drop-shadow-xl"
                                unoptimized
                            />
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Find a Club
                        </h1>
                        <p className="text-slate-400 max-w-lg mx-auto mb-8">
                            Enter a club tag to view detailed statistics, member lists, and trophy requirements.
                        </p>

                        <div className="max-w-md mx-auto relative">
                            {/* We need a Club Search Bar component, or adapt the existing one. 
                                For now, simpler to reuse SearchBar and route to /club/[tag] 
                                if we update SearchBar to support types.
                                OR, manual input here.
                            */}
                            <SearchBar placeholder="Enter club tag (e.g., #RED)" type="club" />
                            {/* Note: The current SearchBar likely routes to /player/[tag]. 
                                I should verify SearchBar implementation. 
                            */}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
