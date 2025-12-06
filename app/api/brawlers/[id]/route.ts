import { NextResponse } from "next/server";
import { fetchBrawler } from "@/lib/brawlstars-client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const brawler = await fetchBrawler(parseInt(id));
        return NextResponse.json(brawler);
    } catch (error) {
        console.error("Failed to fetch brawler:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch brawler";
        const status = message.includes("not found") ? 404 : 500;
        return NextResponse.json(
            { error: message },
            { status }
        );
    }
}
