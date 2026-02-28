import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MessageSquareText, Search, CheckCircle2, XCircle, Clock, Heart, MoreHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  color: string;
}

const mockTestimonials: Testimonial[] = [
  { id: "1", name: "Sarah Kim", company: "TechCo", title: "CEO", content: "Vouchy has completely transformed how we collect customer feedback. The video feature is incredibly professional and our customers love the ease of use.", rating: 5, type: "text", status: "approved", isFavorite: true, createdAt: "2h ago", initials: "SK", color: "from-blue-500/20 to-blue-600/5" },
  { id: "2", name: "James Dean", company: "StartupXYZ", title: "Founder", content: "The widget layouts are stunning. We embedded the masonry wall on our homepage and it looks incredible.", rating: 5, type: "video", status: "pending", isFavorite: false, createdAt: "5h ago", initials: "JD", color: "from-violet-500/20 to-violet-600/5" },
  { id: "3", name: "Aisha Moyo", company: "DesignHub", title: "Lead Designer", content: "Clean, minimal, and powerful. Exactly what we needed for our agency clients.", rating: 4, type: "text", status: "approved", isFavorite: false, createdAt: "1d ago", initials: "AM", color: "from-emerald-500/20 to-emerald-600/5" },
  { id: "4", name: "Luis Rodriguez", company: "GrowthCo", title: "Marketing Director", content: "Best testimonial tool on the market. Our conversions went up 40% after adding Vouchy widgets.", rating: 5, type: "text", status: "rejected", isFavorite: false, createdAt: "2d ago", initials: "LR", color: "from-amber-500/20 to-amber-600/5" },
  { id: "5", name: "Emily Chen", company: "MegaCorp", title: "VP Product", content: "We've tried everything — Vouchy is the only tool that our customers actually enjoy using to leave reviews.", rating: 5, type: "video", status: "approved", isFavorite: true, createdAt: "3d ago", initials: "EC", color: "from-rose-500/20 to-rose-600/5" },
];

const tabs = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const statusStyles = {
  pending: { bg: "bg-vouchy-warning/10", text: "text-vouchy-warning", icon: Clock },
  approved: { bg: "bg-vouchy-success/10", text: "text-vouchy-success", icon: CheckCircle2 },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", icon: XCircle },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = testimonials
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => !search || (t.name + t.company + t.content).toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  };

  const toggleFavorite = (id: string) => {
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  const counts = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    rejected: testimonials.filter((t) => t.status === "rejected").length,
  };

  return (
    <div className="space-y-6 max-w-[900px]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-semibold text-foreground">Testimonials</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Review, approve, and manage collected testimonials.</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Custom tab bar */}
        <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative px-3 py-1.5 text-[12px] font-medium rounded-md transition-all duration-200 ${
                filter === tab.id
                  ? "bg-card text-foreground vouchy-shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-2xs ${filter === tab.id ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                {counts[tab.id as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 h-8 text-xs bg-card" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </motion.div>

      {/* List */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <MessageSquareText className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-[14px] font-medium text-foreground mb-1">No testimonials found</h3>
          <p className="text-[12px] text-muted-foreground">Adjust your filters or wait for new submissions.</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          {filtered.map((t) => {
            const S = statusStyles[t.status];
            const StatusIcon = S.icon;

            return (
              <motion.div
                key={t.id}
                variants={item}
                layout
                className="group rounded-xl border border-border bg-card p-4 hover:vouchy-shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-3.5">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} border border-border/50 flex items-center justify-center shrink-0`}>
                    <span className="text-2xs font-semibold text-foreground">{t.initials}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-medium text-foreground">{t.name}</span>
                      <span className="text-2xs text-muted-foreground">{t.title} · {t.company}</span>
                      <div className="ml-auto flex items-center gap-1.5">
                        {t.type === "video" && (
                          <span className="flex items-center gap-0.5 text-2xs font-medium text-primary bg-primary/[0.06] px-1.5 py-0.5 rounded-full">
                            <Video className="h-2.5 w-2.5" />
                          </span>
                        )}
                        <span className={`flex items-center gap-0.5 text-2xs font-medium px-1.5 py-0.5 rounded-full ${S.bg} ${S.text}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 mb-1.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < t.rating ? "fill-vouchy-warning text-vouchy-warning" : "text-border"}`} />
                      ))}
                    </div>

                    <p className="text-[12.5px] text-muted-foreground leading-relaxed">{t.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {t.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="h-6 text-2xs px-2 gap-1" onClick={() => updateStatus(t.id, "approved")}>
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-2xs px-2 gap-1" onClick={() => updateStatus(t.id, "rejected")}>
                            <XCircle className="h-3 w-3" /> Reject
                          </Button>
                        </>
                      )}
                      <button onClick={() => toggleFavorite(t.id)} className="p-1 rounded-md hover:bg-accent transition-colors">
                        <Heart className={`h-3.5 w-3.5 transition-colors ${t.isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                      </button>
                      <span className="text-2xs text-muted-foreground/50 ml-auto">{t.createdAt}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
