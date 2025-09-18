import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <div className="flex justify-center gap-2 md:justify-start">
      <Link href="/" className="flex items-center gap-2 font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        HeartSpace Th.
      </Link>
    </div>
  );
}
