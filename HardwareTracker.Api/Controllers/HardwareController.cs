using HardwareTracker.Api.Services;
using HardwareTracker.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace HardwareTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HardwareController : ControllerBase
{
    private readonly IHardwareService _hardwareService;
    private readonly IStorageAnalysisService _storageAnalysisService;

    public HardwareController(IHardwareService hardwareService, IStorageAnalysisService storageAnalysisService)
    {
        _hardwareService = hardwareService;
        _storageAnalysisService = storageAnalysisService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<SystemHealthSummary>> GetSummary()
    {
        var summary = await _hardwareService.GetSystemHealthSummaryAsync();
        return Ok(summary);
    }

    [HttpGet("storage-analysis")]
    public async Task<ActionResult<List<DriveStorageAnalysisDto>>> GetStorageAnalysis([FromQuery] string? drive)
    {
        var analysis = await _storageAnalysisService.GetStorageAnalysisAsync(drive);
        return Ok(analysis);
    }

    [HttpGet("drives")]
    public ActionResult<List<string>> GetDrives()
    {
        var drives = DriveInfo.GetDrives()
            .Where(d => d.IsReady && d.DriveType == DriveType.Fixed)
            .Select(d => d.Name.TrimEnd('\\', '/'))
            .ToList();
        return Ok(drives);
    }
}
