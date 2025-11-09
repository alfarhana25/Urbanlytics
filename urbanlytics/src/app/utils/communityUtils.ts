import communitiesData from "@/data/communities/urbanlytics_communities.json";
import type { CommunityData } from "@/components/panels/LeftPanel";

/** Find community info by name (case-insensitive) */
export function getCommunityData(name: string): CommunityData | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  const match = (communitiesData as CommunityData[]).find(
    (c) => c.name.trim().toLowerCase() === normalized
  );
  return match || null;
}
