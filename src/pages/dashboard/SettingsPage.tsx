import { useState } from "react";
import { motion } from "framer-motion";
import { User, Building2, CreditCard, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const brandColors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Ocean", value: "#1a3f64" },
  { name: "Emerald", value: "#059669" },
  { name: "Sunset", value: "#ea580c" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
];

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "billing", label: "Plan & Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [workspaceName, setWorkspaceName] = useState("Acme Inc.");
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const { toast } = useToast();

  const save = () => toast({ title: "Changes saved" });

  return (
    <div className="max-w-[700px]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-semibold text-foreground">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Manage your account and workspace preferences.</p>
      </motion.div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mt-6 mb-8 p-0.5 bg-muted rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-card text-foreground vouchy-shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">JD</span>
              </div>
              <div>
                <div className="text-[14px] font-medium text-foreground">Jane Doe</div>
                <div className="text-[12px] text-muted-foreground">jane@acme.com</div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-[13px]">Display name</Label>
              <Input className="mt-1.5 h-9 text-[13px] max-w-xs" defaultValue="Jane Doe" />
            </div>
            <div>
              <Label className="text-[13px]">Email</Label>
              <Input className="mt-1.5 h-9 text-[13px] max-w-xs" defaultValue="jane@acme.com" disabled />
              <p className="text-2xs text-muted-foreground mt-1">Contact support to change your email.</p>
            </div>
            <Button size="sm" className="h-8 text-xs" onClick={save}>Save Changes</Button>
          </div>
        )}

        {activeTab === "workspace" && (
          <div className="space-y-6">
            <div>
              <Label className="text-[13px]">Workspace name</Label>
              <Input className="mt-1.5 h-9 text-[13px] max-w-xs" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} maxLength={100} />
              <p className="text-2xs text-muted-foreground mt-1">{workspaceName.length}/100</p>
            </div>
            <Separator />
            <div>
              <Label className="text-[13px] mb-3 block">Brand color</Label>
              <div className="flex gap-2">
                {brandColors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setBrandColor(c.value)}
                    className="group relative"
                    title={c.name}
                  >
                    <div
                      className={`w-8 h-8 rounded-full transition-all duration-200 ${
                        brandColor === c.value ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                    {brandColor === c.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="h-3.5 w-3.5 text-white drop-shadow-sm" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <Button size="sm" className="h-8 text-xs" onClick={save}>Save Changes</Button>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-6">
            {/* Current plan */}
            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[14px] font-medium text-foreground">Pro Plan</div>
                  <div className="text-2xs text-muted-foreground">$29/month · Renews Mar 15, 2026</div>
                </div>
                <span className="text-2xs font-medium text-vouchy-success bg-vouchy-success/10 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Testimonials", value: "47 / 50" },
                  { label: "Spaces", value: "2 / 3" },
                  { label: "Video Duration", value: "180s" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xs text-muted-foreground mb-0.5">{s.label}</div>
                    <div className="text-[13px] font-medium text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="h-7 text-2xs gap-1">
                Manage Subscription <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            {/* AI credits */}
            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[14px] font-medium text-foreground">AI Credits</div>
                <span className="text-[13px] font-medium text-foreground">42 / 200</span>
              </div>
              <Progress value={21} className="h-1.5 mb-2" />
              <p className="text-2xs text-muted-foreground">158 credits remaining this month. Resets Mar 1, 2026.</p>
            </div>

            {/* Upgrade */}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5">
              <div className="text-[14px] font-medium text-foreground mb-1">Need more?</div>
              <p className="text-[12px] text-muted-foreground mb-3">Upgrade to Agency for 250 testimonials, 15 spaces, and 500 AI credits.</p>
              <Button size="sm" className="h-8 text-xs">Upgrade to Agency · $79/mo</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
