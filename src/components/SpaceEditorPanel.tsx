import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, GripVertical, Trash2, Star, Type, Video, Mail, User, MessageSquare } from "lucide-react";

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

export default function SpaceEditorPanel({ open, onOpenChange, space, onSave }: SpaceEditorProps) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [thankYou, setThankYou] = useState<ThankYouConfig>(defaultThankYou);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Sync state when space changes
  const [loadedId, setLoadedId] = useState<string | null>(null);
  if (space && space.id !== loadedId) {
    setLoadedId(space.id);
    setName(space.name);
    setIsActive(space.isActive);
    setFields(space.formConfig?.formFields ?? defaultFields);
    setThankYou(space.formConfig?.thankYouConfig ?? defaultThankYou);
  }

  if (!space) return null;

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
    onSave(space.id, {
      name,
      isActive,
      formConfig: { formFields: fields, thankYouConfig: thankYou },
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 pt-6 pb-4">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${space.accentGradient} flex items-center justify-center`}>
                <span className="text-[10px] font-bold text-primary-foreground">{space.initial}</span>
              </div>
              <div>
                <SheetTitle className="text-[15px]">Edit Space</SheetTitle>
                <SheetDescription className="text-2xs">{space.slug}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <Tabs defaultValue="general" className="flex flex-col h-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full h-9 text-xs">
              <TabsTrigger value="general" className="flex-1 text-xs">General</TabsTrigger>
              <TabsTrigger value="form" className="flex-1 text-xs">Form Builder</TabsTrigger>
              <TabsTrigger value="thankyou" className="flex-1 text-xs">Thank You</TabsTrigger>
            </TabsList>
          </div>

          {/* ── General ── */}
          <TabsContent value="general" className="px-6 py-5 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Space Name</Label>
              <Input className="h-9 text-[13px]" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-[13px] font-medium text-foreground">Active</p>
                <p className="text-2xs text-muted-foreground">Accept new submissions</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Collection URL Slug</Label>
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border px-3 py-2">
                <span className="text-2xs text-muted-foreground font-mono">/collect/{space.slug}</span>
              </div>
              <p className="text-2xs text-muted-foreground">Auto-generated from name</p>
            </div>
          </TabsContent>

          {/* ── Form Builder ── */}
          <TabsContent value="form" className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-foreground">Form Fields</p>
              <Button size="sm" variant="outline" className="h-7 text-2xs gap-1" onClick={addField}>
                <Plus className="h-3 w-3" /> Add Field
              </Button>
            </div>

            {/* Field list */}
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
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
                        onChange={e => updateField(field.id, { label: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={field.type} onValueChange={v => updateField(field.id, { type: v as FormField["type"] })}>
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
                        <Switch className="scale-75" checked={field.required} onCheckedChange={v => updateField(field.id, { required: v })} />
                        Required
                      </label>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 mt-1"
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Mini Preview */}
            <div className="mt-6">
              <p className="text-2xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Live Preview</p>
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
                {fields.map(field => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground">
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </label>
                    {field.type === "rating" ? (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="h-4 w-4 text-muted-foreground/30" />
                        ))}
                      </div>
                    ) : field.type === "video" ? (
                      <div className="h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                        <span className="text-2xs text-muted-foreground">Record or upload video</span>
                      </div>
                    ) : field.type === "text" || field.type === "custom" ? (
                      <div className="h-12 rounded-md border border-border bg-background" />
                    ) : (
                      <div className="h-8 rounded-md border border-border bg-background" />
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <div className="h-8 w-full rounded-md bg-primary/20" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Thank You ── */}
          <TabsContent value="thankyou" className="px-6 py-5 space-y-5">
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

            {/* Mini preview */}
            <div>
              <p className="text-2xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Preview</p>
              <div className="rounded-xl border border-border bg-muted/30 p-8 text-center space-y-3">
                <p className="text-[14px] font-medium text-foreground">{thankYou.message || "Thank you!"}</p>
                {thankYou.ctaText && (
                  <div className="h-9 w-40 mx-auto rounded-md bg-primary/20 flex items-center justify-center">
                    <span className="text-2xs text-primary font-medium">{thankYou.ctaText}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer save */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="h-8 text-xs" onClick={handleSave}>Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
