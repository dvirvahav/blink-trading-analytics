import { SearchBox } from '@fluentui/react-search';
import { useState, useMemo } from 'react';
import { DataTableProps } from '@types'
import './DataTable.css';

/**
 * DataTable component.
 * Displays Excel-like data with a global search across all columns.
 * @param {DataTableProps} excelData - The Excel data to render.
 */

export const DataTable = ({ excelData }: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');

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
          onChange={(_, newValue) => setSearchQuery(newValue?.value ?? '')}
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
            {filteredData?.map((row, rowIdx) => (
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
    </div>
  );
};
