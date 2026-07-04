var apiArgs = new[] { "--urls", "http://localhost:5181;https://localhost:7161" };
var webArgs = new[] { "--urls", "http://localhost:5113;https://localhost:7236" };

using var apiApp = HardwareTracker.Api.Startup.CreateApp(apiArgs);
using var webApp = HardwareTracker.Web.Startup.CreateApp(webArgs);

await Task.WhenAll(apiApp.RunAsync(), webApp.RunAsync());
