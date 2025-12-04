using Microsoft.AspNetCore.Mvc;
using BlinkTradingAnalytics.Api.Services;
using BlinkTradingAnalytics.Api.Models;

namespace BlinkTradingAnalytics.Api.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly ExcelService _excelService;

    public UploadController(ExcelService excelService)
    {
        _excelService = excelService;
    }

    [HttpPost("excel")]
    public async Task<IActionResult> UploadExcel(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        // Check file extension
        var allowedExtensions = new[] { ".xlsx", ".xls" };
        var fileExtension = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest("Only Excel files (.xlsx, .xls) are allowed");
        }

        try
        {
            using var stream = file.OpenReadStream();
            var result = _excelService.ProcessExcelFile(stream, file.FileName);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error processing file: {ex.Message}");
        }
    }
}
