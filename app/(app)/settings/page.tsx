"use client"

import { useState } from "react"
import { toast } from "sonner"
import { User, Sliders, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PLATFORMS, type PlatformId } from "@/lib/platforms"
import { cn } from "@/lib/utils"

const TONES = [
  { id: "default", label: "Auto" },
  { id: "bold", label: "Bold" },
  { id: "casual", label: "Casual" },
  { id: "witty", label: "Witty" },
  { id: "professional", label: "Professional" },
  { id: "inspirational", label: "Inspirational" },
]

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-white/40">{description}</p>}
        </div>
      </div>
      <div className="border-t border-white/8 pt-5">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const [name, setName] = useState("Demo User")
  const [email, setEmail] = useState("judge@viralloop.app")
  const [defaults, setDefaults] = useState<PlatformId[]>(["twitter", "linkedin", "reddit"])
  const [defaultTone, setDefaultTone] = useState("default")

  function toggleDefault(id: PlatformId) {
    setDefaults((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="relative min-h-screen bg-[#080808] text-white">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#4c1d95] opacity-12 blur-[120px]" />
        <div className="absolute bottom-10 -right-10 h-[20rem] w-[20rem] rounded-full bg-[#3730a3] opacity-12 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
        <header className="mb-8">
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-white/35">
            Account
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
          <p className="mt-1 text-sm text-white/45">
            Manage your profile and default generation preferences.
          </p>
        </header>

        <div className="flex flex-col gap-5">
          {/* Profile */}
          <Section icon={User} title="Profile" description="Your display name and email address">
            <div className="mb-6 flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-violet-500/20 text-violet-300 text-base font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-sm text-white/40">{email}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-white/60">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/10 bg-white/[0.05] text-white placeholder:text-white/25 focus:border-violet-500/50 focus:ring-violet-500/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/60">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10 bg-white/[0.05] text-white placeholder:text-white/25 focus:border-violet-500/50 focus:ring-violet-500/20"
                />
              </div>
            </div>
          </Section>

          {/* Default platforms */}
          <Section
            icon={Bell}
            title="Default platforms"
            description="Pre-select these platforms each time you open the dashboard"
          >
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const Icon = p.icon
                const active = defaults.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleDefault(p.id)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                      active
                        ? "border-violet-500/50 bg-violet-500/15 text-white shadow-[0_0_10px_rgba(124,58,237,0.18)]"
                        : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/20 hover:text-white/75",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active && p.accent)} />
                    {p.name}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Default tone */}
          <Section
            icon={Sliders}
            title="Default tone"
            description="Applied automatically when generating new content"
          >
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDefaultTone(t.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                    defaultTone === t.id
                      ? "border-violet-500/50 bg-violet-500/15 text-white shadow-[0_0_10px_rgba(124,58,237,0.18)]"
                      : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/20 hover:text-white/75",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Section>

          <div className="flex justify-end">
            <Button
              onClick={() => toast.success("Settings saved")}
              className="bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_16px_rgba(124,58,237,0.3)]"
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
