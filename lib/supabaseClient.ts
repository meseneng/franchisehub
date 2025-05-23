// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(https://dzuqrvskmtqodajrpbac.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dXFydnNrbXRxb2RhanJwYmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDA5NDAsImV4cCI6MjA2MzQ3Njk0MH0.JXu8slDLpTLEh6Vpgr43QWy_xxsvEUv5juDKy7hOS14)
