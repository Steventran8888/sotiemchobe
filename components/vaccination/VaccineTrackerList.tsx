"use client";

import { useMemo, useState } from "react";
import type { VaccinationRecord } from "@/lib/types";
import { groupByAge, type ScheduleWithRecord } from "@/lib/vaccination";
import VaccineRow from "@/components/vaccination/VaccineRow";
import { Button } from "@/components/ui/button";

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mt-5 mb-2 flex items-center gap-2 first:mt-0">
      <h2 className="text-sm font-semibold">{label}</h2>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  );
}

export default function VaccineTrackerList({
  childId,
  ageMonths,
  initialRows,
}: {
  childId: string;
  ageMonths: number;
  initialRows: ScheduleWithRecord[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [showDone, setShowDone] = useState(false);

  const groups = useMemo(() => groupByAge(rows, ageMonths), [rows, ageMonths]);

  function handleSaved(record: VaccinationRecord) {
    setRows((prev) =>
      prev.map((row) =>
        row.schedule.id === record.vaccine_schedule_id ? { ...row, record } : row
      )
    );
  }

  function renderRows(list: ScheduleWithRecord[]) {
    return list.map(({ schedule, record }) => (
      <VaccineRow
        key={schedule.id}
        childId={childId}
        schedule={schedule}
        record={record}
        onSaved={handleSaved}
      />
    ));
  }

  const doneAndSkipped = [...groups.done, ...groups.skipped];

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Đã tiêm {groups.done.length}/{rows.length} mũi
      </p>

      <SectionHeader label="🔴 Cần tiêm ngay" count={groups.due.length} />
      {groups.due.length > 0 ? (
        <div className="flex flex-col gap-3">{renderRows(groups.due)}</div>
      ) : (
        <p className="text-sm text-muted-foreground">Không có mũi nào cần tiêm ngay.</p>
      )}

      <SectionHeader label="🕐 Sắp tới" count={groups.upcoming.length} />
      {groups.upcoming.length > 0 ? (
        <div className="flex flex-col gap-3">{renderRows(groups.upcoming)}</div>
      ) : (
        <p className="text-sm text-muted-foreground">Không có mũi nào sắp tới.</p>
      )}

      {doneAndSkipped.length > 0 && (
        <>
          <div className="mt-5 mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">✅ Đã hoàn tất</h2>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setShowDone((v) => !v)}
              className="h-auto p-0"
            >
              {showDone ? "Ẩn" : `Xem (${doneAndSkipped.length})`}
            </Button>
          </div>
          {showDone && <div className="flex flex-col gap-3">{renderRows(doneAndSkipped)}</div>}
        </>
      )}
    </div>
  );
}
