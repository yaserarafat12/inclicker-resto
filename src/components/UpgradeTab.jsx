// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — UpgradeTab.jsx
// Upgrade cards dengan glow system per kategori.
// ═══════════════════════════════════════════════════════

import { UPGRADES } from '../constants';
import { upgName, upgCost, fmtRp } from '../utils';

export default function UpgradeTab({ loc, money, upgrades, onBuy }) {
  return (
    <div>
      <div style={{
        fontSize: 10, color: '#252525',
        fontFamily: "'DM Mono', monospace",
        letterSpacing: 1.5, marginBottom: 14,
      }}>
        SEMUA MIN LV {loc.maxLevel} UNTUK NAIK LOKASI
      </div>

      {UPGRADES.map(u => {
        const lv   = upgrades[u.id] || 0;
        const cost = upgCost(u, lv);
        const can  = money >= cost;
        const inc  = lv ? (u.baseIncome * lv * Math.pow(1.08, lv)).toFixed(1) : null;
        const pct  = Math.min(((lv % loc.maxLevel) / loc.maxLevel) * 100, 100);

        return (
          <div
            key={u.id}
            onClick={() => can && onBuy(u.id)}
            style={{
              marginBottom: 10, borderRadius: 12, padding: '14px 16px',
              background: can
                ? `linear-gradient(135deg, ${u.glow}14 0%, #0c0c0c 100%)`
                : '#090909',
              border: `1px solid ${can ? u.glow + '66' : u.glow + '1a'}`,
              boxShadow: can
                ? `0 0 20px ${u.glow}1a, inset 0 1px 0 ${u.glow}1a`
                : 'none',
              cursor: can ? 'pointer' : 'not-allowed',
              opacity: can ? 1 : 0.42,
              transition: 'all 0.18s',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Top shimmer line saat affordable */}
            {can && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${u.glow}99, transparent)`,
                animation: 'glowPulse 2.5s ease-in-out infinite',
              }} />
            )}

            {/* Top row: icon + nama + level badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 9,
                  background: `${u.glow}18`, border: `1px solid ${u.glow}55`,
                  boxShadow: `0 0 12px ${u.glow}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {u.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: 9, color: u.glow + 'bb',
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: 1.5, marginBottom: 3,
                  }}>
                    {u.label.toUpperCase()}
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: can ? '#efefef' : '#444',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {upgName(u, lv)}
                  </div>
                </div>
              </div>

              {/* Level badge */}
              <div style={{
                padding: '3px 12px', borderRadius: 20,
                background: `${u.glow}18`, border: `1px solid ${u.glow}44`,
                fontFamily: "'DM Mono', monospace",
                fontSize: 12, fontWeight: 600,
                color: lv > 0 ? u.glow : '#252525',
                flexShrink: 0, marginLeft: 8,
              }}>
                {lv > 0 ? `Lv ${lv}` : '—'}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{
              height: 2, background: 'rgba(255,255,255,0.04)',
              borderRadius: 99, marginBottom: 10, overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, ${u.glow}88, ${u.glow})`,
                boxShadow: `0 0 6px ${u.glow}`,
                transition: 'width 0.3s ease',
              }} />
            </div>

            {/* Bottom row: income + tombol beli */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#2a2a2a', fontFamily: "'DM Mono', monospace" }}>
                {inc ? `+${inc} /s` : 'belum aktif'}
              </div>
              <div style={{
                padding: '6px 16px', borderRadius: 7,
                background: can
                  ? `linear-gradient(135deg, ${u.glow}dd, ${u.glow})`
                  : 'rgba(255,255,255,0.04)',
                color: can ? '#080808' : '#252525',
                fontFamily: "'DM Mono', monospace",
                fontSize: 12, fontWeight: 700,
                boxShadow: can ? `0 0 14px ${u.glow}66` : 'none',
                transition: 'all 0.18s',
              }}>
                {fmtRp(cost)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}