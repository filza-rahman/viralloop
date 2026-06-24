"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const STEPS = [
  "Researching trends...",
  "Writing content...",
  "Scoring virality...",
]

export function GeneratingState() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % STEPS.length)
    }, 1400)
    return () => clearInterval(t)
  }, [])

  return (
    <Card className="p-6">
      <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 animate-[loadbar_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
      <ul className="flex flex-col gap-3">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className={cn(
              "flex items-center gap-3 text-sm transition-colors",
              i === active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === active ? "bg-primary" : "bg-muted-foreground/40",
                i === active && "animate-pulse",
              )}
            />
            {step}
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes loadbar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </Card>
  )
}
