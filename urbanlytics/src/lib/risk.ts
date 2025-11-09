export type RiskInputs = {
  crime_rate_norm: number;
  traffic_sev_norm: number;
  weather_risk_norm: number;
  time_of_day: "day" | "evening" | "night";
  lighting: "well-lit" | "unknown" | "poorly-lit";
};

export function scoreRisk(i: RiskInputs) {
  const base = 0.45 * i.crime_rate_norm + 0.35 * i.traffic_sev_norm + 0.2 * i.weather_risk_norm;

  const tom = i.time_of_day === "day" ? 0.9 : i.time_of_day === "evening" ? 1.0 : 1.2;
  const lm = i.lighting === "well-lit" ? 0.95 : i.lighting === "poorly-lit" ? 1.1 : 1.0;

  const r = 100 * base * tom * lm;
  return Math.max(0, Math.min(100, r));
}
