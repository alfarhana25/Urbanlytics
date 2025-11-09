import type React from "react";
import { Shield, Home, Wind, GraduationCap, Bus, Trees, UtensilsCrossed, Footprints, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface PrimaryMetric {
  icon: string;
  label: string;
  score: number;
  cityAverage: number;
  description: string;
  color: string;
  trend: string;
}

interface SecondaryMetric {
  icon: string;
  label: string;
  score: number;
  description: string;
}

export interface CommunityData {
  name: string;
  city: string;
  description: string;
  primaryMetrics: PrimaryMetric[];
  secondaryMetrics: SecondaryMetric[];
}

interface AnalyticsSidebarProps {
  data: CommunityData;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-cyan-400";
  return "text-amber-400";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Fair";
}

function getScoreBgColor(score: number) {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
  if (score >= 60) return "bg-cyan-500/10 border-cyan-500/30";
  return "bg-amber-500/10 border-amber-500/30";
}

export function AnalyticsSidebar({ data }: AnalyticsSidebarProps) {
  const allScores = [...data.primaryMetrics.map((m) => m.score), ...data.secondaryMetrics.map((m) => m.score)];
  const overallScore = Math.round(allScores.reduce((acc, score) => acc + score, 0) / allScores.length);

  return (
    <aside className="w-full md:w-96 lg:w-[450px] bg-card border-r border-border overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground text-balance">{data.name} Community Insights</h2>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>

        {/* Overall Score - Larger, more prominent */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-cyan-500/10 border-blue-500/20 p-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
          <div className="relative space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Overall Livability</p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-foreground">{overallScore}</span>
              <span className="text-2xl text-muted-foreground mb-2">/100</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${overallScore}%` }} />
              </div>
              <span className={`text-sm font-bold ${getScoreColor(overallScore)}`}>{getScoreLabel(overallScore)}</span>
            </div>
          </div>
        </Card>

        {/* Primary Metrics - Large feature cards with comparisons */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Key Metrics</h3>
          {data.primaryMetrics.map((metric) => {
            const Icon = iconMap[metric.icon] || Shield;
            const difference = metric.score - metric.cityAverage;
            return (
              <Card key={metric.label} className="p-5 bg-gradient-to-br from-background to-accent/30 border-border/50">
                <div className="flex gap-4">
                  {/* Icon and Score Circle */}
                  <div className="relative shrink-0">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center">
                      <span className={`text-xs font-bold ${getScoreColor(metric.score)}`}>{metric.score}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-foreground">{metric.label}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{metric.trend}</span>
                    </div>

                    {/* Comparison bar */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${metric.color} rounded-full`} style={{ width: `${metric.score}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          City avg: <span className="font-semibold">{metric.cityAverage}</span>
                        </span>
                        <span className={`font-bold ${difference > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                          {difference > 0 ? "+" : ""}
                          {difference} points
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Secondary Metrics - Compact grid layout */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Community Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {data.secondaryMetrics.map((metric) => {
              const Icon = iconMap[metric.icon] || Home;
              return (
                <Card key={metric.label} className={`p-4 ${getScoreBgColor(metric.score)} border`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Icon className="w-5 h-5 text-cyan-400" />
                      <span className={`text-xl font-bold ${getScoreColor(metric.score)}`}>{metric.score}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">{metric.label}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{metric.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-blue-500/20">Compare with Other Communities</Button>
      </div>
    </aside>
  );
}

const demoCommunity: CommunityData = {
  name: "Riverside Quarter",
  city: "Calgary",
  description: "A riverside neighbourhood blending cultural venues, green corridors, and tech-forward infrastructure.",
  primaryMetrics: [
    {
      icon: "Shield",
      label: "Safety index",
      score: 82,
      cityAverage: 74,
      description: "Crime incidents are trending downward with expanded community patrol coverage.",
      color: "from-blue-500 to-teal-500",
      trend: "+5 pts vs last month",
    },
    {
      icon: "Home",
      label: "Housing stability",
      score: 76,
      cityAverage: 68,
      description: "Balanced mix of long-term rentals and owner-occupied homes keeps turnover low.",
      color: "from-violet-500 to-indigo-500",
      trend: "+3 pts vs city avg",
    },
    {
      icon: "Wind",
      label: "Air quality",
      score: 88,
      cityAverage: 71,
      description: "Prevailing winds and active tree canopy projects maintain excellent AQI readings.",
      color: "from-emerald-500 to-lime-500",
      trend: "Steady month-over-month",
    },
  ],
  secondaryMetrics: [
    {
      icon: "GraduationCap",
      label: "Schools + STEM labs",
      score: 84,
      description: "Two magnet programs and a new STEM incubator serve K-12 learners.",
    },
    {
      icon: "Bus",
      label: "Transit reach",
      score: 78,
      description: "Light-rail access plus five rapid bus corridors within a 10-minute walk.",
    },
    {
      icon: "UtensilsCrossed",
      label: "Food access",
      score: 72,
      description: "Local grocers and late-night cafés keep amenity gaps low.",
    },
    {
      icon: "Trees",
      label: "Green canopy",
      score: 81,
      description: "Urban forest program adds 400+ trees every spring.",
    },
  ],
};

export default function LeftPanel() {
  return <AnalyticsSidebar data={demoCommunity} />;
}
