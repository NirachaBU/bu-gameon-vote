import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BU Game On Expo 2026 · Vote",
  description: "โหวตผลงานเกมของนักศึกษา BU Game On Expo 2026",
};

export const viewport: Viewport = {
  themeColor: "#060a18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@500;700;800&family=Noto+Sans+Thai:wght@400;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
