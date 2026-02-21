import { describe, expect, it } from 'vitest';

import {
  calculateTargetStats,
  compareActualVsTarget,
  decimalToPageLine,
  getEndDate,
  getHoursElapsed,
  getTargetDecimalPage,
  getTotalTargetPages,
} from './calculations';

describe('calculations utils', () => {
  it('calculates end date 29 days after start date', () => {
    const startDate = new Date('2026-02-19');
    const endDate = getEndDate(startDate);

    expect(endDate.getDate()).toBe(20);
    expect(endDate.getMonth()).toBe(2);
  });

  it('calculates elapsed hours', () => {
    const start = new Date('2026-02-19T00:00:00');
    const now = new Date('2026-02-19T12:00:00');

    expect(getHoursElapsed(start, now)).toBe(12);
  });

  it('returns total target pages for each hatam count', () => {
    expect(getTotalTargetPages(1)).toBe(604);
    expect(getTotalTargetPages(2)).toBe(1208);
    expect(getTotalTargetPages(3)).toBe(1812);
  });

  it('returns a reasonable target around halfway', () => {
    const ramadhanStart = new Date('2026-02-19T00:00:00');
    const halfwayDate = new Date('2026-03-05T00:00:00');
    const targetHalfway = getTargetDecimalPage(ramadhanStart, 1, halfwayDate);

    expect(targetHalfway).toBeGreaterThanOrEqual(280);
    expect(targetHalfway).toBeLessThanOrEqual(310);
  });

  it('converts decimal page to page and line', () => {
    expect(decimalToPageLine(1)).toEqual({ page: 1, line: 1 });
    expect(decimalToPageLine(15.5)).toEqual({ page: 15, line: 8 });
    expect(decimalToPageLine(604.9)).toEqual({ page: 604, line: 14 });
    expect(decimalToPageLine(604.934)).toEqual({ page: 604, line: 15 });
  });

  it('calculates target stats', () => {
    const start = new Date('2026-02-19T00:00:00');
    const now = new Date('2026-02-19T12:00:00');
    const stats = calculateTargetStats(start, 1, now);

    expect(stats.targetDecimalPage).toBeGreaterThan(0);
    expect(stats.currentHatam).toBe(1);
    expect(stats.totalProgressPercentage).toBeGreaterThan(0);
    expect(stats.pacePerHour).toBeCloseTo(604 / (29 * 24));
    expect(stats.hoursElapsed).toBe(12);
  });

  it('handles target decimal page edge cases', () => {
    const start = new Date('2026-02-19T00:00:00');

    const beforeStart = new Date('2026-02-18');
    expect(getTargetDecimalPage(start, 1, beforeStart)).toBe(1);

    const afterEnd = new Date('2026-03-30');
    expect(getTargetDecimalPage(start, 1, afterEnd)).toBe(604);
  });

  it('supports multiple hatam stats', () => {
    const start = new Date('2026-02-19T00:00:00');
    const halfwayDate = new Date('2026-03-05T00:00:00');
    const stats = calculateTargetStats(start, 2, halfwayDate);

    expect(stats.totalTargetPages).toBe(1208);
    expect(stats.currentHatam).toBeGreaterThanOrEqual(1);
    expect(stats.currentHatam).toBeLessThanOrEqual(2);
  });
});

describe('compareActualVsTarget', () => {
  it('marks status as ahead when actual is more than 1 page ahead', () => {
    const result = compareActualVsTarget({ page: 50, line: 10 }, { page: 45, line: 5 });

    expect(result.status).toBe('ahead');
    expect(result.totalDifferenceDecimal).toBeGreaterThan(0);
  });

  it('marks status as behind when actual is more than 1 page behind', () => {
    const result = compareActualVsTarget({ page: 40, line: 5 }, { page: 45, line: 10 });

    expect(result.status).toBe('behind');
    expect(result.totalDifferenceDecimal).toBeLessThan(0);
  });

  it('marks status as on-track within tolerance', () => {
    const result = compareActualVsTarget({ page: 45, line: 8 }, { page: 45, line: 5 });

    expect(result.status).toBe('on-track');
    expect(result.message).toBe('Sesuai target');
  });

  it('returns on-track and zero difference for exact same position', () => {
    const result = compareActualVsTarget({ page: 50, line: 10 }, { page: 50, line: 10 });

    expect(result.status).toBe('on-track');
    expect(result.totalDifferenceDecimal).toBe(0);
  });

  it('keeps line-only differences under one page as on-track', () => {
    const result = compareActualVsTarget({ page: 10, line: 15 }, { page: 10, line: 1 });

    expect(result.pageDifference).toBe(0);
    expect(result.lineDifference).toBe(14);
    expect(result.status).toBe('on-track');
  });

  it('reports page differences correctly', () => {
    const result = compareActualVsTarget({ page: 100, line: 1 }, { page: 95, line: 1 });

    expect(result.pageDifference).toBe(5);
    expect(result.status).toBe('ahead');
  });
});
