import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination.previous && !pagination.next) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-12 pb-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(pagination.current - 1)}
        disabled={!pagination.previous}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        Page {pagination.current}
      </span>
      
      <Button
        variant="outline"
        onClick={() => onPageChange(pagination.current + 1)}
        disabled={!pagination.next}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;