import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sổ Tiêm Cho Bé",
  description: "Theo dõi lịch tiêm chủng cho bé",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0E7C7B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-muted">
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
