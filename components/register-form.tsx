"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { LOGIN_ROUTE } from "@/lib/strings";
import { toast } from "sonner";
import { useAuth } from "@/hooks/services/use-auth";
import type { RegisterCredentials as ApiRegisterCredentials } from "@/services/api/auth-service";

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState<ApiRegisterCredentials>({
    fullName: "",
    email: "",
    phoneNumber: "",
    userName: "",
    password: "",
    confirmPassword: "",
    gender: true,
  } as ApiRegisterCredentials);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await register(formData); // Call the register function from useAuth
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to sign up for an account
        </p>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+1234567890"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup
            value={formData.gender ? "male" : "female"}
            onValueChange={(val: string) =>
              setFormData((prev) => ({ ...prev, gender: val === "male" }))
            }
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="male" id="gender-male" />
              <Label htmlFor="gender-male">Male</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="female" id="gender-female" />
              <Label htmlFor="gender-female">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="userName">Username</Label>
          <Input
            id="userName"
            name="userName"
            type="text"
            placeholder="johndoe"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <Button variant="outline" className="w-full" disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Sign Up with GitHub
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href={LOGIN_ROUTE} className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
