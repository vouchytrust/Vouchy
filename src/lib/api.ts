import { supabase } from "@/integrations/supabase/client";

// ── Spaces ──

export async function fetchSpaces() {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchSpaceBySlug(slug: string) {
  const { data: space, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
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
  const { data, error } = await supabase.from("spaces").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSpace(id: string) {
  const { error } = await supabase.from("spaces").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleSpaceActive(id: string, isActive: boolean) {
  return updateSpace(id, { is_active: isActive });
}

// ── Testimonials ──

export async function fetchTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*, spaces(name)")
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
  const { data, error } = await supabase
    .from("testimonials")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleTestimonialFavorite(id: string, isFavorite: boolean) {
  const { data, error } = await supabase
    .from("testimonials")
    .update({ is_favorite: isFavorite })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

// ── Dashboard Stats ──

export async function fetchDashboardStats() {
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, rating, type, status, created_at");
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
  const { data, error } = await supabase
    .from("testimonials")
    .select("space_id, type");
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
