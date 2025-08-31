"use client"

import { useState } from "react"
import { AuthForm } from "./AuthForm"
import { BackgroundPattern } from "../layout/BackgroundPattern"

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-7">
      {/* Left Column - Auth Form (3/7) */}
      <div className="col-span-7 md:col-span-3 flex flex-col bg-white">
        <header className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"
              aria-hidden="true"
            ></div>
            <span className="font-semibold text-gray-900">HD</span>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md p-6">
            <AuthForm isSignUp={isSignUp} onToggle={() => setIsSignUp(!isSignUp)} />
          </div>
        </div>
      </div>

      {/* Right Column - Background Image (4/7) */}
      <div className="hidden md:flex col-span-4">
        <div className="w-full h-full">
          <BackgroundPattern />
        </div>
      </div>
    </div>
  )
}
