using HardwareTracker.Api.Services;

namespace HardwareTracker.Api;

public static class Startup
{
    public static WebApplication CreateApp(string[]? args = null)
    {
        var builder = WebApplication.CreateBuilder(args ?? []);

        builder.Services.AddSingleton<IHardwareService, HardwareService>();
        builder.Services.AddSingleton<IStorageAnalysisService, StorageAnalysisService>();

        var corsOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>();
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                if (corsOrigins is { Length: > 0 })
                {
                    policy.WithOrigins(corsOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                }
                else
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                }
            });
        });

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseCors();
        app.UseAuthorization();
        app.MapControllers();

        return app;
    }
}
