import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const healthColors = {
  'Healthy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Needs Attention': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

// Deterministic care difficulty inference
const getCareDifficulty = (plant) => {
  let score = 2; // Default
  if (plant.category === 'Ferns' || plant.category === 'Flowering') score += 1;
  if (plant.category === 'Succulents') score -= 1;
  if (plant.wateringFrequency < 7) score += 1; // Needs frequent watering
  if (plant.sunlightPreference === 'Bright') score += 1; // Needs more sun
  return Math.min(5, Math.max(1, score));
};

export default function ComparePanel({ plants, onClose, onRemove }) {
  if (plants.length < 2) return null;

  // Render stars
  const renderStars = (score) => {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  };

  // Check if all values in an array are equal
  const isDifferent = (values) => new Set(values).size > 1;

  const getHighlightClass = (values) => 
    isDifferent(values) ? 'border-l-4 border-amber-400 pl-2 -ml-[12px]' : '';

  const rows = [
    {
      label: 'Photo',
      values: plants.map(p => p.imageUrl),
      render: (url) => <img src={url} alt="Plant" className="w-14 h-14 rounded-full object-cover border border-cream-200 dark:border-nature-800" />
    },
    {
      label: 'Name',
      values: plants.map(p => p.name),
      render: (val) => <span className="font-bold text-nature-800 dark:text-nature-200">{val}</span>
    },
    {
      label: 'Category',
      values: plants.map(p => p.category),
      render: (val) => <span className="px-2 py-1 bg-cream-100 dark:bg-nature-800 text-xs rounded-md">{val}</span>
    },
    {
      label: 'Watering',
      values: plants.map(p => p.wateringFrequency),
      render: (val) => `Every ${val} days`
    },
    {
      label: 'Sunlight',
      values: plants.map(p => p.sunlightPreference),
      render: (val) => val
    },
    {
      label: 'Care Difficulty',
      values: plants.map(p => getCareDifficulty(p)),
      render: (val) => <span className="text-amber-500 text-lg tracking-widest">{renderStars(val)}</span>
    },
    {
      label: 'Health',
      values: plants.map(p => p.healthStatus),
      render: (val) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${healthColors[val] || ''}`}>{val}</span>
    },
    {
      label: 'Next Water',
      values: plants.map(p => p.nextWatering),
      render: (val) => format(parseISO(val), 'MMM d, yyyy')
    },
    {
      label: 'Added',
      values: plants.map(p => p.purchaseDate),
      render: (val) => format(parseISO(val), 'MMM yyyy')
    }
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
      className="fixed right-0 top-0 h-full w-[340px] bg-white dark:bg-nature-900 border-l border-cream-200 dark:border-nature-800 shadow-2xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cream-200 dark:border-nature-800 bg-cream-50/50 dark:bg-nature-950/50">
        <h3 className="font-bold text-lg">Comparing {plants.length} plants</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => onClose()} className="text-xs text-nature-500 hover:text-nature-700 font-medium">Clear all</button>
          <button onClick={() => onClose()} className="p-1 rounded-lg hover:bg-cream-200 dark:hover:bg-nature-800 text-nature-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="space-y-6">
          {rows.map((row, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-nature-400">{row.label}</span>
              <div className="flex gap-4 items-end">
                {plants.map((plant, pIndex) => (
                  <motion.div 
                    key={plant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pIndex * 0.08 }}
                    className={`flex-1 flex flex-col ${getHighlightClass(row.values)}`}
                  >
                    <div className="text-sm text-nature-700 dark:text-nature-300 overflow-hidden text-ellipsis whitespace-nowrap">
                      {row.render(row.values[pIndex])}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Links */}
      <div className="p-4 border-t border-cream-200 dark:border-nature-800 bg-cream-50/50 dark:bg-nature-950/50 flex gap-4">
        {plants.map(plant => (
          <div key={plant.id} className="flex-1 flex justify-center">
            <Link 
              to={`/plants/${plant.id}`}
              className="text-xs font-medium text-nature-600 hover:text-nature-800 dark:text-nature-400 flex items-center gap-1 group"
            >
              Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
