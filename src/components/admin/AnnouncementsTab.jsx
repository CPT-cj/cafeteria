"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/client";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Field, Input, Textarea } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/empty-state";
import { Loaded } from "./shared";

export function AnnouncementsTab() {
  const state = useFetch("/api/admin/announcements");
  const [form, setForm] = useState({ title: "", body: "" });
  const [msg, setMsg] = useState(null);

  async function publish(e) {
    e.preventDefault();
    const res = await api("/api/admin/announcements", { method: "POST", body: form });
    setMsg(res.ok ? { tone: "success", text: "اطلاعیه منتشر شد." } : { tone: "error", text: res.error });
    if (res.ok) { setForm({ title: "", body: "" }); state.reload(); }
  }
  async function remove(id) {
    if (!confirm("این اطلاعیه حذف شود؟")) return;
    await api(`/api/admin/announcements/${id}`, { method: "DELETE" });
    state.reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="انتشار اطلاعیه جدید" />
        <form onSubmit={publish} className="flex flex-col gap-4">
          <Field label="عنوان"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="متن اطلاعیه"><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required /></Field>
          <div><Button type="submit">انتشار</Button></div>
        </form>
        {msg && <Alert tone={msg.tone} className="mt-4">{msg.text}</Alert>}
      </Card>
      <Loaded state={state}>
        {state.data?.announcements.length === 0 ? <EmptyState title="اطلاعیه‌ای منتشر نشده است" /> : (
          <ul className="flex flex-col gap-3">
            {state.data?.announcements.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                <div><p className="font-medium">{a.title}</p><p className="mt-1 text-sm text-muted-foreground">{a.body}</p><p className="mt-2 text-xs text-muted-foreground">{formatDateTime(a.createdAt)}</p></div>
                <Button size="sm" variant="ghost" className="text-danger" onClick={() => remove(a.id)}>حذف</Button>
              </li>
            ))}
          </ul>
        )}
      </Loaded>
    </div>
  );
}
