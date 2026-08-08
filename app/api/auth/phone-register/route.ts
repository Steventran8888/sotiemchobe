import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhoneVN, phoneToFakeEmail } from "@/lib/phone";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const normalized = normalizePhoneVN(phone);
  if (!normalized) {
    return NextResponse.json(
      { error: "Số điện thoại không hợp lệ." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Mật khẩu phải có ít nhất 6 ký tự." },
      { status: 400 }
    );
  }

  const fakeEmail = phoneToFakeEmail(normalized);
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.createUser({
    email: fakeEmail,
    password,
    phone: normalized,
    email_confirm: true,
    phone_confirm: true,
    user_metadata: { auth_method: "phone", phone: normalized },
  });

  if (error) {
    const isDuplicate = /already been registered|already exists/i.test(
      error.message
    );
    return NextResponse.json(
      {
        error: isDuplicate
          ? "Số điện thoại này đã được đăng ký."
          : "Không thể đăng ký. Vui lòng thử lại.",
      },
      { status: isDuplicate ? 409 : 500 }
    );
  }

  return NextResponse.json({ email: fakeEmail });
}
