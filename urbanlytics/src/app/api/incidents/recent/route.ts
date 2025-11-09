import { NextResponse } from "next/server";

export async function GET() {
  const features = [
    { type: "Feature", geometry: { type: "Point", coordinates: [-114.07, 51.045] }, properties: { type: "collision", severity: 2 } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-114.09, 51.05] }, properties: { type: "break-in", severity: 3 } },
  ];
  return NextResponse.json({ type: "FeatureCollection", features });
}
