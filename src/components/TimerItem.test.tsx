import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TimerItem } from './TimerItem';
import { Timer } from '../types/timer';

// Mock the store
vi.mock('../store/useTimerStore', () => ({
  useTimerStore: () => ({
    toggleTimer: vi.fn(),
    deleteTimer: vi.fn(),
    updateTimer: vi.fn(),
    restartTimer: vi.fn(),
  }),
}));

// Mock the audio class
vi.mock('../utils/audio', () => ({
  TimerAudio: {
    getInstance: () => ({
      play: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn(),
    }),
  },
}));

// Mock the toast dependency
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('TimerItem', () => {
  let mockTimer: Timer;
  
  beforeEach(() => {
    mockTimer = {
      id: '123',
      title: 'Test Timer',
      description: 'Test Description',
      duration: 300,
      remainingTime: 300,
      isRunning: false,
      createdAt: Date.now(),
    };
    
    vi.useFakeTimers();
  });
  
  it('renders timer correctly', () => {
    render(<TimerItem timer={mockTimer} />);
    
    expect(screen.getByText('Test Timer')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('05:00')).toBeInTheDocument(); // Format of 300 seconds
  });
  
  // Add more tests as needed
});
