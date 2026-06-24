"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { PLATFORMS, type PlatformId } from "@/lib/platforms"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [name, setName] = useState("Ava Reyes")
  const [email, setEmail] = useState("ava@viralloop.app")
  const [defaults, setDefaults] = useState<PlatformId[]>([
    "twitter",
    "linkedin",
    "reddit",
  ])

  function toggleDefault(id: PlatformId) {
    setDefaults((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and default generation preferences.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <h2 className="text-base font-semibold">Profile</h2>
          <Separator className="my-5" />
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/15 text-primary text-base font-semibold">
                AV
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium"
              >
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-semibold">Default platforms</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pre-select these platforms each time you open the dashboard.
          </p>
          <Separator className="my-5" />
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
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary/40 bg-primary/15 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && p.accent)} />
                  {p.name}
                </button>
              )
            })}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Settings saved")}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
