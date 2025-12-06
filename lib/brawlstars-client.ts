// ============================================
// Brawl Stars API Client
// Handles all API calls with proper encoding and error handling
// ============================================

import type {
    Player,
    Club,
    ClubMember,
    PlayerRanking,
    ClubRanking,
    Brawler,
    ScheduledEvent,
    Battle,
    GameMode,
    ApiError,
} from './types';

const API_BASE_URL = 'https://api.brawlstars.com/v1';

// Get API key from environment
const getApiKey = (): string => {
    const key = process.env.BRAWL_STARS_API_KEY;
    if (!key) {
        throw new Error('BRAWL_STARS_API_KEY environment variable is not set');
    }
    return key;
};

// Encode player/club tag (# must be encoded as %23)
export const encodeTag = (tag: string): string => {
    // Remove # if present and add encoded version
    const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
    return `%23${cleanTag}`;
};

// Decode tag for display
export const decodeTag = (encodedTag: string): string => {
    return encodedTag.replace('%23', '#');
};

// Generic fetch helper with error handling
async function fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${getApiKey()}`,
            Accept: 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const error: ApiError = await response.json();
            if (error.message) {
                errorMessage = error.message;
            }
            // Detail isn't always present or string, safe handling
            if (error.detail) {
                errorMessage += ` (${JSON.stringify(error.detail)})`;
            }
        } catch (e) {
            // response was not JSON
        }
        console.error(`Fetch failed for ${endpoint}:`, errorMessage);
        throw new Error(errorMessage);
    }

    return response.json();
}

// ============================================
// Player Endpoints
// ============================================

// Get player information
export async function fetchPlayer(tag: string): Promise<Player> {
    const encodedTag = encodeTag(tag);
    return fetchApi<Player>(`/players/${encodedTag}`);
}

// Get player battlelog
export async function fetchPlayerBattlelog(tag: string): Promise<{ items: Battle[] }> {
    const encodedTag = encodeTag(tag);
    return fetchApi<{ items: Battle[] }>(`/players/${encodedTag}/battlelog`);
}

// ============================================
// Club Endpoints
// ============================================

// Get club information
export async function fetchClub(tag: string): Promise<Club> {
    const encodedTag = encodeTag(tag);
    return fetchApi<Club>(`/clubs/${encodedTag}`);
}

// Get club members
export async function fetchClubMembers(tag: string): Promise<{ items: ClubMember[] }> {
    const encodedTag = encodeTag(tag);
    return fetchApi<{ items: ClubMember[] }>(`/clubs/${encodedTag}/members`);
}

// ============================================
// Ranking Endpoints
// ============================================

// Get player rankings
export async function fetchPlayerRankings(countryCode: string = 'global'): Promise<{ items: PlayerRanking[] }> {
    return fetchApi<{ items: PlayerRanking[] }>(`/rankings/${countryCode}/players`);
}

// Get club rankings
export async function fetchClubRankings(countryCode: string = 'global'): Promise<{ items: ClubRanking[] }> {
    return fetchApi<{ items: ClubRanking[] }>(`/rankings/${countryCode}/clubs`);
}

// Get brawler rankings
export async function fetchBrawlerRankings(
    countryCode: string = 'global',
    brawlerId: number
): Promise<{ items: PlayerRanking[] }> {
    return fetchApi<{ items: PlayerRanking[] }>(`/rankings/${countryCode}/brawlers/${brawlerId}`);
}

// ============================================
// Brawler Endpoints
// ============================================

// Get all brawlers
export async function fetchBrawlers(): Promise<{ items: Brawler[] }> {
    return fetchApi<{ items: Brawler[] }>('/brawlers');
}

// Get single brawler
export async function fetchBrawler(brawlerId: number): Promise<Brawler> {
    return fetchApi<Brawler>(`/brawlers/${brawlerId}`);
}

// ============================================
// Events Endpoints
// ============================================

// Get event rotation
export async function fetchEventRotation(): Promise<ScheduledEvent[]> {
    return fetchApi<ScheduledEvent[]>('/events/rotation');
}

// Get game modes
export async function fetchGameModes(): Promise<{ items: GameMode[] }> {
    return fetchApi<{ items: GameMode[] }>('/gamemodes');
}

// ============================================
// Utility Functions
// ============================================

// Format trophy number with comma
export function formatNumber(num: number): string {
    return num.toLocaleString();
}

// Format battle time to readable format
export function formatBattleTime(battleTime: string): string {
    // battleTime format: "20231217T120000.000Z"
    const year = battleTime.substring(0, 4);
    const month = battleTime.substring(4, 6);
    const day = battleTime.substring(6, 8);
    const hour = battleTime.substring(9, 11);
    const minute = battleTime.substring(11, 13);

    return `${day}/${month}/${year} ${hour}:${minute}`;
}

// Calculate time remaining
export function getTimeRemaining(endTime: string): { hours: number; minutes: number; seconds: number } {
    const end = new Date(
        endTime.substring(0, 4) + '-' +
        endTime.substring(4, 6) + '-' +
        endTime.substring(6, 8) + 'T' +
        endTime.substring(9, 11) + ':' +
        endTime.substring(11, 13) + ':' +
        endTime.substring(13, 15) + 'Z'
    );
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
}

// Get brawler image URL (using CDN or local assets)
export function getBrawlerImageUrl(brawlerId: number): string {
    // Using brawlify CDN for brawler images (borderless full body)
    return `https://cdn.brawlify.com/brawlers/borderless/${brawlerId}.png`;
}

// Get player icon URL
export function getPlayerIconUrl(iconId: number): string {
    return `https://cdn.brawlify.com/profile-icons/regular/${iconId}.png`;
}

// Get club badge URL
export function getClubBadgeUrl(badgeId: number): string {
    return `https://cdn.brawlify.com/club-badges/regular/${badgeId}.png`;
}

// Get mode icon URL
export function getModeIconUrl(mode: string): string {
    // API returns camelCase "gemGrab", Brawlify often expects "Gem Grab"
    const formatted = mode
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    return `https://cdn.brawlify.com/gamemode/${formatted}.png`;
}

// Parse name color to CSS
export function parseNameColor(colorCode: string): string {
    // Color code format: "0xffff8afb" - ARGB format
    if (colorCode.startsWith('0x')) {
        const hex = colorCode.substring(4); // Remove "0xff" alpha
        return `#${hex}`;
    }
    return colorCode;
}

// Get rank color based on rank
export function getRankColor(rank: number): string {
    if (rank >= 35) return '#FF0000'; // Red - Rank 35
    if (rank >= 30) return '#FF00FF'; // Magenta - Rank 30-34
    if (rank >= 25) return '#00FFFF'; // Cyan - Rank 25-29
    if (rank >= 20) return '#FFD700'; // Gold - Rank 20-24
    if (rank >= 15) return '#C0C0C0'; // Silver - Rank 15-19
    if (rank >= 10) return '#CD7F32'; // Bronze - Rank 10-14
    return '#FFFFFF'; // White - Below 10
}

// Get trophy milestone color
export function getTrophyColor(trophies: number): string {
    if (trophies >= 50000) return '#FF0000';
    if (trophies >= 40000) return '#FF00FF';
    if (trophies >= 30000) return '#00FFFF';
    if (trophies >= 20000) return '#FFD700';
    if (trophies >= 10000) return '#C0C0C0';
    return '#CD7F32';
}
