import { useState, useEffect } from 'react';
import { getConfig, hasSetup, getActualPosition, saveActualPosition as saveActualPositionToStorage, clearActualPosition as clearActualPositionFromStorage, type TrackerConfig, type ActualPosition } from '../utils/storage';
import { calculateTargetStats, compareActualVsTarget, type ComparisonResult } from '../utils/calculations';

export function useQuranTracker() {
  const [config, setConfig] = useState<TrackerConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [actualPosition, setActualPosition] = useState<ActualPosition | null>(null);

  useEffect(() => {
    const storedConfig = getConfig();
    const storedActualPosition = getActualPosition();

    if (storedConfig) {
      setConfig(storedConfig);
    }

    if (storedActualPosition) {
      setActualPosition(storedActualPosition);
    }

    setIsLoading(false);
  }, []);

  // Real-time polling: Update every 1 second for live target calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = (() => {
    if (!config) return null;

    const startDate = new Date(config.startDate);
    const targetCount = config.targetCount || 1;

    const calc = calculateTargetStats(startDate, targetCount, now);

    // Calculate comparison if actual position is set
    let comparison: ComparisonResult | null = null;
    if (actualPosition) {
      comparison = compareActualVsTarget(
        { page: actualPosition.page, line: actualPosition.line },
        calc.targetPosition
      );
    }

    return {
      startDate: config.startDate,
      targetCount,
      ...calc,
      actualPosition,
      comparison,
    };
  })();

  const saveActualPosition = (page: number, line: number) => {
    saveActualPositionToStorage(page, line);
    setActualPosition({
      page,
      line,
      updatedAt: new Date().toISOString(),
    });
  };

  const clearActualPosition = () => {
    clearActualPositionFromStorage();
    setActualPosition(null);
  };

  return {
    config,
    stats,
    isLoading,
    isSetup: hasSetup(),
    refresh: () => setNow(new Date()),
    now,
    saveActualPosition,
    clearActualPosition,
    hasActualPosition: actualPosition !== null,
  };
}
