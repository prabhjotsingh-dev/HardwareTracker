using HardwareTracker.Shared.Models;
using System.Net.Http.Json;

namespace HardwareTracker.Web.Services;

public class HardwareApiClient : IHardwareApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<HardwareApiClient> _logger;

    public HardwareApiClient(HttpClient httpClient, ILogger<HardwareApiClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<SystemHealthSummary?> GetSummaryAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<SystemHealthSummary>("api/hardware/summary");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching hardware summary from API");
            return null;
        }
    }

    public async Task<List<DriveStorageAnalysisDto>?> GetStorageAnalysisAsync()
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<List<DriveStorageAnalysisDto>>("api/hardware/storage-analysis");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching storage analysis from API");
            return null;
        }
    }
}
