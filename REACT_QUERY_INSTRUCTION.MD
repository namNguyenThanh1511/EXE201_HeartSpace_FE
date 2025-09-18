# React Query Implementation

## Giới thiệu

Tài liệu này hướng dẫn cách cài đặt và triển khai **React Query** trong dự án React/Next.js, giúp quản lý dữ liệu server-side hiệu quả, tối ưu cache, và giảm số lần gọi API không cần thiết.

Cấu hình QueryClientProvider

Tạo một provider để bọc toàn bộ ứng dụng:

```ts
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

Sau đó bọc vào layout.tsx:

```ts
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
```

Sử dụng useQuery để fetch dữ liệu

Ví dụ gọi API lấy danh sách users:

```ts
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export default function UserList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

Sử dụng useMutation để post dữ liệu

Ví dụ thêm mới user:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addUser = async (user: { name: string }) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
};

export default function AddUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: "New User" })} disabled={mutation.isLoading}>
      {mutation.isLoading ? "Adding..." : "Add User"}
    </button>
  );
}
```

Các tính năng hữu ích

Cache: Giảm số lần gọi API khi dữ liệu chưa thay đổi.

Refetching: Tự động refetch dữ liệu khi user quay lại trang.

Devtools: Dễ dàng debug cache và query state.
