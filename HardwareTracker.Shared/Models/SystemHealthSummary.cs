namespace HardwareTracker.Shared.Models;

public class SystemHealthSummary
{
    public string MachineName { get; set; } = string.Empty;
    public string OsVersion { get; set; } = string.Empty;
    public string ProcessorName { get; set; } = string.Empty;
    public int PhysicalCores { get; set; }
    public int LogicalCores { get; set; }
    public double TotalMemoryGb { get; set; }
    public double UsedMemoryGb { get; set; }
    public double AvailableMemoryGb { get; set; }
    public double MemoryUsagePercentage { get; set; }
    public List<DriveInfoDto> Drives { get; set; } = new();
    public DateTime LastUpdated { get; set; }
    public string OverallHealth { get; set; } = string.Empty;
    public string StatusMessage { get; set; } = string.Empty;
}
