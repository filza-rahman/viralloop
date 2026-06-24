"use client"

import { useSyncExternalStore } from "react"
import type { Generation } from "@/lib/platforms"

const SAMPLE: Generation[] = [
  {
    id: "seed-1",
    idea: "We just shipped offline mode for our note-taking app after 3 months of rewriting the sync engine.",
    createdAt: "2026-06-21T14:30:00.000Z",
    platforms: ["twitter", "linkedin", "reddit"],
    results: [
      {
        platform: "twitter",
        content:
          "Spent 3 months rewriting our sync engine so your notes work offline. No spinners. No \"reconnecting\". Just type. Shipping today.",
        score: 86,
        explanation:
          "Strong concrete payoff with a relatable pain point. Short, confident, and shareable for builders.",
      },
      {
        platform: "linkedin",
        content:
          "Three months ago we made a hard call: pause features and rewrite our sync engine from scratch.\n\nToday offline mode ships. Your notes just work — on a plane, in a tunnel, anywhere.\n\nWhat's the hardest infra bet your team has made?",
        score: 78,
        explanation:
          "Story arc with a clear lesson and a discussion prompt. Slightly long hook caps reach.",
      },
      {
        platform: "reddit",
        content:
          "We rewrote our note app's sync engine to support true offline mode. Took 3 months and a lot of conflict-resolution headaches. Happy to share what broke if anyone's building CRDT-based sync.",
        score: 72,
        explanation:
          "Authentic and helpful, invites discussion. Lower ceiling because it's niche to a technical audience.",
      },
    ],
  },
  {
    id: "seed-2",
    idea: "Hot take: most startup landing pages explain features when they should be selling outcomes.",
    createdAt: "2026-06-19T09:12:00.000Z",
    platforms: ["twitter", "linkedin"],
    results: [
      {
        platform: "twitter",
        content:
          "Your landing page lists features.\n\nYour customer wants an outcome.\n\nStop selling the drill. Sell the hole in the wall.",
        score: 91,
        explanation:
          "Punchy contrarian hook with a memorable metaphor. Highly quotable and screenshot-friendly.",
      },
      {
        platform: "linkedin",
        content:
          "Most startup landing pages make the same mistake: they explain features.\n\nBut nobody buys features. They buy outcomes — the thing their life looks like after.\n\nRewrite your headline to finish this sentence: \"After using us, you'll finally...\"",
        score: 80,
        explanation:
          "Actionable insight with a clear takeaway readers can apply immediately. Broad professional appeal.",
      },
    ],
  },
]

let generations: Generation[] = SAMPLE
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

export function addGeneration(gen: Generation) {
  generations = [gen, ...generations]
  emit()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return generations
}

export function useGenerations(): Generation[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
