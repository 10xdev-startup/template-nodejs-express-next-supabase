import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

/**
 * Client de browser do Supabase, cacheado em módulo — serve a sessão da
 * memória/localStorage e só vai à rede quando o token expira (blueprint §3.2).
 */
function createClient(): SupabaseClient {
  if (browserClient) return browserClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórios",
    )
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return browserClient
}

export const supabase = createClient()
