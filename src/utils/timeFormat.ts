/**
 * Converts military time (HH:MM) to 12-hour format with AM/PM
 * @param timeString - Time string in format "HH:MM" or "HH:MM:SS"
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime12Hour = (timeString: string): string => {
  if (!timeString) return '';
  
  // Extract hours and minutes (handle both "HH:MM" and "HH:MM:SS" formats)
  const [hours, minutes] = timeString.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return timeString;
  
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Checks if a date and time combination is in the past
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @param timeString - Time string in format "HH:MM" or "HH:MM:SS"
 * @returns true if the date/time is in the past
 */
export const isPastDateTime = (dateString: string, timeString: string): boolean => {
  if (!dateString || !timeString) return false;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
    return false;
  }
  
  const offerDateTime = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();
  
  return offerDateTime < now;
};

/**
 * Checks if a date is in the past (ignoring time)
 * @param dateString - Date string in format "YYYY-MM-DD"
 * @returns true if the date is before today
 */
export const isPastDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const [year, month, day] = dateString.split('-').map(Number);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }
  
  const offerDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  offerDate.setHours(0, 0, 0, 0);
  
  return offerDate < today;
};

