namespace BlinkTradingAnalytics.Api.Models;

public class ExcelDataResponse
{
    public string FileName { get; set; } = string.Empty;
    public int TotalRows { get; set; }
    public List<string> Columns { get; set; } = new();
    public List<Dictionary<string, object>> Data { get; set; } = new();
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}

public class ExcelRow
{
    public string תאריך { get; set; } = string.Empty;
    public string סוג_פעולה { get; set; } = string.Empty;
    public string שם_הנייר { get; set; } = string.Empty;
    public double? כמות { get; set; }
    public double? מחיר_שנייה_ממוצע { get; set; }
    public double? סכום_הפעולה { get; set; }
    public double? עמלה { get; set; }
    public double? יתרת_מזומן { get; set; }
}
