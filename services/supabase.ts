import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

// ── Storage Utilities ──
const BUCKET = 'younique-archive';

export async function uploadArtifact(file: File, path: string) {
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
            upsert: true,
            contentType: file.type
        });
    if (error) throw error;
    return data;
}

export function getArtifactUrl(path: string) {
    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);
    return data.publicUrl;
}
