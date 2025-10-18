// components/header/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";
import Logo from "../features/logo";
import { MainNavigationMenu } from "../features/navigation-menu";
import { MobileMenu } from "../mobile/mobile-menu";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { useAuthStore } from "@/store/zustand/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header() {
  const { isAuthenticated, user, syncAuthState, logout } = useAuthStore();
  console.log(user);
  useEffect(() => {
    syncAuthState();
  }, [syncAuthState]);

  return (
    <div className="w-full bg-background text-foreground sticky top-0 z-50 flex-shrink-0 shadow-sm">
      <header className="absolute inset-x-0 top-0 z-50 bg-background/10 backdrop-blur-md border-b border-border/20">
        <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <MainNavigationMenu />

          {/* Right side actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Common menu items for all roles */}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>

                  {/* Role-based menu items */}
                  {user.role === "client" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings">Bookings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/payment">Payment</Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.role === "consultant" && (
                    <DropdownMenuItem asChild>
                      <Link href="/schedules">Schedules</Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <div onClick={logout} className="w-full text-red-600 focus:text-red-600">
                      Log out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-black hover:text-white/80 hover:bg-white/10"
                  >
                    Log in
                  </Button>
                </Link>

                <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu logo={<Logo />} />
        </nav>
      </header>
    </div>
  );
}
