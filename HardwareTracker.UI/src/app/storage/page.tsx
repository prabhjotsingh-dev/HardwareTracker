"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStorageAnalysis } from "@/hooks/useStorageAnalysis";
import { fetchDrives } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const catColorMap: Record<string, string> = {
  "cat-system": "bg-gray-400",
  "cat-applications": "bg-blue-500",
  "cat-appdata": "bg-cyan-500",
  "cat-documents": "bg-amber-400",
  "cat-music": "bg-emerald-500",
  "cat-videos": "bg-red-500",
  "cat-pictures": "bg-violet-500",
  "cat-downloads": "bg-yellow-400",
  "cat-desktop": "bg-indigo-500",
  "cat-other": "bg-gray-500",
};

export default function StorageAnalysisPage() {
  const searchParams = useSearchParams();
  const driveFilter = searchParams.get("drive");
  const { data, error, loading, refreshing, refetch } = useStorageAnalysis(driveFilter ?? undefined);
  const [drives, setDrives] = useState<string[]>([]);

  useEffect(() => {
    fetchDrives().then(setDrives).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mt-10 mb-10 flex items-center justify-between">
        <div>
          <h1 className="m-0 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
            {driveFilter ? `${driveFilter} Storage Analysis` : "Storage Analysis"}
          </h1>
          <p className="mb-0 text-sm text-gray-400">
            {driveFilter
              ? `Detailed breakdown of what's consuming disk space on ${driveFilter}`
              : "Detailed breakdown of what's consuming disk space by category"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" className="flex items-center gap-2" />}
            >
              {driveFilter || "All Drives"}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href="/storage" />}>
                All Drives
              </DropdownMenuItem>
              {drives.map((d) => (
                <DropdownMenuItem
                  key={d}
                  render={<Link href={`/storage?drive=${d}`} />}
                >
                  {d}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
            {loading ? "Scanning..." : "Refresh Scan"}
          </Button>
        </div>
      </div>

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
              <h5 className="mb-1 font-semibold text-destructive">Error</h5>
              <p className="mb-0 text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent>
            <div className="py-8 text-center">
              <div
                className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"
                role="status"
              />
              <h4 className="text-lg text-foreground">
                Scanning storage drives...
              </h4>
              <p className="mb-0 text-sm text-muted-foreground">
                Analyzing folder sizes and file types. This may take a moment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && data && data.length > 0 && (
        <div className="grid gap-6">
          <Card>
            <CardContent>
              <div className="card-icon-title mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-400">
                  📊
                </div>
                <h3 className="m-0 text-lg font-semibold text-foreground">
                  Storage Breakdown by Category
                </h3>
              </div>

              {data.map((analysis, idx) => (
                <div key={analysis.driveName}>
                  <div className="mb-4 rounded-xl bg-muted/30 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="mb-0 text-base font-semibold text-foreground">
                        <span className="font-mono-jet mr-2 rounded-md border border-border bg-dark/50 px-2 py-0.5 text-sm text-cyan-400">
                          {analysis.driveName}
                        </span>
                        {analysis.totalUsed} ({analysis.usedPercentage}%) Used &middot;{" "}
                        {analysis.freeSpace} ({analysis.freePercentage}%) Free (of{" "}
                        {analysis.totalSize})
                        {refreshing && <Spinner className="ml-2 text-cyan-400" />}
                      </h4>
                      <span className="font-mono-jet text-xs text-muted-foreground">
                        {analysis.categories.length} categories
                      </span>
                    </div>

                    {analysis.categories.length > 0 && (
                      <>
                        <div className="mb-3 flex h-6 overflow-hidden rounded-lg bg-muted">
                          {[...analysis.categories,{categoryName: "Free", colorClass: "bg-white-500", totalSize: analysis.freeSpace, percentageOfUsed: analysis.freePercentage }].map((cat) => (
                            <div
                              key={cat.categoryName}
                              className={`min-w-[2px] transition-all duration-500 ${catColorMap[cat.colorClass] || "bg-gray-500"}`}
                              style={{ width: `${cat.percentageOfUsed}%` }}
                              title={`${cat.categoryName}: ${cat.totalSize} (${cat.percentageOfUsed}%)`}
                            />
                          ))}
                        </div>

                        <div className="flex flex-col gap-1">
                          {analysis.categories.map((cat) => (
                            <div
                              key={cat.categoryName}
                              className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                            >
                              <span
                                className={`h-2.5 w-2.5 shrink-0 rounded-sm ${catColorMap[cat.colorClass] || "bg-gray-500"}`}
                              />
                              <span className="flex-1 font-medium text-foreground">
                                {cat.categoryName}
                              </span>
                              <span className="font-mono-jet min-w-[70px] text-right font-semibold text-foreground">
                                {cat.totalSize}
                              </span>
                              <span className="font-mono-jet min-w-[50px] text-right text-muted-foreground">
                                {cat.percentageOfUsed}%
                              </span>
                              <span className="font-mono-jet min-w-[100px] text-right text-xs text-muted-foreground">
                                {cat.fileCount.toLocaleString()} files
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground">
                          Last scanned:{" "}
                          {new Date(analysis.lastScanned).toLocaleString()}
                        </div>
                      </>
                    )}

                    {analysis.categories.length === 0 && (
                      <p className="py-2 text-sm text-muted-foreground">
                        No analysis data available for this drive.
                      </p>
                    )}
                  </div>
                  {idx < data.length - 1 && (
                    <hr className="my-4 border-border" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && data && data.length === 0 && !driveFilter && (
        <Card>
          <CardContent>
            <div className="py-8 text-center">
              <p className="mb-0 text-sm text-muted-foreground">
                No storage analysis data available.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && data && data.length === 0 && driveFilter && (
        <Card>
          <CardContent>
            <div className="py-8 text-center">
              <p className="mb-0 text-sm text-muted-foreground">
                No analysis data found for drive {driveFilter}.
              </p>
              <Button
                render={<Link href="/storage" />}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                View All Drives
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
