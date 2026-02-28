import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, RotateCcw, Send, Square, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import { supabase } from "@/integrations/supabase/client";

interface VideoRecorderProps {
  spaceId: string;
  spaceUserId: string;
  accentColor: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function VideoRecorder({ spaceId, spaceUserId, accentColor, onBack, onSuccess }: VideoRecorderProps) {
  const recorder = useVideoRecorder(120);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSubmit = async () => {
    if (!recorder.videoBlob || !form.name.trim()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const fileName = `${spaceId}/${Date.now()}.webm`;
      const { error: uploadErr } = await supabase.storage
        .from("videos")
        .upload(fileName, recorder.videoBlob, { contentType: "video/webm" });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName);

      const { error: insertErr } = await supabase.from("testimonials").insert({
        space_id: spaceId,
        user_id: spaceUserId,
        author_name: form.name,
        author_email: form.email || null,
        content: "(video testimonial)",
        rating: 5,
        type: "video",
        video_url: urlData.publicUrl,
        video_duration: formatTime(recorder.elapsed),
      });
      if (insertErr) throw insertErr;

      recorder.reset();
      onSuccess();
    } catch (err: any) {
      setSubmitError(err.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Camera / Recording / Review area */}
        <div className="aspect-video bg-foreground/5 rounded-lg overflow-hidden relative mb-4 border border-border">
          {/* Idle state */}
          {recorder.state === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Video className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Ready to record your testimonial</p>
              <Button onClick={recorder.startPreview} style={{ backgroundColor: accentColor }}>
                <Mic className="h-4 w-4 mr-2" /> Enable Camera
              </Button>
              {recorder.error && (
                <p className="text-xs text-destructive mt-2 text-center px-4">{recorder.error}</p>
              )}
            </div>
          )}

          {/* Preview / Recording / Countdown — show live video */}
          {(recorder.state === "previewing" || recorder.state === "countdown" || recorder.state === "recording") && (
            <>
              <video
                ref={recorder.previewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />

              {/* Countdown overlay */}
              <AnimatePresence>
                {recorder.state === "countdown" && (
                  <motion.div
                    key="countdown"
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50"
                  >
                    <span className="text-6xl font-bold text-white">{recorder.countdown}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recording indicator */}
              {recorder.state === "recording" && (
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-white font-mono">{formatTime(recorder.elapsed)} / {formatTime(recorder.maxDurationSec)}</span>
                </div>
              )}
            </>
          )}

          {/* Review — play back recorded video */}
          {recorder.state === "review" && recorder.videoUrl && (
            <video src={recorder.videoUrl} controls className="w-full h-full object-cover" />
          )}
        </div>

        {/* Controls */}
        {recorder.state === "previewing" && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { recorder.reset(); onBack(); }} className="flex-1">Back</Button>
            <Button onClick={recorder.startCountdown} className="flex-1" style={{ backgroundColor: accentColor }}>
              <Video className="h-4 w-4 mr-2" /> Start Recording
            </Button>
          </div>
        )}

        {recorder.state === "recording" && (
          <Button onClick={recorder.stopRecording} variant="destructive" className="w-full">
            <Square className="h-4 w-4 mr-2" /> Stop Recording
          </Button>
        )}

        {recorder.state === "review" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input className="mt-1" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1" type="email" placeholder="jane@co.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            {submitError && <p className="text-xs text-destructive">{submitError}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={recorder.retake} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" /> Retake
              </Button>
              <Button onClick={handleSubmit} disabled={submitting || !form.name.trim()} className="flex-1" style={{ backgroundColor: accentColor }}>
                <Send className="h-4 w-4 mr-2" /> {submitting ? "Uploading..." : "Submit"}
              </Button>
            </div>
          </div>
        )}

        {recorder.state === "idle" && (
          <Button variant="outline" onClick={onBack} className="w-full mt-0">Back</Button>
        )}
      </CardContent>
    </Card>
  );
}
