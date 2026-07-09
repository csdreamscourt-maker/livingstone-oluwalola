import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { LayoutShell } from '@/components/layout/LayoutShell';

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Livingstone Oluwalola | Faith, Leadership, Systems, Innovation",
  description: "The digital headquarters of Livingstone Oluwalola - building people, businesses, and institutions through faith-driven strategic thinking.",
  keywords: [
    "Leadership",
    "Strategy",
    "Faith",
    "Innovation",
    "Institutional Development",
    "Human Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
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
