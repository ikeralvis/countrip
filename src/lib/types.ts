// lib/types.ts
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  theme_preference: 'light' | 'dark' | 'system'
  map_color: 'blue' | 'green' | 'purple' | 'pink' | 'orange'
  updated_at: string | null
}

export interface Visit {
  id: string
  user_id: string
  country_code: string
  country_name: string | null
  city_name: string | null
  date: string | null
  duration: string | null
  notes: string | null
  emojis: string | null
  lat: number | null
  lng: number | null
  created_at?: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  primary_color: string
  map_style: 'streets' | 'satellite' | 'outdoors'
}