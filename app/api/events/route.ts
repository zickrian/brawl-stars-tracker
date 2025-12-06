import { NextResponse } from 'next/server';
import { fetchEventRotation } from '@/lib/brawlstars-client';

export async function GET() {
    try {
        const events = await fetchEventRotation();
        return NextResponse.json(events);
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}
