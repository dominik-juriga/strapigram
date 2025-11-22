import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";
import { getUserFromCookies } from "./utils";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strapigram",
  description: "Social media app built for Strapiers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookies();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        {user && (
          <Link
            href="/upload"
            className="fixed bottom-4 right-4 w-15 h-15 flex justify-center items-center rounded-full text-xl shadow-2xl bg-white font-black"
          >
            +
          </Link>
        )}
      </body>
    </html>
  );
}
