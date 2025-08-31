import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import { User } from "../models/User.js"
import { generateToken } from "../utils/jwt.js"
import { generateOTP, isOTPExpired } from "../utils/otp.js"
import { sendOTPEmail } from "../utils/email.js"
import bcrypt from "bcryptjs"

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ error: "Validation failed", details: errors.array() })
      return
    }

    const { firstName, lastName, email, dob } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ error: "User already exists with this email" })
      return
    }

    const otpCode = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    const otpHash = await bcrypt.hash(otpCode, 12)

    const user = new User({
      firstName,
      lastName,
      email,
      dob,
      otpCode: otpHash,
      otpExpires,
      isEmailVerified: false,
    })

    await user.save()

    try {
      await sendOTPEmail(email, otpCode)
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError)
    }

    res.status(201).json({
      message: "User created successfully. Please verify your email with the OTP sent.",
      userId: user._id,
      requiresOTP: true,
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email }).select("+otpCode +otpExpires")
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    if (!user.otpCode || !user.otpExpires) {
      res.status(400).json({ error: "No OTP found for this user" })
      return
    }

    if (isOTPExpired(user.otpExpires)) {
      res.status(400).json({ error: "OTP has expired" })
      return
    }

    const isValid = await bcrypt.compare(otp, user.otpCode)
    if (!isValid) {
      res.status(400).json({ error: "Invalid OTP" })
      return
    }

    user.isEmailVerified = true
    user.otpCode = undefined
    user.otpExpires = undefined
    await user.save()

    const token = generateToken(user._id.toString())

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    })
  } catch (error: any) {
    console.error("OTP verification error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ error: "Validation failed", details: errors.array() })
      return
    }

    const { email, otp } = req.body

    const user = await User.findOne({ email }).select("+otpCode +otpExpires")
    if (!user) {
      res.status(401).json({ error: "Invalid email or OTP" })
      return
    }

    if (!user.otpCode || !user.otpExpires) {
      res.status(400).json({ error: "Please request an OTP first" })
      return
    }

    if (isOTPExpired(user.otpExpires)) {
      res.status(400).json({ error: "OTP has expired" })
      return
    }

    const isValid = await bcrypt.compare(otp, user.otpCode)
    if (!isValid) {
      res.status(401).json({ error: "Invalid email or OTP" })
      return
    }

    user.isEmailVerified = true
    user.otpCode = undefined
    user.otpExpires = undefined
    await user.save()

    const token = generateToken(user._id.toString())

    res.json({
      message: "Signed in successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    })
  } catch (error: any) {
    console.error("Signin error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    const otpCode = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)
    const otpHash = await bcrypt.hash(otpCode, 12)

    user.otpCode = otpHash
    user.otpExpires = otpExpires
    await user.save()

    try {
      await sendOTPEmail(email, otpCode)
      res.json({ message: "OTP sent successfully" })
      return
    } catch (emailError) {
      console.error("Failed to send OTP email (continuing):", emailError)
      res.json({ message: "OTP sent successfully" })
      return
    }
  } catch (error: any) {
    console.error("Resend OTP error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    })
  } catch (error: any) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
