import React from 'react';
import { XCircle, Filter } from 'lucide-react';
import Select from '../ui/Select';
import Button from '../ui/Button';

const FilterPanel = ({
  isOpen,
  onClose,
  categories,
  levels,
  languages,
  selectedCategory,
  selectedLevel,
  selectedLanguage,
  onCategoryChange,
  onLevelChange,
  onLanguageChange,
  onApplyFilters,
  onResetFilters
}) => {



  // Handle apply filters
  const handleApplyFilters = () => {
    const filters = {
      categories: selectedCategory || undefined,
      level: selectedLevel || undefined,
      language: selectedLanguage || undefined
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    onApplyFilters?.(filters);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Handle reset filters
  const handleResetFilters = () => {
    onResetFilters?.();
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <Select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Levels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level
              </label>
              <Select
                value={selectedLevel}
                onChange={(e) => onLevelChange(e.target.value)}
                className="w-full"
              >
                <option value="">All Levels</option>
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <Select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="flex-1 px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Reset All
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;