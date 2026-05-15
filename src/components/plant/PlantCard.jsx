import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, isPast, parseISO, isToday, differenceInDays } from 'date-fns';
import { Droplet, Edit, Trash2, Eye, Check } from 'lucide-react';
import { usePlantContext } from '../../context/PlantContext';
import { useWateringAction } from '../../hooks/useWateringAction';

const healthColors = {
  'Healthy': { bg: 'var(--success-bg)', color: '#86EFAC' },
  'Needs Attention': { bg: 'var(--warning-bg)', color: 'var(--accent-gold-light)' },
  'Critical': { bg: 'var(--danger-bg)', color: '#F87171', cls: 'pulse-critical' },
};

export default function PlantCard({ plant, view = 'grid', onEdit, onDelete, isCompared, onToggleCompare }) {
  const { waterPlant } = useWateringAction();
  const navigate = useNavigate();
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  
  const nextWateringDate = parseISO(plant.nextWatering);
  const isOverdue = isPast(nextWateringDate) && !isToday(nextWateringDate);
  const isDueToday = isToday(nextWateringDate);
  let wateringText = 'Today';
  if (isOverdue) wateringText = `Overdue`;
  else if (!isDueToday) wateringText = `in ${formatDistanceToNow(nextWateringDate)}`;

  const handleWater = (e) => { e.preventDefault(); e.stopPropagation(); waterPlant(plant.id); };
  const handleDeleteClick = (e) => { e.preventDefault(); e.stopPropagation(); setIsConfirmDelete(true); };
  const handleConfirmDelete = (e) => { e.preventDefault(); e.stopPropagation(); onDelete(plant); };
  const handleCancelDelete = (e) => { e.preventDefault(); e.stopPropagation(); setIsConfirmDelete(false); };
  const handleEditClick = (e) => { e.preventDefault(); e.stopPropagation(); onEdit(plant); };

  const hc = healthColors[plant.healthStatus] || healthColors['Healthy'];

  if (view === 'list') {
    return (
      <div onClick={() => navigate(`/plants/${plant.id}`)}
        className="group glass-card h-[64px] px-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
        <img src={plant.imageUrl} alt={plant.name} className="w-[48px] h-[48px] rounded-[8px] object-cover shrink-0" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80' }} />
        <div className="flex-1 min-w-0">
          <h3 className="font-[500] text-[15px] truncate leading-tight" style={{ color: 'var(--text-primary)' }}>{plant.name}</h3>
          <p className="text-[12px] italic truncate" style={{ color: 'var(--text-muted)' }}>{plant.species}</p>
        </div>
        <div className="hidden sm:block w-24 shrink-0">
          <span className="px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{plant.category}</span>
        </div>
        <div className="hidden md:block w-32 shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${hc.cls || ''}`} style={{ background: hc.bg, color: hc.color }}>{plant.healthStatus}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 w-32 shrink-0">
          <Droplet className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-400' : 'text-blue-400'}`} />
          <span className={`text-[12px] ${isOverdue ? 'text-red-400 font-medium' : ''}`} style={!isOverdue ? { color: 'var(--text-secondary)' } : {}}>{wateringText}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {isConfirmDelete ? (
            <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
              <button onClick={handleCancelDelete} className="px-2 py-1 text-[11px] font-medium rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={handleConfirmDelete} className="px-2 py-1 text-[11px] font-medium bg-red-600 text-white hover:bg-red-700 rounded">Delete</button>
            </div>
          ) : (
            <>
              <button onClick={handleWater} className="p-2 text-blue-400 hover:bg-blue-500/15 rounded-lg transition-colors" title="Log Watering"><Droplet className="w-4 h-4" /></button>
              <button onClick={handleEditClick} className="p-2 hover:bg-white/5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }} title="Edit"><Edit className="w-4 h-4" /></button>
              <button onClick={handleDeleteClick} className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-interactive overflow-hidden flex flex-col h-full group">
      <div className="h-[200px] relative overflow-hidden shrink-0">
        <Link to={`/plants/${plant.id}`} className="block w-full h-full">
          <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80' }} />
        </Link>
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-200 z-10 pointer-events-none">
          <Link to={`/plants/${plant.id}`} className="pointer-events-auto p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors" title="View Details"><Eye className="w-5 h-5" /></Link>
          <button onClick={handleEditClick} className="pointer-events-auto p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors" title="Edit Plant"><Edit className="w-5 h-5" /></button>
        </div>
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium shadow-sm backdrop-blur-sm ${hc.cls || ''}`} style={{ background: hc.bg, color: hc.color }}>{plant.healthStatus}</span>
        </div>
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white backdrop-blur-sm shadow-sm">{plant.category}</span>
        </div>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleCompare(plant.id); }}
          className={`absolute top-3 left-3 z-20 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isCompared ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 backdrop-blur-sm'}`}
          style={isCompared ? { background: 'var(--accent-forest)', borderColor: 'var(--accent-forest)', color: 'white' } : { background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.5)', color: 'transparent' }}
          title="Compare">
          <Check className={`w-4 h-4 ${isCompared ? 'opacity-100' : 'opacity-0'}`} />
        </button>
      </div>
      
      <div className="p-[14px] flex flex-col flex-1">
        <h3 className="font-[500] text-[15px] line-clamp-1" style={{ color: 'var(--text-primary)' }}>{plant.name}</h3>
        <p className="text-[13px] italic line-clamp-1 mb-3" style={{ color: 'var(--text-muted)' }}>{plant.species || 'Unknown species'}</p>
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <Droplet className={`w-4 h-4 shrink-0 ${isOverdue ? 'text-red-400' : 'text-blue-400'}`} />
          <span className={`text-[13px] ${isOverdue ? 'text-red-400 font-medium' : ''}`} style={!isOverdue ? { color: 'var(--text-secondary)' } : {}}>{wateringText}</span>
        </div>
        <div className="pt-3 flex items-center justify-between min-h-[32px]" style={{ borderTop: '0.5px solid var(--glass-border)' }}>
          {isConfirmDelete ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] font-medium text-red-400 truncate mr-2">Delete {plant.name}?</span>
              <div className="flex gap-2 shrink-0">
                <button onClick={handleCancelDelete} className="px-2 py-1 text-[11px] font-medium rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button onClick={handleConfirmDelete} className="px-2 py-1 text-[11px] font-medium bg-red-600 text-white hover:bg-red-700 rounded">Delete</button>
              </div>
            </div>
          ) : (
            <>
              <Link to={`/plants/${plant.id}`} className="text-[13px] font-medium hover:underline" style={{ color: 'var(--accent-gold)' }}>Details</Link>
              <div className="flex gap-1 shrink-0">
                <button onClick={handleEditClick} className="p-1.5 transition-colors rounded hover:bg-white/5" style={{ color: 'var(--text-muted)' }}><Edit className="w-4 h-4" /></button>
                <button onClick={handleDeleteClick} className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
