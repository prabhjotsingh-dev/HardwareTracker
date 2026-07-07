import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div>
      <div className="mt-10 mb-10 flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-80" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-36 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent>
            <Skeleton className="mb-5 h-10 w-40" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-1 mb-3 h-3 w-28" />
            <hr className="my-4 border-border" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton className="mb-5 h-10 w-40" />
            <Skeleton className="h-7 w-56" />
            <Skeleton className="mt-1 mb-3 h-3 w-28" />
            <hr className="my-4 border-border" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton className="mb-5 h-10 w-40" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="mt-1 mb-3 h-3 w-28" />
            <Skeleton className="h-2.5 w-full rounded-full" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6">
        <div>
          <div className="card-icon-title mb-5 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} size="sm">
                <CardContent>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <div className="mt-3 flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="mt-3 h-2.5 w-full rounded-full" />
                  <div className="mt-1 flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 text-center">
        <Skeleton className="mx-auto h-9 w-44 rounded-xl" />
      </div>
    </div>
  )
}
