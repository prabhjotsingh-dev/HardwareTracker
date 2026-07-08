using HardwareTracker.Shared.Models;

namespace HardwareTracker.Api.Services;

public interface IStorageAnalysisService
{
    Task<List<DriveStorageAnalysisDto>> GetStorageAnalysisAsync(string? driveName = null);
}
