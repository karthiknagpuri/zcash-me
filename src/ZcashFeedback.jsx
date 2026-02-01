// ZcashFeedback.jsx with unified visual wrapper
import React, { useEffect } from "react";
import { useFeedback } from "./hooks/useFeedback";
import useFeedbackEvents from "./hooks/useFeedbackEvents";
import { ZcashFeedbackDraft, ZcashFeedbackVerify } from "./feedback";

function ZcashCardWrapper({ title, children }) {
  return (
    <div className="p-0 mt-4 bg-transparent shadow-none border-none rounded-none">
      <h3 className="font-semibold text-[#faf6ed] mb-2">{title}</h3>
      {children}
    </div>
  );
}

export default function ZcashFeedback() {
  const {
  mode,
  setMode,
  setForceShowQR,
} = useFeedback();
  useFeedbackEvents();

  useEffect(() => {
    console.log("ZcashFeedback mounted, mode:", mode);
  }, [mode]);

  useEffect(() => {
  const handler = () => {
    setMode("note");
    setForceShowQR(false);
  };
  window.addEventListener("forceFeedbackNoteMode", handler);
  return () => window.removeEventListener("forceFeedbackNoteMode", handler);
}, [setMode, setForceShowQR]);


  return (
    <>

      <div id="zcash-feedback" className="border-t border-[#faf6ed]/20 mt-6 pt-4 text-center">
        <div className="w-full flex justify-center bg-transparent border-none shadow-none">
          <div className="w-full max-w-sm mt-[-9px]">
            {mode === "signin" ? (
<ZcashCardWrapper
  title={
    <div
      className="
        w-full
        border
        rounded-xl
        px-3
        py-2
        bg-transparent
        text-center
        border-[#f5c542]/50
      "
      style={{ lineHeight: "1.2" }}
    >
      <div className="font-semibold text-sm text-[#faf6ed] flex items-center justify-center gap-1">
        Request One-Time Passcode (OTP)
      </div>

      <div className="text-xs text-[#faf6ed]/60 mt-1 font-light">
        to verify address and apply edits
      </div>
    </div>
  }
>
  <ZcashFeedbackVerify />
</ZcashCardWrapper>

            ) : (
              <ZcashCardWrapper>
                <ZcashFeedbackDraft />
              </ZcashCardWrapper>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
