"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GeneratingState } from "@/components/generating-state"
import { ResultCard } from "@/components/result-card"
import { addGeneration } from "@/lib/history-store"
import {
  PLATFORMS,
  type PlatformId,
  type PlatformResult,
} from "@/lib/platforms"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [idea, setIdea] = useState("")
  const [selected, setSelected] = useState<PlatformId[]>([
    "twitter",
    "linkedin",
    "reddit",
  ])
  const [results, setResults] = useState<PlatformResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState<PlatformId | null>(null)

  function togglePlatform(id: PlatformId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  async function handleGenerate() {
    if (!idea.trim()) {
      toast.error("Add an idea first.")
      return
    }
    if (selected.length === 0) {
      toast.error("Select at least one platform.")
      return
    }

    setLoading(true)
    setResults(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, platforms: selected }),
      })
      if (!res.ok) throw new Error("request failed")
      const data = (await res.json()) as { results: PlatformResult[] }
      setResults(data.results)
      addGeneration({
        id: crypto.randomUUID(),
        idea: idea.trim(),
        createdAt: new Date().toISOString(),
        platforms: selected,
        results: data.results,
      })
    } catch {
      toast.error("Generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegenerate(platform: PlatformId) {
    setRegenerating(platform)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, platforms: [platform] }),
      })
      if (!res.ok) throw new Error("request failed")
      const data = (await res.json()) as { results: PlatformResult[] }
      const fresh = data.results[0]
      setResults((prev) =>
        prev
          ? prev.map((r) => (r.platform === platform ? fresh : r))
          : [fresh],
      )
      toast.success("Regenerated")
    } catch {
      toast.error("Could not regenerate. Please try again.")
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop a raw idea and get platform-native posts with virality scores.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* Composer */}
        <section className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="idea"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Your idea
            </label>
            <Textarea
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Drop your raw idea or rough draft here..."
              className="min-h-44 resize-none text-sm leading-relaxed"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-foreground">
              Platforms
            </span>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const Icon = p.icon
                const active = selected.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-primary/40 bg-primary/15 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active && p.accent)} />
                    {p.name}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleGenerate}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating..." : "Generate"}
          </Button>
        </section>

        {/* Results */}
        <section className="flex flex-col gap-4">
          {loading && <GeneratingState />}

          {!loading && !results && (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-medium">No content yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Your platform-native posts and virality scores will appear here.
              </p>
            </div>
          )}

          {!loading &&
            results?.map((r) => (
              <ResultCard
                key={r.platform}
                result={r}
                onRegenerate={() => handleRegenerate(r.platform)}
                regenerating={regenerating === r.platform}
              />
            ))}
        </section>
      </div>
    </div>
  )
}
