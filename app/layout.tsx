import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MemberProvider } from "./context/member-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitness Freak Gym Management",
  description: "Professional gym management system for member tracking and administration",
  keywords: ["gym", "fitness", "management", "members", "administration"],
  authors: [{ name: "Fitness Freak Gym" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased py-10`}
      >
        <MemberProvider>{children}</MemberProvider>
      </body>
    </html>
  );
}
