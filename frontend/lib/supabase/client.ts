import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

function readBrowserConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Credenciais publicas do Supabase nao configuradas')
  }

  return { url, key }
}

/**
 * Client de browser memoizado. NAO instancie no escopo do modulo: o Next
 * prerenderiza componentes `'use client'` no build, e um `createClient()` no load
 * derruba `next build` com "Credenciais publicas do Supabase nao configuradas"
 * em qualquer maquina sem `.env.local`. Chame dentro de quem realmente usa.
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient

  const { url, key } = readBrowserConfig()
  browserClient = createBrowserClient(url, key)
  return browserClient
}
