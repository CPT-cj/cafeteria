"use client";

import { useFetch } from "@/hooks/useFetch";
import { formatToman, formatDay, formatDateTime, MEAL_LABELS, TX_TYPE_LABELS, TX_STATUS_LABELS, RESERVATION_STATUS_LABELS } from "@/lib/utils";
import { Badge, statusTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, Loaded } from "./shared";

const who = (u) => `${u.firstName} ${u.lastName} (${u.studentNumber})`;

export function ReservationsTab() {
  const state = useFetch("/api/admin/reservations");
  return (
    <Loaded state={state}>
      {state.data?.reservations.length === 0 ? <EmptyState title="رزروی ثبت نشده است" /> : (
        <Table heads={["دانشجو", "غذا", "روز و وعده", "مبلغ", "وضعیت", "زمان ثبت"]}>
          {state.data?.reservations.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3">{who(r.user)}</td>
              <td className="px-4 py-3 font-medium">{r.schedule.food.name}</td>
              <td className="px-4 py-3">{formatDay(r.schedule.date)} · {MEAL_LABELS[r.schedule.meal]}</td>
              <td className="px-4 py-3">{formatToman(r.price)}</td>
              <td className="px-4 py-3"><Badge tone={statusTone[r.status]}>{RESERVATION_STATUS_LABELS[r.status]}</Badge></td>
              <td className="px-4 py-3">{formatDateTime(r.createdAt)}</td>
            </tr>
          ))}
        </Table>
      )}
    </Loaded>
  );
}

export function TransactionsTab() {
  const state = useFetch("/api/admin/transactions");
  return (
    <Loaded state={state}>
      {state.data?.transactions.length === 0 ? <EmptyState title="تراکنشی ثبت نشده است" /> : (
        <Table heads={["دانشجو", "نوع", "شرح", "مبلغ", "وضعیت", "زمان"]}>
          {state.data?.transactions.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-3">{who(t.user)}</td>
              <td className="px-4 py-3">{TX_TYPE_LABELS[t.type]}</td>
              <td className="px-4 py-3 text-muted-foreground">{t.description}</td>
              <td className="px-4 py-3">{formatToman(t.amount)}</td>
              <td className="px-4 py-3"><Badge tone={statusTone[t.status]}>{TX_STATUS_LABELS[t.status]}</Badge></td>
              <td className="px-4 py-3">{formatDateTime(t.createdAt)}</td>
            </tr>
          ))}
        </Table>
      )}
    </Loaded>
  );
}
