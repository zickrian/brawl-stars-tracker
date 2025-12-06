import { NextResponse } from "next/server";
import { fetchGameModes } from "@/lib/brawlstars-client";

export async function GET() {
    try {
        const data = await fetchGameModes();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch game modes:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch game modes";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
