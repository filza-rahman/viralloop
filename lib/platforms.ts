import {
  LinkedInIcon,
  RedditIcon,
  XIcon,
  type BrandIcon,
} from "@/components/icons/brand-icons"

export type PlatformId = "twitter" | "linkedin" | "reddit"

export type Platform = {
  id: PlatformId
  name: string
  icon: BrandIcon
  /** Tailwind text color class for the platform accent */
  accent: string
  blurb: string
}

export const PLATFORMS: Platform[] = [
  {
    id: "twitter",
    name: "Twitter / X",
    icon: XIcon,
    accent: "text-sky-400",
    blurb: "Punchy, thread-ready, hook-first",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: LinkedInIcon,
    accent: "text-blue-400",
    blurb: "Professional, story-driven, value-led",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: RedditIcon,
    accent: "text-orange-400",
    blurb: "Authentic, community-native, no fluff",
  },
]

export function getPlatform(id: PlatformId): Platform {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]
}

export type PlatformResult = {
  platform: PlatformId
  content: string
  score: number
  explanation: string
}

export type Generation = {
  id: string
  idea: string
  createdAt: string
  platforms: PlatformId[]
  results: PlatformResult[]
}
