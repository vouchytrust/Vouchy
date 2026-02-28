import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Upload, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const brandColors = [
  { name: "Ocean", value: "#1a3f64" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#059669" },
  { name: "Sunset", value: "#ea580c" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [workspace, setWorkspace] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [logo, setLogo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Logo must be under 2MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  }, [toast]);

  const finish = () => {
    toast({ title: "Workspace created!", description: "Welcome to Vouchy." });
    navigate("/dashboard");
  };

  const canNext = step === 0 ? workspace.trim().length > 0 : true;

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-12">
          <div className="h-8 w-8 rounded-lg vouchy-gradient-bg flex items-center justify-center">
            <Star className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Vouchy</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < step ? "bg-primary text-primary-foreground" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-12 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Name your workspace</h2>
                <p className="text-muted-foreground mb-6">This is your company or project name.</p>
                <Label htmlFor="ws">Workspace name</Label>
                <Input id="ws" className="mt-1.5 h-11" placeholder="Acme Inc." maxLength={100} value={workspace} onChange={(e) => setWorkspace(e.target.value)} autoFocus />
                <p className="text-xs text-muted-foreground mt-2">{workspace.length}/100 characters</p>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Choose your brand color</h2>
                <p className="text-muted-foreground mb-6">This color will be applied across your collection pages and widgets.</p>
                <div className="grid grid-cols-3 gap-3">
                  {brandColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      className={`relative flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                        color === c.value ? "border-primary" : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: c.value }} />
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                      {color === c.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Upload your logo</h2>
                <p className="text-muted-foreground mb-6">Optional — you can always add this later.</p>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-muted-foreground/40 transition-colors">
                  {logo ? (
                    <img src={logo} alt="Logo preview" className="h-16 w-auto object-contain" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                      <span className="text-sm text-muted-foreground">Click to upload (SVG, PNG, JPG ≤ 2MB)</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept=".svg,.png,.jpg,.jpeg" onChange={handleLogoUpload} />
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {step < 2 ? (
            <Button onClick={next} disabled={!canNext}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={finish}>
              Launch Dashboard <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Right - Preview */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-muted/30 p-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm bg-card rounded-xl border border-border vouchy-shadow-lg overflow-hidden"
        >
          <div className="h-2" style={{ backgroundColor: color }} />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {logo ? (
                <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
                  <Star className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
              <div>
                <div className="font-semibold text-foreground">{workspace || "Your Workspace"}</div>
                <div className="text-xs text-muted-foreground">Share your experience</div>
              </div>
            </div>
            <div className="space-y-3">
              {["How has our product helped you?", "What would you tell others about us?"].map((q, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">{q}</div>
              ))}
            </div>
            <div className="mt-4 h-10 rounded-lg flex items-center justify-center text-sm font-medium text-primary-foreground" style={{ backgroundColor: color }}>
              Submit Testimonial
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
