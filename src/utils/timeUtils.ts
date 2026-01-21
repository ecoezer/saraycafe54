import { TIME_CONFIG } from '../constants/timeConfig';

export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  const now = new Date();
  const minTime = new Date(now.getTime() + TIME_CONFIG.MIN_ADVANCE_MINUTES * 60 * 1000);
  const isMonday = now.getDay() === TIME_CONFIG.WEEKDAY_MONDAY;
  const openingHour = isMonday ? TIME_CONFIG.OPENING_HOUR_MONDAY : TIME_CONFIG.OPENING_HOUR_OTHER_DAYS;

  let minutes = Math.ceil(minTime.getMinutes() / TIME_CONFIG.TIME_INTERVAL_MINUTES) * TIME_CONFIG.TIME_INTERVAL_MINUTES;
  let hours = minTime.getHours();

  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  const startMinutes = hours * 60 + minutes;
  const endMinutes = TIME_CONFIG.CLOSING_HOUR * 60 + TIME_CONFIG.CLOSING_MINUTE;

  for (let totalMinutes = startMinutes; totalMinutes <= endMinutes; totalMinutes += TIME_CONFIG.TIME_INTERVAL_MINUTES) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h < openingHour || h > TIME_CONFIG.CLOSING_HOUR || (h === TIME_CONFIG.CLOSING_HOUR && m > TIME_CONFIG.CLOSING_MINUTE)) {
      continue;
    }

    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    times.push(timeStr);
  }

  return times;
};
