import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { Metadata } from "next";
import { ThemeProvider } from "@/context/providers/theme-provider";
import { AppSidebarAdmin } from "@/components/features/admin/app-sidebar-admin";

export const metadata: Metadata = {
  title: "HeartSpace Dashboard",
  icons: {
    icon: "/LOGO_RV_red-01-01.png",
    apple: "/LOGO_RV_red-01-01.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <AppSidebarAdmin variant="inset" collapsible="icon" />
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}
