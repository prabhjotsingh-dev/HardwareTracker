using System.Diagnostics;

var apiArgs = new[] { "--urls", "http://localhost:5181;https://localhost:7236" };
var uiArgs = new[] { "--urls", "http://localhost:5113" };

using var apiApp = HardwareTracker.Api.Startup.CreateApp(apiArgs);

BuildUI();
using var uiApp = CreateUiApp(uiArgs);

await Task.WhenAll(apiApp.RunAsync(), uiApp.RunAsync());

static void BuildUI()
{
    var uiDir = ResolveProjectPath("HardwareTracker.UI");
    if (uiDir is null)
    {
        Console.WriteLine("UI project not found. Skipping UI build.");
        return;
    }

    var dist = Path.Combine(uiDir, "dist", "index.html");
    if (File.Exists(dist))
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

static WebApplication CreateUiApp(string[] args)
{
    var uiDir = ResolveProjectPath("HardwareTracker.UI");
    if (uiDir is null)
    {
        Console.WriteLine("UI project not found. Cannot serve UI.");
        Environment.Exit(1);
    }

    var webRoot = Path.Combine(uiDir, "dist");
    Directory.CreateDirectory(webRoot);

    var builder = WebApplication.CreateBuilder(new WebApplicationOptions
    {
        Args = args,
        WebRootPath = webRoot
    });

    var app = builder.Build();
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.MapFallbackToFile("index.html");

    return app;
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
