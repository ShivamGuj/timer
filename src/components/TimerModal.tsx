import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import { validateTimerForm } from '../utils/validation';
import { Timer } from '../types/timer';
import { Button } from './Button';
import { toast } from 'sonner';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer; // Optional - if provided, we're editing an existing timer
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timer,
}) => {
  const isEditMode = !!timer;
  const [title, setTitle] = useState(timer?.title || '');
  const [description, setDescription] = useState(timer?.description || '');
  const [hours, setHours] = useState(timer ? Math.floor(timer.duration / 3600) : 0);
  const [minutes, setMinutes] = useState(timer ? Math.floor((timer.duration % 3600) / 60) : 0);
  const [seconds, setSeconds] = useState(timer ? timer.duration % 60 : 0);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const { addTimer, editTimer } = useTimerStore();

  useEffect(() => {
    if (isOpen) {
      if (timer) {
        setTitle(timer.title);
        setDescription(timer.description);
        setHours(Math.floor(timer.duration / 3600));
        setMinutes(Math.floor((timer.duration % 3600) / 60));
        setSeconds(timer.duration % 60);
      } else {
        setTitle('');
        setDescription('');
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
      
      setTouched({
        title: false,
        hours: false,
        minutes: false,
        seconds: false,
      });
    }
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const validateForm = () => {
    const isValid = validateTimerForm({ title, description, hours, minutes, seconds });
    
    if (!isValid) {
      const errors = [];
      
      if (!title.trim() || title.trim().length > 50) {
        errors.push('Title is required and must be less than 50 characters');
      }
      
      if (hours === 0 && minutes === 0 && seconds === 0) {
        errors.push('Duration must be greater than 0');
      }
      
      toast.error(errors.join('. '), {
        id: 'validation-error',
        duration: 3000,
      });
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (isEditMode && timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: false,
        createdAt: Date.now(),
      });
    }

    onClose();
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {isEditMode ? 'Edit Timer' : 'Add New Timer'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched({ ...touched, title: true })}
              maxLength={50}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                touched.title && !isTitleValid
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter timer title"
            />
            {touched.title && !isTitleValid && (
              <p className="mt-1 text-sm text-red-500">
                Title is required and must be less than 50 characters
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {title.length}/50 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter timer description (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.min(23, parseInt(e.target.value) || 0))}
                  onBlur={() => setTouched({ ...touched, hours: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.min(59, parseInt(e.target.value) || 0))}
                  onBlur={() => setTouched({ ...touched, minutes: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.min(59, parseInt(e.target.value) || 0))}
                  onBlur={() => setTouched({ ...touched, seconds: true })}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {touched.hours && touched.minutes && touched.seconds && !isTimeValid && (
              <p className="mt-2 text-sm text-red-500">
                Please set a duration greater than 0
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isTitleValid || !isTimeValid}
            >
              {isEditMode ? 'Save Changes' : 'Add Timer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
