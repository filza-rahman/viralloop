import Groq from "groq-sdk"
import { z } from "zod"
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

const ResultSchema = z.object({
  content: z.string(),
  score: z.number(),
  explanation: z.string(),
})

export async function POST(req: Request) {
  try {
    const { idea, platforms } = (await req.json()) as {
      idea?: string
      platforms?: PlatformId[]
    }

    if (!idea || !idea.trim()) {
      return Response.json({ error: "Idea is required." }, { status: 400 })
    }

    const selected =
      Array.isArray(platforms) && platforms.length
        ? platforms
        : (["twitter", "linkedin", "reddit"] as PlatformId[])

    const results = await Promise.all(
      selected.map(async (platform): Promise<PlatformResult> => {
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are ViralLoop, an expert social media ghostwriter who rewrites raw ideas into platform-native posts that spread. Always respond with valid JSON only, no markdown, no explanation outside the JSON.",
            },
            {
              role: "user",
              content: `Rewrite the following raw idea into a ${platform} post.

Platform guidance: ${PLATFORM_GUIDE[platform]}

Raw idea:
"""${idea.trim()}"""

Respond with ONLY this JSON (no markdown, no backticks):
{
  "content": "the finished post ready to publish",
  "score": 85,
  "explanation": "two-line explanation of the virality score"
}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        })

        const raw = completion.choices[0]?.message?.content ?? "{}"
        const cleaned = raw.replace(/```json|```/g, "").trim()
        const parsed = ResultSchema.parse(JSON.parse(cleaned))

        return {
          platform,
          content: parsed.content,
          score: Math.max(0, Math.min(100, Math.round(parsed.score))),
          explanation: parsed.explanation,
        }
      })
    )

    return Response.json({ results })
  } catch (err) {
    console.error("[viralloop] generate error:", err)
    return Response.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    )
  }
}
