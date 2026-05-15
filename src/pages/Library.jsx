import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List, Search, Leaf } from 'lucide-react';
import { usePlantContext } from '../context/PlantContext';
import PlantCard from '../components/plant/PlantCard';
import PlantForm from '../components/plant/PlantForm';
import ComparePanel from '../components/library/ComparePanel';

export default function Library() {
  const { state, dispatch } = usePlantContext();
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterHealth, setFilterHealth] = useState('All');
  const [sortBy, setSortBy] = useState('Name (A-Z)');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [comparedPlantIds, setComparedPlantIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const categories = [
    { id: 'All', label: 'All' },
    { id: 'Succulents', label: 'Succulents 🌵' },
    { id: 'Tropical', label: 'Tropical 🌿' },
    { id: 'Herbs', label: 'Herbs 🌱' },
    { id: 'Ferns', label: 'Ferns' },
    { id: 'Flowering', label: 'Flowering 🌸' }
  ];
  const healthStatuses = ['All', 'Healthy', 'Needs Attention', 'Critical'];
  const sortOptions = ['Name (A-Z)', 'Date Added', 'Next Watering', 'Health Score'];

  const filteredPlants = useMemo(() => {
    let result = state.plants;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.species.toLowerCase().includes(q));
    }
    if (filterCategory !== 'All') result = result.filter(p => p.category === filterCategory);
    if (filterHealth !== 'All') result = result.filter(p => p.healthStatus === filterHealth);
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'Name (A-Z)': return a.name.localeCompare(b.name);
        case 'Date Added': return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        case 'Next Watering': return new Date(a.nextWatering) - new Date(b.nextWatering);
        case 'Health Score':
          const hm = { 'Healthy': 1, 'Needs Attention': 2, 'Critical': 3 };
          return hm[a.healthStatus] - hm[b.healthStatus];
        default: return 0;
      }
    });
    return result;
  }, [state.plants, searchQuery, filterCategory, filterHealth, sortBy]);

  const handleEdit = (plant) => { setEditingPlant(plant); setIsFormOpen(true); };
  const handleDelete = (plant) => { dispatch({ type: 'DELETE_PLANT', payload: plant.id }); };
  const handleOpenForm = () => { setEditingPlant(null); setIsFormOpen(true); };

  const handleToggleCompare = (plantId) => {
    setComparedPlantIds(prev => {
      if (prev.includes(plantId)) return prev.filter(id => id !== plantId);
      if (prev.length >= 3) { showToast("You can compare up to 3 plants at a time"); return prev; }
      return [...prev, plantId];
    });
  };

  const clearFilters = () => { setSearchQuery(''); setFilterCategory('All'); setFilterHealth('All'); setSortBy('Name (A-Z)'); };
  const showToast = (message) => { setToastMessage(message); setTimeout(() => setToastMessage(null), 3000); };

  const comparedPlants = comparedPlantIds.map(id => state.plants.find(p => p.id === id)).filter(Boolean);
  const isComparing = comparedPlantIds.length >= 2;

  const selectStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '0.5px solid var(--glass-border)',
    color: 'var(--text-secondary)',
  };

  return (
    <div className={`space-y-6 transition-all duration-300 pb-10 ${isComparing ? 'pr-[340px]' : ''}`}>
      
      {/* Filter Bar */}
      <div className="glass-card p-[12px_16px] flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
          <div className="w-full md:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" placeholder="Search library..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select value={filterHealth} onChange={e => setFilterHealth(e.target.value)} className="px-3 py-2 rounded-[8px] text-[13px]" style={selectStyle}>
              <option disabled>Health Status</option>
              {healthStatuses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-[8px] text-[13px]" style={selectStyle}>
              <option disabled>Sort By</option>
              {sortOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-1 p-1 rounded-[8px]" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)' }}>
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-[4px] transition-colors ${view === 'grid' ? 'bg-white/10 shadow-sm' : 'hover:bg-white/5'}`} style={{ color: view === 'grid' ? 'var(--accent-gold)' : 'var(--text-muted)' }} title="Grid View">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-[4px] transition-colors ${view === 'list' ? 'bg-white/10 shadow-sm' : 'hover:bg-white/5'}`} style={{ color: view === 'list' ? 'var(--accent-gold)' : 'var(--text-muted)' }} title="List View">
                <List className="w-4 h-4" />
              </button>
            </div>
            <button onClick={handleOpenForm} className="btn-nature-primary flex items-center gap-2 ml-auto md:ml-0 whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add Plant
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(c => (
            <button key={c.id} onClick={() => setFilterCategory(c.id)}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap"
              style={filterCategory === c.id ? {
                background: 'rgba(212,168,83,0.15)', border: '0.5px solid var(--accent-gold)', color: 'var(--accent-gold-light)',
              } : {
                background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)', color: 'var(--text-secondary)',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plant Grid/List */}
      {filteredPlants.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 glass-card text-center min-h-[400px]" style={{ border: '1px dashed var(--glass-border-hover)' }}>
          <Leaf className="w-20 h-20 mb-6" strokeWidth={1} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <h3 className="text-xl font-[500] mb-2" style={{ color: 'var(--text-heading)' }}>No plants match your filters</h3>
          <p className="text-[14px] mb-6 max-w-md" style={{ color: 'var(--text-muted)' }}>Try a different category or clear filters to see your full library.</p>
          <button onClick={clearFilters} className="btn-glass">Clear filters</button>
        </motion.div>
      ) : (
        <motion.div layout className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
          <AnimatePresence>
            {filteredPlants.map(plant => (
              <motion.div key={plant.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                <PlantCard plant={plant} view={view} onEdit={handleEdit} onDelete={handleDelete} isCompared={comparedPlantIds.includes(plant.id)} onToggleCompare={handleToggleCompare} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <PlantForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={editingPlant} />
      
      <AnimatePresence>
        {isComparing && <ComparePanel plants={comparedPlants} onClose={() => setComparedPlantIds([])} />}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-3 shadow-lg z-[200] font-medium" style={{ color: 'var(--text-primary)' }}>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
