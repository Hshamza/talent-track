"use client"

import { useEffect, useRef } from "react"

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Wave properties
    const waves = [
      { y: 0.5, length: 0.01, amplitude: 20, speed: 0.01, color: "rgba(99, 102, 241, 0.05)" }, // Indigo
      { y: 0.6, length: 0.02, amplitude: 15, speed: 0.015, color: "rgba(139, 92, 246, 0.05)" }, // Purple
      { y: 0.4, length: 0.015, amplitude: 25, speed: 0.008, color: "rgba(79, 70, 229, 0.05)" }, // Indigo darker
    ]

    let animationFrameId: number
    let time = 0

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw each wave
      waves.forEach((wave) => {
        ctx.fillStyle = wave.color
        ctx.beginPath()

        // Start at the left edge
        ctx.moveTo(0, canvas.height * wave.y)

        // Draw the wave
        for (let x = 0; x < canvas.width; x++) {
          const dx = x / canvas.width
          const dy = Math.sin((dx * Math.PI * 2) / wave.length + time * wave.speed) * wave.amplitude
          ctx.lineTo(x, canvas.height * wave.y + dy)
        }

        // Complete the path
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      })

      time += 0.05
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" aria-hidden="true" />
}
