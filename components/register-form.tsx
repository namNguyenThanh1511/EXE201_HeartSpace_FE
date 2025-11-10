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
    bio: "",
    gender: true,
  } as ApiRegisterCredentials);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    let message = "";

    if (name === "phoneNumber") {
      if (/\s/.test(value)) message = "Phone number cannot contain spaces";
      else if (!/^\+?\d{8,15}$/.test(value)) message = "Invalid phone number format";
    }

    if (name === "password") {
      if (/\s/.test(value)) message = "Password cannot contain spaces";
      else if (value.length < 6) message = "Password must be at least 6 characters";
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) message = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value); // 👈 realtime validation
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check all fields again before submit
    Object.entries(formData).forEach(([key, value]) => validateField(key, value as string));

    const hasError = Object.values(errors).some((msg) => msg);
    if (hasError) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await register(formData);
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
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
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
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
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
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
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
