import { IconAlertTriangle } from '@tabler/icons-react';


interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ResetModal({ isOpen, onClose, onConfirm }: ResetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all">
        {/* Icon */}
        <div className="text-center mb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <IconAlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Reset Semua Data?
          </h3>
          <p className="text-gray-600 text-sm">
            Semua progress tracking akan dihapus. Anda harus melakukan setup ulang.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Ya, Reset Data
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}