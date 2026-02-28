import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Copy, ExternalLink, Trash2, MoreHorizontal, FolderOpen, ToggleLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  { id: "1", name: "Product Feedback", slug: "product-feedback-1706000000", isActive: true, testimonialCount: 47, createdAt: "2026-01-15" },
  { id: "2", name: "Customer Stories", slug: "customer-stories-1706100000", isActive: true, testimonialCount: 23, createdAt: "2026-02-01" },
  { id: "3", name: "Beta Testers", slug: "beta-testers-1706200000", isActive: false, testimonialCount: 8, createdAt: "2026-02-10" },
];

export default function SpacesPage() {
  const [spaces, setSpaces] = useState(mockSpaces);
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const createSpace = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setSpaces([...spaces, { id: crypto.randomUUID(), name: newName, slug, isActive: true, testimonialCount: 0, createdAt: new Date().toISOString().split("T")[0] }]);
    setNewName("");
    setDialogOpen(false);
    toast({ title: "Space created", description: `${newName} is ready to collect testimonials.` });
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/collect/${slug}`);
    toast({ title: "Link copied!" });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Spaces</h1>
          <p className="text-muted-foreground mt-1">Create collection pages for your testimonials.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Space</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create a new space</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Space name</Label>
                <Input className="mt-1.5" placeholder="e.g. Product Feedback" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={100} autoFocus />
              </div>
              <Button onClick={createSpace} className="w-full" disabled={!newName.trim()}>Create Space</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {spaces.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-1">No spaces yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first space to start collecting testimonials.</p>
          <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> Create Space</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {spaces.map((space, i) => (
            <motion.div key={space.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:vouchy-shadow-sm transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${space.isActive ? "bg-primary/10" : "bg-muted"}`}>
                    <FolderOpen className={`h-5 w-5 ${space.isActive ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{space.name}</span>
                      {!space.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {space.testimonialCount} testimonials · Created {space.createdAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyLink(space.slug)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a href={`/collect/${space.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><ToggleLeft className="h-4 w-4 mr-2" /> {space.isActive ? "Deactivate" : "Activate"}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
