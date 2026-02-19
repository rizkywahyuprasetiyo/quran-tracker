import { useState, useEffect, useCallback } from 'react';
import { getConfig, getProgress, saveProgress, hasSetup, type TrackerConfig, type TrackerProgress } from '../utils/storage';
import { calculateProgress } from '../utils/calculations';
import { getAyatKumulatif, getSurahFromKumulatif } from '../data/surahData';

export function useQuranTracker() {
  const [config, setConfig] = useState<TrackerConfig | null>(null);
  const [progress, setProgress] = useState<TrackerProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const storedConfig = getConfig();
    const storedProgress = getProgress();
    
    if (storedConfig && storedProgress) {
      setConfig(storedConfig);
      setProgress(storedProgress);
    }
    
    setIsLoading(false);
  }, []);

  // Real-time polling: Update every 1 second for live target calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000); // Update every 1 second
    return () => clearInterval(interval);
  }, []);

  const updateProgress = useCallback((surahNumber: number, ayatNumber: number) => {
    const newProgress: TrackerProgress = {
      surahNumber,
      ayatNumber,
      lastUpdated: new Date().toISOString(),
    };
    
    saveProgress(newProgress);
    setProgress(newProgress);
  }, []);

  const stats = (() => {
    if (!config || !progress) return null;
    
    const startDate = new Date(config.startDate);
    const targetCount = config.targetCount || 1; // Default to 1 if not set
    const currentAyat = getAyatKumulatif(progress.surahNumber, progress.ayatNumber) || 0;
    
    const calc = calculateProgress(currentAyat, startDate, targetCount, now);
    const currentSurah = getSurahFromKumulatif(currentAyat % 6236); // Wrap around for multiple hatam
    const targetSurah = getSurahFromKumulatif(Math.floor(calc.targetAyat) % 6236);
    
    return {
      currentAyat,
      currentSurah,
      targetSurah,
      startDate: config.startDate,
      ...calc,
    };
  })();

  return {
    config,
    progress,
    stats,
    isLoading,
    isSetup: hasSetup(),
    updateProgress,
    refresh: () => setNow(new Date()),
    now, // Export now untuk live clock
  };
}