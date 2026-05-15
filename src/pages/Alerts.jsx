import React from 'react';
import { usePlantContext } from '../context/PlantContext';
import { isPast, parseISO, isToday, differenceInDays } from 'date-fns';
import { AlertCircle, ThermometerSnowflake, Sun, Droplets, Leaf, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Alerts() {
  const { state } = usePlantContext();
  const { plants } = state;

  const month = new Date().getMonth();
  let season = 'Winter';
  if (month >= 2 && month <= 4) season = 'Spring';
  else if (month >= 5 && month <= 7) season = 'Summer';
  else if (month >= 8 && month <= 10) season = 'Autumn';

  const smartAlerts = [];
  plants.forEach(plant => {
    const nextWaterDate = parseISO(plant.nextWatering);
    if (isPast(nextWaterDate) && !isToday(nextWaterDate)) {
      smartAlerts.push({ id: `overdue-${plant.id}`, type: 'critical', plantId: plant.id, plantName: plant.name, icon: <Droplets className="w-5 h-5 text-red-400" />, message: `${plant.name} is overdue for watering by ${differenceInDays(new Date(), nextWaterDate)} days!` });
    }
    if (plant.healthStatus === 'Needs Attention' || plant.healthStatus === 'Critical') {
      smartAlerts.push({ id: `health-${plant.id}`, type: 'warning', plantId: plant.id, plantName: plant.name, icon: <AlertCircle className="w-5 h-5 text-amber-400" />, message: `${plant.name} health is marked as ${plant.healthStatus}. Check recent logs.` });
    }
    if (season === 'Winter' && plant.category === 'Tropical' && plant.sunlightPreference !== 'Low') {
      smartAlerts.push({ id: `winter-light-${plant.id}`, type: 'info', plantId: plant.id, plantName: plant.name, icon: <Sun className="w-5 h-5 text-sky-400" />, message: `${plant.name} (Tropical) might need a grow light during dark winter months.` });
    }
  });

  const alertStyles = {
    critical: { bg: 'var(--danger-bg)', border: 'rgba(226,75,74,0.25)', text: '#F87171', link: '#F87171' },
    warning: { bg: 'var(--warning-bg)', border: 'rgba(212,136,58,0.25)', text: 'var(--accent-gold-light)', link: 'var(--accent-gold)' },
    info: { bg: 'var(--info-bg)', border: 'rgba(91,155,213,0.25)', text: '#93C5FD', link: '#60A5FA' },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Seasonal Care */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
          <div className="p-3 rounded-xl" style={{ background: 'var(--info-bg)' }}>
            <ThermometerSnowflake className="w-6 h-6" style={{ color: 'var(--info)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Current Season: {season}</h2>
            <p style={{ color: 'var(--text-muted)' }}>General care adjustments for your collection.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)' }}>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}><Leaf className="w-4 h-4" style={{ color: 'var(--accent-sage)' }} /> Tropicals & Ferns</h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reduce watering frequency. Keep away from drafty windows and heating vents. Maintain high humidity.</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)' }}>
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}><Leaf className="w-4 h-4" style={{ color: 'var(--accent-sage)' }} /> Succulents & Cacti</h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Water very sparingly. Ensure they get as much bright, indirect light as possible to prevent stretching.</p>
          </div>
        </div>
      </div>

      {/* Smart Alerts */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
          <Bell className="w-5 h-5" style={{ color: 'var(--accent-gold)' }} />
          Smart Alerts ({smartAlerts.length})
        </h3>
        
        {smartAlerts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--success-bg)' }}>
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>All Good!</h4>
            <p style={{ color: 'var(--text-muted)' }}>Your plants are thriving. No urgent alerts at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {smartAlerts.map(alert => {
              const s = alertStyles[alert.type] || alertStyles.info;
              return (
                <div key={alert.id} className="p-4 rounded-xl flex items-start gap-4 transition-colors hover:bg-white/3" style={{ background: s.bg, border: `0.5px solid ${s.border}` }}>
                  <div className="mt-0.5">{alert.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: s.text }}>{alert.message}</p>
                    <Link to={`/plants/${alert.plantId}`} className="text-sm mt-2 inline-block font-medium hover:underline" style={{ color: s.link }}>
                      View {alert.plantName} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
