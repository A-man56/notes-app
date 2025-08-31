import { Router } from "express"
import { body } from "express-validator"
import { signUp, signIn, verifyOTP, resendOTP, getProfile } from "../controllers/authController.js"
import { authenticateToken } from "../middleware/auth.js"

const router = Router()

// Validation rules
const signUpValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be less than 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be less than 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("dob").optional().isISO8601().toDate().withMessage("DOB must be a valid date"),
]

const signInValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
]

const otpValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
]

// Routes
router.post("/signup", signUpValidation, signUp)
router.post("/signin", signInValidation, signIn)
router.post("/verify-otp", otpValidation, verifyOTP)
router.post("/resend-otp", [body("email").isEmail().normalizeEmail()], resendOTP)
router.get("/profile", authenticateToken, getProfile)

export default router
