import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MessageSquareText, CheckCircle2, Upload } from "lucide-react";
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
  profiles?: {
    company_name: string | null;
    brand_color: string | null;
    logo_url: string | null;
  };
}

export default function CollectionPage() {
  const { slug } = useParams();
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<"choose" | "text" | "video" | "success">("choose");
  const [form, setForm] = useState({ name: "", email: "", company: "", title: "", content: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSpace() {
      try {
        const { data, error } = await supabase
          .from("spaces")
          .select("id, name, slug, form_config, user_id, profiles:user_id(company_name, brand_color, logo_url)")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();
        if (error || !data) {
          setNotFound(true);
        } else {
          setSpace(data as unknown as SpaceData);
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

  const questions = space?.form_config?.formFields
    ?.filter((f: any) => f.type === "custom" || f.type === "text")
    ?.map((f: any) => f.label) || [];

  const thankYouConfig = space?.form_config?.thankYouConfig || {
    message: "Thank you for your feedback! 🎉",
    ctaText: "",
  };

  const submitText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!space) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from("testimonials").insert({
        space_id: space.id,
        user_id: space.user_id,
        author_name: form.name,
        author_email: form.email || null,
        author_company: form.company || null,
        author_title: form.title || null,
        content: form.content,
        rating: form.rating,
        type: "text",
      });
      if (error) throw error;
      setMode("success");
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

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-xl mx-auto mb-4 object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accentColor }}>
              <Star className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <h1 className="text-xl font-bold text-foreground">{workspaceName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{space?.name}</p>
        </div>

        <AnimatePresence mode="wait">
          {mode === "choose" && (
            <motion.div key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:vouchy-shadow-md transition-shadow border-2 hover:border-primary" onClick={() => setMode("video")}>
                <CardContent className="p-8 text-center">
                  <Video className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Record Video</h3>
                  <p className="text-xs text-muted-foreground mt-1">Share your story on camera</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:vouchy-shadow-md transition-shadow border-2 hover:border-primary" onClick={() => setMode("text")}>
                <CardContent className="p-8 text-center">
                  <MessageSquareText className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">Write Text</h3>
                  <p className="text-xs text-muted-foreground mt-1">Type your testimonial</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === "text" && (
            <motion.div key="text" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={submitText} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input className="mt-1" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input className="mt-1" type="email" placeholder="jane@co.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Company</Label>
                        <Input className="mt-1" placeholder="Acme Inc." value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input className="mt-1" placeholder="CEO" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                      </div>
                    </div>

                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} type="button" onClick={() => setForm({ ...form, rating: i + 1 })}>
                            <Star className={`h-6 w-6 transition-colors ${i < form.rating ? "fill-vouchy-warning text-vouchy-warning" : "text-border hover:text-vouchy-warning/50"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Your testimonial *</Label>
                      {questions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                          {questions.map((q: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{q}</span>
                          ))}
                        </div>
                      )}
                      <Textarea placeholder="Share your experience..." rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setMode("choose")} className="flex-1">Back</Button>
                      <Button type="submit" className="flex-1" disabled={submitting} style={{ backgroundColor: accentColor }}>
                        {submitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === "video" && (
            <motion.div key="video" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="aspect-video bg-foreground/5 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-border">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                      <p className="text-xs text-muted-foreground mt-1">Video recording requires camera permissions</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setMode("choose")} className="flex-1">Back</Button>
                    <Button className="flex-1" style={{ backgroundColor: accentColor }}>
                      <Video className="h-4 w-4 mr-2" /> Start Recording
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card>
                <CardContent className="p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}>
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: accentColor }} />
                  </motion.div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{thankYouConfig.message || "Thank you! 🎉"}</h2>
                  <p className="text-muted-foreground">Your testimonial has been submitted successfully.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
