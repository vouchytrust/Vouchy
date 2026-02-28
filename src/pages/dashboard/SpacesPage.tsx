import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, FolderOpen, Power, PowerOff, MessageSquareText, Video, Link2, ArrowUpRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { toast } = useToast();

  const gradients = ["from-primary to-chart-3", "from-chart-2 to-primary", "from-chart-4 to-chart-5", "from-chart-3 to-chart-5", "from-primary to-chart-2"];

  const createSpace = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const initial = newName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setSpaces([...spaces, {
      id: crypto.randomUUID(), name: newName, slug, isActive: true,
      testimonialCount: 0, videoCount: 0, textCount: 0,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      accentGradient: gradients[spaces.length % gradients.length], initial,
    }]);
    setNewName("");
    setDialogOpen(false);
    toast({ title: "Space created", description: `${newName} is ready for testimonials.` });
  };

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
    setSpaces(prev => prev.map(s => s.id === spaceId ? {
      ...s,
      ...(updates.name && { name: updates.name, initial: updates.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) }),
      ...(updates.isActive !== undefined && { isActive: updates.isActive }),
      ...(updates.formConfig && { formConfig: updates.formConfig }),
    } : s));
    toast({ title: "Space updated" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Spaces</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Collection pages for gathering testimonials.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 text-xs gap-1.5"><Plus className="h-3.5 w-3.5" /> New Space</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="text-base">Create a new space</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-[13px]">Space name</Label>
                <Input className="mt-1.5 h-9 text-[13px]" placeholder="e.g. Product Feedback" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={100} autoFocus />
                <p className="text-2xs text-muted-foreground mt-1">{newName.length}/100 characters</p>
              </div>
              <Button onClick={createSpace} className="w-full h-9 text-[13px]" disabled={!newName.trim()}>Create Space</Button>
            </div>
          </DialogContent>
        </Dialog>
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
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" /> Create Space</Button>
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
                className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:vouchy-shadow-sm transition-all duration-200"
              >
                {/* Top accent bar */}
                <div className={`h-1.5 bg-gradient-to-r ${space.accentGradient} ${!space.isActive ? "opacity-30" : ""}`} />

                <div className="p-5 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${space.accentGradient} flex items-center justify-center shrink-0 ${!space.isActive ? "opacity-40" : ""}`}>
                      <span className="text-[11px] font-bold text-primary-foreground">{space.initial}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-semibold text-foreground truncate">{space.name}</h3>
                        {space.isActive ? (
                          <span className="flex items-center gap-1 text-2xs font-medium text-vouchy-success bg-vouchy-success/10 px-1.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-vouchy-success animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="text-2xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">Inactive</span>
                        )}
                      </div>
                      <p className="text-2xs text-muted-foreground mt-0.5">Created {space.createdAt}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="text-[16px] font-bold text-foreground leading-none">{space.testimonialCount}</div>
                      <div className="text-2xs text-muted-foreground mt-1">Total</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Video className="h-3 w-3 text-primary" />
                        <span className="text-[16px] font-bold text-foreground leading-none">{space.videoCount}</span>
                      </div>
                      <div className="text-2xs text-muted-foreground mt-1">Video</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquareText className="h-3 w-3 text-chart-3" />
                        <span className="text-[16px] font-bold text-foreground leading-none">{space.textCount}</span>
                      </div>
                      <div className="text-2xs text-muted-foreground mt-1">Text</div>
                    </div>
                  </div>

                  {/* Collection link */}
                  <div className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border/60 px-3 py-2 mb-4">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-2xs text-muted-foreground truncate flex-1 font-mono">/collect/{space.slug.split("-").slice(0, -1).join("-")}</span>
                    <button
                      onClick={() => copyLink(space.slug)}
                      className="text-2xs font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
                    >
                      Copy
                    </button>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-2xs gap-1 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleActive(space.id)}
                    >
                      {space.isActive ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                      {space.isActive ? "Pause" : "Activate"}
                    </Button>
                    <a href={`/collect/${space.slug}`} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="ghost" className="h-7 text-2xs gap-1 px-2 text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3 w-3" /> Open
                      </Button>
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-2xs gap-1 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditor(space)}
                    >
                      <Settings2 className="h-3 w-3" /> Edit
                    </Button>
                    <div className="flex-1" />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteSpace(space.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add new card */}
          <motion.button
            variants={cardVariant}
            onClick={() => setDialogOpen(true)}
            className="rounded-xl border-2 border-dashed border-border/60 bg-card/50 p-5 flex flex-col items-center justify-center gap-2 min-h-[280px] hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">New Space</span>
          </motion.button>
        </motion.div>
      )}

      <SpaceEditorPanel
        open={editorOpen}
        onOpenChange={setEditorOpen}
        space={selectedSpace}
        onSave={handleEditorSave}
      />
    </div>
  );
}
