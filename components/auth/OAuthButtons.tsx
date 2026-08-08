"use client";

import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "facebook" | "apple";

const PROVIDER_LABELS: Record<Provider, string> = {
  google: "Google",
  facebook: "Facebook",
  apple: "Apple",
};

export default function OAuthButtons({ redirectPath = "/children" }: { redirectPath?: string }) {
  const supabase = createClient();

  async function signInWithProvider(provider: Provider) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {(Object.keys(PROVIDER_LABELS) as Provider[]).map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => signInWithProvider(provider)}
          className="w-full rounded-lg border border-neutral-300 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Tiếp tục với {PROVIDER_LABELS[provider]}
        </button>
      ))}
    </div>
  );
}
