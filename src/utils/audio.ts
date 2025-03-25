export class TimerAudio {
  private static instance: TimerAudio | null = null;
  protected audioContext: AudioContext | null = null;
  protected oscillator: OscillatorNode | null = null;
  protected gainNode: GainNode | null = null;
  protected isPlaying: boolean = false;

  private constructor() {}

  public static getInstance(): TimerAudio {
    if (!TimerAudio.instance) {
      TimerAudio.instance = new TimerAudio();
    }
    return TimerAudio.instance;
  }

  public async play(): Promise<void> {
    try {
      // Stop any existing sound first
      this.stop();
      
      this.isPlaying = true;
      
      // Create audio context if it doesn't exist
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      // Resume context if it's suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create oscillator for the beep sound
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5 note

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      // Increase volume more quickly and make it louder
      this.gainNode.gain.linearRampToValueAtTime(0.7, this.audioContext.currentTime + 0.1);

      // Connect nodes
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Start oscillator and play a pattern (beep-beep-beep)
      this.oscillator.start();
      
      // Schedule the beep pattern
      this.scheduleBeepPattern();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  private scheduleBeepPattern(): void {
    if (!this.gainNode || !this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create a beep pattern
    for (let i = 0; i < 3; i++) {
      // Beep on
      this.gainNode.gain.setValueAtTime(0, now + i * 0.5);
      this.gainNode.gain.linearRampToValueAtTime(0.7, now + i * 0.5 + 0.05);
      // Beep off
      this.gainNode.gain.setValueAtTime(0.7, now + i * 0.5 + 0.2);
      this.gainNode.gain.linearRampToValueAtTime(0, now + i * 0.5 + 0.25);
    }
    
    // Schedule complete stop after pattern
    setTimeout(() => {
      this.stop();
    }, 1500);
  }

  public stop(): void {
    try {
      if (!this.isPlaying) return;
      
      // Stop oscillator if it exists
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      } else {
        // Ensure oscillator is null even if it was undefined
        this.oscillator = null;
      }

      // Disconnect gain node if it exists
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      } else {
        // Ensure gainNode is null even if it was undefined
        this.gainNode = null;
      }
      
      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to stop audio:', error);
      // Ensure properties are null even if an error occurred
      this.oscillator = null;
      this.gainNode = null;
      this.isPlaying = false;
    }
  }

  // Expose getter methods for testing
  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  public getOscillator(): OscillatorNode | null {
    return this.oscillator;
  }

  public getGainNode(): GainNode | null {
    return this.gainNode;
  }
}
