// app/(routes)/(consultant)/layout.tsx
import Sidebar from "@/components/composite/consultant-side-bar";

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}