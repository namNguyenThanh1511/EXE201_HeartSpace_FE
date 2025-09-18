// components/header/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Logo from "../features/logo";
import { MainNavigationMenu } from "../features/navigation-menu";
import { MobileMenu } from "../mobile/mobile-menu";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full sticky top-0 z-50 flex-shrink-0">
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
            <Link href="/login">
              <Button variant="ghost" className="text-black hover:text-white/80 hover:bg-white/10">
                Log in
              </Button>
            </Link>

            <Button className="bg-white text-black hover:bg-white/90 font-semibold">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <MobileMenu logo={<Logo />} />
        </nav>
      </header>
    </div>
  );
}
