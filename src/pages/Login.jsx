import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isSignUp && !form.name) {
      setError('Please enter your name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('floratrack_user', JSON.stringify({
        name: form.name || form.email.split('@')[0],
        email: form.email,
        loggedIn: true,
      }));
      setLoading(false);
      onLogin();
    }, 1200);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Forest Background */}
      <div className="nature-bg-container">
        <img src="/forest-bg.png" alt="" className="nature-bg-image" />
      </div>
      <div className="nature-video-overlay" />

      {/* Floating particles */}
      {['🍃', '🌿', '🍂', '🌱', '🍃'].map((emoji, i) => (
        <span
          key={i}
          className={`leaf-particle leaf-particle-${(i % 3) + 1}`}
          style={{ top: `${10 + i * 15}%`, left: `${15 + i * 18}%`, animationDelay: `${i * 3}s` }}
        >
          {emoji}
        </span>
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--accent-forest), var(--accent-gold))',
              boxShadow: '0 8px 30px rgba(212,168,83,0.3)',
            }}
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-[28px] font-bold text-glow" style={{ color: 'var(--text-heading)' }}>
            FloraTrack
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Your intelligent plant care companion
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[20px] p-8 overflow-hidden"
          style={{
            background: 'rgba(12, 20, 8, 0.8)',
            backdropFilter: 'blur(24px)',
            border: '0.5px solid var(--glass-border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(212,168,83,0.06)',
          }}
        >
          {/* Tab Toggle */}
          <div className="flex items-center p-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)' }}>
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              className="flex-1 py-2 rounded-full text-[13px] font-medium transition-all"
              style={!isSignUp ? {
                background: 'rgba(255,255,255,0.1)',
                color: 'var(--accent-gold-light)',
                border: '0.5px solid var(--glass-border-hover)',
              } : { color: 'var(--text-muted)', border: '0.5px solid transparent' }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              className="flex-1 py-2 rounded-full text-[13px] font-medium transition-all"
              style={isSignUp ? {
                background: 'rgba(255,255,255,0.1)',
                color: 'var(--accent-gold-light)',
                border: '0.5px solid var(--glass-border-hover)',
              } : { color: 'var(--text-muted)', border: '0.5px solid transparent' }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name (sign up only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)' }}>
                    <User className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Your name"
                      className="flex-1 bg-transparent outline-none text-[14px]"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)' }}>
                <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none text-[14px]"
                  style={{ color: 'var(--text-primary)' }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)' }}>
                <Lock className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-[14px]"
                  style={{ color: 'var(--text-primary)' }}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-md hover:bg-white/5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[12px] text-red-400 px-1"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold transition-all mt-2"
              style={{
                background: loading
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, var(--accent-forest), var(--accent-gold))',
                color: 'white',
                boxShadow: loading ? 'none' : '0 6px 25px rgba(212,168,83,0.25)',
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>or continue as</span>
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
          </div>

          {/* Guest */}
          <button
            onClick={() => {
              localStorage.setItem('floratrack_user', JSON.stringify({ name: 'Guest', email: 'guest@flora.track', loggedIn: true }));
              onLogin();
            }}
            className="w-full py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-white/8"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)', color: 'var(--text-secondary)' }}
          >
            🌱 Explore as Guest
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] mt-6" style={{ color: 'var(--text-muted)' }}>
          Built with 💚 for plant lovers
        </p>
      </motion.div>
    </div>
  );
}
