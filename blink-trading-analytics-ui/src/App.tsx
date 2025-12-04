import React, { useState } from 'react';
import './App.css';
import UploadBox from './components/UploadBox';
import DataTable from './components/DataTable';

interface ExcelData {
  fileName: string;
  totalRows: number;
  columns: string[];
  data: Record<string, any>[];
  uploadedAt: string;
}

function App() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);

  const handleDataReceived = (data: ExcelData) => {
    setExcelData(data);
  };

  return (
    <div className="App">
      {!excelData ? (
        <UploadBox onDataReceived={handleDataReceived} />
      ) : (
        <DataTable data={excelData} />
      )}
    </div>
  );
}

export default App;
