import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePlantContext } from '../../context/PlantContext';
import { Search, Bell } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const { state, dispatch } = usePlantContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef(null);

  // Click outside search
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/plants': return 'Plant Library';
      case '/schedule': return 'Watering Schedule';
      case '/growth': return 'Growth Tracker';
      case '/gallery': return 'Photo Gallery';
      case '/alerts': return 'Seasonal Alerts';
      default:
        if (location.pathname.startsWith('/plants/')) return 'Plant Details';
        return 'FloraTrack';
    }
  }

  // Filter plants based on query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      try {
        const savedIds = JSON.parse(localStorage.getItem('floratrack_recent_plants') || '[]');
        if (savedIds.length > 0) {
          const recent = savedIds.map(id => state.plants.find(p => p.id === id)).filter(Boolean);
          if (recent.length > 0) return recent.slice(0, 5);
        }
      } catch(e) {}
      return [...state.plants].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)).slice(0, 5);
    }
    
    const q = searchQuery.toLowerCase();
    return state.plants.filter(p => p.name.toLowerCase().includes(q) || p.species.toLowerCase().includes(q)).slice(0, 5);
  }, [searchQuery, state.plants]);

  // Reset selection index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleKeyDown = (e) => {
    if (!isSearchFocused) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        const selectedPlant = searchResults[selectedIndex];
        handleSelectPlant(selectedPlant.id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchFocused(false);
      setSearchQuery('');
    }
  };

  const handleSelectPlant = (id) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/plants/${id}`);
  };

  return (
    <header className="glass-navbar h-[56px] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-[18px] font-[500] text-glow" style={{ color: 'var(--text-heading)' }}>
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Smart Search Bar */}
        <div className="relative hidden md:block" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search plants..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            className={`pl-10 pr-4 py-2 rounded-full text-sm transition-all duration-200 ${isSearchFocused ? 'w-[320px]' : 'w-[200px]'}`}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '0.5px solid var(--glass-border)',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(8px)',
            }}
          />
          
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[calc(100%+8px)] left-0 right-0 glass-card shadow-xl overflow-hidden z-[100] py-2"
              >
                <div className="px-4 py-1.5 mb-1" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
                  <span className="font-medium uppercase tracking-wider text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {searchQuery ? 'Search Results' : 'Recent Plants'}
                  </span>
                </div>
                
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>No plants found for '{searchQuery}'</p>
                  </div>
                ) : (
                  searchResults.map((plant, idx) => (
                    <button
                      key={plant.id}
                      onClick={() => handleSelectPlant(plant.id)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2 transition-colors text-left ${selectedIndex === idx ? 'bg-white/5' : 'hover:bg-white/5'}`}
                    >
                      <img src={plant.imageUrl} alt={plant.name} className="w-8 h-8 rounded-full object-cover shrink-0" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80' }} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-medium truncate`} style={{ color: selectedIndex === idx ? 'var(--accent-gold-light)' : 'var(--text-primary)' }}>{plant.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{plant.category}</p>
                      </div>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link to="/alerts" className="relative p-2 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2" style={{ background: 'var(--accent-gold)', borderColor: 'rgba(10, 18, 8, 0.6)' }}></span>
        </Link>
      </div>
    </header>
  );
}
