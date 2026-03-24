import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

const STORE_ID = process.env.STORE_ID || "";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getStore = cache(async () => {
  const { data } = await supabase.from("stores").select("*").eq("id", STORE_ID).eq("is_active", true).single();
  return data;
});

export async function getCategories() {
  const { data } = await supabase.from("categories").select("*").eq("store_id", STORE_ID).order("sort_order");
  return data || [];
}

export async function getProducts(categorySlug?: string | null) {
  let query = supabase.from("products").select("*, categories(name, slug)").eq("store_id", STORE_ID).eq("is_active", true).order("sort_order");
  if (categorySlug) {
    const { data: cat } = await supabase.from("categories").select("id").eq("store_id", STORE_ID).eq("slug", categorySlug).single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  const { data } = await query;
  return data || [];
}

export async function getProduct(productSlug: string) {
  const { data } = await supabase.from("products").select("*, categories(name, slug)").eq("store_id", STORE_ID).eq("slug", productSlug).single();
  return data || null;
}
