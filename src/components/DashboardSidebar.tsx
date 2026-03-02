import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageSquareText, FolderOpen, Palette, Settings, Star, ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Spaces", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widget Lab", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: Props) {
  const location = useLocation();

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full flex flex-col border-r border-border/60 bg-card relative select-none shrink-0"
    >
      {/* Brand */}
      <div className={`flex items-center h-14 px-4 ${collapsed ? "justify-center" : "gap-2.5"}`}>
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-[10px] vouchy-gradient-bg flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.04]">
            <Star className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[15px] font-semibold tracking-tight text-foreground overflow-hidden whitespace-nowrap"
              >
                Vouchy
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-border/50" />

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 pb-2 pt-1"
            >
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.08em]">Menu</span>
            </motion.div>
          )}
        </AnimatePresence>

        {navItems.map((item) => {
          const active = isActive(item);
          const content = (
            <Link
              key={item.title}
              to={item.url}
              className={`
                group relative flex items-center gap-2.5 rounded-[8px] transition-all duration-150
                ${collapsed ? "h-9 w-9 mx-auto justify-center" : "h-9 px-2.5"}
                ${active
                  ? "bg-primary/[0.08] text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }
              `}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <item.icon
                className={`h-4 w-4 shrink-0 transition-colors duration-150 ${active ? "text-primary" : ""}`}
                strokeWidth={active ? 2.2 : 1.7}
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[13px] font-medium overflow-hidden whitespace-nowrap"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return content;
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-3 space-y-1">
        <div className="mx-1 h-px bg-border/50 mb-2" />

        {/* User */}
        <div className={`flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 hover:bg-accent/60 cursor-pointer transition-colors ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 border border-border/80 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-primary">JD</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <div className="text-[12px] font-medium text-foreground truncate leading-tight">Jane Doe</div>
                <div className="text-[10px] text-muted-foreground/70 truncate leading-tight">Pro Plan</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 rounded-[8px] h-8 text-muted-foreground/60 hover:text-muted-foreground hover:bg-accent/40 transition-all duration-150 w-full ${collapsed ? "justify-center" : "px-2.5"}`}
        >
          {collapsed ? (
            <ChevronsRight className="h-3.5 w-3.5" />
          ) : (
            <>
              <ChevronsLeft className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
