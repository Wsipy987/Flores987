"use client"

import { Heart } from "lucide-react"

export function EnvelopeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-8 py-4 font-sans text-lg tracking-wide text-primary transition-all duration-500 hover:border-primary/60 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
      <span>Abrir mi regalo</span>
      <Heart className="h-5 w-5 transition-transform duration-300 group-hover:scale-125" />
    </button>
  )
}
