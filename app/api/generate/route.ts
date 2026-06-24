import Groq from "groq-sdk"
import { addGeneration } from "@/lib/history-store"
import type { PlatformId, PlatformResult } from "@/lib/platforms"

export const maxDuration = 60

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const PLATFORM_GUIDE: Record<PlatformId, string> = {
  twitter:
    "Twitter/X: hook-first, punchy, under 280 characters when possible. Conversational, bold, scannable. May use a thread-style opener. Minimal hashtags (0-2).",
  linkedin:
    "LinkedIn: professional but human, story- or insight-driven. Short paragraphs with line breaks, a clear takeaway, and a soft call-to-discussion at the end. No corporate fluff.",
  reddit:
    "Reddit: authentic, community-native, no marketing tone. Sounds like a real person sharing genuinely. Honest, specific, and helpful. No hashtags, no emojis-as-bullets, no salesy language.",
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const idea = body?.idea as string | undefined
    const platforms = body?.platforms as PlatformId[] | undefined

    if (!idea || !idea.trim()) {
      return Response.json({ error: "Idea is required." }, { status: 400 })
    }

    const selected: PlatformId[] =
      Array.isArray(platforms) && platforms.length
        ? platforms
        : ["twitter", "linkedin", "reddit"]

    const results = await Promise.all(
      selected.map(async (platform): Promise<PlatformResult> => {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are ViralLoop, an expert social media ghostwriter. Always respond with valid JSON only. No markdown, no backticks, no explanation.",
            },
            {
              role: "user",
              content: `Rewrite this idea into a ${platform} post.

Platform guidance: ${PLATFORM_GUIDE[platform]}

Raw idea: "${idea.trim()}"

Respond with ONLY this JSON structure:
{"content":"the finished post","score":75,"explanation":"two sentences explaining the score"}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        })

        const raw = completion.choices[0]?.message?.content ?? ""
        // Extract JSON object even if model wraps it in text
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        const cleaned = jsonMatch ? jsonMatch[0].trim() : raw.trim()

        let parsed: { content: string; score: number; explanation: string }
        let content = ""
        let score = 70
        let explanation = ""

        try {
          const jsonMatch = raw.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            content = parsed.content ?? ""
            score = Number(parsed.score) || 70
            explanation = parsed.explanation ?? ""
          }
        } catch {
          content = raw.trim()
        }

        if (content.startsWith("{") || content.includes('"content"')) {
          const contentMatch = raw.match(/"content"\s*:\s*"([\s\S]*?)(?<!\\)",/)
          if (contentMatch) content = contentMatch[1].replace(/\\n/g, "\n")
        }

        return {
          platform,
          content: content || raw.trim(),
          score: Math.max(0, Math.min(100, Math.round(score))),
          explanation,
        }
      })
    )

    // Save to DynamoDB
    await addGeneration({
      id: crypto.randomUUID(),
      idea: idea.trim(),
      createdAt: new Date().toISOString(),
      platforms: selected,
      results,
    })

    return Response.json({ results })
  } catch (err) {
    console.error("[viralloop] generate error:", err)
    return Response.json(
      { error: "Failed to generate content. Please try again.", detail: String(err) },
      { status: 500 }
    )
  }
}