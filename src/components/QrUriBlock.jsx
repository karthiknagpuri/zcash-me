import React, { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrUriBlock({
  uri,
  profileName,
  forceShowQR,
  forceShowURI,
  defaultShowQR = true,
  defaultShowURI = true,
  actionButtonClassName,
  hideButtonClassName,
}) {
  const qrRef = useRef(null);
  const [showQR, setShowQR] = useState(defaultShowQR);
  const [showFull, setShowFull] = useState(defaultShowURI);

  useEffect(() => {
    if (forceShowQR) setShowQR(true);
  }, [forceShowQR]);

  useEffect(() => {
    if (forceShowURI) setShowFull(true);
  }, [forceShowURI]);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const clone = svg.cloneNode(true);
    const svgData = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const safeName = (profileName || "recipient")
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    link.download = `zcashme-${safeName}-qr.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  if (!uri) return null;

  const actionButtonClasses =
    actionButtonClassName ||
    "flex items-center gap-1 border rounded-xl px-3 py-2 text-sm transition-all duration-200 border-[#f5c542] hover:bg-[#f5c542] text-[#faf6ed] hover:text-[#1a1a1a] whitespace-nowrap";
  const hideButtonClasses =
    hideButtonClassName ||
    "flex items-center gap-1 px-3 pl-0 py-2 text-sm transition-all duration-200 text-[#faf6ed]/60 hover:text-[#f5c542] whitespace-nowrap";

  return (
    <div className="flex flex-col items-center gap-4 mt-6 animate-fadeIn">

      {/* QR block */}
      <div className="flex flex-col items-center gap-2">
        {showQR && (
          <div className="bg-white p-4 rounded-xl">
            <QRCodeSVG
              ref={qrRef}
              value={uri}
              size={200}
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#1a1a1a"
            />
          </div>
        )}
      </div>

      {/* QR + URI controls row */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        {showQR ? (
          <div className="flex items-center gap-0">
            <button
              onClick={handleSaveQR}
              className={actionButtonClasses}
            >
              {saved ? "Saved" : "Save QR"}
            </button>
            <button
              onClick={() => setShowQR(false)}
              className={hideButtonClasses}
            >
              —Hide
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowQR(true)}
            className={actionButtonClasses}
          >
            Show QR
          </button>
        )}

        {showFull ? (
          <div className="flex items-center gap-0">
            <button
              onClick={handleCopy}
              className={actionButtonClasses}
            >
              {copied ? "Copied" : "Copy URI"}
            </button>
            <button
              onClick={() => setShowFull(false)}
              className={hideButtonClasses}
            >
              —Hide
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowFull(true)}
            className={actionButtonClasses}
          >
            Show URI
          </button>
        )}
      </div>

      {/* URI block */}
      {showFull && (
        <div className="flex flex-col items-center gap-2 max-w-full px-2">
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f5c542] hover:text-[#faf6ed] underline break-all text-xs"
          >
            {uri}
          </a>
        </div>
      )}

    </div>
  );
}
