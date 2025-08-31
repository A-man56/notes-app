"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI, type User } from "../lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (
    fullName: string,
    email: string,
    dob?: string,
  ) => Promise<{ error?: string; requiresOTP?: boolean; email?: string }>
  signIn: (email: string, otp: string, remember: boolean) => Promise<{ error?: string }>
  verifyOTP: (email: string, otp: string) => Promise<{ error?: string }>
  resendOTP: (email: string) => Promise<{ error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user")

      if (token && savedUser) {
        try {
          const response = await authAPI.getProfile()
          setUser(response.data.user)
        } catch {
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          sessionStorage.removeItem("authToken")
          sessionStorage.removeItem("user")
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const persistSession = (token: string, user: User, remember = true) => {
    if (remember) {
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(user))
      sessionStorage.removeItem("authToken")
      sessionStorage.removeItem("user")
    } else {
      sessionStorage.setItem("authToken", token)
      sessionStorage.setItem("user", JSON.stringify(user))
    }
  }

  const signUp = async (fullName: string, email: string, dob?: string) => {
    try {
      const [firstName, ...rest] = fullName.trim().split(" ")
      const lastName = rest.join(" ") || " "
      const response = await authAPI.signUp({ firstName, lastName, email, dob })
      if (response.data.requiresOTP) {
        return { requiresOTP: true, email }
      }
      if (response.data.token && response.data.user) {
        persistSession(response.data.token, response.data.user, true)
        setUser(response.data.user)
      }
      return {}
    } catch (error: any) {
      return { error: error.response?.data?.error || "Signup failed" }
    }
  }

  const signIn = async (email: string, otp: string, remember: boolean) => {
    try {
      const response = await authAPI.signIn({ email, otp })
      if (response.data.token && response.data.user) {
        persistSession(response.data.token, response.data.user, remember)
        setUser(response.data.user)
      }
      return {}
    } catch (error: any) {
      return { error: error.response?.data?.error || "Signin failed" }
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await authAPI.verifyOTP({ email, otp })
      if (response.data.token && response.data.user) {
        persistSession(response.data.token, response.data.user, true)
        setUser(response.data.user)
      }
      return {}
    } catch (error: any) {
      return { error: error.response?.data?.error || "OTP verification failed" }
    }
  }

  const resendOTP = async (email: string) => {
    try {
      await authAPI.resendOTP({ email })
      return {}
    } catch (error: any) {
      return { error: error.response?.data?.error || "Failed to resend OTP" }
    }
  }

  const signOut = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    sessionStorage.removeItem("authToken")
    sessionStorage.removeItem("user")
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    verifyOTP,
    resendOTP,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
