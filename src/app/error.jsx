"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <h1 className="text-xl font-bold">مشکلی پیش آمد</h1>
      <p className="text-sm text-muted-foreground">بارگذاری صفحه با خطا روبه‌رو شد. لطفاً دوباره تلاش کنید.</p>
      <Button onClick={reset}>تلاش دوباره</Button>
    </div>
  );
}
