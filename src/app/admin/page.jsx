import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PageTitle } from "@/components/ui/card";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata = { title: "پنل مدیریت" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");
  return (
    <>
      <PageTitle title="پنل مدیریت" subtitle="مدیریت غذاها، برنامه غذایی، رزروها، کاربران و اطلاعیه‌ها" />
      <AdminPanel />
    </>
  );
}
