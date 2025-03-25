import React from 'react';
import { TimerModal } from './TimerModal';

interface AddTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTimerModal: React.FC<AddTimerModalProps> = ({ isOpen, onClose }) => {
  // Simply use the TimerModal component with no timer (add mode)
  return <TimerModal isOpen={isOpen} onClose={onClose} />;
};