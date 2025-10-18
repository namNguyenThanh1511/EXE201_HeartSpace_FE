"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Home,
  FolderKanban,
  MessageSquare,
  Users,
  Star,
  Settings,
  HelpCircle,
  ChevronDown,
  Copy,
  Menu,
  X,
} from "lucide-react";

import apiService from "@/services/api/core";
import { useAuthStore } from "@/store/zustand/auth-store";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("consultants");
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, token } = useAuthStore();

  const menuItems = [
    { id: "search", label: "Search", icon: Search, hasSubmenu: false },
    { id: "home", label: "Home", icon: Home, hasSubmenu: false },
    { id: "projects", label: "Projects", icon: FolderKanban, hasSubmenu: true },
    { id: "messages", label: "Messages", icon: MessageSquare, hasSubmenu: false },
    { id: "consultants", label: "Consultants", icon: Users, hasSubmenu: false },
    { id: "favorites", label: "Favorites", icon: Star, hasSubmenu: false },
  ];

  const bottomMenuItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  const fallbackUser = {
    fullName: "Guest",
    email: "guest@example.com",
    avatar: null,
  };

  const displayUser = user || fallbackUser;
  console.log(displayUser);

  return (
    <>
      {/* Sidebar Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!collapsed && (
            <h1 className="text-2xl font-bold text-gray-900 transition-opacity">HeartSpace</h1>
          )}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-2 overflow-y-auto">
          <div className="space-y-1 mt-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setActiveMenu(item.id);
                    if (item.id === "projects") {
                      setProjectsExpanded(!projectsExpanded);
                    }
                  }}
                  className={`w-full flex items-center ${
                    collapsed ? "justify-center" : "justify-between"
                  } px-3 py-3 rounded-lg text-sm font-medium transition-all
                    ${
                      activeMenu === item.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.hasSubmenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        projectsExpanded && item.id === "projects" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {!collapsed && item.id === "projects" && projectsExpanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      Active Projects
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      Archived
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Manage Section */}
          {!collapsed && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Manage
              </p>
              <div className="space-y-1">
                {bottomMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${
                        activeMenu === item.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Avatar className="w-10 h-10 border-2 border-gray-200">
              <AvatarImage src={displayUser.avatar || ""} alt={displayUser.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {displayUser.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {displayUser.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{displayUser.email}</p>
                </div>
                <Copy className="w-4 h-4 text-gray-400" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Offset filler */}
      <div
        className={`${collapsed ? "w-20" : "w-64"} hidden lg:block transition-all duration-300`}
      />

      {/* Toggle button for mobile (bottom left corner) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-6 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
