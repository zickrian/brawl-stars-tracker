import { NextResponse } from 'next/server';
import { fetchPlayer } from '@/lib/brawlstars-client';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ tag: string }> }
) {
    try {
        const { tag } = await params;
        const player = await fetchPlayer(tag);
        return NextResponse.json(player);
    } catch (error) {
        console.error('Failed to fetch player:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch player';
        const status = message.includes('not found') ? 404 : 500;
        return NextResponse.json(
            { error: message },
            { status }
        );
    }
}
