"use client";

import { useState } from "react";
import type { VaccinationRecord, VaccineSchedule } from "@/lib/types";
import CategoryBadge from "@/components/vaccination/CategoryBadge";
import StatusEditor from "@/components/vaccination/StatusEditor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STATUS_VARIANT: Record<string, "secondary" | "default" | "outline"> = {
  planned: "secondary",
  done: "default",
  skipped: "outline",
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
  const [open, setOpen] = useState(false);
  const status = record?.status ?? "planned";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className={`cursor-pointer transition-colors hover:ring-primary/40 ${
            status === "skipped" ? "opacity-60" : ""
          }`}
        >
          <CardContent className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {schedule.name} <span className="text-muted-foreground">· mũi {schedule.dose_number}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {schedule.disease} · {schedule.age_recommended}
              </p>
              <div className="mt-1">
                <CategoryBadge category={schedule.category} />
              </div>
              {record?.date_given && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Tiêm ngày {record.date_given}
                  {record.location ? ` tại ${record.location}` : ""}
                </p>
              )}
            </div>
            <Badge variant={STATUS_VARIANT[status]} className="shrink-0">
              {STATUS_LABEL[status]}
            </Badge>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{schedule.name}</DialogTitle>
        </DialogHeader>
        <StatusEditor
          childId={childId}
          vaccineScheduleId={schedule.id}
          record={record}
          onSaved={onSaved}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
