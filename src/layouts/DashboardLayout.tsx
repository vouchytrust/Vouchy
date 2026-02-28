import { Outlet } from "react-router-dom";
import { DashboardTopbar } from "@/components/DashboardTopbar";

export default function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <DashboardTopbar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 sm:px-8 py-8 max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
