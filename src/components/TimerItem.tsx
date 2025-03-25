import React, { useEffect, useRef, useState } from 'react';
import { Trash2, RotateCcw, Pencil } from 'lucide-react';
import { Timer } from '../types/timer';
import { formatTime } from '../utils/time';
import { useTimerStore } from '../store/useTimerStore';
import { toast } from 'sonner';
import { EditTimerModal } from './EditTimerModal';
import { TimerAudio } from '../utils/audio';
import { TimerControls } from './TimerControls';
import { TimerProgress } from './TimerProgress';
import { Button } from './Button';
import { TimerBackground } from './TimerBackground';

interface TimerItemProps {
  timer: Timer;
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { toggleTimer, deleteTimer, updateTimer, restartTimer } = useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timerAudio = TimerAudio.getInstance();
  const hasEndedRef = useRef(false);
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = window.setInterval(() => {
        updateTimer(timer.id);
        
        // Check if timer has just reached zero or is about to reach zero
        if (timer.remainingTime <= 1 && !hasEndedRef.current) {
          hasEndedRef.current = true;
          // Play sound immediately
          timerAudio.play().catch(console.error);
          
          toastIdRef.current = toast.success(`Timer "${timer.title}" has ended!`, {
            duration: 0, // Don't auto-dismiss
            action: {
              label: 'Dismiss',
              onClick: () => {
                timerAudio.stop();
              },
            },
            onDismiss: () => {
              timerAudio.stop();
            }
          });
        }
      }, 1000);
    } else {
      // Reset hasEnded flag when timer is paused or reset
      if (timer.remainingTime > 0) {
        hasEndedRef.current = false;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer.isRunning, timer.id, timer.remainingTime, timer.title, timerAudio, updateTimer]);

  const handleRestart = () => {
    hasEndedRef.current = false;
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
      timerAudio.stop();
    }
    restartTimer(timer.id);
  };

  const handleDelete = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    timerAudio.stop();
    deleteTimer(timer.id);
  };

  const handleToggle = () => {
    toggleTimer(timer.id);
  };

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-102 overflow-hidden">
        <TimerBackground />
        
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{timer.title}</h3>
              <p className="text-gray-600 mt-1">{timer.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                icon={<Pencil className="w-5 h-5" />}
                variant="secondary"
                size="icon"
                title="Edit Timer"
              />
              <Button
                onClick={handleRestart}
                icon={<RotateCcw className="w-5 h-5" />}
                variant="secondary"
                size="icon"
                title="Restart Timer"
              />
              <Button
                onClick={handleDelete}
                icon={<Trash2 className="w-5 h-5" />}
                variant="danger"
                size="icon"
                title="Delete Timer"
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-6">
            <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(timer.remainingTime)}
            </div>
            
            <TimerProgress
              progress={(timer.remainingTime / timer.duration) * 100}
            />
            
            <TimerControls
              isRunning={timer.isRunning}
              remainingTime={timer.remainingTime}
              duration={timer.duration}
              onToggle={handleToggle}
              onRestart={handleRestart}
            />
          </div>
        </div>
      </div>

      <EditTimerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timer={timer}
      />
    </>
  );
};