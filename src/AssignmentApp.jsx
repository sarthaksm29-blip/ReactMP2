import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA & CONSTANTS ---
const CATEGORIES = ['Herbs', 'Tropical', 'Ferns', 'Flowering'];

const SEED_PLANTS = [
  { id: 1, name: 'Basil', species: 'Ocimum basilicum', category: 'Herbs', progress: 40, healthScore: 8, wateringFreq: 2, lastWatered: Date.now() - 3 * 86400000, image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=300&q=80' },
  { id: 2, name: 'Monstera', species: 'Monstera deliciosa', category: 'Tropical', progress: 80, healthScore: 9, wateringFreq: 7, lastWatered: Date.now() - 1 * 86400000, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&q=80' },
  { id: 3, name: 'Boston Fern', species: 'Nephrolepis exaltata', category: 'Ferns', progress: 60, healthScore: 7, wateringFreq: 5, lastWatered: Date.now() - 6 * 86400000, image: 'https://images.unsplash.com/photo-1605553531063-2287f32cc802?w=300&q=80' },
  { id: 4, name: 'Peace Lily', species: 'Spathiphyllum', category: 'Flowering', progress: 50, healthScore: 6, wateringFreq: 4, lastWatered: Date.now() - 4 * 86400000, image: 'https://images.unsplash.com/photo-1616690248348-a901c1536ede?w=300&q=80' },
];

const ACHIEVEMENTS = [
  { id: 'a1', title: 'Seedling', desc: 'Add your first plant', icon: '🌱' },
  { id: 'a2', title: 'Hydration Hero', desc: 'Water a plant on time', icon: '💧' },
  { id: 'a3', title: 'Jungle Master', desc: 'Have 5 plants in your library', icon: '🌴' },
];

function daysSince(ts) {
  return Math.floor((Date.now() - ts) / 86400000);
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [plants, setPlants] = useState(SEED_PLANTS);
  const [activeTab, setActiveTab] = useState('library');
  const [earnedAchievements, setEarnedAchievements] = useState(['a1']);
  
  // Handlers
  const addPlant = (plant) => {
    setPlants([...plants, { ...plant, id: Date.now(), progress: 10, healthScore: 10, lastWatered: Date.now() }]);
    if (plants.length + 1 >= 5 && !earnedAchievements.includes('a3')) {
      setEarnedAchievements([...earnedAchievements, 'a3']);
      alert('Achievement Unlocked: Jungle Master! 🌴');
    }
  };

  const waterPlant = (id) => {
    setPlants(plants.map(p => p.id === id ? { ...p, lastWatered: Date.now() } : p));
    if (!earnedAchievements.includes('a2')) {
      setEarnedAchievements([...earnedAchievements, 'a2']);
      alert('Achievement Unlocked: Hydration Hero! 💧');
    }
  };

  // --- SUB-PAGES ---

  const LibraryPage = () => {
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [detailPlant, setDetailPlant] = useState(null);

    const filtered = plants
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search plants..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', width: '300px', fontSize: '14px' }}
          />
          <button 
            onClick={() => setShowAdd(true)}
            style={{ padding: '10px 20px', backgroundColor: '#2D6A4F', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add Plant
          </button>
        </div>

        {/* Categories Columns */}
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {CATEGORIES.map(cat => {
            const catPlants = filtered.filter(p => p.category === cat);
            return (
              <div key={cat} style={{ flex: '1', minWidth: '250px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ borderBottom: '2px solid #2D6A4F', paddingBottom: '8px', marginTop: 0, color: '#1B4332' }}>{cat}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  {catPlants.length === 0 ? <p style={{ color: '#888', fontSize: '13px' }}>No plants here.</p> : catPlants.map(p => {
                    const daysOver = daysSince(p.lastWatered);
                    const remaining = p.wateringFreq - daysOver;
                    let alertMsg = remaining < 0 ? `Overdue by ${Math.abs(remaining)} days!` : remaining === 0 ? 'Water today!' : `Water in ${remaining} days`;
                    let alertColor = remaining < 0 ? '#d32f2f' : remaining === 0 ? '#f57c00' : '#388e3c';

                    return (
                      <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                        <strong style={{ fontSize: '15px' }}>{p.name}</strong>
                        <div style={{ color: alertColor, fontSize: '12px', fontWeight: 'bold', backgroundColor: `${alertColor}15`, padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                          {alertMsg}
                        </div>
                        <button 
                          onClick={() => setDetailPlant(p)}
                          style={{ padding: '6px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          View Details
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Plant Modal */}
        {showAdd && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h2>Add a Plant</h2>
              <input type="text" id="addName" placeholder="Name" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              <select id="addCat" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" id="addFreq" placeholder="Watering Frequency (days)" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => {
                  const n = document.getElementById('addName').value;
                  const c = document.getElementById('addCat').value;
                  const f = parseInt(document.getElementById('addFreq').value) || 7;
                  if(n) { addPlant({ name: n, category: c, wateringFreq: f, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80' }); setShowAdd(false); }
                }} style={{ flex: 1, padding: '10px', backgroundColor: '#2D6A4F', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailPlant && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <img src={detailPlant.image} alt={detailPlant.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              <h2 style={{ margin: '0' }}>{detailPlant.name} <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>{detailPlant.species}</span></h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{detailPlant.category}</span>
                <span style={{ backgroundColor: '#E3F2FD', color: '#1565C0', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>Water every {detailPlant.wateringFreq} days</span>
              </div>
              <div>
                <strong>Health Score: </strong>{detailPlant.healthScore}/10
                <div style={{ height: '8px', backgroundColor: '#eee', borderRadius: '4px', marginTop: '4px' }}>
                  <div style={{ height: '100%', width: `${detailPlant.healthScore * 10}%`, backgroundColor: '#4CAF50', borderRadius: '4px' }} />
                </div>
              </div>
              <button onClick={() => setDetailPlant(null)} style={{ padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>Close Details</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SchedulePage = () => {
    const overdue = plants.filter(p => daysSince(p.lastWatered) > p.wateringFreq);
    const dueToday = plants.filter(p => daysSince(p.lastWatered) === p.wateringFreq);
    const wateredToday = plants.filter(p => daysSince(p.lastWatered) === 0);
    const upcoming = plants.filter(p => daysSince(p.lastWatered) < p.wateringFreq && daysSince(p.lastWatered) > 0);

    const totalDue = overdue.length + dueToday.length + wateredToday.length;
    const progress = totalDue === 0 ? 100 : (wateredToday.length / totalDue) * 100;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Watering Schedule</h2>
        
        {/* Progress Bar */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong>Today's Progress</strong>
            <span>{wateredToday.length} / {totalDue} Watered</span>
          </div>
          <div style={{ height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#1E88E5', transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* Due Summary */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, backgroundColor: '#FFEBEE', padding: '16px', borderRadius: '12px', color: '#C62828' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Overdue ({overdue.length})</h3>
            <div style={{ fontSize: '14px' }}>{overdue.map(p => p.name).join(', ') || 'None!'}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#FFF3E0', padding: '16px', borderRadius: '12px', color: '#E65100' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Due Today ({dueToday.length})</h3>
            <div style={{ fontSize: '14px' }}>{dueToday.map(p => p.name).join(', ') || 'None!'}</div>
          </div>
        </div>

        {/* Upcoming List */}
        <div>
          <h3>Upcoming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcoming.length === 0 && <p style={{ color: '#888' }}>No upcoming plants.</p>}
            {upcoming.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ display: 'block' }}>{p.name}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>In {p.wateringFreq - daysSince(p.lastWatered)} days</span>
                  </div>
                </div>
                <button onClick={() => waterPlant(p.id)} style={{ padding: '8px 16px', backgroundColor: '#E3F2FD', color: '#1565C0', border: '1px solid #90CAF9', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Mark Watered
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const GrowthPage = () => {
    const [c1, setC1] = useState(plants[0]?.id);
    const [c2, setC2] = useState(plants[1]?.id);

    const plant1 = plants.find(p => p.id === parseInt(c1));
    const plant2 = plants.find(p => p.id === parseInt(c2));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* All Plants Growth */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0 }}>All Plants Growth</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {plants.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '100px', fontSize: '14px', fontWeight: 'bold' }}>{p.name}</div>
                <div style={{ flex: 1, height: '12px', backgroundColor: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.progress}%`, backgroundColor: '#2D6A4F' }} />
                </div>
                <div style={{ width: '40px', fontSize: '13px', color: '#666', textAlign: 'right' }}>{p.progress}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Plant Comparison */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0 }}>Compare Plants</h2>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <select value={c1} onChange={e => setC1(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
              {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#888' }}>VS</div>
            <select value={c2} onChange={e => setC2(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
              {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {plant1 && plant2 && (
            <div style={{ display: 'flex', gap: '20px' }}>
              {[plant1, plant2].map(p => (
                <div key={p.id} style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <img src={p.image} alt={p.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} />
                  <h3>{p.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                    <div><strong>Category:</strong> {p.category}</div>
                    <div><strong>Health:</strong> {p.healthScore}/10</div>
                    <div><strong>Growth:</strong> {p.progress}%</div>
                    <div><strong>Watering:</strong> Every {p.wateringFreq} days</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SeasonalAlertPage = () => {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#FFF3E0', color: '#E65100', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '48px' }}>☀️</div>
          <div>
            <h2 style={{ margin: '0 0 8px 0' }}>Summer Care Alert</h2>
            <p style={{ margin: 0, lineHeight: '1.5' }}>
              Temperatures are rising! Ensure your Tropical plants and Ferns stay hydrated. 
              Increase watering frequency slightly and mist leaves to maintain humidity. Keep delicate plants out of direct afternoon sunlight.
            </p>
          </div>
        </div>

        <h3 style={{ marginTop: '30px' }}>Affected Plants</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {plants.filter(p => p.category === 'Tropical' || p.category === 'Ferns').map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #FFCC80' }}>
              <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
              <div>
                <strong style={{ display: 'block' }}>{p.name}</strong>
                <span style={{ fontSize: '12px', color: '#E65100' }}>Requires extra misting</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AchievementsPage = () => {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2>My Achievements</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {ACHIEVEMENTS.map(ach => {
            const isEarned = earnedAchievements.includes(ach.id);
            return (
              <div key={ach.id} style={{ 
                backgroundColor: isEarned ? '#E8F5E9' : '#f5f5f5', 
                border: isEarned ? '2px solid #4CAF50' : '2px dashed #ccc',
                borderRadius: '16px', padding: '20px', textAlign: 'center',
                opacity: isEarned ? 1 : 0.6
              }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{ach.icon}</div>
                <h3 style={{ margin: '0 0 5px 0', color: isEarned ? '#2E7D32' : '#888' }}>{ach.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{ach.desc}</p>
                {!isEarned && <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 'bold', color: '#999' }}>LOCKED</div>}
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  // --- SIDEBAR NAVIGATION ---
  const navItems = [
    { id: 'library', label: 'Library', icon: '🌿' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'growth', label: 'Growth & Compare', icon: '📈' },
    { id: 'seasonal', label: 'Seasonal Alerts', icon: '🌤️' },
    { id: 'achievements', label: 'Achievements (Unique)', icon: '🏆' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'system-ui, sans-serif', backgroundColor: '#F4F7F2', color: '#1A2218' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '250px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', fontSize: '22px', fontWeight: 'bold', color: '#2D6A4F', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌿</span> FloraTrack
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 10px', gap: '8px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                backgroundColor: activeTab === item.id ? '#EAF3DE' : 'transparent',
                color: activeTab === item.id ? '#2D6A4F' : '#666',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '15px', fontWeight: activeTab === item.id ? 'bold' : 'normal',
                textAlign: 'left', transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP NAV / DASHBOARD KINDA THING */}
        <div style={{ height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: '20px', textTransform: 'capitalize' }}>
            {activeTab.replace('-', ' ')}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>{plants.length} Plants</span>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#2D6A4F', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              SM
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {activeTab === 'library' && <LibraryPage />}
          {activeTab === 'schedule' && <SchedulePage />}
          {activeTab === 'growth' && <GrowthPage />}
          {activeTab === 'seasonal' && <SeasonalAlertPage />}
          {activeTab === 'achievements' && <AchievementsPage />}
        </main>
      </div>
      
    </div>
  );
}
