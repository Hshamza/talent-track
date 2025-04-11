"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, Search, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getCandidates, getRoles } from "@/lib/storage"
import type { Candidate, Role } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

export default function CandidatesPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const allCandidates = getCandidates()
    const allRoles = getRoles()
    setCandidates(allCandidates)
    setRoles(allRoles)
  }, [])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const filteredCandidates = candidates
    .filter((candidate) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase())

      // Role filter
      const matchesRole = roleFilter === "all" || candidate.roleId === roleFilter

      // Stage filter
      const matchesStage = stageFilter === "all" || candidate.stage === stageFilter

      return matchesSearch && matchesRole && matchesStage
    })
    .sort((a, b) => {
      // Sorting
      let comparison = 0
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "role") {
        comparison = a.roleName.localeCompare(b.roleName)
      } else if (sortBy === "stage") {
        comparison = a.stage.localeCompare(b.stage)
      } else if (sortBy === "date") {
        comparison = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case "applied":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "no_match":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
      case "screening":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80"
      case "interview":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
      case "offer":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "hired":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  const formatStageLabel = (stage: string) => {
    switch (stage) {
      case "no_match":
        return "No Match"
      default:
        return stage.charAt(0).toUpperCase() + stage.slice(1)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <Button onClick={() => router.push("/dashboard/candidates/add-new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search candidates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="no_match">No Match</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                  Name
                  {sortBy === "name" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("role")}>
                  Role
                  {sortBy === "role" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("stage")}>
                  Stage
                  {sortBy === "stage" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("date")}>
                  Applied Date
                  {sortBy === "date" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "asc" ? "rotate-0" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No candidates found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
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
                  </TableCell>
                  <TableCell>{candidate.roleName}</TableCell>
                  <TableCell>
                    <Badge className={getStageBadgeColor(candidate.stage)} variant="outline">
                      {formatStageLabel(candidate.stage)}
                    </Badge>
                    {candidate.matchScore !== undefined && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Match: {Math.round(candidate.matchScore * 100)}%
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/candidates/${candidate.id}`)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/candidates/${candidate.id}/edit`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
