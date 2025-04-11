"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, ArrowUpRight, User } from "lucide-react"
import { getInterviews } from "@/lib/storage"
import type { Interview } from "@/lib/types"

export function UpcomingInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([])

  useEffect(() => {
    // Get interviews data
    const interviewsData = getInterviews()

    // Get current date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Filter to upcoming interviews (scheduled and not in the past)
    const upcomingInterviews = interviewsData
      .filter((interview) => {
        const interviewDate = new Date(interview.date)
        interviewDate.setHours(0, 0, 0, 0)
        return interview.status === "scheduled" && interviewDate >= today
      })
      .sort((a, b) => {
        // Sort by date, then by time
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime()
        }
        return a.time.localeCompare(b.time)
      })
      .slice(0, 3)

    setInterviews(upcomingInterviews)
  }, [])

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Function to determine if interview is today
  const isToday = (dateString: string) => {
    const today = new Date()
    const interviewDate = new Date(dateString)
    return (
      today.getDate() === interviewDate.getDate() &&
      today.getMonth() === interviewDate.getMonth() &&
      today.getFullYear() === interviewDate.getFullYear()
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {interviews.length === 0 ? (
        <Card className="md:col-span-3 border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-900 dark:to-slate-800">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No upcoming interviews found.{" "}
              <Link href="/dashboard/interviews/schedule" className="text-primary hover:underline">
                Schedule an interview
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        interviews.map((interview) => (
          <Card
            key={interview.id}
            className="group overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px] dark:from-slate-900 dark:to-slate-800"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                    {interview.candidateName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isToday(interview.date) && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                    Today
                  </span>
                )}
              </div>
              <CardTitle className="mt-2 text-lg font-semibold">{interview.candidateName}</CardTitle>
              <CardDescription className="mt-1">
                {interview.type} • {interview.roleName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formatDate(interview.date)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>
                    {formatTime(interview.time)} • {interview.duration} min
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-1 h-4 w-4" />
                  <span>{interview.interviewerName}</span>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/dashboard/interviews/${interview.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Details
                    <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </Link>
                <Link href="/dashboard/interviews/new">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    Schedule Interview
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
