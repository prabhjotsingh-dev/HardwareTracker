import Link from "next/link";
import type { DriveInfoDto } from "../types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "./ProgressBar";

interface DriveCardProps {
  drive: DriveInfoDto;
}

export default function DriveCard({ drive }: DriveCardProps) {
  return (
    <Link href={`/storage?drive=${encodeURIComponent(drive.name)}`} className="block">
      <Card size="sm" className="cursor-pointer transition-all hover:ring-2 hover:ring-cyan-400/50">
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono-jet rounded-md border border-white/15 bg-dark/50 px-2 py-0.5 text-sm text-cyan-400">
                {drive.name}
              </span>
              <span className="font-medium text-foreground">{drive.label}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {drive.driveType}
            </Badge>
          </div>
          <div className="mt-3 flex justify-between text-sm text-muted-foreground">
            <span>Used: {drive.usedSpaceGb} GB</span>
            <span>Total: {drive.totalSizeGb} GB</span>
          </div>
          <ProgressBar
            value={drive.usagePercentage}
            warningThreshold={85}
            criticalThreshold={90}
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Free: {drive.freeSpaceGb} GB</span>
            <span className="font-mono-jet text-foreground">
              {drive.usagePercentage}%
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
