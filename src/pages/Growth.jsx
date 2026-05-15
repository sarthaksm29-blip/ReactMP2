import React, { useState, useMemo } from 'react';
import { usePlantContext } from '../context/PlantContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format, parseISO, differenceInDays } from 'date-fns';
import { TrendingUp, Award, Activity, Plus, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function Growth() {
  const { state, dispatch } = usePlantContext();
  
  // Plants with growth logs
  const plantsWithLogs = state.plants.filter(p => p.growthLogs && p.growthLogs.length > 0);
  
  // Initial selected plants for chips
  const [selectedPlants, setSelectedPlants] = useState(
    plantsWithLogs.slice(0, 3).map(p => p.id)
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper for Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Chip Selection Logic
  const togglePlantSelection = (id) => {
    if (selectedPlants.includes(id)) {
      setSelectedPlants(prev => prev.filter(p => p !== id));
    } else {
      if (selectedPlants.length >= 3) {
        showToast("Max 3 plants at a time — deselect one first");
      } else {
        setSelectedPlants(prev => [...prev, id]);
      }
    }
  };

  const chartColors = ['#D4A853', '#5B9BD5', '#D4883A'];
  const selectedPlantsData = state.plants.filter(p => selectedPlants.includes(p.id));

  // Build Composite Chart Data
  const comparisonData = useMemo(() => {
    let data = [];
    const dateSet = new Set();
    
    selectedPlantsData.forEach(p => {
      p.growthLogs.forEach(log => dateSet.add(log.date));
    });

    Array.from(dateSet).sort().forEach(date => {
      let entry = { date };
      selectedPlantsData.forEach(p => {
        const log = p.growthLogs.find(l => l.date === date);
        if (log) {
          entry[p.name] = log.height;
        }
      });
      data.push(entry);
    });
    return data;
  }, [selectedPlantsData]);

  // Calculations for Stats and All Trends Panel
  const trendsData = useMemo(() => {
    let totalLogs = 0;
    let plantRates = [];

    const sortedTrends = plantsWithLogs.map(p => {
      totalLogs += p.growthLogs.length;
      
      const sortedLogs = [...p.growthLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
      const first = sortedLogs[0];
      const last = sortedLogs[sortedLogs.length - 1];
      const latestHeight = last.height;
      
      let ratePerMonth = 0;
      if (sortedLogs.length >= 2) {
        const days = differenceInDays(parseISO(last.date), parseISO(first.date));
        if (days > 0) {
          ratePerMonth = ((last.height - first.height) / (days / 30.44));
        } else {
          // Fallback if logged on same day but different heights (edge case)
          ratePerMonth = last.height - first.height;
        }
        plantRates.push({ name: p.name, rate: ratePerMonth });
      }

      return {
        ...p,
        latestHeight,
        sortedLogs
      };
    }).sort((a, b) => b.latestHeight - a.latestHeight);

    let avgGrowthRate = 0;
    let fastestGrower = { name: '-', rate: 0 };

    if (plantRates.length > 0) {
      avgGrowthRate = plantRates.reduce((sum, p) => sum + p.rate, 0) / plantRates.length;
      fastestGrower = plantRates.reduce((max, p) => p.rate > max.rate ? p : max, plantRates[0]);
    }

    return { totalLogs, avgGrowthRate, fastestGrower, sortedTrends };
  }, [plantsWithLogs]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-3 shadow-lg z-[200] font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(212,168,83,0.15), rgba(59,109,17,0.1))' }}>
          <div className="p-3 rounded-xl" style={{ background: 'var(--warning-bg)' }}><Award className="w-8 h-8" style={{ color: 'var(--accent-gold)' }} /></div>
          <div>
            <p className="font-medium" style={{ color: 'var(--accent-gold)' }}>Fastest Grower</p>
            <p className="text-2xl font-bold truncate max-w-[180px]" style={{ color: 'var(--text-heading)' }} title={`${trendsData.fastestGrower.name} · ${trendsData.fastestGrower.rate.toFixed(1)} cm/mo`}>
              {trendsData.fastestGrower.name !== '-' ? `${trendsData.fastestGrower.name} · ${trendsData.fastestGrower.rate.toFixed(1)} cm/mo` : '-'}
            </p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'var(--info-bg)' }}><Activity className="w-8 h-8" style={{ color: 'var(--info)' }} /></div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Total Logs</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {trendsData.totalLogs}
            </p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'var(--warning-bg)' }}><TrendingUp className="w-8 h-8" style={{ color: 'var(--accent-amber)' }} /></div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Avg Growth Rate</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {trendsData.avgGrowthRate > 0 ? `${trendsData.avgGrowthRate.toFixed(1)} cm / mo` : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Comparison Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Growth Comparison</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select up to 3 plants</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-nature-primary flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Log Height
            </button>
          </div>
          
          <div className="h-80 w-full mb-6">
            {comparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tickFormatter={(val) => format(parseISO(val), 'MMM d')} stroke="rgba(245,237,224,0.3)" />
                  <YAxis stroke="rgba(245,237,224,0.3)" unit="cm" />
                  <Tooltip 
                    labelFormatter={(val) => format(parseISO(val), 'MMM d, yyyy')}
                    contentStyle={{ borderRadius: '8px', border: '0.5px solid var(--glass-border)', background: 'rgba(15,25,10,0.9)', color: 'var(--text-primary)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Legend />
                  {selectedPlantsData.map((p, index) => (
                    <Line 
                      key={p.id} 
                      type="monotone" 
                      dataKey={p.name} 
                      stroke={chartColors[index % chartColors.length]} 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center rounded-xl" style={{ border: '2px dashed var(--glass-border)', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)' }}>
                 Select plants below to compare their growth.
               </div>
            )}
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x">
            {plantsWithLogs.map(plant => {
              const isSelected = selectedPlants.includes(plant.id);
              return (
                <button
                  key={plant.id}
                  onClick={() => togglePlantSelection(plant.id)}
                  className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors`}
                  style={isSelected ? {
                    background: 'rgba(212,168,83,0.15)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold-light)',
                  } : {
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)',
                  }}
                >
                  <div className={`w-2 h-2 rounded-full`} style={{ background: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)' }} />
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {plant.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Individual Sparklines */}
        <div className="glass-card p-6 flex flex-col h-full">
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>All Plant Trends</h3>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
            {trendsData.sortedTrends.map((plant, idx) => (
              <React.Fragment key={plant.id}>
                <Link to={`/plants/${plant.id}`} className="block group">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-[13px] group-hover:opacity-80 transition-colors" style={{ color: 'var(--text-primary)' }}>{plant.name}</h4>
                    <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{plant.latestHeight}cm</span>
                  </div>
                  <div className="h-[36px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={plant.sortedLogs}>
                        <Line type="monotone" dataKey="height" stroke="var(--accent-gold)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Link>
                {idx < trendsData.sortedTrends.length - 1 && (
                  <div className="h-px my-4" style={{ background: 'var(--glass-border)' }} />
                )}
              </React.Fragment>
            ))}
            {trendsData.sortedTrends.length === 0 && (
              <div className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>
                No growth data recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Log Height Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <LogHeightModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={(plantId) => {
              if (!selectedPlants.includes(plantId)) {
                togglePlantSelection(plantId);
              }
              showToast("Growth logged successfully!");
            }}
            defaultPlantId={selectedPlants[0] || (state.plants.length > 0 ? state.plants[0].id : null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// Log Height Modal Component
function LogHeightModal({ onClose, onSave, defaultPlantId }) {
  const { state, dispatch } = usePlantContext();
  const [plantId, setPlantId] = useState(defaultPlantId);
  const [height, setHeight] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');

  const selectedPlant = state.plants.find(p => p.id === plantId);
  
  // Calculate Diff
  const sortedLogs = selectedPlant && selectedPlant.growthLogs ? [...selectedPlant.growthLogs].sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
  const lastEntry = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;

  const getDiffBadge = () => {
    if (!lastEntry) return <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-medium text-xs border border-teal-200">First entry!</span>;
    if (!height) return null;
    const diff = parseFloat(height) - lastEntry.height;
    if (isNaN(diff)) return null;
    if (diff > 0) return <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold text-xs border border-green-200">+{diff} cm</span>;
    if (diff < 0) return <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-bold text-xs border border-red-200">{diff} cm</span>;
    return <span className="text-nature-500 bg-nature-50 px-2 py-0.5 rounded font-medium text-xs border border-nature-200">No change</span>;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plantId || !height) return;
    
    dispatch({
      type: 'ADD_GROWTH_LOG',
      payload: {
        plantId,
        log: {
          id: `g_${Date.now()}`,
          date,
          height: parseFloat(height),
          notes
        }
      }
    });

    onSave(plantId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md glass-card shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
          <h3 className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>Log Plant Height</h3>
          <button onClick={onClose} className="p-1 transition-colors rounded-lg hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Plant</label>
            <select 
              value={plantId || ''} 
              onChange={e => setPlantId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }}
              required
            >
              <option value="" disabled>Select a plant...</option>
              {state.plants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Height (cm)</label>
              {getDiffBadge()}
            </div>
            <input 
              type="number" 
              step="0.5" 
              min="1"
              value={height} 
              onChange={e => setHeight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }}
              required
              placeholder="e.g. 45"
            />
            {lastEntry && (
              <p className="text-xs text-nature-400 mt-1">
                Last recorded: {lastEntry.height}cm on {format(parseISO(lastEntry.date), 'MMM d, yyyy')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes (optional)</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              rows="2"
              className="w-full px-4 py-2.5 rounded-lg outline-none transition-all resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }}
              placeholder="Any recent changes?"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="btn-nature-primary w-full py-3 text-lg flex justify-center items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Save Growth Log
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
