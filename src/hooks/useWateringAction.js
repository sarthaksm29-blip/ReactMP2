import { fireWaterDroplets } from '../utils/waterAnimation';
import { fireRainEffect } from '../utils/rainAnimation';
import { usePlantContext } from '../context/PlantContext';

export function useWateringAction() {
  const { state, dispatch } = usePlantContext();

  const fireWateringConfetti = () => {
    fireWaterDroplets({ count: 40, originX: 0.5, originY: 0.45 });
    fireRainEffect(2000);
  };

  const fireMilestoneConfetti = () => {
    fireWaterDroplets({ count: 80, originX: 0.5, originY: 0.4, milestone: true });
    fireRainEffect(3500);
  };

  const waterPlant = (plantId) => {
    const plant = state.plants.find(p => p.id === plantId);
    if (!plant) return;

    // Dispatch the actual watering
    dispatch({ type: 'LOG_WATERING', payload: plantId });

    // Compute what the streak will be after this dispatch
    const newStreak = (plant.wateringStreak || 0) + 1;

    // Trigger confetti and toast based on milestones
    if ([5, 10, 25].includes(newStreak)) {
      fireMilestoneConfetti();
      
      let message = `💧 ${newStreak}-day streak! ${plant.name} is thriving!`;
      let style = {};

      if (newStreak === 5) {
        message = `💧 5-day streak! ${plant.name} loves you!`;
        style = { background: '#E6F1FB', color: '#185FA5' };
      } else if (newStreak === 10) {
        message = `💧💧 10-day streak! ${plant.name} is thriving!`;
        style = { background: '#E1F5EE', color: '#0F6E56' };
      } else if (newStreak === 25) {
        message = `🌊 25-day streak! Master gardener!`;
        style = { background: '#B5D4F4', color: '#0C447C' };
      }

      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message, type: 'milestone', style } 
      });
    } else {
      fireWateringConfetti();
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { 
          message: `💧 ${plant.name} watered! Next due in ${plant.wateringFrequency} days`, 
          type: 'normal' 
        } 
      });
    }

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 4000);
  };

  return { waterPlant };
}
