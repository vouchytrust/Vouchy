import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, Play, MessageSquareText, Search, CheckCircle2, XCircle, Clock, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Testimonial {
  id: string;
  name: string;
  company: string;
  title: string;
  content: string;
  rating: number;
  type: "video" | "text";
  status: "pending" | "approved" | "rejected";
  isFavorite: boolean;
  createdAt: string;
  initials: string;
  avatarGradient: string;
  videoDuration?: string;
}

const mockTestimonials: Testimonial[] = [
  { id: "1", name: "Sarah Kim", company: "TechCo", title: "CEO", content: "Vouchy has completely transformed how we collect customer feedback. The video feature is incredibly professional and our customers love the ease of use.", rating: 5, type: "text", status: "approved", isFavorite: true, createdAt: "2h ago", initials: "SK", avatarGradient: "from-primary/20 to-primary/5" },
  { id: "2", name: "James Dean", company: "StartupXYZ", title: "Founder", content: "The widget layouts are stunning. We embedded the masonry wall on our homepage and it looks incredible.", rating: 5, type: "video", status: "pending", isFavorite: false, createdAt: "5h ago", initials: "JD", avatarGradient: "from-chart-3/20 to-chart-3/5", videoDuration: "1:24" },
  { id: "3", name: "Aisha Moyo", company: "DesignHub", title: "Lead Designer", content: "Clean, minimal, and powerful. Exactly what we needed for our agency clients.", rating: 4, type: "text", status: "approved", isFavorite: false, createdAt: "1d ago", initials: "AM", avatarGradient: "from-chart-2/20 to-chart-2/5" },
  { id: "4", name: "Luis Rodriguez", company: "GrowthCo", title: "Marketing Director", content: "Best testimonial tool on the market. Our conversions went up 40% after adding Vouchy widgets to our landing page.", rating: 5, type: "text", status: "rejected", isFavorite: false, createdAt: "2d ago", initials: "LR", avatarGradient: "from-chart-4/20 to-chart-4/5" },
  { id: "5", name: "Emily Chen", company: "MegaCorp", title: "VP Product", content: "We've tried everything — Vouchy is the only tool that our customers actually enjoy using to leave reviews.", rating: 5, type: "video", status: "approved", isFavorite: true, createdAt: "3d ago", initials: "EC", avatarGradient: "from-chart-5/20 to-chart-5/5", videoDuration: "2:08" },
  { id: "6", name: "Marcus Johnson", company: "DevFlow", title: "CTO", content: "Integration took 5 minutes. The embed code just works — dropped it into our Next.js site and it looked native.", rating: 5, type: "video", status: "pending", isFavorite: false, createdAt: "4d ago", initials: "MJ", avatarGradient: "from-primary/20 to-chart-3/5", videoDuration: "0:47" },
];

const tabs = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "video", label: "Video" },
  { id: "text", label: "Text" },
];

const statusConfig = {
  pending: { bg: "bg-vouchy-warning/10", text: "text-vouchy-warning", label: "Pending", icon: Clock },
  approved: { bg: "bg-vouchy-success/10", text: "text-vouchy-success", label: "Approved", icon: CheckCircle2 },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", label: "Rejected", icon: XCircle },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const cardVariant = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } } };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = testimonials
    .filter((t) => {
      if (filter === "all") return true;
      if (filter === "video" || filter === "text") return t.type === filter;
      return t.status === filter;
    })
    .filter((t) => !search || (t.name + t.company + t.content).toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const toggleFavorite = (id: string) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const counts: Record<string, number> = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    rejected: testimonials.filter((t) => t.status === "rejected").length,
    video: testimonials.filter((t) => t.type === "video").length,
    text: testimonials.filter((t) => t.type === "text").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-semibold text-foreground">Testimonials</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Review, approve, and manage collected testimonials.</p>
      </motion.div>

      {/* Filters bar */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative px-3 py-1.5 text-[12px] font-medium rounded-md transition-all duration-200 ${
                filter === tab.id ? "bg-card text-foreground vouchy-shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-2xs ${filter === tab.id ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 h-8 text-xs bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <MessageSquareText className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-[14px] font-medium text-foreground mb-1">No testimonials found</h3>
          <p className="text-[12px] text-muted-foreground">Adjust your filters or wait for new submissions.</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => {
              const S = statusConfig[t.status];
              const StatusIcon = S.icon;

              return (
                <motion.div
                  key={t.id}
                  variants={cardVariant}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border border-border bg-card overflow-hidden flex flex-col"
                >
                  {/* Video thumbnail area */}
                  {t.type === "video" && (
                    <div className="relative bg-muted/60 aspect-video flex items-center justify-center cursor-pointer group/video">
                      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/[0.02]" />
                      <div className="w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center vouchy-shadow-sm group-hover/video:scale-110 transition-transform duration-200">
                        <Play className="h-5 w-5 text-foreground ml-0.5" />
                      </div>
                      {t.videoDuration && (
                        <span className="absolute bottom-2 right-2 text-2xs font-medium bg-foreground/70 text-background px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                          {t.videoDuration}
                        </span>
                      )}
                      <span className="absolute top-2 left-2 flex items-center gap-1 text-2xs font-medium text-background bg-foreground/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                        <Video className="h-2.5 w-2.5" /> Video
                      </span>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Top: avatar + info + status */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarGradient} border border-border/50 flex items-center justify-center shrink-0`}>
                        <span className="text-2xs font-semibold text-foreground">{t.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-medium text-foreground truncate">{t.name}</span>
                          <button onClick={() => toggleFavorite(t.id)} className="shrink-0 p-0.5">
                            <Heart className={`h-3.5 w-3.5 transition-colors ${t.isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground/40 hover:text-muted-foreground"}`} />
                          </button>
                        </div>
                        <span className="text-2xs text-muted-foreground">{t.title} · {t.company}</span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < t.rating ? "fill-vouchy-warning text-vouchy-warning" : "text-border"}`} />
                      ))}
                      {t.type === "text" && (
                        <span className="ml-auto flex items-center gap-0.5 text-2xs text-muted-foreground/60">
                          <MessageSquareText className="h-2.5 w-2.5" /> Text
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <p className="text-[12.5px] text-muted-foreground leading-relaxed flex-1 line-clamp-3">{t.content}</p>

                    {/* Footer: status + actions — always visible */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60">
                      {/* Status badge */}
                      <span className={`flex items-center gap-1 text-2xs font-medium px-2 py-1 rounded-md ${S.bg} ${S.text}`}>
                        <StatusIcon className="h-3 w-3" />
                        {S.label}
                      </span>

                      <span className="text-2xs text-muted-foreground/50 ml-auto mr-1">{t.createdAt}</span>

                      {/* Action buttons — always visible */}
                      {t.status === "pending" ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-vouchy-success hover:bg-vouchy-success/10 hover:text-vouchy-success"
                            onClick={() => updateStatus(t.id, "approved")}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => updateStatus(t.id, "rejected")}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          {t.status === "rejected" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-vouchy-success hover:bg-vouchy-success/10"
                              onClick={() => updateStatus(t.id, "approved")}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {t.status === "approved" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => updateStatus(t.id, "rejected")}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => deleteTestimonial(t.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
