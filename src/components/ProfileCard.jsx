"use client";

import { useState, useRef, useEffect } from "react";
import isNewProfile from "../utils/isNewProfile";
import CopyButton from "./CopyButton";
import { useFeedback } from "../hooks/useFeedback";
import VerifiedBadge from "./VerifiedBadge";
import VerifiedCardWrapper from "./VerifiedCardWrapper";
import ReferRankBadgeMulti from "./ReferRankBadgeMulti";
import ProfileEditor from "./ProfileEditor";
import ProfileAvatar from "./ProfileAvatar";
import shareIcon from "../assets/share.svg";
// --- Domain utils + favicon maps ---
import { extractDomain, betweenTwoPeriods } from "../utils/domainParsing.js";
import { KNOWN_DOMAINS, FALLBACK_ICON } from "../utils/domainLabels.js";
import { getSocialHandle } from "../utils/linkUtils";
import {
  getAuthProviderForUrl,
  getLinkAuthToken,
  isLinkAuthPending,
  appendLinkToken,
  startOAuthVerification,
} from "../utils/linkAuthFlow";
import AuthExplainerModal from "./AuthExplainerModal";

import SubmitOtp from "../SubmitOtp.jsx";
import { motion, AnimatePresence } from "framer-motion";
const Motion = motion;

function RedirectModal({ isOpen, label }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center animate-fadeIn">
        <div className="mb-4 text-blue-500">
          <svg className="w-12 h-12 mx-auto animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Redirecting to {label}</h3>
        <p className="text-sm text-gray-600">
          Please authorize the app to verify your profile.
        </p>
      </div>
    </div>
  );
}






// Caching and CDN settings
const memoryCache = new Map();

export default function ProfileCard({ profile, onSelect, warning, fullView = false }) {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [authInfoOpen, setAuthInfoOpen] = useState(false);
  const [authLink, setAuthLink] = useState(null);
  const [authRedirectOpen, setAuthRedirectOpen] = useState(false);
  const [authRedirectLabel, setAuthRedirectLabel] = useState("X.com");

  // ðŸ”— Lazy-load links from Supabase when needed
  // (linksArray state/effect is defined later; duplicate removed)

  const [showStats, setShowStats] = useState(false);
  const hasAwards =
    (profile?.rank_alltime ?? 0) > 0 ||
    (profile?.rank_weekly ?? 0) > 0 ||
    (profile?.rank_monthly ?? 0) > 0 ||
    (profile?.rank_daily ?? 0) > 0;

  const [showDetail, setShowDetail] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  // image cache and lazy load setup
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const rawUrl = profile.profile_image_url || "";
  const isTwitter = rawUrl.includes("pbs.twimg.com");

  const finalUrl = isTwitter
    ? rawUrl                          // do NOT append anything to Twitter
    : rawUrl.includes("?")
      ? rawUrl                           // already has query params â†’ leave it
      : `${rawUrl}?v=${profile.last_signed_at || profile.created_at}`;



  useEffect(() => {
    const profileId = profile?.id || null;
    const profileAddress = profile?.address || "";
    const profileName = profile?.name || "";
    const profileVerified = !!(profile?.address_verified);
    const profileSince = profile?.joined_at || profile?.created_at || profile?.since || null;

    const handleEnterSignIn = (e) => {
      setShowBack(true);

      // Forward the event payload when triggered from other sources
      if (!e?.detail && profileId && profileAddress) {
        // âœ… Guard: only dispatch if profile data is ready
        if (!profileId || !profileAddress) {
          console.warn("ProfileCard: profile not ready, skipping verify dispatch");
        } else {
          window.dispatchEvent(
            new CustomEvent("enterSignInMode", {
              detail: {
                zId: profileId,
                address: profileAddress,
                name: profileName,
                verified: profileVerified,
                since: profileSince,
              },
            })
          );

          // âœ… Cache last known payload in case event fires before listener is attached
          window.lastZcashFlipDetail = {
            zId: profileId,
            address: profileAddress,
            name: profileName,
            verified: profileVerified,
            since: profileSince,
          };
        }
      }
    };

    const handleEnterDraft = () => {
      setShowBack(false);
    };
    // window.addEventListener("enterSignInMode", e => {
    //  console.log("ENTER-SIGNIN fired with:", e.detail);
    // });

    window.addEventListener("enterSignInMode", handleEnterSignIn);
    window.addEventListener("enterDraftMode", handleEnterDraft);
    return () => {
      window.removeEventListener("enterSignInMode", handleEnterSignIn);
      window.removeEventListener("enterDraftMode", handleEnterDraft);
    };
  }, [profile?.id, profile?.address, profile?.name, profile?.joined_at, profile?.created_at, profile?.since, profile?.address_verified]);

  // Auto-flip disabled: keep ProfileCard visible after auth return.



  useEffect(() => {
    // Always make visible for fullView or if already cached
    if (fullView || memoryCache.has(finalUrl)) {
      setVisible(true);
      return;
    }

    // Ensure we have a ref
    const el = imgRef.current;
    if (!el || !finalUrl) {
      setVisible(true); // fallback: always show
      return;
    }

    // Fallback if browser doesn't support IntersectionObserver
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Lazy-load observer
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            memoryCache.set(finalUrl, true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "200px", threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [finalUrl, fullView]);

  useEffect(() => {
    // Always make visible for fullView or if already cached
    if (fullView || memoryCache.has(finalUrl)) {
      setVisible(true);
      return;
    }
  }, [finalUrl, fullView]);



  const { setSelectedAddress, setForceShowQR, pendingEdits, setPendingEdits } = useFeedback();

  // Derive trust states (consistent with verified badge logic)
  const verifiedAddress = !!profile.address_verified || !!profile.verified;

  const verifiedLinks =
    (typeof profile.verified_links === "number"
      ? profile.verified_links
      : (typeof profile.verified_links_count === "number"
        ? profile.verified_links_count
        : null)) ??
    (profile.links?.filter((l) => l.is_verified).length || 0);

  const hasVerifiedContent = verifiedAddress || verifiedLinks > 0;
  const isVerified = hasVerifiedContent;
  const canAuthenticateLinks = !!profile.address_verified;
  const selectedAuthProvider = authLink ? getAuthProviderForUrl(authLink.url) : null;
  const authToken = authLink ? getLinkAuthToken(authLink) : null;
  const authPending = authToken && isLinkAuthPending(pendingEdits, authToken);

  const handleAuthBadgeClick = (event, link) => {
    event.stopPropagation();
    if (!link || link.is_verified) return;
    setAuthLink(link);
    setAuthInfoOpen(true);
  };

  const handleAuthenticateLink = () => {
    if (!authLink) return;
    if (!canAuthenticateLinks) return;
    if (selectedAuthProvider) {
      startOAuthVerification({
        providerKey: selectedAuthProvider.key,
        profile,
        url: authLink.url,
        setShowRedirect: setAuthRedirectOpen,
        setRedirectLabel: setAuthRedirectLabel,
      });
      return;
    }
    if (!authToken || authPending) return;
    appendLinkToken(pendingEdits, setPendingEdits, authToken);
    setAuthInfoOpen(false);
  };



  // --- Local favicon + label resolver ---
  function enrichLink(link) {
    const domain = extractDomain(link.url);
    const dbLabel = (link.label || "").trim();
    const handle = getSocialHandle(link.url || "");
    const normalizedDomain = (domain || "").toLowerCase();
    const normalizedHandle = (handle || "").toLowerCase();
    const normalizedLabel = dbLabel.toLowerCase();
    const isHandleDomain =
      normalizedHandle === normalizedDomain ||
      normalizedHandle === `www.${normalizedDomain}`;
    const domainLabel = (KNOWN_DOMAINS[domain]?.label || "").toLowerCase();
    const shouldUseHandle =
      !!handle &&
      !isHandleDomain &&
      (!dbLabel ||
        normalizedLabel === normalizedDomain ||
        normalizedLabel === `www.${normalizedDomain}` ||
        normalizedLabel === domainLabel ||
        normalizedLabel.startsWith(`${normalizedDomain}/`) ||
        normalizedLabel.startsWith(`www.${normalizedDomain}/`));

    if (KNOWN_DOMAINS[domain]) {
      return {
        ...link,
        label: (shouldUseHandle ? handle : dbLabel) || KNOWN_DOMAINS[domain].label,
        icon: KNOWN_DOMAINS[domain].icon,
      };
    }

    return {
      ...link,
      label:
        (shouldUseHandle ? handle : dbLabel) ||
        betweenTwoPeriods(domain) ||
        "Unknown",
      icon: FALLBACK_ICON,
    };
  }

  const [linksArray, setLinksArray] = useState(() => {
    let rawLinks = [];
    if (Array.isArray(profile.links)) rawLinks = profile.links;
    else if (typeof profile.links_json === "string") {
      try {
        rawLinks = JSON.parse(profile.links_json);
      } catch {
        rawLinks = [];
      }
    } else if (Array.isArray(profile.links_json)) {
      rawLinks = profile.links_json;
    }
    return rawLinks.map(enrichLink);
  });

  // dY", whenever "Show Links" is opened, fetch live links from Supabase
  useEffect(() => {
    if (!profile?.id) return;
    let isMounted = true;
    setIsLoadingLinks(true);

    import("../supabase").then(async ({ supabase }) => {
      const { data, error } = await supabase
        .from("zcasher_links")
        .select("id,label,url,is_verified")
        .eq("zcasher_id", profile.id)
        .order("id", { ascending: true });

      if (error) {
        console.error("ƒ?O Error fetching links:", error);
        if (isMounted) setIsLoadingLinks(false);
        return;
      }
      if (Array.isArray(data) && isMounted) setLinksArray(data.map(enrichLink));
      if (isMounted) setIsLoadingLinks(false);
    });
    return () => {
      isMounted = false;
    };
  }, [profile?.id]);
  const totalLinks = profile.total_links ?? (Array.isArray(linksArray) ? linksArray.length : 0);



  const normalizedName = (value = "") =>
    value
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/ /g, "_");

  const formatUsername = (value = "") =>
    value.trim().replace(/\s+/g, "_");

  const cachedProfiles =
    typeof window !== "undefined" ? window.cachedProfiles : null;

  const duplicateNameCountFromProfile =
    typeof profile.duplicate_name_count === "number"
      ? profile.duplicate_name_count
      : typeof profile.name_duplicate_count === "number"
        ? profile.name_duplicate_count
        : typeof profile.duplicate_names_count === "number"
          ? profile.duplicate_names_count
          : typeof profile.name_duplicates_count === "number"
            ? profile.name_duplicates_count
            : null;

  const computedDuplicateNameCount =
    Array.isArray(cachedProfiles) && profile?.name
      ? cachedProfiles.filter(
        (p) => normalizedName(p?.name) === normalizedName(profile.name)
      ).length
      : null;

  const duplicateNameCount =
    duplicateNameCountFromProfile ?? computedDuplicateNameCount ?? 0;

  const hasDuplicateNames = duplicateNameCount > 1;

  const warningConfig = (() => {
    if (!warning) return null;
    const name = profile?.display_name || profile?.name || "This profile";
    const nameSearchUrl = profile?.name
      ? `/?search=${encodeURIComponent(profile.name)}`
      : "/";
    const hasLinks = totalLinks > 0;
    const hasAuthenticatedLinks = verifiedLinks > 0;

    if (!verifiedAddress) {
      if (!hasLinks && hasDuplicateNames) {
        return {
          tone: "red",
          summary: `⚠ ${name} may not be who you think.`,
          toggleLabel: "Warnings",
          defaultExpanded: false,
          details: [
            <>
              Multiple profiles use this{" "}
              <a
                href={nameSearchUrl}
                className="text-blue-600 hover:underline"
                onClick={(event) => {
                  if (event.button !== 0) return;
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("suppressSearchDropdown", "1");
                  }
                }}
              >
                name
              </a>
              .
            </>,
            "No links are available to verify that this address belongs to the same person.",
          ],
        };
      }

      if (!hasLinks) {
        return {
          tone: "red",
          summary: `⚠ ${name} may not be who you think.`,
          toggleLabel: "Warnings",
          details: [
            "No links are available to verify that this address belongs to the same person.",
            "Names can be impersonated.",
          ],
        };
      }

      if (hasDuplicateNames) {
        return {
          tone: "yellow",
          summary: `⚠ ${name} may not be who you think.`,
          toggleLabel: "Warnings",
          details: [
            <>
              Multiple profiles use this{" "}
              <a
                href={nameSearchUrl}
                className="text-blue-600 hover:underline"
                onClick={(event) => {
                  if (event.button !== 0) return;
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("suppressSearchDropdown", "1");
                  }
                }}
              >
                name
              </a>
              .
            </>,
            "Links are provided but their ownership has not been authenticated.",
          ],
        };
      }

      return {
        tone: "yellow",
        summary: `⚠ ${name} may not be who you think.`,
        toggleLabel: "Warnings",
        details: [
          "Links are provided but their ownership has not been authenticated.",
          "Names can be impersonated.",
        ],
      };
    }

    if (!hasLinks) {
      return {
        tone: "yellow",
        summary: "⚠ This address was recently active.",
        toggleLabel: "Warnings",
        details: [
          "No links are available to verify that this address belongs to the same person.",
          "Names can be impersonated.",
        ],
      };
    }

    if (hasAuthenticatedLinks) {
      return {
        tone: "positive",
        summary: "This address was recently active.",
        toggleLabel: "More",
        details: [
          "Authenticated links help confirm address belongs to same person.",
          "Names can be impersonated.",
        ],
      };
    }

    return {
      tone: "neutral",
      summary: "This address was recently active.",
      toggleLabel: "Caution",
      details: [
        "Links are provided to help verify identity, but ownership has not been authenticated.",
        "Names can be impersonated.",
      ],
    };
  })();

  useEffect(() => {
    if (!warningConfig) return;
    setShowDetail(!!warningConfig.defaultExpanded);
  }, [warningConfig?.summary, warningConfig?.toggleLabel, warningConfig?.tone, warningConfig?.defaultExpanded]);


  // referrals not used in this component


  let rankType = null;
  if (profile.rank_alltime > 0) rankType = "alltime";
  else if (profile.rank_weekly > 0) rankType = "weekly";
  else if (profile.rank_monthly > 0) rankType = "monthly";
  else if (profile.rank_daily > 0) rankType = "daily";


  let circleClass = "bg-blue-500"; // default = All

  if (isVerified && rankType) {
    circleClass = "bg-gradient-to-r from-green-400 to-orange-500";
  } else if (isVerified) {
    circleClass = "bg-green-500";
  } else if (rankType) {
    if (rankType === "alltime") {
      circleClass = "bg-gradient-to-r from-blue-500 to-red-500";
    } else if (rankType === "weekly") {
      circleClass = "bg-gradient-to-r from-blue-500 to-orange-500";
    } else if (rankType === "monthly") {
      circleClass = "bg-gradient-to-r from-blue-500 to-red-500";
    } else if (rankType === "daily") {
      circleClass = "bg-gradient-to-r from-blue-500 to-cyan-500";
    }
  } else {
    circleClass = "bg-blue-500";
  }






  if (!fullView) {
    // Compact card - Mini version of full profile card
    return (
      <div
        onClick={() => {
          onSelect(profile);
          requestAnimationFrame(() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          );
        }}
        className="relative pt-8 cursor-pointer group"
      >
        {/* Avatar badge - positioned half outside card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <div className={`w-14 h-14 rounded-full ${verifiedAddress ? 'ring-3 ring-[#22c55e]' : 'ring-3 ring-[#f5c542]'} overflow-hidden bg-[#1a1a1a] shadow-md group-hover:scale-105 transition-transform`}>
            <ProfileAvatar
              profile={profile}
              size={56}
              imageClassName="object-cover w-full h-full"
              showFallbackIcon
            />
          </div>
        </div>

        <div className="bg-[#faf6ed] rounded-2xl border-2 border-[#f5c542] p-3 pt-9 text-center transition-all group-hover:shadow-lg group-hover:shadow-[#f5c542]/20 group-hover:border-[#f5c542]">
          {/* Name with verified badge */}
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className="font-bold text-sm text-[#1a1a1a] truncate max-w-[120px]">
              {profile.display_name || profile.name}
            </span>
            {(profile.address_verified || (profile.verified_links_count ?? 0) > 0) && (
              <span className="w-4 h-4 bg-[#22c55e] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {isNewProfile(profile) && (
              <span className="text-[10px] bg-[#f5c542] text-[#1a1a1a] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                NEW
              </span>
            )}
          </div>

          {/* Username */}
          <p className="text-xs text-[#1a1a1a]/60 mb-2">
            @{formatUsername(profile.name)}
          </p>

          {/* Address pill */}
          {profile.address && (
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-1 bg-[#f5c542]/20 border border-[#f5c542] rounded-md px-2 py-1">
                <span className="font-mono text-[10px] text-[#1a1a1a]">
                  {profile.address.slice(0, 4)}...{profile.address.slice(-4)}
                </span>
              </div>
            </div>
          )}

          {/* Links preview */}
          {totalLinks > 0 && (
            <div className="flex justify-center gap-1">
              {linksArray.slice(0, 3).map((link) => (
                <img
                  key={link.id}
                  src={link.icon?.src || link.icon || FALLBACK_ICON?.src || FALLBACK_ICON}
                  alt=""
                  className="w-4 h-4 rounded opacity-70"
                />
              ))}
              {totalLinks > 3 && (
                <span className="text-[10px] text-[#1a1a1a]/50 flex items-center">
                  +{totalLinks - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {isOtpOpen && (
          <SubmitOtp
            isOpen={isOtpOpen}
            onClose={() => setIsOtpOpen(false)}
            profile={profile}
          />
        )}
      </div>
    );
  }

  // Parallax tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Reduced tilt intensity for smoother effect
    const tiltX = (y - centerY) / centerY * -5;
    const tiltY = (x - centerX) / centerX * 5;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  // Full card - Clean mobile-first design matching reference
  return (
    <div
      ref={cardRef}
      className="relative pt-10 mx-auto w-full max-w-sm animate-fadeIn"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar badge - positioned half outside card */}
      <div
        className="absolute top-0 left-1/2 z-10"
        style={{
          transform: `translateX(-50%) ${isHovering ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(15px)` : 'rotateX(0) rotateY(0) translateZ(0)'}`,
          transition: 'transform 0.15s ease-out'
        }}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1a1a1a] shadow-lg ring-2 ring-black">
          <ProfileAvatar
            profile={profile}
            size={80}
            imageClassName="object-cover w-full h-full"
            showFallbackIcon
            blink
            lookAround
          />
        </div>
      </div>

      <div
        className="bg-[#faf6ed] rounded-2xl border-2 border-[#f5c542] p-4 pt-12 overflow-hidden relative"
        style={{
          transform: isHovering ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'rotateX(0) rotateY(0)',
          transformStyle: 'preserve-3d',
          boxShadow: isHovering ? '0 25px 50px -12px rgba(245, 197, 66, 0.25)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease-out'
        }}
        data-active-profile
        data-address={profile.address}
      >
        {/* Top Right Action Buttons - Always visible on front */}
        {!showBack && (
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#faf6ed] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors shadow-md"
                title="Menu"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-xl border-2 border-[#f5c542] shadow-xl overflow-hidden min-w-[160px]">
                    {/* Show Awards */}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowStats(!showStats);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-[#f5c542]/20 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-[#f97316]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                      {showStats ? 'Hide Awards' : 'Show Awards'}
                    </button>

                    {/* Enter Passcode */}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsOtpOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-[#f5c542]/20 transition-colors text-left border-t border-[#e5e5e5]"
                    >
                      <svg className="w-5 h-5 text-[#1a1a1a]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Enter Passcode
                    </button>

                    {/* Edit Profile */}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowBack(true);
                        window.dispatchEvent(new CustomEvent("enterSignInMode", {
                          detail: { zId: profile.id, address: profile.address || "", name: profile.name || "", verified: !!profile.address_verified }
                        }));
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-[#f5c542]/20 transition-colors text-left border-t border-[#e5e5e5]"
                    >
                      <svg className="w-5 h-5 text-[#1a1a1a]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={async () => {
                const slug = (profile.display_name || profile.name).normalize("NFKC").trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
                const url = `${window.location.origin}/${profile.address_verified ? slug : `${slug}-${profile.id}`}`;
                try {
                  if (navigator.share) {
                    await navigator.share({ title: `${profile.display_name || profile.name} on Zcash.me`, url });
                  } else {
                    await navigator.clipboard.writeText(url);
                  }
                } catch (err) {
                  // Fallback to clipboard if share fails or is cancelled
                  if (err.name !== 'AbortError') {
                    try {
                      await navigator.clipboard.writeText(url);
                    } catch {
                      // Silent fail
                    }
                  }
                }
              }}
              className="w-8 h-8 rounded-full bg-[#22c55e] text-white flex items-center justify-center hover:bg-[#16a34a] transition-colors shadow-md"
              title="Share Profile"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        )}

        <div
          className={`relative transition-transform duration-500 transform-style-preserve-3d ${showBack ? "rotate-y-180" : ""}`}
          style={{ transformOrigin: "top center" }}
        >

          {/* FRONT SIDE */}
          <div className={`${showBack ? "absolute inset-0" : "relative"} backface-hidden w-full`}>

          {/* Shimmer animation styles */}
          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
            .shimmer-text {
              background: linear-gradient(
                90deg,
                #1a1a1a 0%,
                #1a1a1a 40%,
                #f5c542 50%,
                #1a1a1a 60%,
                #1a1a1a 100%
              );
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: shimmer 3s linear infinite;
            }
          `}</style>

          {/* Name with verified badge */}
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-[#1a1a1a] inline-flex items-center justify-center gap-1.5 max-w-full">
              <span className="truncate shimmer-text">{profile.display_name || profile.name}</span>
              {(profile.address_verified || (profile.verified_links_count ?? 0) > 0) && (
                <span className="w-5 h-5 bg-[#22c55e] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </h2>
            <p className="text-[#1a1a1a]/60 text-xs">@{formatUsername(profile.name)}</p>
          </div>

          {/* Address pill */}
          {profile.address && (
            <div className="flex justify-center mb-3">
              <div className="flex items-center gap-1.5 bg-[#f5c542]/20 border border-[#f5c542] rounded-lg px-2 py-1.5">
                <span className="font-mono text-xs text-[#1a1a1a]">
                  {profile.address.slice(0, 4)}...{profile.address.slice(-4)}
                </span>
                <CopyButton text={profile.address} label="" copiedLabel="" />
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
            {isLoadingLinks ? (
              <div className="link-tray-shimmer h-12 w-full" />
            ) : linksArray.length > 0 ? (
              <div className="divide-y divide-[#e5e5e5]">
                {linksArray.map((link) => {
                  const isDiscordLink = /^(https?:\/\/)?(www\.)?(discord\.com|discordapp\.com|discord\.gg)\//i.test(link.url || "");
                  const canLinkLeft = !(isDiscordLink && !link.is_verified);
                  return (
                    <div key={link.id} className="flex items-center justify-between px-3 py-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <img
                          src={link.icon?.src || link.icon || FALLBACK_ICON?.src || FALLBACK_ICON}
                          alt=""
                          className="w-4 h-4 rounded opacity-80 shrink-0"
                        />
                        {canLinkLeft ? (
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1a1a1a] hover:text-[#22c55e] transition-colors truncate">
                            {link.label}
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-[#1a1a1a] truncate">{link.label}</span>
                        )}
                        {link.is_verified ? (
                          <span className="w-3.5 h-3.5 bg-[#22c55e] rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ) : (
                          <button
                            onClick={(event) => handleAuthBadgeClick(event, link)}
                            className="w-3.5 h-3.5 border border-[#1a1a1a]/30 rounded-full flex items-center justify-center text-[#1a1a1a]/40 text-[10px] hover:border-[#f5c542] hover:text-[#f5c542] transition-colors shrink-0"
                          >
                            ?
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#22c55e] shrink-0">
                        <CopyButton text={link.url || link.label} label="" copiedLabel="" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-2 text-[#1a1a1a]/50 text-center text-xs">No links yet</p>
            )}
          </div>

          {/* Warning/Status */}
          {warningConfig && (
            <div className={`mt-3 text-xs rounded-lg px-3 py-1.5 border text-center ${
              warningConfig.tone === "positive"
                ? "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/30"
                : warningConfig.tone === "yellow"
                  ? "text-[#f5c542] bg-[#f5c542]/10 border-[#f5c542]/30"
                  : "text-[#1a1a1a]/70 bg-[#1a1a1a]/5 border-[#1a1a1a]/10"
            }`}>
              <span>{warningConfig.summary}</span>
              <button
                onClick={() => setShowDetail(!showDetail)}
                className="ml-1 font-semibold text-[#22c55e] hover:underline"
              >
                {showDetail ? "less" : "more"} ▼
              </button>
              {showDetail && (
                <div className="mt-1.5 text-[10px] opacity-80 space-y-0.5">
                  {warningConfig.details.map((line, i) => <div key={i}>{line}</div>)}
                </div>
              )}
            </div>
          )}


          {/* Awards Section - shown when toggled */}
          {showStats && hasAwards && (
            <div className="mt-4 bg-gradient-to-r from-[#f5c542]/10 to-[#f97316]/10 rounded-xl p-3 border border-[#f5c542]/30">
              <h3 className="text-xs font-bold text-[#1a1a1a] mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#f97316]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                Awards & Rankings
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {profile.rank_alltime > 0 && (
                  <div className="bg-white rounded-lg px-2 py-1.5 text-center">
                    <div className="text-lg font-bold text-[#f97316]">#{profile.rank_alltime}</div>
                    <div className="text-[10px] text-[#1a1a1a]/60">All Time</div>
                  </div>
                )}
                {profile.rank_monthly > 0 && (
                  <div className="bg-white rounded-lg px-2 py-1.5 text-center">
                    <div className="text-lg font-bold text-[#22c55e]">#{profile.rank_monthly}</div>
                    <div className="text-[10px] text-[#1a1a1a]/60">Monthly</div>
                  </div>
                )}
                {profile.rank_weekly > 0 && (
                  <div className="bg-white rounded-lg px-2 py-1.5 text-center">
                    <div className="text-lg font-bold text-[#3b82f6]">#{profile.rank_weekly}</div>
                    <div className="text-[10px] text-[#1a1a1a]/60">Weekly</div>
                  </div>
                )}
                {profile.rank_daily > 0 && (
                  <div className="bg-white rounded-lg px-2 py-1.5 text-center">
                    <div className="text-lg font-bold text-[#8b5cf6]">#{profile.rank_daily}</div>
                    <div className="text-[10px] text-[#1a1a1a]/60">Daily</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BACK SIDE (edit mode) */}
        <div
          className={`absolute inset-0 rotate-y-180 backface-hidden w-full ${showBack ? "relative" : ""} bg-[#faf6ed] rounded-2xl p-3 pt-10 flex flex-col items-center overflow-hidden`}
        >
          <button
            onClick={() => {
              window.skipZcashFeedbackScroll = true;
              setShowBack(false);
              window.dispatchEvent(new CustomEvent("enterDraftMode"));
              window.dispatchEvent(new CustomEvent("forceFeedbackNoteMode"));
            }}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#f5c542] text-[#1a1a1a] flex items-center justify-center hover:bg-[#e5b532] transition-colors text-sm"
          >
            ←
          </button>
          <ProfileEditor profile={profile} links={linksArray} />
        </div>

      </div>
      </div>

      <RedirectModal isOpen={authRedirectOpen} label={authRedirectLabel} />
      <AuthExplainerModal
        isOpen={authInfoOpen && !!authLink}
        canAuthenticate={canAuthenticateLinks}
        authPending={authPending}
        authRedirectOpen={authRedirectOpen}
        providerLabel={selectedAuthProvider?.label}
        onClose={() => {
          setAuthInfoOpen(false);
          setAuthLink(null);
        }}
        onAuthenticate={handleAuthenticateLink}
      />

      {isOtpOpen && (
        <SubmitOtp
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          profile={profile}
        />
      )}
    </div>
  );
}











