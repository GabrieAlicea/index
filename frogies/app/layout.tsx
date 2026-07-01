import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frogies — Create & release your own Coquí",
  description:
    "Design, name, and release your own animated Puerto Rican Coquí frog into a living rainforest.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fredoka.variable} ${nunito.variable} font-body`}>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
