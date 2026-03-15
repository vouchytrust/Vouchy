import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Plus, Sparkles, Video, MessageSquareText, TrendingUp, TrendingDown, Minus, ArrowRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import FirstTimeGuide from "@/components/FirstTimeGuide";
import { fetchDashboardStats, fetchTestimonials, fetchSpaces } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const quickActions = [
  { label: "New Collector", icon: Plus, to: "/dashboard/spaces" },
  { label: "Design Widgets", icon: Sparkles, to: "/dashboard/widgets" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const gradients = [
  "from-emerald-500/20 to-emerald-600/5",
  "from-violet-500/20 to-violet-600/5",
  "from-sky-500/20 to-sky-600/5",
  "from-amber-500/20 to-amber-600/5",
  "from-rose-500/20 to-rose-600/5",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHome() {
  const { profile } = useAuth();
  const userName = profile?.company_name || "there";

  const [stats, setStats] = useState({ total: 0, avgRating: "0.0", videoRate: 0, testimonials: [] as any[] });
  const [recentTestimonials, setRecentTestimonials] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSpaces, setHasSpaces] = useState(true);
  const [hasMoreThanOneSpace, setHasMoreThanOneSpace] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, testimonials, spaces] = await Promise.all([
          fetchDashboardStats(),
          fetchTestimonials(),
          fetchSpaces(),
        ]);
        setStats(statsData);
        setRecentTestimonials((testimonials as any[]).slice(0, 4));
        setHasSpaces((spaces as any[]).length > 0);
        setHasMoreThanOneSpace((spaces as any[]).length >= 1);

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const now = new Date();
        const chart = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);
          const count = statsData.testimonials.filter((t: any) => {
            const created = new Date(t.created_at);
            return created >= dayStart && created < dayEnd;
          }).length;
          chart.push({ date: days[d.getDay()], count });
        }
        setChartData(chart);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Testimonials",
      value: String(stats.total),
      sub: "all time",
      icon: MessageSquareText,
      color: "text-primary",
      bgColor: "bg-primary/[0.08]",
    },
    {
      label: "Average Rating",
      value: stats.avgRating,
      sub: "out of 5.0",
      icon: Star,
      color: "text-[hsl(var(--vouchy-warning))]",
      bgColor: "bg-[hsl(var(--vouchy-warning)/0.08)]",
    },
    {
      label: "Video Rate",
      value: `${stats.videoRate}%`,
      sub: "of all testimonials",
      icon: Video,
      color: "text-[hsl(160,84%,39%)]",
      bgColor: "bg-[hsl(160,84%,39%,0.08)]",
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 w-full">

      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-foreground tracking-[-0.04em] leading-tight">
            {getGreeting()}, <span className="text-primary italic">{userName}</span>
          </h1>
          <p className="text-[13px] text-muted-foreground/60 mt-2 font-medium">
            Social proof performance architecture.
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((a) => {
            const isFree = (profile?.plan || "free").toLowerCase() === "free";
            const isDisabled = a.label === "New Collector" && isFree && hasMoreThanOneSpace;
            return (
              <Button 
                key={a.label} 
                size="sm" 
                className={`h-8 text-xs gap-1.5 font-medium ${isDisabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary/90"}`} 
                asChild={!isDisabled}
                disabled={isDisabled}
              >
                {isDisabled ? (
                  <span className="flex items-center gap-1.5"><a.icon className="h-3.5 w-3.5" />Limit Reached</span>
                ) : (
                  <Link to={a.to}><a.icon className="h-3.5 w-3.5" />{a.label}</Link>
                )}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Stat cards — 1 row ── */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative rounded-xl border border-border/60 bg-card p-4 overflow-hidden transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-0 hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-foreground leading-none tracking-[-0.05em]">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/30 mt-2">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Chart (left) + Testimonials (right) ── */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">

        {/* Chart — takes 3/5 on large screens */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col flex-1">
            <div className="flex items-center justify-between p-4 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-[13px] font-semibold text-foreground">Testimonial Volume</h2>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Last 7 days</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Testimonials
              </div>
            </div>
            <div className="px-4 pb-4 pt-3 flex-1 min-h-0" style={{ minHeight: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.06} vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(240 4% 46%)" }} dy={6} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(240 4% 46%)" }} dx={-6} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px", boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.1)", padding: "6px 10px" }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "10px", marginBottom: "2px" }}
                    itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(142, 76%, 36%)" fill="url(#chartGrad)" strokeWidth={2} dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))", fill: "hsl(142, 76%, 36%)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Testimonials — takes 2/5 on large screens */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden flex flex-col flex-1">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-foreground">Latest Feedback</h2>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{recentTestimonials.length}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 hover:text-foreground gap-1 -mr-1" asChild>
                <Link to="/dashboard/testimonials">View all <ArrowRight className="h-3 w-3" /></Link>
              </Button>
            </div>
            {recentTestimonials.length === 0 ? (
              <div className="text-center py-14">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <MessageSquareText className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No testimonials yet</p>
                <p className="text-xs text-muted-foreground">Share your collection page to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentTestimonials.map((t: any, i: number) => {
                  const initials = t.author_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                  const gradient = gradients[i % gradients.length];
                  const timeAgo = formatDistanceToNow(new Date(t.created_at), { addSuffix: true });
                  return (
                    <div key={t.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} border border-border/50 flex items-center justify-center shrink-0 overflow-hidden`}>
                        {t.author_avatar_url
                          ? <img src={t.author_avatar_url} alt={t.author_name} className="w-full h-full object-cover" />
                          : <span className="text-[10px] font-semibold text-foreground">{initials}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[12px] font-semibold text-foreground truncate">{t.author_name}</span>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`h-2.5 w-2.5 ${j < t.rating ? "fill-[hsl(var(--vouchy-warning))] text-[hsl(var(--vouchy-warning))]" : "text-border"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11.5px] text-muted-foreground leading-relaxed line-clamp-2">{t.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground/50">{timeAgo}</span>
                          {t.type === "video" && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                              <Video className="h-2.5 w-2.5" /> Video
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
