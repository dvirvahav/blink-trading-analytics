export interface ExcelData {
  fileName: string;
  totalRows: number;
  columns: string[];
  data: Record<string, any>[];
  uploadedAt: string;
}

export interface DataTableProps {
  excelData: ExcelData;
}

export interface UploadBoxProps {
  onDataReceived: (excelData: ExcelData) => void;
}
