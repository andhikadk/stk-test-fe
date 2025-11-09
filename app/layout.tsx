import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "@/contexts/MenuContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menu Manager",
  description: "Menu management system with CRUD operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MenuProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </MenuProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
