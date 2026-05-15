import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePlantContext } from '../context/PlantContext';
import { useWateringAction } from '../hooks/useWateringAction';
import { ArrowLeft, Droplet, Sun, ThermometerSun, AlertCircle, Calendar, Plus, Heart, Ruler, Leaf, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO, formatDistanceToNow, isPast, isToday, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = usePlantContext();
  const { waterPlant } = useWateringAction();
  const plant = state.plants.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isHealthDrawerOpen, setIsHealthDrawerOpen] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    if (id) {
      try {
        const savedIds = JSON.parse(localStorage.getItem('floratrack_recent_plants') || '[]');
        const updatedIds = [id, ...savedIds.filter(savedId => savedId !== id)].slice(0, 5);
        localStorage.setItem('floratrack_recent_plants', JSON.stringify(updatedIds));
      } catch(e) {}
    }
  }, [id]);

  if (!plant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-[24px] font-[500] mb-4">Plant not found</h2>
        <button onClick={() => navigate('/plants')} className="text-[#3B6D11] hover:underline">Back to Library</button>
      </div>
    );
  }

  const nextWateringDate = parseISO(plant.nextWatering);
  const isOverdue = isPast(nextWateringDate) && !isToday(nextWateringDate);
  const isDueToday = isToday(nextWateringDate);
  const daysOverdue = isOverdue ? differenceInDays(new Date(), nextWateringDate) : 0;
  
  let countdownBadge = <span className="bg-cream-100 text-nature-600 dark:bg-nature-800 dark:text-nature-300 px-3 py-1 rounded-full text-[13px] font-medium border-[0.5px] border-cream-200 dark:border-nature-700">in {formatDistanceToNow(nextWateringDate)}</span>;
  if (isOverdue) countdownBadge = <span className="bg-[#FCEBEB] text-[#A32D2D] dark:bg-[#FCEBEB]/10 dark:text-[#FCEBEB] px-3 py-1 rounded-full text-[13px] font-medium border-[0.5px] border-[#FCEBEB] dark:border-transparent">Overdue {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}</span>;
  else if (isDueToday) countdownBadge = <span className="bg-[#FAEEDA] text-[#854F0B] dark:bg-[#FAEEDA]/10 dark:text-[#FAEEDA] px-3 py-1 rounded-full text-[13px] font-medium border-[0.5px] border-[#FAEEDA] dark:border-transparent">Today!</span>;

  const tabs = ['Overview', 'Journal', 'Health Logs', 'Growth', 'Photos', 'Care Tips'];

  const getScoreColor = (score) => {
    if (score <= 4) return 'bg-[#FCEBEB] text-[#A32D2D] dark:bg-[#FCEBEB]/10 dark:text-[#FCEBEB]';
    if (score <= 6) return 'bg-[#FAEEDA] text-[#854F0B] dark:bg-[#FAEEDA]/10 dark:text-[#FAEEDA]';
    if (score <= 8) return 'bg-[#EAF3DE] text-[#3B6D11] dark:bg-[#EAF3DE]/10 dark:text-[#EAF3DE]';
    return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'; // 9-10
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        
        {/* Left: Photo */}
        <div className="md:w-[40%] shrink-0">
          <div className="w-full min-h-[280px] h-full relative group">
            <img src={plant.imageUrl} className="w-full h-full min-h-[280px] object-cover rounded-[16px] border-[0.5px] border-cream-200 dark:border-nature-800 shadow-sm" alt={plant.name} />
          </div>
        </div>

        {/* Right: Info */}
        <div className="md:w-[60%] flex flex-col justify-center">
          <div className="text-[13px] font-medium text-nature-500 mb-3 flex items-center gap-1">
            <Link to="/plants" className="hover:text-nature-800 dark:hover:text-nature-200 transition-colors">Library</Link>
            <span>/</span>
            <span className="text-nature-800 dark:text-nature-200">{plant.name}</span>
          </div>

          <span className="bg-black/80 dark:bg-black/50 text-white w-fit px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-md mb-3 shadow-sm border-[0.5px] border-white/10">
            {plant.category}
          </span>
          
          <h1 className="text-[28px] font-[500] text-nature-900 dark:text-white leading-tight">{plant.name}</h1>
          <p className="text-[16px] italic text-nature-500 dark:text-nature-400 mb-4">{plant.species}</p>
          
          <hr className="mb-5 border-cream-200 dark:border-nature-800" />
          
          {/* 3 Mini Stat Chips */}
          <div className="flex flex-wrap gap-3 mb-6">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border-[0.5px] border-cream-200 dark:border-nature-700 bg-white dark:bg-nature-900 shadow-sm">
               <Droplet className="w-[14px] h-[14px] text-blue-500" />
               <span className="text-[12px] font-medium text-nature-700 dark:text-nature-300">Every {plant.wateringFrequency} days</span>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border-[0.5px] border-cream-200 dark:border-nature-700 bg-white dark:bg-nature-900 shadow-sm">
               <Sun className="w-[14px] h-[14px] text-amber-500" />
               <span className="text-[12px] font-medium text-nature-700 dark:text-nature-300">{plant.sunlightPreference}</span>
             </div>
             <div className="flex items-center gap-1 px-3 py-1.5 rounded-[8px] border-[0.5px] border-cream-200 dark:border-nature-700 bg-white dark:bg-nature-900 shadow-sm">
               {[1,2,3,4,5].map(i => (
                 <Leaf key={i} className={`w-[14px] h-[14px] ${(plant.difficulty || 2) >= i ? 'fill-[#3B6D11] text-[#3B6D11]' : 'text-cream-200 dark:text-nature-700'}`} />
               ))}
             </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-[14px] font-medium text-nature-600 dark:text-nature-400">Next watering:</span>
            {countdownBadge}
          </div>

          <div className="flex flex-wrap gap-3">
             <button onClick={() => waterPlant(plant.id)} className="flex items-center gap-2 bg-[#3B6D11] hover:bg-[#2c530c] text-white px-5 py-2.5 rounded-full text-[13px] font-medium shadow-md shadow-[#3B6D11]/20 transition-all">
               <Droplet className="w-[15px] h-[15px]" /> Log Watering
             </button>
             <button className="flex items-center gap-2 bg-transparent hover:bg-cream-50 dark:hover:bg-nature-800 border-[0.5px] border-cream-200 dark:border-nature-700 text-nature-700 dark:text-nature-200 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all">
               <Ruler className="w-[15px] h-[15px]" /> Log Growth
             </button>
             <button onClick={() => setActiveTab('Photos')} className="flex items-center gap-2 bg-transparent hover:bg-cream-50 dark:hover:bg-nature-800 border-[0.5px] border-cream-200 dark:border-nature-700 text-nature-700 dark:text-nature-200 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all">
               <Camera className="w-[15px] h-[15px]" /> Add Photo
             </button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex overflow-x-auto border-b-[0.5px] border-cream-200 dark:border-nature-800 mb-8 scrollbar-hide relative z-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-[14px] font-medium whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-[#3B6D11] dark:text-[#EAF3DE]' : 'text-nature-500 hover:text-nature-700 dark:text-nature-400 dark:hover:text-nature-300'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3B6D11] dark:bg-[#EAF3DE] rounded-t-[2px] z-10" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            
            {/* OVERVIEW TAB */}
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-nature-900 p-6 rounded-[16px] shadow-sm border-[0.5px] border-cream-200 dark:border-nature-800">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[10px]">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-[500] text-nature-800 dark:text-nature-200 mb-1">Watering Schedule</h3>
                      <p className="text-[13px] text-nature-600 dark:text-nature-400 leading-relaxed">
                        Needs water every <span className="font-medium">{plant.wateringFrequency} days</span>. 
                        Last watered on {format(parseISO(plant.lastWatered), 'MMMM d')}.
                        <br/><span className="text-amber-500 font-medium">🔥 {plant.wateringStreak || 0}-day streak!</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-nature-900 p-6 rounded-[16px] shadow-sm border-[0.5px] border-cream-200 dark:border-nature-800">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-[10px]">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-[500] text-nature-800 dark:text-nature-200 mb-1">Sunlight Needs</h3>
                      <p className="text-[13px] text-nature-600 dark:text-nature-400 mb-3">{plant.sunlightPreference}</p>
                      <div className="w-full h-1.5 bg-cream-100 dark:bg-nature-800 rounded-full overflow-hidden flex">
                         {/* Visual indicator of light. Mocked based on text */}
                         <div className={`h-full ${plant.sunlightPreference.includes('Direct') ? 'w-full bg-amber-400' : plant.sunlightPreference.includes('Bright') ? 'w-2/3 bg-amber-300' : 'w-1/3 bg-amber-200'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-nature-900 p-6 rounded-[16px] shadow-sm border-[0.5px] border-cream-200 dark:border-nature-800">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-[10px]">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-[500] text-nature-800 dark:text-nature-200 mb-1">Fertilizer Schedule</h3>
                      <p className="text-[13px] text-nature-600 dark:text-nature-400 leading-relaxed">
                        Apply liquid fertilizer every 4 weeks during the growing season (Spring-Summer). Pause during Winter.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-nature-900 p-6 rounded-[16px] shadow-sm border-[0.5px] border-cream-200 dark:border-nature-800">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="p-2.5 bg-stone-100 dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 rounded-[10px]">
                      <ThermometerSun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-[500] text-nature-800 dark:text-nature-200 mb-1">Soil & Pot</h3>
                      <p className="text-[13px] text-nature-600 dark:text-nature-400 leading-relaxed">
                        Well-draining potting mix. Currently in an 8" ceramic pot with drainage holes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HEALTH LOGS TAB */}
            {activeTab === 'Health Logs' && (
              <div className="bg-white dark:bg-nature-900 p-6 rounded-[16px] shadow-sm border-[0.5px] border-cream-200 dark:border-nature-800 relative">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[18px] font-bold text-nature-800 dark:text-nature-200">Health History</h3>
                  <button onClick={() => setIsHealthDrawerOpen(true)} className="flex items-center gap-1.5 text-[13px] font-medium text-[#3B6D11] hover:underline">
                    <Plus className="w-4 h-4" /> Add Health Log
                  </button>
                </div>

                {(plant.healthLogs && plant.healthLogs.length > 0) ? (
                  <div className="relative pl-6">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-cream-200 dark:bg-nature-800 z-0"></div>
                    
                    <div className="space-y-6">
                      {plant.healthLogs.sort((a,b) => new Date(b.date) - new Date(a.date)).map((log, index) => (
                        <div key={log.id} className="relative z-10">
                          {/* Dot */}
                          <div className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-cream-300 dark:bg-nature-600 ring-4 ring-white dark:ring-nature-900 z-10`}></div>
                          
                          <div 
                            className="bg-cream-50/50 dark:bg-nature-950/50 border-[0.5px] border-cream-200 dark:border-nature-800 rounded-[12px] p-4 transition-colors hover:border-cream-300 cursor-pointer"
                            onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-[12px] font-medium text-nature-500">{format(parseISO(log.date), 'MMM d, yyyy')}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${getScoreColor(log.score)}`}>Score: {log.score}/10</span>
                              </div>
                              {expandedLogId === log.id ? <ChevronUp className="w-4 h-4 text-nature-400" /> : <ChevronDown className="w-4 h-4 text-nature-400" />}
                            </div>
                            
                            <AnimatePresence>
                              {expandedLogId === log.id && log.notes && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <p className="text-[13px] text-nature-600 dark:text-nature-400 mt-3 pt-3 border-t-[0.5px] border-cream-200 dark:border-nature-800 leading-relaxed">
                                    {log.notes}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[14px] text-nature-500 py-10">No health logs recorded yet.</p>
                )}
              </div>
            )}

            {/* PHOTOS TAB */}
            {activeTab === 'Photos' && (
              <div className="relative min-h-[400px]">
                <div className="columns-2 md:columns-3 gap-[10px] space-y-[10px]">
                  {/* We don't have an explicit photos array in state usually, let's mock 2 photos for demonstration using the main image and a default */}
                  {[
                    { id: 1, url: plant.imageUrl, date: plant.purchaseDate },
                    { id: 2, url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80', date: new Date().toISOString() }
                  ].map(photo => (
                    <div key={photo.id} className="relative group overflow-hidden rounded-[10px] break-inside-avoid cursor-pointer border-[0.5px] border-cream-200 dark:border-nature-800 shadow-sm">
                      <img src={photo.url} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300" alt="Plant snapshot" />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[11px] font-medium">{format(parseISO(photo.date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Add Photo Button */}
                <button className="fixed bottom-8 right-8 z-[100] w-12 h-12 bg-[#3B6D11] hover:bg-[#2c530c] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Other tabs placeholder */}
            {['Journal', 'Growth', 'Care Tips'].includes(activeTab) && (
              <div className="bg-white dark:bg-nature-900 p-10 rounded-[16px] shadow-sm border-[0.5px] border-cream-200 dark:border-nature-800 text-center">
                <h3 className="text-[18px] font-medium text-nature-800 dark:text-nature-200 mb-2">{activeTab}</h3>
                <p className="text-[14px] text-nature-500">This section is currently under development.</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide-in Health Log Drawer */}
      <AnimatePresence>
        {isHealthDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsHealthDrawerOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white dark:bg-nature-900 shadow-2xl z-[250] border-l-[0.5px] border-cream-200 dark:border-nature-800 flex flex-col"
            >
              <div className="p-5 border-b-[0.5px] border-cream-200 dark:border-nature-800 flex justify-between items-center bg-cream-50 dark:bg-nature-950">
                <h3 className="text-[16px] font-bold text-nature-800 dark:text-nature-200">Log Health</h3>
                <button onClick={() => setIsHealthDrawerOpen(false)} className="text-nature-500 hover:text-nature-800">&times;</button>
              </div>
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-nature-700 dark:text-nature-300 mb-1">Health Score (1-10)</label>
                  <input type="number" min="1" max="10" defaultValue="10" className="w-full px-3 py-2 border-[0.5px] border-cream-200 dark:border-nature-700 rounded-lg text-sm bg-white dark:bg-nature-900" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-nature-700 dark:text-nature-300 mb-1">Notes</label>
                  <textarea rows="4" placeholder="How is it looking?" className="w-full px-3 py-2 border-[0.5px] border-cream-200 dark:border-nature-700 rounded-lg text-sm bg-white dark:bg-nature-900"></textarea>
                </div>
              </div>
              <div className="p-5 border-t-[0.5px] border-cream-200 dark:border-nature-800 bg-cream-50 dark:bg-nature-950">
                <button onClick={() => setIsHealthDrawerOpen(false)} className="w-full py-2.5 bg-[#3B6D11] hover:bg-[#2c530c] text-white rounded-[10px] text-[13px] font-medium transition-colors shadow-md">
                  Save Log
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
