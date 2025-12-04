import React, { useState } from 'react';
import './App.css';
import { UploadBox, DataTable } from '@components';
import { ExcelData } from '@types';

export const App = ()=> {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);

  const handleDataReceived = (data: ExcelData) => {
    setExcelData(data);
  };

  return (
    <div className="App">
      {!excelData ? (
        <UploadBox onDataReceived={handleDataReceived} />
      ) : (
        <DataTable excelData={excelData} />
      )}
    </div>
  );
}
