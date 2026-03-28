import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Check, GripVertical, Mail, MessageSquare, 
  Send, Star, Trash2, Type, User, Video, Plus, Eye, Monitor, Smartphone, Moon, Sun, PenLine, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { createSpace as apiCreateSpace, updateSpace as apiUpdateSpace } from "@/lib/api";

// ── Types ──
export interface FormField {
  id: string;
  type: "name" | "email" | "rating" | "text" | "video" | "custom";
  label: string;
  required: boolean;
}

export interface ThankYouConfig {
  message: string;
  redirectUrl: string;
  ctaText: string;
}

export interface SpaceFormConfig {
  formFields: FormField[];
  thankYouConfig: ThankYouConfig;
}

const defaultFields: FormField[] = [
  { id: "f1", type: "name", label: "Full Name", required: true },
  { id: "f2", type: "email", label: "Email", required: true },
  { id: "f3", type: "rating", label: "Rate your experience", required: true },
  { id: "f4", type: "text", label: "Share your experience...", required: true },
];

const defaultThankYou: ThankYouConfig = {
  message: "Thank you!",
  redirectUrl: "",
  ctaText: "Submit another",
};

const fieldTypeIcons: Record<FormField["type"], React.ReactNode> = {
  name: <User className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  rating: <Star className="h-3.5 w-3.5" />,
  text: <Type className="h-3.5 w-3.5" />,
  video: <Video className="h-3.5 w-3.5" />,
  custom: <MessageSquare className="h-3.5 w-3.5" />,
};

const lightVariables = {
  "--background": "0 0% 99%",
  "--foreground": "240 10% 4%",
  "--card": "0 0% 100%",
  "--card-foreground": "240 10% 4%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "240 10% 4%",
  "--primary": "142 76% 36%",
  "--primary-foreground": "0 0% 100%",
  "--secondary": "240 5% 96%",
  "--secondary-foreground": "240 6% 10%",
  "--muted": "240 5% 96%",
  "--muted-foreground": "240 4% 46%",
  "--accent": "240 5% 96%",
  "--accent-foreground": "240 6% 10%",
  "--destructive": "0 72% 51%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "240 6% 93%",
  "--input": "240 6% 93%",
  "--ring": "142 76% 36%"
} as React.CSSProperties;

const darkVariables = {
  "--background": "240 10% 4%",
  "--foreground": "0 0% 95%",
  "--card": "240 10% 6%",
  "--card-foreground": "0 0% 95%",
  "--popover": "240 10% 6%",
  "--popover-foreground": "0 0% 95%",
  "--primary": "142 76% 36%",
  "--primary-foreground": "0 0% 100%",
  "--secondary": "240 4% 16%",
  "--secondary-foreground": "0 0% 95%",
  "--muted": "240 4% 16%",
  "--muted-foreground": "240 5% 65%",
  "--accent": "240 4% 16%",
  "--accent-foreground": "0 0% 95%",
  "--destructive": "0 63% 31%",
  "--destructive-foreground": "0 0% 95%",
  "--border": "240 4% 16%",
  "--input": "240 4% 16%",
  "--ring": "142 76% 36%"
} as React.CSSProperties;

// ── Previews (mimic CollectionPage exactly) ──
function FormLivePreview({ fields, displayName, brandColor, isDark, isMobile }: { fields: FormField[]; displayName: string; brandColor: string; isDark: boolean; isMobile: boolean }) {
  const accent = brandColor || "#18181b";
  // Filter out author details (name, email) from the main review fields to mimic CollectionPage layout
  const authorFields = fields.filter(f => f.type === 'name' || f.type === 'email');
  const reviewFields = fields.filter(f => f.type !== 'name' && f.type !== 'email');

  return (
    <div className="w-full h-full flex flex-col antialiased overflow-hidden">
      <div className="flex-1 flex flex-col bg-background text-foreground relative z-10 transition-colors duration-300 shadow-2xl rounded-3xl overflow-hidden border border-border/50">
        
        {/* Subtle background grid from CollectionPage */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
          style={{ backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} 
        />

        {/* Header */}
        <header className="shrink-0 flex items-center justify-center px-5 h-14 border-b border-border/50 bg-card/10 relative z-10">
           <span className="text-sm font-bold text-foreground">{displayName || "Workspace"}</span>
        </header>

        {/* Form Body Layout */}
        <div className={`flex-1 flex relative z-10 overflow-y-auto ${isMobile ? "flex-col" : "flex-col md:flex-row"}`}>
          
          {/* LEFT: Review Content */}
          <div className={`flex flex-col p-6 flex-1 gap-5 border-border/50 ${isMobile ? "border-b" : "border-b md:border-b-0 md:border-r"}`}>
            {reviewFields.map(field => {
               if (field.type === 'rating') {
                  return (
                    <div key={field.id} className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className="w-8 h-8 transition-colors" style={{ fill: accent, color: accent }} strokeWidth={2} />
                        ))}
                      </div>
                    </div>
                  );
               }
               if (field.type === 'video') {
                  return (
                    <div key={field.id} className="w-full h-32 rounded-xl border border-dashed border-border/50 bg-card/20 flex flex-col items-center justify-center gap-2">
                       <Video className="w-6 h-6 text-muted-foreground/40" />
                       <span className="text-xs font-medium text-muted-foreground">Video response</span>
                    </div>
                  );
               }
               return (
                 <div key={field.id} className="flex flex-col relative flex-1 min-h-[120px] gap-2">
                    <textarea 
                      readOnly 
                      placeholder={field.label} 
                      className="w-full h-full text-lg font-medium text-foreground bg-transparent outline-none resize-none placeholder:text-muted-foreground/30 leading-relaxed" 
                    />
                 </div>
               );
            })}
          </div>

          {/* RIGHT: Author Details + CTA */}
          <div className={`flex flex-col justify-between p-6 shrink-0 gap-6 bg-card/20 backdrop-blur-sm ${isMobile ? "w-full" : "md:w-[320px]"}`}>
             <div className="flex flex-col gap-4">
                {authorFields.map(field => (
                   <div key={field.id} className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                      </label>
                      <div className="h-10 w-full rounded-lg border border-border bg-card/50 px-3 flex items-center">
                         <span className="text-xs text-muted-foreground/30">Input {field.type}</span>
                      </div>
                   </div>
                ))}
             </div>

             <div className="flex flex-col gap-4">
               <label className="flex items-start gap-3 opacity-60 pointer-events-none">
                  <div className="mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 border-border" />
                  <span className="text-[10px] text-muted-foreground leading-relaxed">
                    I confirm this review is honest.
                  </span>
               </label>
               <div className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg opacity-80" style={{ backgroundColor: accent }}>
                  Post Review <Send className="w-4 h-4" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThankYouPreview({ config, brandColor, isDark }: { config: ThankYouConfig; brandColor: string; isDark: boolean }) {
  const accent = brandColor || "#18181b";
  return (
    <div className="w-full h-full flex flex-col antialiased">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-background rounded-3xl overflow-hidden border border-border/50 shadow-2xl relative">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative z-10" style={{ backgroundColor: accent }}>
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
        <div className="text-center relative z-10 px-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">{config.message || "Thank you!"}</h1>
          <p className="text-sm text-muted-foreground">Your review is in — we really appreciate it.</p>
        </div>
        {config.ctaText && (
          <span className="text-xs font-semibold text-primary/60 underline underline-offset-4 relative z-10">
            {config.ctaText}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──
export default function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const isCreating = id === "new";
  
  // States
  const [loading, setLoading] = useState(!isCreating);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [thankYou, setThankYou] = useState<ThankYouConfig>(defaultThankYou);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  
  // Preview settings
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewDark, setPreviewDark] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  
  // Base data
  useEffect(() => {
    if (isCreating) return;
    const fetchSpace = async () => {
      try {
        const { data, error } = await supabase.from("spaces").select("*").eq("id", id).single();
        if (error) throw error;
        setName(data.name);
        setSlug(data.slug);
        setIsActive(data.is_active);
        const config = data.form_config as any;
        setFields(config?.formFields || defaultFields);
        setThankYou(config?.thankYouConfig || defaultThankYou);
      } catch (err: any) {
        toast({ title: "Error loading space", description: err.message, variant: "destructive" });
        navigate("/dashboard/spaces");
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id, isCreating, navigate, toast]);

  // Actions
  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    
    // Generate slug if empty
    let finalSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "");
    if (!finalSlug) {
      finalSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).substring(2, 6);
    }

    try {
      if (isCreating) {
        await apiCreateSpace({
          name,
          slug: finalSlug,
          is_active: isActive,
          form_config: { formFields: fields, thankYouConfig: thankYou },
          user_id: user!.id,
          plan: (profile?.plan || "free").toLowerCase(),
        });
        toast({ title: "Collector created", description: "Your collection page is ready to go." });
        navigate("/dashboard/spaces");
      } else {
        await apiUpdateSpace(id!, {
          name,
          slug: finalSlug,
          is_active: isActive,
          form_config: { formFields: fields, thankYouConfig: thankYou },
        });
        toast({ title: "Collector updated" });
      }
    } catch (err: any) {
      toast({ title: "Error saving", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addField = () => {
    setFields([...fields, { id: crypto.randomUUID(), type: "custom", label: "New Question", required: false }]);
  };
  const removeField = (id: string) => setFields(fields.filter(f => f.id !== id));
  const updateField = (id: string, updates: Partial<FormField>) => setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));

  // Drag logic
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...fields];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    setFields(updated);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  if (loading) return (
    <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
    </div>
  );

  const brandColor = profile?.brand_color || "#18181b";
  const displayTitle = name || "New Collector";

  return (
    <div className="h-[100svh] w-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
      
      {/* ── Navbar ── */}
      <header className="h-16 shrink-0 bg-card/40 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted" onClick={() => navigate("/dashboard/spaces")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-5 w-[1px] bg-border hidden sm:block" />
          <div className="flex flex-col">
            <h1 className="text-[13px] font-bold text-foreground tracking-tight">{displayTitle}</h1>
            <p className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase mt-0.5">Collector Builder</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-muted/60 p-1 rounded-lg">
            <button onClick={() => setPreviewMode("desktop")} className={`p-1.5 rounded-md transition-all ${previewMode === "desktop" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
               <Monitor className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setPreviewMode("mobile")} className={`p-1.5 rounded-md transition-all ${previewMode === "mobile" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
               <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="hidden sm:flex items-center bg-muted/60 p-1 rounded-lg">
            <button onClick={() => setPreviewDark(false)} className={`p-1.5 rounded-md transition-all ${!previewDark ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
               <Sun className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setPreviewDark(true)} className={`p-1.5 rounded-md transition-all ${previewDark ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
               <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="hidden sm:block h-5 w-[1px] bg-border mx-1" />
          
          <Button className="h-9 text-xs font-bold gap-1.5" onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {isCreating ? "Publish Collector" : "Save Changes"}
          </Button>
        </div>
      </header>

      {/* ── Workspace ── */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Editor Panel */}
        <aside className="w-[400px] shrink-0 bg-card/30 border-r border-border flex flex-col h-full z-10 relative backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
            <div className="px-6 pt-5 pb-3 border-b border-border/50 shrink-0">
              <TabsList className="w-full h-10 p-1 bg-muted/50 grid grid-cols-3">
                <TabsTrigger value="general" className="text-[11px] font-bold uppercase tracking-widest rounded-md">General</TabsTrigger>
                <TabsTrigger value="form" className="text-[11px] font-bold uppercase tracking-widest rounded-md">Form</TabsTrigger>
                <TabsTrigger value="thankyou" className="text-[11px] font-bold uppercase tracking-widest rounded-md">Success</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              
              <TabsContent value="general" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-8">
                  <div>
                      <h3 className="text-sm font-bold text-foreground mb-1 tracking-tight">Core Identity</h3>
                      <p className="text-xs text-muted-foreground mb-5">Set the fundamental details of your collector.</p>
                      
                      <div className="space-y-5">
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Space Name <span className="text-destructive">*</span></Label>
                           <Input className="h-10 text-sm bg-background border-border" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Product Feedback" autoFocus={isCreating} />
                        </div>
                        
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">URL Slug</Label>
                           <div className="flex items-center">
                              <span className="h-10 px-3 bg-muted border border-r-0 border-border text-muted-foreground text-sm font-mono flex items-center rounded-l-lg select-none">/collect/</span>
                              <Input className="h-10 text-sm rounded-l-none font-mono bg-background border-border focus:border-primary" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))} placeholder="my-collection" />
                           </div>
                        </div>
                      </div>
                  </div>

                  <div className="h-[1px] bg-border/50" />

                  <div>
                     <h3 className="text-sm font-bold text-foreground mb-4 tracking-tight">Availability</h3>
                     <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                        <div>
                           <p className="text-[13px] font-bold text-foreground">Accepting Submissions</p>
                           <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Toggle to close this collector.</p>
                        </div>
                        <Switch checked={isActive} onCheckedChange={setIsActive} />
                     </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="form" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <div className="flex items-center justify-between mb-5">
                       <div>
                          <h3 className="text-sm font-bold text-foreground tracking-tight">Form Structure</h3>
                          <p className="text-xs text-muted-foreground">Build the data collection flow.</p>
                       </div>
                       <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-bold bg-background shadow-xs hover:bg-muted" onClick={addField}>
                          <Plus className="h-3 w-3" /> Add Field
                       </Button>
                    </div>

                    <div className="space-y-3">
                       {fields.map((field, idx) => (
                           <div
                             key={field.id}
                             draggable
                             onDragStart={() => handleDragStart(idx)}
                             onDragOver={e => handleDragOver(e, idx)}
                             onDragEnd={handleDragEnd}
                             className={`group relative pl-8 pr-3 py-3 rounded-xl border bg-card transition-all ${dragIdx === idx ? "opacity-50 scale-[0.98] border-primary" : "border-border hover:border-border/80"}`}
                           >
                              {/* Drag handle */}
                              <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                                 <GripVertical className="h-4 w-4" />
                              </div>

                              <div className="flex flex-col gap-3">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0 text-muted-foreground border border-border/50">
                                       {fieldTypeIcons[field.type]}
                                    </div>
                                    <Input className="h-8 text-xs font-bold px-2 bg-transparent border-transparent hover:border-border focus:bg-background focus:border-primary transition-all shadow-none" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} />
                                 </div>
                                 
                                 <div className="flex items-center gap-3 pl-8">
                                    <Select value={field.type} onValueChange={v => updateField(field.id, { type: v as FormField["type"] })}>
                                      <SelectTrigger className="h-8 w-[110px] text-[11px] font-semibold bg-background border-border">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="name">Name Input</SelectItem>
                                        <SelectItem value="email">Email Input</SelectItem>
                                        <SelectItem value="rating">Star Rating</SelectItem>
                                        <SelectItem value="text">Long Text</SelectItem>
                                        <SelectItem value="video">Video Upload</SelectItem>
                                        <SelectItem value="custom">Short Text</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    <div className="flex-1 flex items-center justify-between pl-1">
                                       <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest cursor-pointer select-none">
                                         <Switch className="scale-[0.7] origin-left data-[state=checked]:bg-primary" checked={field.required} onCheckedChange={v => updateField(field.id, { required: v })} />
                                         Req
                                       </label>
                                       
                                       <button className="text-muted-foreground/50 hover:text-destructive p-1.5 rounded-md hover:bg-destructive/10 transition-colors" onClick={() => removeField(field.id)}>
                                          <Trash2 className="h-3.5 w-3.5" />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                       ))}
                    </div>
                 </div>
              </TabsContent>

              <TabsContent value="thankyou" className="mt-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight mb-1">Post-Submission</h3>
                    <p className="text-xs text-muted-foreground mb-6">What users see after completion.</p>

                    <div className="space-y-6">
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Display Message <span className="text-destructive">*</span></Label>
                           <Textarea className="min-h-[100px] text-sm bg-background border-border resize-none" value={thankYou.message} onChange={e => setThankYou({ ...thankYou, message: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">CTA Button Label</Label>
                           <Input className="h-10 text-sm bg-background border-border" value={thankYou.ctaText} onChange={e => setThankYou({ ...thankYou, ctaText: e.target.value })} placeholder="e.g. Back to Website" />
                        </div>

                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Redirect Link <span className="opacity-50">(Optional)</span></Label>
                           <Input className="h-10 text-sm bg-background border-border" value={thankYou.redirectUrl} onChange={e => setThankYou({ ...thankYou, redirectUrl: e.target.value })} placeholder="https://..." />
                        </div>
                    </div>
                 </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Right Side: Live Canvas Preview */}
        <div className="flex-1 bg-muted/30 relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
            
            {/* Soft grid background */}
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none" 
              style={{ backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} 
            />

            {/* Preview Container Wrapper */}
            <div className={`relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl rounded-[2.5rem] bg-background border border-border overflow-hidden z-10 ${previewMode === 'mobile' ? 'w-[360px] h-[720px] ring-8 ring-primary/5' : 'w-full max-w-[900px] h-[90%] min-h-[500px]'}`} style={previewDark ? darkVariables : lightVariables}>
                
                {/* Real Form Render Simulation */}
                <div className="w-full h-full relative overflow-hidden">
                   {activeTab === "thankyou" ? (
                       <ThankYouPreview config={thankYou} brandColor={brandColor} isDark={previewDark} />
                   ) : (
                       <FormLivePreview fields={fields} displayName={displayTitle} brandColor={brandColor} isDark={previewDark} isMobile={previewMode === 'mobile'} />
                   )}
                </div>

            </div>

            {/* Floating indicator */}
            <div className="hidden sm:flex fixed bottom-6 right-6 bg-card/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm text-[9px] font-bold text-muted-foreground uppercase tracking-widest items-center gap-2 pointer-events-none z-50">
               <Eye className="w-3.5 h-3.5" /> High-Fidelity Render
            </div>

        </div>
      </main>
      
      {/* Global styles for custom scrollbar embedded */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: hsl(var(--border)); border-radius: 20px; }
      `}</style>
    </div>
  );
}
