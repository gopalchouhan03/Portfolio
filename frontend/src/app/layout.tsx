import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import PortfolioAssistant from "@/components/PortfolioAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "Gopal - A Full Stack Developer | Portfolio",
  description: " A Full Stack web developer specializing in JavaScript, React, Node.js, and premium UI design. View my work, blogs, and projects.",
  keywords: ["developer", "portfolio", "react", "javascript", "nodejs", "full-stack", "web development"],
  authors: [{ name: "Gopal Chouhan" }],
  creator: "Gopal Chouhan",
  publisher: "Gopal",
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  openGraph: {
    title: "Gopal - A Full Stack Developer | Portfolio",
    description: "A Full Stack web developer specializing in JavaScript, React, Node.js, and premium UI design. View my work, blogs, and projects.",
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    siteName: "Gopal's Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gopal - Full Stack Developer",
    description: "A Full Stack web developer specializing in JavaScript, React, Node.js, and premium UI design. View my work, blogs, and projects.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://yourportfolio.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/Logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
          <PortfolioAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
