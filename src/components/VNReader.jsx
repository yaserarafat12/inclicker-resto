/**
 * VNReader.jsx — Visual Novel Reader
 * ─────────────────────────────────────────────────────────────────
 * CARA PASANG DI ANTIGRAVITY:
 *
 * 1. Taruh file ini di: src/components/VNReader.jsx
 *
 * 2. Di bagian atas file, ganti blok PLACEHOLDER IMPORTS dengan:
 *    import p01 from '../panels/panel 0.1.png'    (atau .jpg sesuai format lo)
 *    import p02 from '../panels/panel 0.2.png'
 *    ... dst sampai 2.13
 *    import mccowok from '../mccowok.png'
 *    import mccewek from '../mccewek.png'
 *    import nenek   from '../nenek.png'
 *
 * 3. Di src/components/ContentTabs.jsx (CeritaTab),
 *    tambahkan prop onOpenChapter dan panggil onOpenChapter(c.id) saat tap "baca →"
 *
 * 4. Di src/App.jsx:
 *    import { VNReader } from './components/VNReader'
 *    tambah state: const [vnChapter, setVnChapter] = useState(null)
 *    render: {vnChapter !== null && <VNReader chapterId={vnChapter} onClose={() => setVnChapter(null)} />}
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// PLACEHOLDER IMPORTS — GANTI SEMUA INI DI ANTIGRAVITY
// ═══════════════════════════════════════════════════════════════════
// Setelah ganti: hapus const PLACEHOLDER_... di bawah,
// dan hapus fungsi getImg(), pakai variabel import langsung di PANELS

const PLACEHOLDER = (label) => `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560">
    <rect width="400" height="560" fill="#1a1208"/>
    <rect x="2" y="2" width="396" height="556" fill="none" stroke="#e8a245" stroke-width="1" opacity="0.3"/>
    <text x="200" y="260" text-anchor="middle" font-family="Arial" font-size="16" fill="#e8a245" opacity="0.6">[ ${label} ]</text>
    <text x="200" y="290" text-anchor="middle" font-family="Arial" font-size="11" fill="#666">ganti dengan import gambar</text>
  </svg>
`)}`;

// ═══════════════════════════════════════════════════════════════════
// PANEL DATA — chapter + panel mapping
// ═══════════════════════════════════════════════════════════════════
// Format: { img, caption, speaker }
// speaker: null = narasi, "MC" / "Nenek" / "Ojo" = dialog dengan nama
// caption: teks yang muncul di bawah panel

const PANEL_DATA = {
  // ── ACT 0: Tiga Kali Gagal ────────────────────────────────────
  0: {
    title: "Tiga Kali Gagal",
    sub: "Act 0",
    accentColor: "#c8956a",
    panels: [
      {
        img: PLACEHOLDER("panel 0.1"),
        // ANTIGRAVITY: ganti jadi -> img: p01,
        caption: "Ijazah S1 Manajemen. IPK 3,2. Tiga tahun, empat kota.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 0.2"),
        // ANTIGRAVITY: img: p02,
        caption: "Gagal interview. Lagi. Ketiga kalinya bulan ini.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 0.3"),
        // ANTIGRAVITY: img: p03,
        caption: "Saldo: Rp 87.000. Tiket pulang: Rp 150.000.",
        speaker: null,
      },
    ]
  },

  // ── ACT 1 Scene 1: Pulang ──────────────────────────────────────
  1: {
    title: "Pulang",
    sub: "Act 1 · Scene 1",
    accentColor: "#e8a245",
    panels: [
      {
        img: PLACEHOLDER("panel 1.1"),
        // ANTIGRAVITY: img: p11,
        caption: "Bus terakhir jam 22.00. Naraya, 8 jam perjalanan.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 1.2"),
        // ANTIGRAVITY: img: p12,
        caption: "Rumah masih sama. Cat tembok yang sama. Bau kayu yang sama.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 1.3"),
        // ANTIGRAVITY: img: p13,  (file: panel 1.3 nty)
        caption: "Nek, aku pulang.",
        speaker: "MC",
      },
      {
        img: PLACEHOLDER("panel 1.4"),
        // ANTIGRAVITY: img: p14,
        caption: "Lama amat. Udah makan?",
        speaker: "Nenek",
      },
      {
        img: PLACEHOLDER("panel 1.5"),
        // ANTIGRAVITY: img: p15,
        caption: "Belum.",
        speaker: "MC",
      },
    ]
  },

  // ── ACT 1 Scene 2: Tengah Malam di Dapur ──────────────────────
  2: {
    title: "Tengah Malam di Dapur",
    sub: "Act 1 · Scene 2",
    accentColor: "#e8a245",
    panels: [
      {
        img: PLACEHOLDER("panel 1.6"),
        // ANTIGRAVITY: img: p16,
        caption: "Jam 2 pagi. Nenek masih di dapur.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 1.7"),
        // ANTIGRAVITY: img: p17,
        caption: "Nenek masak ini tiap malem?",
        speaker: "MC",
      },
      {
        img: PLACEHOLDER("panel 1.8"),
        // ANTIGRAVITY: img: p18,
        caption: "Cuma kalau ada yang pulang.",
        speaker: "Nenek",
      },
    ]
  },

  // ── ACT 1 Scene 3: Buku Resep & Amplop ────────────────────────
  3: {
    title: "Buku Resep & Amplop",
    sub: "Act 1 · Scene 3",
    accentColor: "#e8a245",
    panels: [
      {
        img: PLACEHOLDER("panel 1.9"),
        // ANTIGRAVITY: img: p19,
        caption: "Buku resep ini... dari mana, Nek?",
        speaker: "MC",
      },
    ]
  },

  // ── ACT 2 Scene 1: Dari Satu Meja ke Sepuluh ──────────────────
  5: {
    title: "Dari Satu Meja ke Sepuluh",
    sub: "Act 2 · Scene 1",
    accentColor: "#d4924a",
    panels: [
      {
        img: PLACEHOLDER("panel 2.1"),
        // ANTIGRAVITY: img: p21,
        caption: "Hari ketiga. Meja kosong jadi dua.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 2.2"),
        // ANTIGRAVITY: img: p22,
        caption: "Bro, lo tau gak? Warteg lo tuh...",
        speaker: "Ojo",
      },
      {
        img: PLACEHOLDER("panel 2.3"),
        // ANTIGRAVITY: img: p23,
        caption: "Nenek makan sendiri di pojok. Dia nggak minta dipuji.",
        speaker: null,
      },
    ]
  },

  // ── ACT 2 Scene 2: Orang yang Salah Waktu ─────────────────────
  6: {
    title: "Orang yang Salah Waktu",
    sub: "Act 2 · Scene 2",
    accentColor: "#d4924a",
    panels: [
      {
        img: PLACEHOLDER("panel 2.4"),
        // ANTIGRAVITY: img: p24,
        caption: "Dia datang pas warteg lagi penuh.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 2.5"),
        // ANTIGRAVITY: img: p25,
        caption: "Masih ada tempat?",
        speaker: "Alin",
      },
      {
        img: PLACEHOLDER("panel 2.6"),
        // ANTIGRAVITY: img: p26,
        caption: "Dua cangkir teh. Satu meja. Nggak ada yang ngomong dulu.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 2.7"),
        // ANTIGRAVITY: img: p27,
        caption: "Tangan mereka berdekatan tapi nggak nyentuh.",
        speaker: null,
      },
    ]
  },

  // ── ACT 2 Scene 3: Video 30 Detik ─────────────────────────────
  7: {
    title: "Video 30 Detik",
    sub: "Act 2 · Scene 3",
    accentColor: "#d4924a",
    panels: [
      {
        img: PLACEHOLDER("panel 2.8"),
        // ANTIGRAVITY: img: p28,
        caption: "Ojo ngerekam tanpa bilang.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 2.9"),
        // ANTIGRAVITY: img: p29,
        caption: "30 detik. 847.000 views dalam semalam.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 2.10"),
        // ANTIGRAVITY: img: p210,
        caption: "HP lo bunyi terus tuh.",
        speaker: "Ojo",
      },
      {
        img: PLACEHOLDER("panel 2.11"),
        // ANTIGRAVITY: img: p211,
        caption: "Viral bukan berarti sukses. Tapi ini awalnya.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 2.12"),
        // ANTIGRAVITY: img: p212,
        caption: "Before → After. \"WARTEG WD\" terpampang di papan baru.",
        speaker: null,
      },
      {
        img: PLACEHOLDER("panel 2.13"),
        // ANTIGRAVITY: img: p213,
        caption: "Perjalanan masih panjang.",
        speaker: null,
      },
    ]
  },
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENT: VNReader
// ═══════════════════════════════════════════════════════════════════
export default function VNReader({ chapterId, onClose }) {
  const chapter = PANEL_DATA[chapterId];
  const [panelIdx, setPanelIdx] = useState(0);
  const [entering, setEntering] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const panel = chapter?.panels[panelIdx];
  const isLast = panelIdx === (chapter?.panels.length - 1);
  const total = chapter?.panels.length || 0;

  // entrance animation
  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 50);
    return () => clearTimeout(t);
  }, []);

  const goNext = useCallback(() => {
    if (transitioning) return;
    if (isLast) { onClose(); return; }
    setTransitioning(true);
    setTimeout(() => {
      setPanelIdx(i => i + 1);
      setTransitioning(false);
    }, 220);
  }, [transitioning, isLast, onClose]);

  const goPrev = useCallback(() => {
    if (transitioning || panelIdx === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setPanelIdx(i => i - 1);
      setTransitioning(false);
    }, 220);
  }, [transitioning, panelIdx]);

  // swipe support
  const touchStartX = useState(null);
  useEffect(() => {
    let sx = 0;
    const onStart = e => { sx = e.touches[0].clientX; };
    const onEnd = e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [goNext, goPrev]);

  if (!chapter) return null;

  const acc = chapter.accentColor;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#000",
      display: "flex", flexDirection: "column",
      transform: entering ? "translateY(100%)" : "translateY(0)",
      transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px",
        background: "#080808",
        borderBottom: `1px solid ${acc}33`,
        flexShrink: 0,
      }}>
        {/* close */}
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#555", fontSize: 20, padding: "4px 8px",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>✕</span>
          <span style={{ fontSize: 11, letterSpacing: 1, color: "#333" }}>TUTUP</span>
        </button>

        {/* title */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 9, color: acc + "aa",
            fontFamily: "'DM Mono', monospace", letterSpacing: 2,
          }}>{chapter.sub.toUpperCase()}</div>
          <div style={{
            fontSize: 13, fontWeight: 600, color: "#e0e0e0",
            fontFamily: "'DM Sans', sans-serif",
          }}>{chapter.title}</div>
        </div>

        {/* panel counter */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 13, color: acc,
          minWidth: 50, textAlign: "right",
        }}>
          {panelIdx + 1}<span style={{ color: "#333" }}>/{total}</span>
        </div>
      </div>

      {/* ── PANEL IMAGE ── */}
      <div
        onClick={goNext}
        style={{
          flex: 1, position: "relative", overflow: "hidden",
          cursor: "pointer", userSelect: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#050505",
        }}
      >
        <img
          src={panel.img}
          alt={`panel ${panelIdx + 1}`}
          style={{
            maxWidth: "100%", maxHeight: "100%",
            objectFit: "contain",
            opacity: transitioning ? 0 : 1,
            transition: "opacity 0.22s ease",
            display: "block",
          }}
        />

        {/* prev area (left 25%) */}
        {panelIdx > 0 && (
          <div
            onClick={e => { e.stopPropagation(); goPrev(); }}
            style={{
              position: "absolute", left: 0, top: 0,
              width: "25%", height: "100%",
              cursor: "w-resize",
              background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)",
            }}
          />
        )}

        {/* tap hint bottom */}
        <div style={{
          position: "absolute", bottom: 12, right: 16,
          fontSize: 10, color: "rgba(255,255,255,0.15)",
          fontFamily: "'DM Mono', monospace", letterSpacing: 1.5,
          pointerEvents: "none",
        }}>
          {isLast ? "SELESAI" : "TAP → LANJUT"}
        </div>
      </div>

      {/* ── CAPTION / DIALOG ── */}
      <div style={{
        flexShrink: 0,
        background: "#070707",
        borderTop: `1px solid ${acc}22`,
        minHeight: 90, padding: "16px 20px 20px",
        opacity: transitioning ? 0 : 1,
        transition: "opacity 0.22s ease",
      }}>
        {panel.speaker && (
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: acc, letterSpacing: 2,
            fontFamily: "'DM Mono', monospace",
            marginBottom: 6,
          }}>{panel.speaker.toUpperCase()}</div>
        )}
        <div style={{
          fontSize: 14, lineHeight: 1.65,
          color: panel.speaker ? "#f0f0f0" : "#aaa",
          fontFamily: "'DM Sans', sans-serif",
          fontStyle: panel.speaker ? "normal" : "italic",
        }}>
          {panel.speaker ? `"${panel.caption}"` : panel.caption}
        </div>
      </div>

      {/* ── PROGRESS DOTS ── */}
      <div style={{
        flexShrink: 0,
        display: "flex", justifyContent: "center",
        gap: 5, padding: "10px 16px 20px",
        background: "#070707",
      }}>
        {chapter.panels.map((_, i) => (
          <div
            key={i}
            onClick={() => !transitioning && setPanelIdx(i)}
            style={{
              width: i === panelIdx ? 18 : 5,
              height: 5, borderRadius: 99,
              background: i === panelIdx ? acc : "#222",
              transition: "all 0.25s ease",
              cursor: "pointer",
              boxShadow: i === panelIdx ? `0 0 8px ${acc}88` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}