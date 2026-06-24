"use client"

import { useState } from "react"
import { Check, Copy, Flame, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getPlatform, type PlatformResult } from "@/lib/platforms"
import { cn } from "@/lib/utils"

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
  if (score >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/10"
  return "text-rose-400 border-rose-500/30 bg-rose-500/10"
}

export function ResultCard({
  result,
  onRegenerate,
  regenerating,
}: {
  result: PlatformResult
  onRegenerate?: () => void
  regenerating?: boolean
}) {
  const platform = getPlatform(result.platform)
  const Icon = platform.icon
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(result.content)
    setCopied(true)
    toast.success(`${platform.name} post copied`)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Icon className={cn("h-4.5 w-4.5", platform.accent)} />
          <span className="text-sm font-semibold">{platform.name}</span>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
            scoreColor(result.score),
          )}
        >
          <Flame className="h-3.5 w-3.5" />
          {result.score}/100
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {result.content}
        </p>
        <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-5 py-3">
        <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        {onRegenerate && (
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={onRegenerate}
            disabled={regenerating}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", regenerating && "animate-spin")} />
            Regenerate
          </Button>
        )}
      </div>
    </Card>
  )
}
