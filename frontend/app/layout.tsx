import type { Metadata } from "next";
import { TopNav } from "@/components/common/TopNav";
import { apiBaseUrl } from "@/lib/api/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamFlow",
  description: "Fast personal task capture with lightweight team sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-6">
          <TopNav apiBaseUrl={apiBaseUrl} />
          <main className="flex-1 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
