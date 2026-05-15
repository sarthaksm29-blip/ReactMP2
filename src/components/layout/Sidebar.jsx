import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Leaf, Calendar, TrendingUp, Image as ImageIcon, Bell, RefreshCw, HelpCircle, ChevronLeft, ChevronRight, MoreVertical, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/plants", icon: Leaf, label: "Library" },
  { to: "/schedule", icon: Calendar, label: "Schedule" },
  { to: "/growth", icon: TrendingUp, label: "Growth" },
  { to: "/gallery", icon: ImageIcon, label: "Gallery" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('floratrack_sidebar_collapsed');
    return saved === 'true';
  });
  
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('floratrack_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  // Click outside to close popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data to default seed data? This will clear all your progress.")) {
      localStorage.removeItem('plantTrackerStateV3');
      window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('floratrack_user');
    window.location.reload();
  };

  // Get logged-in user info
  let userName = 'My Garden';
  let userInitials = 'FT';
  try {
    const user = JSON.parse(localStorage.getItem('floratrack_user') || '{}');
    if (user.name) {
      userName = user.name;
      const parts = user.name.trim().split(/\s+/);
      userInitials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    }
  } catch (e) {}

  return (
    <aside 
      className={`glass-sidebar flex flex-col transition-all duration-300 relative z-20 shrink-0 ${isCollapsed ? 'w-[64px]' : 'w-[220px]'}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center overflow-hidden" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
        <div className="relative">
          <Leaf className="w-8 h-8 shrink-0" style={{ color: 'var(--accent-gold)' }} />
          <div className="absolute inset-0 blur-lg opacity-40" style={{ background: 'var(--accent-gold)' }} />
        </div>
        <span className={`ml-3 font-bold text-xl tracking-tight whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100'}`} style={{ color: 'var(--text-heading)' }}>
          FloraTrack
        </span>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-1.5 px-3 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center p-[10px] rounded-xl transition-all duration-200 group overflow-hidden ${
                isActive
                  ? 'nav-active'
                  : 'nav-inactive'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(212, 168, 83, 0.15), rgba(59, 109, 17, 0.1))',
              borderLeft: '3px solid var(--accent-gold)',
              color: 'var(--accent-gold-light)',
            } : {
              color: 'var(--text-secondary)',
            }}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-[20px] h-[20px] shrink-0 mx-auto md:mx-0" />
            <span className={`ml-3 whitespace-nowrap text-sm transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 ml-0 hidden' : 'opacity-100 block'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      
      {/* Bottom Section */}
      <div className="px-3 pb-4 flex flex-col gap-2 relative" ref={popoverRef}>
        
        {/* Popover */}
        <AnimatePresence>
          {showPopover && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute bottom-full mb-2 glass-card shadow-lg overflow-hidden py-1 z-30 ${isCollapsed ? 'left-4 w-48' : 'left-3 right-3'}`}
            >
              <button
                onClick={() => {
                  window.dispatchEvent(new Event('open-onboarding'));
                  setShowPopover(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Retake Quiz
              </button>
              <button
                onClick={() => {
                  handleReset();
                  setShowPopover(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-3" />
                Reset Defaults
              </button>
              <div className="h-px mx-3 my-1" style={{ background: 'var(--glass-border)' }} />
              <button
                onClick={() => {
                  handleLogout();
                  setShowPopover(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Avatar */}
        <button 
          onClick={() => setShowPopover(!showPopover)}
          className={`flex items-center p-2 rounded-xl transition-colors overflow-hidden hover:bg-white/5 ${showPopover ? 'bg-white/5' : ''}`}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ 
            background: 'linear-gradient(135deg, var(--accent-forest), var(--accent-gold))',
            color: 'white'
          }}>
            {userInitials}
          </div>
          <div className={`ml-3 flex-1 text-left whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 block'}`}>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{userName}</p>
          </div>
          {!isCollapsed && <MoreVertical className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </button>

        {/* Toggle Collapse */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex justify-center p-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
