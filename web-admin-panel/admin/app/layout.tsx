import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AdminLayoutClient } from "@/components/admin-layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vehic-Aid Admin Panel",
  description: "Admin dashboard for Vehic-Aid vehicle assistance platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
