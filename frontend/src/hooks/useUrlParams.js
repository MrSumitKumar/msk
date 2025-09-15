import { useSearchParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react';

const useUrlParams = (initialState = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or use defaults
  const getInitialValues = () => {
    const values = {};
    Object.keys(initialState).forEach(key => {
      values[key] = searchParams.get(key) || initialState[key];
    });
    return values;
  };

  // Update URL when state changes
  const updateUrl = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Reset all params
  const resetParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    getInitialValues,
    updateUrl,
    resetParams,
  };
};

export default useUrlParams;