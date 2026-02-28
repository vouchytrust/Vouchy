import { Home, MessageSquareText, FolderOpen, Palette, Settings, Star } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Spaces", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widget Lab", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-4 mb-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg vouchy-gradient-bg flex items-center justify-center shrink-0">
                <Star className="h-4 w-4 text-primary-foreground" />
              </div>
              {!collapsed && <span className="text-lg font-bold text-foreground">Vouchy</span>}
            </Link>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className={`px-3 py-3 ${collapsed ? "text-center" : ""}`}>
          <div className="w-8 h-8 rounded-full vouchy-gradient-bg flex items-center justify-center text-xs font-semibold text-primary-foreground">
            JD
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
