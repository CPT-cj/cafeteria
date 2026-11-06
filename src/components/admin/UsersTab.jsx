"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/client";
import { formatToman, ROLE_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, Loaded } from "./shared";

export function UsersTab() {
  const state = useFetch("/api/admin/users");
  const [msg, setMsg] = useState(null);

  async function patch(u, body) {
    const res = await api(`/api/admin/users/${u.id}`, { method: "PATCH", body });
    setMsg(res.ok ? null : { tone: "error", text: res.error });
    state.reload();
  }

  return (
    <div className="flex flex-col gap-4">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Loaded state={state}>
        <Table heads={["شماره دانشجویی", "نام", "موبایل", "نقش", "اعتبار", "وضعیت", "عملیات"]}>
          {state.data?.users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3">{u.studentNumber}</td>
              <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
              <td className="px-4 py-3">{u.phone}</td>
              <td className="px-4 py-3">{ROLE_LABELS[u.role]}</td>
              <td className="px-4 py-3">{formatToman(u.wallet?.balance ?? 0)}</td>
              <td className="px-4 py-3"><Badge tone={u.isActive ? "success" : "danger"}>{u.isActive ? "فعال" : "مسدود"}</Badge></td>
              <td className="flex flex-wrap gap-1 px-4 py-2">
                <Button size="sm" variant="outline" onClick={() => patch(u, { isActive: !u.isActive })}>{u.isActive ? "مسدودسازی" : "فعال‌سازی"}</Button>
                <Button size="sm" variant="ghost" onClick={() => patch(u, { role: u.role === "ADMIN" ? "STUDENT" : "ADMIN" })}>{u.role === "ADMIN" ? "تبدیل به دانشجو" : "ارتقا به مدیر"}</Button>
              </td>
            </tr>
          ))}
        </Table>
      </Loaded>
    </div>
  );
}
