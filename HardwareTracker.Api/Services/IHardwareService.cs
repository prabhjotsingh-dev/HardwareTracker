using HardwareTracker.Shared.Models;

namespace HardwareTracker.Api.Services;

public interface IHardwareService
{
    Task<SystemHealthSummary> GetSystemHealthSummaryAsync();
}
