import { supabase } from "@/integrations/supabase/client";

// Module-level cache for the current user session
let cachedUser: any = null;
let lastUserFetch = 0;
const USER_CACHE_TTL = 30000; // 30 seconds

async function getCachedUser() {
  const now = Date.now();
  if (cachedUser && (now - lastUserFetch < USER_CACHE_TTL)) {
    return cachedUser;
  }
  const { data: { user } } = await supabase.auth.getUser();
  cachedUser = user;
  lastUserFetch = now;
  return user;
}

// ── Spaces ──

export async function fetchSpaces() {
  const user = await getCachedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchSpaceBySlug(slug: string) {
  const { data: space, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name, brand_color, logo_url")
    .eq("user_id", space.user_id)
    .single();

  return { ...space, profiles: profile };
}

export async function createSpace(space: {
  name: string;
  slug: string;
  is_active: boolean;
  form_config: any;
  user_id: string;
}) {
  const { data, error } = await supabase.from("spaces").insert(space).select().single();
  if (error) throw error;
  return data;
}

export async function updateSpace(id: string, updates: Record<string, any>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("spaces")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSpace(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("spaces")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
}

export async function toggleSpaceActive(id: string, isActive: boolean) {
  return updateSpace(id, { is_active: isActive });
}

// ── Testimonials ──

export async function fetchTestimonials() {
  const user = await getCachedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("*, spaces(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchTestimonialsBySpace(spaceId: string) {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitTestimonial(testimonial: {
  space_id: string;
  user_id: string;
  author_name: string;
  author_email?: string;
  author_company?: string;
  author_title?: string;
  content: string;
  rating: number;
  type: string;
  author_avatar_url?: string;
}) {
  const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single();
  if (error) throw error;
  return data;
}

export async function updateTestimonialStatus(id: string, status: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("testimonials")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleTestimonialFavorite(id: string, isFavorite: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("testimonials")
    .update({ is_favorite: isFavorite })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
}

// ── Dashboard Stats ──

export async function fetchDashboardStats() {
  const user = await getCachedUser();
  if (!user) return { total: 0, avgRating: "0.0", videoRate: 0, testimonials: [] };

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, rating, type, status, created_at")
    .eq("user_id", user.id);
  if (error) throw error;

  const total = testimonials?.length || 0;
  const avgRating = total > 0
    ? (testimonials!.reduce((sum, t) => sum + t.rating, 0) / total).toFixed(1)
    : "0.0";
  const videoCount = testimonials?.filter(t => t.type === "video").length || 0;
  const videoRate = total > 0 ? Math.round((videoCount / total) * 100) : 0;

  return { total, avgRating, videoRate, testimonials: testimonials || [] };
}

export async function fetchSpaceTestimonialCounts() {
  const user = await getCachedUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from("testimonials")
    .select("space_id, type")
    .eq("user_id", user.id);
  if (error) throw error;

  const counts: Record<string, { total: number; video: number; text: number }> = {};
  data?.forEach(t => {
    if (!counts[t.space_id]) counts[t.space_id] = { total: 0, video: 0, text: 0 };
    counts[t.space_id].total++;
    if (t.type === "video") counts[t.space_id].video++;
    else counts[t.space_id].text++;
  });
  return counts;
}

export async function fetchPortalSummary() {
  const user = await getCachedUser();
  if (!user) return null;

  // Run core dashboard metrics in parallel
  const [counts, recent, spaces] = await Promise.all([
    // Testimonial counts and aggregation
    supabase
      .from("testimonials")
      .select("rating, type", { count: 'exact' })
      .eq("user_id", user.id),
    
    // Most recent items ONLY
    supabase
      .from("testimonials")
      .select("*, spaces(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    
    // Basic spaces overview
    supabase
      .from("spaces")
      .select("id, name, is_active")
      .eq("user_id", user.id)
      .limit(10)
  ]);

  const testimonials = counts.data || [];
  const total = counts.count || 0;
  const avgRating = total > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / total).toFixed(1)
    : "0.0";
  const videoCount = testimonials.filter(t => t.type === "video").length || 0;
  const videoRate = total > 0 ? Math.round((videoCount / total) * 100) : 0;

  return {
    stats: { total, avgRating, videoRate },
    recentTestimonials: recent.data || [],
    spaces: spaces.data || [],
  };
}

export async function fetchWidgetById(id: string) {
  const { data, error } = await supabase
    .from("widgets")
    .select(`
      *,
      spaces!inner(
        slug,
        name,
        testimonials(
          id,
          author_name,
          author_company,
          rating,
          content,
          author_avatar_url,
          type,
          video_url,
          status,
          created_at
        )
      )
    `)
    .eq("id", id)
    .eq("spaces.testimonials.status", "approved")
    .single();
  if (error) throw error;
  return data;
}

export async function upsertWidget(widget: {
  id?: string;
  space_id: string;
  user_id: string;
  name?: string;
  config: any;
}) {
  const { data, error } = await supabase
    .from("widgets")
    .upsert(widget)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchWidgetsBySpace(spaceId: string) {
  const user = await getCachedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("widgets")
    .select("*")
    .eq("space_id", spaceId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchInitialAppData(userId: string) {
  const [profileData, summaryData] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, user_id, company_name, brand_color, logo_url, plan, onboarding_completed, is_admin")
      .eq("user_id", userId)
      .single(),
    fetchPortalSummary()
  ]);

  return {
    profile: profileData.data,
    summary: summaryData
  };
}
