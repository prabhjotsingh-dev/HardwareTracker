import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function PrivacyLoading() {
  return (
    <div>
      <div className="mt-10 mb-10">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <Card>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  )
}
