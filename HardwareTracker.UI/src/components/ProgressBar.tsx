import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  warningThreshold?: number;
  criticalThreshold?: number;
}

export default function ProgressBar({
  value,
  warningThreshold = 80,
  criticalThreshold = 90,
}: ProgressBarProps) {
  const indicatorClass =
    value > criticalThreshold
      ? "bg-gradient-to-r from-red-500 to-red-700"
      : value > warningThreshold
        ? "bg-gradient-to-r from-amber-400 to-amber-600"
        : "bg-gradient-to-r from-cyan-400 to-blue-500";

  return (
    <ProgressPrimitive.Root value={value} className="mt-3 flex flex-wrap gap-3">
      <ProgressPrimitive.Track className="relative flex h-2.5 w-full items-center overflow-x-hidden rounded-full bg-white/10">
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-700",
            indicatorClass,
          )}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}
