import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import ToastProvider from "./components/providers/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | Notch",
    default: "Notch – Digital Loyalty & Growth Platform for Cafes in Egypt",
  },
  description:
    "Notch helps cafes in Egypt turn one-time visitors into loyal regulars. QR-based digital stamps, free Discover exposure, and an online menu — all in one platform.",
  metadataBase: new URL("https://notchloyalty.com"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  robots: {
    index: false, // App routes (dashboard, profile, etc.) should not be indexed
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-(--bgColor) text-(--mainColor)"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <main className="flex-1 pb-32 md:pb-28">{children}</main>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
