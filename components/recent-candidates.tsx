"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCandidates } from "@/lib/storage"
import type { Candidate } from "@/lib/types"
import { ArrowUpRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export function RecentCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    // Get candidates data
    const candidatesData = getCandidates()
    // Sort by applied date (newest first) and limit to 3
    const recentCandidates = candidatesData
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
      .slice(0, 3)
    setCandidates(recentCandidates)
  }, [])

  // Function to get stage badge class
  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case "applied":
        return "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
      case "screening":
        return "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300"
      case "interview":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
      case "offer":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
      case "hired":
        return "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300"
      case "rejected":
        return "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300"
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {candidates.length === 0 ? (
        <Card className="md:col-span-3 border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-900 dark:to-slate-800">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No candidates found.{" "}
              <Link href="/dashboard/candidates/new" className="text-primary hover:underline">
                Add a new candidate
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className="group overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px] dark:from-slate-900 dark:to-slate-800"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    getStageBadgeClass(candidate.stage),
                  )}
                >
                  {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                </span>
              </div>
              <CardTitle className="mt-2 text-lg font-semibold">{candidate.name}</CardTitle>
              <CardDescription className="mt-1">{candidate.roleName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Applied: {formatDate(candidate.appliedDate)}</span>
              </div>
              <div className="mt-4">
                <Link href={`/dashboard/candidates/${candidate.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Profile
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
