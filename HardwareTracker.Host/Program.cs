using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Linq;

var apiArgs = new[] { "--urls", "http://localhost:5181;https://localhost:7236" };

using var apiApp = HardwareTracker.Api.Startup.CreateApp(apiArgs);
FreePort(3000);
using var uiProcess = StartNextJs();

var lifetime = new HostLifetime(uiProcess);
Console.CancelKeyPress += (_, e) =>
{
    e.Cancel = true;
    lifetime.Shutdown();
};

AppDomain.CurrentDomain.ProcessExit += (_, _) => lifetime.Dispose();

BuildUI();

await Task.WhenAll(apiApp.RunAsync(), lifetime.WaitForExitAsync());

static void BuildUI()
{
    var uiDir = ResolveProjectPath("HardwareTracker.UI");
    if (uiDir is null)
    {
        Console.WriteLine("UI project not found. Skipping UI build.");
        return;
    }

    var outDir = Path.Combine(uiDir, ".next");
    if (Directory.Exists(outDir))
        return;

    Console.WriteLine("Building UI...");
    var psi = new ProcessStartInfo("cmd.exe", $"/c cd /d \"{uiDir}\" && npm run build")
    {
        UseShellExecute = false,
        RedirectStandardOutput = true,
        RedirectStandardError = true
    };
    using var process = Process.Start(psi)!;
    process.WaitForExit();

    if (process.ExitCode == 0)
        Console.WriteLine("UI build complete.");
    else
        Console.Error.WriteLine("UI build failed.");
}

static Process StartNextJs()
{
    var uiDir = ResolveProjectPath("HardwareTracker.UI");
    if (uiDir is null)
    {
        Console.WriteLine("UI project not found. Cannot start Next.js.");
        Environment.Exit(1);
    }

    Console.WriteLine("Starting Next.js server...");
    var psi = new ProcessStartInfo("cmd.exe", $"/c cd /d \"{uiDir}\" && npx next start -p 3000")
    {
        UseShellExecute = false,
        RedirectStandardOutput = true,
        RedirectStandardError = true
    };
    var process = Process.Start(psi)!;

    process.OutputDataReceived += (_, e) =>
    {
        if (!string.IsNullOrEmpty(e.Data))
            Console.WriteLine($"[Next.js] {e.Data}");
    };
    process.ErrorDataReceived += (_, e) =>
    {
        if (!string.IsNullOrEmpty(e.Data))
            Console.Error.WriteLine($"[Next.js] {e.Data}");
    };
    process.BeginOutputReadLine();
    process.BeginErrorReadLine();

    return process;
}

static string? ResolveProjectPath(string projectName)
{
    var dir = Directory.GetCurrentDirectory();
    while (!string.IsNullOrEmpty(dir))
    {
        if (Directory.Exists(Path.Combine(dir, projectName)))
            return Path.Combine(dir, projectName);
        dir = Directory.GetParent(dir)?.FullName;
    }
    return null;
}

static void FreePort(int port)
{
    var ipProps = IPGlobalProperties.GetIPGlobalProperties();
    var listeners = ipProps.GetActiveTcpListeners()
        .Concat(ipProps.GetActiveTcpConnections().Select(c => c.LocalEndPoint))
        .Where(e => e.Port == port)
        .ToList();

    foreach (var ep in listeners)
    {
        var pid = GetProcessIdOnPort(port);
        if (pid.HasValue)
        {
            try
            {
                var proc = Process.GetProcessById(pid.Value);
                Console.WriteLine($"Killing process {proc.ProcessName} (PID {pid.Value}) on port {port}...");
                proc.Kill(entireProcessTree: true);
                proc.WaitForExit(3000);
            }
            catch { }
        }
    }
}

static int? GetProcessIdOnPort(int port)
{
    try
    {
        var psi = new ProcessStartInfo("netstat", "-ano")
        {
            UseShellExecute = false,
            RedirectStandardOutput = true,
            CreateNoWindow = true
        };
        using var p = Process.Start(psi)!;
        var output = p.StandardOutput.ReadToEnd();
        p.WaitForExit();

        foreach (var line in output.Split('\n'))
        {
            if (line.Contains($"LISTENING") && line.Contains($":{port} "))
            {
                var parts = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length >= 5 && int.TryParse(parts[^1], out var pid))
                    return pid;
            }
        }
    }
    catch { }
    return null;
}

sealed class HostLifetime(Process _uiProcess) : IDisposable
{
    private readonly CancellationTokenSource _cts = new();

    public void Shutdown() => Dispose();

    public async Task WaitForExitAsync()
    {
        try
        {
            await Task.Delay(Timeout.Infinite, _cts.Token);
        }
        catch (OperationCanceledException) { }
    }

    public void Dispose()
    {
        try
        {
            if (!_uiProcess.HasExited)
            {
                _uiProcess.Kill(entireProcessTree: true);
                _uiProcess.WaitForExit(5000);
            }
        }
        catch { }

        _uiProcess.Dispose();
        _cts.Cancel();
        _cts.Dispose();

        Console.WriteLine("Shutdown complete.");
    }
}
