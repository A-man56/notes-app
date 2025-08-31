import React, { useState } from 'react';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { OTPVerification } from './OTPVerification';

interface AuthFormProps {
  isSignUp: boolean;
  onToggle: () => void;
}

export function AuthForm({ isSignUp, onToggle }: AuthFormProps) {
  const { signUp, signIn } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isSignUp) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (isSignUp && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.firstName, formData.lastName, formData.email, formData.password);
        if (result.requiresOTP && result.email) {
          setOtpEmail(result.email);
          setShowOTP(true);
          setLoading(false);
          return;
        }
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (result.error) {
        setErrors({ submit: result.error });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Google OAuth would be implemented here
    setErrors({ submit: 'Google OAuth integration coming soon!' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackFromOTP = () => {
    setShowOTP(false);
    setOtpEmail('');
  };

  if (showOTP) {
    return <OTPVerification email={otpEmail} onBack={handleBackFromOTP} />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account to get started' : 'Welcome back! Please sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                placeholder="John"
                disabled={loading}
              />
              <Input
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                placeholder="Doe"
                disabled={loading}
              />
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="john@example.com"
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            placeholder="Enter your password"
            disabled={loading}
          />

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            disabled={loading}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={onToggle}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              disabled={loading}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}