import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import OnboardingModal from '../onboarding/OnboardingModal';
import BotanistChat from '../botanist/BotanistChat';
import { usePlantContext } from '../../context/PlantContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle, XCircle, Droplet, Sparkles } from 'lucide-react';

// Floating leaf particles data
const leafParticles = [
  { emoji: '🍃', top: '5%', left: '10%', delay: '0s', cls: 'leaf-particle-1' },
  { emoji: '🌿', top: '15%', left: '70%', delay: '5s', cls: 'leaf-particle-2' },
  { emoji: '🍂', top: '8%', left: '40%', delay: '10s', cls: 'leaf-particle-3' },
  { emoji: '🍃', top: '3%', left: '85%', delay: '15s', cls: 'leaf-particle-1' },
  { emoji: '🌿', top: '12%', left: '25%', delay: '8s', cls: 'leaf-particle-2' },
  { emoji: '🍂', top: '2%', left: '55%', delay: '20s', cls: 'leaf-particle-3' },
];

// Firefly positions
const fireflies = [
  { top: '20%', left: '15%', delay: '0s', duration: '4s' },
  { top: '40%', left: '80%', delay: '1.5s', duration: '5s' },
  { top: '60%', left: '30%', delay: '3s', duration: '3.5s' },
  { top: '75%', left: '65%', delay: '2s', duration: '4.5s' },
  { top: '35%', left: '50%', delay: '4s', duration: '3s' },
  { top: '85%', left: '20%', delay: '1s', duration: '5.5s' },
  { top: '50%', left: '90%', delay: '2.5s', duration: '4s' },
  { top: '15%', left: '45%', delay: '3.5s', duration: '6s' },
];

export default function Layout() {
  const { state, dispatch } = usePlantContext();
  const [isBotanistOpen, setIsBotanistOpen] = useState(false);

  const handleCloseToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };

  const getToastIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'info': return <Info className="w-5 h-5 text-sky-400" />;
      case 'milestone': return <Droplet className="w-5 h-5 text-blue-400" />;
      default: return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getToastIconBg = (type) => {
    switch(type) {
      case 'success': return 'bg-emerald-500/15';
      case 'warning': return 'bg-amber-500/15';
      case 'error': return 'bg-red-500/15';
      case 'info': return 'bg-sky-500/15';
      case 'milestone': return 'bg-blue-500/15';
      default: return 'bg-emerald-500/15';
    }
  };

  const toast = state.globalToast;

  return (
    <div className="flex h-screen overflow-hidden relative">
      
      {/* ── Forest Background Image (animated slow zoom) ── */}
      <div className="nature-bg-container">
        <img 
          src="/forest-bg.png" 
          alt="" 
          className="nature-bg-image"
        />
      </div>
      
      {/* Dark overlay */}
      <div className="nature-video-overlay" />

      {/* ── Floating Leaf Particles ── */}
      {leafParticles.map((leaf, i) => (
        <span
          key={i}
          className={`leaf-particle ${leaf.cls}`}
          style={{ top: leaf.top, left: leaf.left, animationDelay: leaf.delay }}
        >
          {leaf.emoji}
        </span>
      ))}

      {/* ── Firefly Glows ── */}
      {fireflies.map((ff, i) => (
        <div
          key={`ff-${i}`}
          className="firefly"
          style={{ 
            top: ff.top, 
            left: ff.left, 
            animationDelay: ff.delay,
            animationDuration: ff.duration 
          }}
        />
      ))}

      {/* ── App Shell ── */}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-[32px] py-[28px]">
          <Outlet />
        </main>
      </div>
      <OnboardingModal />

      {/* Flora AI Botanist */}
      <BotanistChat isOpen={isBotanistOpen} onClose={() => setIsBotanistOpen(false)} />

      {/* Flora AI FAB */}
      {!isBotanistOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBotanistOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-[190] group"
          style={{
            background: 'linear-gradient(135deg, var(--accent-forest), var(--accent-gold))',
            boxShadow: '0 6px 25px rgba(212,168,83,0.35), 0 0 20px rgba(59,109,17,0.2)',
          }}
          title="Ask Flora AI"
        >
          <Sparkles className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 animate-pulse" style={{ background: '#4ADE80', borderColor: 'rgba(12,20,8,0.85)' }} />
        </motion.button>
      )}

      {/* Global Toasts (Top Center) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-card pointer-events-auto overflow-hidden min-w-[300px] max-w-[400px]"
            >
              <div className="p-[12px_16px] flex items-start gap-3 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.style?.background ? '' : getToastIconBg(toast.type)}`} style={toast.style ? { backgroundColor: toast.style.background } : {}}>
                  {getToastIcon(toast.type)}
                </div>
                
                <div className="flex-1 min-w-0 pt-1">
                  <h4 className="text-[13px] font-[500] leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {toast.title || toast.message}
                  </h4>
                  {toast.subtitle && (
                    <p className="text-[12px] mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{toast.subtitle}</p>
                  )}
                </div>

                <button onClick={handleCloseToast} className="p-1 rounded-md transition-colors shrink-0" style={{ color: 'var(--text-muted)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar (Auto-dismiss) */}
              <div className="h-[3px] w-full absolute bottom-0 left-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full toast-progress origin-left" style={{ background: 'var(--accent-gold)' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
