// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — ContentTabs.jsx
// Tab Menu dan tab Cerita.
// Export: ContentTabs.Menu dan ContentTabs.Cerita
// ═══════════════════════════════════════════════════════

import { MENUS, CHAPTERS } from '../constants';
import { fmtRp } from '../utils';

// ── Tab Menu ────────────────────────────────────────────
function Menu({ loc, tl }) {
  const unlocked = MENUS.filter(m => tl >= m.unlock).length;

  return (
    <div>
      <div style={{
        fontSize: 10, color: '#252525',
        fontFamily: "'DM Mono', monospace",
        letterSpacing: 1.5, marginBottom: 14,
      }}>
        {unlocked}/{MENUS.length} MENU AKTIF
      </div>

      {MENUS.map(m => {
        const locked = tl < m.unlock;
        return (
          <div key={m.id} style={{
            display: 'flex', gap: 12, alignItems: 'center',
            padding: '12px 14px', marginBottom: 8, borderRadius: 10,
            background: locked ? '#080808' : 'rgba(255,255,255,0.025)',
            border: `1px solid ${locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
            opacity: locked ? 0.3 : 1,
            transition: 'all 0.2s',
          }}>
            {/* Emoji icon */}
            <div style={{
              fontSize: 24, width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)', borderRadius: 9,
              flexShrink: 0,
            }}>
              {locked ? '🔒' : m.emoji}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: locked ? '#333' : '#e5e5e5',
                marginBottom: 2,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {locked ? `Unlock level ${m.unlock}` : m.name}
              </div>
              {!locked && (
                <div style={{ fontSize: 11, color: '#3a3a3a', lineHeight: 1.4 }}>
                  {m.desc}
                </div>
              )}
            </div>

            {/* Harga */}
            {!locked && (
              <div style={{
                fontSize: 12, fontFamily: "'DM Mono', monospace",
                color: loc.accent, fontWeight: 600, flexShrink: 0,
              }}>
                {fmtRp(m.price)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab Cerita ──────────────────────────────────────────
function Cerita({ loc, tl, onOpenChapter }) {
  const unlocked = CHAPTERS.filter(c => tl >= c.unlock).length;

  return (
    <div>
      <div style={{
        fontSize: 10, color: '#252525',
        fontFamily: "'DM Mono', monospace",
        letterSpacing: 1.5, marginBottom: 14,
      }}>
        {unlocked}/{CHAPTERS.length} BAB TERBUKA
      </div>

      {CHAPTERS.map(c => {
        const locked = tl < c.unlock;
        return (
          <div
            key={c.id}
            onClick={() => !locked && onOpenChapter && onOpenChapter(c.id)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px', marginBottom: 8, borderRadius: 10,
              background: locked ? '#080808' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
              opacity: locked ? 0.3 : 1,
              cursor: locked ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div>
              <div style={{
                fontSize: 9, color: '#252525',
                fontFamily: "'DM Mono', monospace",
                letterSpacing: 1.5, marginBottom: 3,
              }}>
                {c.sub.toUpperCase()}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: locked ? '#333' : '#e5e5e5',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {locked ? '???' : c.title}
              </div>
            </div>

            <div style={{
              fontSize: 11, fontFamily: "'DM Mono', monospace",
              color: locked ? '#1a1a1a' : loc.accent,
              marginLeft: 12, flexShrink: 0,
            }}>
              {locked ? `lv ${c.unlock}` : 'baca →'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Export sebagai namespace object
const ContentTabs = { Menu, Cerita };
export default ContentTabs;