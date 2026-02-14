"use client"

import { useEffect, useRef, useState } from "react"

export function BouquetReveal({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [started, setStarted] = useState(false)
  const bloomRef = useRef(0)
  const animRef = useRef<number>(0)
  const sparklesRef = useRef<
    { x: number; y: number; size: number; opacity: number; speed: number; phase: number }[]
  >([])

  useEffect(() => {
    if (visible && !started) setStarted(true)
  }, [visible, started])

  useEffect(() => {
    if (!started) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = 600
    const h = 750
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    // Sparkles
    sparklesRef.current = []
    for (let i = 0; i < 45; i++) {
      sparklesRef.current.push({
        x: 80 + Math.random() * 440,
        y: 30 + Math.random() * 420,
        size: 1 + Math.random() * 3,
        opacity: 0,
        speed: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const drawRose = (
      posX: number,
      posY: number,
      roseSize: number,
      bloom: number,
      shade: number
    ) => {
      if (bloom <= 0) return
      ctx.save()
      ctx.translate(posX, posY)

      // Glow
      if (bloom > 0.3) {
        const ga = Math.min((bloom - 0.3) * 0.15, 0.08)
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, roseSize * 1.4)
        glow.addColorStop(0, `rgba(200, 40, 50, ${ga})`)
        glow.addColorStop(1, "rgba(200, 40, 50, 0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(0, 0, roseSize * 1.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // All reds palette based on shade (0=darkest, 3=lightest)
      const palettes = [
        // shade 0: deep crimson
        { base: [130, 15, 25], mid: [170, 25, 35], light: [200, 45, 55], tip: [220, 70, 80] },
        // shade 1: classic red
        { base: [150, 20, 30], mid: [190, 35, 45], light: [220, 55, 60], tip: [240, 80, 85] },
        // shade 2: warm red
        { base: [160, 25, 25], mid: [200, 40, 40], light: [230, 65, 55], tip: [245, 90, 80] },
        // shade 3: bright red
        { base: [140, 18, 28], mid: [180, 30, 40], light: [210, 50, 55], tip: [235, 75, 75] },
      ]
      const pal = palettes[shade % palettes.length]

      const layers = [
        { petals: 4, r: roseSize * 0.2, w: roseSize * 0.15, start: 0.0 },
        { petals: 5, r: roseSize * 0.3, w: roseSize * 0.2, start: 0.04 },
        { petals: 6, r: roseSize * 0.4, w: roseSize * 0.26, start: 0.1 },
        { petals: 7, r: roseSize * 0.5, w: roseSize * 0.32, start: 0.18 },
        { petals: 8, r: roseSize * 0.6, w: roseSize * 0.36, start: 0.28 },
        { petals: 9, r: roseSize * 0.72, w: roseSize * 0.4, start: 0.4 },
        { petals: 10, r: roseSize * 0.84, w: roseSize * 0.43, start: 0.55 },
        { petals: 11, r: roseSize * 0.96, w: roseSize * 0.45, start: 0.7 },
      ]

      for (let li = 0; li < layers.length; li++) {
        const layer = layers[li]
        const lb = Math.max(0, (bloom - layer.start) / (1 - layer.start))
        const s = Math.min(lb, 1)
        if (s <= 0.01) continue

        const t = li / (layers.length - 1)
        const r = pal.base[0] + (pal.tip[0] - pal.base[0]) * t
        const g = pal.base[1] + (pal.tip[1] - pal.base[1]) * t
        const b = pal.base[2] + (pal.tip[2] - pal.base[2]) * t

        const angleStep = (Math.PI * 2) / layer.petals
        for (let i = 0; i < layer.petals; i++) {
          const angle = angleStep * i + layer.start * 3.5

          ctx.save()
          ctx.rotate(angle)
          ctx.scale(s, s)
          ctx.globalAlpha = Math.min(s * 1.3, 1)

          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.bezierCurveTo(-layer.w * 0.6, -layer.r * 0.35, -layer.w * 0.3, -layer.r * 0.85, 0, -layer.r)
          ctx.bezierCurveTo(layer.w * 0.3, -layer.r * 0.85, layer.w * 0.6, -layer.r * 0.35, 0, 0)

          const pg = ctx.createLinearGradient(0, 0, 0, -layer.r)
          pg.addColorStop(0, `rgb(${r * 0.45}, ${g * 0.3}, ${b * 0.35})`)
          pg.addColorStop(0.35, `rgb(${r}, ${g}, ${b})`)
          pg.addColorStop(0.7, `rgb(${Math.min(255, r * 1.15)}, ${Math.min(255, g * 1.4)}, ${Math.min(255, b * 1.3)})`)
          pg.addColorStop(1, `rgb(${r * 0.65}, ${g * 0.45}, ${b * 0.45})`)
          ctx.fillStyle = pg
          ctx.fill()

          // Vein
          ctx.beginPath()
          ctx.moveTo(0, -layer.r * 0.12)
          ctx.quadraticCurveTo(1, -layer.r * 0.5, 0, -layer.r * 0.86)
          ctx.strokeStyle = `rgba(60, 8, 15, ${0.12 * s})`
          ctx.lineWidth = 0.5
          ctx.stroke()

          // Highlight
          ctx.beginPath()
          ctx.moveTo(layer.w * 0.08, -layer.r * 0.25)
          ctx.quadraticCurveTo(layer.w * 0.12, -layer.r * 0.55, layer.w * 0.03, -layer.r * 0.78)
          ctx.strokeStyle = `rgba(255, 190, 200, ${0.13 * s})`
          ctx.lineWidth = 0.9
          ctx.stroke()

          ctx.restore()
        }
      }

      // Center
      if (bloom > 0.85) {
        const ca = Math.min((bloom - 0.85) * 6.6, 1)
        ctx.globalAlpha = ca
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, roseSize * 0.17)
        cg.addColorStop(0, `rgb(${pal.base[0] * 0.3}, 3, 8)`)
        cg.addColorStop(0.5, `rgb(${pal.base[0] * 0.5}, 10, 18)`)
        cg.addColorStop(1, `rgb(${pal.base[0] * 0.7}, 18, 28)`)
        ctx.beginPath()
        ctx.arc(0, 0, roseSize * 0.16, 0, Math.PI * 2)
        ctx.fillStyle = cg
        ctx.fill()

        // Spiral
        ctx.beginPath()
        for (let t = 0; t < Math.PI * 3.5; t += 0.1) {
          const sr = t * (roseSize * 0.014)
          const sx = Math.cos(t) * sr
          const sy = Math.sin(t) * sr
          if (t === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.strokeStyle = `rgba(25, 2, 6, ${0.35 * ca})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Dew drops
        const dews = [
          { dx: roseSize * 0.3, dy: -roseSize * 0.35, dr: roseSize * 0.03 },
          { dx: -roseSize * 0.38, dy: -roseSize * 0.18, dr: roseSize * 0.025 },
        ]
        for (const { dx, dy, dr } of dews) {
          const dg = ctx.createRadialGradient(dx - dr * 0.3, dy - dr * 0.3, 0, dx, dy, dr)
          dg.addColorStop(0, `rgba(255, 255, 255, ${0.5 * ca})`)
          dg.addColorStop(0.5, `rgba(255, 255, 255, ${0.15 * ca})`)
          dg.addColorStop(1, "rgba(255, 255, 255, 0)")
          ctx.beginPath()
          ctx.arc(dx, dy, dr, 0, Math.PI * 2)
          ctx.fillStyle = dg
          ctx.fill()
        }
      }

      ctx.restore()
    }

    const drawStemBundle = (bloom: number) => {
      const stemP = Math.min(bloom * 2.5, 1)
      if (stemP <= 0) return

      ctx.save()
      ctx.globalAlpha = stemP

      const wrapY = 420
      const wrapH = stemP * 200

      // Stems converging
      const stems = [
        { topX: 160, topY: 210, a: -0.25 },
        { topX: 200, topY: 150, a: -0.18 },
        { topX: 240, topY: 120, a: -0.1 },
        { topX: 300, topY: 100, a: 0 },
        { topX: 360, topY: 120, a: 0.1 },
        { topX: 400, topY: 150, a: 0.18 },
        { topX: 440, topY: 210, a: 0.25 },
        { topX: 220, topY: 190, a: -0.06 },
        { topX: 380, topY: 190, a: 0.06 },
        { topX: 270, topY: 160, a: -0.04 },
        { topX: 330, topY: 160, a: 0.04 },
        { topX: 180, topY: 260, a: -0.15 },
        { topX: 420, topY: 260, a: 0.15 },
        { topX: 250, topY: 250, a: -0.02 },
        { topX: 350, topY: 250, a: 0.02 },
      ]

      const bx = 300
      const by = wrapY + wrapH

      for (const st of stems) {
        const mx = st.topX + (bx - st.topX) * 0.5 + st.a * 35
        const my = st.topY + (by - st.topY) * 0.5

        ctx.beginPath()
        ctx.moveTo(st.topX, st.topY + 12)
        ctx.quadraticCurveTo(mx, my, bx + st.a * 12, by)

        const sg = ctx.createLinearGradient(st.topX, st.topY, bx, by)
        sg.addColorStop(0, "#3a7a32")
        sg.addColorStop(0.5, "#2d5a27")
        sg.addColorStop(1, "#1f4a1b")
        ctx.strokeStyle = sg
        ctx.lineWidth = 2.5
        ctx.lineCap = "round"
        ctx.stroke()
      }

      // Leaves along stems
      const leaves = [
        { x: 205, y: 300, rot: 0.5, s: 1 },
        { x: 395, y: 285, rot: -0.45, s: 1.05 },
        { x: 240, y: 360, rot: 0.35, s: 0.8 },
        { x: 360, y: 350, rot: -0.35, s: 0.85 },
        { x: 175, y: 260, rot: 0.65, s: 0.75 },
        { x: 425, y: 250, rot: -0.55, s: 0.8 },
        { x: 270, y: 390, rot: 0.2, s: 0.65 },
        { x: 330, y: 385, rot: -0.2, s: 0.7 },
        { x: 190, y: 340, rot: 0.55, s: 0.7 },
        { x: 410, y: 330, rot: -0.5, s: 0.75 },
      ]

      for (const leaf of leaves) {
        if (bloom < 0.25) continue
        const lp = Math.min((bloom - 0.25) / 0.35, 1)
        ctx.save()
        ctx.translate(leaf.x, leaf.y)
        ctx.rotate(leaf.rot)
        ctx.scale(leaf.s * lp, leaf.s * lp)

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(10, -7, 26, -5, 35, 0)
        ctx.bezierCurveTo(26, 5, 10, 7, 0, 0)
        const lg = ctx.createLinearGradient(0, 0, 35, 0)
        lg.addColorStop(0, "#2a6822")
        lg.addColorStop(0.5, "#3a8a34")
        lg.addColorStop(1, "#2a6822")
        ctx.fillStyle = lg
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(3, 0)
        ctx.lineTo(30, 0)
        ctx.strokeStyle = "rgba(25, 55, 20, 0.45)"
        ctx.lineWidth = 0.5
        ctx.stroke()

        for (let v = 0; v < 3; v++) {
          const vx = 8 + v * 8
          ctx.beginPath()
          ctx.moveTo(vx, 0)
          ctx.lineTo(vx + 5, -3)
          ctx.moveTo(vx, 0)
          ctx.lineTo(vx + 5, 3)
          ctx.strokeStyle = "rgba(25, 55, 20, 0.25)"
          ctx.lineWidth = 0.35
          ctx.stroke()
        }

        ctx.restore()
      }

      // Wrapping paper
      if (stemP > 0.4) {
        const wa = Math.min((stemP - 0.4) * 2.5, 1)
        ctx.save()
        ctx.globalAlpha = wa

        // Paper cone - kraft paper style
        ctx.beginPath()
        ctx.moveTo(200, wrapY)
        ctx.lineTo(400, wrapY)
        ctx.lineTo(345, wrapY + 170)
        ctx.lineTo(255, wrapY + 170)
        ctx.closePath()

        const ppGrad = ctx.createLinearGradient(200, wrapY, 400, wrapY)
        ppGrad.addColorStop(0, "#f0dcc5")
        ppGrad.addColorStop(0.25, "#faf0e2")
        ppGrad.addColorStop(0.5, "#f5e6d0")
        ppGrad.addColorStop(0.75, "#faf0e2")
        ppGrad.addColorStop(1, "#e5cdb5")
        ctx.fillStyle = ppGrad
        ctx.fill()

        // Paper edge
        ctx.strokeStyle = "rgba(170, 145, 115, 0.4)"
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Paper texture - diagonal lines
        ctx.save()
        ctx.clip()
        ctx.strokeStyle = "rgba(170, 150, 120, 0.12)"
        ctx.lineWidth = 0.8
        for (let d = -200; d < 400; d += 10) {
          ctx.beginPath()
          ctx.moveTo(200 + d, wrapY)
          ctx.lineTo(200 + d - 80, wrapY + 170)
          ctx.stroke()
        }
        ctx.restore()

        // Paper fold shadow
        ctx.beginPath()
        ctx.moveTo(300, wrapY + 2)
        ctx.lineTo(300, wrapY + 168)
        ctx.strokeStyle = "rgba(140, 120, 90, 0.12)"
        ctx.lineWidth = 18
        ctx.stroke()

        // Decorative lace edge at top of paper
        ctx.save()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
        ctx.lineWidth = 1.5
        for (let lx = 205; lx < 395; lx += 8) {
          ctx.beginPath()
          ctx.arc(lx, wrapY + 2, 4, 0, Math.PI, true)
          ctx.stroke()
        }
        ctx.restore()

        // Ribbon band
        ctx.save()
        ctx.translate(300, wrapY + 25)

        ctx.beginPath()
        ctx.moveTo(-80, -5)
        ctx.quadraticCurveTo(-40, 3, 0, -3)
        ctx.quadraticCurveTo(40, -9, 80, -5)
        ctx.lineTo(80, 5)
        ctx.quadraticCurveTo(40, -1, 0, 5)
        ctx.quadraticCurveTo(-40, 11, -80, 5)
        ctx.closePath()
        const ribGrad = ctx.createLinearGradient(-80, 0, 80, 0)
        ribGrad.addColorStop(0, "#a82040")
        ribGrad.addColorStop(0.3, "#cc3050")
        ribGrad.addColorStop(0.5, "#e04060")
        ribGrad.addColorStop(0.7, "#cc3050")
        ribGrad.addColorStop(1, "#a82040")
        ctx.fillStyle = ribGrad
        ctx.fill()

        // Sheen on ribbon
        ctx.beginPath()
        ctx.moveTo(-70, -3)
        ctx.quadraticCurveTo(-30, 1, 0, -1)
        ctx.quadraticCurveTo(30, -3, 70, -3)
        ctx.strokeStyle = "rgba(255, 200, 210, 0.25)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Bow - left loop
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-18, -24, -42, -28, -34, -6)
        ctx.bezierCurveTo(-28, 10, -10, 6, 0, 0)
        const blGrad = ctx.createLinearGradient(-40, -25, 0, 0)
        blGrad.addColorStop(0, "#d84060")
        blGrad.addColorStop(0.5, "#e85575")
        blGrad.addColorStop(1, "#c83050")
        ctx.fillStyle = blGrad
        ctx.fill()

        // Bow - right loop
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(18, -24, 42, -28, 34, -6)
        ctx.bezierCurveTo(28, 10, 10, 6, 0, 0)
        const brGrad = ctx.createLinearGradient(40, -25, 0, 0)
        brGrad.addColorStop(0, "#e05070")
        brGrad.addColorStop(0.5, "#f06585")
        brGrad.addColorStop(1, "#d04060")
        ctx.fillStyle = brGrad
        ctx.fill()

        // Bow center knot
        ctx.beginPath()
        ctx.ellipse(0, -2, 6, 5, 0, 0, Math.PI * 2)
        ctx.fillStyle = "#a82040"
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(0, -3, 3, 2.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 200, 210, 0.2)"
        ctx.fill()

        // Ribbon tails
        ctx.beginPath()
        ctx.moveTo(-4, 4)
        ctx.quadraticCurveTo(-15, 30, -22, 42)
        ctx.lineTo(-17, 42)
        ctx.quadraticCurveTo(-10, 28, 0, 4)
        ctx.fillStyle = "#c83858"
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(4, 4)
        ctx.quadraticCurveTo(15, 30, 22, 42)
        ctx.lineTo(17, 42)
        ctx.quadraticCurveTo(10, 28, 0, 4)
        ctx.fillStyle = "#d84868"
        ctx.fill()

        ctx.restore()
        ctx.restore()
      }

      ctx.restore()
    }

    // 15 roses - all reds, different sizes and positions
    const roses = [
      // Top row
      { x: 300, y: 120, size: 52, shade: 0, delay: 0 },
      { x: 250, y: 148, size: 46, shade: 1, delay: 0.04 },
      { x: 350, y: 148, size: 46, shade: 2, delay: 0.04 },
      // Second row
      { x: 200, y: 185, size: 42, shade: 3, delay: 0.08 },
      { x: 300, y: 175, size: 48, shade: 1, delay: 0.06 },
      { x: 400, y: 185, size: 42, shade: 0, delay: 0.08 },
      // Third row
      { x: 170, y: 235, size: 38, shade: 2, delay: 0.12 },
      { x: 240, y: 225, size: 44, shade: 3, delay: 0.1 },
      { x: 360, y: 225, size: 44, shade: 0, delay: 0.1 },
      { x: 430, y: 235, size: 38, shade: 1, delay: 0.12 },
      // Fourth row - smaller
      { x: 210, y: 275, size: 35, shade: 2, delay: 0.16 },
      { x: 300, y: 265, size: 40, shade: 3, delay: 0.14 },
      { x: 390, y: 275, size: 35, shade: 0, delay: 0.16 },
      // Accent roses
      { x: 265, y: 300, size: 30, shade: 1, delay: 0.2 },
      { x: 335, y: 300, size: 30, shade: 2, delay: 0.2 },
    ]

    // Baby's breath clusters
    const fillerClusters = [
      { x: 155, y: 195, count: 6, spread: 12 },
      { x: 445, y: 195, count: 6, spread: 12 },
      { x: 185, y: 145, count: 5, spread: 10 },
      { x: 415, y: 145, count: 5, spread: 10 },
      { x: 145, y: 265, count: 5, spread: 10 },
      { x: 455, y: 265, count: 5, spread: 10 },
      { x: 220, y: 130, count: 4, spread: 8 },
      { x: 380, y: 130, count: 4, spread: 8 },
      { x: 300, y: 95, count: 5, spread: 10 },
      { x: 195, y: 310, count: 4, spread: 8 },
      { x: 405, y: 310, count: 4, spread: 8 },
      { x: 260, y: 108, count: 3, spread: 7 },
      { x: 340, y: 108, count: 3, spread: 7 },
    ]

    let time = 0

    const drawFillers = (bloom: number) => {
      if (bloom < 0.3) return
      const fa = Math.min((bloom - 0.3) / 0.3, 1)
      ctx.save()
      ctx.globalAlpha = fa
      for (const cl of fillerClusters) {
        for (let i = 0; i < cl.count; i++) {
          const a = (Math.PI * 2 * i) / cl.count
          const r = cl.spread * 0.6 + Math.sin(i * 2.3) * cl.spread * 0.4
          const fx = cl.x + Math.cos(a) * r
          const fy = cl.y + Math.sin(a) * r
          // Little flower petals
          for (let p = 0; p < 5; p++) {
            const pa = (Math.PI * 2 * p) / 5
            const px = fx + Math.cos(pa) * 2.5
            const py = fy + Math.sin(pa) * 2.5
            ctx.beginPath()
            ctx.arc(px, py, 1.8, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255, 255, 248, 0.75)"
            ctx.fill()
          }
          ctx.beginPath()
          ctx.arc(fx, fy, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(255, 235, 190, 0.8)"
          ctx.fill()
        }
      }
      ctx.restore()
    }

    const drawSparkles = (bloom: number, t: number) => {
      if (bloom < 0.6) return
      const sa = Math.min((bloom - 0.6) / 0.3, 1)
      for (const sp of sparklesRef.current) {
        sp.opacity = Math.sin(t * sp.speed + sp.phase) * 0.5 + 0.5
        ctx.save()
        ctx.globalAlpha = sp.opacity * sa * 0.65
        ctx.translate(sp.x, sp.y)

        const ss = sp.size
        ctx.beginPath()
        ctx.moveTo(0, -ss)
        ctx.lineTo(ss * 0.25, -ss * 0.25)
        ctx.lineTo(ss, 0)
        ctx.lineTo(ss * 0.25, ss * 0.25)
        ctx.lineTo(0, ss)
        ctx.lineTo(-ss * 0.25, ss * 0.25)
        ctx.lineTo(-ss, 0)
        ctx.lineTo(-ss * 0.25, -ss * 0.25)
        ctx.closePath()
        ctx.fillStyle = "rgba(255, 225, 235, 0.9)"
        ctx.fill()

        ctx.restore()
      }
    }

    const drawScene = (bloom: number) => {
      ctx.clearRect(0, 0, w, h)
      drawStemBundle(bloom)
      drawFillers(bloom)
      for (const rose of roses) {
        const rb = Math.max(0, (bloom - rose.delay) / (1 - rose.delay))
        drawRose(rose.x, rose.y, rose.size, Math.min(rb, 1), rose.shade)
      }
      drawSparkles(bloom, time)
    }

    const animate = () => {
      bloomRef.current += 0.008
      const bloom = Math.min(bloomRef.current, 1)
      time += 1

      drawScene(bloom)

      if (bloom < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        // Keep sparkles animating
        const loop = () => {
          time += 1
          drawScene(1)
          animRef.current = requestAnimationFrame(loop)
        }
        loop()
      }
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [started])

  if (!visible) return null

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <canvas
        ref={canvasRef}
        style={{ width: 600, height: 750 }}
        className="max-w-full"
        aria-label="Un ramo grande de rosas rojas para ti"
        role="img"
      />
    </div>
  )
}
