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
import { NavUser } from "../user/nav-user";
import Link from "next/link";

export function AppSidebarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigationData = {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: () => <LayoutDashboardIcon />,
      },
      {
        title: "Người dùng",
        url: "/admin/users",
        icon: () => <Users />,
      },
      {
        title: "Lịch hẹn",
        url: "/admin/appointments",
        icon: () => <Calendar />,
      },
      {
        title: "Chat",
        url: "/admin/admin-chat",
        icon: () => <MessageCircle />,
      },
      {
        title: "Tin tức",
        url: "/admin/news",
        icon: () => <Newspaper />,
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
    // navSecondary: [
    //   {
    //     title: t('appSidebar.settings'),
    //     url: '#',
    //     icon: SettingsIcon,
    //   },
    //   {
    //     title: t('appSidebar.getHelp'),
    //     url: '#',
    //     icon: HelpCircleIcon,
    //   },
    //   {
    //     title: t('appSidebar.search'),
    //     url: '#',
    //     icon: SearchIcon,
    //   },
    // ],
    // documents: [
    //   {
    //     name: 'Data Library',
    //     url: '#',
    //     icon: DatabaseIcon,
    //   },
    //   {
    //     name: 'Reports',
    //     url: '#',
    //     icon: ClipboardListIcon,
    //   },
    //   {
    //     name: 'Word Assistant',
    //     url: '#',
    //     icon: FileIcon,
    //   },
    // ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/admin/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">HeartSpace Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        {/* <NavDocuments items={navigationData.documents} /> */}
        {/* <NavSecondary items={navigationData.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
