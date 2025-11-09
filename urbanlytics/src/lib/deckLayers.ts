import { HexagonLayer } from "@deck.gl/aggregation-layers";

type Pt = { longitude: number; latitude: number; weight?: number };

export function getHexagonLayer(points: Pt[]) {
  return new HexagonLayer<Pt>({
    id: "risk-hex",
    data: points,
    getPosition: (d) => [d.longitude, d.latitude],
    getElevationWeight: (d) => d.weight ?? 1,
    elevationScale: 50,
    extruded: true,
    radius: 300,
    coverage: 0.9,
    pickable: true,
  });
}
