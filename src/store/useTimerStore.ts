import { create } from 'zustand';
import { Timer } from '../types/timer';
import { generateId } from '../utils/generateId';

interface TimerStore {
  timers: Timer[];
  addTimer: (timerData: Omit<Timer, 'id'>) => void;
  editTimer: (id: string, timerData: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  updateRemainingTime: (id: string, remainingTime: number) => void;
  toggleTimer: (id: string) => void;
  updateTimer: (id: string) => void;
  restartTimer: (id: string) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  timers: [],
  
  addTimer: (timerData) => {
    const newTimer = {
      ...timerData,
      id: generateId(),
    };
    
    set((state) => ({
      timers: [...state.timers, newTimer],
    }));
  },
  
  editTimer: (id, timerData) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { ...timer, ...timerData } : timer
      ),
    }));
  },
  
  deleteTimer: (id) => {
    set((state) => ({
      timers: state.timers.filter((timer) => timer.id !== id),
    }));
  },
  
  startTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { ...timer, isRunning: true } : timer
      ),
    }));
  },
  
  pauseTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { ...timer, isRunning: false } : timer
      ),
    }));
  },
  
  resetTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { ...timer, remainingTime: timer.duration, isRunning: false } : timer
      ),
    }));
  },
  
  updateRemainingTime: (id, remainingTime) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { ...timer, remainingTime } : timer
      ),
    }));
  },
  
  toggleTimer: (id) => {
    set((state) => {
      const currentTimer = state.timers.find(timer => timer.id === id);
      if (!currentTimer) return state;
      
      // Toggle the current timer without affecting others
      return {
        timers: state.timers.map((timer) =>
          timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
        ),
      };
    });
  },
  
  updateTimer: (id) => {
    set((state) => {
      const timer = state.timers.find(t => t.id === id);
      if (!timer || !timer.isRunning) return state;
      
      const newRemainingTime = Math.max(0, timer.remainingTime - 1);
      
      // If timer reaches zero, stop it
      const isFinished = newRemainingTime === 0;
      
      return {
        timers: state.timers.map((t) =>
          t.id === id ? { 
            ...t, 
            remainingTime: newRemainingTime,
            isRunning: isFinished ? false : t.isRunning
          } : t
        ),
      };
    });
  },
  
  restartTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((timer) =>
        timer.id === id ? { 
          ...timer, 
          remainingTime: timer.duration, 
          isRunning: false 
        } : timer
      ),
    }));
  },
  
  // ...other actions
}));