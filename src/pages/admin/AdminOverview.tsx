import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Layers, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Star,
  Activity,
  History,
  TrendingUp,
  Globe,
  PieChart as PieChartIcon,
  Play
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    users: 0,
    freeUsers: 0,
    proUsers: 0,
    spaces: 0,
    testimonials: 0,
    textTestimonials: 0,
    videoTestimonials: 0,
    aiTotalCredits: 0,
    aiScriptsUsed: 0,
    aiTextUsed: 0,
  });
  const [latestUsers, setLatestUsers] = useState<any[]>([]);
  const [latestTestimonials, setLatestTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const results = await Promise.all([
          supabase.from("profiles").select("*", { count: 'exact', head: true }),
          supabase.from("profiles").select("*", { count: 'exact', head: true }).eq("plan", "free"),
          supabase.from("profiles").select("*", { count: 'exact', head: true }).eq("plan", "pro"),
          supabase.from("spaces").select("*", { count: 'exact', head: true }),
          supabase.from("testimonials").select("*", { count: 'exact', head: true }),
          supabase.from("testimonials").select("*", { count: 'exact', head: true }).eq("type", "text"),
          supabase.from("testimonials").select("*", { count: 'exact', head: true }).eq("type", "video"),
          supabase.from("profiles").select("ai_credits_used, ai_scripts_used, ai_text_used"),
          supabase.from("profiles").select("created_at").gte("created_at", thirtyDaysAgo.toISOString()).order("created_at", { ascending: true }),
          supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
          supabase.from("testimonials").select("*, spaces(name)").order("created_at", { ascending: false }).limit(5)
        ]) as any[];

        const [
          { count: userCount },
          { count: freeCount },
          { count: proCount },
          { count: spaceCount },
          { count: testimonialCount },
          { count: textCount },
          { count: videoCount },
          { data: profilesData },
          { data: historicalUsers },
          { data: recentUsers },
          { data: recentTestimonials }
        ] = results;

        const totalAi = Array.isArray(profilesData) ? profilesData.reduce((acc, p: any) => acc + (p.ai_credits_used || 0), 0) : 0;
        const totalScripts = Array.isArray(profilesData) ? profilesData.reduce((acc, p: any) => acc + (p.ai_scripts_used || 0), 0) : 0;
        const totalTextAi = Array.isArray(profilesData) ? profilesData.reduce((acc, p: any) => acc + (p.ai_text_used || 0), 0) : 0;

        // Process growth data
        const dayMap: Record<string, number> = {};
        historicalUsers?.forEach(u => {
          const date = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dayMap[date] = (dayMap[date] || 0) + 1;
        });
        
        const growth = Object.entries(dayMap).map(([name, value]) => ({ name, value }));
        setGrowthData(growth);

        setStats({
          users: userCount || 0,
          freeUsers: freeCount || 0,
          proUsers: proCount || 0,
          spaces: spaceCount || 0,
          testimonials: testimonialCount || 0,
          textTestimonials: textCount || 0,
          videoTestimonials: videoCount || 0,
          aiTotalCredits: totalAi,
          aiScriptsUsed: totalScripts,
          aiTextUsed: totalTextAi,
        });
        setLatestUsers(recentUsers || []);
        setLatestTestimonials(recentTestimonials || []);
      } catch (e) {
        console.error("Error fetching admin stats:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = [
    { name: 'Text', value: stats.textTestimonials, color: '#94a3b8' },
    { name: 'Video', value: stats.videoTestimonials, color: '#10b981' }, // emerald-500
  ];

  const cards = [
    { label: "Total Users", value: stats.users, sub: `${stats.freeUsers} Free / ${stats.proUsers} Pro`, trend: "+12%" },
    { label: "Collectors", value: stats.spaces, sub: "Total Spaces", trend: "+8%" },
    { label: "Reviews", value: stats.testimonials, sub: `${stats.textTestimonials} Text / ${stats.videoTestimonials} Video`, trend: "+24%" },
    { label: "AI Usage", value: stats.aiTotalCredits, sub: `${stats.aiScriptsUsed} Scripts / ${stats.aiTextUsed} Polish`, trend: "+15%" },
  ];

  if (loading) return <div className="flex animate-pulse flex-col space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-[2.5rem] border border-slate-100" />)}
    </div>
    <div className="h-[400px] bg-white rounded-[2.5rem] border border-slate-100" />
  </div>;

  return (
    <div className="space-y-16">
      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {cards.map((card, i) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{card.label}</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-slate-950 tracking-tighter tabular-nums">{card.value}</h3>
              <span className="text-[10px] font-bold text-emerald-500">{card.trend}</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              User Growth Trend
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 30 Days</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  hide={true}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    padding: '8px 12px' 
                  }}
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
              <PieChartIcon className="w-3 h-3 text-emerald-500" />
              Reviews Format
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time</span>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <motion.span 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="text-3xl font-black text-slate-950"
               >
                 {stats.testimonials}
               </motion.span>
               <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-8">
             {pieData.map(d => (
               <div key={d.name} className="flex items-center gap-2.5">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{d.name}</span>
                 <span className="text-[10px] font-bold text-slate-300">({d.value})</span>
               </div>
             ))}
          </div>
        </div>
      </motion.div>

      {/* COMMAND & CONTROL FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* RECENT INGESTION FEED */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em]">Recent Ingestions</h3>
            <Link to="/admin/testimonials" className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center gap-1">
               Manage All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {latestTestimonials.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-6 group hover:bg-slate-50/50 px-2 rounded-xl transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-emerald-200 transition-all shrink-0">
                      {t.type === 'video' ? (
                        <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                      )}
                   </div>
                   <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">{t.author_name}</span>
                        <div className="flex items-center">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-2 h-2 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                           ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{(t as any).spaces?.name || 'Vouchy Protocol'}</span>
                   </div>
                </div>
                <div className="text-right shrink-0">
                   <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${t.type === 'video' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                      {t.type} format
                   </div>
                   <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMMAND & SETTINGS */}
        <div className="space-y-12">
          
          {/* RECENT SIGNUPS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em]">Recent Signups</h3>
              <Link to="/admin/users" className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center gap-1">
                 Manage All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {latestUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-4 group hover:bg-slate-50/50 px-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase border border-slate-100 shadow-sm group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all">
                      {user.company_name?.[0] || user.email?.[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{user.company_name || "Personal Entity"}</span>
                      <span className="text-[9px] font-medium text-slate-400 truncate max-w-[150px]">{user.email}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${user.plan === 'pro' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {user.plan || 'Free'}
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
