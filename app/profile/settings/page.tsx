import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDisplayIdentity } from "@/lib/phone";
import LinkedAccounts from "@/components/profile/LinkedAccounts";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import SignOutButton from "@/components/profile/SignOutButton";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/children" className="text-sm text-neutral-500 hover:underline">
          ← Quay lại
        </Link>
      </div>

      <h1 className="mb-1 text-xl font-bold text-neutral-900">Cài đặt hồ sơ</h1>
      <p className="mb-6 text-sm text-neutral-500">{getDisplayIdentity(user)}</p>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-neutral-700">Tài khoản liên kết</h2>
        <LinkedAccounts />
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-neutral-700">Đổi mật khẩu</h2>
        <ChangePasswordForm />
      </section>

      <div className="mt-auto pt-6">
        <SignOutButton />
      </div>
    </div>
  );
}
