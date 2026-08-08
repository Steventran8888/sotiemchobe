import Link from "next/link";
import ChildForm from "@/components/children/ChildForm";

export default function NewChildPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <Link href="/children" className="mb-4 text-sm text-neutral-500 hover:underline">
        ← Quay lại
      </Link>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Thêm bé</h1>
      <ChildForm />
    </div>
  );
}
