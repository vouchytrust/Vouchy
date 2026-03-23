import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ExternalLink, Sparkles, Crown, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const brandColors = [
  "#3b82f6", "#1a3f64", "#059669", "#ea580c", "#7c3aed", "#e11d48", "#0d9488", "#f59e0b",
];

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [liveCredits, setLiveCredits] = useState<{ used: number; reset_at: string | null } | null>(null);
  const { toast } = useToast();

  // Fetch fresh credits directly — profile in context may be stale
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        const d = data as unknown as { ai_credits_used: number | null; ai_credits_reset_at: string | null } | null;
        if (d) setLiveCredits({ used: d.ai_credits_used ?? 0, reset_at: d.ai_credits_reset_at });
      });
  }, [user]);

  useEffect(() => {
    if (profile) {
      setWorkspaceName(profile.company_name || "");
      setBrandColor(profile.brand_color || "#3b82f6");
    }
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
    }
  }, [profile, user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: workspaceName.trim(),
          brand_color: brandColor,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast({ title: "Changes saved" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const userEmail = user?.email || "";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-semibold text-foreground">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Account, workspace, and billing.</p>
      </motion.div>

      <motion.div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>

        {/* ── LEFT COLUMN: Profile + Brand Color ── */}
        <div className="space-y-5">

          {/* Profile */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Profile</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-foreground">{displayName}</div>
                <div className="text-[12px] text-muted-foreground">{userEmail}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[12px] text-muted-foreground">Display name</Label>
                <Input className="mt-1.5 h-9 text-[13px]" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <Label className="text-[12px] text-muted-foreground">Workspace</Label>
                <Input className="mt-1.5 h-9 text-[13px]" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Brand Color */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Brand Color</h2>
            <div className="flex gap-2.5 flex-wrap items-center">
              {brandColors.map((c) => (
                <button key={c} onClick={() => setBrandColor(c)} className="relative">
                  <div
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${brandColor === c ? "ring-2 ring-offset-3 ring-offset-background ring-primary scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"}`}
                    style={{ backgroundColor: c }}
                  />
                  <AnimatePresence>
                    {brandColor === c && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-white drop-shadow-sm" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
              
              {/* Custom Color Picker */}
              <div className="relative group">
                <input 
                  type="color" 
                  value={brandColor} 
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10"
                />
                <div 
                  className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-200 ${!brandColors.includes(brandColor) ? "ring-2 ring-offset-3 ring-offset-background ring-primary scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: !brandColors.includes(brandColor) ? brandColor : 'white' }}
                >
                  <Plus className={`h-3.5 w-3.5 ${!brandColors.includes(brandColor) ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium text-foreground">New testimonials</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">Get notified when someone submits feedback</div>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium text-foreground">Weekly digest</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">Summary of activity every Monday</div>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </div>
          </div>

          {/* Save + Delete */}
          <div className="flex items-center justify-between">
            <Button size="sm" className="h-9 text-xs px-6" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <button className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">
              Delete account
            </button>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Plan & Billing + Notifications ── */}
        <div className="space-y-5">

          {/* Plan & Billing */}
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Plan & Billing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Starter (Free) */}
              <Card className={`relative overflow-hidden ${(!profile?.plan || profile?.plan?.toLowerCase() === 'free') ? 'border-primary shadow-sm bg-primary/5' : 'border-border'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[13px] font-semibold text-foreground">Starter</span>
                    <span className="ml-auto text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-slate-100/50 px-2 py-0.5 rounded">Free</span>
                  </div>
                  <ul className="space-y-1 text-[12px] text-muted-foreground mb-4">
                    <li>• 50 text reviews</li>
                    <li>• 1 collector space</li>
                    <li>• No video reviews</li>
                    <li>• Vouchy branding included</li>
                  </ul>
                  <div className="w-full h-8 flex items-center justify-center">
                    {(!profile?.plan || profile?.plan?.toLowerCase() === 'free') ? (
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">✓ Your Plan</span>
                    ) : (
                      <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest italic">Included</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pro ($12) */}
              <Card className={`relative overflow-hidden ${profile?.plan?.toLowerCase() === 'pro' ? 'border-primary shadow-sm bg-primary/5' : 'border-border'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="text-[13px] font-semibold text-foreground">Pro Plan</span>
                    <span className="ml-auto text-[10px] font-black text-primary/80 uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">$12/mo</span>
                  </div>
                  <ul className="space-y-1 text-[12px] text-muted-foreground mb-4">
                    <li>• Unlimited text reviews</li>
                    <li>• 500 video reviews limit</li>
                    <li>• 3 collector spaces</li>
                    <li>• No Vouchy branding</li>
                  </ul>
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs"
                    disabled={upgrading || profile?.plan?.toLowerCase() === "pro" || profile?.plan?.toLowerCase() === "agency"}
                    onClick={async () => {
                      setUpgrading(true);
                      try {
                        const res = await supabase.functions.invoke("create-checkout", {
                          body: {
                            productId: "pdt_0NVVmIlZrdWC90xs1ZgOm",
                            customerEmail: user?.email,
                            customerName: displayName || user?.email?.split("@")[0],
                            returnUrl: `${window.location.origin}/dashboard/settings`,
                          },
                        });
                        if (res.error) throw new Error(res.error.message);
                        const { paymentLink } = res.data;
                        if (paymentLink) window.location.href = paymentLink;
                        else throw new Error("No payment link returned");
                      } catch (err: any) {
                        toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
                      } finally {
                        setUpgrading(false);
                      }
                    }}
                  >
                    {profile?.plan?.toLowerCase() === "pro"
                      ? "✓ Active"
                      : profile?.plan?.toLowerCase() === "agency" 
                         ? "✓ Pro included" 
                         : upgrading ? "Redirecting…" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>

              {/* Agency ($45) */}
              <Card className={`relative overflow-hidden ${profile?.plan?.toLowerCase() === 'agency' ? 'border-primary shadow-sm bg-primary/5' : 'border-border'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-[13px] font-semibold text-foreground">Agency Plan</span>
                    <span className="ml-auto text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">$45/mo</span>
                  </div>
                  <ul className="space-y-1 text-[12px] text-muted-foreground mb-4">
                    <li>• Unlimited text reviews</li>
                    <li>• 1000 video reviews limit</li>
                    <li>• 15 collector spaces</li>
                    <li>• Full White-Labeling</li>
                  </ul>
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs border-primary/20"
                    variant={profile?.plan?.toLowerCase() === "agency" ? "default" : "outline"}
                    disabled={upgrading || profile?.plan?.toLowerCase() === "agency"}
                    onClick={async () => {
                      setUpgrading(true);
                      try {
                        const res = await supabase.functions.invoke("create-checkout", {
                          body: {
                            productId: "pdt_0NVVmba1bevOgK6sfV8Wx",
                            customerEmail: user?.email,
                            customerName: displayName || user?.email?.split("@")[0],
                            returnUrl: `${window.location.origin}/dashboard/settings`,
                          },
                        });
                        if (res.error) throw new Error(res.error.message);
                        const { paymentLink } = res.data;
                        if (paymentLink) window.location.href = paymentLink;
                        else throw new Error("No payment link returned");
                      } catch (err: any) {
                        toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
                      } finally {
                        setUpgrading(false);
                      }
                    }}
                  >
                    {profile?.plan?.toLowerCase() === "agency" ? "✓ Active" : upgrading ? "Redirecting…" : "Start Agency"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Credits meter — visible for everyone to show usage */}
            {(() => {
              const plan = profile?.plan?.toLowerCase() || 'free';
              const limits: Record<string, number> = { free: 0, pro: 200, agency: 2000 };
              const limit = limits[plan] ?? 0;
              const used = liveCredits?.used ?? 0;
              const pct = Math.min(100, Math.round((used / limit) * 100));

              const resetAt = liveCredits?.reset_at
                ? new Date(liveCredits.reset_at)
                : new Date();
              const nextReset = new Date(resetAt.getTime() + 30 * 24 * 60 * 60 * 1000);
              const daysLeft = Math.max(0, Math.ceil((nextReset.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

              return (
                <div className="mt-4 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      AI Credits this month
                    </span>
                    <span className="text-[11px] text-muted-foreground">{used} / {limit} used</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "var(--primary)",
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    {Math.max(0, limit - used)} credits remaining · resets in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                  </p>
                  {plan === 'free' && (
                    <p className="text-[10px] text-primary font-medium mt-1.5 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Upgrade for 200+ monthly credits
                    </p>
                  )}
                </div>
              );
            })()}

          </div>



        </div>
      </motion.div>
    </div>
  );
}

