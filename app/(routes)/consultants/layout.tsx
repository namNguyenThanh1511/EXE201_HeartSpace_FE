import Sidebar from "@/components/composite/home-side-bar";

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-50 overflow-y-auto">{children}</main>
    </div>
  );
}
