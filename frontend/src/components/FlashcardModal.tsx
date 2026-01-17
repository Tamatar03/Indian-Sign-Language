import { useEffect } from 'react';
import { FlashcardItem } from '../data/learningData';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: FlashcardItem;
  items: FlashcardItem[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function FlashcardModal({
  isOpen,
  onClose,
  currentItem,
  items,
  currentIndex,
  onNext,
  onPrevious,
}: FlashcardModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrevious, onClose]);

  if (!isOpen) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center p-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full">
              {currentItem.category}
            </span>
          </div>

          {/* Label */}
          <h2 className="text-4xl font-bold text-gray-800 mb-6">{currentItem.label}</h2>

          {/* GIF Placeholder */}
          <div className="w-full aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
            <img
              src={currentItem.gifUrl}
              alt={`Sign for ${currentItem.label}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if GIF doesn't exist yet
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="text-center p-8">
                    <div class="text-6xl mb-4">🎬</div>
                    <p class="text-gray-600 font-semibold">GIF Placeholder</p>
                    <p class="text-gray-400 text-sm mt-2">${currentItem.label}</p>
                  </div>
                `;
              }}
            />
          </div>

          {/* Progress Indicator */}
          <div className="text-sm text-gray-500 mb-6">
            {currentIndex + 1} of {items.length}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 w-full">
            <button
              onClick={onPrevious}
              disabled={isFirst}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                isFirst
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              }`}
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={onNext}
              disabled={isLast}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                isLast
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              }`}
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Keyboard Hints */}
          <div className="mt-6 text-xs text-gray-400 flex gap-4">
            <span>← → Arrow keys to navigate</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
