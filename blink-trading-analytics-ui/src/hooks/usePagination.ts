import { useState, useCallback } from 'react';
import { UsePaginationOptions, UsePaginationReturn } from '@types';

/**
 * Custom hook for pagination logic
 * Handles page state, limits, indices, and navigation.
 */
export const usePagination = ({
  totalItems,
  rowsPerPage,
  initialPage = 1
}: UsePaginationOptions): UsePaginationReturn => {

  // Make sure rowsPerPage is never 0 (avoid division by zero)
  const safeRowsPerPage = Math.max(1, rowsPerPage);

  // Calculate how many pages exist in total
  const totalPages = Math.ceil(totalItems / safeRowsPerPage);

  // Helper to make sure a page number stays inside valid range
  const getValidPage = useCallback((page: number) => {
    if (totalPages === 0) return 1; // no data → default page 1
    return Math.max(1, Math.min(page, totalPages));
  }, [totalPages]);

  // Current selected page (with initial bounds checking)
  const [currentPage, setCurrentPage] = useState(() => getValidPage(initialPage));

  // Ensure currentPage stays valid when totalPages changes (e.g. filtering)
  const validCurrentPage = getValidPage(currentPage);

  // Calculate which data indices belong to this page
  const startIndex = (validCurrentPage - 1) * safeRowsPerPage;
  const endIndex = Math.min(startIndex + safeRowsPerPage, totalItems);

  // Move to a specific page
  const goToPage = useCallback((page: number) => {
    const validPage = getValidPage(page);
    setCurrentPage(validPage);
  }, [getValidPage]);

  // Move to next page (if exists)
  const nextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      setCurrentPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages]);

  // Move to previous page (if exists)
  const prevPage = useCallback(() => {
    if (validCurrentPage > 1) {
      setCurrentPage(validCurrentPage - 1);
    }
  }, [validCurrentPage]);

  // Helper: return only the items for the current page
  const sliceData = useCallback(<T>(dataArray: T[]): T[] => {
    return dataArray.slice(startIndex, endIndex);
  }, [startIndex, endIndex]);

  return {
    currentPage: validCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    sliceData,
  };
};
