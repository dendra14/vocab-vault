import { createClient } from "./supabase";

// Ambil semua vocab milik user yang login
export async function getVocabs() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Tambah vocab baru
export async function addVocab(vocabData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("vocabularies")
    .insert([{ ...vocabData, user_id: user.id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update vocab yang sudah ada
export async function updateVocab(id, updates) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vocabularies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Hapus vocab
export async function deleteVocab(id) {
  const supabase = createClient();
  const { error } = await supabase.from("vocabularies").delete().eq("id", id);
  if (error) throw error;
}

// Toggle favorit
export async function toggleFavorite(id, currentValue) {
  return updateVocab(id, { is_favorite: !currentValue });
}
