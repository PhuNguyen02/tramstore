import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DigiMarket - Digital License Marketplace",
  description:
    "The most trusted digital marketplace for software licenses, game keys, creative tools, and entertainment subscriptions. Instant delivery, secure payment, 24/7 support.",
  keywords: [
    "digital marketplace",
    "software licenses",
    "game keys",
    "subscriptions",
    "digital products",
  ],
  authors: [{ name: "DigiMarket" }],
  openGraph: {
    title: "DigiMarket - Digital License Marketplace",
    description:
      "Premium digital licenses at unbeatable prices. Instant delivery & secure checkout.",
    type: "website",
    locale: "vi_VN",
  },
};

import MUIProvider from "@/lib/MUIProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <MUIProvider>{children}</MUIProvider>
      </body>
    </html>
  );
}
