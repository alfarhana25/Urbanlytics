"use client";
import { create } from "zustand";
import type { CommunityData } from "@/components/panels/LeftPanel";

interface CommunityStore {
  selectedCommunity: CommunityData | null;
  setCommunity: (community: CommunityData) => void;
  clearCommunity: () => void;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  selectedCommunity: null,
  setCommunity: (community) => set({ selectedCommunity: community }),
  clearCommunity: () => set({ selectedCommunity: null }),
}));
