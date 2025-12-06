import { NextResponse } from "next/server";
import { fetchBrawlers } from "@/lib/brawlstars-client";

export async function GET() {
    try {
        const data = await fetchBrawlers();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch brawlers:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch brawlers";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
