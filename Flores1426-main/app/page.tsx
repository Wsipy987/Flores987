"use client"

import { useState, useEffect, useRef } from "react"
import { FallingPetals } from "@/components/falling-petals"
import { FloatingHearts } from "@/components/floating-hearts"
import { BloomingRose } from "@/components/blooming-rose"
import { LoveLetter } from "@/components/love-letter"
import { EnvelopeButton } from "@/components/envelope-button"
import { BouquetReveal } from "@/components/bouquet-reveal"
import { Heart, Sparkles } from "lucide-react"

export default function ValentinePage() {
  const [opened, setOpened] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showRoses, setShowRoses] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [showBouquet, setShowBouquet] = useState(false)
  const bouquetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 400)
    const t2 = setTimeout(() => setShowRoses(true), 900)
    const t3 = setTimeout(() => setShowButton(true), 1800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <FallingPetals />
      <FloatingHearts />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-30 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Date badge */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            showTitle ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/50 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">
              14 de febrero
            </span>
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </div>
        </div>

        {/* Title */}
        <h1
          className={`mb-4 text-center font-serif text-5xl font-bold tracking-tight text-foreground transition-all duration-1000 md:text-7xl lg:text-8xl ${
            showTitle ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Para Ti
        </h1>

        <p
          className={`mb-12 max-w-md text-center font-sans text-lg leading-relaxed text-muted-foreground transition-all delay-300 duration-1000 md:text-xl ${
            showTitle ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Aunque estemos lejos,
          <br />
          estas flores llegan sin importar la distancia
        </p>

        {/* Roses */}
        {!opened && (
          <div
            className={`mb-12 transition-all duration-1000 ${
              showRoses ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="flex items-end justify-center -space-x-6 md:-space-x-4">
              <div className="-rotate-12 transform">
                <BloomingRose delay={800} />
              </div>
              <div className="z-10 -translate-y-5 transform">
                <BloomingRose delay={1100} />
              </div>
              <div className="rotate-12 transform">
                <BloomingRose delay={1400} />
              </div>
            </div>
          </div>
        )}

        {/* Button */}
        {!opened && (
          <div
            className={`transition-all duration-700 ${
              showButton ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <EnvelopeButton onClick={() => setOpened(true)} />
          </div>
        )}

        {/* Love Letter Reveal */}
        {opened && (
          <div className="mt-4 w-full">
            <div className="mb-8 flex justify-center">
              <div className="animate-float">
                <BloomingRose delay={0} />
              </div>
            </div>
            <LoveLetter
              visible={opened}
              onFinished={() => {
                setShowBouquet(true)
                setTimeout(() => {
                  bouquetRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }, 300)
              }}
            />
          </div>
        )}

        {/* Big Bouquet Reveal */}
        {showBouquet && (
          <div ref={bouquetRef} className="mt-12 w-full">
            <p className="mb-6 animate-fade-in text-center font-sans text-xl tracking-wide text-muted-foreground md:text-2xl">
              Este ramo es para ti
            </p>
            <BouquetReveal visible={showBouquet} />
          </div>
        )}

        {/* Bottom decoration */}
        <div
          className={`mt-16 flex items-center gap-3 transition-all duration-1000 ${
            showButton ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-px w-12 bg-primary/20" />
          <Heart className="h-3 w-3 animate-pulse-glow fill-primary/40 text-primary/40" />
          <span className="h-px w-12 bg-primary/20" />
        </div>
      </div>
    </main>
  )
}
