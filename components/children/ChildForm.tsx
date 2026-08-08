"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Child } from "@/lib/types";

export default function ChildForm({ child }: { child?: Child }) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState(child?.name ?? "");
  const [dob, setDob] = useState(child?.dob ?? "");
  const [gender, setGender] = useState<Child["gender"]>(child?.gender ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (child) {
      const { error } = await supabase
        .from("children")
        .update({ name, dob, gender })
        .eq("id", child.id);
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push(`/children/${child.id}`);
      router.refresh();
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("Vui lòng đăng nhập lại.");
      return;
    }

    const { data, error } = await supabase
      .from("children")
      .insert({ user_id: user.id, name, dob, gender })
      .select()
      .single();
    setLoading(false);
    if (error || !data) {
      setError(error?.message ?? "Không thể thêm bé.");
      return;
    }
    router.push(`/children/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Tên bé</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Ngày sinh</label>
        <input
          type="date"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Giới tính</label>
        <select
          value={gender ?? ""}
          onChange={(e) => setGender((e.target.value || null) as Child["gender"])}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          <option value="">Không rõ</option>
          <option value="male">Bé trai</option>
          <option value="female">Bé gái</option>
          <option value="other">Khác</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : child ? "Lưu thay đổi" : "Thêm bé"}
      </button>
    </form>
  );
}
