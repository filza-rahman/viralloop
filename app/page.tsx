"use client"

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const tickerItems = ['Twitter', 'LinkedIn', 'Reddit', 'Go Viral']

const features = [
  {
    number: '01',
    title: 'One idea in.',
    body: 'Drop a single thought, a rough note, or a half-finished sentence. Cast Wide reads the intent and the angle, not just the words.',
  },
  {
    number: '02',
    title: 'Every voice out.',
    body: 'Instantly reshaped for each platform — punchy for Twitter, considered for LinkedIn, native for Reddit. Same idea, fluent everywhere.',
  },
  {
    number: '03',
    title: 'Tuned to spread.',
    body: 'Hooks, pacing, and structure are optimized against what actually travels, so your idea lands instead of disappearing into the feed.',
  },
]

const RAW_IDEA = "dropped out of college to build my startup"
const TWITTER_OUT = "Dropped out. Built anyway.\n\nNo safety net. No plan B.\n\nJust a product, a prayer, and 14-hour days.\n\nWorth it? Every single one. 🚀"
const LINKEDIN_OUT = "Three years ago I walked out of my last lecture and never went back.\n\nI had a product, a handful of users, and zero certainty.\n\nHere's what no one tells you about betting on yourself:"

// Typing animation hook
function useTypingAnimation(phrases: { text: string; pause: number }[]) {
  const [display, setDisplay] = useState('')
  const [phase, setPhase] = useState(0) // 0 = typing raw, 1 = pause, 2 = deleting, 3 = typing output
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const current = phrases[phraseIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === 0) {
      // Typing
      if (charIdx < current.text.length) {
        timeout = setTimeout(() => {
          setDisplay(current.text.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        }, 45)
      } else {
        // Done typing, pause
        timeout = setTimeout(() => setPhase(2), current.pause)
      }
    } else if (phase === 2) {
      // Deleting
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplay(current.text.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        }, 18)
      } else {
        // Move to next phrase
        const next = (phraseIdx + 1) % phrases.length
        setPhraseIdx(next)
        setPhase(0)
      }
    }
    return () => clearTimeout(timeout)
  }, [phase, charIdx, phraseIdx, phrases])

  return display
}

// Animated score counter
function ScoreCounter({ target = 91 }: { target?: number }) {
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let current = 0
    const step = () => {
      current += Math.ceil((target - current) / 8)
      if (current >= target) { setScore(target); return }
      setScore(current)
      setTimeout(step, 40)
    }
    setTimeout(step, 300)
  }, [started, target])

  const pct = (score / 100) * 100
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl transition-all duration-500"
          style={{ background: `${color}30`, opacity: started ? 1 : 0 }}
        />
        {/* Ring SVG */}
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="relative text-center">
          <span className="text-3xl font-black text-white tabular-nums">{score}</span>
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/35">/100</span>
        </div>
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-white/40">Virality Score</span>
    </div>
  )
}

export default function Page() {
  const typedText = useTypingAnimation([
    { text: RAW_IDEA, pause: 900 },
    { text: TWITTER_OUT, pause: 2200 },
    { text: LINKEDIN_OUT, pause: 2200 },
  ])

  // Detect which phase we're in for label
  const isRaw = typedText.length <= RAW_IDEA.length && !TWITTER_OUT.startsWith(typedText) && !LINKEDIN_OUT.startsWith(typedText)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white selection:bg-[#4c1d95] selection:text-white">
      {/* Blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-blob-1 absolute -top-32 -left-24 h-[44rem] w-[44rem] rounded-full bg-[#4c1d95] opacity-40 blur-[120px]" />
        <div className="animate-blob-2 absolute top-1/3 -right-32 h-[40rem] w-[40rem] rounded-full bg-[#3730a3] opacity-40 blur-[120px]" />
        <div className="animate-blob-3 absolute -bottom-40 left-1/4 h-[38rem] w-[38rem] rounded-full bg-[#164e63] opacity-40 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <header className="flex items-center justify-between px-6 py-7 md:px-12">
          <span className="text-sm font-medium uppercase tracking-[0.25em]">
            Cast<span className="text-white/40">Wide</span>
          </span>
          <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest text-white/45 md:flex">
            <a href="#features" className="transition-colors hover:text-white">Process</a>
            <a href="#cta" className="transition-colors hover:text-white">Start</a>
          </nav>
        </header>

        {/* Hero */}
        <section className="grid min-h-[90vh] grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-8 md:px-12">

          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <div className="animate-fade-up mb-6 flex items-center gap-3 [animation-delay:0.05s]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <span className="font-semibold tracking-tight text-white">Cast Wide</span>
              <span className="h-3 w-px bg-white/20" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/35">AI Content Engine</span>
            </div>
            <h1 className="text-[clamp(52px,8vw,108px)] leading-[0.92] tracking-tight">
              <span className="animate-fade-up block font-thin text-white/85 [animation-delay:0.15s]">Your idea.</span>
              <span
                className="animate-fade-up block font-black text-white [animation-delay:0.3s]"
                style={{ textShadow: '0 0 45px rgba(124,58,237,0.75)' }}
              >Everywhere.</span>
            </h1>
            <p className="animate-fade-up ml-1 mt-10 max-w-[380px] text-sm leading-relaxed text-white/45 [animation-delay:0.45s]">
              Cast Wide turns a single thought into platform-fluent posts built to travel. Write once — show up natively across every feed that matters.
            </p>
            <div className="animate-fade-up mt-12 [animation-delay:0.6s]">
              <Link href="/login" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[2px]">
                <span className="animate-border-spin absolute inset-[-100%]" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, #4c1d95 90deg, #7c3aed 180deg, #164e63 270deg, transparent 360deg)' }} />
                <span className="relative inline-flex items-center gap-3 rounded-full bg-[#0c0c0c] px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors group-hover:bg-[#141414]">
                  Start creating <span className="text-[#7c3aed]">→</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Right: interactive preview */}
          <div className="animate-fade-up hidden flex-col gap-4 [animation-delay:0.55s] md:flex">

            {/* Typing card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                  {isRaw ? '✏️ Raw idea' : '✨ Generated post'}
                </span>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </div>
              </div>
              <p className="min-h-[80px] whitespace-pre-line text-sm leading-relaxed text-white/85">
                {typedText}
                <span className="animate-pulse text-violet-400">|</span>
              </p>
            </div>

            {/* Platform cards row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Twitter */}
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">Twitter / X</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[91%] rounded-full bg-emerald-500" />
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-400">🔥 91/100</span>
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <svg className="h-4 w-4 text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">LinkedIn</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[84%] rounded-full bg-amber-400" />
                </div>
                <span className="font-mono text-[11px] font-bold text-amber-400">🔥 84/100</span>
              </div>

              {/* Reddit */}
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <svg className="h-4 w-4 text-[#ff4500]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">Reddit</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[78%] rounded-full bg-emerald-500" />
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-400">🔥 78/100</span>
              </div>
            </div>

            {/* Score dial + label */}
            <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <ScoreCounter target={91} />
              <div>
                <p className="text-sm font-semibold text-white">Top score this run</p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  Your Twitter post is primed to spread — bold hook, zero filler, quotable close.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['Hook', 'Concise', 'Relatable'].map(t => (
                    <span key={t} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violet-400">{t}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Marquee */}
        <div className="relative flex w-full overflow-hidden border-y border-white/10 bg-white/[0.02] py-5 backdrop-blur-sm">
          {[0, 1].map((dup) => (
            <div key={dup} aria-hidden={dup === 1} className="animate-marquee flex shrink-0 items-center gap-10 pr-10 font-mono text-sm uppercase tracking-[0.3em] text-white/55">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="flex items-center gap-10">{item}<span className="text-[#7c3aed]">·</span></span>
              ))}
            </div>
          ))}
        </div>

        {/* Features */}
        <section id="features" className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-24 px-6 py-32 md:grid-cols-12 md:px-12">
          <div className="md:col-span-5 md:col-start-1"><FeatureCard feature={features[0]} /></div>
          <div className="md:col-span-5 md:col-start-8"><FeatureCard feature={features[1]} /></div>
          <div className="md:col-span-6 md:col-start-4"><FeatureCard feature={features[2]} /></div>
        </section>

        {/* CTA */}
        <section id="cta" className="flex flex-col items-start px-6 py-32 md:items-center md:px-12 md:text-center">
          <h2 className="max-w-[16ch] text-balance text-[clamp(48px,9vw,96px)] font-black leading-[0.95] tracking-tight">
            Ready to spread?
          </h2>
          <div className="mt-12">
            <Link href="/login" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[2px]">
              <span className="animate-border-spin absolute inset-[-100%]" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, #4c1d95 90deg, #7c3aed 180deg, #164e63 270deg, transparent 360deg)' }} />
              <span className="relative inline-flex items-center gap-3 rounded-full bg-[#0c0c0c] px-10 py-5 text-sm font-medium uppercase tracking-widest transition-colors group-hover:bg-[#141414]">
                Start creating <span className="text-[#7c3aed]">→</span>
              </span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-start justify-between gap-2 border-t border-white/10 px-6 py-8 font-mono text-xs uppercase tracking-widest text-white/35 md:flex-row md:items-center md:px-12">
          <span>Cast Wide © {new Date().getFullYear()}</span>
          <span>Your idea. Everywhere.</span>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({ feature }: { feature: { number: string; title: string; body: string } }) {
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute -left-4 -top-16 select-none text-[clamp(120px,16vw,200px)] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.09)' }}>
        {feature.number}
      </span>
      <div className="relative pt-12">
        <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{feature.title}</h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">{feature.body}</p>
      </div>
    </div>
  )
}