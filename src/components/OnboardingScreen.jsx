// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — OnboardingScreen.jsx
// Flow: Splash → Pilih Gender → Input Nama → VN Intro → Game
// ═══════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

// ── VN Intro panels (5 panel sebelum masuk game) ────────
const INTRO_PANELS = [
  {
    caption: 'Tiga kali gagal. Saldo: Rp 47.000. Umur: 21 tahun.',
    sub: 'Naraya, Jawa Tengah',
  },
  {
    caption: '"Resep ini bukan sekadar masakan. Ini nyawa keluarga kita."',
    sub: '— Nenek',
  },
  {
    caption: 'Modal: Rp 200.000. Resep aneh yang belum pernah ada. Dan nekat.',
    sub: 'Hari pertama buka warteg',
  },
  {
    caption: 'Hari pertama buka. Nol pembeli. Tapi lo masih masak.',
    sub: 'Gang sempit Naraya',
  },
  {
    caption: 'Dan dari sini — semuanya berubah.',
    sub: 'Mulai perjalananmu',
  },
];

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep]         = useState('splash');   // splash | gender | name | intro
  const [gender, setGender]     = useState(null);        // 'male' | 'female'
  const [nameInput, setNameInput] = useState('');
  const [panelIdx, setPanelIdx] = useState(0);
  const [fadeIn, setFadeIn]     = useState(true);

  // Auto advance splash setelah 2.5 detik
  useEffect(() => {
    if (step !== 'splash') return;
    const t = setTimeout(() => {
      setFadeIn(false);
      setTimeout(() => { setStep('gender'); setFadeIn(true); }, 400);
    }, 2500);
    return () => clearTimeout(t);
  }, [step]);

  const goToName = () => {
    if (!gender) return;
    setFadeIn(false);
    setTimeout(() => { setStep('name'); setFadeIn(true); }, 300);
  };

  const goToIntro = () => {
    const name = nameInput.trim() || 'Player';
    setFadeIn(false);
    setTimeout(() => { setStep('intro'); setFadeIn(true); }, 300);
    return name;
  };

  const nextPanel = () => {
    if (panelIdx < INTRO_PANELS.length - 1) {
      setFadeIn(false);
      setTimeout(() => { setPanelIdx(i => i + 1); setFadeIn(true); }, 250);
    } else {
      const name = nameInput.trim() || 'Player';
      onComplete({ gender, name });
    }
  };

  const submitName = () => {
    goToIntro();
  };

  // ── Shared styles ────────────────────────────────────
  const screen = {
    position: 'fixed', inset: 0, zIndex: 500,
    background: '#040404',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '0 32px',
    opacity: fadeIn ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  // ══════════════════════════════════════════════════════
  // SPLASH SCREEN
  // ══════════════════════════════════════════════════════
  if (step === 'splash') return (
    <div style={screen}>
      {/* Logo icon */}
      <div style={{
        fontSize: 72, marginBottom: 24,
        animation: 'pulse 2s ease-in-out infinite',
        filter: 'drop-shadow(0 0 30px #e8a24588)',
      }}>
        🍛
      </div>

      {/* Game title */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 48, letterSpacing: 4,
        color: '#e8a245',
        textShadow: '0 0 40px #e8a24566',
        marginBottom: 8, textAlign: 'center',
      }}>
        INCLICKER
      </div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22, letterSpacing: 6,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 40, textAlign: 'center',
      }}>
        RESTO
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 13, color: 'rgba(255,255,255,0.25)',
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: 1, textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Dari gang sempit ke seluruh dunia
      </div>

      {/* Loading dots */}
      <div style={{ position: 'absolute', bottom: 60, display: 'flex', gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#e8a245',
            opacity: 0.4,
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // PILIH GENDER
  // ══════════════════════════════════════════════════════
  if (step === 'gender') return (
    <div style={screen}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, color: '#e8a245',
        letterSpacing: 3, marginBottom: 12,
      }}>
        LANGKAH 1 / 2
      </div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 30, color: '#fff',
        letterSpacing: 2, marginBottom: 8, textAlign: 'center',
      }}>
        PILIH KARAKTER
      </div>
      <div style={{
        fontSize: 13, color: '#444',
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: 40, textAlign: 'center',
      }}>
        Lo mau main sebagai siapa?
      </div>

      {/* Gender cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 36, width: '100%', maxWidth: 320 }}>
        {[
          { id: 'male',   emoji: '👨🍳', label: 'Cowok' },
          { id: 'female', emoji: '👩🍳', label: 'Cewek' },
        ].map(g => (
          <div
            key={g.id}
            onClick={() => setGender(g.id)}
            style={{
              flex: 1, padding: '28px 16px',
              background: gender === g.id ? '#e8a24518' : 'rgba(255,255,255,0.03)',
              border: `2px solid ${gender === g.id ? '#e8a245' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14, cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              boxShadow: gender === g.id ? '0 0 24px #e8a24533' : 'none',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 10 }}>{g.emoji}</div>
            <div style={{
              fontSize: 14, fontWeight: 600,
              color: gender === g.id ? '#e8a245' : '#555',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {g.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToName}
        disabled={!gender}
        style={{
          width: '100%', maxWidth: 320, padding: '14px',
          background: gender ? '#e8a245' : 'rgba(255,255,255,0.05)',
          border: 'none', borderRadius: 12,
          color: gender ? '#040404' : '#333',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: 15,
          cursor: gender ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        Lanjut →
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // INPUT NAMA
  // ══════════════════════════════════════════════════════
  if (step === 'name') return (
    <div style={screen}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, color: '#e8a245',
        letterSpacing: 3, marginBottom: 12,
      }}>
        LANGKAH 2 / 2
      </div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 30, color: '#fff',
        letterSpacing: 2, marginBottom: 8,
      }}>
        SIAPA NAMA LO?
      </div>
      <div style={{
        fontSize: 13, color: '#444',
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
        placeholder="Ketik nama lo..."
        maxLength={16}
        style={{
          width: '100%', maxWidth: 320,
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, color: '#fff',
          fontSize: 18, fontFamily: "'DM Sans', sans-serif",
          outline: 'none', textAlign: 'center',
          marginBottom: 16,
          caretColor: '#e8a245',
        }}
      />

      <button
        onClick={() => nameInput.trim() && submitName()}
        disabled={!nameInput.trim()}
        style={{
          width: '100%', maxWidth: 320, padding: '14px',
          background: nameInput.trim() ? '#e8a245' : 'rgba(255,255,255,0.05)',
          border: 'none', borderRadius: 12,
          color: nameInput.trim() ? '#040404' : '#333',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: 15,
          cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        Mulai Cerita →
      </button>

      {/* Back */}
      <button onClick={() => { setStep('gender'); setFadeIn(true); }} style={{
        marginTop: 16, background: 'none', border: 'none',
        color: '#333', fontSize: 12, cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        ← Kembali
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════
  // VN INTRO (5 panel)
  // ══════════════════════════════════════════════════════
  if (step === 'intro') {
    const panel = INTRO_PANELS[panelIdx];
    return (
      <div
        onClick={nextPanel}
        style={{
          ...screen,
          cursor: 'pointer',
          justifyContent: 'flex-end',
          padding: 0,
        }}
      >
        {/* Dark overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, #1a0f0088 0%, #040404 100%)',
        }}/>

        {/* Panel number */}
        <div style={{
          position: 'absolute', top: 20, right: 20,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: 'rgba(255,255,255,0.2)',
        }}>
          {panelIdx + 1} / {INTRO_PANELS.length}
        </div>

        {/* Big icon center */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -65%)',
          fontSize: 90,
          opacity: 0.08,
          userSelect: 'none',
        }}>
          🍳
        </div>

        {/* Sub label */}
        {panel.sub && (
          <div style={{
            position: 'absolute',
            top: '38%', left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, color: '#e8a245aa',
            letterSpacing: 2, textAlign: 'center',
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}>
            {panel.sub.toUpperCase()}
          </div>
        )}

        {/* Caption box */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(to top, #000000ee 0%, #000000aa 80%, transparent 100%)',
          padding: '40px 28px 60px',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}>
          <div style={{
            fontSize: 17, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.9)',
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: 'italic',
            marginBottom: 20,
          }}>
            {panel.caption}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
            {INTRO_PANELS.map((_, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 99,
                width: i === panelIdx ? 20 : 6,
                background: i === panelIdx ? '#e8a245' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.25s ease',
              }}/>
            ))}
          </div>

          <div style={{
            fontSize: 11, color: 'rgba(255,255,255,0.2)',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: 1.5,
          }}>
            {panelIdx < INTRO_PANELS.length - 1 ? 'TAP UNTUK LANJUT' : 'TAP UNTUK MULAI'}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
