import React, { useState, useMemo, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useFeedback } from "../hooks/useFeedback";
import useFeedbackController from "../hooks/useFeedbackController";
import AmountAndWallet from "../components/AmountAndWallet.jsx";
import HelpMessage from "../components/HelpMessage.jsx";
import { cachedProfiles } from "../hooks/useProfiles";
import QrUriBlock from "../components/QrUriBlock";
import ProfileSearchDropdown from "../components/ProfileSearchDropdown";

function MemoCounter({ text }) {
  const bytes = useMemo(() => new TextEncoder().encode(text || "").length, [text]);
  const over = bytes > 512;
  const diff = over ? bytes - 512 : 512 - bytes;

  return (
    <span className={`absolute bottom-2 right-2 text-xs ${over ? "text-red-400" : "text-[#faf6ed]/40"}`}>
      {over ? `Over by ${diff} bytes` : `${diff} bytes left`}
    </span>
  );
}

export default function ZcashFeedbackDraft() {
  const { selectedAddress, setSelectedAddress, forceShowQR } = useFeedback();
  const { uri, memo, amount, openWallet, setDraftMemo, setDraftAmount } =
    useFeedbackController();

  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (cachedProfiles || []).filter(
      (p) => p.name?.toLowerCase().includes(q) || p.address?.includes(q)
    );
  }, [search]);

  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    setSearch("");
    setShowList(false);
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [memo]);

  const disabled = selectedAddress?.startsWith("t");
  const safeProfiles = Array.isArray(cachedProfiles) ? cachedProfiles : [];
  const recipientProfile = safeProfiles.find(
    (p) => p.address === selectedAddress
  );
  const recipientName =
    recipientProfile?.display_name || recipientProfile?.name || "Recipient";

useEffect(() => {
  if (!forceShowQR) return;
  setTimeout(() => {
    const el = document.getElementById("zcash-feedback");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
}, [forceShowQR]);

  return (
    <div className="bg-transparent border-none shadow-none p-0 -mt-4">

      {/* HEADER ROW: Recipient + Search */}
      <div className="flex justify-between items-center relative mb-3">

        {/* Left side */}
        <div className="text-sm text-[#faf6ed]/70 flex items-center gap-1">
          <span>To</span>
          <span
            className="text-[#f5c542] font-medium cursor-pointer hover:underline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {recipientName}
          </span>
        </div>

        {/* Right side: Search */}
        <div className="relative">
          {/* Search icon */}
          {!isFocused && (
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#faf6ed]/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}

          {isFocused && (
            <button
              onClick={() => {
                setIsFocused(false);
                setSearch("");
                setShowList(false);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#faf6ed]/40 hover:text-[#f5c542]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* search input */}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowList(true);
            }}
            onFocus={() => {
              setShowList(true);
              setIsFocused(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setSearch("");
                setShowList(false);
              }, 150);
            }}
            placeholder={isFocused ? "search..." : ""}
            className={`h-8 border border-[#faf6ed]/20 bg-transparent rounded-lg transition-all duration-150 text-[#faf6ed] text-sm ${
              isFocused
                ? "w-32 px-8 placeholder:text-[#faf6ed]/30"
                : "w-8 text-center cursor-pointer"
            }`}
          />

          {showList && search && (
            <div className="absolute top-full right-0 z-50 w-48 mt-1">
              <ProfileSearchDropdown
                listOnly={true}
                value={search}
                onChange={(v) => {
                  if (typeof v === "object") {
                    handleSelect(v.address);
                  } else {
                    setSearch(v);
                  }
                }}
                profiles={filtered}
                placeholder="name or addr"
              />
            </div>
          )}
        </div>
      </div>

      {/* MEMO FIELD */}
      <div className="relative mb-2">
        {!disabled && (
          <div className="absolute left-3 top-2 pointer-events-none text-[#f5c542] text-sm">
            ✎
          </div>
        )}

        <textarea
          ref={textareaRef}
          rows={2}
          value={memo}
          disabled={disabled}
          onChange={(e) => {
            const el = e.target;
            setDraftMemo(el.value);
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
          placeholder={
            disabled
              ? "Memos are not supported for transparent addresses"
              : `Write your message to ${recipientName} here...`
          }
          className={`border border-[#f5c542]/50 bg-[#1a1a1a] px-3 py-2 rounded-xl w-full text-sm resize-none pr-7 text-[#faf6ed] placeholder-[#faf6ed]/40 ${
            disabled
              ? "bg-[#1a1a1a]/50 text-[#faf6ed]/40 cursor-not-allowed"
              : "focus:ring-1 focus:ring-[#f5c542] pl-8"
          }`}
        />

        {memo && !disabled && (
          <button
            onClick={() => setDraftMemo("")}
            className="absolute right-3 top-1 text-[#faf6ed]/40 hover:text-[#f5c542]"
          >
            ⌫
          </button>
        )}

        <MemoCounter text={memo} />
      </div>

      {/* AMOUNT + WALLET */}
      <AmountAndWallet
        amount={amount}
        setAmount={setDraftAmount}
        openWallet={openWallet}
        showOpenWallet={false}
        showUsdPill
        showRateMessage
      />

      {/* Divider line like Verify */}
      <div className="border-t border-[#faf6ed]/20 my-3"></div>

      <HelpMessage />

      {/* QR / URI BLOCK */}
      <div className="-mt-4">
        <QrUriBlock
          uri={uri}
          profileName={
            recipientProfile?.display_name ||
            recipientProfile?.name ||
            "recipient"
          }
          forceShowQR={forceShowQR}
        />
      </div>
    </div>
  );
}
