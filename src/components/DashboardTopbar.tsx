import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  MessageSquareText,
  FolderOpen,
  Palette,
  Settings,
  Star,
  Bell,
  Search,
  Plus,
  ChevronDown,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Spaces", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widget Lab", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();

  const companyName = profile?.company_name || "Workspace";
  const userEmail = user?.email || "";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "User";
  const initials = userName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card">
      {/* Top row */}
      <div className="flex items-center justify-between h-[52px] px-5">
        {/* Left: brand + workspace */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg vouchy-gradient-bg flex items-center justify-center">
              <Star className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </Link>

          <div className="h-5 w-px bg-border/60" />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-[13px] font-medium text-foreground hover:text-foreground/80 transition-colors outline-none">
              {companyName}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="text-[12px]">{companyName}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[12px]">Create workspace</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right: actions + user */}
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="h-5 w-px bg-border/60 mx-1" />

          <Button size="sm" className="h-7 text-[11px] gap-1 px-2.5" onClick={() => navigate("/dashboard/spaces")}>
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">New Space</span>
          </Button>

          <div className="h-5 w-px bg-border/60 mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                <span className="text-[9px] font-semibold text-primary">{initials}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <div className="px-2 py-1.5">
                <div className="text-[12px] font-medium text-foreground">{userName}</div>
                <div className="text-[10px] text-muted-foreground">{userEmail}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[12px]" onClick={() => navigate("/dashboard/settings")}>
                <Settings className="h-3.5 w-3.5 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[12px] text-destructive" onClick={handleSignOut}>
                <LogOut className="h-3.5 w-3.5 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom row: navigation tabs */}
      <div className="flex items-center gap-0 px-5 -mb-px">
        {navItems.map((navItem) => {
          const active = isActive(navItem);
          return (
            <Link
              key={navItem.title}
              to={navItem.url}
              className={`
                relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-colors duration-150
                ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
              `}
            >
              <navItem.icon className="h-3.5 w-3.5" strokeWidth={active ? 2.2 : 1.6} />
              <span className="hidden sm:inline">{navItem.title}</span>

              {active && (
                <motion.div
                  layoutId="topbar-tab"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
