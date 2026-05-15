import React from 'react';
import { usePlantContext } from '../context/PlantContext';
import { Leaf, Droplet, AlertTriangle, Bell, Plus, CheckCircle, Activity, Sun, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, ReferenceLine } from 'recharts';
import { isPast, parseISO, isToday, format, subDays, startOfDay, differenceInDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useNumberCounter } from '../hooks/useNumberCounter';

const quotes = [
  { text: "Knowledge is like a garden; if it is not cultivated, it cannot be harvested.", author: "African Proverb" },
  { text: "To plant a garden is to believe in tomorrow.", author: "Audrey Hepburn" },
  { text: "The glory of gardening: hands in the dirt, head in the sun, heart with nature.", author: "Alfred Austin" },
];

export default function Dashboard() {
  const { state } = usePlantContext();
  const { plants } = state;
  const totalPlants = plants.length;
  const overduePlants = plants.filter(p => isPast(parseISO(p.nextWatering)) && !isToday(parseISO(p.nextWatering)));
  const needsWateringToday = plants.filter(p => isToday(parseISO(p.nextWatering)) || isPast(parseISO(p.nextWatering)));
  const wateredToday = plants.filter(p => isToday(parseISO(p.lastWatered))).length;
  const alertsCount = overduePlants.length;
  const animatedTotalPlants = useNumberCounter(totalPlants);
  const animatedWateredToday = useNumberCounter(wateredToday);
  const animatedOverdue = useNumberCounter(overduePlants.length);
  const animatedAlerts = useNumberCounter(alertsCount);
  const recentlyAdded = [...plants].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)).slice(0, 3);

  const categoryCount = plants.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});
  const chartData = Object.keys(categoryCount).map(k => ({ name: k, value: categoryCount[k] }));
  const COLORS = ['#D4A853', '#8BA888', '#5A9A2F', '#D4883A', '#5B9BD5'];

  const td = startOfDay(new Date());
  const last30 = Array.from({ length: 30 }).map((_, i) => subDays(td, 29 - i));
  const healthTrendData = last30.map(date => {
    let ts = 0, c = 0;
    plants.forEach(p => {
      const vl = p.healthLogs.filter(l => startOfDay(parseISO(l.date)) <= date);
      if (vl.length > 0) { vl.sort((a, b) => new Date(b.date) - new Date(a.date)); ts += vl[0].score; c++; }
    });
    return { dateStr: format(date, 'MMM d'), avgHealth: c > 0 ? Number((ts / c).toFixed(1)) : null };
  });

  const month = new Date().getMonth();
  let season = 'Winter';
  if (month >= 2 && month <= 4) season = 'Spring';
  else if (month >= 5 && month <= 7) season = 'Summer';
  else if (month >= 8 && month <= 10) season = 'Autumn';

  const avgSunlight = 4.5;
  const sunColor = avgSunlight < 2 ? 'text-red-400' : avgSunlight <= 4 ? 'text-amber-400' : 'text-emerald-400';
  const quote = quotes[new Date().getDate() % quotes.length];
  const tipStyle = { borderBottom: '0.5px solid var(--glass-border)' };
  const tooltipStyle = { borderRadius: '8px', border: '0.5px solid var(--glass-border)', background: 'rgba(15,25,10,0.9)', color: 'var(--text-primary)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' };

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Hero */}
      <div className="nature-hero overflow-hidden">
        <img src="/forest-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="nature-hero-content p-8 md:p-10 flex flex-col justify-center min-h-[220px]">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[3px] mb-4 font-medium" style={{ color: 'var(--accent-gold)' }}>THE FLORASCADEMY — {season.toUpperCase()}</p>
            <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4 text-shadow-sm" style={{ color: 'var(--text-heading)' }}>"{quote.text}"</h2>
            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Plants', val: animatedTotalPlants, icon: Leaf, iconColor: 'var(--accent-sage)', bg: 'var(--success-bg)', bar: 'stat-accent-green' },
          { label: 'Watered Today', val: animatedWateredToday, icon: Droplet, iconColor: 'var(--info)', bg: 'var(--info-bg)', bar: 'stat-accent-blue' },
          { label: 'Overdue', val: animatedOverdue, icon: AlertTriangle, iconColor: overduePlants.length > 0 ? 'var(--danger)' : 'var(--text-muted)', bg: overduePlants.length > 0 ? 'var(--danger-bg)' : 'rgba(255,255,255,0.05)', bar: overduePlants.length > 0 ? 'stat-accent-red' : '', valColor: overduePlants.length > 0 ? '#F87171' : undefined },
          { label: 'Alerts', val: animatedAlerts, icon: Bell, iconColor: 'var(--accent-gold)', bg: 'var(--warning-bg)', bar: 'stat-accent-amber' },
        ].map((s, i) => (
          <div key={i} className="glass-card-interactive p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <h3 className="muted-label">{s.label}</h3>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className="w-[22px] h-[22px]" style={{ color: s.iconColor }} />
              </div>
            </div>
            <p className="text-[32px] font-[500]" style={{ color: s.valColor || 'var(--text-heading)' }}>{s.val}</p>
            <div className={`absolute bottom-0 left-0 w-full h-[4px] rounded-b-[2px] ${s.bar}`} style={!s.bar ? { background: 'rgba(255,255,255,0.05)' } : {}} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-6">
          {/* Needs Attention */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6 pb-3" style={tipStyle}>
              <h3 className="card-heading">Needs attention</h3>
              <Link to="/schedule" className="text-[13px] font-medium hover:opacity-80" style={{ color: 'var(--accent-gold)' }}>View all →</Link>
            </div>
            <AnimatePresence mode="wait">
              {needsWateringToday.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10" style={{ color: 'var(--text-muted)' }}>
                  <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                  <p className="font-medium text-[15px]">All caught up! Your plants are happy.</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {needsWateringToday.map(plant => {
                    const isOv = isPast(parseISO(plant.nextWatering)) && !isToday(parseISO(plant.nextWatering));
                    const dOv = isOv ? differenceInDays(new Date(), parseISO(plant.nextWatering)) : 0;
                    return (
                      <Link to={`/plants/${plant.id}`} key={plant.id} className="flex gap-4 p-3 rounded-[12px] hover:scale-[1.02] transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)' }}>
                        <img src={plant.imageUrl} alt={plant.name} className="w-[80px] h-[80px] rounded-[10px] object-cover shrink-0" />
                        <div className="flex flex-col justify-center">
                          <h4 className="font-[500] text-[13px] line-clamp-1" style={{ color: 'var(--text-primary)' }}>{plant.name}</h4>
                          <p className="muted-label mt-0.5 mb-2">{plant.category}</p>
                          <span className={isOv ? 'badge-danger' : 'badge-warning'}>{isOv ? `Overdue ${dOv}d` : 'Due today'}</span>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recently Added */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6 pb-3" style={tipStyle}>
              <h3 className="card-heading">Recently Added</h3>
              <Link to="/plants" className="text-[13px] font-medium hover:opacity-80" style={{ color: 'var(--accent-gold)' }}>Library →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentlyAdded.map(plant => {
                const da = differenceInDays(new Date(), parseISO(plant.purchaseDate));
                return (
                  <Link to={`/plants/${plant.id}`} key={plant.id} className="glass-card-interactive overflow-hidden flex flex-col h-[240px]">
                    <div className="h-[60%] w-full overflow-hidden shrink-0">
                      <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover hover:scale-[1.04] transition-transform" />
                    </div>
                    <div className="p-4 flex flex-col justify-center flex-1">
                      <h4 className="font-[500] text-[14px] line-clamp-1" style={{ color: 'var(--text-primary)' }}>{plant.name}</h4>
                      <p className="text-[12px] italic line-clamp-1 mb-2" style={{ color: 'var(--text-muted)' }}>{plant.species || 'Unknown species'}</p>
                      <p className="muted-label text-[11px] mt-auto">Added {da === 0 ? 'today' : `${da} days ago`}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Health Chart */}
          <div className="glass-card p-6">
            <div className="mb-4">
              <h3 className="card-heading">Collection health score — last 30 days</h3>
              <p className="muted-label mt-1">Average across all plants with health logs</p>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="dateStr" tick={{ fontSize: 12, fill: 'rgba(245,237,224,0.45)' }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: 'rgba(245,237,224,0.45)' }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={v => [`${v}`, 'Avg health']} contentStyle={tooltipStyle} itemStyle={{ color: '#F5EDE0' }} labelStyle={{ color: 'rgba(245,237,224,0.7)' }} />
                  <ReferenceLine y={5} stroke="rgba(245,237,224,0.25)" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="avgHealth" stroke="#D4A853" strokeWidth={2} fill="rgba(212,168,83,0.15)" connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="card-heading mb-6">Collection by Category</h3>
            <div className="h-48 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[20px] font-bold leading-tight" style={{ color: 'var(--text-heading)' }}>{totalPlants}</span>
                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>plants</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#F5EDE0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {chartData.map((e, i) => (
                <div key={e.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {e.name} <span style={{ color: 'var(--text-muted)' }}>{e.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="card-heading mb-5">Weekly Summary</h3>
            <div className="space-y-4">
              {[
                { icon: Droplet, color: 'var(--info)', label: 'Watering Events', val: wateredToday + 3 },
                { icon: Activity, color: 'var(--accent-gold)', label: 'Fertilizer Applied', val: '2 plants' },
                { icon: Sun, color: 'var(--accent-amber)', label: 'Avg Sunlight', val: `${avgSunlight} hrs`, valCls: sunColor },
                { icon: Sprout, color: 'var(--accent-forest-light)', label: 'Plants fertilized', val: 2, noBorder: true },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center ${r.noBorder ? 'pb-1' : 'pb-3'}`} style={r.noBorder ? {} : tipStyle}>
                  <div className="flex items-center gap-2">
                    <r.icon className="w-4 h-4" style={{ color: r.color }} />
                    <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                  </div>
                  <span className={`font-bold text-[14px] ${r.valCls || ''}`} style={!r.valCls ? { color: 'var(--text-heading)' } : {}}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Link to="/plants" className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-[48px] rounded-full flex items-center z-20 overflow-hidden group max-w-[48px] hover:max-w-[140px] transition-[max-width] duration-300 px-3" style={{ background: 'linear-gradient(135deg, var(--accent-forest), var(--accent-forest-light))', color: 'white', boxShadow: '0 6px 25px rgba(59,109,17,0.35)' }}>
        <Plus className="w-6 h-6 shrink-0" />
        <span className="whitespace-nowrap font-medium text-[15px] ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Add plant</span>
      </Link>
    </div>
  );
}
