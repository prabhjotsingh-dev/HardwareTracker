using Hardware.Info;
using HardwareTracker.Shared.Models;
using System.Runtime.InteropServices;

namespace HardwareTracker.Api.Services;

public class HardwareService : IHardwareService
{
    private readonly IHardwareInfo _hardwareInfo;
    private readonly ILogger<HardwareService> _logger;
    private readonly IConfiguration _configuration;

    private static SystemHealthSummary? _cachedSummary;
    private static DateTime _lastSummaryTime = DateTime.MinValue;
    private static readonly object _summaryLock = new();

    public HardwareService(ILogger<HardwareService> logger, IConfiguration configuration)
    {
        _hardwareInfo = new HardwareInfo();
        _logger = logger;
        _configuration = configuration;
    }

    public Task<SystemHealthSummary> GetSystemHealthSummaryAsync()
    {
        lock (_summaryLock)
        {
            if (_cachedSummary != null && (DateTime.UtcNow - _lastSummaryTime).TotalSeconds < 3)
            {
                return Task.FromResult(_cachedSummary);
            }
        }

        return Task.Run(() =>
        {
            try
            {
                _hardwareInfo.RefreshCPUList();
                _hardwareInfo.RefreshMemoryStatus();
                _hardwareInfo.RefreshDriveList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing hardware info");
            }

            var cpu = _hardwareInfo.CpuList.FirstOrDefault();
            var mem = _hardwareInfo.MemoryStatus;

            string processorName = cpu?.Name?.Trim() ?? "Unknown Processor";
            if (string.IsNullOrEmpty(processorName) || processorName == "Unknown Processor")
            {
                processorName = Environment.GetEnvironmentVariable("PROCESSOR_IDENTIFIER") ?? "System Processor";
            }

            int physicalCores = (int)(cpu?.NumberOfCores ?? (uint)(Environment.ProcessorCount / 2));
            if (physicalCores == 0) physicalCores = Math.Max(1, Environment.ProcessorCount / 2);
            int logicalCores = (int)(cpu?.NumberOfLogicalProcessors ?? (uint)Environment.ProcessorCount);
            if (logicalCores == 0) logicalCores = Environment.ProcessorCount;

            double totalMemGb = mem != null ? Math.Round((double)mem.TotalPhysical / (1024 * 1024 * 1024), 2) : 16.0;
            double availMemGb = mem != null ? Math.Round((double)mem.AvailablePhysical / (1024 * 1024 * 1024), 2) : 8.0;
            double usedMemGb = Math.Round(totalMemGb - availMemGb, 2);
            double memUsagePct = totalMemGb > 0 ? Math.Round((usedMemGb / totalMemGb) * 100, 1) : 0;

            var drives = new List<DriveInfoDto>();
            try
            {
                foreach (var d in DriveInfo.GetDrives().Where(d => d.IsReady))
                {
                    double totalGb = Math.Round((double)d.TotalSize / (1024 * 1024 * 1024), 2);
                    double freeGb = Math.Round((double)d.AvailableFreeSpace / (1024 * 1024 * 1024), 2);
                    double usedGb = Math.Round(totalGb - freeGb, 2);
                    double pct = totalGb > 0 ? Math.Round((usedGb / totalGb) * 100, 1) : 0;

                    drives.Add(new DriveInfoDto
                    {
                        Name = d.Name,
                        Label = string.IsNullOrWhiteSpace(d.VolumeLabel) ? "Local Disk" : d.VolumeLabel,
                        DriveType = d.DriveType.ToString(),
                        TotalSizeGb = totalGb,
                        FreeSpaceGb = freeGb,
                        UsedSpaceGb = usedGb,
                        UsagePercentage = pct
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to enumerate drive information");
            }

            var memCriticalThreshold = _configuration.GetValue<double>("HealthThresholds:MemoryCriticalThreshold", 90);
            var driveCriticalThreshold = _configuration.GetValue<double>("HealthThresholds:DriveCriticalThreshold", 90);
            var memWarningThreshold = _configuration.GetValue<double>("HealthThresholds:MemoryWarningThreshold", 80);
            var driveWarningThreshold = _configuration.GetValue<double>("HealthThresholds:DriveWarningThreshold", 85);

            string health = "Optimal";
            string statusMsg = "All hardware components are operating within normal parameters.";
            if (memUsagePct > memCriticalThreshold || drives.Any(d => d.UsagePercentage > driveCriticalThreshold))
            {
                health = "Critical";
                statusMsg = "Critical resource usage detected! Memory or disk space is running out.";
            }
            else if (memUsagePct > memWarningThreshold || drives.Any(d => d.UsagePercentage > driveWarningThreshold))
            {
                health = "Warning";
                statusMsg = "Warning: High memory or storage utilization detected.";
            }

            var summary = new SystemHealthSummary
            {
                MachineName = Environment.MachineName,
                OsVersion = RuntimeInformation.OSDescription,
                ProcessorName = processorName,
                PhysicalCores = physicalCores,
                LogicalCores = logicalCores,
                TotalMemoryGb = totalMemGb,
                UsedMemoryGb = usedMemGb,
                AvailableMemoryGb = availMemGb,
                MemoryUsagePercentage = memUsagePct,
                Drives = drives,
                LastUpdated = DateTime.UtcNow,
                OverallHealth = health,
                StatusMessage = statusMsg
            };

            lock (_summaryLock)
            {
                _cachedSummary = summary;
                _lastSummaryTime = DateTime.UtcNow;
            }

            return summary;
        });
    }
}
