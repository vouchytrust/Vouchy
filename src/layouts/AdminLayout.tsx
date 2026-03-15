import { useState, ReactNode } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Layers, 
  MessageSquare, 
  ShieldCheck, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { VouchyLogo } from "@/components/VouchyLogo";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { label: "Overview", icon: BarChart3, path: "/admin" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Spaces", icon: Layers, path: "/admin/spaces" },
    { label: "Testimonials", icon: MessageSquare, path: "/admin/testimonials" },
  ];

  return (
    <div className="flex h-screen bg-white font-sans selection:bg-black selection:text-white overflow-hidden flex-col md:flex-row">
      {/* SIDEBAR (Desktop) */}
      <motion.aside 
        animate={{ width: collapsed ? 80 : 260 }}
        className="hidden md:flex h-full bg-slate-50 border-r border-slate-200/60 flex-col relative z-50 shrink-0"
      >
        {/* LOGO AREA */}
        <div className="p-6 mb-4">
          <Link to="/admin" className="flex items-center gap-3 group/logo">
            <div className={`w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all duration-500 ${collapsed ? "mx-auto" : ""}`}>
              <img src="/logo-icon-white.svg" alt="Vouchy" className="w-5 h-5 object-contain" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-950 tracking-tighter uppercase leading-none">Vouchy</span>
                <span className="text-[8px] font-black text-emerald-600 tracking-[0.2em] uppercase mt-0.5">Admin Portal</span>
              </div>
            )}
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-white border border-slate-200 text-slate-950 shadow-sm" 
                    : "text-slate-500 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-900"}`} />
                {!collapsed && (
                  <span className="text-[13px] font-bold tracking-tight">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM AREA */}
        <div className="p-3 border-t border-slate-200/40 space-y-2">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all group"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="text-[13px] font-bold tracking-tight">Collapse View</span>}
          </button>
          
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all group"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="text-[13px] font-bold tracking-tight">Sign out</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE BOTTOM MENU */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 h-16 px-6 flex items-center justify-between pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full relative ${
                isActive ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute top-0 w-8 h-0.5 bg-emerald-600 rounded-full" 
                />
              )}
            </Link>
          );
        })}
        <button 
          onClick={signOut}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] h-full text-slate-400"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Exit</span>
        </button>
      </nav>

      {/* CONTENT AREA */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth flex flex-col bg-white pb-20 md:pb-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}
