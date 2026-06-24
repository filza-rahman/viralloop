import Link from 'next/link'

const tickerItems = ['Twitter', 'LinkedIn', 'Reddit', 'Go Viral']

const features = [
  {
    number: '01',
    title: 'One idea in.',
    body: 'Drop a single thought, a rough note, or a half-finished sentence. ViralLoop reads the intent and the angle, not just the words.',
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

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white selection:bg-[#4c1d95] selection:text-white">
      {/* Drifting gradient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-blob-1 absolute -top-32 -left-24 h-[44rem] w-[44rem] rounded-full bg-[#4c1d95] opacity-40 blur-[120px]" />
        <div className="animate-blob-2 absolute top-1/3 -right-32 h-[40rem] w-[40rem] rounded-full bg-[#3730a3] opacity-40 blur-[120px]" />
        <div className="animate-blob-3 absolute -bottom-40 left-1/4 h-[38rem] w-[38rem] rounded-full bg-[#164e63] opacity-40 blur-[120px]" />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        {/* Nav */}
        <header className="flex items-center justify-between px-6 py-7 md:px-12">
          <span className="text-sm font-medium uppercase tracking-[0.25em]">
            Viral<span className="text-white/40">Loop</span>
          </span>
          <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest text-white/45 md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Process
            </a>
            <a href="#cta" className="transition-colors hover:text-white">
              Start
            </a>
          </nav>
        </header>

        {/* Hero — offset left, not centered */}
        <section className="flex min-h-[88vh] flex-col justify-center px-6 md:px-12">
          <p className="animate-fade-up mb-8 font-mono text-xs uppercase tracking-[0.3em] text-white/40 [animation-delay:0.05s]">
            AI Social Content Engine
          </p>
          <h1 className="max-w-[14ch] text-[clamp(64px,12vw,120px)] leading-[0.92] tracking-tight">
            <span className="animate-fade-up block font-thin text-white/85 [animation-delay:0.15s]">
              Your idea.
            </span>
            <span
              className="animate-fade-up block font-black text-white [animation-delay:0.3s]"
              style={{ textShadow: '0 0 45px rgba(124, 58, 237, 0.75)' }}
            >
              Everywhere.
            </span>
          </h1>
          <p className="animate-fade-up ml-1 mt-10 max-w-[400px] text-left text-sm leading-relaxed text-white/45 [animation-delay:0.45s]">
            ViralLoop turns a single thought into platform-fluent posts built to
            travel. Write once — show up natively across every feed that
            matters.
          </p>
        </section>

        {/* Marquee strip */}
        <div className="relative flex w-full overflow-hidden border-y border-white/10 bg-white/[0.02] py-5 backdrop-blur-sm">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1}
              className="animate-marquee flex shrink-0 items-center gap-10 pr-10 font-mono text-sm uppercase tracking-[0.3em] text-white/55"
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="flex items-center gap-10">
                  {item}
                  <span className="text-[#7c3aed]">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Features — asymmetric grid with huge outline numbers */}
        <section
          id="features"
          className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-24 px-6 py-32 md:grid-cols-12 md:px-12"
        >
          <div className="md:col-span-5 md:col-start-1">
            <FeatureCard feature={features[0]} />
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <FeatureCard feature={features[1]} />
          </div>
          <div className="md:col-span-6 md:col-start-4">
            <FeatureCard feature={features[2]} />
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="flex flex-col items-start px-6 py-32 md:items-center md:px-12 md:text-center"
        >
          <h2 className="max-w-[16ch] text-balance text-[clamp(48px,9vw,96px)] font-black leading-[0.95] tracking-tight">
            Ready to spread?
          </h2>
        <div className="mt-12">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[2px]"
            >
              {/* Rotating conic-gradient border */}
              <span
                className="animate-border-spin absolute inset-[-100%]"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, #4c1d95 90deg, #7c3aed 180deg, #164e63 270deg, transparent 360deg)',
                }}
              />
              <span className="relative inline-flex items-center gap-3 rounded-full bg-[#0c0c0c] px-10 py-5 text-sm font-medium uppercase tracking-widest transition-colors group-hover:bg-[#141414]">
                Start creating
                <span aria-hidden className="text-[#7c3aed]">
                  →
                </span>
              </span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-start justify-between gap-2 border-t border-white/10 px-6 py-8 font-mono text-xs uppercase tracking-widest text-white/35 md:flex-row md:items-center md:px-12">
          <span>ViralLoop © {new Date().getFullYear()}</span>
          <span>Your idea. Everywhere.</span>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({
  feature,
}: {
  feature: { number: string; title: string; body: string }
}) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-16 select-none text-[clamp(120px,16vw,200px)] font-black leading-none tracking-tighter text-transparent"
        style={{ WebkitTextStroke: '1px rgba(255,255,255,0.09)' }}
      >
        {feature.number}
      </span>
      <div className="relative pt-12">
        <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {feature.title}
        </h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/45">
          {feature.body}
        </p>
      </div>
    </div>
  )
}
