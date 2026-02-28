import { useState } from "react";
import { motion } from "framer-motion";
import { User, Building2, Palette, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const brandColors = [
  { name: "Ocean", value: "#1a3f64" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#059669" },
  { name: "Sunset", value: "#ea580c" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
];

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("Acme Inc.");
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const { toast } = useToast();

  const save = () => toast({ title: "Settings saved!" });

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and workspace.</p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile"><User className="h-3.5 w-3.5 mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="workspace"><Building2 className="h-3.5 w-3.5 mr-1.5" /> Workspace</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="h-3.5 w-3.5 mr-1.5" /> Plan & Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full vouchy-gradient-bg flex items-center justify-center text-xl font-bold text-primary-foreground">JD</div>
                <div>
                  <div className="font-semibold text-foreground">Jane Doe</div>
                  <div className="text-sm text-muted-foreground">jane@acme.com</div>
                </div>
              </div>
              <div>
                <Label>Display name</Label>
                <Input className="mt-1.5" defaultValue="Jane Doe" />
              </div>
              <Button onClick={save}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace" className="mt-6 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Workspace name</Label>
                <Input className="mt-1.5" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} maxLength={100} />
              </div>
              <div>
                <Label className="mb-3 block">Brand color</Label>
                <div className="grid grid-cols-3 gap-3">
                  {brandColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setBrandColor(c.value)}
                      className={`relative flex items-center gap-2 p-2.5 rounded-lg border-2 transition-colors ${
                        brandColor === c.value ? "border-primary" : "border-border"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full shrink-0" style={{ backgroundColor: c.value }} />
                      <span className="text-xs font-medium text-foreground">{c.name}</span>
                      {brandColor === c.value && (
                        <Check className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground p-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={save}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Credits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used this month</span>
                <span className="font-medium text-foreground">42 / 200</span>
              </div>
              <Progress value={21} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Pro Plan</div>
                  <div className="text-sm text-muted-foreground">$29/month · 50 testimonials · 3 spaces</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Active</span>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
