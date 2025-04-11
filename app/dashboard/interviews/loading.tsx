import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 overflow-hidden border-none bg-white shadow-md dark:bg-slate-900">
          <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-emerald-500/40 to-teal-600/40"></div>
          <CardHeader>
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-48 mt-2" />
            <Skeleton className="h-4 w-32 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="h-[1px] w-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <Skeleton className="h-[1px] w-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 overflow-hidden border-none bg-white shadow-md dark:bg-slate-900">
          <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-indigo-500/40 to-purple-600/40"></div>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full rounded-md" />
            <div className="flex justify-end mt-4">
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
