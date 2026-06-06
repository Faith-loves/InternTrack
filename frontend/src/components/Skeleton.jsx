function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-9 w-16" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-5 h-20 w-full" />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-5 h-20 w-full" />
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <Skeleton className="h-6 w-48" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}

export default Skeleton
