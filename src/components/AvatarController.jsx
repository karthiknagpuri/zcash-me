"use client";

import { useState, useEffect } from "react";

export default function AvatarController({ onClose }) {
  const [settings, setSettings] = useState({
    x: 345,
    y: 286,
    size: 1843,
    scale: 1.26,
    rotation: -7,
  });

  // Apply settings to SVG in real-time
  useEffect(() => {
    const svgImg = document.querySelector('[data-active-profile] img');
    if (!svgImg) return;

    // Create a modified SVG URL with updated viewBox and transform
    const originalSrc = svgImg.getAttribute('src');
    if (!originalSrc || !originalSrc.endsWith('.svg')) return;

    // Fetch and modify the SVG
    fetch(originalSrc)
      .then(res => res.text())
      .then(svgText => {
        // Update viewBox
        let modified = svgText.replace(
          /viewBox="[^"]*"/,
          `viewBox="${settings.x} ${settings.y} ${settings.size} ${settings.size}"`
        );
        // Update transform
        modified = modified.replace(
          /translate\(1024, 1024\) rotate\([^)]*\) scale\([^)]*\)/,
          `translate(1024, 1024) rotate(${settings.rotation}) scale(${settings.scale})`
        );

        // Create blob URL
        const blob = new Blob([modified], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        svgImg.src = url;
      });
  }, [settings]);

  const updateSetting = (key, delta) => {
    setSettings(prev => ({
      ...prev,
      [key]: Math.round((prev[key] + delta) * 100) / 100
    }));
  };

  const copySettings = () => {
    const code = `viewBox="${settings.x} ${settings.y} ${settings.size} ${settings.size}"
transform="translate(1024, 1024) rotate(${settings.rotation}) scale(${settings.scale}) translate(-1024, -1024)"`;
    navigator.clipboard.writeText(code);
    alert('Settings copied!\n\n' + code);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-[#1a1a1a] border-2 border-[#f5c542] rounded-xl p-4 shadow-2xl z-50 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#f5c542] font-bold text-sm">Avatar Controller</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white text-lg">✕</button>
      </div>

      {/* X Position */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>X (← Left / Right →)</span>
          <span>{settings.x}px</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => updateSetting('x', -50)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">←50</button>
          <button onClick={() => updateSetting('x', -10)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">←10</button>
          <button onClick={() => updateSetting('x', 10)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">10→</button>
          <button onClick={() => updateSetting('x', 50)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">50→</button>
        </div>
      </div>

      {/* Y Position */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Y (↑ Up / Down ↓)</span>
          <span>{settings.y}px</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => updateSetting('y', -50)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">↑50</button>
          <button onClick={() => updateSetting('y', -10)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">↑10</button>
          <button onClick={() => updateSetting('y', 10)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">10↓</button>
          <button onClick={() => updateSetting('y', 50)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">50↓</button>
        </div>
      </div>

      {/* Scale */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Scale (Size)</span>
          <span>{settings.scale.toFixed(2)}x</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => updateSetting('scale', -0.1)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">−0.1</button>
          <button onClick={() => updateSetting('scale', -0.02)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">−0.02</button>
          <button onClick={() => updateSetting('scale', 0.02)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">+0.02</button>
          <button onClick={() => updateSetting('scale', 0.1)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">+0.1</button>
        </div>
      </div>

      {/* Rotation */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Rotation (Tilt)</span>
          <span>{settings.rotation}°</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => updateSetting('rotation', -5)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">↺5°</button>
          <button onClick={() => updateSetting('rotation', -1)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">↺1°</button>
          <button onClick={() => updateSetting('rotation', 1)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">1°↻</button>
          <button onClick={() => updateSetting('rotation', 5)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">5°↻</button>
        </div>
      </div>

      {/* ViewBox Size */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Zoom (ViewBox)</span>
          <span>{settings.size}px</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => updateSetting('size', -100)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">+Zoom</button>
          <button onClick={() => updateSetting('size', -20)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">+20</button>
          <button onClick={() => updateSetting('size', 20)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">−20</button>
          <button onClick={() => updateSetting('size', 100)} className="flex-1 bg-[#333] hover:bg-[#444] text-white py-1.5 rounded text-xs">−Zoom</button>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={copySettings}
        className="w-full bg-[#f5c542] hover:bg-[#f5c542]/80 text-[#1a1a1a] font-bold py-2 rounded-lg text-sm"
      >
        📋 Copy Settings
      </button>

      <p className="text-white/40 text-[10px] mt-2 text-center">
        Adjust then copy to update the SVG file
      </p>
    </div>
  );
}
