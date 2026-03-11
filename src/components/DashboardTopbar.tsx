import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  MessageSquareText,
  FolderOpen,
  Palette,
  Settings,
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
import { updateTestimonialStatus, fetchSpaces, fetchTestimonials } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

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
  { title: "Collectors", url: "/dashboard/spaces", icon: FolderOpen },
  { title: "Widget Design", url: "/dashboard/widgets", icon: Palette },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
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
  const [showResults, setShowResults] = useState(false);
  const [allTestimonials, setAllTestimonials] = useState<any[]>([]);
  const [allSpaces, setAllSpaces] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── Notifications state ── */
  const [pending, setPending] = useState<PendingTestimonial[]>([]);
  const [notifsOpen, setNotifsOpen] = useState(false);

  /* ── Load Search Data ── */
  const loadSearchData = useCallback(async () => {
    try {
      const [spacesData, testimonialsData] = await Promise.all([
        fetchSpaces(),
        fetchTestimonials()
      ]);
      setAllSpaces(spacesData || []);
      setAllTestimonials(testimonialsData || []);
    } catch (err) {
      console.error("Error loading search data:", err);
    }
  }, []);

  useEffect(() => {
    loadSearchData();
  }, [loadSearchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Shortcuts ── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowResults(true);
      }
      if (e.key === "Escape") {
        setShowResults(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

  const handleSearchFocus = () => {
    setShowResults(true);
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
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/70 backdrop-blur-xl">
        {/* Top row */}
        <div className="flex items-center h-[52px] px-4 md:px-6 gap-2">
          {/* Left: brand + workspace */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-200">
              <img src="/src/assets/logo-icon.svg" alt="Vouchy Logo Icon" className="h-7 w-7 md:h-8 md:w-8 object-contain" />
            </Link>

            <div className="h-5 w-px bg-border/60" />

            {/* Company name dropdown — hidden on very small mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[13px] font-medium text-foreground hover:text-foreground/80 transition-colors outline-none max-w-[100px] sm:max-w-none truncate">
                <span className="truncate">{companyName}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem className="text-[12px]">{companyName}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[12px]" onClick={() => navigate("/dashboard/spaces")}>
                  <Plus className="h-3.5 w-3.5 mr-2" /> New Collector
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right group — everything right-aligned */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Search — desktop */}
            <div className="hidden md:block relative mr-1" ref={searchContainerRef}>
              <div className="relative group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onFocus={handleSearchFocus}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="h-8 w-32 lg:w-48 pl-8 pr-12 text-[11px] bg-muted/30 border border-border/40 rounded-lg outline-none focus:ring-1 focus:ring-primary/40 focus:bg-background transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/50 bg-background/50 font-mono text-[9px] text-muted-foreground pointer-events-none">
                  <span className="text-[10px]">⌘</span>K
                </div>
              </div>

              {/* Results Dropdown */}
              {showResults && (
                <div className="absolute top-full right-0 mt-2 w-80 lg:w-96 max-h-[480px] bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col z-[60]">
                  <Command className="border-0 rounded-none shadow-none flex flex-col h-full" filter={(value, search) => {
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                  }}>
                    <div className="hidden">
                      <CommandInput value={searchQuery} onValueChange={setSearchQuery} />
                    </div>
                    <CommandList className="max-h-[450px]">
                      <CommandEmpty className="py-6 text-[12px] text-muted-foreground">No matches found.</CommandEmpty>

                      <CommandGroup heading="Pages">
                        {navItems.map((item) => (
                          <CommandItem
                            key={item.url}
                            onSelect={() => {
                              navigate(item.url);
                              setShowResults(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer h-9"
                          >
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[12px]">{item.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>

                      {allSpaces.length > 0 && <CommandSeparator />}

                      {allSpaces.length > 0 && (
                        <CommandGroup heading="Collectors">
                          {allSpaces.map((space) => (
                            <CommandItem
                              key={space.id}
                              value={space.name}
                              onSelect={() => {
                                navigate(`/dashboard/spaces?slug=${space.slug}`);
                                setShowResults(false);
                              }}
                              className="flex items-center gap-2 cursor-pointer h-9 text-[12px]"
                            >
                              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                <FolderOpen className="h-3 w-3 text-primary" />
                              </div>
                              <span className="truncate">{space.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}

                      {allTestimonials.length > 0 && <CommandSeparator />}

                      {allTestimonials.length > 0 && (
                        <CommandGroup heading="Testimonials">
                          {allTestimonials.map((t) => (
                            <CommandItem
                              key={t.id}
                              value={t.author_name + " " + t.content}
                              onSelect={() => {
                                navigate(`/dashboard/testimonials?id=${t.id}`);
                                setShowResults(false);
                              }}
                              className="flex flex-col items-start gap-1 cursor-pointer py-3"
                            >
                              <div className="flex items-center justify-between w-full gap-2">
                                <span className="font-semibold text-foreground text-[12px] truncate">{t.author_name}</span>
                                <div className="flex items-center gap-0.5 shrink-0">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < t.rating ? "bg-vouchy-warning" : "bg-muted"}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 italic px-0.5">
                                "{t.content}"
                              </p>
                              {t.spaces?.name && (
                                <span className="text-[9px] text-primary/70 font-medium px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10">
                                  {t.spaces.name}
                                </span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>

            {/* Mobile search — uses same dropdown logic */}
            <div className="md:hidden" ref={searchContainerRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowResults(!showResults)}
              >
                <Search className="h-4 w-4" />
              </Button>

              {showResults && (
                <div className="fixed inset-x-4 top-14 bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col z-[60] max-h-[70vh]">
                  <div className="p-3 border-b border-border bg-muted/20">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search testimonials, collectors..."
                        className="h-9 w-full pl-8 pr-3 text-[13px] bg-background border border-border/50 rounded-lg outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <Command className="rounded-none border-0" filter={(value, search) => {
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                  }}>
                    <CommandList className="max-h-[50vh]">
                      <CommandEmpty className="py-8 text-center text-muted-foreground">No results.</CommandEmpty>
                      <CommandGroup heading="Quick Jump">
                        {navItems.map(item => (
                          <CommandItem key={item.url} onSelect={() => { navigate(item.url); setShowResults(false); }}>
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup heading="Testimonials">
                        {allTestimonials.slice(0, 10).map(t => (
                          <CommandItem key={t.id} value={t.author_name + " " + t.content} onSelect={() => { navigate(`/dashboard/testimonials?id=${t.id}`); setShowResults(false); }}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs">{t.author_name}</span>
                              <span className="text-[10px] text-muted-foreground line-clamp-1 italic">{t.content}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>

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

              <DropdownMenuContent align="end" className="w-[min(340px,calc(100vw-2rem))] p-0 overflow-hidden">
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

            {/* Theme toggle */}
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

            <div className="h-5 w-px bg-border/60 mx-0.5 hidden sm:block" />

            {/* New Collector button — hidden on mobile (use bottom nav instead) */}
            <Button size="sm" className="h-7 text-[11px] gap-1 px-2.5 hidden sm:flex" onClick={() => navigate("/dashboard/spaces")}>
              <Plus className="h-3 w-3" />
              <span className="hidden lg:inline">New Collector</span>
              <span className="lg:hidden">New</span>
            </Button>

            <div className="h-5 w-px bg-border/60 mx-0.5 hidden sm:block" />

            {/* User avatar dropdown */}
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

        {/* Bottom row: navigation tabs — hidden on mobile (use MobileBottomNav instead) */}
        <div className="hidden md:flex items-center gap-0 px-6 -mb-px">
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
                <navItem.icon className="h-3.5 w-3.5" strokeWidth={active ? 2.5 : 1.8} />
                <span className={`tracking-tight ${active ? "font-semibold" : "font-medium"}`}>{navItem.title}</span>

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
      </header >
    </>
  );
}
