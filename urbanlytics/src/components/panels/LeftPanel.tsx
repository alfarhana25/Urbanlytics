"use client";
import type React from "react";
import { Shield, Home, Wind, GraduationCap, Trees, UtensilsCrossed, Footprints, TrendingUp, X, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useCommunityStore } from "@/app/stores/communityStore";
import communitiesData from "@/data/communities/urbanlytics_communities.json";
import type { CommunityData } from "@/app/utils/communityUtils";

// ---------- PALETTE ----------
const PALETTE = {
  beigeBg: "#F6F0E9",
  beigePanel: "#FBF7EF",
  beigeBorder: "#E6DCCD",
  ink: "#2B271F",
  inkSoft: "#5A5246",
  olive: "#6B8F71",
  oliveDark: "#3E5F43",
  oliveLight: "#A3B18A",
  oliveTint: "#DDE6D7",
};

const iconMap: Record<string, React.ElementType> = {
  Shield,
  GraduationCap,
  Trees,
  UtensilsCrossed,
  Footprints,
  Wind,
  Home,
  TrendingUp,
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-olive-600";
  return "text-amber-600";
}
function getScoreBgColor(score: number) {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
  if (score >= 60) return "bg-olive-500/10 border-olive-500/30";
  return "bg-amber-500/10 border-amber-500/30";
}
function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Fair";
}

export function AnalyticsSidebar({ data }: { data: CommunityData }) {
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareTarget, setCompareTarget] = useState<CommunityData | null>(null);
  const clearCommunity = useCommunityStore((s) => s.clearCommunity);

  const allCommunities = communitiesData as CommunityData[];
  const allScores = [...data.primaryMetrics.map((m) => m.score), ...data.secondaryMetrics.map((m) => m.score)];
  const overallScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  const compareOverall =
    compareTarget && Math.round([...compareTarget.primaryMetrics.map((m) => m.score), ...compareTarget.secondaryMetrics.map((m) => m.score)].reduce((a, b) => a + b, 0) / (compareTarget.primaryMetrics.length + compareTarget.secondaryMetrics.length));

  const findMetric = (arr: any[], label: string) => arr.find((m) => m.label === label);

  return (
    <aside
      className="w-full md:w-96 lg:w-[450px] border-l overflow-y-auto animate-slide-in relative"
      style={{
        backgroundColor: PALETTE.beigeBg,
        borderColor: PALETTE.beigeBorder,
        color: PALETTE.ink,
      }}>
      {/* ---- Close ---- */}
      <div className="absolute top-3 right-3 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => clearCommunity()}
          style={{
            color: PALETTE.inkSoft,
          }}>
          <X size={16} />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* ---- Header ---- */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold" style={{ color: PALETTE.ink }}>
            {data.name} Community Insights
          </h2>
          <p className="text-sm" style={{ color: PALETTE.inkSoft }}>
            {data.description}
          </p>
        </div>

        {/* ---- Comparison Summary ---- */}
        {compareOpen && compareTarget ? (
          <Card
            className="p-6 space-y-3 border"
            style={{
              backgroundColor: PALETTE.beigePanel,
              borderColor: PALETTE.beigeBorder,
            }}>
            <div className="flex justify-between text-sm">
              <span>{data.name}</span>
              <span>{compareTarget.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</span>
              <span className="text-xs" style={{ color: PALETTE.inkSoft }}>
                vs
              </span>
              <span className={`text-3xl font-bold ${getScoreColor(compareOverall!)}`}>{compareOverall}</span>
            </div>

            <div className="flex justify-between mt-2">
              <span className={`text-sm font-semibold ${getScoreColor(overallScore)}`}>{getScoreLabel(overallScore)}</span>
              <span className={`text-sm font-semibold ${getScoreColor(compareOverall!)}`}>{getScoreLabel(compareOverall!)}</span>
            </div>

            <p className="text-xs" style={{ color: PALETTE.inkSoft }}>
              Overall Livability Comparison
            </p>
          </Card>
        ) : (
          <Card
            className="relative overflow-hidden border p-8"
            style={{
              backgroundColor: PALETTE.beigePanel,
              borderColor: PALETTE.beigeBorder,
            }}>
            <div className="relative space-y-4">
              <p className="text-sm uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
                Overall Livability
              </p>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-bold" style={{ color: PALETTE.ink }}>
                  {overallScore}
                </span>
                <span className="text-2xl mb-2" style={{ color: PALETTE.inkSoft }}>
                  /100
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-[rgba(0,0,0,0.05)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${overallScore}%`,
                      backgroundColor: PALETTE.oliveLight,
                    }}
                  />
                </div>
                <span className={`text-sm font-bold ${getScoreColor(overallScore)}`}>{getScoreLabel(overallScore)}</span>
              </div>
            </div>
          </Card>
        )}

        {/* ---- Key Metrics ---- */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
            Key Metrics
          </h3>
          {data.primaryMetrics.map((metric) => {
            const Icon = iconMap[metric.icon] || Shield;
            const other = compareTarget ? findMetric(compareTarget.primaryMetrics, metric.label) : null;

            return (
              <Card
                key={metric.label}
                className="p-4 border"
                style={{
                  backgroundColor: PALETTE.beigePanel,
                  borderColor: PALETTE.beigeBorder,
                }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: PALETTE.oliveLight,
                      }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold" style={{ color: PALETTE.ink }}>
                      {metric.label}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}</span>
                    {other && <span className={`ml-2 ${metric.score > other.score ? "text-emerald-600" : "text-rose-600"}`}>vs {other.score}</span>}
                  </div>
                </div>

                <div className="flex gap-2 h-2 mb-1">
                  <div className="h-2 rounded-full bg-[rgba(107,143,113,0.6)] transition-all" style={{ width: `${metric.score}%` }} />
                  {other && <div className="h-2 rounded-full bg-rose-400 transition-all" style={{ width: `${other.score}%` }} />}
                </div>

                <p className="text-xs" style={{ color: PALETTE.inkSoft }}>
                  {metric.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* ---- Secondary Metrics ---- */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
            Community Features
          </h3>
          {data.secondaryMetrics.map((metric) => {
            const Icon = iconMap[metric.icon] || Home;
            const other = compareTarget ? findMetric(compareTarget.secondaryMetrics, metric.label) : null;

            return (
              <Card
                key={metric.label}
                className="p-4 border transition-all"
                style={{
                  backgroundColor: PALETTE.beigePanel,
                  borderColor: PALETTE.beigeBorder,
                }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" style={{ color: PALETTE.oliveDark }} />
                    <h4 className="font-semibold text-sm" style={{ color: PALETTE.ink }}>
                      {metric.label}
                    </h4>
                  </div>
                  <div className="text-sm">
                    <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}</span>
                    {other && <span className={`ml-2 ${metric.score > other.score ? "text-emerald-600" : "text-rose-600"}`}>vs {other.score}</span>}
                  </div>
                </div>

                <div className="flex gap-2 h-2 mb-1">
                  <div className="h-2 rounded-full bg-[rgba(107,143,113,0.6)] transition-all" style={{ width: `${metric.score}%` }} />
                  {other && <div className="h-2 rounded-full bg-rose-400 transition-all" style={{ width: `${other.score}%` }} />}
                </div>

                <p className="text-xs" style={{ color: PALETTE.inkSoft }}>
                  {metric.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* ---- Compare Control ---- */}
        <div className="space-y-3">
          <Button
            className="w-full text-white font-semibold shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: PALETTE.olive,
              borderColor: PALETTE.oliveDark,
            }}
            onClick={() => {
              if (compareOpen) {
                setCompareOpen(false);
                setCompareTarget(null);
              } else {
                setCompareOpen(true);
              }
            }}>
            <ArrowLeftRight size={16} />
            {compareOpen ? "Stop Comparison & Go Back" : "Compare with Other Communities"}
          </Button>

          {compareOpen && (
            <div
              className="mt-3 rounded-xl p-4 space-y-3 border"
              style={{
                backgroundColor: PALETTE.beigePanel,
                borderColor: PALETTE.beigeBorder,
              }}>
              <select
                className="w-full p-2 rounded-lg text-sm"
                style={{
                  backgroundColor: PALETTE.beigeBg,
                  borderColor: PALETTE.beigeBorder,
                  color: PALETTE.inkSoft,
                }}
                onChange={(e) => {
                  const match = allCommunities.find((c) => c.name === e.target.value);
                  setCompareTarget(match || null);
                }}
                value={compareTarget?.name ?? ""}>
                <option value="">Select community...</option>
                {allCommunities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
