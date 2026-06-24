import { getGenerations } from "@/lib/history-store"
import { PLATFORMS } from "@/lib/platforms"

export const dynamic = "force-dynamic"

export default async function HistoryPage() {
  const generations = await getGenerations()

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your past generations, stored in DynamoDB.
        </p>
      </header>

      {generations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No generations yet. Go create something!</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Idea</th>
                <th className="px-4 py-3">Platforms</th>
                <th className="px-4 py-3">Top Score</th>
              </tr>
            </thead>
            <tbody>
              {generations.map((g) => {
                const topScore = Math.max(...g.results.map((r) => r.score))
                const platformNames = g.platforms
                  .map((id) => PLATFORMS.find((p) => p.id === id)?.name ?? id)
                  .join(", ")
                return (
                  <tr key={g.id} className="border-b border-border/50 hover:bg-card/40 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">{g.idea}</td>
                    <td className="px-4 py-3 text-muted-foreground">{platformNames}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary">🔥 {topScore}/100</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}