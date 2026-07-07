import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StorageLoading() {
  return (
    <div>
      <div className="mt-10 mb-10 flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      <Card>
        <CardContent>
          <div className="card-icon-title mb-5 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-56" />
          </div>

          {[1, 2].map((drive) => (
            <div key={drive}>
              <div className="mb-4 rounded-xl bg-muted/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>

                <Skeleton className="mb-3 h-6 w-full rounded-lg" />

                {[1, 2, 3, 4].map((cat) => (
                  <div key={cat} className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm">
                    <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-sm" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}

                <Skeleton className="mt-2 h-3 w-48" />
              </div>
              {drive < 2 && <hr className="my-4 border-border" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
