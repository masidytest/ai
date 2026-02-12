"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EmailAccount {
  id: string;
  address: string;
}

interface EmailAccountsPanelProps {
  siteId: string;
}

export const EmailAccountsPanel: React.FC<EmailAccountsPanelProps> = ({ siteId }) => {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/hosting/api/sites/${siteId}/email`)
      .then(res => res.json())
      .then(data => setAccounts(data.accounts || []));
  }, [siteId]);

  async function handleAdd() {
    setLoading(true);
    await fetch(`/hosting/api/sites/${siteId}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: newEmail })
    });
    setShowAdd(false);
    setNewEmail("");
    // Refresh
    const res = await fetch(`/hosting/api/sites/${siteId}/email`);
    const data = await res.json();
    setAccounts(data.accounts || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    await fetch(`/hosting/api/sites/${siteId}/email/${id}`, { method: "DELETE" });
    setDeleting(null);
    // Refresh
    const res = await fetch(`/hosting/api/sites/${siteId}/email`);
    const data = await res.json();
    setAccounts(data.accounts || []);
    setLoading(false);
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4">
      <div className="font-semibold text-[#a259ff] mb-2">Email Accounts</div>
      <div className="mb-4 flex justify-end">
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          onClick={() => setShowAdd(true)}
        >
          Add Email
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-[#00fff7]">
          <thead>
            <tr className="bg-[#232347]">
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr><td colSpan={2} className="p-2 text-center text-[#a259ff]">No email accounts</td></tr>
            ) : (
              accounts.map(acc => (
                <tr key={acc.id} className="border-b border-[#232347]">
                  <td className="p-2 font-mono">{acc.address}</td>
                  <td className="p-2 text-right">
                    <Button
                      className="bg-red-500 text-white hover:bg-red-700 px-2 py-1 text-xs"
                      onClick={() => setDeleting(acc.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Add Email Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-[#232347] border border-[#a259ff]">
          <DialogHeader>
            <DialogTitle className="text-[#00fff7]">Add Email Account</DialogTitle>
          </DialogHeader>
          <Input
            className="bg-[#18192a] border-[#a259ff] text-[#00fff7]"
            placeholder="user@example.com"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            disabled={loading}
          />
          <DialogFooter>
            <Button
              className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
              onClick={handleAdd}
              disabled={loading || !newEmail}
            >
              Add
            </Button>
            <Button variant="outline" onClick={() => setShowAdd(false)} disabled={loading}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <DialogContent className="bg-[#232347] border border-[#a259ff]">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Email Account?</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-[#00fff7]">Are you sure you want to delete this email account?</div>
          <DialogFooter>
            <Button
              className="bg-red-500 text-white hover:bg-red-700"
              onClick={() => deleting && handleDelete(deleting)}
              disabled={loading}
            >
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={loading}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
