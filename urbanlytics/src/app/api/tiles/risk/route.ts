import { NextResponse } from "next/server";

export async function GET() {
  const points = [
    { longitude: -114.0719, latitude: 51.0447, weight: 0.6 },
    { longitude: -114.06, latitude: 51.05, weight: 0.8 },
    { longitude: -114.09, latitude: 51.05, weight: 0.4 },
    { longitude: -114.08, latitude: 51.02, weight: 0.7 },
    { longitude: -114.10, latitude: 51.06, weight: 0.5 },
  ];
  return NextResponse.json({ points });
}
