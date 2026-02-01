"use client"

import { useState, useEffect } from "react"
import {
  Twitter,
  Linkedin,
  Check,
  MoreHorizontal,
  QrCode,
  Copy,
  Share,
  Instagram,
  Globe,
  AlertTriangle,
  Pencil,
  ArrowLeft,
  Info,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import ProfileAvatar from "./ProfileAvatar"
import ProfileEditor from "./ProfileEditor"
import { extractDomain, betweenTwoPeriods } from "../utils/domainParsing.js"
import { KNOWN_DOMAINS, FALLBACK_ICON } from "../utils/domainLabels.js"
import { getSocialHandle } from "../utils/linkUtils"

// Passport Stamp with date
const PassportStamp = ({ size = 100, date, opacity = 0.7 }) => {
  const formattedDate = date ? new Date(date) : new Date()
  const month = formattedDate.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const year = formattedDate.getFullYear()

  const stampColor = "rgba(52, 211, 153, 0.6)"

  return (
    <div className="flex-shrink-0" style={{ transform: "rotate(-15deg)" }}>
      <svg width={size} height={size} viewBox="0 0 140 140" fill="none" style={{ opacity }}>
        <defs>
          <path id="topCurve" d="M 30,70 A 40,40 0 0,1 110,70" fill="none" />
          <path id="bottomCurve" d="M 110,70 A 40,40 0 0,1 30,70" fill="none" />
        </defs>

        {/* Outer circle */}
        <circle cx="70" cy="70" r="65" stroke={stampColor} strokeWidth="3" fill="none" strokeDasharray="4 2" />
        <circle cx="70" cy="70" r="55" stroke={stampColor} strokeWidth="2" fill="none" />

        {/* Center circle background */}
        <circle cx="70" cy="70" r="30" fill={stampColor} fillOpacity="0.15" />

        {/* Verified User text curved around top */}
        <text fill={stampColor} fontSize="11" fontWeight="700" letterSpacing="2">
          <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
            Verified User
          </textPath>
        </text>

        {/* Date curved around bottom */}
        <text fill={stampColor} fontSize="8" fontWeight="500" letterSpacing="0.5">
          <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
            {month} {year}
          </textPath>
        </text>

        {/* Center checkmark */}
        <circle cx="70" cy="70" r="18" fill={stampColor} fillOpacity="0.15" />
        <path
          d="M 60 70 L 66 76 L 80 62"
          stroke={stampColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

// Enrich link with icon and label
function enrichLink(link) {
  const domain = extractDomain(link.url)
  const dbLabel = (link.label || "").trim()
  const handle = getSocialHandle(link.url || "")
  const normalizedDomain = (domain || "").toLowerCase()
  const normalizedHandle = (handle || "").toLowerCase()
  const normalizedLabel = dbLabel.toLowerCase()
  const isHandleDomain =
    normalizedHandle === normalizedDomain ||
    normalizedHandle === `www.${normalizedDomain}`
  const domainLabel = (KNOWN_DOMAINS[domain]?.label || "").toLowerCase()
  const shouldUseHandle =
    !!handle &&
    !isHandleDomain &&
    (!dbLabel ||
      normalizedLabel === normalizedDomain ||
      normalizedLabel === `www.${normalizedDomain}` ||
      normalizedLabel === domainLabel ||
      normalizedLabel.startsWith(`${normalizedDomain}/`) ||
      normalizedLabel.startsWith(`www.${normalizedDomain}/`))

  if (KNOWN_DOMAINS[domain]) {
    return {
      ...link,
      label: (shouldUseHandle ? handle : dbLabel) || KNOWN_DOMAINS[domain].label,
      icon: KNOWN_DOMAINS[domain].icon,
    }
  }

  return {
    ...link,
    label:
      (shouldUseHandle ? handle : dbLabel) ||
      betweenTwoPeriods(domain) ||
      "Unknown",
    icon: FALLBACK_ICON,
  }
}

export default function ProfileCardPassport({ profile, variant = "passport-stamp-name-crimson" }) {
  const [copied, setCopied] = useState(false)
  const [showAwards, setShowAwards] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [linksArray, setLinksArray] = useState([])
  const [isFlipped, setIsFlipped] = useState(false)

  // Listen for edit mode events
  useEffect(() => {
    const handleEnterSignIn = () => setIsFlipped(true)
    const handleEnterDraft = () => setIsFlipped(false)

    window.addEventListener("enterSignInMode", handleEnterSignIn)
    window.addEventListener("enterDraftMode", handleEnterDraft)
    return () => {
      window.removeEventListener("enterSignInMode", handleEnterSignIn)
      window.removeEventListener("enterDraftMode", handleEnterDraft)
    }
  }, [])

  const handleEditProfile = () => {
    setIsFlipped(true)
    window.dispatchEvent(new CustomEvent("enterSignInMode", {
      detail: {
        zId: profile.id,
        address: profile.address || "",
        name: profile.name || "",
        verified: !!profile.address_verified
      }
    }))
  }

  const handleBackToFront = () => {
    window.skipZcashFeedbackScroll = true
    setIsFlipped(false)
    window.dispatchEvent(new CustomEvent("enterDraftMode"))
    window.dispatchEvent(new CustomEvent("forceFeedbackNoteMode"))
  }

  const address = profile.address || ""
  const name = profile.name || ""
  const displayName = profile.display_name || name
  const bio = profile.bio || ""
  const addressVerified = !!profile.address_verified
  const featured = !!profile.featured
  const id = profile.id
  const location = profile.location || null

  // Parse links
  useEffect(() => {
    let rawLinks = []
    if (Array.isArray(profile.links)) rawLinks = profile.links
    else if (typeof profile.links_json === "string") {
      try {
        rawLinks = JSON.parse(profile.links_json)
      } catch {
        rawLinks = []
      }
    } else if (Array.isArray(profile.links_json)) {
      rawLinks = profile.links_json
    }
    setLinksArray(rawLinks.map(enrichLink))
  }, [profile])

  // Fetch live links from Supabase
  useEffect(() => {
    if (!profile?.id) return
    let isMounted = true

    import("../supabase").then(async ({ supabase }) => {
      const { data, error } = await supabase
        .from("zcasher_links")
        .select("id,label,url,is_verified")
        .eq("zcasher_id", profile.id)
        .order("id", { ascending: true })

      if (error) {
        console.error("Error fetching links:", error)
        return
      }
      if (Array.isArray(data) && isMounted) setLinksArray(data.map(enrichLink))
    })
    return () => {
      isMounted = false
    }
  }, [profile?.id])

  const createdAt = profile.joined_at || profile.created_at || profile.since || new Date().toISOString()
  const lastVerifiedAt = profile.last_verified_at || profile.last_signed_at || createdAt
  const formattedDate = new Date(createdAt)
  const month = formattedDate.toLocaleString("en-US", { month: "short" })
  const year = formattedDate.getFullYear()

  const truncatedAddress = address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ""

  const copyAddress = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareProfile = async () => {
    const slug = (displayName || name).normalize("NFKC").trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
    const url = `${window.location.origin}/${addressVerified ? slug : `${slug}-${id}`}`
    try {
      if (navigator.share) {
        await navigator.share({ title: `${displayName} on Zcash.me`, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
        } catch {
          // Silent fail
        }
      }
    }
  }

  // Awards
  const awards = []
  if (profile.rank_alltime > 0) awards.push(`#${profile.rank_alltime} All Time`)
  if (profile.rank_monthly > 0) awards.push(`#${profile.rank_monthly} Monthly`)
  if (profile.rank_weekly > 0) awards.push(`#${profile.rank_weekly} Weekly`)
  if (profile.rank_daily > 0) awards.push(`#${profile.rank_daily} Daily`)

  // Background styles based on variant
  const getBackgroundStyles = () => {
    switch (variant) {
      case "passport-stamp-name-crimson":
        return "bg-gradient-to-br from-red-900 via-rose-900 to-red-950"
      case "passport-stamp-name-navy":
        return "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950"
      case "passport-stamp-name-emerald":
        return "bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950"
      case "passport-stamp-name-gold":
        return "bg-gradient-to-br from-amber-800 via-yellow-700 to-amber-900"
      case "passport-stamp-name-purple":
        return "bg-gradient-to-br from-purple-900 via-violet-900 to-purple-950"
      case "passport-stamp-name-ocean":
        return "bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950"
      default:
        return "bg-gradient-to-br from-red-900 via-rose-900 to-red-950"
    }
  }

  // Mesh overlay for depth
  const getMeshOverlay = () => (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-30%,rgba(244,63,94,0.2),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_100%,rgba(153,27,27,0.3),transparent)]" />
    </>
  )

  // Noise texture
  const noiseTexture = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }

  // Get social icon
  const getSocialIcon = (url) => {
    if (!url) return <Globe className="w-4 h-4" />
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes("x.com") || lowerUrl.includes("twitter")) return <Twitter className="w-4 h-4" />
    if (lowerUrl.includes("linkedin")) return <Linkedin className="w-4 h-4" />
    if (lowerUrl.includes("instagram")) return <Instagram className="w-4 h-4" />
    return <Globe className="w-4 h-4" />
  }

  // Filter social links
  const xLink = linksArray.find((link) => link.url?.includes("x.com") || link.url?.includes("twitter.com"))
  const linkedinLink = linksArray.find((link) => link.url?.includes("linkedin.com"))
  const instagramLink = linksArray.find((link) => link.url?.includes("instagram.com"))
  const websiteLink = linksArray.find((link) =>
    !link.url?.includes("x.com") &&
    !link.url?.includes("twitter.com") &&
    !link.url?.includes("linkedin.com") &&
    !link.url?.includes("instagram.com")
  )

  return (
    <div className="relative w-full max-w-[350px] mx-auto" style={{ perspective: "1000px" }}>
      {/* Passport Stamp Overlay - positioned on name area */}
      {addressVerified && (
        <div className="absolute z-30 pointer-events-none" style={{ top: "10%", right: "25%" }}>
          <PassportStamp size={100} date={lastVerifiedAt} opacity={0.8} />
        </div>
      )}

      {/* Card Container with flip */}
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          aspectRatio: "0.72",
        }}
      >
        {/* Front Side */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden shadow-xl ${getBackgroundStyles()}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {getMeshOverlay()}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={noiseTexture}
          />

          <div className="relative h-full p-5 flex flex-col">
            {/* Header - Profile, Share, Menu in row */}
            <div className="flex justify-between items-start">
              <div className="flex-1" />

              <div className="flex items-center gap-1">
                {/* Profile Picture */}
                <div className="mr-1">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    {addressVerified && <div className="absolute w-14 h-14 rounded-full bg-emerald-500" />}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-xl">
                      <ProfileAvatar
                        profile={profile}
                        size={48}
                        imageClassName="object-cover w-full h-full"
                        showFallbackIcon
                      />
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={shareProfile}
                  className="p-2 rounded-full transition-colors text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Share className="w-4 h-4" />
                </button>

                {/* Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full transition-colors text-white/70 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleEditProfile}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyAddress}>
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Copied!" : "Copy Address"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowQR(!showQR)}>
                      <QrCode className="w-4 h-4 mr-2" />
                      {showQR ? "Hide QR" : "Show QR"}
                    </DropdownMenuItem>
                    {awards.length > 0 && (
                      <DropdownMenuItem onClick={() => setShowAwards(!showAwards)}>
                        <MoreHorizontal className="w-4 h-4 mr-2" />
                        {showAwards ? "Hide Awards" : "Show Awards"}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Name & Handle */}
            <div className="mt-3">
              <h1
                className="text-3xl font-bold italic text-white"
                style={{ fontFamily: "var(--font-exposure), 'Playfair Display', serif" }}
              >
                {displayName}
              </h1>
              <div className="flex items-center gap-2 flex-wrap text-white/70 text-sm font-mono">
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
            {bio && <p className="mt-2 text-sm leading-relaxed text-white/70">{bio}</p>}

            {/* Address Activity Status */}
            {addressVerified && (
              <div className="mt-2">
                <p className="flex items-center gap-2 text-xs text-white/70">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  This address was recently active.
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="underline hover:no-underline"
                  >
                    {showMore ? "Hide" : "More"}
                  </button>
                </p>
                {showMore && (
                  <div className="flex items-center gap-2 p-2 rounded-lg text-xs mt-1 bg-white/10 text-white/80">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Authenticated links help confirm address belongs to same person</span>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="my-3 border-t border-dashed border-white/25" />

            {/* QR Code */}
            {showQR && address && (
              <div className="flex justify-center mb-4 p-4 rounded-lg bg-white/10">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeSVG value={address} size={150} />
                </div>
              </div>
            )}

            {/* Wallet Address - 3D Depth */}
            {address && (
              <div
                className="flex items-center justify-between p-3 rounded-xl bg-black/15 backdrop-blur-sm"
                style={{
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)",
                }}
              >
                <span className="text-sm font-mono text-white">{truncatedAddress}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="p-1.5 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={copyAddress}
                    className="p-1.5 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Social Links - Vertical */}
            <div className="flex flex-col gap-2 mt-3">
              {xLink && (
                <a
                  href={xLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:underline"
                >
                  <Twitter className="w-4 h-4" />
                  <span>@{xLink.label}</span>
                  {xLink.is_verified ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                </a>
              )}
              {linkedinLink && (
                <a
                  href={linkedinLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:underline"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>{linkedinLink.label}</span>
                  {linkedinLink.is_verified ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                </a>
              )}
              {instagramLink && (
                <a
                  href={instagramLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:underline"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{instagramLink.label}</span>
                  {instagramLink.is_verified ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                </a>
              )}
              {websiteLink && (
                <a
                  href={websiteLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/70 hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  <span>{websiteLink.label}</span>
                  {websiteLink.is_verified ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                </a>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Badges at bottom */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="px-3 py-1 text-xs font-mono border rounded-full border-white/40 text-white bg-white/10">
                #{id}
              </span>
              <span className="text-xs text-white/70">Joined {month} {year}</span>
            </div>
          </div>
        </div>

        {/* Back Side (Edit Mode) */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden shadow-xl ${getBackgroundStyles()}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {getMeshOverlay()}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={noiseTexture}
          />

          <div className="relative h-full flex flex-col">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 pb-2">
              <button
                onClick={handleBackToFront}
                className="p-1.5 rounded-full transition-colors text-white/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-semibold text-white">Edit Profile</h2>
              <div className="w-7" />
            </div>

            {/* Scrollable Profile Editor */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <ProfileEditor profile={profile} links={linksArray} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
