import { useState } from 'react';
import { useQuranTracker } from '../hooks/useQuranTracker';
import { SURAH_DATA, TOTAL_AYAT } from '../data/surahData';
import { clearAll } from '../utils/storage';
import { formatDateTime, formatDate, getEndDate } from '../utils/calculations';
import ResetModal from './ResetModal';
import { SurahSelect } from './SurahSelect';

export default function QuranTracker() {
  const { progress, stats, updateProgress, refresh } = useQuranTracker();
  const [surahNumber, setSurahNumber] = useState(progress?.surahNumber || 1);
  const [ayatNumber, setAyatNumber] = useState(progress?.ayatNumber || 1);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  const selectedSurah = SURAH_DATA.find(s => s[0] === surahNumber);
  const maxAyat = selectedSurah ? selectedSurah[2] : 7;

  const handleUpdate = () => {
    updateProgress(surahNumber, ayatNumber);
  };

  const handleReset = () => {
    clearAll();
    window.location.href = '/setup';
  };

  const endDate = getEndDate(new Date(stats.startDate || new Date()));

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            Quran Tracker
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>Target: {stats.targetCount}x Hatam | Ramadhan 1447H</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-ping"></span>
              LIVE
            </span>
          </div>
        </header>

        {/* Status Card */}
        <div className={`rounded-2xl p-6 text-white ${stats.isAhead ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl mb-2">{stats.isAhead ? '🚀' : '⚠️'}</div>
              <h2 className="text-2xl font-bold mb-1">
                {stats.isAhead ? 'Alhamdulillah!' : 'Semangat!'}
              </h2>
              <p className="text-white/90">
                {stats.isAhead 
                  ? `Anda di depan target ${Math.round(stats.diff)} ayat`
                  : `Anda perlu catch up ${Math.round(Math.abs(stats.diff))} ayat`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">
                Hatam ke-{stats.currentHatam}
              </div>
              <p className="text-white/80">
                dari {stats.targetCount} target
              </p>
            </div>
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
                style={{ width: `${stats.totalPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {Math.round(stats.currentAyat)} / {Math.round(TOTAL_AYAT * stats.targetCount)} ayat
            </span>
            <span className="font-bold text-emerald-600">
              {stats.totalPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Target Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Target Saat Ini
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400 mb-1">
                {stats.targetSurah.name}
              </div>
              <div className="text-5xl font-bold text-emerald-600 mb-2">
                {stats.targetSurah.ayat}
              </div>
              <p className="text-sm text-gray-500 tabular-nums">
                Ayat ke-{Math.round(stats.targetAyat || 0)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ✅ Progress Anda
            </h3>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stats.currentSurah.name}
              </div>
              <div className="text-5xl font-bold text-emerald-600 mb-2">
                {stats.currentSurah.ayat}
              </div>
              <p className="text-sm text-gray-500">
                Surah ke-{stats.currentSurah.number} dari 114
              </p>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📝 Update Progress
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surah
              </label>
              <SurahSelect
                value={surahNumber}
                onChange={(value) => {
                  setSurahNumber(value);
                  setAyatNumber(1);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ayat
              </label>
              <input
                type="number"
                min={1}
                max={maxAyat}
                value={ayatNumber}
                onChange={(e) => setAyatNumber(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                1-{maxAyat}
              </p>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Update Progress ✅
          </button>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Statistik
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.pace.toFixed(1)}
              </div>
              <p className="text-xs text-gray-600">Ayat/Jam</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {stats.finishDate ? formatDate(stats.finishDate) : '-'}
              </div>
              <p className="text-xs text-gray-600">Estimasi Selesai</p>
            </div>

            <div className={`text-center p-4 rounded-xl ${stats.daysFromTarget <= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-2xl font-bold ${stats.daysFromTarget <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.daysFromTarget <= 0 
                  ? `${Math.abs(stats.daysFromTarget)} hari lebih awal` 
                  : `${stats.daysFromTarget} hari terlambat`
                }
              </div>
              <p className="text-xs text-gray-600">Dari Akhir Ramadhan</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {endDate ? formatDate(endDate) : '-'}
              </div>
              <p className="text-xs text-gray-600">Akhir Ramadhan</p>
            </div>
          </div>        
        </div>

        {/* Footer */}
        <footer className="text-center pt-4">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
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