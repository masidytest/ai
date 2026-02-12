"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MetricsChartsProps {
  serverId: string;
}

function Chart({ label, data, color }: { label: string; data: number[]; color: string }) {
  return (
    <div className="flex flex-col items-start mb-4 w-full">
      <span className="text-xs text-[#a259ff] mb-1">{label}</span>
      <div className="w-full h-20 bg-[#232347] rounded relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 100 32" preserveAspectRatio="none">
          <motion.polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data.map((v, i) => `${i * (100 / (data.length - 1))},${32 - (v / Math.max(...data, 1)) * 28}`).join(" ")}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  );
}

export const MetricsCharts: React.FC<MetricsChartsProps> = ({ serverId }) => {
  const [metrics, setMetrics] = useState<any[]>([]);

  async function fetchMetrics() {
    const res = await fetch(`/api/cloud/servers/${serverId}/metrics`);
    setMetrics(m => [...m.slice(-19), await res.json()]);
  }

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, [serverId]);

  return (
    <div className="w-full">
      <Chart label="CPU Usage (%)" data={metrics.map(m => m.cpu)} color="#00fff7" />
      <Chart label="RAM (MB)" data={metrics.map(m => m.ram)} color="#a259ff" />
      <Chart label="Disk (GB)" data={metrics.map(m => m.disk)} color="#7c3aed" />
      <Chart label="Network In (MBps)" data={metrics.map(m => m.netIn)} color="#38bdf8" />
      <Chart label="Network Out (MBps)" data={metrics.map(m => m.netOut)} color="#f472b6" />
    </div>
  );
};
