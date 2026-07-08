namespace HardwareTracker.Shared.Models;

public class DriveStorageAnalysisDto
{
    public string DriveName { get; set; } = string.Empty;
    public string TotalSize { get; set; } = string.Empty;
    public string TotalUsed { get; set; } = string.Empty;
    public string FreeSpace { get; set; } = string.Empty;
    public double UsedPercentage { get; set; }
    public double FreePercentage { get; set; }
    public List<StorageCategoryDto> Categories { get; set; } = new();
    public DateTime LastScanned { get; set; } = DateTime.UtcNow;
}
