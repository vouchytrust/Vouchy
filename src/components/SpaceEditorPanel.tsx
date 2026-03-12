import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, GripVertical, Trash2, Star, Type, Video, Mail, User, MessageSquare, Send, CheckCircle2, ArrowRight } from "lucide-react";

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

interface SpaceEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  space: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    accentGradient: string;
    initial: string;
    formConfig?: SpaceFormConfig;
  } | null;
  /** If true, this is a new space being created */
  isCreating?: boolean;
  onSave: (spaceId: string, updates: { name?: string; isActive?: boolean; formConfig?: SpaceFormConfig }) => void;
}

const defaultFields: FormField[] = [
  { id: "f1", type: "name", label: "Your Name", required: true },
  { id: "f2", type: "email", label: "Email Address", required: true },
  { id: "f3", type: "rating", label: "How would you rate us?", required: true },
  { id: "f4", type: "text", label: "Your Testimonial", required: true },
];

const defaultThankYou: ThankYouConfig = {
  message: "Thank you for your feedback! 🎉",
  redirectUrl: "",
  ctaText: "Back to site",
};

const fieldTypeIcons: Record<FormField["type"], React.ReactNode> = {
  name: <User className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  rating: <Star className="h-3.5 w-3.5" />,
  text: <Type className="h-3.5 w-3.5" />,
  video: <Video className="h-3.5 w-3.5" />,
  custom: <MessageSquare className="h-3.5 w-3.5" />,
};

const fieldTypePlaceholders: Record<FormField["type"], string> = {
  name: "John Doe",
  email: "john@example.com",
  rating: "",
  text: "Write your testimonial here...",
  video: "",
  custom: "Type your answer...",
};

/* ── Live Preview Component ── */
function FormLivePreview({ fields, spaceName }: { fields: FormField[]; spaceName: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Preview header */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <MessageSquare className="h-3 w-3 text-primary" />
          </div>
          <span className="text-[11px] font-semibold text-foreground">{spaceName || "Your Space"}</span>
        </div>
        <p className="text-[10px] text-muted-foreground">We'd love to hear your feedback!</p>
      </div>

      {/* Preview form fields */}
      <div className="p-4 space-y-3">
        {fields.map(field => (
          <div key={field.id} className="space-y-1">
            <label className="text-[10px] font-medium text-foreground flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-destructive text-[9px]">*</span>}
            </label>

            {field.type === "rating" ? (
              <div className="flex gap-0.5 py-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= 3 ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`}
                  />
                ))}
              </div>
            ) : field.type === "video" ? (
              <div className="h-14 rounded-lg border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1">
                <Video className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="text-[9px] text-muted-foreground/60">Record or upload</span>
              </div>
            ) : field.type === "text" || field.type === "custom" ? (
              <div className="rounded-md border border-border bg-background px-2.5 py-2 min-h-[48px]">
                <span className="text-[10px] text-muted-foreground/40">{fieldTypePlaceholders[field.type]}</span>
              </div>
            ) : (
              <div className="rounded-md border border-border bg-background px-2.5 py-1.5 h-7 flex items-center">
                <span className="text-[10px] text-muted-foreground/40">{fieldTypePlaceholders[field.type]}</span>
              </div>
            )}
          </div>
        ))}

        {/* Submit button preview */}
        <div className="pt-1.5">
          <div className="h-7 w-full rounded-md bg-primary flex items-center justify-center gap-1.5">
            <Send className="h-2.5 w-2.5 text-primary-foreground" />
            <span className="text-[10px] font-medium text-primary-foreground">Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Thank You Preview ── */
function ThankYouPreview({ config, spaceName }: { config: ThankYouConfig; spaceName: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-8 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <p className="text-[13px] font-medium text-foreground">{config.message || "Thank you!"}</p>
        <p className="text-[10px] text-muted-foreground">Your response has been recorded.</p>
        {config.ctaText && (
          <div className="pt-1">
            <div className="h-8 w-36 mx-auto rounded-md bg-primary flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-medium text-primary-foreground">{config.ctaText}</span>
              <ArrowRight className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Field Editor Row ── */
function FieldRow({
  field,
  idx,
  dragIdx,
  onDragStart,
  onDragOver,
  onDragEnd,
  onUpdate,
  onRemove,
}: {
  field: FormField;
  idx: number;
  dragIdx: number | null;
  onDragStart: (idx: number) => void;
  onDragOver: (e: React.DragEvent, idx: number) => void;
  onDragEnd: () => void;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(idx)}
      onDragOver={e => onDragOver(e, idx)}
      onDragEnd={onDragEnd}
      className={`group flex items-start gap-2 rounded-lg border border-border bg-card p-3 transition-all ${dragIdx === idx ? "opacity-50 scale-[0.98]" : ""}`}
    >
      <button className="mt-1.5 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{fieldTypeIcons[field.type]}</span>
          <Input
            className="h-7 text-[12px] flex-1"
            value={field.label}
            onChange={e => onUpdate(field.id, { label: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={field.type} onValueChange={v => onUpdate(field.id, { type: v as FormField["type"] })}>
            <SelectTrigger className="h-7 w-28 text-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <label className="flex items-center gap-1.5 text-2xs text-muted-foreground cursor-pointer">
            <Switch className="scale-75" checked={field.required} onCheckedChange={v => onUpdate(field.id, { required: v })} />
            Required
          </label>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 mt-1"
        onClick={() => onRemove(field.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

/* ── Main Editor Panel ── */
export default function SpaceEditorPanel({ open, onOpenChange, space, isCreating, onSave }: SpaceEditorProps) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [thankYou, setThankYou] = useState<ThankYouConfig>(defaultThankYou);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // Sync state when space changes
  const [loadedId, setLoadedId] = useState<string | null>(null);
  if (space && space.id !== loadedId) {
    setLoadedId(space.id);
    setName(space.name);
    setIsActive(space.isActive);
    setFields(space.formConfig?.formFields ?? defaultFields);
    setThankYou(space.formConfig?.thankYouConfig ?? defaultThankYou);
    setActiveTab("general");
  }

  // Reset when opening for creation
  useEffect(() => {
    if (isCreating && open) {
      setLoadedId(null);
      setName("");
      setIsActive(true);
      setFields([...defaultFields]);
      setThankYou({ ...defaultThankYou });
      setActiveTab("general");
    }
  }, [isCreating, open]);

  if (!space && !isCreating) return null;

  const addField = () => {
    setFields([...fields, {
      id: crypto.randomUUID(),
      type: "custom",
      label: "New Question",
      required: false,
    }]);
  };

  const removeField = (id: string) => setFields(fields.filter(f => f.id !== id));

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

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

  const handleSave = () => {
    if (!name.trim()) return;
    const spaceId = space?.id ?? crypto.randomUUID();
    onSave(spaceId, {
      name,
      isActive,
      formConfig: { formFields: fields, thankYouConfig: thankYou },
    });
    onOpenChange(false);
  };

  const displayName = name || space?.name || "New Space";
  const displayInitial = space?.initial ?? (name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "NS");
  const displayGradient = space?.accentGradient ?? "from-primary to-chart-3";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 pt-6 pb-4">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${displayGradient} flex items-center justify-center`}>
                <span className="text-[10px] font-bold text-primary-foreground">{displayInitial}</span>
              </div>
              <div>
                <SheetTitle className="text-[15px]">{isCreating ? "Create Space" : "Edit Space"}</SheetTitle>
                <SheetDescription className="text-2xs">
                  {isCreating ? "Set up your collection page" : space?.slug}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="w-full h-9 text-xs">
              <TabsTrigger value="general" className="flex-1 text-xs">General</TabsTrigger>
              <TabsTrigger value="form" className="flex-1 text-xs">Form Builder</TabsTrigger>
              <TabsTrigger value="thankyou" className="flex-1 text-xs">Thank You</TabsTrigger>
            </TabsList>
          </div>

          {/* ── General ── */}
          <TabsContent value="general" className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Space Name</Label>
              <Input
                className="h-9 text-[13px]"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Product Feedback"
                autoFocus={isCreating}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-[13px] font-medium text-foreground">Active</p>
                <p className="text-2xs text-muted-foreground">Accept new submissions</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            {!isCreating && space && (
              <div className="space-y-1.5">
                <Label className="text-[13px]">Collection URL Slug</Label>
                <div className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border px-3 py-2">
                  <span className="text-2xs text-muted-foreground font-mono">/collect/{space.slug}</span>
                </div>
                <p className="text-2xs text-muted-foreground">Auto-generated from name</p>
              </div>
            )}
          </TabsContent>

          {/* ── Form Builder ── */}
          <TabsContent value="form" className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-5">
              {/* Left: live preview (Desktop: Left, Mobile: Bottom) */}
              <div className="space-y-4 lg:space-y-2 order-last lg:order-first">
                <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Live Preview</p>
                <FormLivePreview fields={fields} spaceName={displayName} />
              </div>

              {/* Right: field config (Desktop: Right, Mobile: Top) */}
              <div className="space-y-3 order-first lg:order-last">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-foreground">Fields</p>
                  <Button size="sm" variant="outline" className="h-7 text-2xs gap-1" onClick={addField}>
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {fields.map((field, idx) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      idx={idx}
                      dragIdx={dragIdx}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      onUpdate={updateField}
                      onRemove={removeField}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Thank You ── */}
          <TabsContent value="thankyou" className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-5">
                {/* Left: Preview (Desktop: Left, Mobile: Bottom) */}
                <div className="space-y-4 lg:space-y-2 order-last lg:order-first">
                  <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
                  <ThankYouPreview config={thankYou} spaceName={displayName} />
                </div>

                {/* Right: Config (Desktop: Right, Mobile: Top) */}
                <div className="space-y-4 order-first lg:order-last">
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">Thank You Message</Label>
                    <Textarea
                      className="text-[13px] min-h-[80px]"
                      value={thankYou.message}
                      onChange={e => setThankYou({ ...thankYou, message: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">CTA Button Text</Label>
                    <Input className="h-9 text-[13px]" value={thankYou.ctaText} onChange={e => setThankYou({ ...thankYou, ctaText: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px]">Redirect URL <span className="text-muted-foreground">(optional)</span></Label>
                    <Input className="h-9 text-[13px]" placeholder="https://yoursite.com" value={thankYou.redirectUrl} onChange={e => setThankYou({ ...thankYou, redirectUrl: e.target.value })} />
                    <p className="text-2xs text-muted-foreground">Where to send users after submitting</p>
                  </div>
                </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer save */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="h-8 text-xs" onClick={handleSave} disabled={!name.trim()}>
            {isCreating ? "Create Space" : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
