"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { DnsLinkPanel } from "@/components/hosting/DnsLinkPanel";
import { SslPanel } from "@/components/hosting/SslPanel";
import { EmailAccountsPanel } from "@/components/hosting/EmailAccountsPanel";
import { DeployPanel } from "@/components/hosting/DeployPanel";

interface HostingSite {
  id: string;
  domain: string;
  status: "creating" | "active" | "error";
  plan: string;
  ftpCredentials?: { user: string; password: string };
  sslEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const [site, setSite] = useState<HostingSite | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(`/hosting/api/sites/${params.id}`)
      .then(res => res.json())
      .then(setSite)
      .finally(() => setLoading(false));
  }, [params.id]);
  if (loading || !site) return <div className="text-center text-[#a259ff] mt-10">Loading site details...</div>;
  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-[#a259ff]">{site.domain}</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${site.status === "creating" ? "bg-yellow-500 text-black" : site.status === "active" ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>{site.status}</span>
          <span className="ml-auto text-[#00fff7] font-mono">{site.plan}</span>
        </div>
      </motion.div>
      <Tabs defaultValue="dns" className="w-full">
        <TabsList className="bg-[#232347] border border-[#232347] mb-4">
          <TabsTrigger value="dns">DNS Linking</TabsTrigger>
          <TabsTrigger value="ssl">SSL</TabsTrigger>
          <TabsTrigger value="email">Email Accounts</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
        </TabsList>
        <TabsContent value="dns">
          <DnsLinkPanel siteId={site.id} domain={site.domain} />
        </TabsContent>
        <TabsContent value="ssl">
          <SslPanel siteId={site.id} />
        </TabsContent>
        <TabsContent value="email">
          <EmailAccountsPanel siteId={site.id} />
        </TabsContent>
        <TabsContent value="deploy">
          <DeployPanel siteId={site.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
