import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleById } from '../../data/learningData';
import { Card } from '../../ui/Card';
import FlashcardModal from '../../components/FlashcardModal';

export function ModuleDetailView() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const module = getModuleById(moduleId || '');

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-700">Module not found</h2>
        <button
          onClick={() => navigate('/learn')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Modules
        </button>
      </div>
    );
  }

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    if (currentIndex < module.items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/learn')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Back to modules"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3">
          <span className="text-4xl">{module.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{module.name}</h1>
            <p className="text-sm text-slate-500">{module.description}</p>
          </div>
        </div>
      </div>

      {/* Item Count */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-slate-700">
          <span className="font-bold text-blue-600">{module.items.length}</span> items to learn
        </p>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {module.items.map((item, index) => (
          <Card
            key={item.id}
            hoverEffect
            className="cursor-pointer group aspect-square flex items-center justify-center border-2 border-slate-200 hover:border-blue-400 transition-all"
            onClick={() => handleItemClick(index)}
          >
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-slate-800 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                {item.label}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Flashcard Modal */}
      <FlashcardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentItem={module.items[currentIndex]}
        items={module.items}
        currentIndex={currentIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}
