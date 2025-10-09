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

// Sign in anonymously
export async function signInAnonymously() {
  const data = await apiRequest('/auth/signin-anonymous', {
    method: 'POST'
  })
  
  if (data.token) {
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }
  
  return data
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const data = await apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  
  if (data.token) {
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }
  
  return data
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string) {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  
  if (data.token) {
    localStorage.setItem('authToken', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }
  
  return data
}

// Sign out
export async function signOut() {
  try {
    await apiRequest('/auth/signout', {
      method: 'POST'
    })
  } finally {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }
}

// Get current user
export async function getCurrentUser() {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    return null
  }
  
  try {
    const data = await apiRequest('/auth/me')
    return data.user
  } catch (error) {
    // Token is invalid, clear it
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    return null
  }
}

// Listen to auth state changes (simplified for localStorage-based auth)
export function onAuthStateChange(callback: (user: any) => void) {
  // Check initial state
  const user = localStorage.getItem('user')
  callback(user ? JSON.parse(user) : null)
  
  // Listen for storage changes (for multi-tab support)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'user') {
      callback(e.newValue ? JSON.parse(e.newValue) : null)
    }
  }

  // Listen for custom auth state change events (for same-tab changes)
  const handleAuthStateChange = (e: CustomEvent) => {
    callback(e.detail)
  }

  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('authStateChange', handleAuthStateChange as EventListener)

  // Return cleanup function
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          window.removeEventListener('storage', handleStorageChange)
          window.removeEventListener('authStateChange', handleAuthStateChange as EventListener)
        }
      }
    }
  }
}
