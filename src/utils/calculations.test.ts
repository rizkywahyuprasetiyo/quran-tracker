import {
  getEndDate,
  getHoursElapsed,
  getTotalTargetPages,
  getTargetDecimalPage,
  decimalToPageLine,
  calculateTargetStats,
  compareActualVsTarget
} from './calculations';
import { TOTAL_PAGES, LINES_PER_PAGE } from '../data/pageData';

// Test helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`❌ Test failed: ${message}`);
  }
  console.log(`✅ ${message}`);
}

function assertEqual(actual: number, expected: number, message: string, tolerance: number = 0.01) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(`❌ Test failed: ${message}\nExpected: ${expected}\nActual: ${actual}\nDiff: ${diff}`);
  }
  console.log(`✅ ${message} (expected: ${expected}, got: ${actual})`);
}

// Run tests
console.log('🧪 Running calculations tests...\n');

// Test 1: getEndDate
console.log('📅 Testing getEndDate...');
const startDate = new Date('2026-02-19');
const endDate = getEndDate(startDate);
assert(endDate.getDate() === 20 && endDate.getMonth() === 2, 'End date should be 29 days after start date'); // March 20

// Test 2: getHoursElapsed
console.log('\n⏰ Testing getHoursElapsed...');
const testStart = new Date('2026-02-19T00:00:00');
const testNow = new Date('2026-02-19T12:00:00');
assertEqual(getHoursElapsed(testStart, testNow), 12, 'Should calculate 12 hours elapsed');

// Test 3: getTotalTargetPages
console.log('\n📖 Testing getTotalTargetPages...');
assertEqual(getTotalTargetPages(1), 604, '1 hatam = 604 pages');
assertEqual(getTotalTargetPages(2), 1208, '2 hatam = 1208 pages');
assertEqual(getTotalTargetPages(3), 1812, '3 hatam = 1812 pages');

// Test 4: getTargetDecimalPage (halfway through)
console.log('\n🎯 Testing getTargetDecimalPage...');
const ramadhanStart = new Date('2026-02-19T00:00:00');
const halfwayDate = new Date('2026-03-05T00:00:00'); // ~14 days later
const targetHalfway = getTargetDecimalPage(ramadhanStart, 1, halfwayDate);
// After ~14 days out of 29, should be around 14/29 * 604 = ~291 pages
assert(targetHalfway >= 280 && targetHalfway <= 310, `Target at halfway should be around 291, got ${targetHalfway}`);

// Test 5: decimalToPageLine
console.log('\n📄 Testing decimalToPageLine...');
const pos1 = decimalToPageLine(1);
assertEqual(pos1.page, 1, 'Decimal 1 should be page 1');
assertEqual(pos1.line, 1, 'Decimal 1 should be line 1');

const pos15 = decimalToPageLine(15.5);
assertEqual(pos15.page, 15, 'Decimal 15.5 should be page 15');
assertEqual(pos15.line, 8, 'Decimal 15.5 should be line 8 (0.5 * 15 rounded up)');

const pos604 = decimalToPageLine(604.9);
assertEqual(pos604.page, 604, 'Decimal 604.9 should be page 604');
assertEqual(pos604.line, 14, 'Decimal 604.9 should be line 14 (0.9 * 15 = 13.5 rounded up)');

// Test line 15 (last line)
const pos604Line15 = decimalToPageLine(604.934);
assertEqual(pos604Line15.page, 604, 'Decimal 604.934 should be page 604');
assertEqual(pos604Line15.line, 15, 'Line 15 should be at 604.934+ (604 + 14/15 ≈ 604.933)');

// Test 6: calculateTargetStats
console.log('\n📊 Testing calculateTargetStats...');
const startTest = new Date('2026-02-19T00:00:00');
const nowTest = new Date('2026-02-19T12:00:00'); // 12 hours in
const stats = calculateTargetStats(startTest, 1, nowTest);

assert(stats.targetDecimalPage > 0, 'Target decimal page should be positive');
assert(stats.currentHatam === 1, 'Should be in hatam 1');
assert(stats.totalProgressPercentage > 0, 'Progress percentage should be positive');
assertEqual(stats.pacePerHour, 604 / (29 * 24), 'Pace should be total pages / total hours');
assertEqual(stats.hoursElapsed, 12, 'Hours elapsed should be 12');

// Test edge cases
console.log('\n🔍 Testing edge cases...');

// Before start date
const beforeStart = new Date('2026-02-18');
const targetBefore = getTargetDecimalPage(startTest, 1, beforeStart);
assertEqual(targetBefore, 1, 'Before start should return page 1');

// After end date
const afterEnd = new Date('2026-03-30');
const targetAfter = getTargetDecimalPage(startTest, 1, afterEnd);
assertEqual(targetAfter, 604, 'After end should cap at page 604');

// Multiple hatam
const stats2Hatam = calculateTargetStats(startTest, 2, halfwayDate);
assert(stats2Hatam.totalTargetPages === 1208, '2 hatam should have 1208 total pages');
assert(stats2Hatam.currentHatam >= 1 && stats2Hatam.currentHatam <= 2, 'Should be in hatam 1 or 2');

// Test 7: compareActualVsTarget
console.log('\n⚖️ Testing compareActualVsTarget...');

// Test ahead scenario
const aheadResult = compareActualVsTarget(
  { page: 50, line: 10 },
  { page: 45, line: 5 }
);
assert(aheadResult.status === 'ahead', 'Should be ahead when actual > target');
assert(aheadResult.totalDifferenceDecimal > 0, 'Difference should be positive when ahead');
console.log(`   Ahead message: "${aheadResult.message}"`);

// Test behind scenario
const behindResult = compareActualVsTarget(
  { page: 40, line: 5 },
  { page: 45, line: 10 }
);
assert(behindResult.status === 'behind', 'Should be behind when actual < target');
assert(behindResult.totalDifferenceDecimal < 0, 'Difference should be negative when behind');
console.log(`   Behind message: "${behindResult.message}"`);

// Test on-track scenario (within tolerance)
const onTrackResult = compareActualVsTarget(
  { page: 45, line: 8 },
  { page: 45, line: 5 }
);
assert(onTrackResult.status === 'on-track', 'Should be on-track when within tolerance');
assert(onTrackResult.message === 'Sesuai target', 'On-track message should be "Sesuai target"');
console.log(`   On-track message: "${onTrackResult.message}"`);

// Test exact same position
const exactResult = compareActualVsTarget(
  { page: 50, line: 10 },
  { page: 50, line: 10 }
);
assert(exactResult.status === 'on-track', 'Exact same position should be on-track');
assert(exactResult.totalDifferenceDecimal === 0, 'Difference should be 0 for exact match');
console.log(`   Exact match message: "${exactResult.message}"`);

// Test edge case: page 1, line 1
const edgeStartResult = compareActualVsTarget(
  { page: 1, line: 1 },
  { page: 1, line: 1 }
);
assert(edgeStartResult.status === 'on-track', 'Start position should be on-track');
console.log(`   Edge case (1,1) message: "${edgeStartResult.message}"`);

// Test edge case: last page, last line
const edgeEndResult = compareActualVsTarget(
  { page: 604, line: 15 },
  { page: 604, line: 10 }
);
assert(edgeEndResult.status === 'ahead' || edgeEndResult.status === 'on-track', 'End position should be ahead or on-track');
console.log(`   Edge case (604,15) message: "${edgeEndResult.message}"`);

// Test line difference calculation
const lineDiffResult = compareActualVsTarget(
  { page: 10, line: 15 },
  { page: 10, line: 1 }
);
assert(lineDiffResult.lineDifference === 14, 'Line difference should be 14');
assert(lineDiffResult.pageDifference === 0, 'Page difference should be 0');
// 14 lines difference = 14/15 = 0.933 pages, within tolerance
assert(lineDiffResult.status === 'on-track', '14 lines difference should still be on-track (within 1 page tolerance)');
console.log(`   Line diff test: pageDiff=${lineDiffResult.pageDifference}, lineDiff=${lineDiffResult.lineDifference}`);

// Test page difference calculation
const pageDiffResult = compareActualVsTarget(
  { page: 100, line: 1 },
  { page: 95, line: 1 }
);
assert(pageDiffResult.pageDifference === 5, 'Page difference should be 5');
assert(pageDiffResult.status === 'ahead', '5 pages ahead should be ahead status');
console.log(`   Page diff test: pageDiff=${pageDiffResult.pageDifference}, status=${pageDiffResult.status}`);

console.log('\n🎉 All tests passed!');
