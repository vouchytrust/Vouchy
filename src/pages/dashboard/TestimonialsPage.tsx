import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Star, Video, Play, MessageSquareText, Search, CheckCircle2, XCircle, Clock, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTestimonials, updateTestimonialStatus, toggleTestimonialFavorite, deleteTestimonial as apiDeleteTestimonial } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  author_name: string;
  author_company: string | null;
  author_title: string | null;
  content: string;
  rating: number;
  type: string;
  status: string;
  is_favorite: boolean;
  created_at: string;
  video_duration: string | null;
  author_avatar_url: string | null;
  video_url: string | null;
  spaces?: { name: string } | null;
}

const tabs = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "video", label: "Video" },
  { id: "favorite", label: "Favorites" },
];

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: any }> = {
  pending: { bg: "bg-vouchy-warning/10", text: "text-vouchy-warning", label: "Pending", icon: Clock },
  approved: { bg: "bg-vouchy-success/10", text: "text-vouchy-success", label: "Approved", icon: CheckCircle2 },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", label: "Rejected", icon: XCircle },
};

const container: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const cardVariant: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const CardArchitecture = () => (
  <>
    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20 rounded-tl-sm pointer-events-none" />
    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20 rounded-tr-sm pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/20 rounded-bl-sm pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20 rounded-br-sm pointer-events-none" />
  </>
);

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTestimonials = async () => {
    try {
      const data = await fetchTestimonials();
      setTestimonials(data as Testimonial[]);
    } catch (err: any) {
      toast({ title: "Error loading testimonials", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTestimonials(); }, []);

  const filtered = testimonials
    .filter((t) => {
      if (filter === "all") return true;
      if (filter === "favorite") return t.is_favorite;
      if (filter === "video" || filter === "text") return t.type === filter;
      return t.status === filter;
    })
    .filter((t) => !search || (t.author_name + (t.author_company || "") + t.content).toLowerCase().includes(search.toLowerCase()));

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateTestimonialStatus(id, status);
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast({ title: `Testimonial ${status}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    try {
      await toggleTestimonialFavorite(id, !current);
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_favorite: !current } : t));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast({ title: "Testimonial deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === "pending").length,
    approved: testimonials.filter(t => t.status === "approved").length,
    video: testimonials.filter(t => t.type === "video").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 px-0.5">
      {/* VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg aspect-[9/16] md:max-w-xl md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/20 text-primary bg-primary/5 uppercase tracking-[0.2em] text-[9px] font-black px-2 py-0.5">
            Overview
          </Badge>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Testimonials</h1>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-sm leading-relaxed">
            Manage your social proof assets. Verify, approve, and curate the best stories from your customers.
          </p>
        </div>

        {/* STATS STRIP */}
        <div className="flex items-center gap-8 bg-card border border-border/50 rounded-2xl px-6 py-4 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Collected</p>
            <p className="text-xl font-black">{stats.total}</p>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-vouchy-warning">Pending</p>
            <p className="text-xl font-black text-vouchy-warning">{stats.pending}</p>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-vouchy-success">Approved</p>
            <p className="text-xl font-black text-vouchy-success">{stats.approved}</p>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-md border-y border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${filter === tab.id 
                ? "bg-card text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search name, company, content..." 
            className="pl-9 h-10 text-[12px] bg-card/50 border-border/40 rounded-xl focus:ring-1 focus:ring-primary/20" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* TESTIMONIALS GRID */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border/40 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <MessageSquareText className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No matches found</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, idx) => {
              const S = statusConfig[t.status] || statusConfig.pending;
              const StatusIcon = S.icon;
              const initials = getInitials(t.author_name);
              const timeAgo = formatDistanceToNow(new Date(t.created_at), { addSuffix: true });

              return (
                <motion.div
                  key={t.id}
                  variants={cardVariant}
                  layout
                  className="group relative break-inside-avoid bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
                >
                  <CardArchitecture />

                  {/* Header: Avatar + Info */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full border border-primary/10 p-0.5 overflow-hidden bg-muted">
                          {t.author_avatar_url ? (
                            <img src={t.author_avatar_url} alt={t.author_name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[11px] font-black bg-primary/5 text-primary">
                              {initials}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                          {t.type === "video" ? <Video className="h-2 w-2 text-primary" /> : <MessageSquareText className="h-2 w-2 text-primary" />}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-black tracking-tight text-foreground truncate">{t.author_name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider truncate">
                          {t.author_title || "Customer"} {t.author_company && `· ${t.author_company}`}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleFavorite(t.id, t.is_favorite)}
                      className="text-muted-foreground/30 hover:text-destructive transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${t.is_favorite ? "fill-destructive text-destructive" : ""}`} />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3 w-3 ${j < t.rating ? "fill-primary text-primary" : "text-border"}`} />
                    ))}
                  </div>

                  {/* Video Preview if applicable */}
                  {t.type === "video" && (
                    <div 
                      className="relative aspect-video rounded-xl bg-black overflow-hidden mb-4 border border-border/40 group/video cursor-pointer"
                      onClick={() => t.video_url && setSelectedVideo(t.video_url)}
                    >
                      {t.video_url ? (
                        <video 
                          src={t.video_url} 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted/40" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                          <Play className="h-4 w-4 fill-foreground text-foreground ml-0.5" />
                        </div>
                      </div>
                      {t.video_duration && (
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-foreground/10 backdrop-blur-md rounded text-[9px] font-mono text-foreground font-black">
                          {t.video_duration}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <p className="text-[13px] text-foreground/80 leading-relaxed font-light line-clamp-6 mb-6">
                    "{t.content}"
                  </p>

                  {/* Footer: Status + Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${S.bg} ${S.text}`}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {S.label}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/40">{timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {t.status === "pending" && (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-vouchy-success hover:bg-vouchy-success/10" onClick={() => updateStatus(t.id, "approved")}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => updateStatus(t.id, "rejected")}>
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {t.status === "approved" && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-vouchy-warning hover:bg-vouchy-warning/10" onClick={() => updateStatus(t.id, "pending")}>
                          <Clock className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {t.status === "rejected" && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-vouchy-success hover:bg-vouchy-success/10" onClick={() => updateStatus(t.id, "approved")}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Spaces tag if present */}
                  {t.spaces?.name && (
                    <div className="absolute top-3 right-10 px-2 py-0.5 bg-muted/30 border border-border/40 rounded text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.spaces.name}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
