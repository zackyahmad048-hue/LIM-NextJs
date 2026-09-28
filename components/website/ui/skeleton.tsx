import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        {
          "rounded-full": variant === "circular",
          "rounded-lg": variant === "rectangular",
        },
        className,
      )}
      style={{
        width,
        height,
        ...(props.style as React.CSSProperties),
      }}
      {...props}
    />
  );
}

export function TextSkeleton({
  lines = 3,
  className,
  width = "100%",
  ...props
}: {
  lines?: number;
  className?: string;
  width?: string | number;
} & Omit<SkeletonProps, "variant" | "height">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "60%" : width}
          height="1rem"
        />
      ))}
    </div>
  );
}

export function CardSkeleton({
  className,
  hasImage = true,
  hasFooter = true,
  ...props
}: {
  className?: string;
  hasImage?: boolean;
  hasFooter?: boolean;
} & Omit<SkeletonProps, "variant">) {
  return (
    <div className={cn("space-y-4 p-5", className)} {...props}>
      {hasImage && (
        <Skeleton variant="rectangular" width="100%" height="200px" />
      )}
      <TextSkeleton lines={1} width="40%" />
      <TextSkeleton lines={2} width="80%" />
      {hasFooter && (
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width="24px" height="24px" />
          <Skeleton variant="text" width="80px" height="14px" />
        </div>
      )}
    </div>
  );
}

export function PrayerWidgetSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-4 sm:p-5", className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="80px" height="14px" />
        <Skeleton variant="text" width="40px" height="12px" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width="16px" height="16px" />
        <Skeleton variant="text" width="120px" height="14px" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width="16px" height="16px" />
        <Skeleton variant="text" width="100px" height="20px" className="font-mono" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width="16px" height="16px" />
        <Skeleton variant="text" width="140px" height="12px" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width="16px" height="16px" />
        <Skeleton variant="text" width="160px" height="12px" />
      </div>
      <div className="pt-2 space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton variant="text" width="60px" height="14px" />
            <Skeleton variant="text" width="50px" height="14px" className="font-mono" />
          </div>
        ))}
      </div>
      <div className="pt-2 border-t">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="100px" height="12px" />
          <Skeleton variant="text" width="80px" height="12px" className="font-mono" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({
  columns = 4,
  rows = 5,
  className,
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-md border border-border bg-card", className)}>
      <div className="border-b border-border px-4 py-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" width="80%" height="14px" />
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border/40 last:border-0">
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3">
                    <Skeleton variant="text" width="100%" height="14px" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ListSkeleton({
  items = 5,
  className,
  hasAvatar = true,
  hasMeta = true,
}: {
  items?: number;
  className?: string;
  hasAvatar?: boolean;
  hasMeta?: boolean;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {hasAvatar && (
            <Skeleton variant="circular" width="40px" height="40px" />
          )}
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" width="60%" height="16px" />
            {hasMeta && <Skeleton variant="text" width="40%" height="12px" />}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionSkeleton({ className }: { className?: string }) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16", className)}>
      <div className="mx-auto max-w-5xl">
        <Skeleton variant="text" width="40%" height="32px" className="mb-2" />
        <Skeleton variant="text" width="60%" height="16px" />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </section>
  );
}