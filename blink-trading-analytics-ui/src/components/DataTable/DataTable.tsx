import { SearchBox } from '@fluentui/react-search';
import { useState, useMemo, useEffect } from 'react';
import { DataTableProps } from '@types'
import { TABLE_CONFIG } from '../../constants/table.constants'
import { usePagination } from '@hooks'
import './DataTable.css';

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * DataTable component.
 * Displays Excel-like data with a global search across all columns.
 * @param {DataTableProps} excelData - The Excel data to render.
 */

export const DataTable = ({ excelData }: DataTableProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search input by 300ms
  const searchQuery = useDebounce(searchInput, 300);

  // Show loading when search input changes (during debounce period)
  useEffect(() => {
    if (searchInput) {
      setIsLoading(true);
    }
  }, [searchInput]);

  // Separate header row and data rows
  const headerRow = excelData.data?.[0] || {};

  // Filter data based on search query across all fields (excluding header row)
  const filteredData = useMemo(() => {
      const dataRows = excelData.data?.slice(1) || [];

    if (!searchQuery.trim()) {
      return dataRows;
    }

    const normalizedSearchQuery = searchQuery.toLowerCase();
    return dataRows.filter(row =>
      excelData.columns?.some(column =>
        row[column]?.toString().toLowerCase().includes(normalizedSearchQuery)
      )
    );
}, [searchQuery, excelData.data, excelData.columns]);

  // Hide loading when filtered data updates
  useEffect(() => {
    setIsLoading(false);
  }, [filteredData]);

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    sliceData
  } = usePagination({
    totalItems: filteredData.length,
    rowsPerPage: TABLE_CONFIG.ROWS_PER_PAGE,
    initialPage: 1
  });

  // Get paginated data using the hook's sliceData function
  const paginatedData = sliceData(filteredData);

  // Handle search change - updates search input immediately (pagination hook handles page reset)
  const handleSearchChange = (newValue: string) => {
    const MAX_SEARCH_LENGTH = 100;
    const sanitized = newValue.slice(0, MAX_SEARCH_LENGTH);
    setSearchInput(sanitized);
  };

  // Early return guard - prevent crashes on invalid data
  if (!excelData?.data?.length || !excelData?.columns?.length) {
    return (
      <div className="data-table-container">
        <div className="empty-state">
          <div className="empty-state-message">No data to display</div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>{excelData.fileName}</h2>
        <div className="table-info">
          <span>
            סה"כ פעולות: {excelData.totalRows}
          </span>
          <span>Uploaded: {new Date(excelData.uploadedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="search-container">
        <SearchBox
          placeholder="Search across all fields..."
          value={searchInput}
          onChange={(_, newValue) => handleSearchChange(newValue?.value ?? '')}
          aria-label="Search table data"
        />
      </div>

      {isLoading && (
        <div className="loading-indicator" aria-live="polite">Filtering data...</div>
      )}

      {paginatedData.length === 0 ? (
        <div className="empty-state" role="status" aria-live="polite">
          {excelData.data?.length <= 1 ? (
            <div className="empty-state-message">No data available</div>
          ) : (
            <div>
              <div className="empty-state-message">No results found for '{searchQuery}'</div>
              <button className="clear-search-button" onClick={() => handleSearchChange('')} aria-label="Clear search and show all data">Clear search</button>
            </div>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" role="table" aria-label={`${excelData.fileName} data table`}>
            <thead>
              <tr role="row">
                {excelData.columns?.map((column, columnIdx) => (
                  <th key={columnIdx} role="columnheader" scope="col">
                    {headerRow[column]?.toString() || ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((row, rowIdx) => (
                <tr key={`row-${startIndex + rowIdx}`} role="row">
                  {excelData.columns?.map((column, columnIdx) => (
                    <td key={columnIdx} role="cell">
                      {row[column] !== null && row[column] !== undefined
                        ? row[column].toString()
                        : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination-container" aria-label="Table pagination">
          <button
            className="pagination-button"
            onClick={prevPage}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Previous
          </button>

          <span className="pagination-info" role="status" aria-live="polite">
            Page {currentPage} of {totalPages} (showing rows {startIndex + 1}-{endIndex} of {filteredData.length} total)
          </span>

          <button
            className="pagination-button"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};
