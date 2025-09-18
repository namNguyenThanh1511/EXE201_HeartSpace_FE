# 🧑‍💻 Coding Convention — Heart Space (Next.js + React Query)

Tài liệu này tóm tắt quy ước mã nguồn đang dùng trong repository và đồng bộ với các cấu hình hiện có (tsconfig, eslint, package.json).

## 📦 Kỹ thuật chính

- Next.js 15.5.3
- React 19.1.0
- TypeScript (project config sử dụng `strict: true`)
- @tanstack/react-query
- Radix UI / ShadCN (UI primitives)
- Tailwind CSS

> Phiên bản chi tiết và script nằm trong `package.json`.

---

## 📂 Cấu trúc chính của repository (thư mục gốc)

- `app/` — Next.js App Router (pages/route-based folders, layouts, server components)
  - Đây là nơi chứa các route chính, bao gồm các route nhóm trong `(routes)` hoặc `(auth)`, `page.tsx`, `layout.tsx`.
- `components/` — Các component tổng hợp, composite và UI-level components
  - ví dụ: `components/composite/`, `components/ui/`, `components/mobile/`, `components/features/`
- `config/` — cấu hình (ví dụ cookie-config.ts)
- `context/` — providers và wrapper (ví dụ `context/providers`)
- `hooks/` — custom hooks (business hooks, hooks dùng React Query)
- `lib/` — biến, helper nhỏ, constants (ví dụ `images-var.ts`, `strings.ts`)
- `services/` — API layer (`services/api/core.ts`, `services/api/*-service.ts`)
- `store/` — Zustand stores (ví dụ `store/zustand/auth-store.ts`)
- `public/` — assets tĩnh
- `styles/` — global CSS / Tailwind
- `types/` — type definitions (ví dụ `types/api-type.ts`)
- `utils/` — các util chung và hooks helper
- root files: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `CONVENTION.MD`


HeartSpace/
├── app/ # Next.js App Router (routes, layouts, server components)
│ ├── (auth)/... # auth-related routes
│ ├── (dashboard)/…
│ └── layout.tsx
├── components/ # UI components (Atomic Design)
│ ├── composite/
│ ├── ui/
│ ├── mobile/
│ └── features/
├── config/ # config files (cookie-config.ts, env.ts, …)
├── context/ # Providers và wrappers
├── hooks/ # Custom hooks (business + react-query)
├── lib/ # Constants, helpers nhỏ (images-var.ts, strings.ts)
├── services/ # API service layer
│ └── api/
│ ├── core.ts
│ └── auth-service.ts
├── store/ # Zustand stores (auth-store.ts, …)
├── styles/ # Tailwind/global CSS
├── types/ # Type definitions (api-type.ts, …)
├── utils/ # Helpers & utilities
└── public/ # Static assets

---

## 📌 Quy ước đặt tên

- File: `kebab-case` (ví dụ `login-form.tsx`, `auth-service.ts`, `auth-store.ts`)
- React component (exported function / default export): Tên component dùng `PascalCase` (ví dụ `function LoginForm(...) {}`) — nhưng file vẫn để `kebab-case`
- Hook: `use-` prefix + kebab-case filename (ví dụ file `use-auth.ts`, export `useAuth`)
- Store: `kebab-case-store.ts` và export tên Pascal/Camel tương ứng (ví dụ `useAuthStore`)
- Variable / function: `camelCase`
- Type / Interface / Enum: `PascalCase`
- Constant values: `UPPER_SNAKE_CASE` (hoặc `camelCase` cho các constant export nếu cần theo convention nội bộ)

Lưu ý: repository hiện sử dụng alias `@/*` (được khai báo trong `tsconfig.json`), import nội bộ nên dùng `@/path/to/module`.

---

## ✨ Code style & tooling

- TypeScript được bật `strict` theo `tsconfig.json` — luôn bám chặt types, tránh `any` trừ khi có lý do rõ ràng.
- ESLint được cấu hình dựa trên `next/core-web-vitals` (xem `eslint.config.mjs`).
- Import order khuyến nghị:

  1. React / next imports
  2. External libraries
  3. Aliased/internal imports (`@/...`)
  4. Styles / asset imports

- Components: function components (React.FC không bắt buộc). Prefer explicit return type for exported functions when it improves readability.
- API responses: luôn type hoá (`ApiResponse<T>` hoặc interface cụ thể). Tránh trả về `any` từ service layer.
- Styling: dùng Tailwind utility classes; cho styles chung/variables đặt trong `styles/`.

Run & lint:

- dev: `npm run dev` (Next.js dev server)
- lint: `npm run lint` (chạy eslint)

---

## 🔗 Ví dụ service layer (hiện đang dùng trong repo)

`services/api/auth-service.ts` (ví dụ)

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
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiService.post<ApiResponse<LoginResponseData>, LoginCredentials>(
      "api/auth/login",
      credentials
    );
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<null>> => {
    const response = await apiService.post<ApiResponse<null>, RegisterCredentials>(
      "api/auth/register",
      credentials
    );
    return response.data;
  },
};
```

- React Query Implementation
1. Hook Structure

Hooks trong /hooks theo domain → useAuth, useUserQuery, …

Naming convention:

Query: use[Domain]Query

Mutation: use[Domain][Action]Mutation

Query keys: descriptive [domain, action, params]

Dùng enabled để conditionally fetch

Error handling đồng bộ (toast + error state)

2. Query Management

Query keys array-based: ["user", id], ["auth", "me"]

Serialize filter object → JSON.stringify

Luôn invalidate/refetch khi mutation thành công

Dùng select để transform data

Dùng queryClient khi cần quản lý cache thủ công

3. Mutation Patterns

Hỗ trợ optimistic updates khi phù hợp

Success/error → consistent handling

Luôn invalidate queries liên quan sau mutation

Toast notification cho feedback

Preserve typing xuyên suốt flow

4. State Management Integration

Server state: React Query

Auth/local state: Zustand

Token → lưu trong store + cookie

Loading/error → quản lý trong hook

Logout → clear cache, store, cookies

5. Performance Optimization

Cấu hình staleTime, cacheTime hợp lý

refetchOnWindowFocus: false (trừ khi cần realtime)

Deduplicate query với key giống nhau

Retry logic cho lỗi network

Prefetch data critical khi vào route




