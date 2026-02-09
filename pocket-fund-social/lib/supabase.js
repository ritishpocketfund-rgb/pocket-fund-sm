import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. App will run with mock data.\n' +
    'To connect Supabase, create .env.local with:\n' +
    '  NEXT_PUBLIC_SUPABASE_URL=...\n' +
    '  NEXT_PUBLIC_SUPABASE_ANON_KEY=...'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isSupabaseConnected() {
  return !!supabase;
}
