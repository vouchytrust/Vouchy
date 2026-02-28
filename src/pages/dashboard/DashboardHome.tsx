import { motion } from "framer-motion";
import { Star, MessageSquareText, Video, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const chartData = [
  { date: "Mon", count: 4 }, { date: "Tue", count: 7 }, { date: "Wed", count: 5 },
  { date: "Thu", count: 12 }, { date: "Fri", count: 8 }, { date: "Sat", count: 15 }, { date: "Sun", count: 10 },
];

const recentTestimonials = [
  { id: 1, name: "Sarah K.", company: "TechCo", rating: 5, content: "Absolutely transformed our customer onboarding experience!", type: "text" as const, status: "approved" as const, initials: "SK" },
  { id: 2, name: "James D.", company: "StartupXYZ", rating: 5, content: "The video testimonials are incredibly professional.", type: "video" as const, status: "pending" as const, initials: "JD" },
  { id: 3, name: "Aisha M.", company: "DesignHub", rating: 4, content: "Easy to set up and the widgets look amazing on our site.", type: "text" as const, status: "approved" as const, initials: "AM" },
  { id: 4, name: "Luis R.", company: "GrowthCo", rating: 5, content: "Our conversions went up 40% after adding Vouchy widgets.", type: "text" as const, status: "approved" as const, initials: "LR" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your testimonial performance.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Testimonials", value: "247", icon: MessageSquareText, change: "+12%" },
          { label: "Avg. Rating", value: "4.8", icon: Star, change: "+0.2" },
          { label: "Video Rate", value: "62%", icon: Video, change: "+5%" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="flex items-center text-xs font-medium text-vouchy-emerald">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />{stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Testimonial Volume (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="hsl(217, 91%, 60%)" fill="url(#chartGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Latest Feedback</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {recentTestimonials.map((t) => (
            <Card key={t.id} className="hover:vouchy-shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full vouchy-gradient-bg flex items-center justify-center text-xs font-semibold text-primary-foreground shrink-0">
                    {t.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-medium text-foreground text-sm">{t.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{t.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {t.type === "video" && <Video className="h-3.5 w-3.5 text-primary" />}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          t.status === "approved" ? "bg-vouchy-emerald/10 text-vouchy-emerald" :
                          "bg-vouchy-sunset/10 text-vouchy-sunset"
                        }`}>{t.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < t.rating ? "fill-vouchy-sunset text-vouchy-sunset" : "text-border"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{t.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
