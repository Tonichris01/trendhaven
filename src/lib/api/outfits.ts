const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api'

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Request failed')
  }
  
  return response.json()
}

export interface OutfitAnalysis {
  overallRating: number
  styleScore: number
  colorCoordination: number
  trendAlignment: number
  category: string
  tags: string[]
  feedback: string
}

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

export interface CreateOutfitParams {
  imageUrl: string
  mood?: string
  occasion?: string
  season?: 'spring' | 'summer' | 'fall' | 'winter'
}

export interface GetOutfitsParams {
  category?: 'casual' | 'formal' | 'street' | 'party' | 'business' | 'athletic'
}

export interface GetRecommendationsParams {
  mood?: string
  occasion?: string
  weather?: string
}

// Create and save outfit
export async function createOutfit(params: CreateOutfitParams & { image: File }): Promise<Outfit> {
  const formData = new FormData()
  formData.append('image', params.image)
  if (params.mood) formData.append('mood', params.mood)
  if (params.occasion) formData.append('occasion', params.occasion)
  if (params.season) formData.append('season', params.season)

  const token = localStorage.getItem('authToken')
  
  const response = await fetch(`${API_BASE_URL}/outfits/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to upload outfit')
  }

  const data = await response.json()
  return data.outfit
}

// Get user's outfits
export async function getUserOutfits(params: GetOutfitsParams = {}): Promise<Outfit[]> {
  const queryParams = new URLSearchParams()
  if (params.category) {
    queryParams.append('category', params.category)
  }

  const data = await apiRequest(`/outfits?${queryParams.toString()}`)
  return data.outfits || []
}

// Get outfit recommendations
export async function getRecommendations(params: GetRecommendationsParams = {}): Promise<Outfit[]> {
  const data = await apiRequest('/outfits/recommendations', {
    method: 'POST',
    body: JSON.stringify(params)
  })
  
  return data.recommendations || []
}

// Toggle favorite status
export async function toggleFavorite(outfitId: string): Promise<void> {
  await apiRequest(`/outfits/${outfitId}/favorite`, {
    method: 'PATCH'
  })
}

// Delete outfit
export async function deleteOutfit(outfitId: string): Promise<void> {
  await apiRequest(`/outfits/${outfitId}`, {
    method: 'DELETE'
  })
}
