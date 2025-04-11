"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, MapPin, Search } from "lucide-react"
import { getRoles } from "@/lib/storage"
import type { Role } from "@/lib/types"

export default function CareersPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationTypeFilter, setLocationTypeFilter] = useState("all")

  useEffect(() => {
    // Get roles data
    const rolesData = getRoles()
    // Filter to only active roles
    const activeRoles = rolesData.filter((role) => role.status === "active")
    setRoles(activeRoles)
    setFilteredRoles(activeRoles)
  }, [])

  useEffect(() => {
    // Filter roles based on search query and filters
    let filtered = roles

    if (searchQuery) {
      filtered = filtered.filter(
        (role) =>
          role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (role.keySkills && role.keySkills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((role) => role.department === departmentFilter)
    }

    if (locationTypeFilter !== "all") {
      filtered = filtered.filter((role) => role.locationType === locationTypeFilter)
    }

    setFilteredRoles(filtered)
  }, [roles, searchQuery, departmentFilter, locationTypeFilter])

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

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover exciting career opportunities and be part of our growing team.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs by title, skills, or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="product">Product</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationTypeFilter} onValueChange={setLocationTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRoles.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No open positions found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any open positions matching your criteria. Try adjusting your search filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {role.employmentType.replace("-", " ")}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{role.title}</CardTitle>
                <CardDescription className="capitalize">{role.department}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>
                    {role.location} ({role.locationType})
                  </span>
                </div>
                <p className="line-clamp-3 text-sm">{role.description}</p>
                {role.keySkills && role.keySkills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {role.keySkills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {role.keySkills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.keySkills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-xs text-muted-foreground">
                  {role.applicationDeadline
                    ? `Apply by: ${formatDate(role.applicationDeadline)}`
                    : "No application deadline"}
                </div>
                <Link href={`/careers/${role.id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
