import React from 'react';
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
  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>{data.fileName}</h2>
        <div className="table-info">
          <span>Total Rows: {data.totalRows}</span>
          <span>Uploaded: {new Date(data.uploadedAt).toLocaleString()}</span>
        </div>
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
            {data.data.map((row, rowIndex) => (
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
