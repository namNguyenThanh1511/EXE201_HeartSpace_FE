// app/(routes)/(consultant)/layout.tsx
import Sidebar from "@/components/composite/admin-side-bar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen  overflow-y-auto">{children}</main>
    </div>
  );
}
