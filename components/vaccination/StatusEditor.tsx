"use client";

import { useState } from "react";
import type { VaccinationRecord, VaccinationStatus } from "@/lib/types";
import { upsertVaccinationRecord } from "@/lib/vaccination";
import { dateToISO, formatDateVN, parseISODate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Trạng thái</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as VaccinationStatus)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_LABELS) as VaccinationStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {status === "done" && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label>Ngày tiêm</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="h-10 w-full justify-start font-normal">
                  {dateGiven ? formatDateVN(dateGiven) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={parseISODate(dateGiven)}
                  onSelect={(date) => date && setDateGiven(dateToISO(date))}
                  captionLayout="dropdown"
                  defaultMonth={parseISODate(dateGiven)}
                  disabled={{ after: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Địa điểm</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Trạm y tế phường, bệnh viện..."
            />
          </div>
        </>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="button" onClick={handleSave} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogFooter>
    </div>
  );
}
