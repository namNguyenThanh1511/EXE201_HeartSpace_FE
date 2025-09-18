// components/header/navigation-menu.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components = [
  {
    title: "Analytics Dashboard",
    href: "/analytics",
    description: "Advanced analytics and reporting tools for your business.",
  },
  {
    title: "Project Management",
    href: "/projects",
    description: "Collaborate and manage your projects efficiently.",
  },
  {
    title: "Team Collaboration",
    href: "/teams",
    description: "Work together seamlessly with your team members.",
  },
];

export function MainNavigationMenu() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {/* Product Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-black hover:text-white/80 data-[state=open]:text-white/80">
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">Our Platform</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Discover the power of our comprehensive business solution.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Features Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-black hover:text-white/80 data-[state=open]:text-white/80">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {[
                {
                  title: "Advanced Security",
                  description: "Enterprise-grade security for your data.",
                },
                {
                  title: "Real-time Sync",
                  description: "Stay updated with real-time synchronization.",
                },
                {
                  title: "Custom Integrations",
                  description: "Connect with your favorite tools and services.",
                },
                {
                  title: "24/7 Support",
                  description: "Get help whenever you need it.",
                },
              ].map((feature) => (
                <ListItem key={feature.title} title={feature.title} href="#">
                  {feature.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Simple Links */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/marketplace"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-black hover:text-white/80 hover:bg-white/10"
              )}
            >
              Marketplace
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/company"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-black hover:text-white/80 hover:bg-white/10"
              )}
            >
              Company
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/**
 * Reusable ListItem component
 */
const ListItem = ({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
