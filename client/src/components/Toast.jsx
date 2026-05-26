import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toasts } = useToast();

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-lg"></i>;
      case 'error': return <i className="fa-solid fa-circle-exclamation text-red-500 text-lg"></i>;
      case 'info': return <i className="fa-solid fa-circle-info text-blue-500 text-lg"></i>;
      default: return <i className="fa-solid fa-circle-check text-blue-500 text-lg"></i>;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 pointer-events-none">
      {toasts.map(toast => {
        const isObject = typeof toast.message === 'object';
        return (
          <div 
            key={toast.id} 
            className={`glass border flex items-center gap-3 p-4 rounded-2xl shadow-xl pointer-events-auto bg-white/95 border-slate-200/80 animate-[fadeIn_0.3s_ease-out] ${isObject ? 'min-w-[280px] sm:min-w-[340px]' : 'pr-6'}`}
          >
            {!isObject && getIcon(toast.type)}
            {isObject ? (
              <div className="w-full">{toast.message}</div>
            ) : (
              <span className="text-sm font-semibold text-darkText">{toast.message}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
