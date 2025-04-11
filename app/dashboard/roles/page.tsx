"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { getRoles } from "@/lib/storage"
import type { Role } from "@/lib/types"

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadRoles = useCallback(() => {
    // Get roles data
    const rolesData = getRoles()
    setRoles(rolesData)
    setFilteredRoles(rolesData)
  }, [])

  useEffect(() => {
    // Load roles data initially
    loadRoles()

    // Set up an interval to refresh data every 5 seconds
    const intervalId = setInterval(loadRoles, 5000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [loadRoles])

  useEffect(() => {
    // Filter roles based on search query and filters
    let filtered = roles

    if (searchQuery) {
      filtered = filtered.filter(
        (role) =>
          role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((role) => role.department === departmentFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((role) => role.status === statusFilter)
    }

    setFilteredRoles(filtered)
  }, [roles, searchQuery, departmentFilter, statusFilter])

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Open Roles</h1>
        <Link href="/dashboard/roles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Role
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No roles found. Try adjusting your filters or{" "}
                  <Link href="/dashboard/roles/new" className="text-primary hover:underline">
                    create a new role
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/roles/${role.id}`} className="hover:underline">
                      {role.title}
                    </Link>
                  </TableCell>
                  <TableCell className="capitalize">{role.department}</TableCell>
                  <TableCell>{role.location}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(role.status)}`}
                    >
                      {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{role.employmentType.replace("-", " ")}</TableCell>
                  <TableCell>{formatDate(role.postedDate)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/roles/${role.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
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
