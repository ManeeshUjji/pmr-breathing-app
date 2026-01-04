import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

// Singleton pattern - create only ONE client instance
let supabaseClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient;
}

// Get the singleton client (alias for createClient for clarity)
export function getSupabaseClient(): SupabaseClient {
  return createClient();
}
