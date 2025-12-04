using ClosedXML.Excel;
using BlinkTradingAnalytics.Api.Models;

namespace BlinkTradingAnalytics.Api.Services;

public class ExcelService
{
    public ExcelDataResponse ProcessExcelFile(Stream fileStream, string fileName)
    {
        using var workbook = new XLWorkbook(fileStream);
        var worksheet = workbook.Worksheet(1); // Get first worksheet

        if (worksheet == null)
        {
            throw new Exception("The Excel file is empty or invalid");
        }

        var response = new ExcelDataResponse
        {
            FileName = fileName,
            Columns = new List<string>(),
            Data = new List<Dictionary<string, object>>()
        };

        // Get the used range
        var range = worksheet.RangeUsed();
        if (range == null)
        {
            throw new Exception("The Excel file contains no data");
        }

        var firstRow = range.FirstRow();
        var lastRow = range.LastRow();
        var firstColumn = range.FirstColumn();
        var lastColumn = range.LastColumn();

        // Get column headers from first row
        for (int col = firstColumn.ColumnNumber(); col <= lastColumn.ColumnNumber(); col++)
        {
            var headerValue = firstRow.Cell(col).GetString();
            response.Columns.Add(string.IsNullOrWhiteSpace(headerValue) ? $"Column{col}" : headerValue);
        }

        // Get data rows (starting from row 2, skipping header)
        for (int row = firstRow.RowNumber() + 1; row <= lastRow.RowNumber(); row++)
        {
            var rowData = new Dictionary<string, object>();
            
            for (int col = firstColumn.ColumnNumber(); col <= lastColumn.ColumnNumber(); col++)
            {
                var columnName = response.Columns[col - firstColumn.ColumnNumber()];
                var cell = worksheet.Cell(row, col);
                
                // Get cell value based on data type
                object cellValue;
                if (cell.IsEmpty())
                {
                    cellValue = "";
                }
                else if (cell.DataType == XLDataType.Number)
                {
                    cellValue = cell.GetDouble();
                }
                else if (cell.DataType == XLDataType.DateTime)
                {
                    cellValue = cell.GetDateTime().ToString("yyyy-MM-dd");
                }
                else if (cell.DataType == XLDataType.Boolean)
                {
                    cellValue = cell.GetBoolean();
                }
                else
                {
                    cellValue = cell.GetString();
                }
                
                rowData[columnName] = cellValue;
            }
            
            response.Data.Add(rowData);
        }

        response.TotalRows = response.Data.Count;
        return response;
    }
}
