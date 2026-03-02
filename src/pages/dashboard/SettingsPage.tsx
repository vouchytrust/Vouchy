import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ExternalLink, Sparkles, Crown, Zap } from "lucide-react";
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
  const { toast } = useToast();

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

  const handleUpgrade = async (productId: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to upgrade." });
      return;
    }

    setUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          productId,
          customerEmail: user.email,
          customerName: user.user_metadata?.full_name || user.email?.split('@')[0],
          returnUrl: `${window.location.origin}/dashboard/settings?payment=success`,
        },
      });

      if (error) throw error;
      if (data?.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        throw new Error("Failed to generate checkout link");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-semibold text-foreground">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Customize your profile, branding, and billing preferences.</p>
      </motion.div>

      <motion.div className="mt-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        {/* Profile */}
        <section>
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-foreground">{displayName}</div>
              <div className="text-[12px] text-muted-foreground">{userEmail}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-[12px] text-muted-foreground">Display name</Label>
              <Input className="mt-1.5 h-9 text-[13px]" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div>
              <Label className="text-[12px] text-muted-foreground">Workspace</Label>
              <Input className="mt-1.5 h-9 text-[13px]" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
            </div>
          </div>
        </section>

        <Separator className="my-6" />

        {/* Brand color */}
        <section>
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Brand color</h2>
          <div className="flex gap-2.5 flex-wrap">
            {brandColors.map((c) => (
              <button key={c} onClick={() => setBrandColor(c)} className="relative">
                <div
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${brandColor === c ? "ring-2 ring-offset-3 ring-offset-background ring-primary scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
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

        {/* Billing / Plan */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Plan & Billing</h2>
            <div className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 uppercase tracking-tight">
              Current: {profile?.plan || 'Free'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Plan */}
            <Card className={`border-border ${profile?.plan === 'free' || !profile?.plan ? 'bg-muted/30 border-primary/20' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[13px] font-semibold text-foreground">Free Plan</span>
                </div>
                <ul className="space-y-1 text-[12px] text-muted-foreground mb-4">
                  <li>• 10 testimonials</li>
                  <li>• 1 space</li>
                  <li>• 60s video max</li>
                </ul>
                {(profile?.plan === 'free' || !profile?.plan) ? (
                  <Button size="sm" variant="secondary" className="w-full h-8 text-xs cursor-default" disabled>Active Plan</Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => window.location.reload()}>Downgrade</Button>
                )}
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className={`border-primary/50 relative overflow-hidden ${profile?.plan === 'pro' ? 'bg-primary/5 border-primary shadow-vouchy-sm' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-vouchy-warning" />
                  <span className="text-[13px] font-semibold text-foreground">Pro Plan <span className="text-[11px] font-normal text-muted-foreground ml-1">$12/mo</span></span>
                </div>
                <ul className="space-y-1 text-[12px] text-muted-foreground mb-4">
                  <li>• 50 testimonials</li>
                  <li>• 3 spaces</li>
                  <li>• 180s video max</li>
                </ul>
                {profile?.plan === 'pro' ? (
                  <Button size="sm" variant="secondary" className="w-full h-8 text-xs cursor-default" style={{ backgroundColor: brandColor, color: 'white' }} disabled>Current Plan</Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs shadow-vouchy-sm"
                    disabled={upgrading}
                    style={{ backgroundColor: profile?.plan === 'agency' ? 'transparent' : brandColor, border: profile?.plan === 'agency' ? '1px solid #ddd' : 'none' }}
                    variant={profile?.plan === 'agency' ? 'outline' : 'default'}
                    onClick={() => handleUpgrade('pdt_0NVVmIlZrdWC90xs1ZgOm')}
                  >
                    {upgrading ? "Redirecting..." : "Upgrade to Pro"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Agency Plan */}
            <Card className={`border-foreground/50 relative overflow-hidden ${profile?.plan === 'agency' ? 'bg-foreground/5 border-foreground shadow-vouchy-sm' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-foreground" />
                  <span className="text-[13px] font-semibold text-foreground">Agency <span className="text-[11px] font-normal text-muted-foreground ml-1">$45/mo</span></span>
                </div>
                <ul className="space-y-1 text-[12px] text-muted-foreground mb-4">
                  <li>• Unlimited testimonials</li>
                  <li>• Unlimited spaces</li>
                  <li>• Custom domain (soon)</li>
                </ul>
                {profile?.plan === 'agency' ? (
                  <Button size="sm" variant="secondary" className="w-full h-8 text-xs cursor-default" disabled>Current Plan</Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full h-8 text-xs bg-foreground text-background hover:bg-foreground/90 shadow-vouchy-md"
                    disabled={upgrading}
                    onClick={() => handleUpgrade('pdt_0NVVmba1bevOgK6sfV8Wx')}
                  >
                    {upgrading ? "Redirecting..." : "Upgrade to Agency"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-6" />

        <div className="flex items-center justify-between pb-4">
          <Button size="sm" className="h-9 text-xs px-6" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <button className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">
            Delete account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
