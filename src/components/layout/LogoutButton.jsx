"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }
  return <Button variant="outline" size="sm" onClick={logout} disabled={busy}>{busy ? "در حال خروج…" : "خروج"}</Button>;
}
