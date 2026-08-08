"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthMethodTabs, { type AuthMethod } from "@/components/auth/AuthMethodTabs";
import { createClient } from "@/lib/supabase/client";
import { normalizePhoneVN } from "@/lib/phone";

function EmailForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-neutral-600">
        Nếu email này đã đăng ký, bạn sẽ nhận được đường dẫn đặt lại mật khẩu qua email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ban@vidu.com"
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
      </button>
    </form>
  );
}

function PhoneForgotForm() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [phone, setPhone] = useState("");
  const [normalized, setNormalized] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const n = normalizePhoneVN(phone);
    if (!n) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    setLoading(true);
    await supabase.auth.signInWithOtp({
      phone: n,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    setNormalized(n);
    setNotice("Nếu số điện thoại này đã đăng ký, bạn sẽ nhận được mã OTP qua SMS.");
    setStep("verify");
  }

  async function verifyAndReset(e: React.FormEvent) {
    e.preventDefault();
    if (!normalized) return;
    setError(null);
    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalized,
      token: otp,
      type: "sms",
    });
    if (verifyError) {
      setLoading(false);
      setError("Mã OTP không đúng hoặc đã hết hạn.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push("/children");
    router.refresh();
  }

  if (step === "request") {
    return (
      <form onSubmit={requestCode} className="flex flex-col gap-3">
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912 345 678"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Đang gửi..." : "Gửi mã OTP"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyAndReset} className="flex flex-col gap-3">
      {notice && <p className="text-sm text-neutral-600">{notice}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Mã OTP</label>
        <input
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Mật khẩu mới</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
}

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<AuthMethod>("email");

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">Quên mật khẩu</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Chọn cách bạn đã dùng để đăng ký tài khoản.
      </p>

      <AuthMethodTabs active={method} onChange={setMethod} />
      {method === "email" ? <EmailForgotForm /> : <PhoneForgotForm />}

      <p className="mt-6 text-center text-sm text-neutral-500">
        <Link href="/login" className="font-medium text-brand hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
