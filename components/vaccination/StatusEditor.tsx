"use client";

import { useState } from "react";
import type { VaccinationRecord, VaccinationStatus } from "@/lib/types";
import { upsertVaccinationRecord } from "@/lib/vaccination";

const STATUS_LABELS: Record<VaccinationStatus, string> = {
  planned: "Chưa tiêm",
  done: "Đã tiêm",
  skipped: "Bỏ qua",
};

export default function StatusEditor({
  childId,
  vaccineScheduleId,
  record,
  onSaved,
  onClose,
}: {
  childId: string;
  vaccineScheduleId: string;
  record: VaccinationRecord | null;
  onSaved: (record: VaccinationRecord) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<VaccinationStatus>(record?.status ?? "planned");
  const [dateGiven, setDateGiven] = useState(record?.date_given ?? "");
  const [location, setLocation] = useState(record?.location ?? "");
  const [notes, setNotes] = useState(record?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    setError(null);
    const { data, error } = await upsertVaccinationRecord({
      childId,
      vaccineScheduleId,
      status,
      dateGiven: dateGiven || null,
      location: location || null,
      notes: notes || null,
    });
    setLoading(false);
    if (error || !data) {
      setError(error?.message ?? "Không thể lưu.");
      return;
    }
    onSaved(data as VaccinationRecord);
    onClose();
  }

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-lg bg-neutral-50 p-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">Trạng thái</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as VaccinationStatus)}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          {(Object.keys(STATUS_LABELS) as VaccinationStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      {status === "done" && (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Ngày tiêm</label>
            <input
              type="date"
              value={dateGiven}
              onChange={(e) => setDateGiven(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Địa điểm</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Trạm y tế phường, bệnh viện..."
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
            />
          </div>
        </>
      )}
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">Ghi chú</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex-1 rounded-md bg-brand py-1.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
