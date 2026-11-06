import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <h1 className="text-xl font-bold">صفحه موردنظر پیدا نشد</h1>
      <p className="text-sm text-muted-foreground">نشانی را بررسی کنید یا به صفحه اصلی بازگردید.</p>
      <ButtonLink href="/">بازگشت به خانه</ButtonLink>
    </div>
  );
}
