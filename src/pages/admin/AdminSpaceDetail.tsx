import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  Layers, 
  Shield,
  Star,
  Quote,
  PlayCircle,
  Activity,
  Calendar,
  Link as LinkIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  spaceId: string;
  onBack: () => void;
  onUpdate: () => void;
}

export default function AdminSpaceDetail({ spaceId, onBack, onUpdate }: Props) {
  const [space, setSpace] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // ── FETCH SPACE DATA ──
      const { data: sData, error: sError } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", spaceId)
        .single();
      
      if (sError) throw sError;
      setSpace(sData);

      // ── FETCH OWNER PROFILE ──
      const { data: pData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", sData.user_id)
        .single();
      setProfile(pData);

      // ── FETCH TESTIMONIALS FOR THIS SPACE ──
      const { data: tData, error: tError } = await supabase
        .from("testimonials")
        .select("*")
        .eq("space_id", spaceId)
        .order('created_at', { ascending: false });
      
      if (tError) throw tError;
      setTestimonials(tData || []);

    } catch (e: any) {
      toast({ title: "Intelligence Failure", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [spaceId]);

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      onUpdate();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
       <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Collector Intel...</p>
    </div>
  );

  const stats = [
    { label: "Total Payloads", value: testimonials.length, icon: MessageSquare, sub: "Reviews collected" },
    { label: "Video Ratio", value: `${Math.round((testimonials.filter(t => t.type === 'video').length / (testimonials.length || 1)) * 100)}%`, icon: PlayCircle, sub: "High fidelity content" },
    { label: "Avg Rating", value: (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / (testimonials.length || 1)).toFixed(1), icon: Star, sub: "Platform satisfaction" },
    { label: "Status", value: "Active", icon: Activity, sub: "Collector health" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12 pb-32"
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-14 h-14 rounded-2xl border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-300 transition-all bg-white shadow-sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">{space?.name}</h1>
               <div className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[9px] font-black text-emerald-500 uppercase tracking-widest">Collector Node</div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
               Deployed on {new Date(space?.created_at).toLocaleDateString()} <span className="w-1 h-1 bg-slate-200 rounded-full" /> ID: {space?.id.slice(0,8)}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
           <LinkIcon className="w-4 h-4 text-slate-300 mr-2" />
           <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-200 pb-1">vouchy.live/collect/{space?.slug}</p>
        </div>
      </div>

      {/* ── INTEL GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="md:col-span-3 space-y-12">
            
            {/* ───── SOURCE METRICS ───── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((m, i) => (
                    <motion.div 
                        key={m.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
                            <m.icon className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{m.label}</p>
                        <h4 className="text-2xl font-black text-slate-950 tracking-tighter mt-1">{m.value}</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{m.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* ───── RECEIVED TESTIMONY ───── */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        <h3 className="text-[12px] font-black text-slate-950 uppercase tracking-[0.3em]">Payload Feed</h3>
                    </div>
                </div>

                {testimonials.length === 0 ? (
                    <div className="py-24 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No social proof detected in this node</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map(t => (
                            <motion.div 
                                key={t.id}
                                layout
                                className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-500 group relative flex flex-col"
                            >
                                <div className="absolute top-6 right-6">
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
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {t.type === 'video' ? <PlayCircle className="w-7 h-7 text-emerald-600 animate-pulse" /> : <Quote className="w-5 h-5 text-slate-400" />}
                                    </div>
                                    <div className="flex flex-col pr-8">
                                        <span className="text-sm font-black text-slate-950 uppercase tracking-tight">{t.author_name}</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-2.5 h-2.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {t.type === 'video' && t.video_url && (
                                    <div className="mb-6 aspect-video bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-900 shadow-lg">
                                        <video src={t.video_url} className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                                                <PlayCircle className="w-6 h-6" />
                                            </div>
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
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{new Date(t.created_at).toDateString()}</span>
                                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${t.type === 'video' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                                        {t.type} format
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
         </div>

         {/* ── SIDEBAR INTEL ── */}
         <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-slate-950 text-white space-y-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16" />
                
                <div>
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 block">Infrastructure Owner</span>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-sm font-black">
                         {profile?.company_name?.[0] || profile?.email?.[0]}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-xs font-black uppercase tracking-tight">{profile?.company_name || "Vouchy Professional"}</span>
                         <span className="text-[9px] font-bold text-slate-500 tracking-wide mt-1">{profile?.email}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Plan</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase">{profile?.plan || 'Free'}</span>
                   </div>
                </div>

                <div className="pt-8 space-y-4">
                   <Button variant="outline" className="w-full h-12 rounded-xl bg-transparent border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 text-slate-300">
                      View full profile
                   </Button>
                </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
                  <ExternalLink className="w-5 h-5" />
               </div>
               <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest mb-2">Public Landing</h4>
               <p className="text-[10px] font-medium text-slate-400 mb-6">Access the public collector page to test ingestion.</p>
               <a href={`/collect/${space?.slug}`} target="_blank" className="w-full">
                  <Button className="w-full h-12 rounded-xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800">
                     Open Terminal
                  </Button>
               </a>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
