import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Plus, Sparkles, Video, MessageSquareText, Zap, ArrowRight } from "lucide-react";
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
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const gradients = [
  "from-emerald-500/20 to-emerald-600/5",
  "from-violet-500/20 to-violet-600/5",
  "from-emerald-500/20 to-emerald-600/5",
  "from-amber-500/20 to-amber-600/5",
  "from-rose-500/20 to-rose-600/5",
];

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

        // Build chart data from last 7 days
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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <FirstTimeGuide companyName={profile?.company_name || undefined} />

      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Good morning, {userName}</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Quick overview of your social proof performance.</p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium" asChild>
              <Link to={a.to}><a.icon className="h-3.5 w-3.5" />{a.label}</Link>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* ── First-time CTA banner ── */}
      {!hasSpaces && (
        <motion.div
          variants={item}
          className="relative rounded-2xl overflow-hidden border border-primary/20"
          style={{
            background: "linear-gradient(135deg, hsl(142 76% 36% / 0.08) 0%, hsl(160 84% 39% / 0.08) 50%, hsl(142 76% 36% / 0.04) 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 lg:p-8">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <img src="/src/assets/logo-icon.svg" alt="Vouchy Logo Icon" className="h-8 w-8" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-foreground mb-1">
                Create your first Collector 🚀
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl">
                Collectors are the pages where you gather stories. Create one to get your unique link and start collecting social proof today.
              </p>
            </div>

            {/* CTAs */}
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
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Testimonials", value: String(stats.total), sub: "all time" },
          { label: "Average Rating", value: stats.avgRating, sub: "out of 5.0" },
          { label: "Video Rate", value: `${stats.videoRate}%`, sub: "of all testimonials" },
        ].map((stat) => (
          <div key={stat.label} className="group rounded-xl border border-border bg-card p-5 hover:vouchy-shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
            </div>
            <div className="text-[28px] font-bold text-foreground leading-none tracking-tight">{stat.value}</div>
            <div className="text-2xs text-muted-foreground mt-1.5">{stat.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div variants={item} className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[14px] font-semibold text-foreground">Testimonial Volume</h2>
            <p className="text-2xs text-muted-foreground mt-0.5">Last 7 days</p>
          </div>
          <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Testimonials received
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} opacity={0.6} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} opacity={0.6} dx={-8} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="count" stroke="hsl(221, 83%, 53%)" fill="url(#chartGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(221, 83%, 53%)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Latest feedback */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-semibold text-foreground">Latest Feedback</h2>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" asChild>
            <Link to="/dashboard/testimonials">View all <ArrowUpRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
        {recentTestimonials.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-border bg-card">
            <MessageSquareText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No testimonials yet. Share your collection page to get started!</p>
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
                  className="group rounded-xl border border-border bg-card p-4 hover:vouchy-shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border border-border/50 flex items-center justify-center shrink-0`}>
                      <span className="text-2xs font-semibold text-foreground">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-medium text-foreground">{t.author_name}</span>
                        <span className="text-2xs text-muted-foreground">{t.author_company}</span>
                        {t.type === "video" && (
                          <span className="flex items-center gap-0.5 text-2xs font-medium text-primary bg-primary/[0.06] px-1.5 py-0.5 rounded-full">
                            <Video className="h-2.5 w-2.5" /> Video
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 mb-1.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-3 w-3 ${j < t.rating ? "fill-vouchy-warning text-vouchy-warning" : "text-border"}`} />
                        ))}
                      </div>
                      <p className="text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">{t.content}</p>
                      <span className="text-2xs text-muted-foreground/60 mt-2 block">{timeAgo}</span>
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
