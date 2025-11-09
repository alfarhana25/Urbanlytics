export const METRIC_TYPES = {
  CRIME: "crime",
  POLLUTION: "pollution",
  PRICING: "pricing",
  TRANSIT: "transit",
};

function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

function seededInt(name: string, salt: string, min: number, max: number) {
  let h = 2166136261;
  const s = `${name}|${salt}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const n = Math.abs(h >>> 0) / 2 ** 32;
  return Math.round(min + n * (max - min));
}

export function deriveMetricBundle(name: string) {
  const crimeScore = seededInt(name, "crime", 15, 85);
  const aqi = seededInt(name, "aqi", 20, 130);
  const avgRent = seededInt(name, "rent", 900, 2200);
  const transitScore = seededInt(name, "transit", 30, 99);

  return {
    name,
    crimeScore,
    aqi,
    avgRent,
    transitScore,
  };
}

export function metricValue(bundle: any, metric: string) {
  switch (metric) {
    case METRIC_TYPES.CRIME:
      return bundle.crimeScore;
    case METRIC_TYPES.POLLUTION:
      return bundle.aqi;
    case METRIC_TYPES.PRICING:
      return bundle.avgRent;
    case METRIC_TYPES.TRANSIT:
      return bundle.transitScore;
    default:
      return 0;
  }
}

export function colorFor(value: number, metric: string) {
  switch (metric) {
    case METRIC_TYPES.CRIME:
      if (value < 35) return "#16a34a";
      if (value < 55) return "#eab308";
      return "#ef4444";
    case METRIC_TYPES.POLLUTION:
      if (value < 50) return "#22c55e";
      if (value <= 100) return "#f59e0b";
      return "#ef4444";
    case METRIC_TYPES.PRICING:
      if (value < 1300) return "#10b981";
      if (value < 1700) return "#f59e0b";
      return "#f43f5e";
    case METRIC_TYPES.TRANSIT:
      if (value >= 80) return "#22d3ee";
      if (value >= 60) return "#60a5fa";
      return "#64748b";
    default:
      return "#94a3b8";
  }
}

export function intensityFor(value: number, metric: string) {
  let n;
  switch (metric) {
    case METRIC_TYPES.CRIME:
      n = value / 100;
      break;
    case METRIC_TYPES.POLLUTION:
      n = value / 150;
      break;
    case METRIC_TYPES.PRICING:
      n = clamp((value - 1000) / 1200, 0, 1);
      break;
    case METRIC_TYPES.TRANSIT:
      n = 1 - value / 100;
      break;
    default:
      n = 0.5;
  }
  return clamp(0.25 + n * 0.55, 0.25, 0.8);
}
