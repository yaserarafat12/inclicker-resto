// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — App.jsx
// Main state, game loop, layout utama.
// ═══════════════════════════════════════════════════════

import { BACKGROUNDS } from './assets/backgrounds/index'
import { useState, useEffect, useCallback, useRef } from 'react';
import { LOCATIONS, UPGRADES, RUSH_HOUR, COMBO } from './constants';
import {
  calcIps, calcTapIncome, calcTotalLevel, calcMinLevel,
  calcOfflineIncome, saveGame, loadGame, defaultGameState,
  fmtRp, upgCost,
} from './utils';
import SceneArea from './components/SceneArea';
import UpgradeTab from './components/UpgradeTab';
import ContentTabs from './components/ContentTabs';
import VNReader from './components/VNReader';
import OnboardingScreen from './components/OnboardingScreen';

export default function App() {
  // ── State ──────────────────────────────────────────────
  const [playerName, setPlayerName]   = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const [money,      setMoney]        = useState(500);
  const [totalEarned, setTotalEarned] = useState(500);
  const [tapCount,   setTapCount]     = useState(0);
  const [upgrades,   setUpgrades]     = useState({ alat: 0, bahan: 0, tempat: 0, nyaman: 0, visib: 0 });
  const [locIdx,     setLocIdx]       = useState(0);
  const [tab,        setTab]          = useState('upgrade');
  const [modal,      setModal]        = useState(false); // konfirmasi pindah lokasi
  const [offlineModal, setOfflineModal] = useState(null); // { earned }
  const [vnChapter,   setVnChapter]     = useState(null);

  // ── Rush hour ──────────────────────────────────────────
  const [rushActive,  setRushActive]  = useState(false);
  const [rushTimeLeft, setRushTimeLeft] = useState(0);

  // ── Combo tap ──────────────────────────────────────────
  const [comboActive,  setComboActive]  = useState(false);
  const [comboTimeLeft, setComboTimeLeft] = useState(0);
  const recentTaps = useRef([]);

  // ── Derived values ─────────────────────────────────────
  const loc      = LOCATIONS[locIdx];
  const ips      = calcIps(upgrades);
  const ti       = calcTapIncome(upgrades);
  const tl       = calcTotalLevel(upgrades);
  const ml       = calcMinLevel(upgrades);
  const canMove  = ml >= loc.maxLevel && locIdx < LOCATIONS.length - 1;
  const movePct  = Math.min((ml / loc.maxLevel) * 100, 100);
  const effectiveIps = rushActive ? ips * RUSH_HOUR.multiplier : ips;
  const effectiveTi  = (rushActive ? ti * RUSH_HOUR.multiplier : ti) * (comboActive ? COMBO.multiplier : 1);

  // ── Load save on mount ─────────────────────────────────
  useEffect(() => {
    const save = loadGame();
    if (save) {
      setPlayerName(save.playerName || '');
      setMoney(save.money || 500);
      setTotalEarned(save.totalEarned || 500);
      setTapCount(save.tapCount || 0);
      setUpgrades(save.upgrades || { alat: 0, bahan: 0, tempat: 0, nyaman: 0, visib: 0 });
      setLocIdx(save.locIdx || 0);

      // Offline income
      const offlineEarned = calcOfflineIncome(save.lastSaved, calcIps(save.upgrades || {}));
      if (offlineEarned > 100) {
        setMoney(m => m + offlineEarned);
        setTotalEarned(e => e + offlineEarned);
        setOfflineModal({ earned: offlineEarned });
      }

      if (!save.playerName) setShowNameInput(true);
    } else {
      setShowNameInput(true);
    }
  }, []);

  // ── Auto save setiap 10 detik ──────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      saveGame({ playerName, money, totalEarned, tapCount, upgrades, locIdx });
    }, 10000);
    return () => clearInterval(t);
  }, [playerName, money, totalEarned, tapCount, upgrades, locIdx]);

  // ── Idle income tick (100ms) ───────────────────────────
  useEffect(() => {
    if (!effectiveIps) return;
    const t = setInterval(() => {
      const tick = effectiveIps / 10;
      setMoney(m => m + tick);
      setTotalEarned(e => e + tick);
    }, 100);
    return () => clearInterval(t);
  }, [effectiveIps]);

  // ── Rush hour scheduler ────────────────────────────────
  useEffect(() => {
    let rushTimeout;
    const scheduleRush = () => {
      const delay = RUSH_HOUR.intervalMin + Math.random() * (RUSH_HOUR.intervalMax - RUSH_HOUR.intervalMin);
      rushTimeout = setTimeout(() => {
        setRushActive(true);
        setRushTimeLeft(RUSH_HOUR.durationMs / 1000);
        const countdown = setInterval(() => {
          setRushTimeLeft(t => {
            if (t <= 1) { clearInterval(countdown); setRushActive(false); return 0; }
            return t - 1;
          });
        }, 1000);
        setTimeout(scheduleRush, RUSH_HOUR.durationMs);
      }, delay);
    };
    scheduleRush();
    return () => clearTimeout(rushTimeout);
  }, []);

  // ── Combo tap checker ──────────────────────────────────
  const checkCombo = useCallback(() => {
    const now = Date.now();
    recentTaps.current = recentTaps.current.filter(t => now - t < COMBO.windowMs);
    recentTaps.current.push(now);
    if (recentTaps.current.length >= COMBO.threshold) {
      recentTaps.current = [];
      setComboActive(true);
      setComboTimeLeft(COMBO.durationMs / 1000);
      const countdown = setInterval(() => {
        setComboTimeLeft(t => {
          if (t <= 1) { clearInterval(countdown); setComboActive(false); return 0; }
          return t - 1;
        });
      }, 1000);
    }
  }, []);

  // ── Tap handler ────────────────────────────────────────
  const onTap = useCallback(() => {
    setMoney(m => m + effectiveTi);
    setTotalEarned(e => e + effectiveTi);
    setTapCount(c => c + 1);
    checkCombo();
  }, [effectiveTi, checkCombo]);

  // ── Buy upgrade ────────────────────────────────────────
  const onBuy = useCallback((id) => {
    const u  = UPGRADES.find(x => x.id === id);
    const lv = upgrades[id] || 0;
    const cost = upgCost(u, lv);
    if (money < cost) return;
    setMoney(m => m - cost);
    setUpgrades(u2 => ({ ...u2, [id]: lv + 1 }));
  }, [money, upgrades]);

  // ── Pindah lokasi ──────────────────────────────────────
  const onMove = useCallback(() => {
    setLocIdx(i => i + 1);
    setUpgrades({ alat: 0, bahan: 0, tempat: 0, nyaman: 0, visib: 0 });
    setModal(false);
    saveGame({ playerName, money, totalEarned, tapCount, upgrades: { alat: 0, bahan: 0, tempat: 0, nyaman: 0, visib: 0 }, locIdx: locIdx + 1 });
  }, [playerName, money, totalEarned, tapCount, locIdx]);



  // ── Tabs config ────────────────────────────────────────
  const TABS = [
    { id: 'upgrade', label: 'Upgrade' },
    { id: 'menu',    label: 'Menu'    },
    { id: 'cerita',  label: 'Cerita'  },
  ];

  // ══════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════
  return (
    <>
      {/* ── Onboarding Screen ── */}
      {showNameInput && (
        <OnboardingScreen
          onComplete={({ gender, name }) => {
            setPlayerName(name);
            setShowNameInput(false);
            saveGame({
              playerName: name, gender,
              money: 500, totalEarned: 500,
              tapCount: 0,
              upgrades: { alat: 0, bahan: 0, tempat: 0, nyaman: 0, visib: 0 },
              locIdx: 0,
            });
          }}
        />
      )}

      {/* ── Offline Income Modal ── */}
      {offlineModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(16px)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 400,
        }}>
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: 28, maxWidth: 300, width: '88%',
            textAlign: 'center', animation: 'slideUp 0.2s ease',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🍛</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>Selama lo pergi</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 32, color: '#e8a245', letterSpacing: 1, marginBottom: 16,
            }}>
              +{fmtRp(offlineModal.earned)}
            </div>
            <div style={{ fontSize: 12, color: '#333', marginBottom: 20 }}>
              Warteg tetap jalan tanpa lo 👴
            </div>
            <button
              onClick={() => setOfflineModal(null)}
              style={{
                width: '100%', padding: '11px',
                background: '#e8a245', border: 'none', borderRadius: 8,
                color: '#040404', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Mantap, lanjut!
            </button>
          </div>
        </div>
      )}

      {/* ── Main Game ── */}
      <div style={{
        width: '100%', maxWidth: 430, margin: '0 auto',
        minHeight: '100vh', background: '#040404',
        position: 'relative', overflowX: 'hidden',
      }}>
        {/* Rush hour overlay */}
        {rushActive && (
          <div style={{
            position: 'fixed', inset: 0, pointerEvents: 'none',
            background: `${loc.accent}22`,
            animation: 'rushFlash 1s ease-in-out infinite',
            zIndex: 10,
          }}>
            <div style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              background: loc.accent, color: '#040404',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 16, letterSpacing: 2,
              padding: '4px 16px', borderRadius: 20,
            }}>
              ⚡ RUSH HOUR x3 — {rushTimeLeft}s
            </div>
          </div>
        )}

        {/* Combo indicator */}
        {comboActive && (
          <div style={{
            position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
            background: '#facc15', color: '#040404',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 14, letterSpacing: 2,
            padding: '3px 14px', borderRadius: 20, zIndex: 11,
            animation: 'comboPop 0.3s ease',
          }}>
            🔥 COMBO x1.5 — {comboTimeLeft}s
          </div>
        )}

        {/* Scene area */}
        <SceneArea
          loc={loc}
          bgImage={BACKGROUNDS[locIdx]}
          money={money}
          ips={effectiveIps}
          ti={effectiveTi}
          tapCount={tapCount}
          playerName={playerName}
          rushActive={rushActive}
          onTap={onTap}
        />

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          background: '#060606',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          {[
            { label: 'TAPS',  val: tapCount.toLocaleString() },
            { label: 'LEVEL', val: tl },
            { label: 'TOTAL', val: fmtRp(totalEarned) },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '9px 0', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{ fontSize: 9, color: '#222', fontFamily: "'DM Mono', monospace", letterSpacing: 1.5 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#bbb', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Move progress */}
        <div style={{
          margin: '12px 14px 0', padding: '12px 14px', borderRadius: 10,
          background: canMove ? `${loc.accent}0c` : 'rgba(255,255,255,0.02)',
          border: `1px solid ${canMove ? loc.accent + '44' : 'rgba(255,255,255,0.05)'}`,
          transition: 'all 0.3s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 9, color: '#222', fontFamily: "'DM Mono', monospace", letterSpacing: 1.5, marginBottom: 2 }}>
                NAIK KE
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: canMove ? '#fff' : '#444' }}>
                {locIdx < LOCATIONS.length - 1 ? LOCATIONS[locIdx + 1].name : 'World Domination 🌏'}
              </div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: canMove ? loc.accent : '#2a2a2a' }}>
              {ml}<span style={{ color: '#1a1a1a' }}>/{loc.maxLevel}</span>
            </div>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              width: `${movePct}%`, height: '100%', borderRadius: 99,
              background: loc.accent, boxShadow: `0 0 8px ${loc.accent}88`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          {canMove && (
            <button onClick={() => setModal(true)} style={{
              width: '100%', marginTop: 10, padding: '9px',
              background: loc.accent, border: 'none', borderRadius: 8,
              color: '#040404', fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              Pindah Lokasi →
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', margin: '12px 14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 0', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#fff' : '#3a3a3a',
              fontFamily: "'DM Sans', sans-serif",
              borderBottom: tab === t.id ? `2px solid ${loc.accent}` : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.18s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div key={tab} style={{ padding: '14px 14px 100px', animation: 'slideUp 0.18s ease' }}>
          {tab === 'upgrade' && (
            <UpgradeTab loc={loc} money={money} upgrades={upgrades} onBuy={onBuy} />
          )}
          {tab === 'menu' && (
            <ContentTabs.Menu loc={loc} tl={tl} />
          )}
          {tab === 'cerita' && (
            <ContentTabs.Cerita loc={loc} tl={tl} onOpenChapter={setVnChapter} />
          )}
          {vnChapter !== null && (
            <VNReader chapterId={vnChapter} onClose={() => setVnChapter(null)} />
          )}
        </div>

        {/* Move modal */}
        {modal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(20px)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 200,
          }}>
            <div style={{
              background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: 28, maxWidth: 300, width: '88%',
              animation: 'slideUp 0.2s ease',
            }}>
              <div style={{ fontSize: 9, color: '#252525', fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 14 }}>
                KONFIRMASI PINDAH
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#fff', marginBottom: 6, letterSpacing: 1 }}>
                {LOCATIONS[locIdx + 1]?.name}
              </div>
              <div style={{ fontSize: 12, color: '#383838', lineHeight: 1.8, marginBottom: 22 }}>
                Semua upgrade reset ke Lv 0.<br />Uang tetap. Lokasi baru terbuka.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setModal(false)} style={{
                  flex: 1, padding: '11px', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8, color: '#444',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                }}>
                  Nanti deh
                </button>
                <button onClick={onMove} style={{
                  flex: 1, padding: '11px', cursor: 'pointer',
                  background: loc.accent, border: 'none', borderRadius: 8,
                  color: '#040404', fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: 13,
                }}>
                  Gas! →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
