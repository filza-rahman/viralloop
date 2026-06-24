"use client"

import { useMemo, useState } from "react"
import { Flame, History as HistoryIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { ResultCard } from "@/components/result-card"
import { useGenerations } from "@/lib/history-store"
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every idea you have turned into content, with its best score.
        </p>
      </header>

      {/* Filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Select
          value={platform}
          onValueChange={(v) => setPlatform(v as PlatformId | "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={range} onValueChange={(v) => setRange(v as RangeFilter)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-32">Date</TableHead>
              <TableHead>Idea</TableHead>
              <TableHead className="w-36">Platforms</TableHead>
              <TableHead className="w-28">Top Score</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <HistoryIcon className="h-6 w-6" />
                    <span className="text-sm">No generations match your filters.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((g) => {
              const score = topScore(g.results)
              return (
                <TableRow key={g.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(g.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="block truncate text-sm text-foreground">
                      {g.idea}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {g.platforms.map((pid) => {
                        const p = getPlatform(pid)
                        const Icon = p.icon
                        return (
                          <Icon
                            key={pid}
                            className={cn("h-4 w-4", p.accent)}
                            aria-label={p.name}
                          />
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-semibold",
                        scoreColor(score),
                      )}
                    >
                      <Flame className="h-3.5 w-3.5" />
                      {score}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => setOpenId(g.id)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setOpenId(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-background p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">Generation detail</h2>
                <p className="mt-1 text-sm text-muted-foreground">{open.idea}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
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
  )
}
