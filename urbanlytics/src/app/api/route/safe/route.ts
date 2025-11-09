import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const mode = searchParams.get("mode") || "safer";

  return NextResponse.json({
    from, to, mode,
    etaMin: mode === "safer" ? 18 : 15,
    riskScore: mode === "safer" ? 32 : 48,
    polyline: "_mock_polyline_",
  });
}
