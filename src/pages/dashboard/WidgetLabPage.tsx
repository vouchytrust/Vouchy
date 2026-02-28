import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Tablet, Smartphone, Code, Check, Star, Grid3X3, Layers, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const layouts = [
  { id: "cards", name: "Cards", free: true },
  { id: "minimal", name: "Minimal", free: true },
  { id: "bento", name: "Bento", free: false },
  { id: "marquee", name: "Marquee", free: false },
  { id: "timeline", name: "Timeline", free: false },
  { id: "floating", name: "Floating", free: false },
  { id: "glass", name: "Glass", free: false },
  { id: "masonry", name: "Masonry", free: false },
  { id: "cinematic", name: "Cinematic", free: false },
  { id: "ticker", name: "Ticker", free: false },
  { id: "orbit", name: "Orbit", free: false },
  { id: "parallax", name: "Parallax", free: false },
  { id: "polaroid", name: "Polaroid", free: false },
  { id: "radial", name: "Radial", free: false },
  { id: "stacked", name: "Stacked", free: false },
];

const devices = [
  { id: "desktop", icon: Monitor, w: "100%" },
  { id: "tablet", icon: Tablet, w: "768px" },
  { id: "mobile", icon: Smartphone, w: "375px" },
];

const sampleTestimonials = [
  { name: "Sarah K.", company: "TechCo", rating: 5, content: "Absolutely transformed our customer experience!", initials: "SK", color: "from-blue-500/20 to-blue-600/5" },
  { name: "James D.", company: "StartupXYZ", rating: 5, content: "The best testimonial platform we've ever used.", initials: "JD", color: "from-violet-500/20 to-violet-600/5" },
  { name: "Aisha M.", company: "DesignHub", rating: 4, content: "Clean, minimal, and powerful.", initials: "AM", color: "from-emerald-500/20 to-emerald-600/5" },
  { name: "Luis R.", company: "GrowthCo", rating: 5, content: "Our conversions went up 40%!", initials: "LR", color: "from-amber-500/20 to-amber-600/5" },
  { name: "Emily C.", company: "MegaCorp", rating: 5, content: "Customers love leaving reviews now.", initials: "EC", color: "from-rose-500/20 to-rose-600/5" },
  { name: "Marco P.", company: "AgencyPro", rating: 5, content: "We use this for all our clients.", initials: "MP", color: "from-cyan-500/20 to-cyan-600/5" },
];

export default function WidgetLabPage() {
  const [selectedLayout, setSelectedLayout] = useState("cards");
  const [device, setDevice] = useState("desktop");
  const [darkMode, setDarkMode] = useState(false);
  const [showVideoFirst, setShowVideoFirst] = useState(true);
  const { toast } = useToast();

  const embedCode = `<script src="https://vouchy.app/embed.js" data-workspace="ws_demo" data-layout="${selectedLayout}"></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-60 shrink-0 flex flex-col gap-6 overflow-y-auto"
      >
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">Widget Lab</h1>
          <p className="text-2xs text-muted-foreground mt-0.5">Customize your embed widget.</p>
        </div>

        {/* Layout */}
        <div>
          <Label className="text-2xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Layout</Label>
          <div className="space-y-0.5 max-h-[280px] overflow-y-auto pr-1">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLayout(l.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                  selectedLayout === l.id
                    ? "bg-primary/[0.08] text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedLayout === l.id && <div className="w-1 h-3.5 rounded-full bg-primary" />}
                  {l.name}
                </div>
                {!l.free && <span className="text-2xs text-primary/70">PRO</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-3">
          <Label className="text-2xs font-medium text-muted-foreground uppercase tracking-wide">Appearance</Label>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Dark mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">Video first</span>
            <Switch checked={showVideoFirst} onCheckedChange={setShowVideoFirst} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-8 text-xs gap-1.5"><Code className="h-3.5 w-3.5" /> Get Embed Code</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="text-base">Embed Code</DialogTitle></DialogHeader>
              <div className="bg-muted rounded-lg p-4 mt-2">
                <code className="text-[11px] text-foreground break-all leading-relaxed font-mono">{embedCode}</code>
              </div>
              <Button onClick={copyEmbed} className="w-full h-9 text-[13px] mt-1">Copy to Clipboard</Button>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="w-full h-8 text-xs gap-1.5" asChild>
            <a href={`/embed/demo`} target="_blank" rel="noreferrer"><Eye className="h-3.5 w-3.5" /> Full Preview</a>
          </Button>
        </div>
      </motion.div>

      {/* Preview */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 flex flex-col min-w-0">
        {/* Device switcher */}
        <div className="flex items-center gap-1 mb-3">
          {devices.map((d) => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              className={`p-1.5 rounded-md transition-colors ${
                device === d.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <d.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Browser chrome */}
        <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-0.5 rounded bg-muted text-2xs text-muted-foreground">yourwebsite.com</div>
            </div>
          </div>

          <div className={`flex-1 p-8 overflow-y-auto transition-colors duration-300 ${darkMode ? "bg-[#0a0a0a]" : "bg-background"}`}>
            <div className="mx-auto" style={{ maxWidth: device === "mobile" ? "375px" : device === "tablet" ? "768px" : "100%" }}>
              <div className={`grid gap-3 ${device === "mobile" ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
                {sampleTestimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:translate-y-[-2px] ${
                      darkMode
                        ? "bg-[#111] border-[#222] hover:border-[#333]"
                        : "bg-card border-border hover:vouchy-shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.color} border ${darkMode ? "border-[#333]" : "border-border/50"} flex items-center justify-center`}>
                        <span className={`text-2xs font-semibold ${darkMode ? "text-white/90" : "text-foreground"}`}>{t.initials}</span>
                      </div>
                      <div>
                        <div className={`text-[12px] font-medium ${darkMode ? "text-white" : "text-foreground"}`}>{t.name}</div>
                        <div className={`text-2xs ${darkMode ? "text-white/40" : "text-muted-foreground"}`}>{t.company}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-2.5 w-2.5 ${j < t.rating ? "fill-vouchy-warning text-vouchy-warning" : darkMode ? "text-[#333]" : "text-border"}`} />
                      ))}
                    </div>
                    <p className={`text-[11.5px] leading-relaxed ${darkMode ? "text-white/60" : "text-muted-foreground"}`}>{t.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
