using System.Diagnostics;
using System.Net.NetworkInformation;
using HardwareTracker.Api.Services;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Photino.NET;

namespace HardwareTracker.Host;

internal static class Program
{
    [STAThread]
    public static void Main(string[] args)
    {
        MainAsync(args).GetAwaiter().GetResult();
    }

    private static async Task MainAsync(string[] args)
    {
        var wwwroot = ResolveWwwRootPath();

        if (args.Contains("--dev"))
        {
            var apiArgs = new[] { "--urls", "http://localhost:5181;https://localhost:7236" };
            using var apiApp = HardwareTracker.Api.Startup.CreateApp(apiArgs);
            FreePort(3000);
            using var uiProcess = StartNextJsDev();

            var lifetime = new HostLifetime(uiProcess);
            Console.CancelKeyPress += (_, e) =>
            {
                e.Cancel = true;
                lifetime.Shutdown();
            };
            AppDomain.CurrentDomain.ProcessExit += (_, _) => lifetime.Dispose();

            await Task.WhenAll(apiApp.RunAsync(), lifetime.WaitForExitAsync());
        }
        else
        {
            var builder = WebApplication.CreateBuilder(new WebApplicationOptions
            {
                Args = args,
                WebRootPath = wwwroot
            });

            builder.Services.AddSingleton<IHardwareService, HardwareService>();
            builder.Services.AddSingleton<IStorageAnalysisService, StorageAnalysisService>();
            builder.Services.AddControllers()
                .AddApplicationPart(typeof(HardwareTracker.Api.Startup).Assembly);

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    if (ctx.File.Name.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
                    {
                        ctx.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
                        ctx.Context.Response.Headers.Append("Pragma", "no-cache");
                        ctx.Context.Response.Headers.Append("Expires", "0");
                    }
                }
            });
            app.MapControllers();
            app.MapFallbackToFile("index.html");

            using var shutdownCts = new CancellationTokenSource();
            await app.StartAsync(shutdownCts.Token);

            var serverAddresses = app.Services.GetRequiredService<IServer>().Features.Get<IServerAddressesFeature>()?.Addresses;
            var serverUrl = serverAddresses?.FirstOrDefault() ?? "http://localhost:5000";

            Console.WriteLine($"HardwareTracker running at {serverUrl} — serving from {wwwroot}");

            // Native desktop window via Photino.NET (OS-native WebView2 / WebKit)
            new PhotinoWindow()
                .SetTitle("HardwareTracker")
                .SetUseOsDefaultSize(false)
                .SetSize(1200, 800)
                .Center()
                .Load(serverUrl)
                .WaitForClose();

            // Window closed — shut down the server
            await app.StopAsync();
        }
    }

    private static string ResolveWwwRootPath()
    {
        // 1. Current working directory wwwroot
        var cwdWwwRoot = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"));
        if (Directory.Exists(cwdWwwRoot) && File.Exists(Path.Combine(cwdWwwRoot, "index.html")))
            return cwdWwwRoot;

        // 2. HardwareTracker.Host project wwwroot (for execution from solution root directory)
        var hostDir = ResolveProjectPath("HardwareTracker.Host");
        if (hostDir is not null)
        {
            var hostWwwRoot = Path.GetFullPath(Path.Combine(hostDir, "wwwroot"));
            if (Directory.Exists(hostWwwRoot) && File.Exists(Path.Combine(hostWwwRoot, "index.html")))
                return hostWwwRoot;
        }

        // 3. Base directory wwwroot (for execution from bin folder or published binary)
        var baseWwwRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "wwwroot"));
        if (Directory.Exists(baseWwwRoot) && File.Exists(Path.Combine(baseWwwRoot, "index.html")))
            return baseWwwRoot;

        // 4. Fallback to cwdWwwRoot
        return cwdWwwRoot;
    }

static Process StartNextJsDev()
{
    var uiDir = ResolveProjectPath("HardwareTracker.UI");
    if (uiDir is null)
    {
        Console.WriteLine("UI project not found.");
        Environment.Exit(1);
    }

    Console.WriteLine("Starting Next.js dev server...");
    var psi = new ProcessStartInfo("cmd.exe", $"/c cd /d \"{uiDir}\" && npm run dev")
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
            if (line.Contains("LISTENING") && line.Contains($":{port} "))
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
}

