import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Video, MessageSquareText, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const mockSpace = {
  name: "Product Feedback",
  workspaceName: "Acme Inc.",
  accentColor: "#3b82f6",
  questions: [
    "How has our product helped you?",
    "What would you tell others about us?",
    "What's the biggest benefit you've experienced?",
    "Any suggestions for improvement?",
  ],
  successTitle: "Thank you! 🎉",
  successMessage: "Your testimonial has been submitted successfully. We appreciate your feedback!",
};

export default function CollectionPage() {
  const { slug } = useParams();
  const [mode, setMode] = useState<"choose" | "text" | "video" | "success">("choose");
  const [form, setForm] = useState({ name: "", email: "", company: "", title: "", content: "", rating: 5 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitText = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode("success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: mockSpace.accentColor }}>
            <Star className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{mockSpace.workspaceName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockSpace.name}</p>
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

                    {/* Rating */}
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} type="button" onClick={() => setForm({ ...form, rating: i + 1 })}>
                            <Star className={`h-6 w-6 transition-colors ${i < form.rating ? "fill-vouchy-sunset text-vouchy-sunset" : "text-border hover:text-vouchy-sunset/50"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Questions */}
                    <div>
                      <Label>Your testimonial *</Label>
                      <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
                        {mockSpace.questions.map((q, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{q}</span>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Share your experience..."
                        rows={4}
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setMode("choose")} className="flex-1">Back</Button>
                      <Button type="submit" className="flex-1" disabled={loading} style={{ backgroundColor: mockSpace.accentColor }}>
                        {loading ? "Submitting..." : "Submit"}
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
                    <Button className="flex-1" style={{ backgroundColor: mockSpace.accentColor }}>
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
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: mockSpace.accentColor }} />
                  </motion.div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{mockSpace.successTitle}</h2>
                  <p className="text-muted-foreground">{mockSpace.successMessage}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
