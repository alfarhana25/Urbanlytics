// src/lib/types.ts

/** Represents a collectable achievement (bronze/silver/gold) */
export type BadgeTier = "bronze" | "silver" | "gold";

export interface Badge {
  /** Unique identifier for the badge */
  id: string;

  /** Display name of the badge (e.g., "Safety Scout") */
  name: string;

  /** Optional Lucide icon name (e.g., "Shield", "Bus", "Trees") */
  icon?: string;

  /** Rarity / tier of the badge */
  tier: BadgeTier;

  /** Whether the user has earned it yet */
  earned: boolean;

  /** Optional short hint for locked badges */
  hint?: string;
}

/** A single daily or session-based micro challenge */
export interface Quest {
  /** Unique identifier */
  id: string;

  /** The user-facing quest text (e.g., "Compare 2 communities") */
  title: string;

  /** XP reward for completion */
  xp: number;

  /** Whether it’s done or still active */
  done: boolean;

  /** Optional Lucide icon for visuals */
  icon?: string;
}

/** Tracks overall user progress in the gamified dashboard */
export interface UserProgress {
  /** Current player level */
  level: number;

  /** XP currently earned toward next level */
  xp: number;

  /** XP required to reach next level */
  nextXp: number;

  /** Ongoing streak counter (e.g., 4-day exploration streak) */
  streakDays: number;

  /** Active quests displayed in the panel */
  quests: Quest[];

  /** List of unlocked or pending badges */
  badges: Badge[];
}
