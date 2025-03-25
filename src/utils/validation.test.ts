import { validateTimerForm } from './validation';

// Add TypeScript declarations for Jest
declare global {
  var describe: any;
  var it: any;
  var expect: any;
}

describe('validateTimerForm', () => {
  it('should return true for valid timer data', () => {
    const validData = {
      title: 'Test Timer',
      description: 'This is a test timer',
      hours: 0,
      minutes: 10,
      seconds: 0,
    };
    
    expect(validateTimerForm(validData)).toBe(true);
  });
  
  it('should return true when time has only seconds', () => {
    const validData = {
      title: 'Test Timer',
      description: 'This is a test timer',
      hours: 0,
      minutes: 0,
      seconds: 30,
    };
    
    expect(validateTimerForm(validData)).toBe(true);
  });
  
  it('should return true when time has only hours', () => {
    const validData = {
      title: 'Test Timer',
      description: 'This is a test timer',
      hours: 1,
      minutes: 0,
      seconds: 0,
    };
    
    expect(validateTimerForm(validData)).toBe(true);
  });
  
  it('should return false when title is empty', () => {
    const invalidData = {
      title: '',
      description: 'This is a test timer',
      hours: 0,
      minutes: 10,
      seconds: 0,
    };
    
    expect(validateTimerForm(invalidData)).toBe(false);
  });
  
  it('should return false when title is too long', () => {
    const invalidData = {
      title: 'A'.repeat(51),
      description: 'This is a test timer',
      hours: 0,
      minutes: 10,
      seconds: 0,
    };
    
    expect(validateTimerForm(invalidData)).toBe(false);
  });
  
  it('should return false when all time values are zero', () => {
    const invalidData = {
      title: 'Test Timer',
      description: 'This is a test timer',
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    
    expect(validateTimerForm(invalidData)).toBe(false);
  });
  
  it('should handle whitespace in title', () => {
    const invalidData = {
      title: '   ',
      description: 'This is a test timer',
      hours: 0,
      minutes: 10,
      seconds: 0,
    };
    
    expect(validateTimerForm(invalidData)).toBe(false);
  });
  
  it('should allow empty description', () => {
    const validData = {
      title: 'Test Timer',
      description: '',
      hours: 0,
      minutes: 10,
      seconds: 0,
    };
    
    expect(validateTimerForm(validData)).toBe(true);
  });
});
