// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_KEY!; // server-only

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
