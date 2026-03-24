import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İnegöl Mobilya Balıkesir",
  description: "İnegöl fabrikalarından direkt Balıkesir'e. Düğün paketleri, halı, perde ve mobilya. 2025 yeni sezon modelleri.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
