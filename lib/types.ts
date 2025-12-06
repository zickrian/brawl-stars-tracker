// ============================================
// Brawl Stars API Types
// Based on official API documentation
// ============================================

// Player Icon
export interface PlayerIcon {
    id: number;
}

// Player Club (minimal info when viewing player)
export interface PlayerClub {
    tag: string;
    name: string;
}

// Accessory (Gadget)
export interface Accessory {
    id: number;
    name: string;
}

// Star Power
export interface StarPower {
    id: number;
    name: string;
}

// Gear Stat
export interface GearStat {
    id: number;
    name: string;
    level: number;
}

// Brawler Stat (player's brawler data)
export interface BrawlerStat {
    id: number;
    name: string;
    trophies: number;
    highestTrophies: number;
    rank: number;
    power: number;
    currentWinStreak: number;
    maxWinStreak: number;
    gadgets: Accessory[];
    starPowers: StarPower[];
    gears: GearStat[];
}

// Full Player Profile
export interface Player {
    tag: string;
    name: string;
    nameColor: string;
    icon: PlayerIcon;
    trophies: number;
    highestTrophies: number;
    expLevel: number;
    expPoints: number;
    soloVictories: number;
    duoVictories: number;
    '3vs3Victories': number;
    bestRoboRumbleTime: number;
    bestTimeAsBigBrawler: number;
    isQualifiedFromChampionshipChallenge: boolean;
    club?: PlayerClub;
    brawlers: BrawlerStat[];
}

// Club Member
export interface ClubMember {
    icon: PlayerIcon;
    tag: string;
    name: string;
    trophies: number;
    role: 'member' | 'senior' | 'vicePresident' | 'president' | 'unknown';
    nameColor: string;
}

// Full Club
export interface Club {
    tag: string;
    name: string;
    description: string;
    trophies: number;
    requiredTrophies: number;
    type: 'open' | 'inviteOnly' | 'closed' | 'unknown';
    badgeId: number;
    members: ClubMember[];
}

// Player Ranking Club (minimal)
export interface PlayerRankingClub {
    name: string;
}

// Player Ranking
export interface PlayerRanking {
    tag: string;
    name: string;
    nameColor: string;
    icon: PlayerIcon;
    trophies: number;
    rank: number;
    club?: PlayerRankingClub;
}

// Club Ranking
export interface ClubRanking {
    tag: string;
    name: string;
    trophies: number;
    rank: number;
    memberCount: number;
    badgeId: number;
}

// Brawler (global database)
export interface Brawler {
    id: number;
    name: string;
    gadgets: Accessory[];
    starPowers: StarPower[];
}

// Event
export interface Event {
    modeId: number;
    mode: string;
    id: number;
    map: string;
}

// Scheduled Event
export interface ScheduledEvent {
    event: {
        modeId: number;
        mode: string;
        modifiers: string[];
        id: number;
        map: string;
    };
    slotId: number;
    startTime: string;
    endTime: string;
}

// Battle (from battlelog)
export interface Battle {
    battleTime: string;
    event: Event;
    battle: BattleResult;
}

// Battle Result
export interface BattleResult {
    mode?: string;
    type?: string;
    result?: 'victory' | 'defeat' | 'draw';
    duration?: number;
    trophyChange?: number;
    starPlayer?: {
        tag: string;
        name: string;
        brawler: {
            id: number;
            name: string;
            power: number;
            trophies: number;
        };
    };
    teams?: BattleTeam[][];
    players?: BattlePlayer[];
}

// Battle Team
export interface BattleTeam {
    tag: string;
    name: string;
    brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
    };
}

// Battle Player (for solo modes)
export interface BattlePlayer {
    tag: string;
    name: string;
    brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
    };
}

// Game Mode
export interface GameMode {
    id: number;
    name: string;
}

// API Error
export interface ApiError {
    reason: string;
    message: string;
    type: string;
    detail?: unknown;
}

// Country Code for rankings
export type CountryCode = 'global' | string;

// Service Version
export interface ServiceVersion {
    major: number;
    minor: number;
    content: number;
}
