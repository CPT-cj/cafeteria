import { cn } from "@/lib/utils";

/** تصویر غذا؛ اگر تصویری نباشد یک بشقاب خالی نمایش داده می‌شود. */
export function FoodImage({ src, alt = "", className }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className={cn("object-contain", className)} />
  ) : (
    <span aria-hidden="true" className={cn("grid place-items-center", className)}>
      <span className="size-4/5 rounded-full border border-border bg-muted" />
    </span>
  );
}
