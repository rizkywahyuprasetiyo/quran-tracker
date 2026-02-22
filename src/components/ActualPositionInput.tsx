import { useState } from 'react';
import { TOTAL_PAGES, LINES_PER_PAGE } from '../data/pageData';
import { IconBook, IconX } from '@tabler/icons-react';
import Toast from './Toast';
import type { ToastType } from './Toast';

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
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const validateInputs = (): boolean => {
    const pageNum = parseInt(page);
    const lineNum = parseInt(line);

    if (isNaN(pageNum) || pageNum < 1) {
      setToast({ message: 'Halaman tidak boleh kurang dari 1', type: 'error' });
      return false;
    } else if (pageNum > TOTAL_PAGES) {
      setToast({ message: `Halaman tidak boleh lebih dari ${TOTAL_PAGES}`, type: 'error' });
      return false;
    }

    if (isNaN(lineNum) || lineNum < 1) {
      setToast({ message: 'Baris tidak boleh kurang dari 1', type: 'error' });
      return false;
    } else if (lineNum > LINES_PER_PAGE) {
      setToast({ message: `Baris tidak boleh lebih dari ${LINES_PER_PAGE}`, type: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      onSave(parseInt(page), parseInt(line));
      setIsEditing(false);
      setToast({ message: 'Posisi berhasil disimpan!', type: 'success' });
    }
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
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

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
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baris
              </label>
              <input
                type="number"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
