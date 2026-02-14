"use client"

import { useEffect, useRef } from "react"

interface FloatingHeart {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  wobble: number
  wobbleSpeed: number
  phase: number
}

export function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heartsRef = useRef<FloatingHeart[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const createHeart = (): FloatingHeart => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20 + Math.random() * 100,
      size: 6 + Math.random() * 12,
      opacity: 0.1 + Math.random() * 0.25,
      speed: 0.3 + Math.random() * 0.7,
      wobble: 0,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    })

    for (let i = 0; i < 15; i++) {
      const h = createHeart()
      h.y = Math.random() * canvas.height
      heartsRef.current.push(h)
    }

    const drawHeart = (h: FloatingHeart) => {
      ctx.save()
      ctx.translate(h.x, h.y)
      ctx.globalAlpha = h.opacity
      ctx.scale(h.size / 20, h.size / 20)

      ctx.beginPath()
      ctx.moveTo(0, 5)
      ctx.bezierCurveTo(-10, -5, -20, -10, -20, -20)
      ctx.bezierCurveTo(-20, -30, -10, -35, 0, -25)
      ctx.bezierCurveTo(10, -35, 20, -30, 20, -20)
      ctx.bezierCurveTo(20, -10, 10, -5, 0, 5)
      ctx.fillStyle = `rgba(200, 60, 80, ${h.opacity})`
      ctx.fill()

      ctx.restore()
    }

    let time = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 1

      heartsRef.current.forEach((h) => {
        h.y -= h.speed
        h.x += Math.sin(time * h.wobbleSpeed + h.phase) * 0.5

        if (h.y < -30) {
          h.y = canvas.height + 20
          h.x = Math.random() * canvas.width
        }

        drawHeart(h)
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  )
}
