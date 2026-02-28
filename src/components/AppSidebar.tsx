import { Home, MessageSquareText, FolderOpen, Palette, Settings, Star, ChevronRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
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
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="px-2">
        {/* Brand */}
        <div className={`flex items-center gap-2.5 px-3 pt-5 pb-6 ${collapsed ? "justify-center" : ""}`}>
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg vouchy-gradient-bg flex items-center justify-center transition-transform group-hover:scale-105">
              <Star className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                Vouchy
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-2xs font-medium text-muted-foreground/70 uppercase tracking-wider px-3 mb-1">
              Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = item.url === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
                          ${isActive
                            ? "bg-primary/[0.08] text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }
                        `}
                        activeClassName=""
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />
                        )}
                        <item.icon className={`h-[16px] w-[16px] shrink-0 transition-colors ${isActive ? "text-primary" : ""}`} strokeWidth={isActive ? 2 : 1.75} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-2 pb-4">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer ${collapsed ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center">
            <span className="text-2xs font-semibold text-primary">JD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-foreground truncate">Jane Doe</div>
              <div className="text-2xs text-muted-foreground truncate">Pro Plan</div>
            </div>
          )}
          {!collapsed && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
