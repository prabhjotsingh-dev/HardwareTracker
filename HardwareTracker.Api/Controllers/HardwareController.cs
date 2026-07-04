using HardwareTracker.Api.Services;
using HardwareTracker.Shared.Models;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<ActionResult<List<DriveStorageAnalysisDto>>> GetStorageAnalysis()
    {
        var analysis = await _storageAnalysisService.GetStorageAnalysisAsync();
        return Ok(analysis);
    }
}
