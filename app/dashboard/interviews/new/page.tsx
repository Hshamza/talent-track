"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCandidates, getUsers, getRoles } from "@/lib/storage"
import type { Candidate, User, Role } from "@/lib/types"
import { InterviewForm } from "@/components/interview-form"

export default function ScheduleInterviewPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [interviewers, setInterviewers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get candidates data for the dropdown
    const candidatesData = getCandidates()
    setCandidates(candidatesData)

    // Get users data for interviewers dropdown
    const usersData = getUsers()
    setInterviewers(usersData)

    // Get roles data
    const rolesData = getRoles()
    setRoles(rolesData)

    setIsLoading(false)
  }, [])

  if (isLoading) {
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
            Schedule New Interview
          </span>
        </h1>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-md dark:bg-slate-900">
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <CardHeader className="pb-2">
          <CardTitle>Interview Details</CardTitle>
          <CardDescription>
            Schedule a new interview by filling out the form below. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterviewForm candidates={candidates} interviewers={interviewers} roles={roles} />
        </CardContent>
      </Card>
    </div>
  )
}
