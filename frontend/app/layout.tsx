import type { Metadata } from "next";
import { ClientTopNav } from "@/components/common/ClientTopNav";
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
        <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-4 py-5 md:px-8 md:py-8">
          <ClientTopNav apiBaseUrl={apiBaseUrl} />
          <main className="flex-1 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
