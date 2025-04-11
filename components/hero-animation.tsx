"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Image from "next/image"

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating animation for elements
    const elements = container.querySelectorAll(".floating-element")
    elements.forEach((el, index) => {
      const htmlEl = el as HTMLElement
      // Set different animation delays for each element
      htmlEl.style.animationDelay = `${index * 0.5}s`
    })

    // Optional: Add mouse movement parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (window.innerWidth / 2 - clientX) / 25
      const y = (window.innerHeight / 2 - clientY) / 25

      elements.forEach((el, index) => {
        const htmlEl = el as HTMLElement
        const factor = (index + 1) * 0.2
        htmlEl.style.transform = `translate(${x * factor}px, ${y * factor}px) translateY(var(--float-y, 0))`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-[400px] w-[400px] mx-auto">
      {/* Main circular background */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 opacity-70 animate-pulse"
        style={{ animationDuration: "4s" }}
      ></div>

      {/* Central element */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center overflow-hidden border border-indigo-100 dark:border-indigo-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20"></div>
        <Image
          src="/placeholder.svg?height=100&width=100"
          alt="Talent Acquisition"
          width={100}
          height={100}
          className="relative z-10"
        />
      </div>

      {/* Floating elements */}
      <div className="floating-element absolute top-5 left-10 w-16 h-16 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center animate-float border border-indigo-100 dark:border-indigo-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-lg"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>

      <div
        className="floating-element absolute top-20 right-10 w-20 h-20 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center animate-float border border-indigo-100 dark:border-indigo-800"
        style={{ "--float-y": "-10px" } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-lg"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
          <line x1="16" x2="16" y1="2" y2="6"></line>
          <line x1="8" x2="8" y1="2" y2="6"></line>
          <line x1="3" x2="21" y1="10" y2="10"></line>
        </svg>
      </div>

      <div
        className="floating-element absolute bottom-20 left-5 w-18 h-18 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center animate-float border border-indigo-100 dark:border-indigo-800"
        style={{ "--float-y": "10px" } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 rounded-lg"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </div>

      <div
        className="floating-element absolute bottom-10 right-20 w-14 h-14 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center animate-float border border-indigo-100 dark:border-indigo-800"
        style={{ "--float-y": "5px" } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-lg"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-500"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" x2="8" y1="13" y2="13"></line>
          <line x1="16" x2="8" y1="17" y2="17"></line>
          <line x1="10" x2="8" y1="9" y2="9"></line>
        </svg>
      </div>

      {/* Connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full z-0 opacity-30"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M200,200 L90,80" stroke="url(#gradient1)" strokeWidth="2" fill="none" />
        <path d="M200,200 L310,90" stroke="url(#gradient2)" strokeWidth="2" fill="none" />
        <path d="M200,200 L80,280" stroke="url(#gradient3)" strokeWidth="2" fill="none" />
        <path d="M200,200 L290,270" stroke="url(#gradient4)" strokeWidth="2" fill="none" />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Animated rings */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-indigo-200 dark:border-indigo-800 opacity-60 animate-ping"
        style={{ animationDuration: "3s" }}
      ></div>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-purple-200 dark:border-purple-800 opacity-40 animate-ping"
        style={{ animationDuration: "4s" }}
      ></div>
    </div>
  )
}
