"use client";

import Link from "next/link";
import EmailPasswordForm from "@/components/auth/EmailPasswordForm";
import PhonePasswordForm from "@/components/auth/PhonePasswordForm";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10">
      <Card className="border-none shadow-none ring-0">
        <CardHeader>
          <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
          <CardDescription>Sổ Tiêm Cho Bé</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Số điện thoại</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <EmailPasswordForm mode="register" />
            </TabsContent>
            <TabsContent value="phone">
              <PhonePasswordForm mode="register" />
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">hoặc</span>
            <Separator className="flex-1" />
          </div>

          <OAuthButtons redirectPath="/children" />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
