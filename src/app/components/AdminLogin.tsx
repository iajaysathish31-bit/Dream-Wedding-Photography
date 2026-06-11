import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, User, Camera } from 'lucide-react';
import {
  GoldLineFloral,
  WatercolorPoppy,
  BabysBreath,
  FloralDivider,
  FloatingPetals
} from './FloralDecoration';

interface AdminLoginProps {
  onLoginSuccess: (accessToken: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Password reset states
  const [isForgot, setIsForgot] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetPreviewUrl, setResetPreviewUrl] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setResetPreviewUrl('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send reset code');
        setLoading(false);
        return;
      }

      setCodeSent(true);
      if (data.previewUrl) {
        setResetPreviewUrl(data.previewUrl);
      }
      setSuccessMessage(data.debugMode 
        ? 'Verification code generated! (Saved to data/email_preview.html for local testing)' 
        : 'Verification code has been sent.');
      setLoading(false);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        setLoading(false);
        return;
      }

      // Success
      setIsForgot(false);
      setCodeSent(false);
      setVerificationCode('');
      setNewPassword('');
      setPassword('');
      setResetPreviewUrl('');
      setSuccessMessage('Password reset successfully! Please sign in.');
      setLoading(false);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const response = await fetch('/api/auth/check-setup');
      if (response.ok) {
        const data = await response.json();
        setHasAdmin(data.hasAdmin);
        if (!data.hasAdmin) {
          setIsRegistering(true);
        }
      }
    } catch (e) {
      console.error('Failed to check setup', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      onLoginSuccess(data.session.access_token);
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Automatically login after signup
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        setError('Account created, but automatic login failed. Please log in.');
        setIsRegistering(false);
        setHasAdmin(true);
        setLoading(false);
        return;
      }

      onLoginSuccess(loginData.session.access_token);
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (hasAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF5EB] via-[#FCFAF2] to-[#EADBC8] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EB] via-[#FCFAF2] to-[#EADBC8] flex items-center justify-center p-4 relative overflow-y-auto overflow-x-hidden">
      {/* Floating Petals Micro-animation */}
      <FloatingPetals />

      {/* Background camera lights & elegant floral watermarks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#E6DFD3]/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-[450px] h-[450px] bg-white/90 rounded-full blur-[120px]" />
        
        {/* Elegant Floral Watermarks scaled to lg to prevent empty space and bleed issues */}
        <WatercolorPoppy position="top-left" size="lg" opacity={0.2} />
        <GoldLineFloral position="top-right" size="lg" opacity={0.25} />
        <BabysBreath position="bottom-left" size="lg" opacity={0.25} />
        <GoldLineFloral position="bottom-right" size="lg" opacity={0.25} className="rotate-180" />
        <WatercolorPoppy position="center" size="full" opacity={0.03} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md z-10 my-4"
      >
        {/* Glass card - Sized to fit contents exactly, eliminating empty space */}
        <div className="backdrop-blur-xl bg-[#FCFAF2]/95 border border-[#C5A880]/25 rounded-2xl shadow-[0_12px_40px_rgba(197,168,128,0.08)] py-8 px-7 relative overflow-hidden w-full">
          {/* Card corner floral accents on all four corners using GoldLineFloral */}
          <GoldLineFloral position="absolute" className="-top-8 -left-8 w-20 h-20 rotate-90" size="xs" opacity={0.3} />
          <GoldLineFloral position="absolute" className="-top-8 -right-8 w-20 h-20 rotate-180" size="xs" opacity={0.3} />
          <GoldLineFloral position="absolute" className="-bottom-8 -right-8 w-20 h-20 -rotate-90" size="xs" opacity={0.3} />
          <GoldLineFloral position="absolute" className="-bottom-8 -left-8 w-20 h-20" size="xs" opacity={0.3} />

          {/* Logo/Header */}
          <div className="text-center mb-6 relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#FCFAF2] via-[#FAF5EB] to-[#EADBC8] rounded-full mb-3 shadow-[0_4px_16px_rgba(197,168,128,0.12)]"
            >
              <Camera className="w-6 h-6 text-[#C5A880]" />
            </motion.div>
            <div className="mb-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold block" style={{ fontFamily: 'var(--font-body)' }}>
                Dream Wedding Photography
              </span>
              <h1 className="text-3xl font-light text-[#2E2820] mt-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {isForgot 
                  ? (codeSent ? 'Verify Reset Code' : 'Reset Password')
                  : (isRegistering ? 'Create Admin Account' : 'Admin Portal')}
              </h1>
            </div>
            <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-body)' }}>
              {isForgot
                ? (codeSent ? 'Enter code and new password' : 'Enter email to receive code')
                : (isRegistering 
                  ? (hasAdmin ? 'Register a new admin user' : 'Setup credentials')
                  : 'Manage inquiries, sessions, and configuration')}
            </p>
          </div>

          {/* Form */}
          <form 
            onSubmit={
              isForgot 
                ? (codeSent ? handleResetPassword : handleForgotPassword) 
                : (isRegistering ? handleSignup : handleLogin)
            } 
            className="space-y-4 relative z-10"
          >
            {isForgot ? (
              <>
                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8074]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={codeSent}
                      className="w-full pl-10 pr-4 py-2 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all disabled:opacity-75 disabled:bg-slate-50"
                      style={{ fontFamily: 'var(--font-body)' }}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                {/* Verification Code */}
                {codeSent && (
                  <div>
                    <label htmlFor="verification-code" className="block text-xs font-medium text-slate-700 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                      Verification Code
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8074]" />
                      <input
                        id="verification-code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all"
                        style={{ fontFamily: 'var(--font-body)' }}
                        placeholder="Enter 6-digit code"
                      />
                    </div>
                  </div>
                )}

                {/* New Password */}
                {codeSent && (
                  <div>
                    <label htmlFor="new-password" className="block text-xs font-medium text-slate-700 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8074]" />
                      <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-11 py-2 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all"
                        style={{ fontFamily: 'var(--font-body)' }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8074] hover:text-[#2E2820] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Name Input (Register only) */}
                {isRegistering && (
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8074]" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all"
                        style={{ fontFamily: 'var(--font-body)' }}
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8074]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all"
                      style={{ fontFamily: 'var(--font-body)' }}
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8074]" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-11 py-2 bg-[#FDFDFB] border border-[#C5A880]/35 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all"
                      style={{ fontFamily: 'var(--font-body)' }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8074] hover:text-[#2E2820] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end text-xs py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(true);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-[#C5A880] hover:underline hover:text-[#2E2820] transition-colors font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-[#FAF5EB] border border-[#C5A880]/40 rounded-lg text-xs text-[#C5A880] font-medium space-y-2 text-left"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <div>{successMessage}</div>
                {resetPreviewUrl && (
                  <div className="pt-2 border-t border-[#C5A880]/20 mt-1">
                    <a 
                      href={resetPreviewUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2E2820] hover:text-[#C5A880] font-semibold underline inline-flex items-center gap-1 transition-colors"
                    >
                      ✨ Click here to view your Ethereal Inbox Preview
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-6 bg-gradient-to-r from-[#C5A880] to-[#DFB59F] hover:from-[#B59870] hover:to-[#CF9F87] text-white font-semibold rounded-lg shadow-[0_4px_12px_rgba(197,168,128,0.15)] hover:shadow-[0_6px_20px_rgba(197,168,128,0.25)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none text-sm mt-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {loading 
                ? 'Processing...' 
                : (isForgot 
                  ? (codeSent ? 'Update Password' : 'Send Verification Code') 
                  : (isRegistering ? 'Create Account' : 'Sign In'))}
            </button>
          </form>

          {/* Toggle + Footer */}
          <div className="text-center mt-6 relative z-10 space-y-4">
            {isForgot ? (
              <>
                <FloralDivider />
                <button
                  type="button"
                  onClick={() => {
                    setIsForgot(false);
                    setCodeSent(false);
                    setError('');
                    setSuccessMessage('');
                    setResetPreviewUrl('');
                  }}
                  className="text-xs text-[#C5A880] hover:text-[#2E2820] hover:underline cursor-pointer focus:outline-none"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Back to Sign In
                </button>
              </>
            ) : hasAdmin && (
              <>
                <FloralDivider />
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                  className="text-xs text-[#C5A880] hover:text-[#2E2820] hover:underline cursor-pointer focus:outline-none"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {isRegistering ? 'Already have an account? Sign In' : 'Create new admin account'}
                </button>
              </>
            )}

            {/* Footer note */}
            <p className="text-[10px] text-center text-slate-400" style={{ fontFamily: 'var(--font-body)' }}>
              For authorized administrators only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}