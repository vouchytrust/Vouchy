import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageSquareText, FolderOpen, Palette, Settings } from "lucide-react";

const navItems = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Collectors", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widgets", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      {/* Solid background */}
      <div className="absolute inset-0 bg-card/90 border-t border-border/40" />

      {/* Safe area + content */}
      <div className="relative flex items-end justify-around px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = isActive(item);

          return (
            <Link
              key={item.title}
              to={item.url}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors duration-150"
            >
              {/* Icon */}
              <div className="relative z-10">
                <item.icon
                  className={`h-[18px] w-[18px] transition-all duration-300 ${active ? "text-primary hover:scale-110" : "text-muted-foreground"
                    }`}
                  strokeWidth={active ? 2.5 : 1.7}
                />
              </div>

              {/* Label */}
              <span className={`text-[9px] font-medium transition-colors duration-150 leading-none ${active ? "text-primary" : "text-muted-foreground/70"
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
