import { Outlet } from "react-router-dom";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <DashboardTopbar />
      <main className="flex-1 overflow-y-auto">
        {/* pb-20 on mobile to make room for the bottom nav */}
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
