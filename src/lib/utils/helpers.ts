import { hoursToSeconds, minutesToSeconds, secondsToHours, secondsToMinutes } from 'date-fns';
import { IsNull } from 'typeorm';

export function secondsToDurationText(seconds: number): string {
  const hours = secondsToHours(seconds);
  const minutes = secondsToMinutes(seconds - hoursToSeconds(hours));
  seconds = seconds - hoursToSeconds(hours) - minutesToSeconds(minutes);

  return `${hours} hours ${minutes} minutes ${seconds.toFixed(0)} seconds`;
}

export function generateOtp(): string {
  const length = 6;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export function replaceWithIsNull(value: Record<string, unknown>) {
  const keys = Object.keys(value);
  const result = {} as unknown as Record<string, unknown>;
  keys.forEach((key) => {
    if (value[key] === null) result[key] = IsNull();
    else result[key] = value[key];
  });
  return result;
}
