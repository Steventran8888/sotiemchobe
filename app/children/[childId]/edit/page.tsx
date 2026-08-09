import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChildForm from "@/components/children/ChildForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Link href={`/children/${child.id}`} className="mb-4 text-sm text-muted-foreground hover:underline">
        ← Quay lại
      </Link>
      <Card className="border-none shadow-none ring-0">
        <CardHeader>
          <CardTitle>Sửa thông tin bé</CardTitle>
        </CardHeader>
        <CardContent>
          <ChildForm child={child} />
        </CardContent>
      </Card>
    </div>
  );
}
