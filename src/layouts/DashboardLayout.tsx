import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center px-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md">
            <SidebarTrigger className="h-7 w-7 text-muted-foreground hover:text-foreground" />
          </header>
          <Separator className="opacity-50" />
          <main className="flex-1 px-8 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
