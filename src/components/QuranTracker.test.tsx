import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import QuranTracker from './QuranTracker';
import { useQuranTracker } from '../hooks/useQuranTracker';

vi.mock('../hooks/useQuranTracker', () => ({
  useQuranTracker: vi.fn(),
}));

const mockUseQuranTracker = vi.mocked(useQuranTracker);

describe('QuranTracker', () => {
  beforeEach(() => {
    mockUseQuranTracker.mockReset();
  });

  it('shows loading state when stats are unavailable', () => {
    mockUseQuranTracker.mockReturnValue({
      stats: null,
      saveActualPosition: vi.fn(),
      clearActualPosition: vi.fn(),
      hasActualPosition: false,
      config: null,
      isLoading: true,
      isSetup: false,
      refresh: vi.fn(),
      now: new Date(),
    });

    render(<QuranTracker />);

    expect(screen.getByText('Memuat data...')).toBeInTheDocument();
  });

  it('renders target and progress status details', () => {
    mockUseQuranTracker.mockReturnValue({
      config: { startDate: '2026-02-19T00:00:00.000Z', targetCount: 1 },
      stats: {
        startDate: '2026-02-19T00:00:00.000Z',
        targetCount: 1,
        targetDecimalPage: 20,
        targetPosition: { page: 20, line: 8 },
        currentHatam: 1,
        progressInCurrentHatam: 20,
        totalProgressPercentage: 10,
        currentHatamPercentage: 10,
        pacePerHour: 1,
        hoursElapsed: 2,
        totalHours: 696,
        hoursRemaining: 694,
        daysRemaining: 29,
        totalTargetPages: 604,
        formattedTarget: 'Halaman 20, Baris 8',
        actualPosition: { page: 18, line: 2, updatedAt: '2026-02-20T00:00:00.000Z' },
        comparison: {
          status: 'behind',
          pageDifference: -2,
          lineDifference: -6,
          totalDifferenceDecimal: -2.4,
          message: '-2.4 halaman tertinggal',
        },
      },
      isLoading: false,
      isSetup: true,
      refresh: vi.fn(),
      now: new Date('2026-02-20T00:00:00.000Z'),
      saveActualPosition: vi.fn(),
      clearActualPosition: vi.fn(),
      hasActualPosition: true,
    });

    render(<QuranTracker />);

    expect(screen.getByText('Quran Tracker')).toBeInTheDocument();
    expect(screen.getByText('Hal. 20')).toBeInTheDocument();
    expect(screen.getByText('-2.4 halaman tertinggal')).toBeInTheDocument();
    expect(screen.getByText('Status Progress')).toBeInTheDocument();
  });

  it('opens reset modal when reset button is clicked', async () => {
    const user = userEvent.setup();

    mockUseQuranTracker.mockReturnValue({
      config: { startDate: '2026-02-19T00:00:00.000Z', targetCount: 1 },
      stats: {
        startDate: '2026-02-19T00:00:00.000Z',
        targetCount: 1,
        targetDecimalPage: 20,
        targetPosition: { page: 20, line: 8 },
        currentHatam: 1,
        progressInCurrentHatam: 20,
        totalProgressPercentage: 10,
        currentHatamPercentage: 10,
        pacePerHour: 1,
        hoursElapsed: 2,
        totalHours: 696,
        hoursRemaining: 694,
        daysRemaining: 29,
        totalTargetPages: 604,
        formattedTarget: 'Halaman 20, Baris 8',
        actualPosition: null,
        comparison: null,
      },
      isLoading: false,
      isSetup: true,
      refresh: vi.fn(),
      now: new Date('2026-02-20T00:00:00.000Z'),
      saveActualPosition: vi.fn(),
      clearActualPosition: vi.fn(),
      hasActualPosition: false,
    });

    render(<QuranTracker />);

    await user.click(screen.getByRole('button', { name: 'Reset Data' }));

    expect(screen.getByText('Reset Semua Data?')).toBeInTheDocument();
  });
});
