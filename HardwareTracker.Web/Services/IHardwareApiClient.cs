using HardwareTracker.Shared.Models;

namespace HardwareTracker.Web.Services;

public interface IHardwareApiClient
{
    Task<SystemHealthSummary?> GetSummaryAsync();
    Task<List<DriveStorageAnalysisDto>?> GetStorageAnalysisAsync();
}
