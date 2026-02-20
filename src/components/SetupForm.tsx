import { useState } from 'react';
import { saveConfig } from '../utils/storage';
import { getEndDate } from '../utils/calculations';
import { TOTAL_PAGES } from '../data/pageData';
import { IconBook, IconChartBar, IconRocket } from '@tabler/icons-react';

export default function SetupForm() {
  const [startDate, setStartDate] = useState('2026-02-19');
  const [targetCount, setTargetCount] = useState(1);

  const endDate = getEndDate(new Date(startDate));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveConfig({
      startDate,
      targetCount,
    });
    
    window.location.href = '/quran-tracker/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <IconBook className="w-12 h-12 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-2">
            Quran Tracker
          </h1>
          <p className="text-gray-600">
            Setup awal untuk memulai tracking bacaan Ramadhan 1447H
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai Ramadhan
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Jumlah Hatam
              </label>
              <select
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count} kali hatam
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Target selesai selama Ramadhan
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-800">
            <p className="font-medium flex items-center gap-2">
            <IconChartBar className="w-4 h-4" />
            Informasi Target:
          </p>
            <p>Total Halaman: {TOTAL_PAGES * targetCount} halaman ({targetCount}x hatam)</p>
            <p>Periode Ramadhan: 29 hari</p>
            <p>Mulai: {new Date(startDate).toLocaleDateString('id-ID')}</p>
            <p>Selesai: {endDate.toLocaleDateString('id-ID')}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Mulai Tracking
            <IconRocket className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
