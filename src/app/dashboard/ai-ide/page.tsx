"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AiIde from "../../../components/AiIde";

function AiIdeWithPrompt() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? undefined;
  return <AiIde initialPrompt={initialPrompt} />;
}

export default function AiIdeDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full bg-app-bg text-app-text">Loading IDE...</div>}>
      <AiIdeWithPrompt />
    </Suspense>
  );
}
