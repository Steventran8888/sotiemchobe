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

export interface GroupedSchedule {
  due: ScheduleWithRecord[];
  upcoming: ScheduleWithRecord[];
  done: ScheduleWithRecord[];
  skipped: ScheduleWithRecord[];
}

/** Buckets rows by status, splitting not-yet-given ones into due-now vs upcoming by the child's current age. */
export function groupByAge(rows: ScheduleWithRecord[], ageMonths: number): GroupedSchedule {
  const groups: GroupedSchedule = { due: [], upcoming: [], done: [], skipped: [] };
  for (const row of rows) {
    const status = row.record?.status ?? "planned";
    if (status === "done") {
      groups.done.push(row);
    } else if (status === "skipped") {
      groups.skipped.push(row);
    } else if (row.schedule.age_months_min <= ageMonths) {
      groups.due.push(row);
    } else {
      groups.upcoming.push(row);
    }
  }
  groups.due.sort((a, b) => a.schedule.age_months_min - b.schedule.age_months_min);
  groups.upcoming.sort((a, b) => a.schedule.age_months_min - b.schedule.age_months_min);
  return groups;
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
