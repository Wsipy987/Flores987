"use client"

import { useEffect, useRef } from "react"

interface Petal {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity: number
  color: string
}

export function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const petalsRef = useRef<Petal[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const colors = [
      "rgba(190, 50, 70, OPACITY)",
      "rgba(220, 80, 100, OPACITY)",
      "rgba(240, 120, 140, OPACITY)",
      "rgba(180, 40, 60, OPACITY)",
      "rgba(200, 60, 80, OPACITY)",
    ]

    const createPetal = (): Petal => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      size: 4 + Math.random() * 10,
      speedX: -0.5 + Math.random() * 1,
      speedY: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.02 + Math.random() * 0.04,
      opacity: 0.3 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    })

    for (let i = 0; i < 40; i++) {
      const petal = createPetal()
      petal.y = Math.random() * canvas.height
      petalsRef.current.push(petal)
    }

    const drawPetal = (petal: Petal) => {
      ctx.save()
      ctx.translate(petal.x, petal.y)
      ctx.rotate(petal.rotation)
      ctx.globalAlpha = petal.opacity

      const color = petal.color.replace("OPACITY", petal.opacity.toString())

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(
        petal.size * 0.5,
        -petal.size * 0.8,
        petal.size,
        -petal.size * 0.3,
        petal.size * 0.5,
        petal.size * 0.3
      )
      ctx.bezierCurveTo(
        petal.size * 0.2,
        petal.size * 0.6,
        -petal.size * 0.2,
        petal.size * 0.4,
        0,
        0
      )
      ctx.fillStyle = color
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(
        petal.size * 0.25,
        petal.size * 0.1,
        petal.size * 0.5,
        petal.size * 0.3
      )
      ctx.strokeStyle = color.replace(
        petal.opacity.toString(),
        (petal.opacity * 0.5).toString()
      )
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      petalsRef.current.forEach((petal) => {
        petal.x += petal.speedX + Math.sin(petal.y * 0.01) * 0.3
        petal.y += petal.speedY
        petal.rotation += petal.rotationSpeed

        if (petal.y > canvas.height + 20) {
          petal.y = -20
          petal.x = Math.random() * canvas.width
        }
        if (petal.x > canvas.width + 20) petal.x = -20
        if (petal.x < -20) petal.x = canvas.width + 20

        drawPetal(petal)
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  )
}
