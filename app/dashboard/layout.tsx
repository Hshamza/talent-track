"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import { useAuth } from "@/lib/auth-context"
import { initializeStorage } from "@/lib/storage"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Initialize storage
    initializeStorage()

    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Show nothing while checking authentication
  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <div className="main-bg flex-1 p-8 px-20">{children}</div>
    </div>
  )
}
