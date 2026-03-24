import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchInitialAppData } from "@/lib/api";

interface Profile {
  id: string;
  user_id: string;
  company_name: string | null;
  brand_color: string;
  logo_url: string | null;
  plan: string | null;
  email: string | null;
  onboarding_completed: boolean;
  ai_credits_used: number | null;
  ai_credits_reset_at: string | null;
  is_admin: boolean | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => { },
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();
    setProfile(data as unknown as Profile | null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    queryClient.clear();
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async (activeSession: Session | null) => {
      try {
        setLoading(true);
        setSession(activeSession);
        
        if (activeSession?.user) {
          // ULTRA FAST BOOT: Parallel fetch profile + dashboard summary
          const { profile: prof, summary } = await fetchInitialAppData(activeSession.user.id);
          
          if (mounted) {
            setProfile(prof as unknown as Profile | null);
            // Hydrate React Query cache immediately
            if (summary) {
              queryClient.setQueryData(["portal-summary"], summary);
            }
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("AuthContext init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) loadData(session);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        loadData(session);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setProfile(null);
        setLoading(false);
        queryClient.clear();
      } else {
        setSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
