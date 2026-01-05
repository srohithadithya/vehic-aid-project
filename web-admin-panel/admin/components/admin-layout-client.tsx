"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { LanguageProvider } from "@/context/LanguageContext";

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (!token && pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }, [pathname]);

  // Don't render admin layout on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-gray-100/40">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </LanguageProvider>
  );
}
