"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isInternalFakeEmail } from "@/lib/phone";

export default function VerifyEmailBanner() {
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !user.email_confirmed_at && !isInternalFakeEmail(user.email)) {
        setEmail(user.email ?? null);
      }
    });
  }, [supabase]);

  function setDigit(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? "";
      return next;
    });
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    if (!email) return;
    const token = digits.join("");
    if (token.length !== 6) {
      setError("Nhập đủ 6 số.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "signup" });
    setLoading(false);
    if (error) {
      setError("Mã không đúng hoặc đã hết hạn.");
      return;
    }
    setEmail(null);
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) {
      setError("Không thể gửi lại mã. Vui lòng thử lại sau.");
      return;
    }
    setNotice("Đã gửi mã mới.");
  }

  if (!email || dismissed) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm">
      {!expanded ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-amber-800">Bạn chưa xác thực email.</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="font-medium text-amber-900 hover:underline"
            >
              Xác thực ngay
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-amber-600 hover:text-amber-900"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-amber-800">Nhập mã 6 số đã gửi tới {email}</span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-amber-600 hover:text-amber-900"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="h-10 w-10 rounded-md border border-amber-300 text-center text-lg focus:border-brand focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          {notice && <p className="text-xs text-brand-dark">{notice}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              className="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Đang xác nhận..." : "Xác nhận"}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-medium text-amber-900 hover:underline disabled:opacity-60"
            >
              {resending ? "Đang gửi..." : "Gửi lại mã"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
