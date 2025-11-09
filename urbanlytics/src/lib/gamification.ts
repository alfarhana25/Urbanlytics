export function calcLevelProgress(xp: number, nextXp: number) {
  return Math.min(100, Math.round((xp / nextXp) * 100));
}
export function getBadgeTierColor(tier: "bronze" | "silver" | "gold") {
  return tier === "gold" ? "text-yellow-400" : tier === "silver" ? "text-slate-300" : "text-amber-600";
}
