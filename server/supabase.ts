import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
console.log("✅ Supabase URL:", process.env.SUPABASE_URL);
console.log("🔑 Service key starts with:", process.env.SUPABASE_SERVICE_KEY?.slice(0, 10));
