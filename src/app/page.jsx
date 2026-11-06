import { getCurrentUser } from "@/lib/auth";
import { getDashboard } from "@/services/dashboard";
import { Hero } from "@/components/home/Hero";
import { Dashboard } from "@/components/home/Dashboard";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  { title: "رزرو آسان", text: "برنامه غذایی روزهای آینده را ببینید و با یک کلیک رزرو کنید." },
  { title: "کیف پول دانشجویی", text: "اعتبار خود را شارژ کنید و هزینه هر وعده خودکار کسر می‌شود." },
  { title: "لغو و استرداد", text: "تا پیش از پایان مهلت، رزرو را لغو کنید و مبلغ به کیف پول برگردد." },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  const data = user ? await getDashboard(user.id) : null;

  return (
    <div className="flex flex-col gap-8">
      <Hero />
      {user ? (
        <Dashboard user={user} data={data} />
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/register" size="lg">ثبت‌نام دانشجو</ButtonLink>
            <ButtonLink href="/login" variant="outline" size="lg">ورود به حساب</ButtonLink>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title}><h3 className="font-semibold">{f.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p></Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
