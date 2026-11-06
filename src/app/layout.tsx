import type { Metadata, Viewport } from "next";
import "@fontsource/baloo-2/400.css";
import "@fontsource/baloo-2/500.css";
import "@fontsource/baloo-2/600.css";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import SecurityGuard from "@/components/SecurityGuard";
import "./globals.css";

export const metadata: Metadata = {
  title: "Computing Labs | Grade 3",
  description: "Interactive computing curriculum for Grade 3 students. Hands-on physical simulations, 2D and 3D worlds, and algorithmic thinking.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 text-slate-900 font-baloo h-full h-[100dvh] overflow-hidden select-none">
        <SecurityGuard>
          {children}
        </SecurityGuard>
      </body>
    </html>
  );
}
