import type { VaccineCategory } from "@/lib/types";

const CATEGORY_META: Record<VaccineCategory, { icon: string; label: string; className: string }> = {
  free_commune: { icon: "🟢", label: "Miễn phí phường", className: "bg-green-50 text-green-700" },
  service: { icon: "🔵", label: "Dịch vụ", className: "bg-blue-50 text-blue-700" },
  regional_pilot: { icon: "⚠️", label: "Thí điểm một số tỉnh", className: "bg-amber-50 text-amber-700" },
};

export default function CategoryBadge({ category }: { category: VaccineCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
