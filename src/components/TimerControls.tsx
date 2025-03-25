import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface TimerControlsProps {
  isRunning: boolean;
  remainingTime: number;
  duration: number;
  onToggle: () => void;
  onRestart: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  remainingTime,
  duration,
  onToggle,
  onRestart,
}) => {
  const isCompleted = remainingTime <= 0;
  
  if (isCompleted) {
    return (
      <Button
        onClick={onRestart}
        variant="secondary"
        size="icon"
        icon={<RotateCcw className="w-6 h-6" />}
        title="Restart Timer"
      />
    );
  }

  return (
    <Button
      onClick={onToggle}
      variant={isRunning ? 'danger' : 'success'}
      size="icon"
      icon={isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      title={isRunning ? 'Pause Timer' : 'Start Timer'}
    />
  );
};