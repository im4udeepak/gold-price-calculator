import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gold Calculator - Real-Time Value Estimator",
  description: "Estimate your gold's value with our accurate calculator. Get real-time gold price updates and insights into gold market trends.",
  keywords: ["gold calculator", "gold value", "gold price", "gold estimation", "real-time gold rates", "gold appraisal", "gold weight calculator", "gold investment value"],
  openGraph: {
    title: "Gold Calculator - Real-Time Value Estimator",
    description: "Quickly calculate the value of your gold based on current market prices. Simple and accurate.",
    url: "https://yourdomain.com",
    type: "website",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gold Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Calculator - Real-Time Value Estimator",
    description: "Estimate your gold's value instantly using our reliable calculator.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFD700" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
