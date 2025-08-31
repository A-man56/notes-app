import React, { useState } from "react";
import { AuthForm } from "./AuthForm";
import { BackgroundPattern } from "../layout/BackgroundPattern";

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-7">
      {/* Left Column - Auth Form (3/7) */}
      <div className="col-span-7 md:col-span-3 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-6">
          <AuthForm 
            isSignUp={isSignUp} 
            onToggle={() => setIsSignUp(!isSignUp)} 
          />
        </div>
      </div>

      {/* Right Column - Background Image (4/7) */}
      <div className="hidden md:flex col-span-4">
        <div className="w-full h-full">
          <BackgroundPattern />
        </div>
      </div>
    </div>
  );
}
