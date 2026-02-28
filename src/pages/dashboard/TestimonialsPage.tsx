import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Video, MessageSquareText, Search, Filter, CheckCircle2, XCircle, Clock, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  content: string;
  rating: number;
  type: "video" | "text";
  status: "pending" | "approved" | "rejected";
  isFavorite: boolean;
  createdAt: string;
  initials: string;
}

const mockTestimonials: Testimonial[] = [
  { id: "1", name: "Sarah Kim", email: "sarah@techco.com", company: "TechCo", title: "CEO", content: "Vouchy has completely transformed how we collect customer feedback. The video feature is incredibly professional and our customers love the ease of use. We've seen a 40% increase in testimonial submissions since switching.", rating: 5, type: "text", status: "approved", isFavorite: true, createdAt: "2026-02-25", initials: "SK" },
  { id: "2", name: "James Dean", email: "james@startup.com", company: "StartupXYZ", title: "Founder", content: "The widget layouts are stunning. We embedded the masonry wall on our homepage and it looks incredible.", rating: 5, type: "video", status: "pending", isFavorite: false, createdAt: "2026-02-24", initials: "JD" },
  { id: "3", name: "Aisha Moyo", email: "aisha@design.com", company: "DesignHub", title: "Lead Designer", content: "Clean, minimal, and powerful. Exactly what we needed for our agency clients.", rating: 4, type: "text", status: "approved", isFavorite: false, createdAt: "2026-02-23", initials: "AM" },
  { id: "4", name: "Luis Rodriguez", email: "luis@growth.com", company: "GrowthCo", title: "Marketing Director", content: "Best testimonial tool on the market. Period.", rating: 5, type: "text", status: "rejected", isFavorite: false, createdAt: "2026-02-22", initials: "LR" },
  { id: "5", name: "Emily Chen", email: "emily@corp.com", company: "MegaCorp", title: "VP Product", content: "We've tried everything — Vouchy is the only tool that our customers actually enjoy using to leave reviews.", rating: 5, type: "video", status: "approved", isFavorite: true, createdAt: "2026-02-21", initials: "EC" },
];

const statusConfig = {
  pending: { icon: Clock, color: "bg-vouchy-sunset/10 text-vouchy-sunset" },
  approved: { icon: CheckCircle2, color: "bg-vouchy-emerald/10 text-vouchy-emerald" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive" },
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = testimonials.filter((t) => {
    if (filter === "video") return t.type === "video";
    if (filter === "text") return t.type === "text";
    if (filter === "pending" || filter === "approved" || filter === "rejected") return t.status === filter;
    return true;
  }).filter((t) =>
    search ? (t.name + t.company + t.content).toLowerCase().includes(search.toLowerCase()) : true
  );

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  };

  const toggleFavorite = (id: string) => {
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
        <p className="text-muted-foreground mt-1">Manage and curate your collected testimonials.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search testimonials..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquareText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-1">No testimonials found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((t, i) => {
            const StatusIcon = statusConfig[t.status].icon;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:vouchy-shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full vouchy-gradient-bg flex items-center justify-center text-sm font-semibold text-primary-foreground shrink-0">
                        {t.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{t.name}</span>
                            {t.title && <span className="text-sm text-muted-foreground">· {t.title}</span>}
                            {t.company && <span className="text-sm text-muted-foreground">at {t.company}</span>}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-xs gap-1">
                              {t.type === "video" ? <Video className="h-3 w-3" /> : <MessageSquareText className="h-3 w-3" />}
                              {t.type}
                            </Badge>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${statusConfig[t.status].color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {t.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? "fill-vouchy-sunset text-vouchy-sunset" : "text-border"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{t.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                          {t.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(t.id, "approved")}>
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(t.id, "rejected")}>
                                <XCircle className="h-3 w-3 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toggleFavorite(t.id)}>
                            <Heart className={`h-3 w-3 mr-1 ${t.isFavorite ? "fill-vouchy-rose text-vouchy-rose" : ""}`} />
                            {t.isFavorite ? "Favorited" : "Favorite"}
                          </Button>
                          <span className="text-xs text-muted-foreground ml-auto">{t.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
