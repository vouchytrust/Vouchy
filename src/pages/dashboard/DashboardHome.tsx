import { motion } from "framer-motion";
import { Star, MessageSquareText, Video, TrendingUp, ArrowUpRight, Plus, ExternalLink, Copy, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";

const chartData = [
  { date: "Mon", count: 4 }, { date: "Tue", count: 7 }, { date: "Wed", count: 5 },
  { date: "Thu", count: 12 }, { date: "Fri", count: 8 }, { date: "Sat", count: 15 }, { date: "Sun", count: 10 },
];

const recentTestimonials = [
  { id: 1, name: "Sarah Kim", company: "TechCo", rating: 5, content: "Absolutely transformed our customer onboarding experience. The team was thrilled!", type: "text" as const, time: "2h ago", initials: "SK", color: "from-blue-500/20 to-blue-600/5" },
  { id: 2, name: "James Dean", company: "StartupXYZ", rating: 5, content: "The video testimonials are incredibly professional and easy to record.", type: "video" as const, time: "5h ago", initials: "JD", color: "from-violet-500/20 to-violet-600/5" },
  { id: 3, name: "Aisha Moyo", company: "DesignHub", rating: 4, content: "Clean, minimal, and powerful. Love the embed widgets!", type: "text" as const, time: "1d ago", initials: "AM", color: "from-emerald-500/20 to-emerald-600/5" },
  { id: 4, name: "Luis Rodriguez", company: "GrowthCo", rating: 5, content: "Our conversions went up 40% after adding Vouchy widgets to our landing page.", type: "text" as const, time: "2d ago", initials: "LR", color: "from-amber-500/20 to-amber-600/5" },
];

const quickActions = [
  { label: "New Space", icon: Plus, to: "/dashboard/spaces" },
  { label: "Widget Lab", icon: Sparkles, to: "/dashboard/widgets" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function DashboardHome() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-[1100px]">
      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Good morning, Jane</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Here's what's happening with your testimonials.</p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium" asChild>
              <Link to={a.to}><a.icon className="h-3.5 w-3.5" />{a.label}</Link>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Testimonials", value: "247", change: "+12%", sub: "from last month" },
          { label: "Average Rating", value: "4.8", change: "+0.2", sub: "out of 5.0" },
          { label: "Video Rate", value: "62%", change: "+5%", sub: "of all testimonials" },
        ].map((stat) => (
          <div key={stat.label} className="group rounded-xl border border-border bg-card p-5 hover:vouchy-shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              <span className="flex items-center text-2xs font-semibold text-vouchy-success">
                <ArrowUpRight className="h-3 w-3" />{stat.change}
              </span>
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
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 93%)" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(240, 4%, 46%)" }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(240, 4%, 46%)" }} dx={-8} />
            <Tooltip
              contentStyle={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(240, 6%, 93%)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px hsl(240, 10%, 4%, 0.05)",
              }}
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
        <div className="grid md:grid-cols-2 gap-3">
          {recentTestimonials.map((t, i) => (
            <motion.div
              key={t.id}
              variants={item}
              className="group rounded-xl border border-border bg-card p-4 hover:vouchy-shadow-sm transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} border border-border/50 flex items-center justify-center shrink-0`}>
                  <span className="text-2xs font-semibold text-foreground">{t.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-medium text-foreground">{t.name}</span>
                    <span className="text-2xs text-muted-foreground">{t.company}</span>
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
                  <span className="text-2xs text-muted-foreground/60 mt-2 block">{t.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
