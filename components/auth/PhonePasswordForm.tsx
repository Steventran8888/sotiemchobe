"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizePhoneVN, phoneToFakeEmail } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PhonePasswordForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const supabase = createClient();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = normalizePhoneVN(phone);
    if (!normalized) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/auth/phone-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setError(data.error ?? "Không thể đăng ký. Vui lòng thử lại.");
        return;
      }
    }

    const fakeEmail = phoneToFakeEmail(normalized);
    const { error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });
    setLoading(false);
    if (error) {
      setError(mode === "login" ? "Số điện thoại hoặc mật khẩu không đúng." : error.message);
      return;
    }
    router.push("/children");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912 345 678"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone-password">Mật khẩu</Label>
        <Input
          id="phone-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="mt-1 h-10 w-full">
        {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Đăng ký"}
      </Button>
    </form>
  );
}
