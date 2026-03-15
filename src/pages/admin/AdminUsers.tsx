import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Zap, 
  Shield, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Mail,
  Building2,
  Calendar as CalendarIcon,
  History as HistoryIcon,
  ChevronDown,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminUserDetail from "./AdminUserDetail";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePlan = async (userId: string, currentPlan: string) => {
    const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
    const { error } = await supabase
      .from("profiles")
      .update({ plan: newPlan })
      .eq("user_id", userId);

    if (error) {
        toast({ title: "Failed to update plan", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "Plan Updated", description: `User is now on the ${newPlan} plan.` });
        fetchUsers();
    }
  };

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !isAdmin } as any)
      .eq("user_id", userId);

    if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "Success", description: isAdmin ? "Admin privileges removed" : "Admin privileges granted" });
        fetchUsers();
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Crucial Alert: You are about to delete user ${email}. This will permanentely remove all their spaces, testimonials, and media. Proceed?`)) return;
    
    // In a real app, you might want a cascade delete or a dedicated edge function
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "User Deleted", description: "All account data has been removed." });
        fetchUsers();
    }
  };

  if (selectedUserId) {
    return <AdminUserDetail 
      userId={selectedUserId} 
      onBack={() => setSelectedUserId(null)} 
      onUpdate={fetchUsers} 
    />;
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-32">
      {/* ── SEARCH & FILTER ── */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between items-stretch md:items-center">
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 h-14 w-full md:max-w-md focus-within:ring-4 ring-emerald-500/5 focus-within:border-emerald-500/20 transition-all duration-500 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input 
            placeholder="Search email, company..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] font-bold w-full placeholder:text-slate-300 text-slate-950 uppercase tracking-widest"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="h-14 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 px-8 transition-all flex-1 sm:flex-none">
            <Filter className="w-3.5 h-3.5 mr-2" /> Parameters
          </Button>
          <Button className="h-14 rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/20 px-10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 flex-1 sm:flex-none">
            Database Export
          </Button>
        </div>
      </div>

      {/* ── CARD TABLE ── */}
      <div className="space-y-6">
        {/* Header - Desktop Only */}
        <div className="hidden md:grid grid-cols-12 px-8 mb-4">
          <div className="col-span-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Identity</div>
          <div className="col-span-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Status</div>
          <div className="col-span-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Tier</div>
          <div className="col-span-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 text-right">Actions</div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((u, i) => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center bg-white border border-slate-100 p-6 md:p-6 rounded-[2rem] hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden gap-6 md:gap-0"
              >
                {/* Visual Blueprint Accent */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full opacity-0 md:group-hover:opacity-100 transition-all" />

                {/* Identity */}
                <div className="col-span-4 flex items-center gap-5 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs uppercase group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all duration-500 shadow-inner shrink-0">
                    {u.company_name?.[0] || u.email?.[0]}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[14px] font-black text-slate-950 tracking-tight truncate">{u.company_name || "Personal"}</span>
                    <span className="text-[10px] font-bold text-slate-400 lowercase italic opacity-80 truncate">{u.email}</span>
                  </div>
                </div>

                {/* Mobile Meta (Status + Plan) */}
                <div className="flex md:hidden w-full items-center justify-between border-y border-slate-50 py-4">
                  <div className="flex items-center">
                    {u.onboarding_completed ? (
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => togglePlan(u.user_id, u.plan)}
                    className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-[0.2em] uppercase border ${
                      u.plan === 'pro' 
                      ? 'bg-slate-950 text-white border-slate-950' 
                      : 'bg-white text-slate-400 border-slate-100'
                    }`}
                   >
                     {u.plan === 'pro' ? 'PRO' : 'FREE'}
                   </button>
                </div>

                {/* Desktop Status */}
                <div className="hidden md:flex col-span-2 items-center">
                   {u.onboarding_completed ? (
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
                     </div>
                   )}
                </div>

                {/* Desktop Plan */}
                <div className="hidden md:block col-span-2">
                   <button 
                    onClick={() => togglePlan(u.user_id, u.plan)}
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all border ${
                      u.plan === 'pro' 
                      ? 'bg-slate-950 text-white border-slate-950 shadow-lg shadow-slate-950/20' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-950 hover:text-slate-950'
                    }`}
                   >
                     {u.plan === 'pro' ? 'PRO TIER' : 'FREE TIER'}
                   </button>
                </div>

                {/* Actions */}
                <div className="col-span-4 flex items-center justify-between md:justify-end gap-2 w-full md:w-auto transition-all duration-500">
                  <Button 
                    variant="ghost" 
                    className="h-11 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white hover:shadow-lg transition-all px-5 gap-2 flex-1 md:flex-none"
                    onClick={() => setSelectedUserId(u.user_id)}
                  >
                    <Eye className="w-3.5 h-3.5" /> View Intel
                  </Button>
                  
                  <div className="hidden md:block w-[1px] h-6 bg-slate-100" />

                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`w-11 h-11 rounded-xl transition-all border ${u.is_admin ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 border-transparent hover:border-slate-200 hover:bg-white'}`}
                      onClick={() => toggleAdmin(u.user_id, !!u.is_admin)}
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-11 h-11 rounded-xl text-slate-400 border border-transparent hover:border-red-100 hover:bg-red-50 hover:text-red-500 transition-all"
                      onClick={() => deleteUser(u.user_id, u.email)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
