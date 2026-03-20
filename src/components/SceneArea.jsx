// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — SceneArea.jsx
// Background lokasi + tap zone + animasi steam + float text
// ═══════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';
import { fmtRp } from '../utils';

// ── Steam icon di atas wajan ────────────────────────────
function SteamIcon({ accent, tapping }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      {/* Steam lines */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 3, height: 18, alignItems: 'flex-end' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 2,
            height: `${12 + i * 3}px`,
            background: `linear-gradient(to top, ${accent}cc, transparent)`,
            borderRadius: 99,
            animation: `steam 1.6s ease-in-out ${i * 0.25}s infinite`,
          }} />
        ))}
      </div>
      {/* Icon */}
      <div style={{
        fontSize: 54,
        filter: `drop-shadow(0 0 18px ${accent}99)`,
        transform: tapping ? 'scale(1.22) rotate(-8deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.08s cubic-bezier(.36,.07,.19,.97)',
        lineHeight: 1,
        display: 'block',
      }}>
        🍛
      </div>
      <div style={{
        marginTop: 6,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 11, letterSpacing: 4,
        color: tapping ? accent : 'rgba(255,255,255,0.25)',
        transition: 'color 0.1s',
        textShadow: tapping ? `0 0 10px ${accent}` : 'none',
      }}>
        TAP!
      </div>
    </div>
  );
}

// ── Float text +Rp ──────────────────────────────────────
function FloatText({ floats, accent }) {
  return (
    <>
      {floats.map(f => (
        <div key={f.id} style={{
          position: 'absolute', left: f.x, top: f.y,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22, letterSpacing: 1.5,
          color: accent,
          textShadow: `0 0 14px ${accent}cc, 0 2px 4px rgba(0,0,0,0.8)`,
          animation: 'floatUp 0.9s ease-out forwards',
          pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 50,
        }}>
          +{fmtRp(f.val)}
        </div>
      ))}
    </>
  );
}

// ── Main SceneArea ──────────────────────────────────────
export default function SceneArea({ loc, money, ips, ti, tapCount, playerName, rushActive, onTap }) {
  const [tapping,  setTapping]  = useState(false);
  const [floats,   setFloats]   = useState([]);
  const [ripples,  setRipples]  = useState([]);
  const fidRef = useRef(0);
  const ridRef = useRef(0);
  const wrapRef = useRef(null);

  const handleTap = useCallback((e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    const cx = e.clientX - (rect?.left || 0);
    const cy = e.clientY - (rect?.top  || 0);

    const fid = fidRef.current++;
    const rid = ridRef.current++;

    setFloats(f => [...f, { id: fid, val: ti, x: cx - 30, y: cy - 50 }]);
    setTimeout(() => setFloats(f => f.filter(i => i.id !== fid)), 900);

    setRipples(r => [...r, { id: rid, x: cx, y: cy }]);
    setTimeout(() => setRipples(r => r.filter(i => i.id !== rid)), 500);

    setTapping(true);
    setTimeout(() => setTapping(false), 90);
    onTap();
  }, [ti, onTap]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Scene image zone (background lokasi) ── */}
      <div
        onClick={handleTap}
        style={{
          height: 280,
          // TODO: ganti dengan import gambar dari src/assets/backgrounds/
          // background: `url(${bgImage}) center/cover`,
          background: rushActive
            ? `linear-gradient(160deg, ${loc.accent}33, ${loc.dim})`
            : `linear-gradient(160deg, ${loc.dim}, #030303)`,
          cursor: 'pointer',
          position: 'relative',
          userSelect: 'none', WebkitUserSelect: 'none',
          transition: 'background 0.5s',
        }}
      >
        {/* Bottom fade into tap zone */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 140,
          background: 'linear-gradient(to top, #000000ee 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Location badge top-left */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <div style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 4,
            border: `1px solid ${loc.accent}88`, background: `${loc.accent}18`,
            fontSize: 9, fontWeight: 700, color: loc.accent,
            fontFamily: "'DM Mono', monospace", letterSpacing: 2.5,
          }}>
            {loc.tag}
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginTop: 5,
            fontFamily: "'DM Sans', sans-serif", letterSpacing: -0.3,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}>
            {loc.name}
          </div>
        </div>

        {/* Money top-right */}
        <div style={{ position: 'absolute', top: 14, right: 14, textAlign: 'right' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28, letterSpacing: 1, color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}>
            {fmtRp(money)}
          </div>
          <div style={{
            fontSize: 10, color: ips > 0 ? loc.accent : '#2a2a2a',
            fontFamily: "'DM Mono', monospace",
          }}>
            {ips > 0 ? `+${fmtRp(ips)}/s` : 'idle...'}
          </div>
        </div>

        {/* Ripples */}
        {ripples.map(r => (
          <div key={r.id} style={{
            position: 'absolute', left: r.x - 50, top: r.y - 50,
            width: 100, height: 100, borderRadius: '50%',
            border: `1.5px solid ${loc.accent}88`,
            animation: 'rippleOut 0.5s ease-out forwards',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Float texts */}
        <FloatText floats={floats} accent={loc.accent} />
      </div>

      {/* ── Tap zone (strip bawah) ── */}
      <div
        onClick={handleTap}
        style={{
          height: 100,
          background: `linear-gradient(135deg, ${loc.dim}f0 0%, #060606 100%)`,
          borderTop: `1px solid ${loc.accent}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', cursor: 'pointer',
          userSelect: 'none', WebkitUserSelect: 'none',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${loc.accent}0c, transparent)`,
          pointerEvents: 'none',
        }} />

        {/* Tap count */}
        <div>
          <div style={{ fontSize: 9, color: '#2a2a2a', fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 4 }}>
            TOTAL TAPS
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>
            {tapCount.toLocaleString()}
          </div>
        </div>

        {/* Center icon */}
        <SteamIcon tapping={tapping} accent={loc.accent} />

        {/* Per tap value */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: '#2a2a2a', fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 4 }}>
            PER TAP
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 22, color: loc.accent, letterSpacing: 1,
            textShadow: `0 0 12px ${loc.accent}88`,
          }}>
            +{fmtRp(ti)}
          </div>
        </div>
      </div>
    </div>
  );
}