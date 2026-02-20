import { useState, useEffect } from 'react';
import { getConfig, hasSetup, type TrackerConfig } from '../utils/storage';
import { calculateTargetStats } from '../utils/calculations';

export function useQuranTracker() {
  const [config, setConfig] = useState<TrackerConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const storedConfig = getConfig();
    
    if (storedConfig) {
      setConfig(storedConfig);
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
    
    return {
      startDate: config.startDate,
      targetCount,
      ...calc,
    };
  })();

  return {
    config,
    stats,
    isLoading,
    isSetup: hasSetup(),
    refresh: () => setNow(new Date()),
    now,
  };
}
