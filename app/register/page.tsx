"use client";

import { useState } from "react";
import Link from "next/link";
import AuthMethodTabs, { type AuthMethod } from "@/components/auth/AuthMethodTabs";
import EmailPasswordForm from "@/components/auth/EmailPasswordForm";
import PhonePasswordForm from "@/components/auth/PhonePasswordForm";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function RegisterPage() {
  const [method, setMethod] = useState<AuthMethod>("email");

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">Tạo tài khoản</h1>
      <p className="mb-6 text-sm text-neutral-500">Sổ Tiêm Cho Bé</p>

      <AuthMethodTabs active={method} onChange={setMethod} />
      {method === "email" ? (
        <EmailPasswordForm mode="register" />
      ) : (
        <PhonePasswordForm mode="register" />
      )}

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs text-neutral-400">hoặc</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <OAuthButtons redirectPath="/children" />

      <p className="mt-6 text-center text-sm text-neutral-500">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
