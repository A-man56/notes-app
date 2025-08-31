import nodemailer from "nodemailer"

type MailConfig = {
  host?: string
  port?: number
  secure?: boolean
  user?: string
  pass?: string
  from?: string
}

function getMailConfig(): MailConfig {
  const port = Number(process.env.EMAIL_PORT || 587)
  const secure = String(process.env.EMAIL_SECURE || "").toLowerCase() === "true" || port === 465
  return {
    host: process.env.EMAIL_HOST,
    port,
    secure,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  }
}

export async function sendOTPEmail(to: string, otp: string) {
  const cfg = getMailConfig()

  // If SMTP config missing, log OTP and return without failing
  if (!cfg.host || !cfg.port || !cfg.user || !cfg.pass) {
    console.warn("[v0] EMAIL_* env not fully set. Logging OTP instead.")
    console.log(`[v0] OTP for ${to}: ${otp}`)
    return
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  })

  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Your HD App OTP</h2>
      <p>Use the following One-Time Password to continue:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${otp}</p>
      <p>This code will expire in ${process.env.OTP_EXP_MINUTES || 10} minutes.</p>
    </div>
  `

  await transporter.sendMail({
    from: cfg.from,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in ${process.env.OTP_EXP_MINUTES || 10} minutes.`,
    html,
  })
}
