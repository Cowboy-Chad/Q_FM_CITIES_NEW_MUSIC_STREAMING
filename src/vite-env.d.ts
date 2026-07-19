/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_INCLUDE_DUMMY_CITIES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}