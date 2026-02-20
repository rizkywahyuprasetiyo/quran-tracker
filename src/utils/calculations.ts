import { TOTAL_PAGES, LINES_PER_PAGE, type PagePosition } from '../data/pageData';

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

export function getTotalTargetPages(targetCount: number): number {
  return TOTAL_PAGES * targetCount;
}

// Hitung target halaman desimal berdasarkan waktu yang telah berlalu
export function getTargetDecimalPage(
  startDate: Date,
  targetCount: number,
  now: Date = new Date()
): number {
  const endDate = getEndDate(startDate);
  const totalHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const totalTargetPages = getTotalTargetPages(targetCount);
  const pacePerHour = totalTargetPages / totalHours;
  const hoursElapsed = getHoursElapsed(startDate, now);
  
  let targetDecimalPage = hoursElapsed * pacePerHour;
  if (targetDecimalPage > totalTargetPages) targetDecimalPage = totalTargetPages;
  if (targetDecimalPage < 1) targetDecimalPage = 1;
  
  return targetDecimalPage;
}

// Konversi halaman desimal ke page + line
export function decimalToPageLine(decimalPage: number): PagePosition {
  const page = Math.floor(decimalPage);
  // Line: 1-15 berdasarkan desimal
  const line = Math.ceil((decimalPage - page) * LINES_PER_PAGE);
  
  return {
    page: Math.min(Math.max(page, 1), TOTAL_PAGES),
    line: Math.min(Math.max(line, 1), LINES_PER_PAGE),
  };
}

// Hitung semua statistik untuk ditampilkan
export function calculateTargetStats(
  startDate: Date,
  targetCount: number,
  now: Date = new Date()
): {
  targetDecimalPage: number;
  targetPosition: PagePosition;
  currentHatam: number;
  progressInCurrentHatam: number;
  totalProgressPercentage: number;
  currentHatamPercentage: number;
  pacePerHour: number;
  hoursElapsed: number;
  totalHours: number;
  hoursRemaining: number;
  daysRemaining: number;
  totalTargetPages: number;
  formattedTarget: string;
} {
  const targetDecimalPage = getTargetDecimalPage(startDate, targetCount, now);
  const targetPosition = decimalToPageLine(targetDecimalPage % TOTAL_PAGES || TOTAL_PAGES);
  
  // Hitung hatam saat ini
  const currentHatam = Math.ceil(targetDecimalPage / TOTAL_PAGES);
  const progressInCurrentHatam = targetDecimalPage % TOTAL_PAGES || TOTAL_PAGES;
  
  // Persentase progress
  const totalTargetPages = getTotalTargetPages(targetCount);
  const totalProgressPercentage = (targetDecimalPage / totalTargetPages) * 100;
  const currentHatamPercentage = (progressInCurrentHatam / TOTAL_PAGES) * 100;
  
  // Pace dan waktu
  const totalHours = (getEndDate(startDate).getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const pacePerHour = totalTargetPages / totalHours;
  const hoursElapsed = getHoursElapsed(startDate, now);
  const hoursRemaining = Math.max(totalHours - hoursElapsed, 0);
  const daysRemaining = Math.ceil(hoursRemaining / 24);
  
  // Format untuk display
  const formattedTarget = `Halaman ${targetPosition.page}, Baris ${targetPosition.line}`;
  
  return {
    targetDecimalPage,
    targetPosition,
    currentHatam,
    progressInCurrentHatam,
    totalProgressPercentage,
    currentHatamPercentage,
    pacePerHour,
    hoursElapsed,
    totalHours,
    hoursRemaining,
    daysRemaining,
    totalTargetPages,
    formattedTarget,
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
