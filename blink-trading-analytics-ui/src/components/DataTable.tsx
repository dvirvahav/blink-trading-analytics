import React, { useState, useMemo } from 'react';
import { SearchBox } from '@fluentui/react-search';
import './DataTable.css';

interface ExcelData {
  fileName: string;
  totalRows: number;
  columns: string[];
  data: Record<string, any>[];
  uploadedAt: string;
}

interface DataTableProps {
  data: ExcelData;
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query across all fields
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data.data;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return data.data.filter(row =>
      data.columns.some(column =>
        row[column]?.toString().toLowerCase().includes(lowerQuery)
      )
    );
  }, [searchQuery, data.data, data.columns]);

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>{data.fileName}</h2>
        <div className="table-info">
          <span>
            Showing {filteredData.length} of {data.totalRows} rows
          </span>
          <span>Uploaded: {new Date(data.uploadedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="search-container">
        <SearchBox
          placeholder="Search across all fields..."
          value={searchQuery}
          onChange={(_, newValue) => setSearchQuery(newValue?.value || '')}
        />
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {data.columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {data.columns.map((column, colIndex) => (
                  <td key={colIndex}>
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

export default DataTable;
