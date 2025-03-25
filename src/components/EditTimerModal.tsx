import React from 'react';
import { Timer } from '../types/timer';
import { TimerModal } from './TimerModal';

interface EditTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer: Timer;
}

export const EditTimerModal: React.FC<EditTimerModalProps> = ({ isOpen, onClose, timer }) => {
  // Use the TimerModal with timer prop (edit mode)
  return <TimerModal isOpen={isOpen} onClose={onClose} timer={timer} />;
};