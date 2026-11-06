"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FoodsTab } from "./FoodsTab";
import { SchedulesTab } from "./SchedulesTab";
import { ReservationsTab, TransactionsTab } from "./ReadOnlyTabs";
import { UsersTab } from "./UsersTab";
import { AnnouncementsTab } from "./AnnouncementsTab";

const TABS = [
  { id: "foods", label: "غذاها", C: FoodsTab },
  { id: "schedules", label: "برنامه غذایی", C: SchedulesTab },
  { id: "reservations", label: "رزروها", C: ReservationsTab },
  { id: "users", label: "کاربران", C: UsersTab },
  { id: "transactions", label: "تراکنش‌ها", C: TransactionsTab },
  { id: "announcements", label: "اطلاعیه‌ها", C: AnnouncementsTab },
];

export function AdminPanel() {
  const [tab, setTab] = useState("foods");
  const Current = TABS.find((t) => t.id === tab).C;
  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="بخش‌های مدیریت" className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1">
        {TABS.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={cn("whitespace-nowrap rounded-xl px-4 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel"><Current /></div>
    </div>
  );
}
