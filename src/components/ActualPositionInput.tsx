import { useState } from 'react';
import { TOTAL_PAGES, LINES_PER_PAGE } from '../data/pageData';
import { IconBook, IconX } from '@tabler/icons-react';

interface ActualPositionInputProps {
  onSave: (page: number, line: number) => void;
  onClear: () => void;
  currentPage?: number;
  currentLine?: number;
}

export default function ActualPositionInput({
  onSave,
  onClear,
  currentPage,
  currentLine,
}: ActualPositionInputProps) {
  const [page, setPage] = useState(currentPage?.toString() || '1');
  const [line, setLine] = useState(currentLine?.toString() || '1');
  const [isEditing, setIsEditing] = useState(!currentPage && !currentLine);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(parseInt(page), parseInt(line));
    setIsEditing(false);
  };

  const handleClear = () => {
    onClear();
    setPage('1');
    setLine('1');
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing || (!currentPage && !currentLine)) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <IconBook className="w-5 h-5 text-emerald-600" />
          Input Posisi Bacaan Aktual
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Halaman
              </label>
              <select
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baris
              </label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                {Array.from({ length: LINES_PER_PAGE }, (_, i) => i + 1).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Simpan Posisi
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <IconBook className="w-5 h-5 text-emerald-600" />
          Posisi Bacaan Aktual
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Hapus posisi"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-6 text-center">
        <div className="text-4xl font-bold text-emerald-700 mb-1">
          Hal. {currentPage}
        </div>
        <div className="text-2xl font-semibold text-emerald-600">
          Baris {currentLine}
        </div>
      </div>
    </div>
  );
}
