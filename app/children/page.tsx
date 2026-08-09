import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Child } from "@/lib/types";
import { ageInMonths, formatAge } from "@/lib/date";
import VerifyEmailBanner from "@/components/auth/VerifyEmailBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ChildrenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-1 flex-col">
      <VerifyEmailBanner />
      <div className="flex flex-1 flex-col px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">Sổ Tiêm Cho Bé</h1>
          <Link href="/profile/settings" className="text-sm text-muted-foreground hover:underline">
            Hồ sơ
          </Link>
        </div>

        {children && children.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {(children as Child[]).map((child) => (
              <li key={child.id}>
                <Link href={`/children/${child.id}`}>
                  <Card className="transition-colors hover:ring-primary/40">
                    <CardContent>
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-sm text-muted-foreground">{formatAge(ageInMonths(child.dob))}</p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-sm text-muted-foreground">
            Bạn chưa thêm bé nào. Thêm bé để bắt đầu theo dõi lịch tiêm chủng.
          </p>
        )}

        <Button asChild className="mt-6 h-10 w-full">
          <Link href="/children/new">+ Thêm bé</Link>
        </Button>
      </div>
    </div>
  );
}
