namespace HardwareTracker.Shared.Models;

public class StorageCategoryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public double TotalSizeGb { get; set; }
    public double PercentageOfUsed { get; set; }
    public string ColorClass { get; set; } = string.Empty;
    public long FileCount { get; set; }
}
