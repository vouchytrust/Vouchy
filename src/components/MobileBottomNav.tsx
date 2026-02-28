import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageSquareText, FolderOpen, Palette, Settings } from "lucide-react";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Spaces", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widgets", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-card/80 backdrop-blur-xl border-t border-border/40" />

      {/* Safe area + content */}
      <div className="relative grid grid-cols-5 items-end gap-0 px-0 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = isActive(item);

          return (
            <Link
              key={item.title}
              to={item.url}
              className="relative flex w-full flex-col items-center justify-center gap-0.5 py-2 rounded-none transition-colors duration-150"
            >
              {/* Active pill background */}
              {active && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-x-1 inset-y-1 bg-primary/[0.08] rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className="relative">
                <item.icon
                  className={`h-[18px] w-[18px] transition-colors duration-150 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={active ? 2.3 : 1.7}
                />
                {/* Active dot */}
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </div>

              {/* Label */}
              <span className={`text-[9px] font-medium transition-colors duration-150 leading-none ${
                active ? "text-primary" : "text-muted-foreground/70"
              }`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
