import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórios",
  )
}

/**
 * Client de browser do Supabase. Serve a sessão da memória/localStorage e só vai à
 * rede quando o token expira — por isso o apiClient lê `getSession()` a cada request
 * sem cache próprio (blueprint §3.2).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
