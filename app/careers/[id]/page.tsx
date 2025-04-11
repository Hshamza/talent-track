"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, Calendar, MapPin } from "lucide-react"
import { getRole } from "@/lib/storage"
import type { Role } from "@/lib/types"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get role data
    const roleData = getRole(params.id)
    if (!roleData || roleData.status !== "active") {
      router.push("/careers")
      return
    }

    setRole(roleData)
    setIsLoading(false)
  }, [params.id, router])

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading || !role) {
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
        <h1 className="text-3xl font-bold">{role.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{role.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line">{role.requirements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line">{role.responsibilities}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription className="capitalize">{role.department}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {role.location} ({role.locationType})
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{role.employmentType.replace("-", " ")}</span>
                </div>
                {role.applicationDeadline && (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Apply by: {formatDate(role.applicationDeadline)}</span>
                  </div>
                )}
              </div>

              <Separator />

              {role.showSalary && role.minSalary && role.maxSalary ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">Salary Range</h3>
                  <p className="text-sm">
                    ${Number.parseInt(role.minSalary).toLocaleString()} - $
                    {Number.parseInt(role.maxSalary).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium mb-2">Salary</h3>
                  <p className="text-sm text-muted-foreground">Salary information not disclosed</p>
                </div>
              )}

              <Separator />

              {role.keySkills && role.keySkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {role.keySkills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apply Now</CardTitle>
              <CardDescription>Submit your application for this position</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/careers/${role.id}/apply`}>
                <Button className="w-full">Apply for this Position</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
