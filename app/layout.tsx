import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vow",
  description: "Private Accountability Contracts",
  manifest: "/manifest.json",
  themeColor: "#09090B",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VOW"
  },
  icons: {
    apple: "/icon-192.png"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-zinc-50">
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`
          }}
        />
        {children}
      </body>
    </html>
  );
}
