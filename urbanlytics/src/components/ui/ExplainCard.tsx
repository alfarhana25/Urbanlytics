"use client";
export default function ExplainCard() {
  return (
    <section className="border rounded-lg p-3 text-sm">
      <h2 className="font-medium mb-2">Explainability</h2>
      <p>Select a hex on the map to view a breakdown like:</p>
      <ul className="list-disc ml-5 mt-2">
        <li>62/100 High — 45% crime, 35% traffic, 20% weather</li>
        <li>Night multiplier +20%</li>
      </ul>
    </section>
  );
}
