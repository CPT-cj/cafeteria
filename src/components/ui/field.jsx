import { cn } from "@/lib/utils";

export const inputClass =
  "h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-card-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function Field({ label, hint, children, className }) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const Input = ({ className, ...props }) => <input className={cn(inputClass, className)} {...props} />;
export const Select = ({ className, ...props }) => <select className={cn(inputClass, className)} {...props} />;
export const Textarea = ({ className, ...props }) => <textarea className={cn(inputClass, "h-auto min-h-20 py-2", className)} {...props} />;
