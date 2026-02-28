import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ExternalLink, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const brandColors = [
  "#3b82f6", "#1a3f64", "#059669", "#ea580c", "#7c3aed", "#e11d48", "#0d9488", "#f59e0b",
];

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Jane Doe");
  const [workspaceName, setWorkspaceName] = useState("Acme Inc.");
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const { toast } = useToast();

  const save = () => toast({ title: "Changes saved" });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-semibold text-foreground">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Account, workspace, and billing.</p>
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {/* Profile section */}
        <section>
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-foreground">Jane Doe</div>
              <div className="text-[12px] text-muted-foreground">jane@acme.com</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-[12px] text-muted-foreground">Display name</Label>
              <Input
                className="mt-1.5 h-9 text-[13px]"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-[12px] text-muted-foreground">Workspace</Label>
              <Input
                className="mt-1.5 h-9 text-[13px]"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Brand color */}
        <section>
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Brand color</h2>
          <div className="flex gap-2.5 flex-wrap">
            {brandColors.map((c) => (
              <button
                key={c}
                onClick={() => setBrandColor(c)}
                className="relative"
              >
                <div
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    brandColor === c ? "ring-2 ring-offset-3 ring-offset-background ring-primary scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
                <AnimatePresence>
                  {brandColor === c && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check className="h-3.5 w-3.5 text-white drop-shadow-sm" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </section>

        <Separator className="my-6" />

        {/* Notifications */}
        <section>
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-5">Notifications</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-foreground">New testimonials</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">Get notified when someone submits feedback</div>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-foreground">Weekly digest</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">Summary of activity every Monday</div>
              </div>
              <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Plan */}
        <section>
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Plan & billing</h2>
          <div className="rounded-xl border border-border p-5 bg-card/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[14px] font-medium text-foreground">Pro Plan</span>
                <span className="text-[12px] text-muted-foreground ml-2">$29/mo</span>
              </div>
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">Active</span>
            </div>

            <div className="space-y-3.5 mb-5">
              <div>
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <span className="text-muted-foreground">Testimonials</span>
                  <span className="text-foreground font-medium">47 / 50</span>
                </div>
                <Progress value={94} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <span className="text-muted-foreground">AI Credits</span>
                  <span className="text-foreground font-medium">42 / 200</span>
                </div>
                <Progress value={21} className="h-1.5" />
              </div>
            </div>

            <div className="flex gap-2.5">
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5">
                Manage <ExternalLink className="h-3 w-3" />
              </Button>
              <Button size="sm" className="h-8 text-[11px] gap-1.5">
                <Sparkles className="h-3 w-3" /> Upgrade
              </Button>
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        <div className="flex items-center justify-between pb-4">
          <Button size="sm" className="h-9 text-xs px-6" onClick={save}>Save Changes</Button>
          <button className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">
            Delete account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
