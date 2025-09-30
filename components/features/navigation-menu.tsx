// components/header/navigation-menu.tsx
"use client";

import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

// Đổi các mục header thành: Chuyên gia, Lộ trình, Lời Khuyên, Hỏi đáp
export function MainNavigationMenu() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/experts"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-black hover:text-white/80 hover:bg-white/10"
              )}
            >
              Chuyên gia
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/roadmap"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-black hover:text-white/80 hover:bg-white/10"
              )}
            >
              Lộ trình
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/advice"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-black hover:text-white/80 hover:bg-white/10"
              )}
            >
              Lời Khuyên
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/faq"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-black hover:text-white/80 hover:bg-white/10"
              )}
            >
              Hỏi đáp
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
