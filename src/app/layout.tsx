import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WebAnalytics } from "@/components/site/WebAnalytics";
import { getSiteUrl } from "@/lib/site";

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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Looking Glass — a field guide to things worth understanding",
    template: "%s · Looking Glass",
  },
  description:
    "Considered, unhurried explainers of the mechanisms and systems that shape how we live — modern AI first, with the archive wandering from there. A project by Coalescence Labs.",
  openGraph: {
    title: "Looking Glass",
    description:
      "A field guide to things worth understanding. Considered, unhurried explainers by Coalescence Labs.",
    url: getSiteUrl(),
    siteName: "Looking Glass",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Looking Glass",
    description:
      "A field guide to things worth understanding. Considered, unhurried explainers by Coalescence Labs.",
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
        <WebAnalytics />
      </body>
    </html>
  );
}
