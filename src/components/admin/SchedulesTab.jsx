"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/client";
import { formatToman, formatDay, formatDateTime, formatNumber, MEAL_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, Loaded } from "./shared";

export function SchedulesTab() {
  const foods = useFetch("/api/admin/foods");
  const state = useFetch("/api/admin/schedules");
  const [form, setForm] = useState({ foodId: "", date: "", meal: "LUNCH", capacity: "100", price: "", deadlineTime: "08:00" });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm((f) => {
    const next = { ...f, [k]: e.target.value };
    if (k === "meal") next.deadlineTime = e.target.value === "LUNCH" ? "08:00" : "15:00";
    if (k === "foodId") next.price = String(foods.data?.foods.find((x) => x.id === e.target.value)?.price ?? f.price);
    return next;
  });

  async function add(e) {
    e.preventDefault();
    const res = await api("/api/admin/schedules", { method: "POST", body: form });
    setMsg(res.ok ? { tone: "success", text: "وعده به برنامه غذایی افزوده شد." } : { tone: "error", text: res.error });
    if (res.ok) state.reload();
  }
  async function patch(s, body) {
    const res = await api(`/api/admin/schedules/${s.id}`, { method: "PATCH", body });
    if (!res.ok) setMsg({ tone: "error", text: res.error });
    state.reload();
  }
  async function editCapacity(s) {
    const v = prompt("ظرفیت جدید را وارد کنید:", String(s.capacity));
    if (v) patch(s, { capacity: v });
  }
  async function remove(s) {
    if (!confirm("این وعده از برنامه حذف شود؟")) return;
    const res = await api(`/api/admin/schedules/${s.id}`, { method: "DELETE" });
    setMsg(res.ok ? { tone: "success", text: "وعده حذف شد." } : { tone: "error", text: res.error });
    state.reload();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="افزودن غذا به برنامه روزانه / هفتگی" />
        <form onSubmit={add} className="grid gap-4 md:grid-cols-3">
          <Field label="غذا">
            <Select value={form.foodId} onChange={set("foodId")} required>
              <option value="">انتخاب کنید…</option>
              {foods.data?.foods.filter((f) => f.isActive).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </Select>
          </Field>
          <Field label="تاریخ"><Input type="date" value={form.date} onChange={set("date")} required /></Field>
          <Field label="وعده"><Select value={form.meal} onChange={set("meal")}><option value="LUNCH">ناهار</option><option value="DINNER">شام</option></Select></Field>
          <Field label="ظرفیت"><Input value={form.capacity} onChange={set("capacity")} inputMode="numeric" required /></Field>
          <Field label="قیمت (تومان)"><Input value={form.price} onChange={set("price")} inputMode="numeric" required /></Field>
          <Field label="پایان مهلت رزرو (همان روز)" hint="ساعت به وقت تهران"><Input type="time" value={form.deadlineTime} onChange={set("deadlineTime")} required /></Field>
          <div className="md:col-span-3"><Button type="submit">افزودن به برنامه</Button></div>
        </form>
        {msg && <Alert tone={msg.tone} className="mt-4">{msg.text}</Alert>}
      </Card>

      <Loaded state={state}>
        <Table heads={["تاریخ", "وعده", "غذا", "قیمت", "رزرو / ظرفیت", "مهلت", "وضعیت", "عملیات"]}>
          {state.data?.schedules.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-3">{formatDay(s.date)}</td>
              <td className="px-4 py-3">{MEAL_LABELS[s.meal]}</td>
              <td className="px-4 py-3 font-medium">{s.food.name}</td>
              <td className="px-4 py-3">{formatToman(s.price)}</td>
              <td className="px-4 py-3">{formatNumber(s.reservedCount)} / {formatNumber(s.capacity)}</td>
              <td className="px-4 py-3">{formatDateTime(s.reserveDeadline)}</td>
              <td className="px-4 py-3"><Badge tone={s.isActive ? "success" : "neutral"}>{s.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="flex flex-wrap gap-1 px-4 py-2">
                <Button size="sm" variant="outline" onClick={() => editCapacity(s)}>ظرفیت</Button>
                <Button size="sm" variant="ghost" onClick={() => patch(s, { isActive: !s.isActive })}>{s.isActive ? "غیرفعال" : "فعال"}</Button>
                <Button size="sm" variant="ghost" className="text-danger" onClick={() => remove(s)}>حذف</Button>
              </td>
            </tr>
          ))}
        </Table>
      </Loaded>
    </div>
  );
}
