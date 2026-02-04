"use client"

import { useState } from "react"

// Types for the component
// Passport Stamp SVG Component
const PassportStamp = ({ size = 80 }) => {
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

// Icons
const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
)

const QrCodeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="3" height="3" />
    <rect x="18" y="14" width="3" height="3" />
    <rect x="14" y="18" width="3" height="3" />
    <rect x="18" y="18" width="3" height="3" />
  </svg>
)

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const WarningIcon = () => (
  <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
)

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

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
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showNameWarning, setShowNameWarning] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const createdDate = new Date(createdAt)
  const month = createdDate.toLocaleString("en-US", { month: "short" })
  const year = createdDate.getFullYear()

  const isLightVariant = variant === "passport-stamp-name-white" || variant === "passport-stamp-name-yellow"

  const getBackgroundClass = () => {
    switch (variant) {
      case "passport-stamp-name":
        return "bg-[#7c2d3a]"
      case "passport-stamp-name-black":
        return "bg-black"
      case "passport-stamp-name-white":
        return "bg-white"
      case "passport-stamp-name-yellow":
        return "bg-[#f5c542]"
      default:
        return "bg-[#7c2d3a]"
    }
  }

  const getTextColor = () => isLightVariant ? "text-gray-900" : "text-white"
  const getMutedTextColor = () => isLightVariant ? "text-gray-600" : "text-gray-300"
  const getIconButtonStyles = () => isLightVariant ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-300"
  const getBadgeStyles = () => isLightVariant ? "bg-white/50 text-gray-900 border-gray-300" : "bg-white/10 text-white border-white/20"

  const getSocialIcon = (url) => {
    if (url.includes("twitter.com") || url.includes("x.com")) return <TwitterIcon />
    if (url.includes("linkedin.com")) return <LinkedinIcon />
    return <GlobeIcon />
  }

  const truncateAddress = (addr) => {
    if (addr.length <= 30) return addr
    return `${addr.substring(0, 12)}...${addr.substring(addr.length - 8)}`
  }

  return (
    <div className="relative w-[350px] flex items-center justify-center">
      {/* Passport Stamp Overlay */}
      {addressVerified && !isFlipped && (
        <div className="absolute z-30 pointer-events-none" style={{ top: "10%", right: "25%" }}>
          <div className={`${isLightVariant ? 'text-emerald-600' : 'text-emerald-400'}`}>
            <PassportStamp size={100} />
          </div>
        </div>
      )}

      {/* Card Container with flip */}
      <div
        className="relative w-full h-[520px] cursor-pointer"
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
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative h-full p-5 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1" />
              {!featured && (
                <div className="relative w-24 h-24 flex items-center justify-center">
                  {verified && <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20" />}
                  <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl ring-2 ring-white/20">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt={name} className="w-full h-full object-cover" />
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
                  onClick={(e) => e.stopPropagation()}
                  className={`p-2 rounded-full transition-colors ${getIconButtonStyles()}`}
                >
                  <ShareIcon />
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                    className={`p-2 rounded-full transition-colors ${getIconButtonStyles()}`}
                  >
                    <MenuIcon />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border z-50 min-w-[150px]">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <QrCodeIcon /> View QR Code
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <CopyIcon /> Copy Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Name Section */}
            <div className="mt-4">
              <h1 className={`text-3xl font-bold ${getTextColor()}`}>
                {displayName || name}
              </h1>
              <div className={`flex items-center gap-2 flex-wrap ${getMutedTextColor()} text-sm font-mono mt-1`}>
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

            {/* Verification Status */}
            {lastVerifiedAt && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className={`text-xs ${getMutedTextColor()}`}>This address was recently active.</span>
              </div>
            )}

            <div className={`h-px my-4 ${isLightVariant ? "bg-gray-300" : "bg-white/20"}`} />

            {/* Address */}
            <div className={`flex items-center justify-between p-3 rounded-xl ${isLightVariant ? "bg-gray-100" : "bg-white/5"}`}>
              <span className={`text-xs font-mono ${getTextColor()}`}>{truncateAddress(address)}</span>
              <div className="flex items-center gap-2">
                <button className={`p-1.5 rounded-lg ${getIconButtonStyles()}`}>
                  <QrCodeIcon />
                </button>
                <button className={`p-1.5 rounded-lg ${getIconButtonStyles()}`}>
                  <CopyIcon />
                </button>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-4 space-y-2">
                {socialLinks.slice(0, 3).map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <span className={getMutedTextColor()}>{getSocialIcon(link.url)}</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm hover:underline ${getMutedTextColor()}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.label}
                    </a>
                    {link.is_verified ? <CheckIcon /> : <WarningIcon />}
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1" />

            {/* Badges */}
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
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="relative h-full p-8 flex flex-col items-center justify-center">
            <div className={`w-48 h-48 mb-4 ${getTextColor()}`}>
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" />
                <rect x="18" y="14" width="3" height="3" />
                <rect x="14" y="18" width="3" height="3" />
                <rect x="18" y="18" width="3" height="3" />
              </svg>
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

// Main Page Component
export default function DesignsPage() {
  const userData = {
    id: 475,
    address: "u1ws7nfhsfqnsm4gvk3kh0w85wrqgtx7xssxrrsw7jkyztwtd59czfr5de5avjfmscnl4sm7rtn33ntnnxam6avryaej73wurdj3epq0yyu3jm6hlylmpc083yywtj2f0z8mtmwxc4dk98rxgkjn3z92yzxtzdguvm7axhzj7hcuglzthy",
    name: "blazeyoru",
    displayName: "blazeyoru",
    bio: "Crypto enthusiast. Privacy advocate. Early Zcash adopter exploring decentralized finance.",
    profileImageUrl: "https://fpwrazvgrmatlajjzdiq.supabase.co/storage/v1/object/public/zcashme/avatars/475_zmp.png",
    createdAt: "2025-10-16T15:54:43.962+00:00",
    lastVerifiedAt: "2025-10-20T10:00:00.000+00:00",
    status: "unclaimed",
    featured: false,
    verified: true,
    addressVerified: true,
    location: { city: "San Francisco", country: "USA" },
    awards: ["Early Adopter", "Privacy Champion", "DeFi Pioneer"],
    socialLinks: [
      { id: 499, label: "blazeyoru", url: "https://x.com/blazeyoru", is_verified: true },
      { id: 500, label: "blazeyoru", url: "https://www.linkedin.com/in/blazeyoru", is_verified: false },
      { id: 502, label: "blazeyoru.crypto", url: "https://blazeyoru.crypto", is_verified: true },
    ],
  }

  const variants = [
    "passport-stamp-name",
    "passport-stamp-name-black",
    "passport-stamp-name-white",
    "passport-stamp-name-yellow",
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-4">Profile Card Designs</h1>
        <p className="text-gray-400 text-center mb-12">Passport-style profile cards with flip animation</p>

        <div className="flex flex-wrap justify-center gap-8">
          {variants.map((variant) => (
            <ProfileCard key={variant} {...userData} variant={variant} />
          ))}
        </div>
      </div>
    </div>
  )
}
