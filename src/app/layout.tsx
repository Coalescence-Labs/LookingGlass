import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lookingglass.coalescencelabs.app"),
  title: {
    default: "Looking Glass — making AI legible",
    template: "%s · Looking Glass",
  },
  description:
    "Unhurried, visual explainers for the concepts behind modern AI. A project by Coalescence Labs.",
  openGraph: {
    title: "Looking Glass",
    description: "Unhurried, visual explainers for the concepts behind modern AI.",
    url: "https://lookingglass.coalescencelabs.app",
    siteName: "Looking Glass",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Looking Glass",
    description: "Unhurried, visual explainers for the concepts behind modern AI.",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body className="grain flex min-h-dvh flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
