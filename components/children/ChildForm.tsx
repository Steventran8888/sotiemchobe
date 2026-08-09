"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Child } from "@/lib/types";
import { dateToISO, formatDateVN, parseISODate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChildForm({ child }: { child?: Child }) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState(child?.name ?? "");
  const [dob, setDob] = useState(child?.dob ?? "");
  const [gender, setGender] = useState<Child["gender"]>(child?.gender ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (child) {
      const { error } = await supabase
        .from("children")
        .update({ name, dob, gender })
        .eq("id", child.id);
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push(`/children/${child.id}`);
      router.refresh();
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("Vui lòng đăng nhập lại.");
      return;
    }

    const { data, error } = await supabase
      .from("children")
      .insert({ user_id: user.id, name, dob, gender })
      .select()
      .single();
    setLoading(false);
    if (error || !data) {
      setError(error?.message ?? "Không thể thêm bé.");
      return;
    }
    router.push(`/children/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="child-name">Tên bé</Label>
        <Input
          id="child-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Ngày sinh</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-start font-normal"
            >
              {dob ? formatDateVN(dob) : "Chọn ngày sinh"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={parseISODate(dob)}
              onSelect={(date) => date && setDob(dateToISO(date))}
              captionLayout="dropdown"
              defaultMonth={parseISODate(dob)}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Giới tính</Label>
        <Select
          value={gender ?? "unknown"}
          onValueChange={(value) =>
            setGender(value === "unknown" ? null : (value as Child["gender"]))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unknown">Không rõ</SelectItem>
            <SelectItem value="male">Bé trai</SelectItem>
            <SelectItem value="female">Bé gái</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="mt-1 h-10 w-full">
        {loading ? "Đang lưu..." : child ? "Lưu thay đổi" : "Thêm bé"}
      </Button>
    </form>
  );
}
