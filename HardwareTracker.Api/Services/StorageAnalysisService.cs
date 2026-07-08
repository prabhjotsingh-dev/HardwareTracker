using HardwareTracker.Shared.Models;
using System.Collections.Concurrent;
using System.IO;

namespace HardwareTracker.Api.Services;

public class StorageAnalysisService : IStorageAnalysisService
{
    private readonly ILogger<StorageAnalysisService> _logger;
    private readonly TimeSpan _cacheDuration;
    private readonly TimeSpan _scanTimeout;

    private static List<DriveStorageAnalysisDto>? _cachedResult;
    private static DateTime _lastCacheTime = DateTime.MinValue;
    private static readonly object _cacheLock = new();

    private static readonly ConcurrentDictionary<string, DriveCacheEntry> _driveCache = new();

    private static readonly EnumerationOptions _enumOptions = new()
    {
        IgnoreInaccessible = true,
        ReturnSpecialDirectories = false,
        AttributesToSkip = FileAttributes.ReparsePoint
    };

    public StorageAnalysisService(ILogger<StorageAnalysisService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _cacheDuration = TimeSpan.FromSeconds(configuration.GetValue("StorageAnalysis:CacheDurationSeconds", 60));
        _scanTimeout = TimeSpan.FromSeconds(configuration.GetValue("StorageAnalysis:ScanTimeoutSeconds", 45));
    }

    public async Task<List<DriveStorageAnalysisDto>> GetStorageAnalysisAsync(string? driveName = null)
    {
        if (!string.IsNullOrWhiteSpace(driveName))
        {
            string key = driveName.TrimEnd('\\', '/');

            if (_driveCache.TryGetValue(key, out var entry) &&
                DateTime.UtcNow - entry.Time < _cacheDuration)
            {
                return [entry.Data];
            }

            var drive = DriveInfo.GetDrives()
                .FirstOrDefault(d => d.IsReady && d.Name.TrimEnd('\\', '/')
                    .Equals(key, StringComparison.OrdinalIgnoreCase));

            if (drive == null)
                return [];

            using var cts = new CancellationTokenSource(_scanTimeout);
            var token = cts.Token;

            DriveStorageAnalysisDto? result = null;
            try
            {
                result = await Task.Run(() => AnalyzeDrive(drive, token), token);
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Storage analysis timed out for drive {Drive}", drive.Name);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to analyze drive {Drive}", drive.Name);
            }

            if (result != null)
            {
                _driveCache[key] = new DriveCacheEntry(result, DateTime.UtcNow);
                return [result];
            }

            return [];
        }

        lock (_cacheLock)
        {
            if (_cachedResult != null && DateTime.UtcNow - _lastCacheTime < _cacheDuration)
            {
                return _cachedResult;
            }
        }

        using var cts2 = new CancellationTokenSource(_scanTimeout);
        var token2 = cts2.Token;

        var fixedDrives = DriveInfo.GetDrives().Where(d => d.IsReady && d.DriveType == DriveType.Fixed).ToList();

        var tasks = fixedDrives.Select(drive => Task.Run(() =>
        {
            try
            {
                return AnalyzeDrive(drive, token2);
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Storage analysis timed out for drive {Drive}", drive.Name);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to analyze drive {Drive}", drive.Name);
                return null;
            }
        }, token2));

        var results = (await Task.WhenAll(tasks))
            .Where(r => r != null)
            .Select(r => r!)
            .ToList();

        lock (_cacheLock)
        {
            _cachedResult = results;
            _lastCacheTime = DateTime.UtcNow;
        }

        foreach (var r in results)
            _driveCache[r.DriveName.TrimEnd('\\', '/')] = new DriveCacheEntry(r, DateTime.UtcNow);

        return results;
    }

    private DriveStorageAnalysisDto AnalyzeDrive(DriveInfo drive, CancellationToken token)
    {
        string root = drive.RootDirectory.FullName;
        double totalUsedBytes = 0;
        try
        {
            totalUsedBytes = drive.TotalSize - drive.AvailableFreeSpace;
        }
        catch { }

        var catSystem = new CategoryAccumulator("System", "cat-system");
        var catApps = new CategoryAccumulator("Applications", "cat-applications");
        var catAppData = new CategoryAccumulator("AppData", "cat-appdata");
        var catDocuments = new CategoryAccumulator("Documents", "cat-documents");
        var catMusic = new CategoryAccumulator("Music", "cat-music");
        var catVideos = new CategoryAccumulator("Videos", "cat-videos");
        var catPictures = new CategoryAccumulator("Pictures", "cat-pictures");
        var catDownloads = new CategoryAccumulator("Downloads", "cat-downloads");
        var catDesktop = new CategoryAccumulator("Desktop", "cat-desktop");
        var catOther = new CategoryAccumulator("Other", "cat-other");

        var categoryByName = new Dictionary<string, CategoryAccumulator>(StringComparer.OrdinalIgnoreCase)
        {
            ["System"] = catSystem,
            ["Applications"] = catApps,
            ["AppData"] = catAppData,
            ["Documents"] = catDocuments,
            ["Music"] = catMusic,
            ["Videos"] = catVideos,
            ["Pictures"] = catPictures,
            ["Downloads"] = catDownloads,
            ["Desktop"] = catDesktop,
            ["Other"] = catOther,
        };

        var extensionMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"] = "Documents", [".doc"] = "Documents", [".docx"] = "Documents",
            [".xls"] = "Documents", [".xlsx"] = "Documents", [".ppt"] = "Documents",
            [".pptx"] = "Documents", [".txt"] = "Documents", [".csv"] = "Documents",
            [".md"] = "Documents", [".rtf"] = "Documents", [".odt"] = "Documents",
            [".ods"] = "Documents", [".odp"] = "Documents", [".epub"] = "Documents",
            [".pages"] = "Documents", [".numbers"] = "Documents", [".key"] = "Documents",

            [".mp3"] = "Music", [".flac"] = "Music", [".wav"] = "Music",
            [".aac"] = "Music", [".ogg"] = "Music", [".wma"] = "Music",
            [".m4a"] = "Music", [".opus"] = "Music", [".ape"] = "Music",
            [".aiff"] = "Music", [".wv"] = "Music",

            [".mp4"] = "Videos", [".avi"] = "Videos", [".mkv"] = "Videos",
            [".mov"] = "Videos", [".wmv"] = "Videos", [".flv"] = "Videos",
            [".m4v"] = "Videos", [".webm"] = "Videos", [".ts"] = "Videos",
            [".mts"] = "Videos", [".vob"] = "Videos",

            [".jpg"] = "Pictures", [".jpeg"] = "Pictures", [".png"] = "Pictures",
            [".gif"] = "Pictures", [".bmp"] = "Pictures", [".tiff"] = "Pictures",
            [".tif"] = "Pictures", [".webp"] = "Pictures", [".svg"] = "Pictures",
            [".ico"] = "Pictures", [".heic"] = "Pictures", [".heif"] = "Pictures",
            [".raw"] = "Pictures", [".psd"] = "Pictures",

            [".exe"] = "Applications", [".dll"] = "Applications", [".msi"] = "Applications",
            [".appx"] = "Applications", [".msix"] = "Applications", [".cab"] = "Applications",
            [".msp"] = "Applications",
        };

        string rootNorm = root.TrimEnd('\\', '/');
        var specialDirs = new Dictionary<string, CategoryAccumulator>(StringComparer.OrdinalIgnoreCase);

        void AddIfOnDrive(string? path, CategoryAccumulator cat)
        {
            if (string.IsNullOrWhiteSpace(path)) return;
            try
            {
                string? pathRoot = Path.GetPathRoot(path)?.TrimEnd('\\', '/');
                if (string.Equals(pathRoot, rootNorm, StringComparison.OrdinalIgnoreCase))
                {
                    specialDirs[path.TrimEnd('\\', '/')] = cat;
                }
            }
            catch { }
        }

        AddIfOnDrive(Environment.GetEnvironmentVariable("WINDIR"), catSystem);
        AddIfOnDrive(Environment.GetEnvironmentVariable("ProgramFiles"), catApps);
        AddIfOnDrive(Environment.GetEnvironmentVariable("ProgramFiles(x86)"), catApps);
        AddIfOnDrive(Environment.GetEnvironmentVariable("ProgramData"), catApps);
        AddIfOnDrive(Environment.GetEnvironmentVariable("LOCALAPPDATA"), catAppData);
        AddIfOnDrive(Environment.GetEnvironmentVariable("APPDATA"), catAppData);

        string userProfile = Environment.GetEnvironmentVariable("USERPROFILE") ?? "";
        if (!string.IsNullOrWhiteSpace(userProfile))
        {
            AddIfOnDrive(Path.Combine(userProfile, "Documents"), catDocuments);
            AddIfOnDrive(Path.Combine(userProfile, "Music"), catMusic);
            AddIfOnDrive(Path.Combine(userProfile, "Videos"), catVideos);
            AddIfOnDrive(Path.Combine(userProfile, "Pictures"), catPictures);
            AddIfOnDrive(Path.Combine(userProfile, "Downloads"), catDownloads);
            AddIfOnDrive(Path.Combine(userProfile, "Desktop"), catDesktop);
            AddIfOnDrive(Path.Combine(userProfile, "AppData"), catAppData);
        }

        var stack = new Stack<(DirectoryInfo Dir, CategoryAccumulator? InheritedCat)>();
        stack.Push((drive.RootDirectory, null));

        while (stack.Count > 0)
        {
            token.ThrowIfCancellationRequested();
            var (currentDir, inheritedCat) = stack.Pop();

            if (inheritedCat == null)
            {
                string dirNorm = currentDir.FullName.TrimEnd('\\', '/');
                if (specialDirs.TryGetValue(dirNorm, out var specialCat))
                {
                    inheritedCat = specialCat;
                }
                else if (currentDir.Parent?.Parent?.Name.Equals("Users", StringComparison.OrdinalIgnoreCase) == true)
                {
                    string folderName = currentDir.Name;
                    if (folderName.Equals("Documents", StringComparison.OrdinalIgnoreCase)) inheritedCat = catDocuments;
                    else if (folderName.Equals("Music", StringComparison.OrdinalIgnoreCase)) inheritedCat = catMusic;
                    else if (folderName.Equals("Videos", StringComparison.OrdinalIgnoreCase)) inheritedCat = catVideos;
                    else if (folderName.Equals("Pictures", StringComparison.OrdinalIgnoreCase)) inheritedCat = catPictures;
                    else if (folderName.Equals("Downloads", StringComparison.OrdinalIgnoreCase)) inheritedCat = catDownloads;
                    else if (folderName.Equals("Desktop", StringComparison.OrdinalIgnoreCase)) inheritedCat = catDesktop;
                    else if (folderName.Equals("AppData", StringComparison.OrdinalIgnoreCase)) inheritedCat = catAppData;
                }
                else if (currentDir.Parent == null || string.Equals(currentDir.Parent.FullName.TrimEnd('\\', '/'), rootNorm, StringComparison.OrdinalIgnoreCase))
                {
                    string folderName = currentDir.Name;
                    if (folderName.Equals("Windows", StringComparison.OrdinalIgnoreCase) ||
                        folderName.Equals("$Recycle.Bin", StringComparison.OrdinalIgnoreCase) ||
                        folderName.Equals("System Volume Information", StringComparison.OrdinalIgnoreCase) ||
                        folderName.Equals("Recovery", StringComparison.OrdinalIgnoreCase))
                    {
                        inheritedCat = catSystem;
                    }
                    else if (folderName.Equals("Program Files", StringComparison.OrdinalIgnoreCase) ||
                             folderName.Equals("Program Files (x86)", StringComparison.OrdinalIgnoreCase) ||
                             folderName.Equals("ProgramData", StringComparison.OrdinalIgnoreCase))
                    {
                        inheritedCat = catApps;
                    }
                }
            }

            try
            {
                foreach (var file in currentDir.EnumerateFiles("*", _enumOptions))
                {
                    token.ThrowIfCancellationRequested();
                    try
                    {
                        long length = file.Length;
                        if (inheritedCat != null)
                        {
                            inheritedCat.TotalSize += length;
                            inheritedCat.FileCount++;
                        }
                        else
                        {
                            string ext = file.Extension.ToLowerInvariant();
                            if (extensionMap.TryGetValue(ext, out var catName) &&
                                categoryByName.TryGetValue(catName, out var cat))
                            {
                                cat.TotalSize += length;
                                cat.FileCount++;
                            }
                            else
                            {
                                catOther.TotalSize += length;
                                catOther.FileCount++;
                            }
                        }
                    }
                    catch { }
                }
            }
            catch { }

            try
            {
                foreach (var subDir in currentDir.EnumerateDirectories("*", _enumOptions))
                {
                    token.ThrowIfCancellationRequested();
                    stack.Push((subDir, inheritedCat));
                }
            }
            catch { }
        }

        var allCats = categoryByName.Values.ToArray();
        long calculatedTotalBytes = allCats.Sum(c => c.TotalSize);
        if (totalUsedBytes <= 0)
        {
            totalUsedBytes = calculatedTotalBytes;
        }

        var dtos = allCats
            .Where(c => c.TotalSize > 0 || c.FileCount > 0)
            .OrderByDescending(c => c.TotalSize)
            .Select(c =>
            {
                double pct = totalUsedBytes > 0
                    ? Math.Round((c.TotalSize / (double)totalUsedBytes) * 100, 1)
                    : 0;
                return new StorageCategoryDto
                {
                    CategoryName = c.Name,
                    TotalSize = FormatSize(c.TotalSize),
                    PercentageOfUsed = pct,
                    ColorClass = c.ColorClass,
                    FileCount = c.FileCount
                };
            })
            .ToList();

        double totalBytes = drive.TotalSize;
        double freeBytes = drive.AvailableFreeSpace;

        return new DriveStorageAnalysisDto
        {
            DriveName = drive.Name,
            TotalSize = FormatSize(totalBytes),
            TotalUsed = FormatSize(totalUsedBytes),
            FreeSpace = FormatSize(freeBytes),
            UsedPercentage = totalBytes > 0 ? Math.Round(totalUsedBytes / totalBytes * 100, 1) : 0,
            FreePercentage = totalBytes > 0 ? Math.Round(freeBytes / totalBytes * 100, 1) : 0,
            Categories = dtos,
            LastScanned = DateTime.UtcNow
        };
    }

    private record DriveCacheEntry(DriveStorageAnalysisDto Data, DateTime Time);

    private static string FormatSize(double bytes)
    {
        string[] units = ["B", "KB", "MB", "GB", "TB"];
        int i = 0;
        double size = bytes;
        while (size >= 1024 && i < units.Length - 1)
        {
            size /= 1024;
            i++;
        }
        return $"{size:F1} {units[i]}";
    }

    private class CategoryAccumulator
    {
        public string Name { get; }
        public string ColorClass { get; }
        public long TotalSize { get; set; }
        public long FileCount { get; set; }

        public CategoryAccumulator(string name, string colorClass)
        {
            Name = name;
            ColorClass = colorClass;
        }
    }
}
