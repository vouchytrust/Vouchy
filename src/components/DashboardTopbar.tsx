import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageSquareText, FolderOpen, Palette, Settings, Star, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Spaces", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widget Lab", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardTopbar() {
  const location = useLocation();

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-card/80 backdrop-blur-xl border-b border-border/40" />
      <div className="relative flex items-center justify-between h-14 px-6">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group shrink-0">
          <div className="h-8 w-8 rounded-[10px] vouchy-gradient-bg flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.04]">
            <Star className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground hidden sm:block">
            Vouchy
          </span>
        </Link>

        {/* Center nav */}
        <nav className="flex items-center gap-0.5 bg-muted/50 rounded-xl p-1 border border-border/30">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`
                  relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200
                  ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
                `}
              >
                {active && (
                  <motion.div
                    layoutId="topbar-active"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/50"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <item.icon className="h-3.5 w-3.5" strokeWidth={active ? 2.2 : 1.7} />
                  <span className="hidden md:inline">{item.title}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right side — user */}
        <div className="flex items-center gap-3 shrink-0">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 border border-border/80 flex items-center justify-center hover:scale-105 transition-transform">
                <span className="text-[10px] font-semibold text-primary">JD</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Jane Doe · Pro Plan
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
