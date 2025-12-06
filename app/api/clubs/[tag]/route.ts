import { NextResponse } from "next/server";
import { fetchClub } from "@/lib/brawlstars-client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ tag: string }> }
) {
    try {
        const { tag } = await params;
        const club = await fetchClub(tag);
        return NextResponse.json(club);
    } catch (error) {
        console.error("Failed to fetch club:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch club";
        const status = message.includes("not found") ? 404 : 500;
        return NextResponse.json(
            { error: message },
            { status }
        );
    }
}
