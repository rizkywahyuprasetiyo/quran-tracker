import { TOTAL_AYAT } from '../data/surahData';

// Ramadhan selama 29 hari (bisa jadi 30 jika hilal tidak terlihat)
const RAMADHAN_DAYS = 29;

export function getEndDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + RAMADHAN_DAYS);
  return endDate;
}

export function getHoursElapsed(startDate: Date, now: Date = new Date()): number {
  if (now < startDate) return 0;
  return (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
}

export function getTotalTargetAyat(targetCount: number): number {
  return TOTAL_AYAT * targetCount;
}

export function getTargetAyat(
  currentAyat: number,
  startDate: Date, 
  targetCount: number,
  now: Date = new Date()
): number {
  const endDate = getEndDate(startDate);
  const totalHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const totalTargetAyat = getTotalTargetAyat(targetCount);
  const pacePerHour = totalTargetAyat / totalHours;
  const hoursElapsed = getHoursElapsed(startDate, now);
  
  let target = hoursElapsed * pacePerHour;
  if (target > totalTargetAyat) target = totalTargetAyat;
  
  return target;
}

export function calculateProgress(
  currentAyat: number,
  startDate: Date,
  targetCount: number,
  now: Date = new Date()
): {
  percentage: number;
  totalPercentage: number;
  targetAyat: number;
  diff: number;
  diffHours: number;
  isAhead: boolean;
  pace: number;
  finishDate: Date | null;
  daysFromTarget: number;
  currentHatam: number;
  progressInCurrentHatam: number;
  targetCount: number;
} {
  const endDate = getEndDate(startDate);
  const totalTargetAyat = getTotalTargetAyat(targetCount);
  const totalPercentage = (currentAyat / totalTargetAyat) * 100;
  
  // Calculate current hatam (which completion cycle)
  const currentHatam = Math.floor(currentAyat / TOTAL_AYAT) + 1;
  const ayatInCurrentHatam = currentAyat % TOTAL_AYAT;
  const percentage = (ayatInCurrentHatam / TOTAL_AYAT) * 100;
  const progressInCurrentHatam = ayatInCurrentHatam;
  
  const targetAyat = getTargetAyat(currentAyat, startDate, targetCount, now);
  const diff = currentAyat - targetAyat;
  const totalHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const pacePerHour = totalTargetAyat / totalHours;
  const diffHours = diff / pacePerHour;
  const isAhead = diff >= 0;
  
  const hoursElapsed = getHoursElapsed(startDate, now);
  const pace = hoursElapsed > 0 ? currentAyat / hoursElapsed : pacePerHour;
  
  let finishDate: Date | null = null;
  let daysFromTarget = 0;
  
  if (currentAyat > 0 && pace > 0) {
    const hoursNeeded = (totalTargetAyat - currentAyat) / pace;
    finishDate = new Date(now.getTime() + hoursNeeded * 60 * 60 * 1000);
    daysFromTarget = Math.ceil((finishDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  return {
    percentage,
    totalPercentage,
    targetAyat,
    diff,
    diffHours,
    isAhead,
    pace,
    finishDate,
    daysFromTarget,
    currentHatam,
    progressInCurrentHatam,
    targetCount,
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}