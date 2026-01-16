import type { Metadata } from "next";
import "./globals.css";
import { AdminMainLayout } from "@/components/admin-layout-client";

const inter = { className: "font-sans" }; // Use standard tailwind sans font stack

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
      <body className={inter.className} suppressHydrationWarning={true}>
        <AdminMainLayout>{children}</AdminMainLayout>
      </body>
    </html>
  );
}
