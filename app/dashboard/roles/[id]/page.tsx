"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, MapPin, Pencil } from "lucide-react"
import { getRole, getCandidatesByRole, updateRole, deleteRole } from "@/lib/storage"
import type { Role, Candidate } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
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

export default function RoleDetailsPage({ params }: { params: { id: string } }) {
  const [role, setRole] = useState<Role | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get role data
    const roleData = getRole(params.id)
    if (!roleData) {
      toast({
        title: "Role not found",
        description: "The role you're looking for doesn't exist or has been removed.",
        variant: "destructive",
      })
      router.push("/dashboard/roles")
      return
    }

    setRole(roleData)

    // Get candidates for this role
    const candidatesData = getCandidatesByRole(params.id)
    setCandidates(candidatesData)

    setIsLoading(false)
  }, [params.id, router])

  const handleStatusChange = (newStatus: "active" | "paused" | "filled" | "closed") => {
    if (!role) return

    try {
      const updatedRole = updateRole(role.id, { status: newStatus })
      if (updatedRole) {
        setRole(updatedRole)
        toast({
          title: "Status updated",
          description: `Role status has been updated to ${newStatus}.`,
        })
      }
    } catch (error) {
      console.error("Error updating role status:", error)
      toast({
        title: "Update failed",
        description: "Failed to update role status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = () => {
    if (!role) return

    try {
      const deleted = deleteRole(role.id)
      if (deleted) {
        toast({
          title: "Role deleted",
          description: "The role has been permanently deleted.",
        })
        router.push("/dashboard/roles")
      }
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "filled":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Function to get stage badge class
  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case "applied":
        return "bg-yellow-100 text-yellow-800"
      case "screening":
        return "bg-purple-100 text-purple-800"
      case "interview":
        return "bg-blue-100 text-blue-800"
      case "offer":
        return "bg-green-100 text-green-800"
      case "hired":
        return "bg-gray-100 text-gray-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  if (isLoading || !role) {
    return <div>Loading role details...</div>
  }

  // Calculate candidate pipeline stats
  const pipelineStats = {
    applied: candidates.filter((c) => c.stage === "applied").length,
    screening: candidates.filter((c) => c.stage === "screening").length,
    interview: candidates.filter((c) => c.stage === "interview").length,
    offer: candidates.filter((c) => c.stage === "offer").length,
    hired: candidates.filter((c) => c.stage === "hired").length,
    rejected: candidates.filter((c) => c.stage === "rejected").length,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/roles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Role Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{role.title}</CardTitle>
            <CardDescription className="capitalize">{role.department}</CardDescription>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className={getStatusBadgeClass(role.status)}>
                {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {role.employmentType.replace("-", " ")}
              </Badge>
            </div>
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
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Posted: {formatDate(role.postedDate)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-medium">Salary Range</h3>
              {role.showSalary && role.minSalary && role.maxSalary ? (
                <p className="text-sm">
                  ${Number.parseInt(role.minSalary).toLocaleString()} - $
                  {Number.parseInt(role.maxSalary).toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Salary information not disclosed</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/dashboard/roles/${role.id}/edit`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Pencil className="mr-2 h-3 w-3" />
                    Edit Role
                  </Button>
                </Link>
                <Link href={`/dashboard/roles/duplicate/${role.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Duplicate
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (role.status === "active") {
                      handleStatusChange("paused")
                    } else if (role.status === "paused") {
                      handleStatusChange("active")
                    }
                  }}
                >
                  {role.status === "active" ? "Pause" : role.status === "paused" ? "Activate" : "Change Status"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("filled")}
                  disabled={role.status === "filled"}
                >
                  Mark as Filled
                </Button>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" variant="destructive">
                    Delete Role
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the role and remove all associated
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRole}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{role.description}</p>
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
            </TabsContent>

            <TabsContent value="candidates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold">{pipelineStats.applied}</div>
                      <div className="text-xs text-muted-foreground">Applied</div>
                    </div>
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold">{pipelineStats.screening}</div>
                      <div className="text-xs text-muted-foreground">Screening</div>
                    </div>
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold">{pipelineStats.interview}</div>
                      <div className="text-xs text-muted-foreground">Interview</div>
                    </div>
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold">{pipelineStats.offer}</div>
                      <div className="text-xs text-muted-foreground">Offer</div>
                    </div>
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold">{pipelineStats.hired}</div>
                      <div className="text-xs text-muted-foreground">Hired</div>
                    </div>
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold">{pipelineStats.rejected}</div>
                      <div className="text-xs text-muted-foreground">Rejected</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Candidates ({candidates.length})</CardTitle>
                  <Link href="/dashboard/candidates/new">
                    <Button size="sm">Add Candidate</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {candidates.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No candidates have applied for this role yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center justify-between">
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
                            <div>
                              <Link
                                href={`/dashboard/candidates/${candidate.id}`}
                                className="text-sm font-medium hover:underline"
                              >
                                {candidate.name}
                              </Link>
                              <p className="text-xs text-muted-foreground">
                                Applied: {formatDate(candidate.appliedDate)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStageBadgeClass(candidate.stage)}>
                            {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidates.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No activity for this role yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {candidates.map((candidate) => (
                        <div key={candidate.id} className="flex gap-4">
                          <div className="relative mt-1">
                            <div className="flex h-2 w-2 items-center justify-center">
                              <div className="absolute h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <div className="ml-1 h-full w-px bg-border" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{candidate.name}</span> applied for this position
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(candidate.appliedDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
