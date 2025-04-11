"use client"

import { useEffect, useState, useRef } from "react"
import { Building, Users, Calendar, ThumbsUp, type LucideIcon } from "lucide-react"

interface StatsCounterProps {
  value: number
  label: string
  icon: string
  suffix?: string
}

export function StatsCounter({ value, label, icon, suffix = "" }: StatsCounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  // Map string icon names to Lucide components
  const iconMap: Record<string, LucideIcon> = {
    Building,
    Users,
    Calendar,
    ThumbsUp,
  }

  const IconComponent = iconMap[icon] || Building

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateValue(0, value, 2000)
        }
      },
      { threshold: 0.1 },
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current)
      }
    }
  }, [value])

  const animateValue = (start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const currentCount = Math.floor(progress * (end - start) + start)
      setCount(currentCount)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-indigo-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-indigo-800/30 dark:bg-slate-900">
      <div className="rounded-full bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
        <IconComponent className="h-6 w-6" />
      </div>
      <div ref={countRef} className="text-3xl font-bold">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  )
}
