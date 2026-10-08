import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kibjlgpkusadhpdhclqd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_59FPjV-lQd0X9bfl1JYQbQ_jfEIQzcK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
