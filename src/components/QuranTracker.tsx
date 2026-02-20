import { useState } from 'react';
import { useQuranTracker } from '../hooks/useQuranTracker';
import { TOTAL_PAGES, LINES_PER_PAGE } from '../data/pageData';
import { clearAll } from '../utils/storage';
import { formatDateTime, formatDate, getEndDate } from '../utils/calculations';
import ResetModal from './ResetModal';
import { IconBook, IconLoader2, IconTarget, IconChartBar, IconRefresh, IconClock } from '@tabler/icons-react';

export default function QuranTracker() {
  const { stats } = useQuranTracker();
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
    window.location.href = '/quran-tracker/setup';
  };

  const endDate = getEndDate(new Date(stats.startDate || new Date()));

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
          <div className="text-3xl md:text-4xl font-semibold text-white/90 mb-4">
            Baris {stats.targetPosition.line}
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm">
            <IconClock className="w-4 h-4" />
            {new Date().toLocaleTimeString('id-ID')}
          </div>
        </div>

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

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IconChartBar className="w-5 h-5 text-purple-500" />
            Statistik
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.pacePerHour.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">Halaman/Jam</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {stats.hoursElapsed.toFixed(1)}
              </div>
              <p className="text-xs text-gray-600">Jam Berlalu</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">
                {stats.daysRemaining}
              </div>
              <p className="text-xs text-gray-600">Hari Tersisa</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {endDate ? formatDate(endDate) : '-'}
              </div>
              <p className="text-xs text-gray-600">Akhir Ramadhan</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Total Target:</span>
              <span className="font-semibold">{stats.totalTargetPages} halaman</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Target Saat Ini:</span>
              <span className="font-semibold">{stats.targetDecimalPage.toFixed(2)} halaman</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Waktu:</span>
              <span className="font-semibold">{stats.totalHours.toFixed(1)} jam</span>
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
            Terakhir di-refresh: {formatDateTime(new Date())}
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
