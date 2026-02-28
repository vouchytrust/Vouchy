import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Tablet, Smartphone, Code, Star, Eye, Lock,
  Copy, Check, Sparkles, LayoutGrid, Rows3, GalleryHorizontalEnd,
  Timer, Layers3, Wind, Gem, Columns3, Film, Newspaper,
  Circle, Mountain, Image, Zap, SquareStack,
  Type, Palette, AlignCenter, Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

/* ── Layout definitions ── */
interface Layout {
  id: string;
  name: string;
  icon: React.ReactNode;
  free: boolean;
  category: "grid" | "scroll" | "immersive";
}

const layouts: Layout[] = [
  { id: "cards", name: "Cards", icon: <LayoutGrid className="h-3.5 w-3.5" />, free: true, category: "grid" },
  { id: "minimal", name: "Minimal Stacked", icon: <Rows3 className="h-3.5 w-3.5" />, free: true, category: "grid" },
  { id: "bento", name: "Bento", icon: <Columns3 className="h-3.5 w-3.5" />, free: false, category: "grid" },
  { id: "masonry", name: "Masonry Wall", icon: <Layers3 className="h-3.5 w-3.5" />, free: false, category: "grid" },
  { id: "marquee", name: "Marquee", icon: <GalleryHorizontalEnd className="h-3.5 w-3.5" />, free: false, category: "scroll" },
  { id: "timeline", name: "Timeline", icon: <Timer className="h-3.5 w-3.5" />, free: false, category: "scroll" },
  { id: "ticker", name: "News Ticker", icon: <Newspaper className="h-3.5 w-3.5" />, free: false, category: "scroll" },
  { id: "cinematic", name: "Cinematic Slider", icon: <Film className="h-3.5 w-3.5" />, free: false, category: "immersive" },
  { id: "floating", name: "Floating Cards", icon: <Wind className="h-3.5 w-3.5" />, free: false, category: "immersive" },
  { id: "glass", name: "Glass Prism", icon: <Gem className="h-3.5 w-3.5" />, free: false, category: "immersive" },
  { id: "orbit", name: "Orbit Ring", icon: <Circle className="h-3.5 w-3.5" />, free: false, category: "immersive" },
  { id: "parallax", name: "Parallax Scroll", icon: <Mountain className="h-3.5 w-3.5" />, free: false, category: "immersive" },
  { id: "polaroid", name: "Polaroid Stack", icon: <Image className="h-3.5 w-3.5" />, free: false, category: "immersive" },
  { id: "radial", name: "Radial Burst", icon: <Zap className="h-3.5 w-3.5" />, free: false, category: "immersive" },
  { id: "stacked", name: "Stacked Cards", icon: <SquareStack className="h-3.5 w-3.5" />, free: false, category: "immersive" },
];

const categories = [
  { id: "grid", label: "Grid" },
  { id: "scroll", label: "Scroll" },
  { id: "immersive", label: "Immersive" },
] as const;

const devices = [
  { id: "desktop", icon: Monitor, w: "100%" },
  { id: "tablet", icon: Tablet, w: "768px" },
  { id: "mobile", icon: Smartphone, w: "375px" },
];

const sampleTestimonials = [
  { name: "Sarah K.", company: "TechCo", rating: 5, content: "Absolutely transformed our customer experience! The team was responsive and the results speak for themselves.", initials: "SK" },
  { name: "James D.", company: "StartupXYZ", rating: 5, content: "The best testimonial platform we've ever used. Setup took minutes.", initials: "JD" },
  { name: "Aisha M.", company: "DesignHub", rating: 4, content: "Clean, minimal, and powerful. Exactly what we needed.", initials: "AM" },
  { name: "Luis R.", company: "GrowthCo", rating: 5, content: "Our conversions went up 40% after adding the widget!", initials: "LR" },
  { name: "Emily C.", company: "MegaCorp", rating: 5, content: "Customers love leaving reviews now. So easy to embed.", initials: "EC" },
  { name: "Marco P.", company: "AgencyPro", rating: 5, content: "We use this for all our clients. Saves hours every week.", initials: "MP" },
];

/* ── Testimonial Card (used in preview) ── */
interface CardConfig {
  darkMode: boolean;
  radius: number;
  padding: number;
  shadow: string;
  font: string;
  accent: string;
  cardBg: string;
  nameColor: string;
  companyColor: string;
  bodyColor: string;
  starColor: string;
  showStars: boolean;
  showAvatar: boolean;
  showCompany: boolean;
}

const shadowMap: Record<string, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

const fontMap: Record<string, string> = {
  system: "font-sans",
  inter: "font-sans",
  georgia: "font-serif",
  mono: "font-mono",
};

function TestimonialCard({ t, config, index }: { t: typeof sampleTestimonials[0]; config: CardConfig; index: number }) {
  const { darkMode, radius, padding, shadow, font, cardBg, nameColor, companyColor, bodyColor, starColor, showStars, showAvatar, showCompany } = config;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      className={`border transition-all duration-200 hover:-translate-y-0.5 ${fontMap[font]} ${shadowMap[shadow]} ${
        darkMode ? "border-[hsl(240_4%_16%)]" : "border-border"
      }`}
      style={{ borderRadius: `${radius}px`, padding: `${padding}px`, backgroundColor: cardBg }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        {showAvatar && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: darkMode ? "hsl(240 4% 16%)" : "#f3f4f6" }}
          >
            <span className="text-2xs font-semibold" style={{ color: companyColor }}>
              {t.initials}
            </span>
          </div>
        )}
        <div>
          <div className="text-[12px] font-medium leading-tight" style={{ color: nameColor }}>{t.name}</div>
          {showCompany && (
            <div className="text-2xs" style={{ color: companyColor }}>{t.company}</div>
          )}
        </div>
      </div>
      {showStars && (
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className="h-2.5 w-2.5" style={{ color: j < t.rating ? starColor : "#e5e7eb", fill: j < t.rating ? starColor : "none" }} />
          ))}
        </div>
      )}
      <p className="text-[11.5px] leading-relaxed" style={{ color: bodyColor }}>
        {t.content}
      </p>
    </motion.div>
  );
}

/* ── Main ── */
export default function WidgetLabPage() {
  const [selectedLayout, setSelectedLayout] = useState("cards");
  const [device, setDevice] = useState("desktop");
  const [darkMode, setDarkMode] = useState(false);
  const [showVideoFirst, setShowVideoFirst] = useState(true);
  const [copied, setCopied] = useState(false);
  const [layoutFilter, setLayoutFilter] = useState<"all" | "grid" | "scroll" | "immersive">("all");
   const [cardRadius, setCardRadius] = useState([12]);
  const [cardPadding, setCardPadding] = useState([16]);
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [cardBg, setCardBg] = useState("#ffffff");
  const [nameColor, setNameColor] = useState("#1a1a1a");
  const [companyColor, setCompanyColor] = useState("#888888");
  const [bodyColor, setBodyColor] = useState("#666666");
  const [starColor, setStarColor] = useState("#f59e0b");
  const [showStars, setShowStars] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showCompany, setShowCompany] = useState(true);
  const [fontFamily, setFontFamily] = useState("system");
  const [cardShadow, setCardShadow] = useState("sm");
  const [headerAlign, setHeaderAlign] = useState("center");
  const { toast } = useToast();

  const embedCode = `<script src="https://vouchy.app/embed.js" data-workspace="ws_demo" data-layout="${selectedLayout}"></script>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({ title: "Embed code copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLayouts = layoutFilter === "all" ? layouts : layouts.filter(l => l.category === layoutFilter);
  const currentLayout = layouts.find(l => l.id === selectedLayout);

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-7rem)]">
      {/* ── Left: Controls ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full lg:w-72 shrink-0 flex flex-col border-r border-border bg-card/50 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg vouchy-gradient-bg flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <h1 className="text-[17px] font-semibold text-foreground">Widget Lab</h1>
          </div>
          <p className="text-2xs text-muted-foreground">Design and preview your embed widget.</p>
        </div>

        {/* Layout selector */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Category filter pills */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLayoutFilter("all")}
              className={`px-2.5 py-1 rounded-full text-2xs font-medium transition-all ${
                layoutFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setLayoutFilter(c.id)}
                className={`px-2.5 py-1 rounded-full text-2xs font-medium transition-all ${
                  layoutFilter === c.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Layout grid */}
          <div className="grid grid-cols-2 gap-1.5">
            <AnimatePresence mode="popLayout">
              {filteredLayouts.map(l => (
                <motion.button
                  key={l.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedLayout(l.id)}
                  className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all duration-150 ${
                    selectedLayout === l.id
                      ? "bg-primary/[0.08] ring-1 ring-primary/30 text-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={selectedLayout === l.id ? "text-primary" : ""}>{l.icon}</span>
                  <span className="text-2xs font-medium leading-tight">{l.name}</span>
                  {!l.free && (
                    <Lock className="absolute top-1.5 right-1.5 h-2.5 w-2.5 text-muted-foreground/40" />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Appearance controls */}
          <div className="space-y-3.5 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Appearance</p>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Dark mode</span>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Video first</span>
              <Switch checked={showVideoFirst} onCheckedChange={setShowVideoFirst} />
            </div>
          </div>

          {/* Card style */}
          <div className="space-y-3.5 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Colors</p>
            {([
              { label: "Card background", value: cardBg, set: setCardBg },
              { label: "Name", value: nameColor, set: setNameColor },
              { label: "Company", value: companyColor, set: setCompanyColor },
              { label: "Testimonial", value: bodyColor, set: setBodyColor },
              { label: "Stars", value: starColor, set: setStarColor },
            ] as const).map(({ label, value, set }) => (
              <div key={label} className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">{label}</Label>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: value }} />
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
                  />
                </div>
              </div>
            ))}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[11px] text-muted-foreground">Border radius</Label>
                <span className="text-[10px] text-muted-foreground font-mono">{cardRadius[0]}px</span>
              </div>
              <Slider value={cardRadius} onValueChange={setCardRadius} min={0} max={24} step={2} className="w-full" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[11px] text-muted-foreground">Card padding</Label>
                <span className="text-[10px] text-muted-foreground font-mono">{cardPadding[0]}px</span>
              </div>
              <Slider value={cardPadding} onValueChange={setCardPadding} min={8} max={32} step={2} className="w-full" />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground mb-1.5 block">Shadow</Label>
              <Select value={cardShadow} onValueChange={setCardShadow}>
                <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-[11px]">None</SelectItem>
                  <SelectItem value="sm" className="text-[11px]">Small</SelectItem>
                  <SelectItem value="md" className="text-[11px]">Medium</SelectItem>
                  <SelectItem value="lg" className="text-[11px]">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground mb-1.5 block">Font</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="system" className="text-[11px]">System Default</SelectItem>
                  <SelectItem value="inter" className="text-[11px]">Inter</SelectItem>
                  <SelectItem value="georgia" className="text-[11px]">Georgia</SelectItem>
                  <SelectItem value="mono" className="text-[11px]">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content toggles */}
          <div className="space-y-3 pt-3 border-t border-border">
            <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Content</p>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Star ratings</span>
              <Switch checked={showStars} onCheckedChange={setShowStars} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Avatars</span>
              <Switch checked={showAvatar} onCheckedChange={setShowAvatar} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground">Company name</span>
              <Switch checked={showCompany} onCheckedChange={setShowCompany} />
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full h-9 text-xs gap-1.5">
                <Code className="h-3.5 w-3.5" /> Get Embed Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-base">Embed Code</DialogTitle>
              </DialogHeader>
              <div className="bg-muted rounded-xl p-4 mt-2 border border-border">
                <code className="text-[11px] text-foreground break-all leading-relaxed font-mono">
                  {embedCode}
                </code>
              </div>
              <Button onClick={copyEmbed} className="w-full h-9 text-[13px] mt-1 gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="w-full h-9 text-xs gap-1.5" asChild>
            <a href="/embed/demo" target="_blank" rel="noreferrer">
              <Eye className="h-3.5 w-3.5" /> Full Preview
            </a>
          </Button>
        </div>
      </motion.div>

      {/* ── Right: Preview ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex-1 flex flex-col min-w-0 bg-background"
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Device switcher */}
            <div className="flex items-center gap-0.5 rounded-lg bg-muted/60 p-0.5">
              {devices.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`p-1.5 rounded-md transition-all duration-150 ${
                    device === d.id
                      ? "bg-background text-foreground vouchy-shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <d.icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Current layout badge */}
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" className="text-2xs font-medium gap-1 py-0.5">
                {currentLayout?.icon}
                {currentLayout?.name}
              </Badge>
              {currentLayout && !currentLayout.free && (
                <Badge variant="outline" className="text-2xs py-0.5 text-primary border-primary/30">PRO</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-2xs gap-1 text-muted-foreground"
              onClick={copyEmbed}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              Copy
            </Button>
          </div>
        </div>

        {/* Browser frame + preview */}
        <div className="flex-1 p-4 overflow-hidden flex justify-center">
          <motion.div
            className="h-full rounded-xl border border-border bg-card overflow-hidden flex flex-col vouchy-shadow-sm"
            animate={{ maxWidth: device === "mobile" ? "375px" : device === "tablet" ? "768px" : "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: "100%" }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/20">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--vouchy-warning))]/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--vouchy-success))]/20" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-6 py-1 rounded-lg bg-muted/60 border border-border text-2xs text-muted-foreground font-mono">
                  yourwebsite.com
                </div>
              </div>
            </div>

            {/* Content area */}
            <div
              className={`flex-1 overflow-y-auto transition-colors duration-300 ${
                darkMode ? "bg-[hsl(240_10%_4%)]" : "bg-background"
              }`}
            >
              <div className="p-6 lg:p-10">

                {/* Testimonial grid */}
                <div className={`grid gap-3 ${
                  device === "mobile" ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
                }`}>
                  {sampleTestimonials.map((t, i) => (
                    <TestimonialCard key={i} t={t} config={{
                      darkMode, radius: cardRadius[0], padding: cardPadding[0],
                      shadow: cardShadow, font: fontFamily, accent: accentColor,
                      cardBg, nameColor, companyColor, bodyColor, starColor,
                      showStars, showAvatar, showCompany,
                    }} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
