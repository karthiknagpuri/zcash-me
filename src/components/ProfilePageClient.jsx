"use client";

import { useEffect, useMemo, useState } from "react";
import useProfiles from "../hooks/useProfiles";
import { useFeedback } from "../hooks/useFeedback";
import ProfileCard from "./ProfileCard";
import ProfileCardPassport from "./ProfileCardPassport";
import ProfileHeader from "./ProfileHeader";
import ZcashFeedback from "../ZcashFeedback";
import computeGoodThru from "../utils/computeGoodThru";
import AvatarController from "./AvatarController";

export default function ProfilePageClient({ profile }) {
  const { setSelectedAddress } = useFeedback();
  const [showController, setShowController] = useState(false);
  useProfiles(profile ? [profile] : [], false);

  useEffect(() => {
    if (profile?.address) {
      setSelectedAddress(profile.address);
    }
  }, [profile?.address, setSelectedAddress]);

  // Dynamic tab title and favicon based on profile
  useEffect(() => {
    if (!profile) return;

    // Store original values
    const originalTitle = document.title;
    const originalFavicon = document.querySelector("link[rel='icon']")?.href || "/favicon.ico";

    // Update title to profile display name or username
    const displayName = profile.display_name || profile.name || "Profile";
    document.title = `${displayName} | Zcash.me`;

    // Update favicon if profile has an avatar (circular)
    if (profile.profile_image_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Create a circular favicon using canvas
        const size = 64; // favicon size
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Draw circular clipping mask
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw the image
        ctx.drawImage(img, 0, 0, size, size);

        // Set the favicon
        let faviconLink = document.querySelector("link[rel='icon']");
        if (!faviconLink) {
          faviconLink = document.createElement("link");
          faviconLink.rel = "icon";
          document.head.appendChild(faviconLink);
        }
        faviconLink.href = canvas.toDataURL("image/png");
      };
      img.src = profile.profile_image_url;
    }

    // Cleanup: restore original title and favicon when leaving the page
    return () => {
      document.title = originalTitle;
      const faviconLink = document.querySelector("link[rel='icon']");
      if (faviconLink) {
        faviconLink.href = originalFavicon;
      }
    };
  }, [profile]);

  const selectedProfile = useMemo(() => {
    if (!profile) return null;
    const joinedAt = profile.joined_at || profile.created_at || profile.since || null;
    const good_thru = computeGoodThru(joinedAt, profile.last_signed_at);
    return { ...profile, good_thru };
  }, [profile]);

  if (!selectedProfile) return null;

  return (
    <div className="relative max-w-md mx-auto px-4 pb-24 pt-24">
      <ProfileHeader />
      <ProfileCardPassport
        key={selectedProfile.address}
        profile={selectedProfile}
        variant="passport-stamp-name"
      />
      <ZcashFeedback />

      {/* Avatar Controller Toggle */}
      <button
        onClick={() => setShowController(!showController)}
        className="fixed bottom-4 left-4 bg-[#1a1a1a] border-2 border-[#f5c542] text-[#f5c542] px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#f5c542] hover:text-[#1a1a1a] transition-colors z-50"
      >
        {showController ? '✕ Close' : '⚙️ Avatar'}
      </button>

      {showController && <AvatarController onClose={() => setShowController(false)} />}
    </div>
  );
}
