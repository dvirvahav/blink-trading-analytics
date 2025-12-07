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

// Hook interfaces
export interface UsePaginationOptions {
  totalItems: number;
  rowsPerPage: number;
  initialPage?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  sliceData: <T>(dataArray: T[]) => T[];
}

// Generic debounce hook (no specific interface needed due to generic nature)
