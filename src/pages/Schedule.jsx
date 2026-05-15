import React, { useState, useMemo } from 'react';
import { usePlantContext } from '../context/PlantContext';
import { useWateringAction } from '../hooks/useWateringAction';
import { isPast, parseISO, isToday, formatDistanceToNow, format, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, List, Droplet, ChevronLeft, ChevronRight, Check, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// --- Subcomponent for individual Plant Row ---
const PlantScheduleRow = ({ plant, onWater, type }) => {
  const [isWatering, setIsWatering] = useState(false);
  const nextWaterDate = parseISO(plant.nextWatering);
  const overdue = isPast(nextWaterDate) && !isToday(nextWaterDate);
  const today = isToday(nextWaterDate);
  const daysLeft = differenceInDays(nextWaterDate, startOfDay(new Date()));
  
  let urgencyText = `In ${daysLeft} days — ${format(nextWaterDate, 'MMM d')}`;
  let urgencyClass = 'text-nature-500';
  if (overdue) {
    const daysOverdue = Math.abs(differenceInDays(new Date(), nextWaterDate));
    urgencyText = `Overdue ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
    urgencyClass = 'text-red-500 font-medium';
  } else if (today) {
    urgencyText = 'Due today';
    urgencyClass = 'text-amber-500 font-medium';
  }

  const streak = plant.streak || 0;

  const handleWaterClick = () => {
    setIsWatering(true);
    setTimeout(() => {
      onWater(plant.id);
      // The context update will naturally remove it from this urgency list
    }, 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-4 flex items-center justify-between gap-4 mb-3 relative overflow-hidden ${overdue ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <Link to={`/plants/${plant.id}`} className="shrink-0 block">
          <img src={plant.imageUrl} alt={plant.name} className="w-[56px] h-[56px] rounded-[10px] object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80' }} />
        </Link>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/plants/${plant.id}`} className="font-[500] text-[15px] hover:opacity-80 transition-colors line-clamp-1" style={{ color: 'var(--text-primary)' }}>
              {plant.name}
            </Link>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap hidden sm:inline-block" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
              {plant.category}
            </span>
          </div>
          
          <p className={`text-[13px] mb-1 ${overdue ? 'text-red-400 font-medium' : today ? 'text-amber-400 font-medium' : ''}`} style={!overdue && !today ? { color: 'var(--text-muted)' } : {}}>{urgencyText}</p>
          
          {streak > 0 ? (
            <p className="text-[12px] font-medium text-amber-400 flex items-center gap-1">
              <Flame className="w-3 h-3" /> {streak}-day streak
            </p>
          ) : (
            <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>No streak yet</p>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <button
          onClick={handleWaterClick}
          disabled={isWatering}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
            isWatering 
              ? 'cursor-not-allowed'
              : overdue || today
                ? 'btn-nature-primary'
                : 'btn-glass'
          }`}
          style={isWatering ? { background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '0.5px solid var(--glass-border)' } : {}}
        >
          {isWatering ? (
            <>
              <Check className="w-4 h-4" /> Watered
            </>
          ) : (
            <>
              <Droplet className="w-4 h-4" /> Mark Watered
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Start of Day helper
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Schedule() {
  const { state } = usePlantContext();
  const { waterPlant } = useWateringAction();
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  
  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(startOfDay(new Date()));
  const [activePopoverDate, setActivePopoverDate] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [popoverPlants, setPopoverPlants] = useState([]);
  const [popoverDay, setPopoverDay] = useState(null);

  // Group Plants for List View
  const { overdue, today, upcoming, wateredTodayCount } = useMemo(() => {
    const overdue = [];
    const today = [];
    const upcoming = [];
    let wateredTodayCount = 0;

    state.plants.forEach(plant => {
      const nextDate = parseISO(plant.nextWatering);
      if (isPast(nextDate) && !isToday(nextDate)) overdue.push(plant);
      else if (isToday(nextDate)) today.push(plant);
      else upcoming.push(plant);

      if (isToday(parseISO(plant.lastWatered))) wateredTodayCount++;
    });

    // Sort upcoming by date
    upcoming.sort((a, b) => new Date(a.nextWatering) - new Date(b.nextWatering));

    return { overdue, today, upcoming, wateredTodayCount };
  }, [state.plants]);

  const totalDueToday = overdue.length + today.length + wateredTodayCount;
  const progressPercent = totalDueToday === 0 ? 100 : Math.round((wateredTodayCount / totalDueToday) * 100);

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getPlantsForDay = (day) => {
    return state.plants.filter(p => isSameDay(parseISO(p.nextWatering), day));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(startOfDay(new Date()));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[24px] font-bold text-glow" style={{ color: 'var(--text-heading)' }}>Watering Schedule</h2>
        
        <div className="flex items-center p-1 rounded-full self-start sm:self-auto" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--glass-border)' }}>
          <button 
            onClick={() => setView('calendar')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-2 transition-all duration-200`}
            style={view === 'calendar' ? { background: 'rgba(255,255,255,0.1)', color: 'var(--accent-gold-light)', border: '0.5px solid var(--glass-border-hover)' } : { color: 'var(--text-muted)', border: '0.5px solid transparent' }}
          >
            <CalendarIcon className="w-[14px] h-[14px]" /> Calendar
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-2 transition-all duration-200`}
            style={view === 'list' ? { background: 'rgba(255,255,255,0.1)', color: 'var(--accent-gold-light)', border: '0.5px solid var(--glass-border-hover)' } : { color: 'var(--text-muted)', border: '0.5px solid transparent' }}
          >
            <List className="w-[14px] h-[14px]" /> List
          </button>
        </div>
      </div>

      {view === 'list' ? (
        // --- LIST VIEW ---
        <div className="space-y-8">
          
          {/* Progress Bar */}
          <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] font-medium" style={{ color: 'var(--text-heading)' }}>Today's Progress</span>
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{wateredTodayCount} of {totalDueToday} plants watered</span>
            </div>
            <div className="h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out stat-accent-green" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* OVERDUE */}
            {(overdue.length > 0 || true) && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[15px] font-bold text-red-400">Overdue</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--danger-bg)', color: '#F87171' }}>{overdue.length}</span>
                </div>
                <AnimatePresence>
                  {overdue.map(plant => <PlantScheduleRow key={plant.id} plant={plant} onWater={waterPlant} type="overdue" />)}
                  {overdue.length === 0 && (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] italic py-2" style={{ color: 'var(--text-muted)' }}>No overdue plants! Great job.</motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}

            {/* DUE TODAY */}
            {(today.length > 0 || true) && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[15px] font-bold" style={{ color: 'var(--accent-gold)' }}>Due today</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--warning-bg)', color: 'var(--accent-gold-light)' }}>{today.length}</span>
                </div>
                <AnimatePresence>
                  {today.map(plant => <PlantScheduleRow key={plant.id} plant={plant} onWater={waterPlant} type="today" />)}
                  {today.length === 0 && (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] italic py-2" style={{ color: 'var(--text-muted)' }}>Nothing scheduled for today.</motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}

            {/* UPCOMING */}
            {(upcoming.length > 0) && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[15px] font-bold" style={{ color: 'var(--accent-sage)' }}>Upcoming</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--success-bg)', color: '#86EFAC' }}>{upcoming.length}</span>
                </div>
                <AnimatePresence>
                  {upcoming.map(plant => <PlantScheduleRow key={plant.id} plant={plant} onWater={waterPlant} type="upcoming" />)}
                </AnimatePresence>
              </section>
            )}
          </div>
        </div>

      ) : (
        // --- CALENDAR VIEW ---
        <div className="glass-card overflow-hidden">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
            <h3 className="text-[18px] font-bold" style={{ color: 'var(--text-heading)' }}>{format(currentMonth, 'MMMM yyyy')}</h3>
            <div className="flex items-center gap-2">
              <button onClick={goToToday} className="px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                Today
              </button>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-1.5 hover:bg-white/5 rounded-md transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-1.5 hover:bg-white/5 rounded-md transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7" style={{ borderBottom: '0.5px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="py-2 text-center text-[12px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-[1px]" style={{ background: 'var(--glass-border)' }}>
            {calendarDays.map((day, idx) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isSameDay(day, new Date());
              const duePlants = getPlantsForDay(day);
              const hasPlants = duePlants.length > 0;
              
              return (
                <div 
                  key={dayStr}
                  onClick={(e) => {
                    if (hasPlants) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setPopoverPos({ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 290) });
                      setPopoverPlants(duePlants);
                      setPopoverDay(day);
                      setActivePopoverDate(activePopoverDate === dayStr ? null : dayStr);
                    } else {
                      setActivePopoverDate(null);
                    }
                  }}
                  className={`min-h-[64px] p-1 md:p-2 relative group transition-colors ${!isCurrentMonth ? 'opacity-40' : ''} ${hasPlants ? 'cursor-pointer hover:bg-white/5' : ''}`}
                  style={{ background: isTodayDate ? 'rgba(212,168,83,0.08)' : 'var(--glass-bg-card)' }}
                >
                  <div className="text-[13px] font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1" style={isTodayDate ? { background: 'var(--accent-gold)', color: '#1a1a0f' } : { color: 'var(--text-secondary)' }}>
                    {format(day, 'd')}
                  </div>
                  
                  {hasPlants && (
                    <div className="flex flex-wrap gap-1 mt-1 px-1">
                      {duePlants.slice(0, 4).map((p, i) => {
                        let dotColor = 'bg-green-500';
                        if (p.healthStatus === 'Needs Attention') dotColor = 'bg-amber-500';
                        if (p.healthStatus === 'Critical') dotColor = 'bg-red-500';
                        return <div key={`${p.id}-${i}`} className={`w-2 h-2 rounded-full ${dotColor}`} />
                      })}
                      {duePlants.length > 4 && (
                        <span className="text-[9px] font-medium leading-none flex items-center" style={{ color: 'var(--text-muted)' }}>+{duePlants.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Fixed Popover (renders outside calendar grid to avoid clipping) ─── */}
      <AnimatePresence>
        {activePopoverDate && popoverPlants.length > 0 && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setActivePopoverDate(null)} />
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed w-72 z-[101] overflow-hidden"
              style={{
                top: `${Math.min(popoverPos.top, window.innerHeight - 260)}px`,
                left: `${popoverPos.left}px`,
                background: 'rgba(15, 25, 10, 0.95)',
                backdropFilter: 'blur(24px)',
                border: '0.5px solid var(--glass-border)',
                borderRadius: '14px',
                boxShadow: '0 15px 50px rgba(0,0,0,0.5), 0 0 30px rgba(212,168,83,0.06)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-3 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-[13px] font-bold" style={{ color: 'var(--text-heading)' }}>
                  {popoverDay ? format(popoverDay, 'EEEE, MMM d') : ''}
                </span>
                <button onClick={() => setActivePopoverDate(null)} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
                  &times;
                </button>
              </div>
              <div className="max-h-[220px] overflow-y-auto">
                {popoverPlants.map(plant => (
                  <div key={plant.id} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors" style={{ borderBottom: '0.5px solid var(--glass-border)' }}>
                    <Link to={`/plants/${plant.id}`} className="flex items-center gap-3 overflow-hidden flex-1 min-w-0" onClick={() => setActivePopoverDate(null)}>
                      <img src={plant.imageUrl} className="w-9 h-9 rounded-lg object-cover shrink-0" alt={plant.name} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100' }} />
                      <div className="min-w-0">
                        <span className="text-[13px] font-medium truncate block" style={{ color: 'var(--text-primary)' }}>{plant.name}</span>
                        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{plant.category}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => waterPlant(plant.id)}
                      className="shrink-0 p-2 rounded-lg transition-all hover:scale-110"
                      style={{ background: 'var(--success-bg)', color: 'var(--accent-forest-light)' }}
                      title="Mark Watered"
                    >
                      <Droplet className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
