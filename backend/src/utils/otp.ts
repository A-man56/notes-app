import crypto from 'crypto';

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const isOTPExpired = (otpExpires: Date): boolean => {
  return new Date() > otpExpires;
};