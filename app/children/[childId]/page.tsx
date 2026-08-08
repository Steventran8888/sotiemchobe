import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mergeScheduleWithRecords } from "@/lib/vaccination";
import type { VaccinationRecord, VaccineSchedule } from "@/lib/types";
import VaccineTrackerList from "@/components/vaccination/VaccineTrackerList";
import DeleteChildButton from "@/components/children/DeleteChildButton";

export default async function ChildDetailPage({
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

  const [{ data: schedule }, { data: records }] = await Promise.all([
    supabase.from("vaccine_schedule").select("*").order("age_months_min", { ascending: true }),
    supabase.from("vaccination_records").select("*").eq("child_id", child.id),
  ]);

  const rows = mergeScheduleWithRecords(
    (schedule ?? []) as VaccineSchedule[],
    (records ?? []) as VaccinationRecord[]
  );

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <Link href="/children" className="mb-4 text-sm text-neutral-500 hover:underline">
        ← Quay lại
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">{child.name}</h1>
        <div className="flex items-center gap-3">
          <Link href={`/children/${child.id}/edit`} className="text-sm text-brand hover:underline">
            Sửa
          </Link>
          <DeleteChildButton childId={child.id} childName={child.name} />
        </div>
      </div>

      <VaccineTrackerList childId={child.id} initialRows={rows} />
    </div>
  );
}
