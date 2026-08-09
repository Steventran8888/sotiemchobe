"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function DeleteChildButton({ childId, childName }: { childId: string; childName: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Xóa hồ sơ của ${childName}? Toàn bộ dữ liệu tiêm chủng sẽ bị xóa.`)) return;
    setLoading(true);
    await supabase.from("children").delete().eq("id", childId);
    setLoading(false);
    router.push("/children");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="h-auto p-0 text-destructive"
    >
      {loading ? "Đang xóa..." : "Xóa hồ sơ"}
    </Button>
  );
}
