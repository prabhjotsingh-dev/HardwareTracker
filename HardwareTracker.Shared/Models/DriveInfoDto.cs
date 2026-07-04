namespace HardwareTracker.Shared.Models;

public class DriveInfoDto
{
    public string Name { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string DriveType { get; set; } = string.Empty;
    public double TotalSizeGb { get; set; }
    public double FreeSpaceGb { get; set; }
    public double UsedSpaceGb { get; set; }
    public double UsagePercentage { get; set; }
}
