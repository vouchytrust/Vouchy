import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, FolderOpen, Power, PowerOff, MessageSquareText, Video, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSpaces as apiFetchSpaces, createSpace as apiCreateSpace, updateSpace as apiUpdateSpace, deleteSpace as apiDeleteSpace, toggleSpaceActive, fetchSpaceTestimonialCounts } from "@/lib/api";
import SpaceEditorPanel, { type SpaceFormConfig } from "@/components/SpaceEditorPanel";

interface Space {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  form_config: any;
  created_at: string;
  user_id: string;
}

const gradients = ["from-primary to-chart-3", "from-chart-2 to-primary", "from-chart-4 to-chart-5", "from-chart-3 to-chart-5", "from-primary to-chart-2"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const cardVariant = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [counts, setCounts] = useState<Record<string, { total: number; video: number; text: number }>>({});
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadData = async () => {
    try {
      const [spacesData, countsData] = await Promise.all([apiFetchSpaces(), fetchSpaceTestimonialCounts()]);
      setSpaces(spacesData as Space[]);
      setCounts(countsData);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreateEditor = () => {
    setSelectedSpace(null);
    setIsCreating(true);
    setEditorOpen(true);
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/collect/${slug}`);
    toast({ title: "Link copied to clipboard" });
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await toggleSpaceActive(id, !current);
      setSpaces(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteSpace(id);
      setSpaces(prev => prev.filter(s => s.id !== id));
      toast({ title: "Space deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openEditor = (space: Space) => {
    const idx = spaces.indexOf(space);
    setSelectedSpace({
      id: space.id,
      name: space.name,
      slug: space.slug,
      isActive: space.is_active,
      accentGradient: gradients[idx % gradients.length],
      initial: space.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      formConfig: space.form_config,
    });
    setIsCreating(false);
    setEditorOpen(true);
  };

  const handleEditorSave = async (spaceId: string, updates: { name?: string; isActive?: boolean; formConfig?: SpaceFormConfig }) => {
    try {
      if (isCreating) {
        const spaceName = updates.name || "Untitled";
        const slug = spaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
        const newSpace = await apiCreateSpace({
          name: spaceName,
          slug,
          is_active: updates.isActive ?? true,
          form_config: updates.formConfig || {},
          user_id: user!.id,
        });
        setSpaces(prev => [newSpace as Space, ...prev]);
        setIsCreating(false);
        toast({ title: "Space created", description: `${spaceName} is ready for testimonials.` });
      } else {
        await apiUpdateSpace(spaceId, {
          ...(updates.name && { name: updates.name }),
          ...(updates.isActive !== undefined && { is_active: updates.isActive }),
          ...(updates.formConfig && { form_config: updates.formConfig }),
        });
        setSpaces(prev => prev.map(s => s.id === spaceId ? {
          ...s,
          ...(updates.name && { name: updates.name }),
          ...(updates.isActive !== undefined && { is_active: updates.isActive }),
          ...(updates.formConfig && { form_config: updates.formConfig }),
        } : s));
        toast({ title: "Space updated" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalTestimonials = Object.values(counts).reduce((a, c) => a + c.total, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Spaces</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Collection pages for gathering testimonials.</p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={openCreateEditor}>
          <Plus className="h-3.5 w-3.5" /> New Space
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex items-center gap-6 text-[12px]">
        <span className="text-muted-foreground"><span className="font-semibold text-foreground">{spaces.length}</span> spaces</span>
        <span className="text-muted-foreground"><span className="font-semibold text-foreground">{spaces.filter(s => s.is_active).length}</span> active</span>
        <span className="text-muted-foreground"><span className="font-semibold text-foreground">{totalTestimonials}</span> total testimonials</span>
      </motion.div>

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
            {spaces.map((space, idx) => {
              const c = counts[space.id] || { total: 0, video: 0, text: 0 };
              const initial = space.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
              const gradient = gradients[idx % gradients.length];
              return (
                <motion.div
                  key={space.id}
                  variants={cardVariant}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:border-primary/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 ${!space.is_active ? "opacity-40" : ""}`}>
                      <span className="text-[10px] font-bold text-primary-foreground">{initial}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-foreground truncate">{space.name}</h3>
                      <p className="text-2xs text-muted-foreground">{c.total} testimonials</p>
                    </div>
                    {space.is_active ? (
                      <span className="flex items-center gap-1 text-2xs font-medium text-vouchy-success bg-vouchy-success/10 px-1.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-vouchy-success animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="text-2xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Video className="h-3 w-3 text-primary" />{c.video} video</span>
                    <span className="flex items-center gap-1"><MessageSquareText className="h-3 w-3 text-chart-3" />{c.text} text</span>
                    <span className="ml-auto">{new Date(space.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>

                  <div className="flex items-center gap-1 pt-2 border-t border-border/60">
                    <Button size="sm" variant="ghost" className="h-7 text-2xs gap-1 px-2 text-muted-foreground hover:text-foreground" onClick={() => handleToggleActive(space.id, space.is_active)}>
                      {space.is_active ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                      {space.is_active ? "Pause" : "Activate"}
                    </Button>
                    <a href={`/collect/${space.slug}`} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="ghost" className="h-7 text-2xs gap-1 px-2 text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3 w-3" /> Open
                      </Button>
                    </a>
                    <Button size="sm" variant="ghost" className="h-7 text-2xs gap-1 px-2 text-muted-foreground hover:text-foreground" onClick={() => copyLink(space.slug)}>
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-2xs gap-1 px-2 text-muted-foreground hover:text-foreground" onClick={() => openEditor(space)}>
                      <Settings2 className="h-3 w-3" /> Edit
                    </Button>
                    <div className="flex-1" />
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(space.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.button
            variants={cardVariant}
            onClick={openCreateEditor}
            className="rounded-xl border-2 border-dashed border-border/60 bg-card/50 p-4 flex flex-col items-center justify-center gap-2 min-h-[160px] hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-200 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[12px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">New Space</span>
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
