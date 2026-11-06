import { cn } from "@/lib/utils";

const tones = {
  error: "border-danger/40 bg-danger/10 text-danger",
  success: "border-success/40 bg-success/10 text-success",
  info: "border-border bg-muted text-foreground",
};

export function Alert({ tone = "info", className, children }) {
  if (!children) return null;
  return <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm", tones[tone], className)}>{children}</div>;
}
