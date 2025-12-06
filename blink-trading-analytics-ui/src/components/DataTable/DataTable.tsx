import { SearchBox } from '@fluentui/react-search';
import { useState, useMemo } from 'react';
import { DataTableProps } from '@types'
import './DataTable.css';

// Pagination settings
const ROWS_PER_PAGE = 50;

/**
 * DataTable component.
 * Displays Excel-like data with a global search across all columns.
 * @param {DataTableProps} excelData - The Excel data to render.
 */

export const DataTable = ({ excelData }: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query across all fields
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return excelData.data || [];
    }

    const normalizedSearchQuery = searchQuery.toLowerCase();
    return (excelData.data || []).filter(row =>
      excelData.columns?.some(column =>
        row[column]?.toString().toLowerCase().includes(normalizedSearchQuery)
      )
    );
  }, [searchQuery, excelData.data, excelData.columns]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle search change - updates search and resets page to 1
  const handleSearchChange = (newValue: string) => {
    setSearchQuery(newValue);
    setCurrentPage(1);
  };




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
          value={searchQuery}
          onChange={(_, newValue) => handleSearchChange(newValue?.value ?? '')}
        />
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {excelData.columns?.map((column, columnIdx) => (
                <th key={columnIdx}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {excelData.columns?.map((column, columnIdx) => (
                  <td key={columnIdx}>
                    {row[column]?.toString() || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages} (showing rows {startIndex + 1}-{endIndex} of {filteredData.length} total)
          </span>

          <button
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
