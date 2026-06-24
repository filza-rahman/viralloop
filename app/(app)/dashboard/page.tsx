"use client"

import { useState } from "react"
import { Sparkles, SlidersHorizontal, ChevronDown } from "lucide-react"
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

const TONES = [
  { id: "default", label: "Auto" },
  { id: "bold", label: "Bold" },
  { id: "casual", label: "Casual" },
  { id: "witty", label: "Witty" },
  { id: "professional", label: "Professional" },
  { id: "inspirational", label: "Inspirational" },
]

const WORD_LIMITS = [
  { value: 0, label: "No limit" },
  { value: 50, label: "≤ 50 words" },
  { value: 100, label: "≤ 100 words" },
  { value: 150, label: "≤ 150 words" },
  { value: 250, label: "≤ 250 words" },
]

export default function DashboardPage() {
  const [idea, setIdea] = useState("")
  const [selected, setSelected] = useState<PlatformId[]>(["twitter", "linkedin", "reddit"])
  const [results, setResults] = useState<PlatformResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState<PlatformId | null>(null)
  const [tone, setTone] = useState("default")
  const [wordLimit, setWordLimit] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)

  function togglePlatform(id: PlatformId) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  async function handleGenerate() {
    if (!idea.trim()) { toast.error("Add an idea first."); return }
    if (selected.length === 0) { toast.error("Select at least one platform."); return }

    setLoading(true)
    setResults(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, platforms: selected, tone, wordLimit }),
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
        body: JSON.stringify({ idea, platforms: [platform], tone, wordLimit }),
      })
      if (!res.ok) throw new Error("request failed")
      const data = (await res.json()) as { results: PlatformResult[] }
      const fresh = data.results[0]
      setResults((prev) =>
        prev ? prev.map((r) => (r.platform === platform ? fresh : r)) : [fresh],
      )
      toast.success("Regenerated")
    } catch {
      toast.error("Could not regenerate. Please try again.")
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#080808] text-white">
      {/* Subtle ambient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[30rem] w-[30rem] rounded-full bg-[#4c1d95] opacity-20 blur-[100px]" />
        <div className="absolute top-1/2 -right-20 h-[24rem] w-[24rem] rounded-full bg-[#3730a3] opacity-15 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        {/* Header */}
        <header className="mb-8">
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-white/35">
            AI Content Engine
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/45">
            Drop a raw idea and get platform-native posts with virality scores.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          {/* Composer panel */}
          <section className="flex flex-col gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <label htmlFor="idea" className="mb-2 block text-sm font-medium text-white/80">
                Your idea
              </label>
              <Textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Drop your raw idea or rough draft here..."
                className="min-h-40 resize-none border-white/10 bg-white/[0.04] text-sm leading-relaxed text-white placeholder:text-white/25 focus:border-violet-500/50 focus:ring-violet-500/20"
              />

              {/* Platforms */}
              <div className="mt-4">
                <span className="mb-2 block text-sm font-medium text-white/80">Platforms</span>
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
                          "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150",
                          active
                            ? "border-violet-500/50 bg-violet-500/15 text-white shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                            : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:text-white/80",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", active && p.accent)} />
                        {p.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Advanced controls toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Advanced options
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showAdvanced && "rotate-180")} />
              </button>

              {showAdvanced && (
                <div className="mt-4 grid gap-4 border-t border-white/8 pt-4 sm:grid-cols-2">
                  {/* Tone */}
                  <div>
                    <span className="mb-2 block text-xs font-medium text-white/60">Tone</span>
                    <div className="flex flex-wrap gap-1.5">
                      {TONES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTone(t.id)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                            tone === t.id
                              ? "border-violet-500/50 bg-violet-500/15 text-white"
                              : "border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white/70",
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Word limit */}
                  <div>
                    <span className="mb-2 block text-xs font-medium text-white/60">Word limit</span>
                    <div className="flex flex-wrap gap-1.5">
                      {WORD_LIMITS.map((wl) => (
                        <button
                          key={wl.value}
                          type="button"
                          onClick={() => setWordLimit(wl.value)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                            wordLimit === wl.value
                              ? "border-violet-500/50 bg-violet-500/15 text-white"
                              : "border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white/70",
                          )}
                        >
                          {wl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="w-full gap-2 bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all hover:bg-violet-500 hover:shadow-[0_0_28px_rgba(124,58,237,0.5)] disabled:opacity-50"
              onClick={handleGenerate}
              disabled={loading}
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating..." : "Generate"}
            </Button>
          </section>

          {/* Results panel */}
          <section className="flex flex-col gap-4">
            {loading && <GeneratingState />}

            {!loading && !results && (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                  <Sparkles className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-medium text-white/80">No content yet</p>
                <p className="mt-1 max-w-xs text-sm text-white/35">
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
    </div>
  )
}
