import { useEffect } from 'react';

export function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}: {
  message: string;
  type?: 'info' | 'success' | 'error';
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const bg = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-600' : 'bg-gray-800';
  return (
    <div
      className={`fixed bottom-4 right-4 ${bg} text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2`}
      role="alert"
    >
      {message}
    </div>
  );
}
