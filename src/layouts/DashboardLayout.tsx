import { useState, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({ sidebarCollapsed: false, setSidebarCollapsed: () => {} });
export const useLayout = () => useContext(LayoutContext);

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <LayoutContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed }}>
      <div className="h-screen flex overflow-hidden bg-background">
        {/* Desktop sidebar */}
        {!isMobile && <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />}

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto ${isMobile ? "pb-20" : ""}`}>
          <div className="py-8 w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav */}
        {isMobile && <MobileBottomNav />}
      </div>
    </LayoutContext.Provider>
  );
}
