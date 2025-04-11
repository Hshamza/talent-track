"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RolesList } from "@/components/roles-list"
import { RecentCandidates } from "@/components/recent-candidates"
import { UpcomingInterviews } from "@/components/upcoming-interviews"
import { getDashboard, updateDashboardStats } from "@/lib/storage"
import type { Dashboard } from "@/lib/types"
import { Activity, Users, Briefcase, Calendar, Clock, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Update dashboard stats
    updateDashboardStats()

    // Get dashboard data
    const dashboardData = getDashboard()
    setDashboard(dashboardData)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (!dashboard) {
    return <div>Error loading dashboard data</div>
  }

  // Calculate percentage changes (mock data for demonstration)
  const roleChange = 12.5
  const candidateChange = 8.3
  const interviewChange = 15.2
  const timeToHireChange = -5.7

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your talent acquisition dashboard. Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-indigo-500/10 to-purple-500/10 shadow-md transition-all hover:shadow-lg dark:from-indigo-500/20 dark:to-purple-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Open Roles</CardTitle>
              <div className="rounded-full bg-indigo-100 p-2 text-indigo-500 dark:bg-indigo-500/20">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.activeRoles}</div>
            <div className="mt-1 flex items-center text-xs">
              <div className={cn("mr-1 flex items-center", roleChange > 0 ? "text-emerald-500" : "text-rose-500")}>
                {roleChange > 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {Math.abs(roleChange)}%
              </div>
              <p className="text-muted-foreground">from last month</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Out of {dashboard.totalRoles} total roles</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-md transition-all hover:shadow-lg dark:from-blue-500/20 dark:to-cyan-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
              <div className="rounded-full bg-blue-100 p-2 text-blue-500 dark:bg-blue-500/20">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.activeCandidates}</div>
            <div className="mt-1 flex items-center text-xs">
              <div className={cn("mr-1 flex items-center", candidateChange > 0 ? "text-emerald-500" : "text-rose-500")}>
                {candidateChange > 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {Math.abs(candidateChange)}%
              </div>
              <p className="text-muted-foreground">from last month</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Out of {dashboard.totalCandidates} total candidates</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-md transition-all hover:shadow-lg dark:from-emerald-500/20 dark:to-teal-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Interviews This Week</CardTitle>
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-500 dark:bg-emerald-500/20">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.interviewsThisWeek}</div>
            <div className="mt-1 flex items-center text-xs">
              <div className={cn("mr-1 flex items-center", interviewChange > 0 ? "text-emerald-500" : "text-rose-500")}>
                {interviewChange > 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {Math.abs(interviewChange)}%
              </div>
              <p className="text-muted-foreground">from last week</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Scheduled for the next 7 days</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-500/10 to-orange-500/10 shadow-md transition-all hover:shadow-lg dark:from-amber-500/20 dark:to-orange-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Time to Hire (Avg)</CardTitle>
              <div className="rounded-full bg-amber-100 p-2 text-amber-500 dark:bg-amber-500/20">
                <Clock className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.timeToHire} days</div>
            <div className="mt-1 flex items-center text-xs">
              <div
                className={cn("mr-1 flex items-center", timeToHireChange < 0 ? "text-emerald-500" : "text-rose-500")}
              >
                {timeToHireChange < 0 ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                {Math.abs(timeToHireChange)}%
              </div>
              <p className="text-muted-foreground">from last month</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">From application to offer</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card className="border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboard.recentActivity.slice(0, 4).map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative mt-1">
                  <div className="flex h-2 w-2 items-center justify-center">
                    <div
                      className={cn(
                        "absolute h-2 w-2 rounded-full",
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                            ? "bg-emerald-500"
                            : index === 2
                              ? "bg-amber-500"
                              : "bg-purple-500",
                      )}
                    />
                  </div>
                  {index < dashboard.recentActivity.length - 1 && <div className="ml-1 h-full w-px bg-border" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <TabsTrigger
            value="roles"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Open Roles
          </TabsTrigger>
          <TabsTrigger
            value="candidates"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
          >
            <Users className="mr-2 h-4 w-4" />
            Recent Candidates
          </TabsTrigger>
          <TabsTrigger
            value="interviews"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Interviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="roles" className="space-y-4">
          <RolesList />
        </TabsContent>
        <TabsContent value="candidates" className="space-y-4">
          <RecentCandidates />
        </TabsContent>
        <TabsContent value="interviews" className="space-y-4">
          <UpcomingInterviews />
        </TabsContent>
      </Tabs>
    </div>
  )
}
