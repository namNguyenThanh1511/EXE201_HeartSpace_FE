"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface MobileMenuProps {
  logo?: React.ReactNode;
}

export function MobileMenu({ logo }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-background/95 backdrop-blur-md border-border/50"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center justify-between">
            {logo && <div>{logo}</div>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="product" className="border-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                Product
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <Link
                  href="/analytics"
                  className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Analytics Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Project Management
                </Link>
                <Link
                  href="/teams"
                  className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Team Collaboration
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="features" className="border-border/50">
              <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                Features
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Advanced Security
                </Link>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Real-time Sync
                </Link>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Custom Integrations
                </Link>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  24/7 Support
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-3">
            <Link
              href="/marketplace"
              className="block py-3 px-3 rounded-md hover:bg-muted transition-colors font-semibold"
              onClick={() => setOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/company"
              className="block py-3 px-3 rounded-md hover:bg-muted transition-colors font-semibold"
              onClick={() => setOpen(false)}
            >
              Company
            </Link>
          </div>

          <Separator />

          <div className="pt-4">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="w-full" size="lg">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
