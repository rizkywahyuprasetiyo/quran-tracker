import { useState } from 'react';
import { useQuranTracker } from '../hooks/useQuranTracker';
import { clearAll } from '../utils/storage';
import { formatDate, getEndDate } from '../utils/calculations';
import ResetModal from './ResetModal';
import ActualPositionInput from './ActualPositionInput';
import { IconBook, IconLoader2, IconTarget, IconRefresh, IconTrophy, IconArrowUp, IconArrowDown, IconMinus } from '@tabler/icons-react';

export default function QuranTracker() {
  const { stats, saveActualPosition, clearActualPosition, hasActualPosition } = useQuranTracker();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <IconLoader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    clearAll();
    window.location.href = '/setup';
  };

  const endDate = getEndDate(new Date(stats.startDate || new Date()));

  const getStatusIcon = () => {
    if (!stats.comparison) return null;
    switch (stats.comparison.status) {
      case 'ahead':
        return <IconArrowUp className="w-5 h-5 text-green-600" />;
      case 'behind':
        return <IconArrowDown className="w-5 h-5 text-red-600" />;
      case 'on-track':
        return <IconMinus className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    if (!stats.comparison) return 'bg-gray-100 text-gray-600';
    switch (stats.comparison.status) {
      case 'ahead':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'behind':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'on-track':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="flex justify-center mb-3 md:mb-4">
            <IconBook className="w-10 h-10 md:w-12 md:h-12 text-emerald-700" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-2">
            Quran Tracker
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-600 text-sm md:text-base">
            <span>Target: {stats.targetCount}x Hatam | Ramadhan 1447H</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-ping"></span>
              LIVE
            </span>
          </div>
        </header>

        {/* Target Halaman Card - Main Display */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-lg font-medium text-white/80 mb-2 flex items-center justify-center gap-2">
            <IconTarget className="w-5 h-5" />
            Target Saat Ini
          </h2>
          <div className="text-6xl md:text-7xl font-bold mb-2">
            Hal. {stats.targetPosition.page}
          </div>
          <div className="text-3xl md:text-4xl font-semibold text-white/90">
            Baris {stats.targetPosition.line}
          </div>
        </div>

        {/* Comparison Section - Only show if actual position is set */}
        {hasActualPosition && stats.comparison && (
          <div className={`rounded-2xl p-6 border-2 ${getStatusColor()} transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <IconTrophy className="w-5 h-5" />
                Status Progress
              </h3>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="font-bold">{stats.comparison.message}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <p className="text-sm opacity-70 mb-1">Posisi Kamu</p>
                <p className="text-2xl font-bold">
                  Hal. {stats.actualPosition?.page}, Baris {stats.actualPosition?.line}
                </p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 text-center">
                <p className="text-sm opacity-70 mb-1">Target</p>
                <p className="text-2xl font-bold">
                  Hal. {stats.targetPosition.page}, Baris {stats.targetPosition.line}
                </p>
              </div>
            </div>

            {stats.comparison.pageDifference !== 0 && (
              <div className="mt-4 text-center text-sm opacity-80">
                {stats.comparison.pageDifference > 0 ? (
                  <span>🎉 Luar biasa! Kamu {Math.abs(stats.comparison.pageDifference)} halaman di depan target</span>
                ) : stats.comparison.pageDifference < 0 ? (
                  <span>💪 Tetap semangat! Kamu {Math.abs(stats.comparison.pageDifference)} halaman di belakang target</span>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Actual Position Input */}
        <ActualPositionInput
          onSave={saveActualPosition}
          onClear={clearActualPosition}
          currentPage={stats.actualPosition?.page}
          currentLine={stats.actualPosition?.line}
        />

        {/* Progress Hatam */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Progress Hatam
          </h3>

          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${stats.totalProgressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Hatam ke-{stats.currentHatam} dari {stats.targetCount}
            </span>
            <span className="font-bold text-emerald-600">
              {stats.totalProgressPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.progressInCurrentHatam.toFixed(1)}
              </div>
              <p className="text-xs text-gray-600">Halaman (Hatam Ini)</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-teal-600">
                {stats.currentHatamPercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600">Progress Hatam Ini</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-4">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors inline-flex items-center gap-2"
          >
            <IconRefresh className="h-4 w-4" />
            Reset Data
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Akhir Ramadhan: {endDate ? formatDate(endDate) : '-'}
          </p>
        </footer>
      </div>

      {/* Reset Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
