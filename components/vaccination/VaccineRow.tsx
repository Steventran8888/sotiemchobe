"use client";

import { useState } from "react";
import type { VaccinationRecord, VaccineSchedule } from "@/lib/types";
import CategoryBadge from "@/components/vaccination/CategoryBadge";
import StatusEditor from "@/components/vaccination/StatusEditor";

const STATUS_PILL: Record<string, string> = {
  planned: "bg-neutral-100 text-neutral-500",
  done: "bg-green-100 text-green-700",
  skipped: "bg-neutral-200 text-neutral-500 line-through",
};

const STATUS_LABEL: Record<string, string> = {
  planned: "Chưa tiêm",
  done: "Đã tiêm",
  skipped: "Bỏ qua",
};

export default function VaccineRow({
  childId,
  schedule,
  record,
  onSaved,
}: {
  childId: string;
  schedule: VaccineSchedule;
  record: VaccinationRecord | null;
  onSaved: (record: VaccinationRecord) => void;
}) {
  const [editing, setEditing] = useState(false);
  const status = record?.status ?? "planned";

  return (
    <li className="rounded-xl border border-neutral-200 px-4 py-3">
      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div>
          <p className="font-medium text-neutral-900">
            {schedule.name} <span className="text-neutral-400">· mũi {schedule.dose_number}</span>
          </p>
          <p className="text-xs text-neutral-500">{schedule.disease} · {schedule.age_recommended}</p>
          <div className="mt-1">
            <CategoryBadge category={schedule.category} />
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_PILL[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </button>

      {record?.date_given && (
        <p className="mt-1 text-xs text-neutral-400">
          Tiêm ngày {record.date_given}
          {record.location ? ` tại ${record.location}` : ""}
        </p>
      )}

      {editing && (
        <StatusEditor
          childId={childId}
          vaccineScheduleId={schedule.id}
          record={record}
          onSaved={onSaved}
          onClose={() => setEditing(false)}
        />
      )}
    </li>
  );
}
