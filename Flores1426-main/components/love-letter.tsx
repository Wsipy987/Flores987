"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

const lines = [
  "Se que la distancia no es facil.",
  "A veces quisiera teletransportarme,",
  "pero la ciencia aun no coopera.",
  "",
  "Asi que mientras tanto,",
  "te mando estas flores digitales",
  "que cruzan cualquier distancia",
  "sin pagar envio.",
  "",
  "No te puedo dar un abrazo ahora,",
  "pero cuando nos veamos",
  "te voy a abrazar tan fuerte",
  "que vas a pedir que te suelte.",
  "(No te voy a soltar.)",
  "",
  "Cada mensaje tuyo me alegra el dia.",
  "Cada nota de voz la repito",
  "mas veces de las que admitire.",
  "",
  "La distancia es solo un numero,",
  "y lo nuestro es mas grande",
  "que cualquier mapa.",
  "",
  "Feliz San Valentin, mi amor.",
  "Estoy lejos, pero soy todo tuyo.",
  "(Y ya estoy contando los dias.)",
]

export function LoveLetter({
  visible,
  onFinished,
}: {
  visible: boolean
  onFinished?: () => void
}) {
  const [revealedLines, setRevealedLines] = useState(0)
  const [allRevealed, setAllRevealed] = useState(false)

  useEffect(() => {
    if (!visible) return

    const interval = setInterval(() => {
      setRevealedLines((prev) => {
        if (prev >= lines.length) {
          clearInterval(interval)
          setAllRevealed(true)
          return prev
        }
        return prev + 1
      })
    }, 400)

    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  return (
    <div className="animate-letter-reveal mx-auto max-w-lg px-6">
      <div className="relative rounded-2xl border border-primary/20 bg-card/80 p-8 shadow-2xl shadow-primary/10 backdrop-blur-sm md:p-12">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Heart className="h-8 w-8 animate-pulse-glow fill-primary text-primary" />
        </div>

        <p className="mb-6 text-center font-sans text-sm tracking-widest uppercase text-muted-foreground">
          Desde lejos, pero bien cerquita
        </p>

        <div className="space-y-1 text-center">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`font-sans text-lg leading-relaxed tracking-wide text-foreground transition-all duration-700 md:text-xl ${
                i < revealedLines
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              } ${line === "" ? "h-4" : ""}`}
            >
              {line}
            </p>
          ))}
        </div>

        {revealedLines >= lines.length && (
          <div className="mt-8 animate-fade-in text-center">
            <p className="font-serif text-2xl italic text-primary md:text-3xl">
              Quien mas te extraña en el mundo
            </p>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-primary/40" />
              <Heart className="h-4 w-4 fill-primary text-primary" />
              <span className="h-px w-8 bg-primary/40" />
            </div>

            {allRevealed && onFinished && (
              <button
                onClick={onFinished}
                className="mt-10 inline-flex animate-fade-in items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-8 py-4 font-sans text-lg tracking-wide text-primary transition-all duration-500 hover:border-primary/60 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Heart className="h-5 w-5" />
                <span>Ver tu ramo</span>
                <Heart className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
