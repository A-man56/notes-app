import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true if port = 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code - Notes App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Verify Your Email</h2>
        <p>Your OTP code is:</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1F2937; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #6B7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
