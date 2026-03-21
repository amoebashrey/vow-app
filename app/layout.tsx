import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Epilogue } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas"
});

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-epilogue"
});

export const metadata: Metadata = {
  title: "Vow",
  description: "Private Accountability Contracts",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VOW"
  },
  icons: {
    apple: "/icon-192.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#09090B"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background text-zinc-50 ${bebasNeue.variable} ${epilogue.variable}`}>
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
