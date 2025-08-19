import React from 'react';
import { XCircle } from 'lucide-react';
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
  onLanguageChange
}) => {
  return (
    <div
      className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <XCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto h-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Level
          </label>
          <Select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
          >
            <option value="">All Levels</option>
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <Select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
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
  );
};

export default FilterPanel;