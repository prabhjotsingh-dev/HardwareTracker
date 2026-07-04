# HardwareTracker

A .NET 10 solution for monitoring local hardware health (CPU, memory, disk) via a web dashboard.

## Architecture

Three-project solution with clean separation:

| Project | Description |
|---|---|
| `HardwareTracker.Api` | ASP.NET Core Web API — collects hardware telemetry via `Hardware.Info` |
| `HardwareTracker.Shared` | Shared DTO models (`SystemHealthSummary`, `DriveInfoDto`) |
| `HardwareTracker.Web` | ASP.NET Core Razor Pages frontend — consumes API and displays dashboard |

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)

## Getting Started

1. **Start the API** (Terminal 1):
   ```bash
   cd HardwareTracker.Api
   dotnet run
   ```
   The API runs at `http://localhost:5181` and `https://localhost:7161`.

2. **Start the Web frontend** (Terminal 2):
   ```bash
   cd HardwareTracker.Web
   dotnet run
   ```
   The web app runs at `http://localhost:5113` and `https://localhost:7236`.

3. Open `https://localhost:7236` in your browser to view the hardware dashboard.

## Configuration

### CORS
In `HardwareTracker.Api/appsettings.json`, set `CorsOrigins` to an array of allowed origins:
```json
"CorsOrigins": ["https://localhost:7236"]
```
Leave empty (`[]`) to allow any origin (development default).

### Health Thresholds
In `HardwareTracker.Api/appsettings.json`:
```json
"HealthThresholds": {
  "MemoryCriticalThreshold": 90.0,
  "DriveCriticalThreshold": 90.0,
  "MemoryWarningThreshold": 80.0,
  "DriveWarningThreshold": 85.0
}
```

### API Base URL
In `HardwareTracker.Web/appsettings.json`, the `ApiBaseUrl` setting points to the API endpoint.
