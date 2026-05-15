import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePlantContext } from '../../context/PlantContext';
import { formatISO, addDays } from 'date-fns';
import ImageUploader from '../common/ImageUploader';

const categories = ['Tropical', 'Succulents', 'Herbs', 'Ferns', 'Flowering'];
const sunlightOptions = ['Low', 'Medium', 'Bright'];

export default function PlantForm({ isOpen, onClose, initialData = null }) {
  const { dispatch } = usePlantContext();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    category: 'Tropical',
    purchaseDate: new Date().toISOString().split('T')[0],
    wateringFrequency: 7,
    sunlightPreference: 'Medium',
    notes: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        purchaseDate: initialData.purchaseDate.split('T')[0] // handle potentially full ISO strings
      });
    } else {
      setFormData({
        name: '',
        species: '',
        category: 'Tropical',
        purchaseDate: new Date().toISOString().split('T')[0],
        wateringFrequency: 7,
        sunlightPreference: 'Medium',
        notes: '',
        imageUrl: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auto-generate placeholder if no image
    const finalImageUrl = formData.imageUrl || `https://placehold.co/800x800/e5eee5/528352?text=${encodeURIComponent(formData.name)}`;

    const plantPayload = {
      ...formData,
      id: initialData ? initialData.id : crypto.randomUUID(),
      imageUrl: finalImageUrl,
      healthStatus: initialData ? initialData.healthStatus : 'Healthy',
      lastWatered: initialData ? initialData.lastWatered : formatISO(new Date()),
      nextWatering: initialData ? initialData.nextWatering : formatISO(addDays(new Date(), formData.wateringFrequency)),
      healthLogs: initialData ? initialData.healthLogs : [],
      growthLogs: initialData ? initialData.growthLogs : [],
      photos: initialData ? initialData.photos : [],
      careLogs: initialData ? initialData.careLogs : []
    };

    if (initialData) {
      dispatch({ type: 'UPDATE_PLANT', payload: plantPayload });
    } else {
      dispatch({ type: 'ADD_PLANT', payload: plantPayload });
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {initialData ? 'Edit Plant' : 'Add New Plant'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-6 flex-1">
            <form id="plant-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-lg outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }} placeholder="e.g. Monstera" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Species</label>
                  <input type="text" name="species" value={formData.species} onChange={handleChange} className="w-full p-3 rounded-lg outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }} placeholder="e.g. Monstera deliciosa" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 rounded-lg outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Purchase Date</label>
                  <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full p-3 rounded-lg outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Watering Frequency (days) <span className="text-red-500">*</span></label>
                  <input required type="number" min="1" max="90" name="wateringFrequency" value={formData.wateringFrequency} onChange={handleChange} className="w-full p-3 rounded-lg outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Sunlight Preference</label>
                  <select name="sunlightPreference" value={formData.sunlightPreference} onChange={handleChange} className="w-full p-3 rounded-lg outline-none transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                    {sunlightOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Plant Image</label>
                <ImageUploader 
                  value={formData.imageUrl} 
                  onChange={(val) => setFormData(prev => ({...prev, imageUrl: val}))} 
                  isCirclePreview={true}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full p-3 rounded-lg border border-cream-300 dark:border-nature-700 bg-white dark:bg-nature-950 focus:ring-2 focus:ring-nature-500 outline-none transition-all resize-none dark:text-cream-50" placeholder="Any special care instructions?"></textarea>
              </div>

            </form>
          </div>
          
          <div className="p-6 flex justify-end gap-4" style={{ borderTop: '0.5px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
            <button type="button" onClick={onClose} className="btn-glass">
              Cancel
            </button>
            <button type="submit" form="plant-form" className="btn-nature-primary">
              {initialData ? 'Save Changes' : 'Add Plant'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
