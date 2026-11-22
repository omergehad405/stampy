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
  title: "Notch - Digital Loyalty Card",
  description: "Digital loyalty cards for cafes",
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
