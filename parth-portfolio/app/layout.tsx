import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const siteUrl = "https://parthsankhla.vercel.app";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const serifItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif-italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Parth Sankhla — Software Developer, Triathlete, Builder",
  description:
    "Portfolio of Parth Sankhla: software developer and competitive triathlete building research tools and client systems from Hyderabad, India.",
  applicationName: "Parth Sankhla Portfolio",
  authors: [{ name: "Parth Sankhla" }],
  creator: "Parth Sankhla",
  publisher: "Parth Sankhla",
  keywords: [
    "Parth Sankhla",
    "software developer",
    "portfolio",
    "full stack developer",
    "triathlete",
    "Hyderabad",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Parth Sankhla — Software Developer, Triathlete, Builder",
    description:
      "Research software at BITS Pilani, client systems, and national-level triathlon.",
    url: siteUrl,
    siteName: "Parth Sankhla",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Parth Sankhla — Software Developer, Triathlete, Builder",
    description:
      "Research software at BITS Pilani, client systems, and national-level triathlon.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${mono.variable} ${sans.variable} ${serifItalic.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
