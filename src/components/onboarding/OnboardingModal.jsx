import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPlants } from '../../data/seedData';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    experience: null,
    light: null,
    watering: null,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if onboarding was completed
    const onboarded = localStorage.getItem('floratrack_onboarded');
    if (!onboarded) {
      setIsOpen(true);
    }

    // Listen for custom event to retake quiz
    const handleOpen = () => {
      setStep(1);
      setAnswers({ experience: null, light: null, watering: null });
      setIsOpen(true);
    };

    window.addEventListener('open-onboarding', handleOpen);
    return () => window.removeEventListener('open-onboarding', handleOpen);
  }, []);

  const finishQuiz = () => {
    localStorage.setItem('floratrack_onboarded', 'true');
    localStorage.setItem('floratrack_quiz_answers', JSON.stringify(answers));
    setIsOpen(false);
    navigate('/plants');
  };

  const skipQuiz = () => {
    localStorage.setItem('floratrack_onboarded', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step < 4) {
      setTimeout(() => setStep(step + 1), 300); // slight delay for visual feedback
    }
  };

  const getRecommendations = () => {
    const { experience, light, watering } = answers;
    
    let targetNames = ['Aloe Vera', 'Basil', 'Lavender']; // Default
    
    if (experience === 'beginner' && light === 'low' && watering === 'forgetful') {
      targetNames = ['Snake Plant', 'Pothos', 'Spider Plant'];
    } else if (experience === 'experienced' && light === 'bright' && watering === 'reliable') {
      targetNames = ['Fiddle Leaf Fig', 'Monstera', 'Peace Lily'];
    } else if (experience === 'beginner') {
      targetNames = ['Snake Plant', 'Aloe Vera', 'Spider Plant'];
    }

    return initialPlants.filter(p => targetNames.includes(p.name));
  };

  const slideVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[480px] bg-white dark:bg-nature-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Progress Bar Header */}
        <div className="px-6 py-4 border-b border-cream-200 dark:border-nature-800 flex items-center justify-between z-10 bg-white dark:bg-nature-900">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-nature-600 dark:text-nature-400" />
            <span className="font-bold text-nature-800 dark:text-nature-200">FloraTrack</span>
          </div>
          {step <= 3 && (
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                    i <= step ? 'bg-nature-500' : 'bg-cream-200 dark:bg-nature-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-cream-50 dark:bg-nature-950 p-6">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                <p className="text-nature-600 dark:text-nature-400 mb-6">Let's personalize your experience. How experienced are you with houseplants?</p>
                <div className="space-y-3 flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  <OptionCard 
                    icon="🌱" title="Complete beginner" subtitle="I've never owned a plant"
                    selected={answers.experience === 'beginner'} onClick={() => handleSelect('experience', 'beginner')}
                  />
                  <OptionCard 
                    icon="🌿" title="Casual grower" subtitle="I have a few plants but forget to water them"
                    selected={answers.experience === 'casual'} onClick={() => handleSelect('experience', 'casual')}
                  />
                  <OptionCard 
                    icon="🌳" title="Experienced" subtitle="I have a thriving indoor garden"
                    selected={answers.experience === 'experienced'} onClick={() => handleSelect('experience', 'experienced')}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-6">What's the light like in your home?</h2>
                <div className="space-y-3 flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  <OptionCard 
                    icon="☀️" title="Bright & sunny" subtitle="South or west facing windows"
                    selected={answers.light === 'bright'} onClick={() => handleSelect('light', 'bright')}
                  />
                  <OptionCard 
                    icon="🌤️" title="Moderate" subtitle="Some natural light but not direct sun"
                    selected={answers.light === 'moderate'} onClick={() => handleSelect('light', 'moderate')}
                  />
                  <OptionCard 
                    icon="🌥️" title="Low light" subtitle="North facing or mostly artificial light"
                    selected={answers.light === 'low'} onClick={() => handleSelect('light', 'low')}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-6">How often do you remember to water?</h2>
                <div className="space-y-3 flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  <OptionCard 
                    icon="✅" title="Very reliably" subtitle="I can stick to a strict schedule"
                    selected={answers.watering === 'reliable'} onClick={() => handleSelect('watering', 'reliable')}
                  />
                  <OptionCard 
                    icon="🔔" title="With reminders" subtitle="I need alerts to remember"
                    selected={answers.watering === 'reminders'} onClick={() => handleSelect('watering', 'reminders')}
                  />
                  <OptionCard 
                    icon="😅" title="Often forget" subtitle="I need plants that can survive neglect"
                    selected={answers.watering === 'forgetful'} onClick={() => handleSelect('watering', 'forgetful')}
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 p-6 flex flex-col">
                <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
                  <h2 className="text-2xl font-bold mb-6">Your perfect starter plants:</h2>
                  <div className="space-y-4 mb-6">
                    {getRecommendations().map(plant => (
                      <div key={plant.id} className="flex items-center gap-4 bg-white dark:bg-nature-900 p-3 rounded-xl shadow-sm border border-cream-200 dark:border-nature-800">
                        <img src={plant.imageUrl} alt={plant.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-nature-800 dark:text-nature-200">{plant.name}</h4>
                          <span className="text-xs px-2 py-1 bg-nature-100 dark:bg-nature-800 text-nature-700 dark:text-nature-300 rounded-md mt-1 inline-block">{plant.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={finishQuiz} className="w-full py-3.5 bg-nature-600 hover:bg-nature-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg">
                    Go to my collection <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step < 4 && (
          <div className="px-6 py-4 border-t border-cream-200 dark:border-nature-800 text-center z-10 bg-white dark:bg-nature-900">
            <button onClick={skipQuiz} className="text-sm text-nature-500 hover:text-nature-700 dark:hover:text-nature-300 font-medium transition-colors">
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionCard({ icon, title, subtitle, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex gap-4 items-center ${
        selected 
          ? 'border-nature-500 bg-nature-50 dark:bg-nature-900/50' 
          : 'border-transparent bg-white dark:bg-nature-900 hover:border-cream-300 dark:hover:border-nature-700 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className={`font-bold ${selected ? 'text-nature-800 dark:text-nature-200' : 'text-nature-700 dark:text-nature-300'}`}>{title}</h4>
        <p className="text-sm text-nature-500 dark:text-nature-400">{subtitle}</p>
      </div>
    </button>
  );
}
