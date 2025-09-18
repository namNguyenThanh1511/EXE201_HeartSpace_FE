# Hướng dẫn kết nối API trong dự án

Tài liệu này mô tả chuẩn triển khai **service API**, **hook xử lý logic**, và **component giao diện** để dễ dàng kết nối, quản lý, và tái sử dụng API trong dự án React/Next.js.

---

## 1. Tạo Service kết nối API

Mỗi service sẽ được định nghĩa trong file `services/api/<name>-service.ts`.

Ví dụ: `auth-service.ts`

```ts
import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

export enum Roles {
  Admin = "Admin",
  User = "User",
}

export interface LoginCredentials {
  keyLogin: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiry: Date;
  refreshTokenExpiry: Date;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export const AuthService = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiService.post<ApiResponse<LoginResponseData>, LoginCredentials>(
      "api/auth/login",
      credentials
    );
    return response.data;
  },

  // Đăng ký
  register: async (credentials: RegisterCredentials) => {
    const response = await apiService.post<ApiResponse<null>, RegisterCredentials>(
      "api/auth/register",
      credentials
    );
    return response.data;
  },
};
```

2. Tạo Hook sử dụng Service

Mỗi service nên có một custom hook đi kèm, được lưu trong hooks/services/use-<name>.ts.

Ví dụ: use-auth.ts

```ts
import { useState } from "react";
import { useAuthStore } from "@/store/zustand/auth-store";
import { AuthService, LoginCredentials, RegisterCredentials } from "@/services/api/auth-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const { login, logout, setToken, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Xử lý login
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(credentials);
      if (response.isSuccess) {
        setToken(response.data.accessToken);
        toast.success("Login successful!");
        router.push("/");
      } else {
        setError(response.message || "Login failed");
        toast.error(response.message || "Login failed");
      }
    } catch {
      setError("An error occurred during login");
      toast.error("An error occurred during login");
    }
    setLoading(false);
  };

  // Xử lý register
  const handleRegister = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(credentials);
      if (response.isSuccess) {
        toast.success("Registration successful! Please log in.");
        router.push("/login");
      } else {
        setError(response.message || "Registration failed");
        toast.error(response.message || "Registration failed");
      }
    } catch {
      setError("An error occurred during registration");
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return {
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated,
  };
}
```

3. Sử dụng Hook trong Component

Ví dụ: login-form.tsx

```ts
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

// Schema validation bằng Zod
const loginSchema = z.object({
  keyLogin: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      { message: "Please enter a valid email or phone number" }
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

    // Validate bằng Zod
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
        <p className="text-muted-foreground text-sm">
          Enter your email or phone number below to login
        </p>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>

      <div className="grid gap-6">
        {/* KeyLogin */}
        <div className="grid gap-3">
          <Label htmlFor="keyLogin">Email or Phone Number</Label>
          <Input id="keyLogin" name="keyLogin" type="text" required />
          {formErrors.keyLogin && <p className="text-destructive text-sm">{formErrors.keyLogin}</p>}
        </div>

        {/* Password */}
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

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox id="rememberMe" name="rememberMe" />
          <Label htmlFor="rememberMe">Remember me</Label>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Don’t have an account?{" "}
        <Link href={REGISTER_ROUTE} className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </form>
  );
}
```

4. Quy ước chuẩn

Service

Đặt trong services/api/<name>-service.ts

Định nghĩa interface cho request/response

Các function gọi API (get, post, put, delete)

Hook

Đặt trong hooks/services/use-<name>.ts

Đóng gói logic xử lý API (login, register, CRUD, v.v.)

Trả về state (loading, error, data) và các action

Component

Sử dụng hook để gọi API

Xử lý UI/UX, hiển thị loading, error

Validate dữ liệu đầu vào bằng Zod/Yup
