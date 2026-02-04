"use client"

import { useState } from "react"
import { Share2, MoreVertical, QrCode, Copy, Award, Info, Check, AlertTriangle, Globe, Twitter, Linkedin, Instagram } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
interface Location {
  city: string
  country: string
}

interface SocialLink {
  id: number
  label: string
  url: string
  is_verified: boolean
}

interface ProfileCardProps {
  id: number
  address: string
  name: string
  displayName?: string
  bio?: string
  profileImageUrl?: string
  createdAt: string
  lastVerifiedAt?: string
  status: string
  featured?: boolean
  verified?: boolean
  addressVerified?: boolean
  location?: Location
  awards?: string[]
  socialLinks?: SocialLink[]
  variant?: "passport-stamp-name" | "passport-stamp-name-black" | "passport-stamp-name-white" | "passport-stamp-name-yellow"
}

// Passport Stamp SVG Component
const PassportStamp = ({ size = 80 }: { size?: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="stamp-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
      </defs>
      <g opacity="0.6">
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="2 4"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 3"
        />
        <path
          d="M 60 95 L 85 120 L 140 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="100"
          y="35"
          textAnchor="middle"
          fill="currentColor"
          fontSize="14"
          fontWeight="600"
          letterSpacing="2"
        >
          VERIFIED USER
        </text>
        <text
          x="100"
          y="175"
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          fontWeight="400"
          letterSpacing="1"
        >
          OCT 2025
        </text>
      </g>
    </svg>
  )
}

// Single Profile Card Component
function ProfileCard({
  id,
  address,
  name,
  displayName,
  bio,
  profileImageUrl,
  createdAt,
  lastVerifiedAt,
  featured = false,
  verified = false,
  addressVerified = false,
  location,
  awards = [],
  socialLinks = [],
  variant = "passport-stamp-name",
}: ProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showNameWarning, setShowNameWarning] = useState(false)
  const [showAwards, setShowAwards] = useState(false)

  const createdDate = new Date(createdAt)
  const month = createdDate.toLocaleString("en-US", { month: "short" })
  const year = createdDate.getFullYear()

  const isLightVariant = variant === "passport-stamp-name-white" || variant === "passport-stamp-name-yellow"
  const isDarkVariant = variant === "passport-stamp-name" || variant === "passport-stamp-name-black"

  const getBackgroundClass = () => {
    switch (variant) {
      case "passport-stamp-name":
        return "bg-gradient-to-br from-rose-900 via-pink-900 to-rose-950"
      case "passport-stamp-name-black":
        return "bg-black"
      case "passport-stamp-name-white":
        return "bg-white"
      case "passport-stamp-name-yellow":
        return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600"
      default:
        return "bg-gradient-to-br from-rose-900 via-pink-900 to-rose-950"
    }
  }

  const getTextColor = () => {
    return isLightVariant ? "text-gray-900" : "text-white"
  }

  const getMutedTextColor = () => {
    return isLightVariant ? "text-gray-600" : "text-gray-300"
  }

  const getIconButtonStyles = () => {
    return isLightVariant
      ? "hover:bg-gray-200 text-gray-600"
      : "hover:bg-white/10 text-gray-300"
  }

  const getBadgeStyles = () => {
    return isLightVariant
      ? "bg-white/50 text-gray-900 border-gray-300"
      : "bg-white/10 text-white border-white/20"
  }

  const getSocialIcon = (url: string) => {
    if (url.includes("twitter.com") || url.includes("x.com")) return Twitter
    if (url.includes("linkedin.com")) return Linkedin
    if (url.includes("instagram.com")) return Instagram
    return Globe
  }

  const truncateAddress = (addr: string) => {
    if (addr.length <= 30) return addr
    return `${addr.substring(0, 12)}...${addr.substring(addr.length - 8)}`
  }

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name}'s Profile`,
        text: `Check out ${name}'s profile`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="relative w-[350px] flex items-center justify-center">
      {/* Passport Stamp Overlay - positioned on pfp and name */}
      {addressVerified && !isFlipped && (
        <div className="absolute z-30 pointer-events-none" style={{ top: "10%", right: "30%" }}>
          <div style={{ width: "100px", height: "100px" }}>
            <PassportStamp size={100} />
          </div>
        </div>
      )}

      {/* Card Container with flip */}
      <div
        className="relative w-full h-[500px] cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 rounded-3xl shadow-2xl overflow-hidden ${getBackgroundClass()}`}
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative h-full p-5 flex flex-col">
            {/* Awards Section - scrolls horizontally behind profile picture */}
            {awards.length > 0 && showAwards && verified && (
              <div className="absolute top-8 left-0 right-0 z-0 pointer-events-none h-6 flex items-center overflow-hidden">
                <div className="relative w-full h-full">
                  <div className="flex gap-2 animate-scroll-left-smooth absolute" style={{ right: 0 }}>
                    {awards.map((award, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-full whitespace-nowrap flex-shrink-0 ${isLightVariant ? "bg-gray-300/80 text-gray-700" : "bg-white/10 text-white/70"}`}
                      >
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Header - Profile (non-featured), Share, Menu */}
            <div className="flex justify-between items-start">
              <div className="flex-1" />
              {!featured && (
                <div className="relative w-24 h-24 flex items-center justify-center">
                  {verified && <div className="absolute w-28 h-28 rounded-full bg-emerald-500" />}
                  <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl">
                    {profileImageUrl ? (
                      <img src={profileImageUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${getBackgroundClass()}`}>
                        <span className={`text-3xl font-bold ${getTextColor()}`}>
                          {name[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    shareAddress()
                  }}
                  className={`p-2 rounded-full transition-colors ${getIconButtonStyles()}`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className={`p-2 rounded-full transition-colors ${getIconButtonStyles()}`}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem>
                      <QrCode className="w-4 h-4 mr-2" />
                      View QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAwards(!showAwards)}>
                      <Award className="w-4 h-4 mr-2" />
                      {showAwards ? "Hide Awards" : "Show Awards"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Name Section */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h1
                  className={`text-3xl font-bold italic ${getTextColor()}`}
                  style={{ fontFamily: "var(--font-exposure), 'Playfair Display', serif" }}
                >
                  {displayName || name}
                </h1>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowNameWarning(!showNameWarning)
                  }}
                  className={`p-0.5 rounded-full transition-opacity opacity-0 hover:opacity-100 ${getIconButtonStyles()}`}
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
              {showNameWarning && (
                <p className={`text-[10px] mt-0.5 ${getMutedTextColor()}`}>Name can be impersonated</p>
              )}
              <div className={`flex items-center gap-2 flex-wrap ${getMutedTextColor()} text-sm font-mono`}>
                <span>/{name}</span>
                {location && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{location.city}, {location.country}</span>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {bio && <p className={`mt-3 text-sm leading-relaxed ${getMutedTextColor()}`}>{bio}</p>}

            {/* Address Verification Status */}
            {lastVerifiedAt && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className={`text-xs ${getMutedTextColor()}`}>This address was recently active.</span>
                <button className={`text-xs underline hover:no-underline ${getMutedTextColor()}`}>More</button>
              </div>
            )}

            <div className={`h-px my-4 ${isLightVariant ? "bg-gray-300" : "bg-white/20"}`} />

            {/* Address */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${isLightVariant ? "bg-white/50" : "bg-white/5"}`}>
              <span className={`text-xs font-mono ${getTextColor()}`}>{truncateAddress(address)}</span>
              <div className="flex items-center gap-2">
                <button className={`p-1 rounded ${getIconButtonStyles()}`}>
                  <QrCode className="w-4 h-4" />
                </button>
                <button className={`p-1 rounded ${getIconButtonStyles()}`}>
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-4 space-y-2">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.url)
                  return (
                    <div key={link.id} className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${getMutedTextColor()}`} />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm hover:underline ${getMutedTextColor()}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.label}
                      </a>
                      {link.is_verified ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex-1" />

            {/* Badges at bottom */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {featured && (
                <span className={`px-3 py-1 text-xs font-mono border rounded-full ${getBadgeStyles()}`}>ALPHA USER</span>
              )}
              <span className={`px-3 py-1 text-xs font-mono border rounded-full ${getBadgeStyles()}`}>#{id}</span>
              <span className={`text-xs ${getMutedTextColor()}`}>Joined {month} {year}</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 rounded-3xl shadow-2xl overflow-hidden ${getBackgroundClass()}`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative h-full p-8 flex flex-col items-center justify-center">
            <div className="w-48 h-48 mb-4">
              <QrCode className={`w-full h-full ${getTextColor()}`} />
            </div>
            <p className={`text-sm text-center ${getMutedTextColor()}`}>
              Scan to view profile
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Component - 4 Card Collection
export function PassportCardCollection() {
  const userData = {
    id: 475,
    address:
      "u1ws7nfhsfqnsm4gvk3kh0w85wrqgtx7xssxrrsw7jkyztwtd59czfr5de5avjfmscnl4sm7rtn33ntnnxam6avryaej73wurdj3epq0yyu3jm6hlylmpc083yywtj2f0z8mtmwxc4dk98rxgkjn3z92yzxtzdguvm7axhzj7hcuglzthy",
    name: "blazeyoru",
    displayName: "blazeyoru",
    bio: "Crypto enthusiast. Privacy advocate. Early Zcash adopter exploring decentralized finance.",
    profileImageUrl:
      "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/475_zmp.png",
    createdAt: "2025-10-16T15:54:43.962+00:00",
    lastVerifiedAt: "2025-10-20T10:00:00.000+00:00",
    status: "unclaimed",
    featured: false,
    verified: true,
    addressVerified: true,
    location: { city: "San Francisco", country: "USA" },
    awards: ["Early Adopter", "Privacy Champion", "DeFi Pioneer", "Community Leader"],
    socialLinks: [
      {
        id: 499,
        label: "blazeyoru",
        url: "https://x.com/blazeyoru",
        is_verified: true,
      },
      {
        id: 500,
        label: "blazeyoru",
        url: "https://www.linkedin.com/in/blazeyoru",
        is_verified: false,
      },
      {
        id: 501,
        label: "blazeyoru",
        url: "https://instagram.com/blazeyoru",
        is_verified: false,
      },
      {
        id: 502,
        label: "blazeyoru.crypto",
        url: "https://blazeyoru.crypto",
        is_verified: true,
      },
    ],
  }

  const variants = [
    "passport-stamp-name",
    "passport-stamp-name-black",
    "passport-stamp-name-white",
    "passport-stamp-name-yellow",
  ] as const

  return (
    <div className="flex flex-wrap justify-center gap-10">
      {variants.map((variant) => (
        <ProfileCard key={variant} {...userData} variant={variant} />
      ))}
    </div>
  )
}
