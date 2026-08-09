import Link from "next/link";
import ChildForm from "@/components/children/ChildForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewChildPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <Link href="/children" className="mb-4 text-sm text-muted-foreground hover:underline">
        ← Quay lại
      </Link>
      <Card className="border-none shadow-none ring-0">
        <CardHeader>
          <CardTitle>Thêm bé</CardTitle>
        </CardHeader>
        <CardContent>
          <ChildForm />
        </CardContent>
      </Card>
    </div>
  );
}
