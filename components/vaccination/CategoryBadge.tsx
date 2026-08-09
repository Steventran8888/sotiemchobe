import type { VaccineCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const CATEGORY_META: Record<VaccineCategory, { icon: string; label: string; className: string }> = {
  free_commune: {
    icon: "🟢",
    label: "Miễn phí phường",
    className: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  service: {
    icon: "🔵",
    label: "Dịch vụ",
    className: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  regional_pilot: {
    icon: "⚠️",
    label: "Thí điểm một số tỉnh",
    className: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
};

export default function CategoryBadge({ category }: { category: VaccineCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <Badge variant="outline" className={meta.className}>
      <span>{meta.icon}</span>
      {meta.label}
    </Badge>
  );
}
