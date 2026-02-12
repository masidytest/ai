"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Table {
  name: string;
  columns: { name: string; type: string; isNullable: boolean; isPrimary: boolean }[];
  foreignKeys: { column: string; referencesTable: string; referencesColumn: string }[];
}

async function fetchTables(databaseId: string): Promise<string[]> {
  const res = await fetch(`/api/databases/${databaseId}/schema`);
  return res.json();
}
async function fetchColumns(databaseId: string, table: string) {
  const res = await fetch(`/api/databases/${databaseId}/schema/${table}`);
  return res.json();
}
async function fetchForeignKeys(databaseId: string, table: string) {
  const res = await fetch(`/api/databases/${databaseId}/schema/${table}`);
  // For demo, assume foreign keys are included in columns fetch or mock
  return res.json();
}

export function SchemaExplorer({ databaseId }: { databaseId: string }) {
  const [tables, setTables] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [columns, setColumns] = useState<Record<string, any[]>>({});
  const [foreignKeys, setForeignKeys] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTables(databaseId)
      .then(setTables)
      .finally(() => setLoading(false));
  }, [databaseId]);

  const handleExpand = async (table: string) => {
    setExpanded(prev => ({ ...prev, [table]: !prev[table] }));
    if (!columns[table]) {
      const cols = await fetchColumns(databaseId, table);
      setColumns(prev => ({ ...prev, [table]: cols }));
    }
    if (!foreignKeys[table]) {
      const fks = await fetchForeignKeys(databaseId, table);
      setForeignKeys(prev => ({ ...prev, [table]: fks }));
    }
  };

  return (
    <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">
      <h2 className="text-lg font-semibold mb-2 text-purple-300">Schema Explorer</h2>
      {loading ? (
        <div className="text-purple-200 animate-pulse">Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className="text-purple-200">No tables found.</div>
      ) : (
        <ul className="space-y-2">
          {tables.map((table) => (
            <li key={table}>
              <button
                className="flex items-center gap-2 w-full text-left hover:bg-[#22134a] rounded px-2 py-1 transition"
                onClick={() => handleExpand(table)}
              >
                {expanded[table] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <span className="font-medium text-purple-200">{table}</span>
              </button>
              <AnimatePresence initial={false}>
                {expanded[table] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-6 mt-2"
                  >
                    <div className="mb-2">
                      <div className="text-xs text-purple-400 mb-1">Columns</div>
                      <ul className="space-y-1">
                        {(columns[table] || []).map((col) => (
                          <li key={col.name} className="flex items-center gap-2 text-sm">
                            {col.isPrimary && <Key size={14} className="text-yellow-400" />}
                            <span className="text-purple-100">{col.name}</span>
                            <span className="text-blue-300 ml-2">{col.type}</span>
                            {col.isNullable && <span className="ml-2 text-gray-400">NULL</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs text-purple-400 mb-1">Foreign Keys</div>
                      <ul className="space-y-1">
                        {(foreignKeys[table] || []).length === 0 ? (
                          <li className="text-gray-400 text-xs">None</li>
                        ) : (
                          (foreignKeys[table] || []).map((fk, i) => (
                            <li key={i} className="text-sm text-blue-200">
                              <span className="font-mono">{fk.column}</span> → <span className="font-mono">{fk.referencesTable}.{fk.referencesColumn}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
