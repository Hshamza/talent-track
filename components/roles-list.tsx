"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRoles } from "@/lib/storage"
import type { Role } from "@/lib/types"
import { ArrowUpRight, Briefcase, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export function RolesList() {
  const [roles, setRoles] = useState<Role[]>([])

  const loadRoles = useCallback(() => {
    // Get roles data
    const rolesData = getRoles()
    // Filter to only active roles and limit to 3
    const activeRoles = rolesData
      .filter((role) => role.status === "active")
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      .slice(0, 3)
    setRoles(activeRoles)
  }, [])

  useEffect(() => {
    // Load roles data initially
    loadRoles()

    // Set up an interval to refresh data every 5 seconds
    const intervalId = setInterval(loadRoles, 5000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [loadRoles])

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
      case "paused":
        return "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
      case "filled":
        return "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300"
    }
  }

  // Function to get department icon color
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "engineering":
        return "text-blue-500 bg-blue-100 dark:bg-blue-500/20"
      case "design":
        return "text-purple-500 bg-purple-100 dark:bg-purple-500/20"
      case "marketing":
        return "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20"
      case "sales":
        return "text-amber-500 bg-amber-100 dark:bg-amber-500/20"
      default:
        return "text-slate-500 bg-slate-100 dark:bg-slate-500/20"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.length === 0 ? (
        <Card className="md:col-span-3 border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-900 dark:to-slate-800">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No active roles found.{" "}
              <Link href="/dashboard/roles/new" className="text-primary hover:underline">
                Create a new role
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        roles.map((role) => (
          <Card
            key={role.id}
            className="group overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px] dark:from-slate-900 dark:to-slate-800"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={cn("rounded-full p-2", getDepartmentColor(role.department))}>
                  <Briefcase className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    getStatusBadgeClass(role.status),
                  )}
                >
                  {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                </span>
              </div>
              <CardTitle className="mt-2 text-lg font-semibold">{role.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{role.location}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground capitalize">{role.department}</div>
                <Link href={`/dashboard/roles/${role.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Details
                    <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
