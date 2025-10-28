"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BadgeCent,
  Calendar,
  CameraIcon,
  FileCodeIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MessageCircle,
  Newspaper,
  UserCog,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";

import Link from "next/link";

export function AppSidebarConsultant({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigationData = {
    navMain: [
      {
        title: "Dashboard",
        url: "/consultant/dashboard",
        icon: () => <LayoutDashboardIcon />,
      },
      {
        title: "Lịch hẹn",
        url: "/consultant/appointments",
        icon: () => <Calendar />,
      },
      {
        title: "Chat",
        url: "/consultant/consultant-chat",
        icon: () => <MessageCircle />,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: CameraIcon,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: FileTextIcon,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: FileCodeIcon,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/consultant/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">HeartSpace Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
