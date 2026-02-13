"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { DashboardLayout } from "../../components/DashboardLayout";
import { TopNavbar } from "../../components/TopNavbar";
import { BuildIndicator } from "../../components/BuildIndicator";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-app-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <TopNavbar />
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
      <BuildIndicator />
    </DashboardLayout>
  );
}
