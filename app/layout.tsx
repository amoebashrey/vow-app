import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
