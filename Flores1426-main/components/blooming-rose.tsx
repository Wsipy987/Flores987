"use client"

import { useEffect, useRef, useState } from "react"

export function BloomingRose({
  delay = 0,
  size = 280,
}: {
  delay?: number
  size?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [started, setStarted] = useState(false)
  const bloomRef = useRef(0)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size * 0.42

    const drawPetal = (
      angle: number,
      radius: number,
      width: number,
      colorInner: string,
      colorOuter: string,
      bloom: number,
      curvature: number = 0.6
    ) => {
      const scale = Math.min(bloom, 1)
      if (scale <= 0.01) return

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.scale(scale, scale)
      ctx.globalAlpha = Math.min(scale * 1.2, 1)

      // Petal shape with variable curvature
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(
        -width * curvature,
        -radius * 0.35,
        -width * 0.35,
        -radius * 0.85,
        0,
        -radius
      )
      ctx.bezierCurveTo(
        width * 0.35,
        -radius * 0.85,
        width * curvature,
        -radius * 0.35,
        0,
        0
      )

      // Gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, -radius)
      grad.addColorStop(0, colorInner)
      grad.addColorStop(0.4, colorOuter)
      grad.addColorStop(1, colorInner)
      ctx.fillStyle = grad
      ctx.fill()

      // Soft shadow on petal edge
      ctx.shadowColor = "rgba(60, 10, 20, 0.15)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 2

      // Vein line
      ctx.beginPath()
      ctx.moveTo(0, -radius * 0.1)
      ctx.quadraticCurveTo(1.5, -radius * 0.5, 0, -radius * 0.88)
      ctx.strokeStyle = `rgba(100, 15, 25, ${0.18 * scale})`
      ctx.lineWidth = 0.7
      ctx.stroke()

      // Second thin vein
      ctx.beginPath()
      ctx.moveTo(-width * 0.1, -radius * 0.2)
      ctx.quadraticCurveTo(-width * 0.05, -radius * 0.55, 0, -radius * 0.75)
      ctx.strokeStyle = `rgba(100, 15, 25, ${0.08 * scale})`
      ctx.lineWidth = 0.4
      ctx.stroke()

      // Highlight on petal
      ctx.beginPath()
      ctx.moveTo(width * 0.08, -radius * 0.3)
      ctx.quadraticCurveTo(width * 0.12, -radius * 0.55, width * 0.04, -radius * 0.78)
      ctx.strokeStyle = `rgba(255, 200, 210, ${0.15 * scale})`
      ctx.lineWidth = 1.2
      ctx.stroke()

      ctx.restore()
    }

    const drawStem = (bloom: number) => {
      const stemProgress = Math.min(bloom * 2.5, 1)
      const stemLength = stemProgress * (size * 0.35)
      if (stemLength <= 0) return

      ctx.save()
      ctx.globalAlpha = Math.min(bloom * 2.5, 1)

      // Main stem - slight S curve
      ctx.beginPath()
      ctx.moveTo(cx, cy + 8)
      ctx.bezierCurveTo(
        cx - 3,
        cy + stemLength * 0.3,
        cx + 4,
        cy + stemLength * 0.6,
        cx - 1,
        cy + 8 + stemLength
      )
      const stemGrad = ctx.createLinearGradient(cx, cy + 8, cx, cy + 8 + stemLength)
      stemGrad.addColorStop(0, "#3a7a32")
      stemGrad.addColorStop(0.5, "#2d5a27")
      stemGrad.addColorStop(1, "#1f4a1b")
      ctx.strokeStyle = stemGrad
      ctx.lineWidth = 3.5
      ctx.lineCap = "round"
      ctx.stroke()

      // Thin highlight on stem
      ctx.beginPath()
      ctx.moveTo(cx + 1, cy + 12)
      ctx.bezierCurveTo(
        cx - 1,
        cy + stemLength * 0.3,
        cx + 5,
        cy + stemLength * 0.6,
        cx, cy + 8 + stemLength * 0.9
      )
      ctx.strokeStyle = "rgba(100, 180, 90, 0.25)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Leaf 1 (right side)
      if (stemLength > size * 0.12) {
        const leafP = Math.min((stemLength - size * 0.12) / (size * 0.15), 1)
        ctx.save()
        ctx.translate(cx + 2, cy + stemLength * 0.4)
        ctx.rotate(0.35)
        ctx.scale(leafP, leafP)

        // Leaf shape
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(8, -6, 22, -4, 30, 0)
        ctx.bezierCurveTo(22, 4, 8, 6, 0, 0)
        const leafGrad = ctx.createLinearGradient(0, 0, 30, 0)
        leafGrad.addColorStop(0, "#2d6a25")
        leafGrad.addColorStop(0.5, "#3a8a34")
        leafGrad.addColorStop(1, "#2d6a25")
        ctx.fillStyle = leafGrad
        ctx.fill()

        // Leaf vein
        ctx.beginPath()
        ctx.moveTo(2, 0)
        ctx.lineTo(26, 0)
        ctx.strokeStyle = "rgba(30, 70, 25, 0.5)"
        ctx.lineWidth = 0.6
        ctx.stroke()

        // Side veins
        for (let v = 0; v < 3; v++) {
          const vx = 8 + v * 7
          ctx.beginPath()
          ctx.moveTo(vx, 0)
          ctx.lineTo(vx + 4, -2.5)
          ctx.moveTo(vx, 0)
          ctx.lineTo(vx + 4, 2.5)
          ctx.strokeStyle = "rgba(30, 70, 25, 0.3)"
          ctx.lineWidth = 0.4
          ctx.stroke()
        }

        ctx.restore()
      }

      // Leaf 2 (left side)
      if (stemLength > size * 0.2) {
        const leafP = Math.min((stemLength - size * 0.2) / (size * 0.15), 1)
        ctx.save()
        ctx.translate(cx - 3, cy + stemLength * 0.6)
        ctx.rotate(-0.4)
        ctx.scale(leafP * 0.85, leafP * 0.85)

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-7, -5, -20, -3, -26, 0)
        ctx.bezierCurveTo(-20, 3, -7, 5, 0, 0)
        const leafGrad2 = ctx.createLinearGradient(0, 0, -26, 0)
        leafGrad2.addColorStop(0, "#2d6a25")
        leafGrad2.addColorStop(0.5, "#348a2e")
        leafGrad2.addColorStop(1, "#2d6a25")
        ctx.fillStyle = leafGrad2
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(-2, 0)
        ctx.lineTo(-23, 0)
        ctx.strokeStyle = "rgba(30, 70, 25, 0.5)"
        ctx.lineWidth = 0.6
        ctx.stroke()

        ctx.restore()
      }

      // Small thorns
      if (stemLength > size * 0.15) {
        ctx.save()
        ctx.fillStyle = "#2d5a27"
        // Thorn 1
        ctx.beginPath()
        ctx.moveTo(cx + 1.5, cy + stemLength * 0.25)
        ctx.lineTo(cx + 5, cy + stemLength * 0.25 - 3)
        ctx.lineTo(cx + 2, cy + stemLength * 0.25 - 1)
        ctx.fill()
        // Thorn 2
        ctx.beginPath()
        ctx.moveTo(cx - 1.5, cy + stemLength * 0.52)
        ctx.lineTo(cx - 5, cy + stemLength * 0.52 - 3)
        ctx.lineTo(cx - 2, cy + stemLength * 0.52 - 1)
        ctx.fill()
        ctx.restore()
      }

      ctx.restore()
    }

    const drawGlow = (bloom: number) => {
      if (bloom < 0.2) return
      const glowAlpha = Math.min((bloom - 0.2) * 0.2, 0.12)
      const gradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, size * 0.4)
      gradient.addColorStop(0, `rgba(220, 60, 80, ${glowAlpha})`)
      gradient.addColorStop(0.6, `rgba(180, 40, 60, ${glowAlpha * 0.3})`)
      gradient.addColorStop(1, "rgba(180, 40, 60, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
    }

    // Petal layers with richer colors and more variety
    const layers = [
      { petals: 4, radius: 15, width: 11, inner: "#5a0a15", outer: "#7a1525", bloomStart: 0.0, curve: 0.5 },
      { petals: 5, radius: 22, width: 16, inner: "#7a1525", outer: "#8b1a2a", bloomStart: 0.05, curve: 0.55 },
      { petals: 6, radius: 30, width: 20, inner: "#8b1a2a", outer: "#a52040", bloomStart: 0.12, curve: 0.58 },
      { petals: 7, radius: 38, width: 25, inner: "#a52040", outer: "#c0304a", bloomStart: 0.2, curve: 0.6 },
      { petals: 8, radius: 46, width: 30, inner: "#b83050", outer: "#d44060", bloomStart: 0.3, curve: 0.62 },
      { petals: 9, radius: 54, width: 34, inner: "#c84060", outer: "#e05575", bloomStart: 0.42, curve: 0.65 },
      { petals: 10, radius: 60, width: 36, inner: "#d55070", outer: "#e87090", bloomStart: 0.55, curve: 0.68 },
      { petals: 11, radius: 66, width: 38, inner: "#e06080", outer: "#f0a0b5", bloomStart: 0.68, curve: 0.7 },
    ]

    const animate = () => {
      bloomRef.current += 0.012
      const bloom = Math.min(bloomRef.current, 1)

      ctx.clearRect(0, 0, size, size)

      drawGlow(bloom)
      drawStem(bloom)

      for (const layer of layers) {
        const layerBloom = Math.max(
          0,
          (bloom - layer.bloomStart) / (1 - layer.bloomStart)
        )
        const angleStep = (Math.PI * 2) / layer.petals
        for (let i = 0; i < layer.petals; i++) {
          const angle = angleStep * i + layer.bloomStart * 3
          drawPetal(
            angle,
            layer.radius,
            layer.width,
            layer.inner,
            layer.outer,
            layerBloom,
            layer.curve
          )
        }
      }

      // Center of rose with more detail
      if (bloom >= 0.9) {
        const centerAlpha = Math.min((bloom - 0.9) * 10, 1)
        ctx.save()
        ctx.globalAlpha = centerAlpha

        // Spiral center
        const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14)
        centerGrad.addColorStop(0, "#3a0510")
        centerGrad.addColorStop(0.3, "#5a0a15")
        centerGrad.addColorStop(0.6, "#7a1525")
        centerGrad.addColorStop(1, "#8b1a2a")
        ctx.beginPath()
        ctx.arc(cx, cy, 13, 0, Math.PI * 2)
        ctx.fillStyle = centerGrad
        ctx.fill()

        // Tiny spiral lines in center
        ctx.beginPath()
        for (let t = 0; t < Math.PI * 4; t += 0.1) {
          const r = t * 1.2
          const x = cx + Math.cos(t) * r
          const y = cy + Math.sin(t) * r
          if (t === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = "rgba(40, 5, 10, 0.4)"
        ctx.lineWidth = 0.7
        ctx.stroke()

        // Dew drops
        const drawDew = (dx: number, dy: number, dr: number) => {
          const dewGrad = ctx.createRadialGradient(
            dx - dr * 0.3,
            dy - dr * 0.3,
            0,
            dx,
            dy,
            dr
          )
          dewGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)")
          dewGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.2)")
          dewGrad.addColorStop(1, "rgba(255, 255, 255, 0.05)")
          ctx.beginPath()
          ctx.arc(dx, dy, dr, 0, Math.PI * 2)
          ctx.fillStyle = dewGrad
          ctx.fill()
        }

        drawDew(cx + 20, cy - 25, 2.5)
        drawDew(cx - 28, cy - 15, 2)
        drawDew(cx + 12, cy + 18, 1.8)

        ctx.restore()
      }

      if (bloom < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => cancelAnimationFrame(animRef.current)
  }, [started, size])

  return (
    <canvas
      ref={canvasRef}
      className={`transition-opacity duration-1000 ${started ? "opacity-100" : "opacity-0"}`}
      style={{ width: size, height: size }}
      aria-label="Rosa floreciendo"
      role="img"
    />
  )
}
