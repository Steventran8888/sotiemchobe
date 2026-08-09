"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizePhoneVN } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
      <p className="text-sm text-muted-foreground">
        Nếu email này đã đăng ký, bạn sẽ nhận được đường dẫn đặt lại mật khẩu qua email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ban@vidu.com"
      />
      <Button type="submit" disabled={loading} className="h-10 w-full">
        {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
      </Button>
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
        <Input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912 345 678"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="h-10 w-full">
          {loading ? "Đang gửi..." : "Gửi mã OTP"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyAndReset} className="flex flex-col gap-3">
      {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="otp">Mã OTP</Label>
        <Input
          id="otp"
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">Mật khẩu mới</Label>
        <Input
          id="new-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="h-10 w-full">
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </Button>
    </form>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <Card className="border-none shadow-none ring-0">
        <CardHeader>
          <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
          <CardDescription>Chọn cách bạn đã dùng để đăng ký tài khoản.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Số điện thoại</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <EmailForgotForm />
            </TabsContent>
            <TabsContent value="phone">
              <PhoneForgotForm />
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
