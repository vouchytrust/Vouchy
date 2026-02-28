import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, MoreHorizontal, FolderOpen, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Space {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  testimonialCount: number;
  createdAt: string;
}

const mockSpaces: Space[] = [
  { id: "1", name: "Product Feedback", slug: "product-feedback-1706000000", isActive: true, testimonialCount: 47, createdAt: "Jan 15, 2026" },
  { id: "2", name: "Customer Stories", slug: "customer-stories-1706100000", isActive: true, testimonialCount: 23, createdAt: "Feb 1, 2026" },
  { id: "3", name: "Beta Testers", slug: "beta-testers-1706200000", isActive: false, testimonialCount: 8, createdAt: "Feb 10, 2026" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function SpacesPage() {
  const [spaces, setSpaces] = useState(mockSpaces);
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const createSpace = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setSpaces([...spaces, { id: crypto.randomUUID(), name: newName, slug, isActive: true, testimonialCount: 0, createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }]);
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

  return (
    <div className="space-y-6 max-w-[700px]">
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
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          {spaces.map((space) => (
            <motion.div key={space.id} variants={item} layout className="group flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 hover:vouchy-shadow-sm transition-all duration-200">
              {/* Status dot */}
              <div className="relative">
                <div className={`w-2 h-2 rounded-full ${space.isActive ? "bg-vouchy-success" : "bg-muted-foreground/30"}`} />
                {space.isActive && <div className="absolute inset-0 w-2 h-2 rounded-full bg-vouchy-success animate-pulse-soft" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-foreground">{space.name}</span>
                  {!space.isActive && (
                    <span className="text-2xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Inactive</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xs text-muted-foreground">{space.testimonialCount} testimonials</span>
                  <span className="text-2xs text-muted-foreground/30">·</span>
                  <span className="text-2xs text-muted-foreground">{space.createdAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => copyLink(space.slug)} className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Copy link">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <a href={`/collect/${space.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Open">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-md hover:bg-accent transition-colors">
                      <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => toggleActive(space.id)} className="text-xs gap-2">
                      {space.isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                      {space.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs text-destructive gap-2">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
