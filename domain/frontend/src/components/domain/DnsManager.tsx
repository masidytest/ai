"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface DnsRecord {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: number;
}

interface DnsManagerProps {
  records: DnsRecord[];
  onAdd: (rec: Omit<DnsRecord, "id">) => void;
  onEdit: (rec: DnsRecord) => void;
  onDelete: (id: string) => void;
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS"];

export const DnsManager: React.FC<DnsManagerProps> = ({ records, onAdd, onEdit, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<DnsRecord | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4">
      <div className="font-semibold text-[#a259ff] mb-2">DNS Records</div>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-[#00fff7]">
            <th className="text-left">Type</th>
            <th className="text-left">Name</th>
            <th className="text-left">Value</th>
            <th className="text-left">TTL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id} className="border-b border-[#232347]">
              <td>{rec.type}</td>
              <td>{rec.name}</td>
              <td>{rec.value}</td>
              <td>{rec.ttl}</td>
              <td>
                <Button size="sm" variant="ghost" onClick={() => setShowEdit(rec)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowDelete(rec.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={() => setShowAdd(true)}>
        Add Record
      </Button>
      {/* Add Record Modal */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-[#18192a] border-[#232347]">
          <DialogHeader>
            <DialogTitle className="text-[#a259ff]">Add DNS Record</DialogTitle>
          </DialogHeader>
          <DnsRecordForm
            onSubmit={(rec) => {
              onAdd(rec);
              setShowAdd(false);
            }}
            onCancel={() => setShowAdd(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Edit Record Modal */}
      <Dialog open={!!showEdit} onOpenChange={(open) => !open && setShowEdit(null)}>
        <DialogContent className="bg-[#18192a] border-[#232347]">
          <DialogHeader>
            <DialogTitle className="text-[#a259ff]">Edit DNS Record</DialogTitle>
          </DialogHeader>
          {showEdit && (
            <DnsRecordForm
              initial={showEdit}
              onSubmit={(rec) => {
                onEdit({ ...rec, id: showEdit.id });
                setShowEdit(null);
              }}
              onCancel={() => setShowEdit(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <Dialog open={!!showDelete} onOpenChange={(open) => !open && setShowDelete(null)}>
        <DialogContent className="bg-[#18192a] border-[#232347]">
          <DialogHeader>
            <DialogTitle className="text-[#a259ff]">Delete DNS Record</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-[#fff]">Are you sure you want to delete this record?</div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDelete(null)}>Cancel</Button>
            <Button className="bg-red-500 text-white" onClick={() => { if (showDelete) onDelete(showDelete); setShowDelete(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// DNS Record Form
function DnsRecordForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Omit<DnsRecord, "id">;
  onSubmit: (rec: Omit<DnsRecord, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<DnsRecord, "id">>(
    initial || { type: "A", name: "", value: "", ttl: 3600 }
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex gap-2">
        <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
          <SelectTrigger className="w-28 bg-[#232347] text-[#a259ff] border-[#232347]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#232347] text-[#a259ff]">
            {RECORD_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="bg-[#232347] text-[#a259ff] border-[#232347]"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          className="bg-[#232347] text-[#a259ff] border-[#232347]"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
        />
        <Input
          className="bg-[#232347] text-[#a259ff] border-[#232347] w-20"
          placeholder="TTL"
          type="number"
          value={form.ttl}
          onChange={(e) => setForm((f) => ({ ...f, ttl: Number(e.target.value) }))}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white">Save</Button>
      </DialogFooter>
    </form>
  );
}
