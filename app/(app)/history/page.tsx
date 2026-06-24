"use client"

import { useMemo, useState } from "react"
import { Flame, History as HistoryIcon, Trash2, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResultCard } from "@/components/result-card"
import { useGenerations, deleteGeneration } from "@/lib/history-store"
import { getPlatform, PLATFORMS, type PlatformId } from "@/lib/platforms"
import { cn } from "@/lib/utils"

type RangeFilter = "all" | "7d" | "30d"

function topScore(results: { score: number }[]) {
  return results.reduce((max, r) => Math.max(max, r.score), 0)
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400"
  if (score >= 60) return "text-amber-400"
  return "text-rose-400"
}

export default function HistoryPage() {
  const generations = useGenerations()
  const [platform, setPlatform] = useState<PlatformId | "all">("all")
  const [range, setRange] = useState<RangeFilter>("all")
  const [openId, setOpenId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const now = Date.now()
    return generations.filter((g) => {
      if (platform !== "all" && !g.platforms.includes(platform)) return false
      if (range !== "all") {
        const days = range === "7d" ? 7 : 30
        const cutoff = now - days * 24 * 60 * 60 * 1000
        if (new Date(g.createdAt).getTime() < cutoff) return false
      }
      return true
    })
  }, [generations, platform, range])

  const open = generations.find((g) => g.id === openId) ?? null

  function handleDelete(id: string) {
    if (confirmDeleteId === id) {
      deleteGeneration(id)
      setConfirmDeleteId(null)
      if (openId === id) setOpenId(null)
    } else {
      setConfirmDeleteId(id)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#080808] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-[#4c1d95] opacity-15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-[22rem] w-[22rem] rounded-full bg-[#164e63] opacity-15 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <header className="mb-6">
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-white/35">
            Your archive
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">History</h1>
          <p className="mt-1 text-sm text-white/45">
            Every idea you turned into content, with its best score.
          </p>
        </header>

        {/* Filter bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformId | "all")}>
            <SelectTrigger className="w-44 border-white/10 bg-white/[0.05] text-white/70 focus:ring-violet-500/30">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#111] text-white">
              <SelectItem value="all">All platforms</SelectItem>
              {PLATFORMS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={range} onValueChange={(v) => setRange(v as RangeFilter)}>
            <SelectTrigger className="w-44 border-white/10 bg-white/[0.05] text-white/70 focus:ring-violet-500/30">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#111] text-white">
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          <span className="ml-auto font-mono text-xs text-white/30">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-sm">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-white/30">
              <HistoryIcon className="h-7 w-7" />
              <span className="text-sm">No generations match your filters.</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-5 py-3.5 text-left font-mono text-xs uppercase tracking-widest text-white/30 w-32">Date</th>
                  <th className="px-5 py-3.5 text-left font-mono text-xs uppercase tracking-widest text-white/30">Idea</th>
                  <th className="px-5 py-3.5 text-left font-mono text-xs uppercase tracking-widest text-white/30 w-36">Platforms</th>
                  <th className="px-5 py-3.5 text-left font-mono text-xs uppercase tracking-widest text-white/30 w-28">Score</th>
                  <th className="px-5 py-3.5 text-right font-mono text-xs uppercase tracking-widest text-white/30 w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => {
                  const score = topScore(g.results)
                  const isLast = i === filtered.length - 1
                  return (
                    <tr
                      key={g.id}
                      className={cn(
                        "transition-colors hover:bg-white/[0.025]",
                        !isLast && "border-b border-white/5"
                      )}
                    >
                      <td className="px-5 py-4 text-white/35 tabular-nums">
                        {new Date(g.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <span className="block truncate text-white/80">{g.idea}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {g.platforms.map((pid) => {
                            const p = getPlatform(pid)
                            const Icon = p.icon
                            return <Icon key={pid} className={cn("h-4 w-4", p.accent)} aria-label={p.name} />
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 font-semibold", scoreColor(score))}>
                          <Flame className="h-3.5 w-3.5" />
                          {score}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setOpenId(g.id)}
                            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            View
                          </button>
                          {confirmDeleteId === g.id ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDelete(g.id)}
                                className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-white/30 hover:text-white/60 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(g.id)}
                              className="text-white/25 hover:text-rose-400 transition-colors"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail modal */}
        {open && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setOpenId(null)}
          >
            <div
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#0e0e0e] p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Generation detail</h2>
                  <p className="mt-1 text-sm text-white/45">{open.idea}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {open.results.map((r) => (
                  <ResultCard key={r.platform} result={r} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
