import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MessageSquareText, CheckCircle2, Wand2, Loader2, ChevronDown } from "lucide-react";
import VideoRecorder from "@/components/collection/VideoRecorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SpaceData {
  id: string;
  name: string;
  slug: string;
  form_config: any;
  user_id: string;
  isPaid?: boolean;
  profiles?: {
    company_name: string | null;
    brand_color: string | null;
    logo_url: string | null;
  };
}

// Refine options for AI text enhancement
const REFINE_OPTIONS = [
  { key: "shorten", label: "Shorter" },
  { key: "medium", label: "Medium" },
  { key: "long", label: "Longer" },
  { key: "grammar", label: "Fix Grammar" },
  { key: "recommend", label: "✨ Best Version" },
];

export default function CollectionPage() {
  const { slug } = useParams();
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<"choose" | "text" | "video" | "success">("choose");
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // AI state per text field
  const [refining, setRefining] = useState<{ fieldId: string; style: string } | null>(null);
  const [showRefineFor, setShowRefineFor] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpace() {
      try {
        const { data: spaceData, error: spaceErr } = await supabase
          .from("spaces")
          .select("id, name, slug, form_config, user_id")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();
        if (spaceErr || !spaceData) {
          setNotFound(true);
        } else {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("company_name, brand_color, logo_url")
            .eq("user_id", spaceData.user_id)
            .single();

          const isPaid = false; // Plan check removed - plan column doesn't exist yet
          const space = { ...spaceData, profiles: profileData, isPaid } as unknown as SpaceData;
          setSpace(space);

          const config = space.form_config;
          if (config?.allowVideo && !config?.allowText) setMode("video");
          else if (!config?.allowVideo && config?.allowText) setMode("text");
          else if (!config?.allowVideo && !config?.allowText) setMode("text");
          else setMode("choose");

          const initialValues: Record<string, any> = {};
          config?.formFields?.forEach((f: any) => {
            initialValues[f.id] = f.type === "rating" ? 5 : "";
          });
          setFormValues(initialValues);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadSpace();
  }, [slug]);

  const accentColor = space?.profiles?.brand_color || "#3b82f6";
  const workspaceName = space?.profiles?.company_name || "Testimonial";
  const logoUrl = space?.profiles?.logo_url;
  const isPaidSpace = space?.isPaid || false;

  const thankYouConfig = space?.form_config?.thankYouConfig || {
    message: "Thank you for your feedback! 🎉",
    ctaText: "",
    redirectUrl: "",
  };

  // ── AI Text Refinement ─────────────────────────────────────────────────
  const refineText = async (fieldId: string, style: string) => {
    const currentText = formValues[fieldId];
    if (!currentText?.trim() || !space) return;

    setRefining({ fieldId, style });
    setShowRefineFor(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-processor", {
        body: {
          action: "enhance_text",
          text: currentText,
          style,
          spaceOwnerId: space.user_id,
        },
      });
      // Supabase returns error object for non-2xx, actual body in data even on errors
      const actualError = data?.error || error?.message;
      if (actualError) throw new Error(actualError);
      if (!data?.result) throw new Error("No result returned from AI");
      setFormValues(prev => ({ ...prev, [fieldId]: data.result }));
    } catch (err: any) {
      toast({ title: "AI Error", description: err.message, variant: "destructive" });
    } finally {
      setRefining(null);
    }
  };

  // ── Text Form Submission ───────────────────────────────────────────────
  const submitText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;
    setSubmitting(true);

    try {
      const payload: any = {
        space_id: space.id,
        user_id: space.user_id,
        type: "text",
        extra_fields: {},
        author_name: "Anonymous",
        content: "(no content)",
      };

      space.form_config.formFields.forEach((f: any) => {
        const val = formValues[f.id];
        if (f.type === "name") payload.author_name = val;
        else if (f.type === "email") payload.author_email = val;
        else if (f.type === "rating") payload.rating = val;
        else if (f.type === "text") payload.content = val;
        else payload.extra_fields[f.label] = val;
      });

      const { error } = await supabase.from("testimonials").insert(payload);
      if (error) throw error;

      setMode("success");

      if (thankYouConfig.redirectUrl) {
        setTimeout(() => {
          window.location.href = thankYouConfig.redirectUrl.startsWith("http")
            ? thankYouConfig.redirectUrl
            : `https://${thankYouConfig.redirectUrl}`;
        }, 3000);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Page not found</h1>
          <p className="text-sm text-muted-foreground">This collection page doesn't exist or is no longer active.</p>
        </div>
      </div>
    );
  }

  const fields = space?.form_config?.formFields || [];

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-xl mx-auto mb-4 object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center vouchy-gradient-bg p-2 shadow-sm border border-white/10 hover:scale-105 transition-transform">
              <img src="/src/assets/logo-icon-white.svg" alt="Vouchy Logo Icon" className="h-7 w-7" />
            </div>
          )}
          <h1 className="text-xl font-bold text-foreground">{workspaceName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{space?.name}</p>
        </div>

        <AnimatePresence mode="wait">

          {/* Mode: Choose */}
          {mode === "choose" && (
            <motion.div key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary" onClick={() => setMode("video")}>
                <CardContent className="p-8 text-center">
                  <Video className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Record Video</h3>
                  <p className="text-xs text-muted-foreground mt-1">Share your story on camera</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary" onClick={() => setMode("text")}>
                <CardContent className="p-8 text-center">
                  <MessageSquareText className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Write Text</h3>
                  <p className="text-xs text-muted-foreground mt-1">Type your testimonial</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mode: Text Form */}
          {mode === "text" && (
            <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={submitText} className="space-y-5">
                    {fields.map((field: any) => (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-[13px] font-medium text-foreground">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>

                          {/* AI Refine button — only for text fields, paid spaces */}
                          {isPaidSpace && (field.type === "text" || field.type === "custom") && (
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowRefineFor(showRefineFor === field.id ? null : field.id)}
                                className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full text-primary border border-primary/30 hover:bg-primary/10 transition-all"
                              >
                                <Wand2 className="h-2.5 w-2.5" />
                                AI Refine
                                <ChevronDown className="h-2.5 w-2.5" />
                              </button>

                              <AnimatePresence>
                                {showRefineFor === field.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                    className="absolute right-0 top-8 z-20 w-36 bg-popover border border-border rounded-xl shadow-xl overflow-hidden"
                                  >
                                    {REFINE_OPTIONS.map(opt => (
                                      <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => refineText(field.id, opt.key)}
                                        disabled={!!refining}
                                        className="w-full px-3 py-2 text-left text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>

                        {/* Refining spinner overlay */}
                        {refining?.fieldId === field.id ? (
                          <div className="relative">
                            <Textarea value={formValues[field.id] || ""} rows={4} readOnly
                              className="text-[13px] rounded-xl border-border opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
                              <div className="flex items-center gap-2 text-[12px] text-primary font-medium">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Refining with AI...
                              </div>
                            </div>
                          </div>
                        ) : field.type === "rating" ? (
                          <div className="flex gap-1 py-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button key={i} type="button"
                                onClick={() => setFormValues({ ...formValues, [field.id]: i + 1 })}
                                className="transition-transform hover:scale-110">
                                <Star className={`h-7 w-7 transition-colors ${i < (formValues[field.id] || 0) ? "fill-yellow-400 text-yellow-400" : "text-border hover:text-yellow-300"}`} />
                              </button>
                            ))}
                          </div>
                        ) : field.type === "text" || field.type === "custom" ? (
                          <Textarea
                            placeholder={`Your ${field.label.toLowerCase()}...`}
                            rows={4}
                            value={formValues[field.id] || ""}
                            onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                            required={field.required}
                            className="text-[13px] rounded-xl border-border"
                          />
                        ) : (
                          <Input
                            type={field.type === "email" ? "email" : "text"}
                            placeholder={field.label}
                            value={formValues[field.id] || ""}
                            onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                            required={field.required}
                            className="h-10 text-[13px] rounded-xl border-border"
                          />
                        )}
                      </div>
                    ))}

                    <div className="flex gap-3 pt-2">
                      {space?.form_config?.allowVideo && space?.form_config?.allowText && (
                        <Button type="button" variant="outline" onClick={() => setMode("choose")} className="flex-1 h-10 rounded-xl text-xs font-semibold">
                          Back
                        </Button>
                      )}
                      <Button type="submit" className="flex-1 h-10 rounded-xl text-xs font-semibold" disabled={submitting} style={{ backgroundColor: accentColor }}>
                        {submitting ? "Submitting..." : "Submit Testimonial"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mode: Video */}
          {mode === "video" && (
            <motion.div key="video" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <VideoRecorder
                spaceId={space!.id}
                spaceUserId={space!.user_id}
                accentColor={accentColor}
                formFields={fields}
                isPaidSpace={isPaidSpace}
                onBack={space?.form_config?.allowVideo && space?.form_config?.allowText ? () => setMode("choose") : undefined as any}
                onSuccess={() => setMode("success")}
              />
            </motion.div>
          )}

          {/* Mode: Success */}
          {mode === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card>
                <CardContent className="p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}>
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: accentColor }} />
                  </motion.div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{thankYouConfig.message || "Thank you! 🎉"}</h2>
                  <p className="text-muted-foreground mb-6">Your testimonial has been submitted successfully.</p>

                  {thankYouConfig.ctaText && (
                    <Button
                      className="px-8 rounded-xl"
                      style={{ backgroundColor: accentColor }}
                      onClick={() => {
                        if (thankYouConfig.redirectUrl) {
                          window.location.href = thankYouConfig.redirectUrl.startsWith("http")
                            ? thankYouConfig.redirectUrl
                            : `https://${thankYouConfig.redirectUrl}`;
                        } else {
                          window.location.reload();
                        }
                      }}
                    >
                      {thankYouConfig.ctaText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
