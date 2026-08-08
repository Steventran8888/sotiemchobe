import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChildForm from "@/components/children/ChildForm";

export default async function EditChildPage({
  params,
}: {
  params: { childId: string };
}) {
  const supabase = await createClient();
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", params.childId)
    .single();

  if (!child) notFound();

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <Link href={`/children/${child.id}`} className="mb-4 text-sm text-neutral-500 hover:underline">
        ← Quay lại
      </Link>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Sửa thông tin bé</h1>
      <ChildForm child={child} />
    </div>
  );
}
