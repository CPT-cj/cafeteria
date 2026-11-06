import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/20 text-foreground",
  info: "bg-chart-2/20 text-foreground",
};

export function Badge({ tone = "neutral", className, ...props }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)} {...props} />;
}

export const statusTone = { SUCCESS: "success", ACTIVE: "success", PENDING: "warning", FAILED: "danger", CANCELED: "neutral" };
