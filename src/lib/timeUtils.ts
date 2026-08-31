import { AgendaTopic } from '../types/agenda';

/**
 * Format a 24-hour time "09:00" and add minutes to get the resulting "HH:MM"
 */
export function addMinutesToTime(startTimeStr: string, minutesToAdd: number): string {
  const [hoursStr, minsStr] = startTimeStr.split(':');
  let totalMinutes = (parseInt(hoursStr, 10) || 9) * 60 + (parseInt(minsStr, 10) || 0) + minutesToAdd;
  
  // Wrap around 24 hours
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Compute the sequential timestamps for each topic in the agenda
 */
export function computeTopicTimestamps(startTime: string, topics: AgendaTopic[]): AgendaTopic[] {
  let currentStartTime = startTime || '09:00';
  
  return topics.map((topic) => {
    const topicStart = currentStartTime;
    const duration = Math.max(1, topic.durationMinutes || 5);
    const topicEnd = addMinutesToTime(topicStart, duration);
    currentStartTime = topicEnd;
    
    return {
      ...topic,
      startTime: topicStart,
      endTime: topicEnd
    };
  });
}

/**
 * Format time to 12-hour format e.g. "09:00 AM" or "02:30 PM"
 */
export function formatTime12h(time24: string): string {
  if (!time24) return '09:00 AM';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, '0')}:${m} ${period}`;
}

/**
 * Format minutes into readable e.g. "1 hr 15 mins" or "45 mins"
 */
export function formatDurationHuman(minutes: number): string {
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'}`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem === 0) return `${hrs} hr${hrs === 1 ? '' : 's'}`;
  return `${hrs} hr ${rem} min${rem === 1 ? '' : 's'}`;
}
