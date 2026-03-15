import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Trash2, 
  Star,
  PlayCircle,
  Quote,
  Filter,
  Eye,
  ExternalLink,
  Shield,
  Layers,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data: tData, error: tError } = await supabase
        .from("testimonials")
        .select(`*`)
        .order("created_at", { ascending: false });
      
      if (tError) throw tError;

      // Fetch profiles manually to avoid schema join errors
      const userIds = Array.from(new Set(tData.map(t => t.user_id)));
      const { data: pData } = await supabase
        .from("profiles")
        .select("user_id, company_name, email")
        .in("user_id", userIds);

      // Fetch spaces manually to avoid schema join errors
      const spaceIds = Array.from(new Set(tData.map(t => t.space_id)));
      const { data: sData } = await supabase
        .from("spaces")
        .select("id, name, slug")
        .in("id", spaceIds);

      const enriched = tData.map(t => ({
        ...t,
        profiles: pData?.find(p => p.user_id === t.user_id),
        spaces: sData?.find(s => s.id === t.space_id)
      }));

      setTestimonials(enriched);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Testimonial Removed", description: "The content has been purged." });
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredDocs = testimonials.filter(t => 
    (t.author_name || t.user_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.spaces?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="h-14 bg-white border border-slate-200 rounded-2xl w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-96 bg-slate-50 border border-slate-100 rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32">
      {/* ── SEARCH & FILTER ── */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 h-14 w-full md:max-w-md focus-within:ring-4 ring-emerald-500/5 focus-within:border-emerald-500/20 transition-all duration-500 shadow-sm overflow-hidden">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input 
            placeholder="Search identity or content..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] font-bold w-full placeholder:text-slate-300 text-slate-950 uppercase tracking-widest"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="h-14 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 px-8 transition-all">
            <Filter className="w-3.5 h-3.5 mr-2" /> Parameters
          </Button>
          <div className="bg-slate-50 px-6 h-14 rounded-2xl flex items-center border border-slate-100">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredDocs.length} Results</span>
          </div>
        </div>
      </div>

      {/* ── TESTIMONY GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDocs.map((t, i) => (
            <motion.div 
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
              {/* Architecture Blueprint Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-500/5 rounded-tr-[2.5rem] pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all duration-500">
                    {(t.author_image || t.user_image) ? (
                      <img src={t.author_image || t.user_image} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-black uppercase">{(t.author_name || t.user_name || "V")?.[0]}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-slate-950 uppercase tracking-tight">{t.author_name || t.user_name || "Anonymous"}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">{t.author_title || t.user_title || "Verified Customer"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 transition-all duration-500">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                    onClick={() => deleteTestimonial(t.id)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 space-y-6">
                {/* Video Preview If Available */}
                {(t.type === 'video' || t.is_video) && (t.video_url || t.video_path) && (
                  <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden relative group/video border border-slate-950 shadow-lg mb-6">
                     <video 
                      src={t.video_url || t.video_path} 
                      className="w-full h-full object-cover opacity-60 group-hover/video:opacity-100 transition-opacity" 
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover/video:scale-110 transition-transform shadow-xl">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                     </div>
                  </div>
                )}

                <div className="relative">
                   <div className="absolute -top-1 -left-1 opacity-10">
                      <Quote className="w-6 h-6 text-slate-950" />
                   </div>
                   <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic relative z-10 pl-2">
                     {t.content}
                   </p>
                </div>
              </div>

              {/* Origin Intelligence */}
              <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">Direct Owner</span>
                    <div className="flex items-center gap-2">
                       <Shield className="w-3 h-3 text-emerald-500" />
                       <span className="text-[10px] font-black text-slate-600 truncate">{(t as any).profiles?.company_name || (t as any).profiles?.email || "System Owner"}</span>
                    </div>
                 </div>

                 <div className="flex flex-col border-l border-slate-50 pl-4">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">Collector Path</span>
                    <div className="flex items-center gap-2">
                       <Layers className="w-3 h-3 text-emerald-400" />
                       <span className="text-[10px] font-black text-slate-500 truncate">{t.spaces?.name || "Global Entry"}</span>
                    </div>
                 </div>
              </div>

              {/* Verified Rating & Tags */}
              <div className="mt-6 flex items-center justify-between">
                 <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-3 h-3 ${star <= (t.rating || 5) ? 'text-amber-400 fill-current' : 'text-slate-100'}`} />
                    ))}
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${t.type === 'video' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                       {t.type} format
                    </div>
                 </div>
              </div>

              {/* Blueprint Interaction Label */}
              <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-all">
                 <span className="text-[7px] font-mono text-emerald-500/20 uppercase tracking-[0.5em]">Arc_Testi_Intel_{t.id.slice(0,4)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!filteredDocs.length && !loading && (
          <div className="py-32 text-center bg-slate-50/50 border border-slate-100 border-dashed rounded-[3rem] animate-in fade-in zoom-in duration-500">
             <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-6" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No testimony intel recovered from database</p>
          </div>
      )}
    </div>
  );
}
