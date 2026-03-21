import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas"
});

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
      <body className={`min-h-screen bg-background text-zinc-50 ${bebasNeue.variable}`}>
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
