"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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
        <Button
          key={provider}
          type="button"
          variant="outline"
          onClick={() => signInWithProvider(provider)}
          className="h-10 w-full"
        >
          Tiếp tục với {PROVIDER_LABELS[provider]}
        </Button>
      ))}
    </div>
  );
}
