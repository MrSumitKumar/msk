// components/Spinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
  </div>
);

export default Spinner;
