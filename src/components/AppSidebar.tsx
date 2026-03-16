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
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Collectors", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widget Design", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = profile?.company_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const plan = profile?.plan || "Free Plan";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="px-2">
        <div className={`flex items-center gap-2.5 px-3 pt-5 pb-6 ${collapsed ? "justify-center" : ""}`}>
          <Link to="/dashboard" className="flex items-center gap-2.5 group hover:scale-105 transition-transform duration-200">
            <img src="/logo-icon.svg" alt="Vouchy Logo Icon" className="h-7 w-7 object-contain" />
            {!collapsed && (
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                vouchy
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer ${collapsed ? "justify-center" : ""}`}>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {initials}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-foreground truncate">{displayName}</div>
                  <div className="text-2xs text-muted-foreground truncate">{plan}</div>
                </div>
              )}
              {!collapsed && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold">{displayName}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings" className="flex items-center gap-2 cursor-pointer w-full">
                <UserIcon className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
