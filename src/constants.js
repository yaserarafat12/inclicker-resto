// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — constants.js
// Semua game data ada di sini. Jangan hardcode di tempat lain.
// ═══════════════════════════════════════════════════════

export const LOCATIONS = [
    { id: 0, name: "Warteg Pelosok", tag: "AWAL", accent: "#e8a245", dim: "#2a1800", maxLevel: 20 },
    { id: 1, name: "Warteg Pinggir Jalan", tag: "LOC 02", accent: "#7ec850", dim: "#0f1f00", maxLevel: 40 },
    { id: 2, name: "Warung Makan", tag: "LOC 03", accent: "#4ecdc4", dim: "#001f1e", maxLevel: 60 },
    { id: 3, name: "Restoran", tag: "LOC 04", accent: "#a78bfa", dim: "#100823", maxLevel: 100 },
    { id: 4, name: "Fine Dining", tag: "LOC 05", accent: "#f472b6", dim: "#1e0012", maxLevel: 150 },
    { id: 5, name: "Food Court", tag: "LOC 06", accent: "#fb923c", dim: "#1f0e00", maxLevel: 200 },
    { id: 6, name: "Franchise Lokal", tag: "LOC 07", accent: "#facc15", dim: "#1f1900", maxLevel: 300 },
    { id: 7, name: "Franchise Nasional", tag: "LOC 08", accent: "#60a5fa", dim: "#001228", maxLevel: 500 },
    { id: 8, name: "Franchise Asia", tag: "LOC 09", accent: "#34d399", dim: "#001f12", maxLevel: 750 },
    { id: 9, name: "World Domination", tag: "LOC 10", accent: "#f87171", dim: "#1f0000", maxLevel: 1000 },
];

export const UPGRADES = [
    {
        id: "alat",
        label: "Alat Masak",
        icon: "🔥",
        glow: "#ff6b35",
        baseCost: 80,
        baseIncome: 1.2,
        names: [
            "Kompor Gas Rongsok",   // lv 0-1
            "Kompor Gas Standar",   // lv 2-3
            "Kompor Turbo",         // lv 4-5
            "Kompor Induksi",       // lv 6-7
            "Dapur Semi-Pro",       // lv 8-9
            "Open Kitchen",         // lv 10-11
            "Dapur Premium",        // lv 12-13
            "Chef Station",         // lv 14-15
            "Smart Kitchen",        // lv 16-17
            "Quantum Cooker",       // lv 18+
        ],
    },
    {
        id: "bahan",
        label: "Bahan & Rasa",
        icon: "🌶️",
        glow: "#e84393",
        baseCost: 120,
        baseIncome: 1.5,
        names: [
            "Bumbu Nenek",
            "Bumbu Pasar",
            "Rempah Pilihan",
            "Rempah Premium",
            "Spice Import",
            "Bumbu Rahasia",
            "Lab Bumbu",
            "Spice Architect",
            "Flavor AI",
            "Rasa ∞",
        ],
    },
    {
        id: "tempat",
        label: "Tempat Duduk",
        icon: "🪑",
        glow: "#38bdf8",
        baseCost: 100,
        baseIncome: 1.3,
        names: [
            "Bangku Plastik",
            "Bangku Kokoh",
            "Kursi Kayu",
            "Kursi Rotan",
            "Kursi Lipat",
            "Set Cafe",
            "Sofa Sectional",
            "Velvet Booth",
            "Designer Set",
            "Throne",
        ],
    },
    {
        id: "nyaman",
        label: "Kenyamanan",
        icon: "❄️",
        glow: "#34d399",
        baseCost: 150,
        baseIncome: 1.4,
        names: [
            "Kipas Berisik",
            "Kipas Baru",
            "AC 1PK",
            "AC 2PK",
            "AC Inverter",
            "Multi-Split",
            "Climate Ctrl",
            "Smart Air",
            "Aroma Pro",
            "Paradise",
        ],
    },
    {
        id: "visib",
        label: "Visibilitas",
        icon: "📢",
        glow: "#a78bfa",
        baseCost: 200,
        baseIncome: 1.6,
        names: [
            "Terpal Karton",
            "Spanduk Cetak",
            "Banner LED",
            "Neon Sign",
            "Papan Digital",
            "IG Viral",
            "TikTok Famous",
            "Influencer",
            "Brand Hub",
            "World Icon",
        ],
    },
];

export const MENUS = [
    { id: 0, emoji: "🍚", name: "Nasi Galau Level 5", desc: "Pedas di awal, manis di akhir. Kayak hubungan toxic.", price: 15000, unlock: 0 },
    { id: 1, emoji: "🍜", name: "Mie Patah Hati", desc: "Kuah sepi + telur setengah matang.", price: 18000, unlock: 3 },
    { id: 2, emoji: "🟫", name: "Tempe Bucin Original", desc: "Goreng crispy. Selalu balik lagi.", price: 8000, unlock: 6 },
    { id: 3, emoji: "🥦", name: "Cap Cay Overthinking", desc: "10 sayuran, 1 wajan, 1000 pikiran.", price: 22000, unlock: 10 },
    { id: 4, emoji: "🍲", name: "Soto Eksistensial", desc: "Kuah bening yang bikin nanya-nanya.", price: 20000, unlock: 15 },
    { id: 5, emoji: "🍡", name: "Bakso Quarter Life Crisis", desc: "Sebesar masalah lo, tapi lebih selesai.", price: 28000, unlock: 20 },
    { id: 6, emoji: "🥜", name: "Gado-Gado Red Flag", desc: "Campur-campur tapi somehow enak.", price: 25000, unlock: 35 },
    { id: 7, emoji: "🥩", name: "Rendang Privilege", desc: "Daging wagyu direndang 7 jam.", price: 120000, unlock: 50 },
    { id: 8, emoji: "🦴", name: "Sop Buntut Nostalgia", desc: "Resep nenek, dimodernisasi.", price: 85000, unlock: 70 },
    { id: 9, emoji: "🍛", name: "Nasi Padang World Edition", desc: "Versi internasional yang tetap otentik.", price: 200000, unlock: 100 },
];

export const CHAPTERS = [
    { id: 0, title: "Tiga Kali Gagal", sub: "Act 0", unlock: 0 },
    { id: 1, title: "Pulang", sub: "Act 1 · Scene 1", unlock: 5 },
    { id: 2, title: "Tengah Malam di Dapur", sub: "Act 1 · Scene 2", unlock: 12 },
    { id: 3, title: "Buku Resep & Amplop", sub: "Act 1 · Scene 3", unlock: 18 },
    { id: 4, title: "Hari Pertama", sub: "Act 1 · Scene 4", unlock: 25 },
    { id: 5, title: "Dari Satu Meja ke Sepuluh", sub: "Act 2 · Scene 1", unlock: 35 },
    { id: 6, title: "Orang yang Salah Waktu", sub: "Act 2 · Scene 2", unlock: 50 },
    { id: 7, title: "Video 30 Detik", sub: "Act 2 · Scene 3", unlock: 70 },
    { id: 8, title: "Terlalu Banyak Sekaligus", sub: "Act 3 · Scene 1", unlock: 90 },
    { id: 9, title: "Warung Sumber Racun", sub: "Act 3 · Scene 2", unlock: 110 },
    { id: 10, title: "Pilihan Kedua", sub: "Act 3 · Scene 3", unlock: 130 },
    { id: 11, title: "Act 4 — Coming Soon", sub: "Act 4", unlock: 160 },
];

// ── Offline income cap: 7 hari dalam detik ──────────────────────────
export const OFFLINE_CAP_SECONDS = 60 * 60 * 24 * 7; // 604800 detik

// ── Rush Hour config ─────────────────────────────────────────────────
export const RUSH_HOUR = {
    durationMs: 30000,   // 30 detik
    multiplier: 3,       // income x3
    intervalMin: 120000,  // muncul minimal tiap 2 menit
    intervalMax: 300000,  // muncul maksimal tiap 5 menit
};

// ── Combo tap config ──────────────────────────────────────────────────
export const COMBO = {
    windowMs: 2000,    // window 2 detik
    threshold: 5,       // butuh 5 tap
    multiplier: 1.5,     // bonus x1.5
    durationMs: 3000,    // bonus aktif 3 detik
};
