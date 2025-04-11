"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Trash, User, Video } from "lucide-react"
import { getInterview, getCandidate, getRole, updateInterview, deleteInterview } from "@/lib/storage"
import type { Interview, Candidate, Role } from "@/lib/types"
import { InterviewAssistant } from "@/components/interview-assistant"

export default function InterviewDetailsPage({ params }: { params: { id: string } }) {
  const [interview, setInterview] = useState<Interview | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get interview data
    const interviewData = getInterview(params.id)
    if (!interviewData) {
      toast({
        title: "Interview not found",
        description: "The interview you're looking for doesn't exist or has been removed.",
        variant: "destructive",
      })
      router.push("/dashboard/interviews")
      return
    }

    setInterview(interviewData)
    setFeedback(interviewData.feedback || "")

    // Get candidate data
    const candidateData = getCandidate(interviewData.candidateId)
    setCandidate(candidateData)

    // Get role data
    const roleData = getRole(interviewData.roleId)
    setRole(roleData)

    setIsLoading(false)
  }, [params.id, router])

  const handleStatusChange = (newStatus: "scheduled" | "completed" | "cancelled" | "rescheduled") => {
    if (!interview) return

    try {
      const updatedInterview = updateInterview(interview.id, { status: newStatus })
      if (updatedInterview) {
        setInterview(updatedInterview)
        toast({
          title: "Status updated",
          description: `Interview status has been updated to ${newStatus}.`,
        })
      }
    } catch (error) {
      console.error("Error updating interview status:", error)
      toast({
        title: "Update failed",
        description: "Failed to update interview status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitFeedback = () => {
    if (!interview) return
    setIsSubmittingFeedback(true)

    try {
      const updatedInterview = updateInterview(interview.id, {
        feedback,
        status: "completed",
      })

      if (updatedInterview) {
        setInterview(updatedInterview)
        toast({
          title: "Feedback submitted",
          description: "Your feedback has been saved successfully.",
        })
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Submission failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const handleDeleteInterview = () => {
    if (!interview) return

    try {
      const deleted = deleteInterview(interview.id)
      if (deleted) {
        toast({
          title: "Interview deleted",
          description: "The interview has been permanently deleted.",
        })
        router.push("/dashboard/interviews")
      }
    } catch (error) {
      console.error("Error deleting interview:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete interview. Please try again.",
        variant: "destructive",
      })
    }
  }

  type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

  function getStatusBadgeVariant(status: string): BadgeVariant {
    switch (status) {
      case "completed":
      case "scheduled":
        return "default"
      case "canceled":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
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

  // Function to determine if interview is in the past
  const isPast = (dateString: string, timeString: string) => {
    const now = new Date()
    const interviewDate = new Date(dateString)
    const [hours, minutes] = timeString.split(":")
    interviewDate.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10))
    return now > interviewDate
  }

  if (isLoading || !interview) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative h-20 w-20">
          <div className="absolute h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></div>
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-indigo-500">
            <svg
              className="h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/interviews">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Interview Details
          </span>
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 overflow-hidden border-none bg-white shadow-md dark:bg-slate-900">
          <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <Badge variant={getStatusBadgeVariant(interview.status)} className="mb-2">
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </Badge>
              {isToday(interview.date) && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/30"
                >
                  Today
                </Badge>
              )}
            </div>
            <CardTitle>{interview.type}</CardTitle>
            <CardDescription>{interview.roleName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                <span>{formatDate(interview.date)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-emerald-500" />
                <span>
                  {formatTime(interview.time)} • {interview.duration} minutes
                </span>
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Interviewer: {interview.interviewerName}</span>
              </div>
              {interview.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>{interview.location}</span>
                </div>
              )}
              {!interview.location && (
                <div className="flex items-center text-sm">
                  <Video className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Virtual Interview</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Candidate</h3>
              {candidate ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={candidate.name} />
                    <AvatarFallback>
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/dashboard/candidates/${candidate.id}`} className="hover:underline">
                    {candidate.name}
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Candidate information not available</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/dashboard/interviews/${interview.id}/edit`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("rescheduled")}
                  disabled={interview.status === "rescheduled" || interview.status === "completed"}
                >
                  Reschedule
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("completed")}
                  disabled={interview.status === "completed" || interview.status === "cancelled"}
                >
                  Mark Complete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={interview.status === "cancelled" || interview.status === "completed"}
                >
                  Cancel
                </Button>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" variant="destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Interview
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the interview and remove all associated
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteInterview}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card className="overflow-hidden border-none bg-white shadow-md dark:bg-slate-900">
            <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardHeader>
              <CardTitle>Interview Feedback</CardTitle>
              <CardDescription>
                {interview.status === "completed"
                  ? "Review the feedback for this interview"
                  : "Add feedback after the interview is completed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {interview.status === "completed" && interview.feedback ? (
                <div className="rounded-md bg-muted p-4">
                  <h3 className="mb-2 font-medium">Feedback</h3>
                  <p className="text-sm whitespace-pre-line">{interview.feedback}</p>
                </div>
              ) : isPast(interview.date, interview.time) ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your feedback about this interview..."
                    className="min-h-[200px]"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmittingFeedback || !feedback.trim()}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              ) : (
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-muted-foreground">Feedback can be added after the interview has been completed.</p>
                </div>
              )}

              {interview.status === "cancelled" && (
                <div className="rounded-md bg-destructive/10 p-4 text-center">
                  <p className="text-destructive">This interview has been cancelled.</p>
                </div>
              )}

              {interview.notes && (
                <div className="rounded-md bg-muted p-4 mt-4">
                  <h3 className="mb-2 font-medium">Notes</h3>
                  <p className="text-sm whitespace-pre-line">{interview.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Interview Assistant */}
          <InterviewAssistant
            role={role ?? undefined}
            candidate={candidate ?? undefined}
            interview={interview ?? undefined}
            mode={isPast(interview.date, interview.time) ? "review" : "prepare"}
          />
        </div>
      </div>
    </div>
  )
}
