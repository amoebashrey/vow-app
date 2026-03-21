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
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
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
