using HardwareTracker.Shared.Models;
using HardwareTracker.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HardwareTracker.Web.Pages;

public class IndexModel : PageModel
{
    private readonly IHardwareApiClient _apiClient;

    public SystemHealthSummary? Summary { get; set; }
    public string? ErrorMessage { get; set; }

    public IndexModel(IHardwareApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public async Task OnGetAsync()
    {
        try
        {
            Summary = await _apiClient.GetSummaryAsync();
            if (Summary == null)
            {
                ErrorMessage = "Could not connect to the HardwareTracker API. Make sure the backend API project is running.";
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Error fetching system telemetry: {ex.Message}";
        }
    }
}
