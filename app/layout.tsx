import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from '@/components/layout/LayoutShell';

export const metadata: Metadata = {
  title: "Livingstone | Faith, Leadership, Systems, Innovation",
  description: "The digital headquarters of Livingstone - building people, businesses, and institutions through faith-driven strategic thinking.",
  keywords: [
    "Leadership",
    "Strategy",
    "Faith",
    "Innovation",
    "Institutional Development",
    "Human Development",
  ],
  metadataBase: new URL("https://livingstone.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
