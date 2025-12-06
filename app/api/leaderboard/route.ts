import { NextResponse } from "next/server";
import {
    fetchPlayerRankings,
    fetchClubRankings,
    fetchBrawlerRankings,
    fetchPlayer,
} from "@/lib/brawlstars-client";

// Enrich player ranking data with actual trophy counts if API returns invalid data
async function enrichPlayerRankings(rankings: any): Promise<any> {
    if (!rankings.items || rankings.items.length === 0) {
        return rankings;
    }

    // Check if trophy data seems invalid (top players should have 50k+ trophies)
    const firstPlayerTrophies = rankings.items[0]?.trophies || 0;

    // If trophies seem correct (> 10000 for top player), return as is
    if (firstPlayerTrophies > 10000) {
        return rankings;
    }

    console.log("Detected possibly invalid trophy data, enriching with player data...");

    // Enrich first 50 players with actual trophy data (in batches to avoid rate limits)
    const enrichedItems = await Promise.all(
        rankings.items.slice(0, 50).map(async (player: any) => {
            try {
                // Only fetch if trophies seem invalid
                if (player.trophies < 10000) {
                    const fullPlayer = await fetchPlayer(player.tag);
                    return {
                        ...player,
                        trophies: fullPlayer.trophies,
                        highestTrophies: fullPlayer.highestTrophies,
                    };
                }
                return player;
            } catch (error) {
                // If fetch fails, return original data
                console.error(`Failed to enrich player ${player.tag}:`, error);
                return player;
            }
        })
    );

    // Combine enriched items with remaining items
    return {
        items: [
            ...enrichedItems,
            ...rankings.items.slice(50),
        ],
    };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const countryCode = searchParams.get("countryCode") || "global";
    const type = searchParams.get("type") || "players";
    const brawlerId = searchParams.get("brawlerId");
    const enrich = searchParams.get("enrich") !== "false"; // Enable by default

    try {
        let data;

        if (type === "players") {
            const rankings = await fetchPlayerRankings(countryCode);
            // Enrich player data if trophy values seem incorrect
            data = enrich ? await enrichPlayerRankings(rankings) : rankings;
        } else if (type === "clubs") {
            data = await fetchClubRankings(countryCode);
        } else if (type === "brawlers") {
            if (!brawlerId) {
                return NextResponse.json(
                    { error: "brawlerId is required for brawler rankings" },
                    { status: 400 }
                );
            }
            data = await fetchBrawlerRankings(countryCode, parseInt(brawlerId));
        } else {
            return NextResponse.json(
                { error: "Invalid type. Use 'players', 'clubs', or 'brawlers'" },
                { status: 400 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch leaderboard";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
