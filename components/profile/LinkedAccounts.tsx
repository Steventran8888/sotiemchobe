"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "facebook" | "apple";
const PROVIDERS: Provider[] = ["google", "facebook", "apple"];
const PROVIDER_LABELS: Record<Provider, string> = {
  google: "Google",
  facebook: "Facebook",
  apple: "Apple",
};

export default function LinkedAccounts() {
  const supabase = createClient();
  const [linked, setLinked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUserIdentities().then(({ data, error }) => {
      if (error) {
        setError(error.message);
      } else {
        setLinked(new Set(data.identities.map((i) => i.provider)));
      }
      setLoading(false);
    });
  }, [supabase]);

  async function linkProvider(provider: Provider) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: { redirectTo: `${siteUrl}/profile/settings` },
    });
    if (error) setError(error.message);
  }

  if (loading) {
    return <p className="text-sm text-neutral-400">Đang tải...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map((provider) => {
        const isLinked = linked.has(provider);
        return (
          <div
            key={provider}
            className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5"
          >
            <span className="text-sm font-medium text-neutral-700">
              {PROVIDER_LABELS[provider]}
            </span>
            {isLinked ? (
              <span className="text-xs font-medium text-brand-dark">Đã liên kết</span>
            ) : (
              <button
                type="button"
                onClick={() => linkProvider(provider)}
                className="text-xs font-medium text-brand hover:underline"
              >
                Liên kết
              </button>
            )}
          </div>
        );
      })}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
