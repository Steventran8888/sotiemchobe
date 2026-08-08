import type { VaccinationRecord, VaccineSchedule } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export interface ScheduleWithRecord {
  schedule: VaccineSchedule;
  record: VaccinationRecord | null;
}

export function mergeScheduleWithRecords(
  schedule: VaccineSchedule[],
  records: VaccinationRecord[]
): ScheduleWithRecord[] {
  const byScheduleId = new Map(records.map((r) => [r.vaccine_schedule_id, r]));
  return schedule.map((s) => ({ schedule: s, record: byScheduleId.get(s.id) ?? null }));
}

export async function upsertVaccinationRecord(input: {
  childId: string;
  vaccineScheduleId: string;
  status: VaccinationRecord["status"];
  dateGiven: string | null;
  location: string | null;
  notes: string | null;
}) {
  const supabase = createClient();
  return supabase
    .from("vaccination_records")
    .upsert(
      {
        child_id: input.childId,
        vaccine_schedule_id: input.vaccineScheduleId,
        status: input.status,
        date_given: input.dateGiven,
        location: input.location,
        notes: input.notes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "child_id,vaccine_schedule_id" }
    )
    .select()
    .single();
}
