import Logo from "@/components/features/logo";
import { images } from "@/lib/images-var";
import { GalleryVerticalEnd } from "lucide-react";
import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode; // component form truyền vào
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side: logo + form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>

      {/* Right side: image */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src={images.authIllustration}
          alt="Auth illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
