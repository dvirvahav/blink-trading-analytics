import { SearchBox } from '@fluentui/react-search';
import { useState, useMemo } from 'react';
import { DataTableProps } from '@types'
import { TABLE_CONFIG } from '../../constants/table.constants'
import './DataTable.css';

/**
 * DataTable component.
 * Displays Excel-like data with a global search across all columns.
 * @param {DataTableProps} excelData - The Excel data to render.
 */

export const DataTable = ({ excelData }: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
  }, [searchQuery, excelData]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / TABLE_CONFIG.ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * TABLE_CONFIG.ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + TABLE_CONFIG.ROWS_PER_PAGE, filteredData.length);
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

      {paginatedData.length === 0 ? (
        <div className="empty-state">
          {excelData.data?.length <= 1 ? (
            <div className="empty-state-message">No data available</div>
          ) : (
            <div>
              <div className="empty-state-message">No results found for '{searchQuery}'</div>
              <button className="clear-search-button" onClick={() => handleSearchChange('')}>Clear search</button>
            </div>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {excelData.columns?.map((column, columnIdx) => (
                  <th key={columnIdx}>
                    {headerRow[column]?.toString() || ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((row, rowIdx) => (
                <tr key={`row-${startIndex + rowIdx}`}>
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
      )}

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
