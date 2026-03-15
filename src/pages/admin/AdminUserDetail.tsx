import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  Layers, 
  Zap,
  Mail,
  Shield,
  Star,
  Quote,
  PlayCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  onBack: () => void;
  onUpdate: () => void;
}

export default function AdminUserDetail({ userId, onBack, onUpdate }: Props) {
  const [profile, setProfile] = useState<any>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: pData, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (pError) throw pError;
      setProfile(pData);

      const [sRes, tRes] = await Promise.all([
        supabase.from("spaces").select("*").eq("user_id", userId).order('created_at', { ascending: false }),
        supabase.from("testimonials").select("*, spaces(name)").eq("user_id", userId).order('created_at', { ascending: false })
      ]);

      setSpaces(sRes.data || []);
      setTestimonials(tRes.data || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const deleteSpace = async (spaceId: string) => {
    if (!confirm("Are you sure? This will delete all testimonials in this collector too.")) return;
    const { error } = await supabase.from("spaces").delete().eq("id", spaceId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Collector Purged", description: "All associated data removed." });
      fetchData();
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Remove this testimonial? This cant be undone.")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Testimonial Removed", description: "The content has been purged." });
      fetchData();
    }
  };

  if (loading) return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="h-24 bg-slate-50 border border-slate-100 rounded-3xl" />
      <div className="h-96 bg-slate-50 border border-slate-100 rounded-3xl" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-32"
    >
      {/* ── PREMIUM HEADER ── */}
      <div className="relative group">
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-emerald-500/10 rounded-tr-[2.5rem] pointer-events-none" />
          
          <div className="flex items-center gap-8 relative z-10">
            <button 
              onClick={onBack} 
              className="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-950 hover:bg-white hover: shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-slate-950 tracking-tighter">{profile?.company_name || "Personal"}</h2>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${profile?.plan === 'pro' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {profile?.plan} Plan
                </div>
              </div>
              <p className="text-slate-400 font-bold text-sm lowercase mt-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {profile?.is_admin && (
              <div className="px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2">
                 <Shield className="w-3.5 h-3.5" /> High Privileges
              </div>
            )}
            <div className="w-[1px] h-10 bg-slate-100 hidden md:block" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Since</span>
              <span className="text-sm font-black text-slate-950">{new Date(profile?.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {/* ── METRICS DASHBOARD ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Growth Momentum", value: `${profile?.ai_credits_used || 0} / ${profile?.plan === 'pro' ? '200' : '20'}`, icon: Zap, sub: "Monthly Credits" },
            { label: "Media Assets", value: spaces.length, icon: Layers, sub: "Active Collectors" },
            { label: "Platform Proof", value: testimonials.length, icon: MessageSquare, sub: "Total Received" },
            { label: "Account Tier", value: profile?.plan?.toUpperCase(), icon: Star, sub: profile?.is_admin ? "Full Access" : "Standard Access" },
          ].map((m, i) => (
            <motion.div 
              key={m.label}
              whileHover={{ y: -4 }}
              className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <m.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{m.label}</p>
              <h4 className="text-2xl font-black text-slate-950 tracking-tighter mt-1">{m.value}</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{m.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── ACTIVE COLLECTORS ── */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[12px] font-black text-slate-950 uppercase tracking-[0.3em]">Infrastructure</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{spaces.length} Collectors</span>
          </div>

          {spaces.length === 0 ? (
            <div className="py-16 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
              <Layers className="w-8 h-8 text-slate-200 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No infrastructure deployed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {spaces.map(space => (
                <motion.div 
                  key={space.id} 
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-slate-300 transition-all duration-500 group relative"
                >
                  <div className="absolute top-4 right-4 transition-all">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-9 h-9 rounded-xl bg-red-50 text-red-500"
                      onClick={() => deleteSpace(space.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <h4 className="text-[13px] font-black text-slate-950 mb-1">{space.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">/{space.slug}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── TESTIMONIALS (FULL WIDTH 3 PER ROW) ── */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[12px] font-black text-slate-950 uppercase tracking-[0.3em]">User Testimony Feed</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{testimonials.length} Total</span>
          </div>

          {testimonials.length === 0 ? (
            <div className="py-24 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map(t => (
                <motion.div 
                  key={t.id} 
                  layout
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-500 group relative flex flex-col"
                >
                  <div className="absolute top-6 right-6 transition-all">
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-10 h-10 rounded-2xl bg-red-50 text-red-500"
                      onClick={() => deleteTestimonial(t.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative shrink-0">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                         {t.type === 'video' ? <PlayCircle className="w-7 h-7 text-emerald-600 animate-pulse" /> : <Quote className="w-5 h-5 text-slate-400" />}
                       </div>
                       <div className="absolute -bottom-1 -right-1 bg-white border border-slate-100 p-1 rounded-lg shadow-sm">
                         <div className="flex gap-0.5">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-2.5 h-2.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                           ))}
                         </div>
                       </div>
                    </div>
                    <div className="flex flex-col pr-8">
                      <span className="text-sm font-black text-slate-950 uppercase tracking-tight truncate max-w-[140px]">{t.author_name}</span>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">{t.type} format</span>
                    </div>
                  </div>

                  {t.type === 'video' && t.video_url && (
                    <div className="mb-6 aspect-video bg-slate-950 rounded-2xl overflow-hidden relative group/video">
                       <video src={t.video_url} className="w-full h-full object-cover opacity-60 group-hover/video:opacity-100 transition-opacity" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Button variant="ghost" className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/40">
                             <PlayCircle className="w-6 h-6" />
                          </Button>
                       </div>
                    </div>
                  )}

                  <div className="flex-1 relative">
                    <div className="absolute -top-1 -left-1 opacity-10">
                       <Quote className="w-6 h-6 text-slate-950" />
                    </div>
                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic relative z-10 pl-2">
                       {t.content}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Collector Source</span>
                      <span className="text-[10px] font-black text-slate-500 truncate max-w-[180px]">{(t as any).spaces?.name || 'Vouchy Protocol'}</span>
                    </div>
                    {t.type === 'video' && (
                       <Button variant="ghost" className="h-8 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider px-3">
                          Verify Link
                       </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
