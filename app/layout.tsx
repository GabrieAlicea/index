import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://revvy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Revvy — Mobile Mechanics That Come to You",
    template: "%s | Revvy",
  },
  description:
    "Book a vetted, insured mobile mechanic to your driveway in minutes. Oil changes, brakes, diagnostics, electronics, and roadside help — anywhere in Florida.",
  keywords: [
    "mobile mechanic",
    "mobile auto repair",
    "mechanic near me",
    "on-demand car repair",
    "roadside assistance Florida",
  ],
  openGraph: {
    type: "website",
    siteName: "Revvy",
    title: "Revvy — Mobile Mechanics That Come to You",
    description:
      "Book a vetted, insured mobile mechanic to your driveway in minutes.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Revvy — Mobile Mechanics That Come to You",
    description:
      "Book a vetted, insured mobile mechanic to your driveway in minutes.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-text">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
