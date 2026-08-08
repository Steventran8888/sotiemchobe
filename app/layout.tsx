import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="vi">
      <body className="bg-neutral-100 min-h-screen">
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-sm flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
