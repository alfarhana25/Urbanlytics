"use client";
import LayerToggles from "@/components/ui/LayerToggles";
import SafeRouteForm from "@/components/panels/SafeRouteForm";
import ExplainCard from "@/components/ui/ExplainCard";

export default function LeftPanel() {
  return (
    <aside className="w-[32vw] max-w-[520px] min-w-[320px] h-full border-r p-3 hidden md:flex flex-col gap-3">
      <LayerToggles />
      <SafeRouteForm />
      <ExplainCard />
    </aside>
  );
}
