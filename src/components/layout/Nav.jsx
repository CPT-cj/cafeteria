"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Nav({ links }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const item = (l, mobile) => (
    <Link
      key={l.href}
      href={l.href}
      onClick={() => setOpen(false)}
      aria-current={isActive(l.href) ? "page" : undefined}
      className={cn(
        "rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        isActive(l.href) ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
        mobile && "block",
      )}
    >
      {l.label}
    </Link>
  );

  return (
    <>
      <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 md:flex">{links.map((l) => item(l, false))}</nav>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="باز و بسته کردن منو"
        className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
      </button>
      {open && (
        <nav aria-label="ناوبری موبایل" className="absolute inset-x-0 top-full border-b border-border bg-background p-3 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">{links.map((l) => item(l, true))}</div>
        </nav>
      )}
    </>
  );
}
