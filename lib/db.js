// lib/db.js
import { createClient } from '@supabase/supabase-js'
export const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
