import React from 'react';
import { Filter, FilterX } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  hasActiveFilters, 
  onFilterToggle, 
  onClearFilters 
}) => {
  return (
    <div className="relative w-full sm:w-80">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search courses..."
        className="pr-16"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Clear Filters"
          >
            <FilterX className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFilterToggle}
            className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="Filter"
          >
            <Filter className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;