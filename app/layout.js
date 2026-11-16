import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stampy - Digital Loyalty Card",
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
        className="min-h-full flex flex-col bg-[var(--bgColor)] text-[var(--mainColor)]"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <main className="flex-1 pb-32 md:pb-28">{children}</main>
          <Navbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
