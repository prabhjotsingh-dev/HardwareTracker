namespace HardwareTracker.Shared.Models;

public class DriveStorageAnalysisDto
{
    public string DriveName { get; set; } = string.Empty;
    public double TotalSizeGb { get; set; }
    public double TotalUsedGb { get; set; }
    public double FreeSpaceGb { get; set; }
    public List<StorageCategoryDto> Categories { get; set; } = new();
    public DateTime LastScanned { get; set; } = DateTime.UtcNow;
}
