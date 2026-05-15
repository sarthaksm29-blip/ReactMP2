import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { initialPlants } from '../data/seedData';
import { addDays, parseISO, formatISO } from 'date-fns';

const STORAGE_VERSION = 'floratrack_v5';
const PlantContext = createContext();

const initialState = {
  plants: [],
  darkMode: false,
  globalToast: null,
};

const plantReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_PLANTS':
      return { ...state, plants: action.payload };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
      
    case 'SHOW_TOAST':
      return { ...state, globalToast: action.payload };
      
    case 'HIDE_TOAST':
      return { ...state, globalToast: null };
      
    case 'ADD_PLANT':
      return { ...state, plants: [...state.plants, action.payload] };
      
    case 'UPDATE_PLANT':
      return {
        ...state,
        plants: state.plants.map(p => p.id === action.payload.id ? action.payload : p)
      };
      
    case 'DELETE_PLANT':
      return {
        ...state,
        plants: state.plants.filter(p => p.id !== action.payload)
      };
      
    case 'LOG_WATERING':
      return {
        ...state,
        plants: state.plants.map(p => {
          if (p.id === action.payload) {
            const now = new Date();
            const next = addDays(now, p.wateringFrequency);
            const currentStreak = p.wateringStreak || 0;
            return {
              ...p,
              lastWatered: formatISO(now),
              nextWatering: formatISO(next),
              wateringStreak: currentStreak + 1,
              healthStatus: p.healthStatus === 'Critical' ? 'Needs Attention' : 'Healthy' // simplistic update
            };
          }
          return p;
        })
      };
      
    case 'ADD_HEALTH_LOG':
      return {
        ...state,
        plants: state.plants.map(p => {
          if (p.id === action.payload.plantId) {
            return { ...p, healthLogs: [...p.healthLogs, action.payload.log], healthStatus: action.payload.status || p.healthStatus };
          }
          return p;
        })
      };

    case 'ADD_GROWTH_LOG':
      return {
        ...state,
        plants: state.plants.map(p => {
          if (p.id === action.payload.plantId) {
            return { ...p, growthLogs: [...p.growthLogs, action.payload.log] };
          }
          return p;
        })
      };

    case 'ADD_PHOTO':
      return {
        ...state,
        plants: state.plants.map(p => {
          if (p.id === action.payload.plantId) {
            return { ...p, photos: [...p.photos, action.payload.photo] };
          }
          return p;
        })
      };

    case 'DELETE_PHOTO':
      return {
        ...state,
        plants: state.plants.map(p => {
          return { ...p, photos: p.photos.filter(photo => photo.id !== action.payload) };
        })
      };

    default:
      return state;
  }
};

export const PlantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  // Initialize from LocalStorage or Seed Data
  useEffect(() => {
    const version = localStorage.getItem('floratrack_version');
    
    if (version !== STORAGE_VERSION) {
      // Wipe old data, load fresh seed data
      localStorage.removeItem('plantTrackerStateV3');
      localStorage.setItem('floratrack_version', STORAGE_VERSION);
      dispatch({ type: 'INIT_PLANTS', payload: initialPlants });
      return;
    }

    const savedData = localStorage.getItem('plantTrackerStateV3');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'INIT_PLANTS', payload: parsed.plants });
        if (parsed.darkMode) {
          dispatch({ type: 'TOGGLE_DARK_MODE' });
        }
      } catch (e) {
        dispatch({ type: 'INIT_PLANTS', payload: initialPlants });
      }
    } else {
      dispatch({ type: 'INIT_PLANTS', payload: initialPlants });
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (state.plants.length > 0) {
      localStorage.setItem('plantTrackerStateV3', JSON.stringify({
        plants: state.plants,
        darkMode: state.darkMode
      }));
    }
    
    // Apply dark mode class to HTML
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  return (
    <PlantContext.Provider value={{ state, dispatch }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlantContext = () => useContext(PlantContext);
