interface TimerFormValues {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (values: TimerFormValues): boolean => {
  // Validate title (required and less than 50 chars)
  if (!values.title.trim() || values.title.trim().length > 50) {
    return false;
  }
  
  // Validate that at least one time unit is greater than zero
  if (values.hours === 0 && values.minutes === 0 && values.seconds === 0) {
    return false;
  }
  
  return true;
};
