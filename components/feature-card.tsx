"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Users,
  Calendar,
  FileText,
  BarChart,
  MessageSquare,
  Briefcase,
  Building,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  highlighted?: boolean
}

export function FeatureCard({ icon, title, description, highlighted = false }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Map string icon names to Lucide components
  const iconMap: Record<string, LucideIcon> = {
    Users,
    Calendar,
    FileText,
    BarChart,
    MessageSquare,
    Briefcase,
    Building,
    ThumbsUp,
  }

  const IconComponent = iconMap[icon] || Users

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center rounded-xl border p-6 text-center shadow-sm transition-all duration-300",
        highlighted
          ? "border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60",
        isHovered && "transform -translate-y-1 shadow-md",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "mb-4 rounded-full p-3",
          highlighted ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-slate-100 dark:bg-slate-800",
        )}
      >
        <IconComponent className={cn("h-6 w-6", !highlighted && "text-indigo-500")} />
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>

      {/* Animated border for highlighted cards */}
      {highlighted && (
        <div className="absolute inset-0 -z-10 animate-pulse rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
      )}
    </div>
  )
}
