"use client";

import { useState } from "react";
import type { VaccinationRecord } from "@/lib/types";
import type { ScheduleWithRecord } from "@/lib/vaccination";
import VaccineRow from "@/components/vaccination/VaccineRow";

export default function VaccineTrackerList({
  childId,
  initialRows,
}: {
  childId: string;
  initialRows: ScheduleWithRecord[];
}) {
  const [rows, setRows] = useState(initialRows);

  function handleSaved(record: VaccinationRecord) {
    setRows((prev) =>
      prev.map((row) =>
        row.schedule.id === record.vaccine_schedule_id ? { ...row, record } : row
      )
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map(({ schedule, record }) => (
        <VaccineRow
          key={schedule.id}
          childId={childId}
          schedule={schedule}
          record={record}
          onSaved={handleSaved}
        />
      ))}
    </div>
  );
}
