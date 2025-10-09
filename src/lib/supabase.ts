import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your_supabase_url_here'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Outfit {
  id: string
  user_id: string
  image_url: string
  category: 'casual' | 'formal' | 'street' | 'party' | 'business' | 'athletic'
  rating: number
  style_analysis: {
    styleScore: number
    colorCoordination: number
    trendAlignment: number
    feedback: string
    tags: string[]
  }
  mood?: string
  occasion?: string
  season?: 'spring' | 'summer' | 'fall' | 'winter'
  favorite: boolean
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  preferred_styles: string[]
  favorite_colors: string[]
  body_type?: string
  lifestyle?: string
  budget?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}
