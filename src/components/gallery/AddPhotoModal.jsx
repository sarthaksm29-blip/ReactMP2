import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { usePlantContext } from '../../context/PlantContext';
import ImageUploader from '../common/ImageUploader';

export default function AddPhotoModal({ isOpen, onClose, initialPlantId = '' }) {
  const { state, dispatch } = usePlantContext();
  const [formData, setFormData] = useState({
    plantId: '',
    date: new Date().toISOString().split('T')[0],
    caption: '',
    src: ''
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        plantId: initialPlantId || (state.plants.length > 0 ? state.plants[0].id : ''),
        date: new Date().toISOString().split('T')[0],
        caption: '',
        src: ''
      });
      setShowToast(false);
    }
  }, [isOpen, initialPlantId, state.plants]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.src) {
      alert("Please upload an image or paste a URL.");
      return;
    }

    const selectedPlant = state.plants.find(p => p.id === formData.plantId);
    
    dispatch({
      type: 'ADD_PHOTO',
      payload: {
        plantId: formData.plantId,
        photo: {
          id: crypto.randomUUID(),
          date: formData.date,
          caption: formData.caption,
          src: formData.src,
          addedAt: new Date().toISOString()
        }
      }
    });

    // Show Toast
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-nature-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col relative"
        >
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-50 text-green-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 z-10 font-medium text-sm border border-green-200"
            >
              <CheckCircle className="w-4 h-4" />
              Photo added successfully!
            </motion.div>
          )}

          <div className="flex items-center justify-between p-6 border-b border-cream-200 dark:border-nature-800">
            <h2 className="text-xl font-bold text-nature-800 dark:text-nature-200">
              Add Photo
            </h2>
            <button onClick={onClose} className="p-2 text-nature-500 hover:bg-cream-100 dark:hover:bg-nature-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto p-6 flex-1">
            <form id="add-photo-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-nature-700 dark:text-nature-300">Plant <span className="text-red-500">*</span></label>
                <select 
                  required
                  value={formData.plantId} 
                  onChange={(e) => setFormData(prev => ({...prev, plantId: e.target.value}))}
                  className="w-full p-3 rounded-lg border border-cream-300 dark:border-nature-700 bg-white dark:bg-nature-950 focus:ring-2 focus:ring-[#639922] outline-none transition-all dark:text-cream-50"
                >
                  <option value="" disabled>Select a plant</option>
                  {state.plants.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-nature-700 dark:text-nature-300">Date <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                  className="w-full p-3 rounded-lg border border-cream-300 dark:border-nature-700 bg-white dark:bg-nature-950 focus:ring-2 focus:ring-[#639922] outline-none transition-all dark:text-cream-50" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-nature-700 dark:text-nature-300">Image Source <span className="text-red-500">*</span></label>
                <ImageUploader 
                  value={formData.src} 
                  onChange={(val) => setFormData(prev => ({...prev, src: val}))} 
                  isCirclePreview={false}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-nature-700 dark:text-nature-300">Caption (Optional)</label>
                <input 
                  type="text" 
                  value={formData.caption} 
                  onChange={(e) => setFormData(prev => ({...prev, caption: e.target.value}))}
                  className="w-full p-3 rounded-lg border border-cream-300 dark:border-nature-700 bg-white dark:bg-nature-950 focus:ring-2 focus:ring-[#639922] outline-none transition-all dark:text-cream-50" 
                  placeholder="E.g., Looking so healthy today!" 
                />
              </div>
            </form>
          </div>
          
          <div className="p-6 border-t border-cream-200 dark:border-nature-800 bg-cream-50 dark:bg-nature-950 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-nature-700 dark:text-nature-300 hover:bg-cream-200 dark:hover:bg-nature-800 transition-colors font-medium">
              Cancel
            </button>
            <button type="submit" form="add-photo-form" disabled={showToast} className="px-6 py-2.5 rounded-lg bg-[#639922] hover:bg-[#52831c] text-white transition-colors font-medium shadow-md disabled:opacity-50">
              Save Photo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
