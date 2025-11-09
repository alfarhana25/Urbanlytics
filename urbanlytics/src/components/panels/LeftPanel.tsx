"use client";
import type React from "react";
import {
  Shield,
  Home,
  Wind,
  GraduationCap,
  Bus,
  Trees,
  UtensilsCrossed,
  Footprints,
  TrendingUp,
  X,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useCommunityStore } from "@/app/stores/communityStore";
import communitiesData from "@/data/communities/urbanlytics_communities.json";
import type { CommunityData } from "@/app/utils/communityUtils";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  GraduationCap,
  Bus,
  Trees,
  UtensilsCrossed,
  Footprints,
  Wind,
  Home,
  TrendingUp,
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-cyan-400";
  return "text-amber-400";
}
function getScoreBgColor(score: number) {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
  if (score >= 60) return "bg-cyan-500/10 border-cyan-500/30";
  return "bg-amber-500/10 border-amber-500/30";
}
function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Fair";
}

export function AnalyticsSidebar({ data }: { data: CommunityData }) {
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareTarget, setCompareTarget] = useState<CommunityData | null>(
    null
  );
  const clearCommunity = useCommunityStore((s) => s.clearCommunity);

  const allCommunities = communitiesData as CommunityData[];
  const allScores = [
    ...data.primaryMetrics.map((m) => m.score),
    ...data.secondaryMetrics.map((m) => m.score),
  ];
  const overallScore = Math.round(
    allScores.reduce((a, b) => a + b, 0) / allScores.length
  );

  const compareOverall =
    compareTarget &&
    Math.round(
      [
        ...compareTarget.primaryMetrics.map((m) => m.score),
        ...compareTarget.secondaryMetrics.map((m) => m.score),
      ].reduce((a, b) => a + b, 0) /
        (compareTarget.primaryMetrics.length +
          compareTarget.secondaryMetrics.length)
    );

  const findMetric = (arr: any[], label: string) =>
    arr.find((m) => m.label === label);

  return (
    <aside className="w-full md:w-96 lg:w-[450px] bg-card border-l border-border overflow-y-auto animate-slide-in relative">
      {/* ---- Close ---- */}
      <div className="absolute top-3 right-3 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => clearCommunity()}
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* ---- Header ---- */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {data.name} Community Insights
          </h2>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>

        {/* ---- Comparison Summary (top section) ---- */}
        {compareOpen && compareTarget ? (
          <Card className="p-6 bg-zinc-900/70 border-zinc-800 space-y-3">
            <div className="flex justify-between text-sm">
              <span>{data.name}</span>
              <span>{compareTarget.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`text-3xl font-bold ${getScoreColor(overallScore)}`}
              >
                {overallScore}
              </span>
              <span className="text-xs text-muted-foreground">vs</span>
              <span
                className={`text-3xl font-bold ${getScoreColor(
                  compareOverall!
                )}`}
              >
                {compareOverall}
              </span>
            </div>

            <div className="flex justify-between mt-2">
              <span
                className={`text-sm font-semibold ${getScoreColor(
                  overallScore
                )}`}
              >
                {getScoreLabel(overallScore)}
              </span>
              <span
                className={`text-sm font-semibold ${getScoreColor(
                  compareOverall!
                )}`}
              >
                {getScoreLabel(compareOverall!)}
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              Overall Livability Comparison
            </p>
          </Card>
        ) : (
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-cyan-500/10 border-blue-500/20 p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Overall Livability
              </p>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-bold text-foreground">
                  {overallScore}
                </span>
                <span className="text-2xl text-muted-foreground mb-2">
                  /100
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${overallScore}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${getScoreColor(overallScore)}`}
                >
                  {getScoreLabel(overallScore)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* ---- Key Metrics ---- */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Key Metrics
          </h3>
          {data.primaryMetrics.map((metric) => {
            const Icon = iconMap[metric.icon] || Shield;
            const other = compareTarget
              ? findMetric(compareTarget.primaryMetrics, metric.label)
              : null;

            return (
              <Card
                key={metric.label}
                className="p-4 bg-gradient-to-br from-background to-accent/30 border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${metric.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold">{metric.label}</span>
                  </div>
                  <div className="text-sm">
                    <span
                      className={`font-bold ${getScoreColor(metric.score)}`}
                    >
                      {metric.score}
                    </span>
                    {other && (
                      <span
                        className={`ml-2 ${
                          metric.score > other.score
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        vs {other.score}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 h-2 mb-1">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${metric.score}%` }}
                  />
                  {other && (
                    <div
                      className="h-2 rounded-full bg-pink-500 transition-all"
                      style={{ width: `${other.score}%` }}
                    />
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* ---- Secondary Metrics ---- */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Community Features
          </h3>
          {data.secondaryMetrics.map((metric) => {
            const Icon = iconMap[metric.icon] || Home;
            const other = compareTarget
              ? findMetric(compareTarget.secondaryMetrics, metric.label)
              : null;

            return (
              <Card
                key={metric.label}
                className={`p-4 ${getScoreBgColor(
                  metric.score
                )} border transition-all`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-semibold text-sm">{metric.label}</h4>
                  </div>
                  <div className="text-sm">
                    <span
                      className={`font-bold ${getScoreColor(metric.score)}`}
                    >
                      {metric.score}
                    </span>
                    {other && (
                      <span
                        className={`ml-2 ${
                          metric.score > other.score
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        vs {other.score}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 h-2 mb-1">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${metric.score}%` }}
                  />
                  {other && (
                    <div
                      className="h-2 rounded-full bg-pink-500 transition-all"
                      style={{ width: `${other.score}%` }}
                    />
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* ---- Compare Control ---- */}
        <div className="space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2"
            onClick={() => {
              if (compareOpen) {
                setCompareOpen(false);
                setCompareTarget(null);
              } else {
                setCompareOpen(true);
              }
            }}
          >
            <ArrowLeftRight size={16} />
            {compareOpen ? "Stop Comparison & Go Back" : "Compare with Other Communities"}
          </Button>

          {compareOpen && (
            <div className="mt-3 bg-zinc-900/40 rounded-xl p-4 border border-zinc-800 space-y-3">
              <select
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm"
                onChange={(e) => {
                  const match = allCommunities.find(
                    (c) => c.name === e.target.value
                  );
                  setCompareTarget(match || null);
                }}
                value={compareTarget?.name ?? ""}
              >
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
