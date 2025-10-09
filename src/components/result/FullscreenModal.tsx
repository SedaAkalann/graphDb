import React from 'react';
import { X, Maximize2 } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const { isDarkMode } = useDarkMode();

  // ESC tuşu ile kapatma
  React.useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Body scroll'u engelle
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`
        relative w-[98vw] h-[98vh] rounded-lg shadow-2xl overflow-hidden
        ${isDarkMode 
          ? 'bg-gray-900 border border-gray-700' 
          : 'bg-white border border-gray-200'
        }
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between px-6 py-4 border-b
          ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}
        `}>
          <div className="flex items-center gap-3">
            <Maximize2 size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title || 'Tam Ekran Görünüm'}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className={`
              p-2 rounded-md transition-all duration-200
              ${isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }
            `}
            title="Kapat (ESC)"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="w-full h-[calc(98vh-80px)] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
