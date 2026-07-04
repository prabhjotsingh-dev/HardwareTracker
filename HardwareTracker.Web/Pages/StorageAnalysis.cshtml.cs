using HardwareTracker.Shared.Models;
using HardwareTracker.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HardwareTracker.Web.Pages;

public class StorageAnalysisModel : PageModel
{
    private readonly IHardwareApiClient _apiClient;

    public List<DriveStorageAnalysisDto>? StorageAnalysis { get; set; }
    public string? ErrorMessage { get; set; }
    public bool IsScanning { get; set; } = true;

    public StorageAnalysisModel(IHardwareApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public async Task OnGetAsync()
    {
        await LoadAnalysisAsync();
    }

    public async Task OnPostRefreshAsync()
    {
        await LoadAnalysisAsync();
    }

    private async Task LoadAnalysisAsync()
    {
        IsScanning = true;
        try
        {
            StorageAnalysis = await _apiClient.GetStorageAnalysisAsync();
            if (StorageAnalysis == null)
            {
                ErrorMessage = "Could not connect to the HardwareTracker API. Make sure the backend API project is running.";
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error fetching storage analysis: {ex.Message}";
        }
        IsScanning = false;
    }
}
