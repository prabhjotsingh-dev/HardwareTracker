"use client";

import Link from "next/link";
import { useSummary } from "@/hooks/useSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import DriveCard from "@/components/DriveCard";

export default function DashboardPage() {
  const { data: summary, error, loading, refetch } = useSummary();

  return (
    <div>
      <div className="mt-10 mb-10 flex items-center justify-between">
        <div>
          <h1 className="m-0 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
            Live System Diagnostics
          </h1>
          <p className="mb-0 text-sm text-gray-400">
            Real-time hardware telemetry and health monitoring
          </p>
        </div>
        <Button onClick={refetch} disabled={loading}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-icon="inline-start"
          >
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {loading ? "Refreshing..." : "Refresh Telemetry"}
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent>
            <div className="py-8 text-center text-muted-foreground">
              Loading system telemetry...
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-destructive/40">
          <CardContent className="flex items-start gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="shrink-0 mt-0.5 text-destructive"
              viewBox="0 0 16 16"
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <div>
              <h5 className="mb-1 font-semibold text-destructive">
                Backend Connection Offline
              </h5>
              <p className="mb-0 text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {summary && (
        <>
          <Card className="mb-6">
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      summary.overallHealth === "Critical"
                        ? "destructive"
                        : summary.overallHealth === "Warning"
                          ? "secondary"
                          : "outline"
                    }
                    className="gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide"
                  >
                    <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-pulse" />
                    {summary.overallHealth} Health
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {summary.statusMessage}
                  </span>
                </div>
                <span className="font-mono-jet text-xs text-muted-foreground">
                  LAST SYNC:{" "}
                  {new Date(summary.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent>
                <div className="card-icon-title mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">
                    🖥️
                  </div>
                  <h3 className="m-0 text-lg font-semibold text-foreground">
                    Host Machine
                  </h3>
                </div>
                <div className="font-mono-jet text-3xl font-bold text-foreground">
                  {summary.machineName}
                </div>
                <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                  Computer Hostname
                </div>
                <hr className="my-4 border-border" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Operating System:</span>
                  <span className="font-mono-jet text-foreground">
                    {summary.osVersion}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="card-icon-title mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">
                    ⚡
                  </div>
                  <h3 className="m-0 text-lg font-semibold text-foreground">
                    Processor (CPU)
                  </h3>
                </div>
                <div className="font-mono-jet text-2xl font-bold text-foreground">
                  {summary.processorName}
                </div>
                <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                  Active CPU Architecture
                </div>
                <hr className="my-4 border-border" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Physical Cores:</span>
                  <span className="font-mono-jet text-foreground">
                    {summary.physicalCores} Cores
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Logical Threads:</span>
                  <span className="font-mono-jet text-foreground">
                    {summary.logicalCores} Threads
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="card-icon-title mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">
                    🧠
                  </div>
                  <h3 className="m-0 text-lg font-semibold text-foreground">
                    Memory Allocation (RAM)
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="font-mono-jet text-3xl font-bold text-foreground">
                    {summary.usedMemoryGb} GB
                  </div>
                  <span className="font-mono-jet text-sm text-muted-foreground">
                    / {summary.totalMemoryGb} GB Total
                  </span>
                </div>
                <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                  System RAM Utilization
                </div>
                <ProgressBar value={summary.memoryUsagePercentage} />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Available: {summary.availableMemoryGb} GB</span>
                  <span className="font-mono-jet text-foreground">
                    {summary.memoryUsagePercentage}% Used
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-6">
            <div>
              <div className="card-icon-title mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">
                  💾
                </div>
                <h3 className="m-0 text-lg font-semibold text-gray-100">
                  Storage Subsystem &amp; Drive Telemetry
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {summary.drives.map((drive) => (
                  <DriveCard key={drive.name} drive={drive} />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 text-center">
            <Button render={<Link href="/storage" />}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-icon="inline-start"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Analyze Storage Usage
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
