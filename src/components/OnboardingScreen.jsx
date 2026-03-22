// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — OnboardingScreen.jsx v2
// Mobile-first, contrast tinggi, teks jelas
// ═══════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

const INTRO_PANELS = [
  { caption: 'Tiga kali gagal. Saldo: Rp 47.000. Umur: 21 tahun.', sub: 'Naraya, Jawa Tengah' },
  { caption: '"Resep ini bukan sekadar masakan. Ini nyawa keluarga kita."', sub: '— Nenek' },
  { caption: 'Modal: Rp 200.000. Resep aneh yang belum pernah ada. Dan nekat.', sub: 'Hari pertama buka warteg' },
  { caption: 'Hari pertama buka. Nol pembeli. Tapi lo masih masak.', sub: 'Gang sempit Naraya' },
  { caption: 'Dan dari sini — semuanya berubah.', sub: 'Mulai perjalananmu' },
];

export default function OnboardingScreen({ onComplete }) {
  const [step,      setStep]      = useState('splash');
  const [gender,    setGender]    = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [panelIdx,  setPanelIdx]  = useState(0);
  const [visible,   setVisible]   = useState(true);

  const fade = (next, delay = 350) => {
    setVisible(false);
    setTimeout(() => { next(); setVisible(true); }, delay);
  };

  // Auto advance splash
  useEffect(() => {
    if (step !== 'splash') return;
    const t = setTimeout(() => fade(() => setStep('gender')), 2800);
    return () => clearTimeout(t);
  }, [step]);

  const submitName = () => {
    const name = nameInput.trim() || 'Player';
    fade(() => { setStep('intro'); });
  };

  const nextPanel = () => {
    if (panelIdx < INTRO_PANELS.length - 1) {
      fade(() => setPanelIdx(i => i + 1), 200);
    } else {
      onComplete({ gender, name: nameInput.trim() || 'Player' });
    }
  };

  // ── Wrapper — selalu max 430px, centered ──────────────
  const wrap = {
    position: 'fixed', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0a0a0a', zIndex: 500,
  };
  const card = {
    width: '100%', maxWidth: 430,
    height: '100%', maxHeight: '100dvh',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '0 28px',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s ease',
    position: 'relative',
  };

  // ══════════════════════════════════════════════════════
  // SPLASH
  // ══════════════════════════════════════════════════════
  if (step === 'splash') return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ fontSize: 80, marginBottom: 20, filter: 'drop-shadow(0 0 24px #e8a24566)' }}>
          🍛
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 52, letterSpacing: 5,
          color: '#e8a245', lineHeight: 1,
          textShadow: '0 0 40px #e8a24555',
          marginBottom: 4,
        }}>
          INCLICKER
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20, letterSpacing: 8,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 48,
        }}>
          RESTO
        </div>
        <div style={{
          fontSize: 14, color: 'rgba(255,255,255,0.35)',
          fontFamily: "'DM Sans', sans-serif",
          fontStyle: 'italic', letterSpacing: 0.5,
        }}>
          Dari gang sempit ke seluruh dunia
        </div>
        {/* dots */}
        <div style={{ position: 'absolute', bottom: 48, display: 'flex', gap: 8 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#e8a245', opacity: 0.5,
              animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // GENDER
  // ══════════════════════════════════════════════════════
  if (step === 'gender') return (
    <div style={wrap}>
      <div style={card}>
        {/* Step indicator */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: '#e8a245',
          letterSpacing: 3, marginBottom: 14,
        }}>
          1 / 2
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 34, color: '#ffffff',
          letterSpacing: 2, marginBottom: 8, textAlign: 'center',
        }}>
          PILIH KARAKTER
        </div>
        <div style={{
          fontSize: 15, color: 'rgba(255,255,255,0.55)',
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 36, textAlign: 'center',
        }}>
          Lo mau main sebagai siapa?
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 14, width: '100%', marginBottom: 28 }}>
          {[
            { id: 'male',   emoji: '👨🍳', label: 'Cowok' },
            { id: 'female', emoji: '👩🍳', label: 'Cewek' },
          ].map(g => {
            const selected = gender === g.id;
            return (
              <div key={g.id} onClick={() => setGender(g.id)} style={{
                flex: 1, padding: '24px 12px 20px',
                background: selected ? '#e8a24520' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${selected ? '#e8a245' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 16, cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.18s',
                boxShadow: selected ? '0 0 20px #e8a24530' : 'none',
              }}>
                <div style={{ fontSize: 52, marginBottom: 10, lineHeight: 1 }}>{g.emoji}</div>
                <div style={{
                  fontSize: 16, fontWeight: 700,
                  color: selected ? '#e8a245' : 'rgba(255,255,255,0.6)',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {g.label}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => gender && fade(() => setStep('name'))} style={{
          width: '100%', padding: '16px',
          background: gender ? '#e8a245' : 'rgba(255,255,255,0.07)',
          border: 'none', borderRadius: 14,
          color: gender ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: 16,
          cursor: gender ? 'pointer' : 'default',
          transition: 'all 0.18s',
          letterSpacing: 0.5,
        }}>
          Lanjut →
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // NAMA
  // ══════════════════════════════════════════════════════
  if (step === 'name') return (
    <div style={wrap}>
      <div style={card}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: '#e8a245',
          letterSpacing: 3, marginBottom: 14,
        }}>
          2 / 2
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 34, color: '#ffffff',
          letterSpacing: 2, marginBottom: 8,
        }}>
          SIAPA NAMA LO?
        </div>
        <div style={{
          fontSize: 15, color: 'rgba(255,255,255,0.5)',
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 36, textAlign: 'center',
          lineHeight: 1.6,
        }}>
          Nama lo akan muncul di semua dialog cerita
        </div>

        <input
          autoFocus
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && nameInput.trim() && submitName()}
          placeholder="Nama lo..."
          maxLength={16}
          style={{
            width: '100%', padding: '16px 20px',
            background: 'rgba(255,255,255,0.07)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            borderRadius: 14, color: '#ffffff',
            fontSize: 20, fontFamily: "'DM Sans', sans-serif",
            outline: 'none', textAlign: 'center',
            marginBottom: 14,
            caretColor: '#e8a245',
          }}
        />

        <button
          onClick={() => nameInput.trim() && submitName()}
          style={{
            width: '100%', padding: '16px',
            background: nameInput.trim() ? '#e8a245' : 'rgba(255,255,255,0.07)',
            border: 'none', borderRadius: 14,
            color: nameInput.trim() ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 16,
            cursor: nameInput.trim() ? 'pointer' : 'default',
            transition: 'all 0.18s',
            marginBottom: 12,
          }}
        >
          Mulai Cerita →
        </button>

        <button onClick={() => fade(() => setStep('gender'))} style={{
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.3)', fontSize: 13,
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          padding: '8px',
        }}>
          ← Kembali
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // VN INTRO
  // ══════════════════════════════════════════════════════
  if (step === 'intro') {
    const panel = INTRO_PANELS[panelIdx];
    return (
      <div style={wrap}>
        <div
          onClick={nextPanel}
          style={{
            width: '100%', maxWidth: 430,
            height: '100%', maxHeight: '100dvh',
            position: 'relative', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            background: '#0a0a0a',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          {/* Background icon besar di tengah */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -60%)',
            fontSize: 120, opacity: 0.06,
            userSelect: 'none', pointerEvents: 'none',
          }}>
            🍳
          </div>

          {/* Sub label */}
          <div style={{
            position: 'absolute', top: '36%', width: '100%',
            textAlign: 'center',
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, color: '#e8a245',
            letterSpacing: 3, opacity: 0.8,
          }}>
            {panel.sub?.toUpperCase()}
          </div>

          {/* Panel counter top right */}
          <div style={{
            position: 'absolute', top: 20, right: 20,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12, color: 'rgba(255,255,255,0.25)',
          }}>
            {panelIdx + 1}/{INTRO_PANELS.length}
          </div>

          {/* Caption box */}
          <div style={{
            padding: '36px 28px 52px',
            background: 'linear-gradient(to top, #000000f5 0%, #000000cc 70%, transparent 100%)',
          }}>
            <div style={{
              fontSize: 19, lineHeight: 1.7,
              color: '#f5f5f5',
              fontFamily: "'DM Sans', sans-serif",
              fontStyle: 'italic',
              marginBottom: 22,
            }}>
              {panel.caption}
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {INTRO_PANELS.map((_, i) => (
                <div key={i} style={{
                  height: 3, borderRadius: 99,
                  width: i === panelIdx ? 22 : 6,
                  background: i === panelIdx ? '#e8a245' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.25s ease',
                }}/>
              ))}
            </div>

            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.3)',
              fontFamily: "'DM Mono', monospace", letterSpacing: 2,
            }}>
              {panelIdx < INTRO_PANELS.length - 1 ? 'TAP UNTUK LANJUT' : 'TAP UNTUK MULAI ▶'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
