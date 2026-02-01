"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileSearchDropdown from "./ProfileSearchDropdown";
import useProfiles from "../hooks/useProfiles";
import { useFeedback } from "../hooks/useFeedback";
import AddUserForm from "../AddUserForm";

const normalizeSlug = (value = "") =>
  value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");

const buildSlug = (profile) => {
  if (!profile?.name) return "";
  const base = normalizeSlug(profile.name);
  if (!base) return "";
  if (profile.slug) return profile.slug;
  return profile.address_verified ? base : `${base}-${profile.id}`;
};

export default function ProfileHeader() {
  const router = useRouter();
  const { setSelectedAddress, selectedAddress } = useFeedback();
  const { profiles, loading } = useProfiles(null, true);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [search, setSearch] = useState("");
  const [suppressDropdown, setSuppressDropdown] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const selectedProfile = profiles.find(
    (profile) => profile.address === selectedAddress
  );

  return (
    <div
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[40] w-[min(92vw,420px)]"
    >
      <div className="flex items-center bg-[#faf6ed] rounded-full border-2 border-[#f5c542] px-4 py-3 shadow-lg">
        <button
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className="font-bold text-base text-[#1a1a1a] whitespace-nowrap cursor-pointer"
        >
          Zcash.me/
        </button>
        <div className="relative flex-1">
          <input
            ref={searchInputRef}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSuppressDropdown(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = search.trim();
                if (query) {
                  router.push(`/?search=${encodeURIComponent(query)}`);
                  setSuppressDropdown(true);
                }
              }
            }}
            placeholder=""
            className="w-full px-2 py-1 text-base bg-transparent text-[#1a1a1a] placeholder-gray-400 outline-none"
          />

          {search && (
            <button
              onClick={() => {
                setSearch("");
                requestAnimationFrame(() => {
                  if (searchInputRef.current) {
                    const el = searchInputRef.current;
                    el.focus();
                    el.setSelectionRange(0, 0);
                  }
                });
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 text-lg font-semibold"
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          {search && !suppressDropdown && (
            <div ref={dropdownRef} className="absolute left-0 right-0 top-full mt-2 z-[9999]">
              <ProfileSearchDropdown
                listOnly
                value={search}
                onChange={(v) => {
                  if (typeof v === "object") {
                    window.lastSelectionWasExplicit = true;
                    const addr = v.address;
                    setSelectedAddress(addr);
                    window.dispatchEvent(
                      new CustomEvent("selectAddress", { detail: { address: addr } })
                    );
                    const slug = buildSlug(v);
                    if (slug) router.push(`/${slug}`);
                  } else {
                    setSearch(v);
                  }
                }}
                profiles={profiles}
                placeholder="search"
              />
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (selectedProfile) {
              window.dispatchEvent(
                new CustomEvent("prefillReferrer", {
                  detail: {
                    id: selectedProfile.id,
                    name: selectedProfile.name,
                    address: selectedProfile.address,
                  },
                })
              );

              window.lastReferrer = {
                id: selectedProfile.id,
                name: selectedProfile.name,
                address: selectedProfile.address,
              };
            }

            setIsJoinOpen(true);
          }}
          className="ml-2 w-10 h-10 flex items-center justify-center bg-[#f5c542] rounded-full text-[#1a1a1a] hover:bg-[#e5b532] transition-colors"
          aria-label="Join"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      <AddUserForm
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onUserAdded={() => setIsJoinOpen(false)}
      />
    </div>
  );
}
