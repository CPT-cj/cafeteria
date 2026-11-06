"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/client";
import { formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Table, Loaded } from "./shared";

const EMPTY = { name: "", category: "", price: "", description: "", ingredients: "", imageUrl: "", isActive: true };

export function FoodsTab() {
  const state = useFetch("/api/admin/foods");
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function save(e) {
    e.preventDefault();
    const res = await api(editId ? `/api/admin/foods/${editId}` : "/api/admin/foods", { method: editId ? "PATCH" : "POST", body: form });
    setMsg(res.ok ? { tone: "success", text: editId ? "غذا ویرایش شد." : "غذای جدید افزوده شد." } : { tone: "error", text: res.error });
    if (res.ok) { setForm(EMPTY); setEditId(null); state.reload(); }
  }
  async function remove(f) {
    if (!confirm(`«${f.name}» حذف شود؟`)) return;
    const res = await api(`/api/admin/foods/${f.id}`, { method: "DELETE" });
    setMsg(res.ok ? { tone: "success", text: res.data.message || "غذا حذف شد." } : { tone: "error", text: res.error });
    state.reload();
  }
  async function toggle(f) {
    const res = await api(`/api/admin/foods/${f.id}`, { method: "PATCH", body: { isActive: !f.isActive } });
    if (!res.ok) setMsg({ tone: "error", text: res.error });
    state.reload();
  }
  function edit(f) {
    setEditId(f.id);
    setForm({ name: f.name, category: f.category, price: String(f.price), description: f.description ?? "", ingredients: f.ingredients ?? "", imageUrl: f.imageUrl ?? "", isActive: f.isActive });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title={editId ? "ویرایش غذا" : "افزودن غذای جدید"} />
        <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
          <Field label="نام غذا"><Input value={form.name} onChange={set("name")} required /></Field>
          <Field label="دسته‌بندی"><Input value={form.category} onChange={set("category")} required placeholder="مثلاً خورشت" /></Field>
          <Field label="قیمت (تومان)"><Input value={form.price} onChange={set("price")} inputMode="numeric" required /></Field>
          <Field label="نشانی تصویر" hint="مثلاً /plates/kebab.svg"><Input value={form.imageUrl} onChange={set("imageUrl")} dir="ltr" className="text-end" /></Field>
          <Field label="توضیحات" className="md:col-span-2"><Textarea value={form.description} onChange={set("description")} /></Field>
          <Field label="مواد تشکیل‌دهنده" className="md:col-span-2"><Input value={form.ingredients} onChange={set("ingredients")} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={set("isActive")} className="size-4 accent-[var(--primary)]" />فعال</label>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit">{editId ? "ذخیره تغییرات" : "افزودن غذا"}</Button>
            {editId && <Button variant="outline" onClick={() => { setEditId(null); setForm(EMPTY); }}>انصراف</Button>}
          </div>
        </form>
        {msg && <Alert tone={msg.tone} className="mt-4">{msg.text}</Alert>}
      </Card>

      <Loaded state={state}>
        <Table heads={["نام", "دسته", "قیمت", "وضعیت", "عملیات"]}>
          {state.data?.foods.map((f) => (
            <tr key={f.id}>
              <td className="px-4 py-3 font-medium">{f.name}</td>
              <td className="px-4 py-3">{f.category}</td>
              <td className="px-4 py-3">{formatToman(f.price)}</td>
              <td className="px-4 py-3"><Badge tone={f.isActive ? "success" : "neutral"}>{f.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="flex flex-wrap gap-1 px-4 py-2">
                <Button size="sm" variant="outline" onClick={() => edit(f)}>ویرایش</Button>
                <Button size="sm" variant="ghost" onClick={() => toggle(f)}>{f.isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}</Button>
                <Button size="sm" variant="ghost" className="text-danger" onClick={() => remove(f)}>حذف</Button>
              </td>
            </tr>
          ))}
        </Table>
      </Loaded>
    </div>
  );
}
