// Get the base API URL based on the environment
export const getApiBaseUrl = () => {
  // Use Vite's import.meta.env for environment variables
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`
  }
  // In development, use the local FastAPI server
  return 'http://localhost:8000/api'
}

// Helper function to build API URLs
export const buildApiUrl = (path: string) => {
  const baseUrl = getApiBaseUrl()
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

// Helper function for making API requests
export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const url = buildApiUrl(path)
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network response was not ok' }))
    throw new Error(error.detail || 'Network response was not ok')
  }

  return response.json()
}
