"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { REGISTER_ROUTE } from "@/lib/strings";
import { useAuth } from "@/hooks/services/use-auth";
import { FormEvent, useState } from "react";
import { z } from "zod";

// Zod schema for form validation
const loginSchema = z.object({
  keyLogin: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        // Validate as email or phone number
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: "Please enter a valid email or phone number",
      }
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login, loading, error } = useAuth();
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const credentials = {
      keyLogin: formData.get("keyLogin") as string,
      password: formData.get("password") as string,
      rememberMe: formData.get("rememberMe") === "on",
    };

    // Validate form data with Zod
    const result = loginSchema.safeParse(credentials);
    if (!result.success) {
      const errors = Object.fromEntries(
        Object.entries(result.error.flatten().fieldErrors).map(([key, value]) => [key, value?.[0]])
      );
      setFormErrors(errors);
      return;
    }

    await login(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email or phone number below to login to your account
        </p>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="keyLogin">Email or Phone Number</Label>
          <Input
            id="keyLogin"
            name="keyLogin"
            type="text"
            placeholder="Email or phone number"
            required
          />
          {formErrors.keyLogin && <p className="text-destructive text-sm">{formErrors.keyLogin}</p>}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
          {formErrors.password && <p className="text-destructive text-sm">{formErrors.password}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="rememberMe" name="rememberMe" />
          <Label htmlFor="rememberMe">Remember me</Label>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href={REGISTER_ROUTE} className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </form>
  );
}
