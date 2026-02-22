import { useEffect, useRef, useState } from 'react';
import { IconX } from '@tabler/icons-react';

export type ToastType = 'error' | 'success' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onCloseRef.current();
      }, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const bgColor = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ease-in-out z-50 ${
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0'
      }`}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            onCloseRef.current();
          }, 300);
        }}
        className="hover:opacity-75 transition-opacity"
      >
        <IconX className="w-4 h-4" />
      </button>
    </div>
  );
}

export type { ToastProps };
