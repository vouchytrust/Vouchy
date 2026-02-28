import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, FolderOpen, Power, PowerOff, MessageSquareText, Video, Link2, ArrowUpRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SpaceEditorPanel, { type SpaceFormConfig } from "@/components/SpaceEditorPanel";
interface Space {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  testimonialCount: number;
  videoCount: number;
  textCount: number;
  createdAt: string;
  accentGradient: string;
  initial: string;
  formConfig?: SpaceFormConfig;
}

const mockSpaces: Space[] = [
  { id: "1", name: "Product Feedback", slug: "product-feedback-1706000000", isActive: true, testimonialCount: 47, videoCount: 18, textCount: 29, createdAt: "Jan 15, 2026", accentGradient: "from-primary to-chart-3", initial: "PF" },
  { id: "2", name: "Customer Stories", slug: "customer-stories-1706100000", isActive: true, testimonialCount: 23, videoCount: 9, textCount: 14, createdAt: "Feb 1, 2026", accentGradient: "from-chart-2 to-primary", initial: "CS" },
  { id: "3", name: "Beta Testers", slug: "beta-testers-1706200000", isActive: false, testimonialCount: 8, videoCount: 2, textCount: 6, createdAt: "Feb 10, 2026", accentGradient: "from-chart-4 to-chart-5", initial: "BT" },
  { id: "4", name: "Agency Clients", slug: "agency-clients-1706300000", isActive: true, testimonialCount: 62, videoCount: 31, textCount: 31, createdAt: "Feb 18, 2026", accentGradient: "from-chart-3 to-chart-5", initial: "AC" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const cardVariant = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

export default function SpacesPage() {
  const [spaces, setSpaces] = useState(mockSpaces);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const openCreateEditor = () => {
    setSelectedSpace(null);
    setIsCreating(true);
    setEditorOpen(true);
  };

  const gradients = ["from-primary to-chart-3", "from-chart-2 to-primary", "from-chart-4 to-chart-5", "from-chart-3 to-chart-5", "from-primary to-chart-2"];

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/collect/${slug}`);
    toast({ title: "Link copied to clipboard" });
  };

  const toggleActive = (id: string) => {
    setSpaces((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const deleteSpace = (id: string) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Space deleted" });
  };

  const openEditor = (space: Space) => {
    setSelectedSpace(space);
    setEditorOpen(true);
  };

  const handleEditorSave = (spaceId: string, updates: { name?: string; isActive?: boolean; formConfig?: SpaceFormConfig }) => {
    if (isCreating) {
      // Creating a new space
      const spaceName = updates.name || "Untitled";
      const slug = spaceName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      const initial = spaceName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
      setSpaces(prev => [...prev, {
        id: spaceId,
        name: spaceName,
        slug,
        isActive: updates.isActive ?? true,
        testimonialCount: 0,
        videoCount: 0,
        textCount: 0,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        accentGradient: gradients[spaces.length % gradients.length],
        initial,
        formConfig: updates.formConfig,
      }]);
      setIsCreating(false);
      toast({ title: "Space created", description: `${spaceName} is ready for testimonials.` });
    } else {
      setSpaces(prev => prev.map(s => s.id === spaceId ? {
        ...s,
        ...(updates.name && { name: updates.name, initial: updates.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
        ...(updates.formConfig && { formConfig: updates.formConfig }),
      } : s));
      toast({ title: "Space updated" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Spaces</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Collection pages for gathering testimonials.</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={openCreateEditor}>
          <Plus className="h-3.5 w-3.5" /> New Space
        </Button>
      </motion.div>

      {/* Summary strip */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center gap-6 text-[12px]">
        <span className="text-muted-foreground"><span className="font-semibold text-foreground">{spaces.length}</span> spaces</span>
        <span className="text-muted-foreground"><span className="font-semibold text-foreground">{spaces.filter(s => s.isActive).length}</span> active</span>
        <span className="text-muted-foreground"><span className="font-semibold text-foreground">{spaces.reduce((a, s) => a + s.testimonialCount, 0)}</span> total testimonials</span>
      </motion.div>

      {/* Cards grid */}
      {spaces.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-[14px] font-medium text-foreground mb-1">No spaces yet</h3>
          <p className="text-[12px] text-muted-foreground mb-4">Create your first space to start collecting.</p>
          <Button size="sm" onClick={openCreateEditor}><Plus className="h-3.5 w-3.5 mr-1.5" /> Create Space</Button>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {spaces.map((space) => (
              <motion.div
                key={space.id}
                variants={cardVariant}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
                className="group rounded-xl border border-border/50 bg-card overflow-hidden flex flex-col hover:border-border transition-all duration-300 cursor-pointer"
                onClick={() => openEditor(space)}
              >
                <div className="p-4 flex-1 flex flex-col">
                  {/* Header row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${space.accentGradient} flex items-center justify-center shrink-0 ${!space.isActive ? "opacity-30" : ""}`}>
                      <span className="text-[9px] font-bold text-primary-foreground">{space.initial}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-medium text-foreground truncate">{space.name}</h3>
                      <p className="text-2xs text-muted-foreground">{space.createdAt}</p>
                    </div>
                    {space.isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
                    )}
                  </div>

                  {/* Compact stats */}
                  <div className="flex items-center gap-4 text-2xs text-muted-foreground mb-3">
                    <span><span className="font-semibold text-foreground">{space.testimonialCount}</span> total</span>
                    <span className="flex items-center gap-1"><Video className="h-2.5 w-2.5" />{space.videoCount}</span>
                    <span className="flex items-center gap-1"><MessageSquareText className="h-2.5 w-2.5" />{space.textCount}</span>
                  </div>

                  {/* Actions — only visible on hover */}
                  <div className="flex items-center gap-1 mt-auto pt-2 border-t border-border/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyLink(space.slug); }}
                      className="text-2xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleActive(space.id); }}
                      className="text-2xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5"
                    >
                      {space.isActive ? "Pause" : "Activate"}
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSpace(space.id); }}
                      className="text-2xs text-muted-foreground/40 hover:text-destructive transition-colors px-1 py-0.5"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add new card */}
          <motion.button
            variants={cardVariant}
            onClick={openCreateEditor}
            className="rounded-xl border border-dashed border-border/40 bg-transparent p-4 flex flex-col items-center justify-center gap-1.5 min-h-[140px] hover:border-primary/30 transition-all duration-300 cursor-pointer group"
          >
            <Plus className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            <span className="text-2xs text-muted-foreground/60 group-hover:text-foreground transition-colors">New Space</span>
          </motion.button>
        </motion.div>
      )}

      <SpaceEditorPanel
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setIsCreating(false);
        }}
        space={selectedSpace}
        isCreating={isCreating}
        onSave={handleEditorSave}
      />
    </div>
  );
}
