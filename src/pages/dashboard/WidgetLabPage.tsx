import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Tablet, Smartphone, Code, Check, Star, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const layouts = [
  { id: "cards", name: "Cards", free: true },
  { id: "minimal", name: "Minimal Stacked", free: true },
  { id: "bento", name: "Bento", free: false },
  { id: "marquee", name: "Marquee", free: false },
  { id: "timeline", name: "Timeline", free: false },
  { id: "floating", name: "Floating Cards", free: false },
  { id: "glass", name: "Glass Prism", free: false },
  { id: "masonry", name: "Masonry Wall", free: false },
  { id: "cinematic", name: "Cinematic Slider", free: false },
  { id: "ticker", name: "News Ticker", free: false },
  { id: "orbit", name: "Orbit Ring", free: false },
  { id: "parallax", name: "Parallax Scroll", free: false },
  { id: "polaroid", name: "Polaroid Stack", free: false },
  { id: "radial", name: "Radial Burst", free: false },
  { id: "stacked", name: "Stacked Cards", free: false },
];

const devices = [
  { id: "desktop", icon: Monitor, width: "100%" },
  { id: "tablet", icon: Tablet, width: "768px" },
  { id: "mobile", icon: Smartphone, width: "375px" },
];

const sampleTestimonials = [
  { name: "Sarah K.", company: "TechCo", rating: 5, content: "Absolutely transformed our customer experience!", initials: "SK" },
  { name: "James D.", company: "StartupXYZ", rating: 5, content: "The best testimonial platform we've ever used.", initials: "JD" },
  { name: "Aisha M.", company: "DesignHub", rating: 4, content: "Clean, minimal, and powerful. Love it!", initials: "AM" },
  { name: "Luis R.", company: "GrowthCo", rating: 5, content: "Our conversions went up 40%!", initials: "LR" },
  { name: "Emily C.", company: "MegaCorp", rating: 5, content: "Customers actually enjoy leaving reviews now.", initials: "EC" },
  { name: "Marco P.", company: "AgencyPro", rating: 5, content: "We use this for all our clients. Amazing!", initials: "MP" },
];

export default function WidgetLabPage() {
  const [selectedLayout, setSelectedLayout] = useState("cards");
  const [device, setDevice] = useState("desktop");
  const [darkMode, setDarkMode] = useState(false);
  const [showVideoFirst, setShowVideoFirst] = useState(true);
  const { toast } = useToast();

  const embedCode = `<script src="https://vouchy.app/embed.js" data-workspace="ws_demo" data-layout="${selectedLayout}" data-dark="${darkMode}"></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast({ title: "Embed code copied!" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-72 shrink-0 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Widget Lab</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize and embed your testimonial widget.</p>
        </div>

        {/* Layout selector */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Layout</Label>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLayout(l.id)}
                className={`relative text-left p-3 rounded-lg border text-xs transition-colors ${
                  selectedLayout === l.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <Layout className="h-4 w-4 mb-1 text-muted-foreground" />
                <div className="font-medium text-foreground">{l.name}</div>
                {!l.free && <span className="text-[10px] text-primary">PRO</span>}
                {selectedLayout === l.id && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Customizer */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Appearance</Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Dark mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Video first</span>
            <Switch checked={showVideoFirst} onCheckedChange={setShowVideoFirst} />
          </div>
        </div>

        {/* Embed */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full"><Code className="h-4 w-4 mr-2" /> Get Embed Code</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Embed Code</DialogTitle></DialogHeader>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto text-foreground">{embedCode}</pre>
            <Button onClick={copyEmbed} className="w-full mt-2">Copy to Clipboard</Button>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Preview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-w-0">
        {/* Device switcher */}
        <div className="flex items-center gap-2 mb-4">
          {devices.map((d) => (
            <Button key={d.id} variant={device === d.id ? "default" : "outline"} size="sm" onClick={() => setDevice(d.id)}>
              <d.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Browser mockup */}
        <div className="flex-1 border border-border rounded-xl overflow-hidden bg-card">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-vouchy-sunset/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-vouchy-emerald/50" />
            </div>
            <div className="flex-1 text-center text-xs text-muted-foreground">yourwebsite.com</div>
          </div>
          <div className={`p-6 overflow-y-auto ${darkMode ? "bg-foreground/95" : "bg-background"}`} style={{ maxHeight: "calc(100vh - 14rem)" }}>
            <div className="mx-auto" style={{ maxWidth: device === "mobile" ? "375px" : device === "tablet" ? "768px" : "100%" }}>
              {/* Cards layout preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleTestimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-5 rounded-xl border transition-shadow hover:vouchy-shadow-md ${
                      darkMode ? "bg-card/10 border-border/20 text-primary-foreground" : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full vouchy-gradient-bg flex items-center justify-center text-xs font-semibold text-primary-foreground">
                        {t.initials}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${darkMode ? "text-primary-foreground" : "text-foreground"}`}>{t.name}</div>
                        <div className={`text-xs ${darkMode ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{t.company}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < t.rating ? "fill-vouchy-sunset text-vouchy-sunset" : "text-border"}`} />
                      ))}
                    </div>
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.content}</p>
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
