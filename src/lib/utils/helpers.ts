import { hoursToSeconds, minutesToSeconds, secondsToHours, secondsToMinutes } from 'date-fns';

export function secondsToDurationText(seconds: number): string {
  const hours = secondsToHours(seconds);
  const minutes = secondsToMinutes(seconds - hoursToSeconds(hours));
  seconds = seconds - hoursToSeconds(hours) - minutesToSeconds(minutes);

  return `${hours} hours ${minutes} minutes ${seconds.toFixed(0)} seconds`;
}
