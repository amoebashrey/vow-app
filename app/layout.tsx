import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "../components/layout/Shell";

export const metadata: Metadata = {
  title: "Vow",
  description: "Private Accountability Contracts"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-zinc-50">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
