"use client";

import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/empty-state";

export function Table({ heads, children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="bg-muted text-muted-foreground"><tr>{heads.map((h) => <th key={h} className="px-4 py-3 text-start font-medium">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

/** نمایش وضعیت بارگذاری / خطا برای نتیجه useFetch */
export function Loaded({ state, children }) {
  if (state.loading && !state.data) return <Spinner />;
  if (state.error && !state.data) return <Alert tone="error">{state.error}</Alert>;
  return children;
}
