import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analog Archive",
  description: "Gestione archivio fotografico analogico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
