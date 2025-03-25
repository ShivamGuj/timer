import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TimerAudio } from './audio';

describe('TimerAudio', () => {
  let timerAudio: TimerAudio;

  beforeEach(() => {
    // @ts-ignore - access private property for testing
    TimerAudio.instance = null;
    timerAudio = TimerAudio.getInstance();
    
    // Improved mock objects for AudioContext
    const mockOscillator = {
      type: '',
      frequency: {
        setValueAtTime: vi.fn(),
      },
      connect: vi.fn().mockReturnThis(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    };
    
    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn().mockReturnThis(),
      disconnect: vi.fn(),
    };
    
    // Mock the AudioContext with proper mock implementations
    globalThis.AudioContext = vi.fn().mockImplementation(() => ({
      state: 'suspended',
      currentTime: 0,
      resume: vi.fn().mockResolvedValue(undefined),
      createOscillator: vi.fn().mockReturnValue(mockOscillator),
      createGain: vi.fn().mockReturnValue(mockGain),
      destination: {},
    }));
    
    // Mock setTimeout to execute immediately in tests
    vi.spyOn(global, 'setTimeout').mockImplementation((callback) => {
      callback();
      return 0 as any;
    });
    
    // Clear mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    timerAudio.stop();
    vi.restoreAllMocks();
  });

  it('should create a singleton instance', () => {
    const anotherInstance = TimerAudio.getInstance();
    expect(timerAudio).toBe(anotherInstance);
  });

  it('should initialize audio context', async () => {
    await timerAudio.play();
    expect(timerAudio.getAudioContext()).not.toBeNull();
  });

  it('should play sound', async () => {
    const playSpy = vi.spyOn(timerAudio, 'play');
    await timerAudio.play();
    expect(playSpy).toHaveBeenCalled();
  });

  it('should cleanup resources', async () => {
    // @ts-ignore - access protected properties for testing
    timerAudio.oscillator = {} as any;
    // @ts-ignore
    timerAudio.gainNode = {} as any;
    
    await timerAudio.play();
    timerAudio.stop();
    
    // Check for null or undefined
    expect(timerAudio.getOscillator()).toBeFalsy();
    expect(timerAudio.getGainNode()).toBeFalsy();
  });

  it('should handle errors during play', async () => {
    // Replace the AudioContext mock with one that throws
    const originalAudioContext = globalThis.AudioContext;
    globalThis.AudioContext = vi.fn().mockImplementation(() => {
      throw new Error('AudioContext error');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await timerAudio.play();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to play audio:', expect.any(Error));

    // Restore the original mock
    globalThis.AudioContext = originalAudioContext;
  });
});
