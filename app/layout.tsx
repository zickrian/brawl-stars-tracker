import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
  title: {
    default: "BrawlTracker - Brawl Stars Statistics & Analytics",
    template: "%s | BrawlTracker",
  },
  description: "Track your Brawl Stars progress, view player statistics, club rankings, brawler info, and event rotations. The ultimate companion for Brawl Stars players.",
  keywords: ["Brawl Stars", "tracker", "statistics", "player stats", "club rankings", "brawler", "leaderboard", "events"],
  authors: [{ name: "BrawlTracker" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brawltracker.com",
    siteName: "BrawlTracker",
    title: "BrawlTracker - Brawl Stars Statistics & Analytics",
    description: "Track your Brawl Stars progress with comprehensive statistics and analytics",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrawlTracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrawlTracker - Brawl Stars Statistics & Analytics",
    description: "Track your Brawl Stars progress with comprehensive statistics and analytics",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="https://cdn-misc.brawlify.com/front/Star.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="https://cdn-misc.brawlify.com/front/Star.svg" />
        <meta name="theme-color" content="#0a0e17" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
