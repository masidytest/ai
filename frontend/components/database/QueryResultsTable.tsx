"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface QueryResultsTableProps {
  result: {
    columns?: string[];
    rows?: any[];
    error?: string;
  } | null;
}

const PAGE_SIZE = 10;

export function QueryResultsTable({ result }: QueryResultsTableProps) {
  const [page, setPage] = useState(0);
  if (!result) return null;
  if (result.error) {
    return (
      <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a] text-red-400">
        Error: {result.error}
      </Card>
    );
  }
  const columns = result.columns || [];
  const rows = result.rows || [];
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const pagedRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleCopy = (row: any) => {
    navigator.clipboard.writeText(JSON.stringify(row, null, 2));
  };

  const handleExport = () => {
    // Stub: just alert for now
    alert("Export feature coming soon!");
  };

  return (
    <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-purple-300">Query Results</h2>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-500 hover:to-blue-500 flex items-center gap-2"
          onClick={handleExport}
        >
          <Download size={16} /> Export
        </Button>
      </div>
      {columns.length === 0 ? (
        <div className="text-purple-200">No results.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#2d1a5a]">
                {columns.map(col => (
                  <th key={col} className="px-4 py-2 text-left text-purple-200">{col}</th>
                ))}
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, i) => (
                <tr key={i} className="hover:bg-[#22134a] transition">
                  {columns.map(col => (
                    <td key={col} className="px-4 py-2 text-purple-100">{row[col]}</td>
                  ))}
                  <td className="px-4 py-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-purple-800"
                      onClick={() => handleCopy(row)}
                      title="Copy row"
                    >
                      <Copy size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-3">
          <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            Prev
          </Button>
          <span className="text-purple-200 text-xs px-2">Page {page + 1} of {totalPages}</span>
          <Button size="sm" variant="ghost" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
