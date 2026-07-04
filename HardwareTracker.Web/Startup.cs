using HardwareTracker.Web.Services;

namespace HardwareTracker.Web;

public static class Startup
{
    public static WebApplication CreateApp(string[]? args = null)
    {
        var builder = WebApplication.CreateBuilder(args ?? []);

        builder.Services.AddRazorPages();

        var apiBaseUrl = builder.Configuration["ApiBaseUrl"] ?? "https://localhost:7161";
        builder.Services.AddHttpClient<IHardwareApiClient, HardwareApiClient>(client =>
        {
            client.BaseAddress = new Uri(apiBaseUrl);
        });

        var app = builder.Build();

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthorization();
        app.MapStaticAssets();
        app.MapRazorPages()
           .WithStaticAssets();

        return app;
    }
}
