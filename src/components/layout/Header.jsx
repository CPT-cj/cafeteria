import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatToman } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Nav } from "./Nav";
import { ThemeToggle } from "./ThemeToggle";
import { LogoutButton } from "./LogoutButton";

export async function Header() {
  const user = await getCurrentUser();
  const wallet = user ? await prisma.wallet.findUnique({ where: { userId: user.id } }) : null;

  const links = [{ href: "/", label: "خانه" }, { href: "/menu", label: "منوی غذا" }];
  if (user) links.push({ href: "/reserves", label: "رزرو غذا" }, { href: "/transactions", label: "تراکنش‌ها" }, { href: "/wallet", label: "افزایش اعتبار" });
  if (user?.role === "ADMIN") links.push({ href: "/admin", label: "مدیریت" });

  return (
    <header className="relative z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>
          </span>
          <span>سلف دانشگاه</span>
        </Link>
        <div className="flex-1 md:px-4"><Nav links={links} /></div>
        <div className="flex items-center gap-2">
          {user && (
            <Link href="/wallet" className="hidden rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium sm:inline-block" title="موجودی اعتبار">
              {formatToman(wallet?.balance ?? 0)}
            </Link>
          )}
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground lg:inline">{user.firstName} {user.lastName}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="outline" size="sm">ورود</ButtonLink>
              <ButtonLink href="/register" size="sm" className="hidden sm:inline-flex">ثبت‌نام</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
