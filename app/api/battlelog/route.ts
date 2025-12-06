import { NextResponse } from 'next/server';
import { fetchPlayerBattlelog, encodeTag } from '@/lib/brawlstars-client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    if (!tag) {
        return NextResponse.json(
            { error: 'Player tag is required' },
            { status: 400 }
        );
    }

    try {
        const battlelog = await fetchPlayerBattlelog(tag);
        return NextResponse.json(battlelog);
    } catch (error) {
        console.error('Battlelog API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch battlelog' },
            { status: 500 }
        );
    }
}
