namespace HardwareTracker.Shared.Models;

public class StorageCategoryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public string TotalSize { get; set; } = string.Empty;
    public double PercentageOfUsed { get; set; }
    public string ColorClass { get; set; } = string.Empty;
    public long FileCount { get; set; }
}
