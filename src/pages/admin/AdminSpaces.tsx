import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  Search, 
  ExternalLink, 
  Trash2,
  MessageSquare,
  Activity,
  Filter,
  Shield,
  Zap,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AdminSpaceDetail from "./AdminSpaceDetail";

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const { data: sData, error: sError } = await supabase
        .from("spaces")
        .select(`
          *,
          testimonials (id)
        `)
        .order("created_at", { ascending: false });
      
      if (sError) throw sError;

      // Fetch profiles manually to avoid schema join errors
      const userIds = Array.from(new Set(sData.map(s => s.user_id)));
      const { data: pData } = await supabase
        .from("profiles")
        .select("user_id, email, company_name")
        .in("user_id", userIds);

      const enriched = sData.map(s => ({
        ...s,
        profiles: pData?.find(p => p.user_id === s.user_id)
      }));

      setSpaces(enriched);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const deleteSpace = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will purge all associated testimonials.`)) return;
    const { error } = await supabase.from("spaces").delete().eq("id", id);
    if (error) {
       toast({ title: "Purge Failed", description: error.message, variant: "destructive" });
    } else {
       toast({ title: "Infrastructure Purged", description: "The collector has been removed from the platform." });
       setSpaces(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredSpaces = spaces.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedSpaceId) return (
    <AdminSpaceDetail
      spaceId={selectedSpaceId}
      onBack={() => setSelectedSpaceId(null)}
      onUpdate={fetchSpaces}
    />
  );

  if (loading) return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="h-14 bg-white border border-slate-200 rounded-2xl w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-64 bg-slate-50 border border-slate-100 rounded-[2.5rem]" />
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
            placeholder="Search collector or slug..."
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
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredSpaces.length} Active Nodes</span>
          </div>
        </div>
      </div>

      {/* ── COLLECTOR GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredSpaces.map((space, i) => (
            <motion.div
              key={space.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
              {/* Architecture Blueprint Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-500/5 rounded-tr-[2.5rem] pointer-events-none" />

              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all duration-500">
                   {space.logo_url ? (
                     <img src={space.logo_url} className="w-full h-full object-cover" />
                   ) : (
                     <Layers className="w-6 h-6" />
                   )}
                </div>
                <div className="flex gap-2 transition-all duration-500">
                   <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-lg transition-all border border-slate-100"
                    onClick={() => setSelectedSpaceId(space.id)}
                   >
                     <Eye className="w-4 h-4" />
                   </Button>
                   <Link to={`/collect/${space.slug}`} target="_blank">
                     <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg transition-all border border-slate-100">
                       <ExternalLink className="w-4 h-4" />
                     </Button>
                   </Link>
                   <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100/20 transition-all"
                    onClick={() => deleteSpace(space.id, space.name)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">{space.name}</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-2 line-clamp-2 leading-relaxed h-[34px]">
                  {space.description || "Experimental infrastructure deployed without metadata."}
                </p>
                <div className="flex flex-col gap-3 mt-6">
                   <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">/{space.slug}</span>
                   </div>
                   <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                      <Shield className="w-3 h-3 text-slate-300" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{space.profiles?.company_name || space.profiles?.email || "System Owner"}</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-black text-slate-950">{space.testimonials?.length || 0}</span>
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">Payloads</p>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-1 text-emerald-500">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase">Live</span>
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">Status</p>
                </div>
              </div>

              {/* Blueprint Label */}
              <div className="absolute bottom-3 right-8 opacity-0 group-hover:opacity-100 transition-all">
                 <span className="text-[7px] font-mono text-emerald-500/10 uppercase tracking-[0.5em]">Arc_Node_Intel_{space.id.slice(0,4)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!filteredSpaces.length && !loading && (
          <div className="py-32 text-center bg-slate-50/50 border border-slate-100 border-dashed rounded-[3rem] animate-in fade-in zoom-in duration-500">
             <Layers className="w-12 h-12 text-slate-200 mx-auto mb-6" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No infrastructure recovered from database</p>
          </div>
      )}
    </div>
  );
}
