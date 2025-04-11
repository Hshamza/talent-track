"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowLeft, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCandidate, getRole } from "@/lib/storage"
import type { Candidate, Role } from "@/lib/types"

export default function ApplicationSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isMatch = searchParams.get("match") === "true"
  const candidateId = searchParams.get("id")
  const isNewCandidate = searchParams.get("isNew") === "true"

  useEffect(() => {
    if (!candidateId) {
      router.push("/careers")
      return
    }

    const candidateData = getCandidate(candidateId)
    const roleData = getRole(params.id)

    if (!candidateData || !roleData) {
      router.push("/careers")
      return
    }

    setCandidate(candidateData)
    setRole(roleData)
    setIsLoading(false)
  }, [candidateId, params.id, router])

  if (isLoading || !candidate || !role) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/careers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/careers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Application Submitted</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isMatch ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <Clock className="h-16 w-16 text-amber-500" />
            )}
          </div>
          <CardTitle className="text-2xl">{isNewCandidate ? "Application Received" : "Application Updated"}</CardTitle>
          <CardDescription className="text-lg">
            {isMatch
              ? "Great news! Your profile matches our requirements."
              : "Thank you for your interest. We'll review your application."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Application Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Position</div>
              <div>{role.title}</div>
              <div className="text-muted-foreground">Department</div>
              <div>{role.department}</div>
              <div className="text-muted-foreground">Location</div>
              <div>
                {role.location} ({role.locationType})
              </div>
              <div className="text-muted-foreground">Status</div>
              <div className={isMatch ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                {isMatch ? "Strong Match" : "Under Review"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">What happens next?</h3>
            <p className="text-sm text-muted-foreground">
              {isMatch
                ? "Our hiring team will review your application and reach out to you soon to discuss next steps. You're a strong candidate for this position!"
                : "Our team will carefully review your application. If your qualifications align with our needs, we'll contact you for the next steps in the hiring process."}
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <Button asChild>
              <Link href="/careers">Browse More Opportunities</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
