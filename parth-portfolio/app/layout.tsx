import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://parthsankhla.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Parth Sankhla",
  description: "Software Developer. Triathlete. Builder.",
  applicationName: "Parth Sankhla Portfolio",
  authors: [{ name: "Parth Sankhla" }],
  creator: "Parth Sankhla",
  publisher: "Parth Sankhla",
  keywords: [
    "Parth Sankhla",
    "software developer",
    "portfolio",
    "full stack developer",
    "Hyderabad",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Parth Sankhla",
    description: "Software Developer. Triathlete. Builder.",
    url: siteUrl,
    siteName: "Parth Sankhla",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Parth Sankhla",
    description: "Software Developer. Triathlete. Builder.",
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
