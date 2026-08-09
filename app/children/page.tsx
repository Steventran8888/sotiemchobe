import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Child } from "@/lib/types";
import VerifyEmailBanner from "@/components/auth/VerifyEmailBanner";

function calculateAge(dob: string): string {
  const birth = new Date(dob);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) return "";
  if (months < 24) return `${months} tháng tuổi`;
  return `${Math.floor(months / 12)} tuổi`;
}

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
          <h1 className="text-xl font-bold text-neutral-900">Sổ Tiêm Cho Bé</h1>
          <Link href="/profile/settings" className="text-sm text-neutral-500 hover:underline">
            Hồ sơ
          </Link>
        </div>

        {children && children.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {(children as Child[]).map((child) => (
              <li key={child.id}>
                <Link
                  href={`/children/${child.id}`}
                  className="block rounded-xl border border-neutral-200 px-4 py-3 hover:border-brand"
                >
                  <p className="font-semibold text-neutral-900">{child.name}</p>
                  <p className="text-sm text-neutral-500">{calculateAge(child.dob)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-sm text-neutral-500">
            Bạn chưa thêm bé nào. Thêm bé để bắt đầu theo dõi lịch tiêm chủng.
          </p>
        )}

        <Link
          href="/children/new"
          className="mt-6 w-full rounded-lg bg-brand py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Thêm bé
        </Link>
      </div>
    </div>
  );
}
