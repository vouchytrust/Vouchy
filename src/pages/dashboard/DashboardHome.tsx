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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <FirstTimeGuide companyName={profile?.company_name || undefined} />

      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's how your social proof is performing.
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium" asChild>
              <Link to={a.to}><a.icon className="h-3.5 w-3.5" />{a.label}</Link>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* First-time CTA */}
      {!hasSpaces && (
        <motion.div
          variants={item}
          className="relative rounded-2xl overflow-hidden border border-primary/20"
          style={{
            background: "linear-gradient(135deg, hsl(142 76% 36% / 0.08) 0%, hsl(160 84% 39% / 0.08) 50%, hsl(142 76% 36% / 0.04) 100%)",
          }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[hsl(160,84%,39%,0.1)] blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 lg:p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <img src="/src/assets/logo-icon.svg" alt="Vouchy Logo Icon" className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-foreground mb-1">
                Create your first Collector 🚀
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl">
                Collectors are the pages where you gather stories. Create one to get your unique link and start collecting social proof today.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild size="sm" className="h-9 text-[12px] gap-1.5 font-medium">
                <Link to="/dashboard/spaces">
                  <Plus className="h-3.5 w-3.5" /> New Collector
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-9 text-[12px] gap-1.5 font-medium">
                <Link to="/dashboard/widgets">
                  See Widget Lab <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group relative rounded-xl border border-border bg-card p-5 overflow-hidden transition-shadow duration-200 hover:vouchy-shadow-md"
          >
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.04), transparent 70%)" }}
            />
            <div className="relative flex items-start justify-between mb-4">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="relative">
              <div className="text-3xl font-bold text-foreground leading-none tracking-tight">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1.5">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div variants={item} className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/[0.08] flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-foreground">Testimonial Volume</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Last 7 days</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Testimonials received
          </div>
        </div>
        <div className="px-6 pb-6 pt-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.06} vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(240 4% 46%)" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(240 4% 46%)" }} dx={-8} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.12)",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "11px", marginBottom: "2px" }}
                itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(142, 76%, 36%)"
                fill="url(#chartGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))", fill: "hsl(142, 76%, 36%)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Latest feedback */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-foreground">Latest Feedback</h2>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 hover:text-foreground" asChild>
            <Link to="/dashboard/testimonials">View all <ArrowUpRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
        {recentTestimonials.length === 0 ? (
          <div className="text-center py-14 rounded-xl border border-dashed border-border bg-card/50">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <MessageSquareText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No testimonials yet</p>
            <p className="text-xs text-muted-foreground">Share your collection page to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {recentTestimonials.map((t: any, i: number) => {
              const initials = t.author_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
              const gradient = gradients[i % gradients.length];
              const timeAgo = formatDistanceToNow(new Date(t.created_at), { addSuffix: true });
              return (
                <motion.div
                  key={t.id}
                  variants={item}
                  whileHover={{ y: -1 }}
                  className="group rounded-xl border border-border bg-card p-4 hover:vouchy-shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border border-border/50 flex items-center justify-center shrink-0`}>
                      <span className="text-[10px] font-semibold text-foreground">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-medium text-foreground">{t.author_name}</span>
                        {t.author_company && (
                          <span className="text-[11px] text-muted-foreground">· {t.author_company}</span>
                        )}
                        {t.type === "video" && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-primary bg-primary/[0.06] px-1.5 py-0.5 rounded-full">
                            <Video className="h-2.5 w-2.5" /> Video
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 mb-1.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-3 w-3 ${j < t.rating ? "fill-[hsl(var(--vouchy-warning))] text-[hsl(var(--vouchy-warning))]" : "text-border"}`} />
                        ))}
                      </div>
                      <p className="text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">{t.content}</p>
                      <span className="text-[10px] text-muted-foreground/60 mt-2 block">{timeAgo}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
