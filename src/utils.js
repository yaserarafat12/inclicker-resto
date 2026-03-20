// ═══════════════════════════════════════════════════════
// INCLICKER: RESTO — utils.js
// Helper functions. Import dari sini, jangan duplikat di tempat lain.
// ═══════════════════════════════════════════════════════

import { UPGRADES, OFFLINE_CAP_SECONDS } from './constants';

// ── Format angka ─────────────────────────────────────────────────────
export function fmt(n) {
    if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}M`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}Jt`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}rb`;
    return `${Math.floor(n)}`;
}

export const fmtRp = (n) => `Rp ${fmt(n)}`;

// ── Nama upgrade berdasarkan level ───────────────────────────────────
export function upgName(upg, lv) {
    const idx = Math.min(Math.floor(lv / 2), upg.names.length - 1);
    return upg.names[idx];
}

// ── Biaya upgrade berikutnya ─────────────────────────────────────────
export function upgCost(upg, lv) {
    return Math.floor(upg.baseCost * Math.pow(1.45, lv));
}

// ── Income per detik dari semua upgrade ──────────────────────────────
export function calcIps(upgrades) {
    return UPGRADES.reduce((total, u) => {
        const lv = upgrades[u.id] || 0;
        if (!lv) return total;
        return total + u.baseIncome * lv * Math.pow(1.08, lv);
    }, 0);
}

// ── Income per tap ────────────────────────────────────────────────────
export function calcTapIncome(upgrades) {
    const totalLevels = Object.values(upgrades).reduce((s, l) => s + l, 0);
    return 5 + totalLevels * 2;
}

// ── Total semua level upgrade (untuk unlock chapters & menus) ─────────
export function calcTotalLevel(upgrades) {
    return Object.values(upgrades).reduce((s, l) => s + l, 0);
}

// ── Level terendah di antara semua upgrade (syarat pindah lokasi) ────
export function calcMinLevel(upgrades) {
    return Math.min(...UPGRADES.map((u) => upgrades[u.id] || 0));
}

// ── Offline income saat app dibuka kembali ───────────────────────────
// lastTimestamp: Unix ms dari localStorage
// ips: income per detik saat itu
export function calcOfflineIncome(lastTimestamp, ips) {
    if (!lastTimestamp || !ips) return 0;
    const now = Date.now();
    const elapsedSeconds = (now - lastTimestamp) / 1000;
    const cappedSeconds = Math.min(elapsedSeconds, OFFLINE_CAP_SECONDS);
    return ips * cappedSeconds;
}

// ── Save game ke localStorage ─────────────────────────────────────────
export function saveGame(state) {
    try {
        const data = {
            ...state,
            lastSaved: Date.now(),
        };
        localStorage.setItem('inclicker_save', JSON.stringify(data));
    } catch (e) {
        console.warn('Save failed:', e);
    }
}

// ── Load game dari localStorage ───────────────────────────────────────
export function loadGame() {
    try {
        const raw = localStorage.getItem('inclicker_save');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('Load failed:', e);
        return null;
    }
}

// ── Default state baru (saat tidak ada save) ─────────────────────────
export function defaultGameState(playerName = 'Player') {
    return {
        playerName,
        money: 500,
        totalEarned: 500,
        tapCount: 0,
        locIdx: 0,
        upgrades: { alat: 0, bahan: 0, tempat: 0, nyaman: 0, visib: 0 },
        unlockedChapters: [0],
        lastSaved: Date.now(),
    };
}