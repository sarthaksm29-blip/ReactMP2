import React, { useState } from 'react';
import { usePlantContext } from '../context/PlantContext';
import { format, parseISO } from 'date-fns';
import { X, Image as ImageIcon, Camera, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddPhotoModal from '../components/gallery/AddPhotoModal';

export default function Gallery() {
  const { state, dispatch } = usePlantContext();
  const [filterPlant, setFilterPlant] = useState('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Extract all photos and attach plant info
  const allPhotos = state.plants.reduce((acc, plant) => {
    const plantPhotos = plant.photos.map(p => ({
      ...p,
      plantName: plant.name,
      plantId: plant.id,
      healthStatus: plant.healthStatus
    }));
    return [...acc, ...plantPhotos];
  }, []).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredPhotos = filterPlant === 'All' 
    ? allPhotos 
    : allPhotos.filter(p => p.plantId === filterPlant);

  const handleDelete = (e, photoId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this photo?")) {
      dispatch({ type: 'DELETE_PHOTO', payload: photoId });
      // Close lightbox if the deleted photo was open
      if (selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex].id === photoId) {
        setSelectedPhotoIndex(null);
      }
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header & Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <ImageIcon className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Photo Gallery</h2>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <select 
              value={filterPlant} 
              onChange={e => setFilterPlant(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-lg text-sm appearance-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--glass-border)', color: 'var(--text-secondary)' }}
            >
              <option value="All">All Plants</option>
              {state.plants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-xs py-0.5 px-2 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                {filteredPhotos.length}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-nature-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline">Add Photo</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center" style={{ border: '1px dashed var(--glass-border-hover)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--success-bg)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>No photos yet for this plant</h3>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Take a picture of your plant to track its progress!</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-nature-primary flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Add First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {filteredPhotos.map((photo, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={photo.id} 
              className="relative h-[200px] w-full rounded-[10px] overflow-hidden group cursor-pointer"
              onClick={() => setSelectedPhotoIndex(i)}
            >
              <img 
                src={photo.src || photo.url} 
                alt={photo.caption || `Photo of ${photo.plantName}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                {/* Top: Trash Icon */}
                <div className="flex justify-end">
                  <button 
                    onClick={(e) => handleDelete(e, photo.id)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md backdrop-blur-sm transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Bottom: Details & Health Badge */}
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-3 h-3 rounded-full inline-block shrink-0 ${
                        photo.healthStatus === 'Healthy' ? 'bg-green-500' : 
                        photo.healthStatus === 'Needs Attention' ? 'bg-amber-500' : 'bg-red-500'
                      } shadow-sm border border-white/50`}
                      title={`Health: ${photo.healthStatus}`}
                    ></span>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-tight drop-shadow-md">{photo.plantName}</h4>
                      <p className="text-white/70 text-xs font-medium drop-shadow-sm">{format(parseISO(photo.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center justify-center p-4 md:p-8"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 bg-black/50 rounded-full backdrop-blur-md transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Arrows */}
              {selectedPhotoIndex > 0 && (
                <button 
                  onClick={handlePrev}
                  className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-md transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              )}
              
              {selectedPhotoIndex < filteredPhotos.length - 1 && (
                <button 
                  onClick={handleNext}
                  className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-md transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              )}

              <div className="relative flex flex-col items-center w-full max-w-[90vw] max-h-[80vh]">
                <img 
                  src={filteredPhotos[selectedPhotoIndex].src || filteredPhotos[selectedPhotoIndex].url} 
                  alt={filteredPhotos[selectedPhotoIndex].caption} 
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" 
                />
                
                <div className="w-full mt-4 bg-nature-900/80 backdrop-blur-md text-white p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {filteredPhotos[selectedPhotoIndex].plantName}
                        <span 
                          className={`w-2.5 h-2.5 rounded-full inline-block ${
                            filteredPhotos[selectedPhotoIndex].healthStatus === 'Healthy' ? 'bg-green-500' : 
                            filteredPhotos[selectedPhotoIndex].healthStatus === 'Needs Attention' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                        ></span>
                      </h3>
                      <p className="text-nature-300 text-sm">{format(parseISO(filteredPhotos[selectedPhotoIndex].date), 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-right text-sm text-white/50 whitespace-nowrap">
                      {selectedPhotoIndex + 1} of {filteredPhotos.length}
                    </div>
                  </div>
                  {filteredPhotos[selectedPhotoIndex].caption && (
                    <p className="mt-3 text-cream-50/90 italic border-l-2 border-[#639922] pl-3 py-1">
                      "{filteredPhotos[selectedPhotoIndex].caption}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AddPhotoModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        initialPlantId={filterPlant !== 'All' ? filterPlant : ''} 
      />

    </div>
  );
}
