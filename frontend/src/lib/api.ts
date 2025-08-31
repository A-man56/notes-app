import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      sessionStorage.removeItem("authToken")
      sessionStorage.removeItem("user")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  isEmailVerified: boolean
  createdAt?: string
}

export interface Note {
  _id: string
  title: string
  content: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  message: string
  token?: string
  user?: User
  userId?: string
  requiresOTP?: boolean
}

// Auth API calls
export const authAPI = {
  signUp: (data: { firstName: string; lastName: string; email: string; dob?: string }) =>
    api.post<AuthResponse>("/auth/signup", data),

  signIn: (data: { email: string; otp: string }) => api.post<AuthResponse>("/auth/signin", data),

  verifyOTP: (data: { email: string; otp: string }) => api.post<AuthResponse>("/auth/verify-otp", data),

  resendOTP: (data: { email: string }) => api.post<{ message: string }>("/auth/resend-otp", data),

  getProfile: () => api.get<{ user: User }>("/auth/profile"),
}

// Notes API calls
export const notesAPI = {
  getNotes: () => api.get<{ notes: Note[] }>("/notes"),

  createNote: (data: { title: string; content?: string }) => api.post<{ message: string; note: Note }>("/notes", data),

  updateNote: (id: string, data: { title?: string; content?: string }) =>
    api.put<{ message: string; note: Note }>(`/notes/${id}`, data),

  deleteNote: (id: string) => api.delete<{ message: string }>(`/notes/${id}`),
}
