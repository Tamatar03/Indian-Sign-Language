import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../../ui/Card';
import { getAllItems, FlashcardItem } from '../../data/learningData';
import FlashcardModal from '../../components/FlashcardModal';

export function Dictionary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filteredItems, setFilteredItems] = useState<FlashcardItem[]>([]);

    // Get all items from all modules
    const allItems = useMemo(() => getAllItems(), []);

    // Filter items based on search query
    const searchResults = useMemo(() => {
        const results = allItems.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredItems(results);
        return results;
    }, [searchQuery, allItems]);

    const handleItemClick = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    const handleNext = () => {
        if (selectedIndex < filteredItems.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen pb-20 p-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Dictionary</h1>
                <p className="text-slate-600">Search across all ISL signs</p>
            </div>

            {/* Sticky Search Bar */}
            <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md py-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for a sign... (e.g., 'Run', 'Hello', 'A')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-100 border-2 border-slate-200 focus:border-blue-400 focus:bg-white outline-none text-slate-800 placeholder:text-slate-400 transition-all"
                    />
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-slate-600 text-sm uppercase tracking-wider">
                    {searchQuery ? `${searchResults.length} Results` : `All Signs (${allItems.length})`}
                </h2>
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Clear Search
                    </button>
                )}
            </div>

            {/* Grid of Items */}
            {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {searchResults.map((item, index) => (
                        <Card
                            key={item.id}
                            hoverEffect
                            onClick={() => handleItemClick(index)}
                            className="cursor-pointer aspect-square flex flex-col items-center justify-center gap-2 text-center p-4 border-2 border-slate-200 hover:border-blue-400 transition-all group"
                        >
                            <div className="text-3xl font-bold text-slate-800 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                                {item.label}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {item.category}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No results found</h3>
                    <p className="text-slate-500">Try searching for something else</p>
                </div>
            )}

            {/* Flashcard Modal */}
            {filteredItems.length > 0 && (
                <FlashcardModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    currentItem={filteredItems[selectedIndex]}
                    items={filteredItems}
                    currentIndex={selectedIndex}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            )}
        </div>
    );
}
