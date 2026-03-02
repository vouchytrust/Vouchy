import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  CheckCircle2,
  X,
  Sun,
  Moon,
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
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { updateTestimonialStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

/* ── Types ── */
interface PendingTestimonial {
  id: string;
  author_name: string;
  content: string;
  type: string;
  created_at: string;
  spaces: { name: string } | null;
}

/* ── Nav items ── */
const navItems = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { title: "Spaces", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widget Lab", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const quickLinks = [
  { label: "Dashboard", url: "/dashboard", icon: Home },
  { label: "Testimonials", url: "/dashboard/testimonials", icon: MessageSquareText },
  { label: "Spaces", url: "/dashboard/spaces", icon: FolderOpen },
  { label: "Widget Lab", url: "/dashboard/widgets", icon: Palette },
  { label: "Settings", url: "/dashboard/settings", icon: Settings },
];

/* ═══════════════════════════════════════════════════════ */
export function DashboardTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const companyName = profile?.company_name || "Workspace";
  const userEmail = user?.email || "";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "User";
  const initials = userName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url);

  const handleSignOut = async () => { await signOut(); navigate("/auth"); };

  /* ── Search state ── */
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── Notifications state ── */
  const [pending, setPending] = useState<PendingTestimonial[]>([]);
  const [notifsOpen, setNotifsOpen] = useState(false);

  /* ── Load pending testimonials ── */
  const loadPending = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("testimonials")
        .select("id, author_name, content, type, created_at, spaces(name)")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10);
      setPending((data as any[]) || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadPending(); }, [loadPending]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/testimonials?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  /* ── Approve / reject from notification ── */
  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateTestimonialStatus(id, status);
      setPending(prev => prev.filter(p => p.id !== id));
      toast({ title: status === "approved" ? "Testimonial approved ✓" : "Testimonial rejected" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <>
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card">
        {/* Top row */}
        <div className="flex items-center justify-between h-[52px] px-5">
          {/* Left: brand + workspace */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-200">
              <img src="/src/assets/logo-icon.svg" alt="Vouchy Logo Icon" className="h-8 w-8 object-contain" />
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
                <DropdownMenuItem className="text-[12px]" onClick={() => navigate("/dashboard/spaces")}>
                  <Plus className="h-3.5 w-3.5 mr-2" /> New Space
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: actions + user */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-8 w-32 md:w-64 pl-8 pr-3 text-[12px] bg-muted/50 border border-border/50 rounded-lg outline-none focus:ring-1 focus:ring-primary/40 focus:bg-background transition-all"
              />
            </form>

            {/* Notifications */}
            <DropdownMenu open={notifsOpen} onOpenChange={setNotifsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
                  onClick={loadPending}
                >
                  <Bell className="h-4 w-4" />
                  {pending.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-3.5 h-3.5 bg-destructive rounded-full flex items-center justify-center"
                    >
                      <span className="text-[8px] font-bold text-white leading-none">
                        {pending.length > 9 ? "9+" : pending.length}
                      </span>
                    </motion.span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[340px] p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-[13px] font-semibold text-foreground">Notifications</span>
                  {pending.length > 0 && (
                    <span className="text-[10px] font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                      {pending.length} pending
                    </span>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {pending.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-[12px] text-muted-foreground">You're all caught up!</p>
                    </div>
                  ) : (
                    pending.map((p) => (
                      <div key={p.id} className="px-4 py-3 border-b border-border/60 last:border-0 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-vouchy-warning/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-vouchy-warning" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[12px] font-medium text-foreground truncate">{p.author_name}</span>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1.5">
                              {p.type === "video" ? "📹 Submitted a video testimonial" : p.content}
                            </p>
                            {p.spaces?.name && (
                              <span className="text-[10px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-md">
                                {p.spaces.name}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1.5 mt-2 ml-9">
                          <button
                            onClick={() => handleAction(p.id, "approved")}
                            className="flex items-center gap-1 text-[11px] font-medium text-vouchy-success hover:bg-vouchy-success/10 px-2 py-1 rounded-md transition-colors"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(p.id, "rejected")}
                            className="flex items-center gap-1 text-[11px] font-medium text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md transition-colors"
                          >
                            <X className="h-3 w-3" /> Reject
                          </button>
                          <button
                            onClick={() => { navigate("/dashboard/testimonials"); setNotifsOpen(false); }}
                            className="ml-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {pending.length > 0 && (
                  <div className="border-t border-border px-4 py-2.5">
                    <button
                      onClick={() => { navigate("/dashboard/testimonials"); setNotifsOpen(false); }}
                      className="w-full text-[11px] text-primary hover:underline font-medium text-center"
                    >
                      View all in Testimonials →
                    </button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
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
    </>
  );
}
