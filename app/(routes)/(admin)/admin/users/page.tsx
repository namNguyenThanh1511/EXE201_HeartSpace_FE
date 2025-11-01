import data from "./data.json";
import { DataTable } from "./components/data-table-admin-user";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
