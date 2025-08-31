"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Mail, Calendar, UserIcon, Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useAuth } from "../../contexts/AuthContext"
import { OTPVerification } from "./OTPVerification"

interface AuthFormProps {
  isSignUp: boolean
  onToggle: () => void
}

export function AuthForm({ isSignUp, onToggle }: AuthFormProps) {
  const { signUp, signIn, resendOTP } = useAuth()
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState<string>("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showOTPVerify, setShowOTPVerify] = useState(false)
  const [otpEmail, setOtpEmail] = useState("")
  const [otpVisible, setOtpVisible] = useState(false)

  // New: sign-in flow step + resend cooldown timer
  const [signInStep, setSignInStep] = useState<"request" | "verify">("request")
  const [resendCooldown, setResendCooldown] = useState<number>(0)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (isSignUp) {
      if (!fullName.trim()) newErrors.fullName = "Name is required"
      if (dob && isNaN(Date.parse(dob))) newErrors.dob = "Enter a valid date"
    }
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email"

    // Only require OTP on sign-in verify step
    if (!isSignUp && signInStep === "verify") {
      if (otp.length !== 6) newErrors.otp = "Enter the 6-digit OTP"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})

    try {
      if (isSignUp) {
        // Signup: request OTP and route to OTPVerification
        const result = await signUp(fullName, email, dob || undefined)
        if (result.requiresOTP && result.email) {
          setOtpEmail(result.email)
          setShowOTPVerify(true)
        } else if (result.error) {
          setErrors({ submit: result.error })
        }
      } else {
        // Sign-in: two steps
        if (signInStep === "request") {
          const result = await resendOTP(email)
          if (result.error) {
            setErrors({ submit: result.error })
          } else {
            setSignInStep("verify")
            setResendCooldown(60) // start 60s cooldown after first send
            setOtp("") // clear any previous input
          }
        } else {
          const result = await signIn(email, otp, remember)
          if (result.error) setErrors({ submit: result.error })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setErrors({ email: "Enter your email first" })
      return
    }
    if (resendCooldown > 0) return
    setLoading(true)
    try {
      const result = await resendOTP(email)
      if (result.error) {
        setErrors({ submit: result.error })
      } else {
        setResendCooldown(60)
        setOtp("")
      }
    } finally {
      setLoading(false)
    }
  }

  if (showOTPVerify) {
    return <OTPVerification email={otpEmail} onBack={() => setShowOTPVerify(false)} />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isSignUp ? "Sign up" : "Sign in"}</h2>
          <p className="text-gray-600">
            {isSignUp ? "Sign up to enjoy the feature of HD" : "Please login to continue to your account."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <Input
                label="Your Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                placeholder="Jonas Kahnwald"
                iconLeft={<UserIcon className="w-4 h-4 text-gray-400" />}
                disabled={loading}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                error={errors.dob}
                placeholder="11 December 1997"
                iconLeft={<Calendar className="w-4 h-4 text-gray-400" />}
                disabled={loading}
              />
            </>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="jonas_kahnwald@gmail.com"
            iconLeft={<Mail className="w-4 h-4 text-gray-400" />}
            disabled={loading || (!isSignUp && signInStep === "verify")}
          />

          {!isSignUp && signInStep === "verify" && (
            <div className="space-y-2">
              <Input
                label="OTP"
                type={otpVisible ? "text" : "password"}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                error={errors.otp}
                placeholder="Enter 6-digit code"
                iconRight={
                  <button
                    type="button"
                    onClick={() => setOtpVisible((s) => !s)}
                    className="text-gray-400"
                    aria-label={otpVisible ? "Hide OTP" : "Show OTP"}
                  >
                    {otpVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                disabled={loading}
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={loading || resendCooldown > 0}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Keep me logged in
                </label>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
            {isSignUp ? "Get OTP" : signInStep === "request" ? "Get OTP" : "Sign In"}
          </Button>

          {!isSignUp && signInStep === "verify" && (
            <p className="text-center text-sm text-gray-600">We’ve sent a 6-digit code to your email.</p>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? "Already have an account??" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                // Reset state when switching modes
                setErrors({})
                setSignInStep("request")
                setResendCooldown(0)
                setOtp("")
                onToggle()
              }}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              disabled={loading}
            >
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
