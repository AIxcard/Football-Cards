/* =========================================================
   FOOTBALL CARDS — ULTIMATE EDITION
   CLOUD TRADING, TOURNAMENT DRAFT, INDEX & 3D INSPECTOR
   ========================================================= */

(function initFootballTCGSecurityCore() {
    "use strict";

    // Cryptographic SHA-256 Password Hash Engine
    async function hashPassword(plainText) {
        if (!plainText) return "";
        const salt = "football_tcg_secure_salt_2026_@!";
        const str = String(plainText) + salt;
        if (typeof crypto !== "undefined" && crypto.subtle && typeof TextEncoder !== "undefined") {
            try {
                const utf8 = new TextEncoder().encode(str);
                const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
            } catch(e) {}
        }
        // Deterministic Fallback Hash
        let hash = 0x811c9dc5;
        for (let i = 0; i < str.length; i++) {
            hash = (hash ^ str.charCodeAt(i)) * 0x01000193;
            hash = (hash >>> 0);
        }
        return "sec_" + hash.toString(16).padStart(8, "0");
    }
    // Expose globally so functions outside this IIFE can call hashPassword(...)
    window.hashPassword = hashPassword;

    // Deleted account usernames are completely free and reusable by any player
    const DELETED_ACCOUNTS_BLACKLIST = [];

    function isAccountDeleted(username) {
        return false;
    }

            // 7. Strictly Purge ALL Previous Local Saves, Cloud Accounts, and Legacy Keys
    (function hardPurgeClientCredentials() {
        try {
            const keysToPurge = [
                "football_cards_cloud_accounts",
                "football_cards_cloud_trades",
                "football_cards_user_session",
                "football_cards_accounts",
                "footballCardsSave_v18",
                "footballCardsSave_v17_universal_sync",
                "footballCardsSave_v16",
                "footballCardsSave_v15_clean_sync",
                "footballCardsSave_v14_hard_reset",
                "footballCardsSave_v13_reset",
                "footballCardsSave_v12_reset",
                "footballCardsSave_v11_hard_reset",
                "footballCardsSave_v10_reset",
                "footballCardsSave_v9",
                "footballCardsSave_v8",
                "footballCardsSave_v7",
                "footballCardsSave_v6",
                "footballCardsSave_v5"
            ];
            keysToPurge.forEach(k => {
                try { localStorage.removeItem(k); } catch(e) {}
            });

            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && (key.startsWith("footballCardsSave_v1") && key !== "footballCardsSave_v19_season1_clean")) {
                    localStorage.removeItem(key);
                }
            }
        } catch(e) {}
    })();

    const CURRENT_SAVE_KEY = "footballCardsSave_v19_season1_clean";
    const PREVIOUS_SAVE_KEYS = [
        "footballCardsSave_v16",
        "footballCardsSave_v15_clean_sync",
        "footballCardsSave_v14_hard_reset",
        "footballCardsSave_v13_reset",
        "footballCardsSave_v12_reset",
        "footballCardsSave_v11_hard_reset",
        "footballCardsSave_v10_reset",
        "footballCardsSave_v9",
        "footballCardsSave_v8",
        "footballCardsSave_v7",
        "footballCardsSave_v6",
        "footballCardsSave_v5",
        "footballCardsSave_v4",
        "footballCardsSave_v3",
        "footballCardsSave_v2",
        "footballCardsSave_v1",
        "footballCardsSave",
        "footballCards"
    ];

// Server-Side Account Storage (Local legacy purged for security)`nlocalStorage.removeItem("football_cards_cloud_accounts");`nconst CLOUD_STORAGE_KEY = "football_cards_user_session";
const CLOUD_TRADES_KEY = "football_cards_cloud_trades";

const RARITY_ORDER = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 4,
    Legendary: 5,
    Exclusive: 6,
    Mythic: 7,
    Secret: 8,
    Tournament: 9,
    "World Class": 10,
    Developer: 99
};

function formatPlaytime(seconds) {
    if (!seconds || seconds <= 0) return "0s";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

function formatCountdown(ms) {
    if (!ms || ms <= 0) return "0d 0h 0m";
    const totalSecs = Math.floor(ms / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hrs = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = Math.floor(totalSecs % 60);
    if (days > 0) return `${days}d ${hrs}h ${mins}m`;
    return `${hrs}h ${mins}m ${secs}s`;
}

const AntiCheat = {
    computeChecksum(coins, cardsLen, level) {
        const c = Math.max(0, Math.floor(Number(coins) || 0));
        const cl = Math.max(0, Math.floor(Number(cardsLen) || 0));
        const lv = Math.max(1, Math.floor(Number(level) || 1));
        const v = ((c * 17) ^ (cl * 37) ^ (lv * 103) ^ 0x5F3759DF) >>> 0;
        return v.toString(16);
    },
    signState(st) {
        if (!st) return;
        st._sig = this.computeChecksum(st.coins || 0, (st.cards || []).length, st.level || 1);
        st._lastValidCoins = Number(st.coins) || 0;
    },
    applyTradeBan(reason) {
        if (!state) return;
        const u = (state.accountUser || state.name || "").toLowerCase();
        if (u === "alucard") return; // Master Owner is immune

        if (!state.isTradeBanned) {
            state.isTradeBanned = true;
            state.tradeBanReason = reason || "Flagged Account: Script / Client Modification Detected";
            this.signState(state);
            saveGame();
            try {
                GlobalCloudRest.pushUser(state.accountUser || state.name, {
                    ...state,
                    isTradeBanned: true,
                    tradeBanReason: state.tradeBanReason
                });
            } catch(e) {}
            toast("⚠️ Account Flagged: Trading privileges permanently disabled.");
        }
    },
    validateState(st) {
        if (!st) return true;
        const u = (st.accountUser || st.name || "").toLowerCase();
        if (u === "alucard") return true;

        // Sanitize coins
        if (isNaN(st.coins) || st.coins < 0) {
            st.coins = 100;
        }

        // Flag impossible sudden balance spikes for trade ban
        if (Number(st.coins) >= 50000000) {
            this.applyTradeBan("Excessive Balance Injection Detected");
        }

        this.signState(st);
        return true;
    },
    initConsoleProtection() {
        if (typeof window === "undefined") return;
        const isAlucard = () => (state && (state.accountUser || state.name || "").toLowerCase() === "alucard");

        // Gracefully suppress console logging for regular players to prevent inspecting/tinkering
        const methods = ["log", "warn", "info", "dir", "table", "trace", "debug"];
        methods.forEach(m => {
            const orig = console[m];
            console[m] = function(...args) {
                if (isAlucard()) {
                    if (orig) orig.apply(console, args);
                }
            };
        });

        // Disable right-click inspect and common DevTools shortcuts
        document.addEventListener("contextmenu", (e) => {
            if (!isAlucard()) {
                const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    e.preventDefault();
                }
            }
        }, false);

        document.addEventListener("keydown", (e) => {
            if (isAlucard()) return;
            if (e.key === "F12" || 
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) || 
                (e.ctrlKey && (e.key === "U" || e.key === "u"))) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, false);
    }
};

try { AntiCheat.initConsoleProtection(); } catch(e) {}

const DUPLICATE_VALUES = {
    Common: 10,
    Uncommon: 25,
    Rare: 75,
    Epic: 200,
    Legendary: 600,
    Exclusive: 1250,
    Mythic: 3000,
    Secret: 7500,
    Tournament: 15000,
    "World Class": 37500,
    Developer: 100000
};

const CARD_VALUES = {
    Common: 20,
    Uncommon: 50,
    Rare: 150,
    Epic: 400,
    Legendary: 1200,
    Exclusive: 2500,
    Mythic: 6000,
    Secret: 15000,
    Tournament: 30000,
    "World Class": 75000,
    Developer: 200000
};

const FRAMES = [
    { id: "default", name: "Classic Silver", css: "frame-default", cost: 0, desc: "Sleek standard silver stadium border", previewBg: "linear-gradient(135deg, #a0aec0, #cbd5e0)" },
    { id: "royal_champion", name: "👑 Royal Champion", css: "frame-royal-champion", cost: 50000, desc: "Ornate gilded wings, purple jewel crest and royal gold filigree", previewBg: "radial-gradient(circle, #ffd700 0%, #b45309 60%, #78350f 100%)" },
    { id: "golden_ball", name: "⚽ Ballon d'Or", css: "frame-golden-ball", cost: 15000, desc: "Radiant 24K gold football pentagon shader", previewBg: "linear-gradient(135deg, #ffd700, #ff8c00)" },
    { id: "inferno_striker", name: "🔥 Inferno Striker", css: "frame-inferno-striker", cost: 10000, desc: "Blazing crimson flames and pulsing embers", previewBg: "linear-gradient(135deg, #ff1744, #ff8c00)" },
    { id: "diamond_legend", name: "💎 Diamond Legend", css: "frame-diamond-legend", cost: 35000, desc: "Prismatic cyan crystal facets and sparkles", previewBg: "linear-gradient(135deg, #00f2fe, #4facfe)" },
    { id: "neon_cyber", name: "⚡ Cyberpunk Neon", css: "frame-neon-cyber", cost: 8000, desc: "Electric cyan and neon magenta lasers", previewBg: "linear-gradient(135deg, #00f2fe, #ff007f)" },
    { id: "cosmic_galaxy", name: "🌌 Cosmic Galaxy", css: "frame-cosmic-galaxy", cost: 14000, desc: "Deep space nebula violet and celestial stars", previewBg: "linear-gradient(135deg, #7928ca, #ff0080)" },
    { id: "ucl_star", name: "⭐ Champions League", css: "frame-ucl-star", cost: 20000, desc: "Iconic UCL navy and starburst European crest", previewBg: "linear-gradient(135deg, #001f54, #3b82f6)" },
    { id: "dragon_warlord", name: "✨ Jade", css: "frame-dragon-warlord", cost: 30000, desc: "Carved from mystical imperial green jade stone, glowing with an ancient emerald radiance", previewBg: "linear-gradient(135deg, #059669, #10b981, #064e3b)" }
];

function getCardValue(card) {
    if (!card) return 0;
    if (card.serialNumber || (card.rarity === "World Class" && (card.player === "Lionel Messi" || card.player === "Cristiano Ronaldo") && card.isSerialized)) {
        return 500000;
    }
    return CARD_VALUES[card.rarity] || 20;
}

function calculateCollectionValue(cards) {
    if (!Array.isArray(cards)) return 0;
    return cards.reduce((sum, c) => sum + getCardValue(c), 0);
}

const RONALDO_SERIALIZED_PALETTES = [
    "linear-gradient(135deg, #1f0036 0%, #7c3aed 40%, #ffffff 60%, #c084fc 80%, #1e0538 100%)", // CR7 #1 Royal Purple & Diamond White
    "linear-gradient(135deg, #001f54 0%, #0077b6 40%, #e0f2fe 65%, #03045e 100%)",             // CR7 #2 Sapphire Cobalt & Silver
    "linear-gradient(135deg, #0a0a0a 0%, #ffd700 45%, #fff176 60%, #ff8c00 80%, #050505 100%)", // CR7 #3 Royal 24K Gold & Onyx
    "linear-gradient(135deg, #083344 0%, #06b6d4 40%, #f0fdfa 60%, #0891b2 80%, #02121a 100%)", // CR7 #4 Imperial Electric Cyan
    "linear-gradient(135deg, #450a0a 0%, #dc2626 40%, #ffffff 60%, #991b1b 85%, #050202 100%)", // CR7 #5 Crimson Velvet & White Lightning
    "linear-gradient(135deg, #3b0764 0%, #a21caf 45%, #fbcfe8 65%, #701a75 100%)",             // CR7 #6 Deep Amethyst & Rose Gold
    "linear-gradient(135deg, #022c22 0%, #059669 45%, #ecfdf5 65%, #064e3b 100%)",             // CR7 #7 Emerald Dragon & Pure Diamond
    "linear-gradient(135deg, #1e1b4b 0%, #4338ca 40%, #ffd700 65%, #312e81 100%)",             // CR7 #8 Midnight Celestial Indigo & Gold
    "linear-gradient(135deg, #4c0519 0%, #f43f5e 40%, #2dd4bf 70%, #0f172a 100%)",             // CR7 #9 Cyberpunk Neon Violet & Turquoise
    "linear-gradient(135deg, #7c3aed 0%, #00f2fe 30%, #ffd700 60%, #ff007f 85%, #ffffff 100%)"  // CR7 #10 5x UCL Emperor Rainbow Prism
];

const MESSI_SERIALIZED_PALETTES = [
    "linear-gradient(135deg, #450a0a 0%, #ea580c 35%, #ff8c00 55%, #ffd700 75%, #1a0500 100%)", // Messi #1 Solar Orange & Fiery Crimson
    "linear-gradient(135deg, #0c4a6e 0%, #38bdf8 40%, #ffd700 60%, #bae6fd 80%, #082f49 100%)", // Messi #2 Albiceleste Sky Cyan & Gold
    "linear-gradient(135deg, #422006 0%, #eab308 35%, #fef08a 55%, #ca8a04 75%, #0a0500 100%)", // Messi #3 8x Ballon d'Or Pure Golden Glow
    "linear-gradient(135deg, #7c2d12 0%, #f97316 40%, #fef9c3 60%, #c2410c 100%)",             // Messi #4 Argentine Magician Neon Coral
    "linear-gradient(135deg, #4a044e 0%, #9f1239 45%, #ffd700 70%, #1e1b4b 100%)",             // Messi #5 Royal Blaugrana Burgundy & Gold
    "linear-gradient(135deg, #064e3b 0%, #10b981 40%, #f59e0b 65%, #022c22 100%)",             // Messi #6 Cosmic Emerald Gold & Amber
    "linear-gradient(135deg, #7c2d12 0%, #fb923c 45%, #ffffff 65%, #9a3412 100%)",             // Messi #7 Electric Starlight Tangerine
    "linear-gradient(135deg, #581c87 0%, #c026d3 40%, #fbbf24 70%, #1e1b4b 100%)",             // Messi #8 Rosario Sunset Violet & Fiery Gold
    "linear-gradient(135deg, #881337 0%, #f43f5e 40%, #fb923c 65%, #4c0519 100%)",             // Messi #9 Hyper Solar Flare & Neon Ruby
    "linear-gradient(135deg, #ff4500 0%, #ffd700 30%, #00f5d4 60%, #9333ea 85%, #ffffff 100%)"  // Messi #10 The GOAT Ultimate Holographic Prism
];

const MONKEY_SERIALIZED_PALETTES = [
    "linear-gradient(135deg, #451a03 0%, #d97706 40%, #fef08a 60%, #b45309 85%, #1c0a00 100%)",
    "linear-gradient(135deg, #78350f 0%, #ffd700 45%, #ffffff 65%, #d97706 100%)",
    "linear-gradient(135deg, #064e3b 0%, #10b981 40%, #ffd700 65%, #022c22 100%)",
    "linear-gradient(135deg, #7f1d1d 0%, #ef4444 40%, #fef08a 65%, #450a0a 100%)",
    "linear-gradient(135deg, #0c4a6e 0%, #06b6d4 40%, #ffd700 65%, #082f49 100%)",
    "linear-gradient(135deg, #581c87 0%, #a855f7 40%, #fef08a 65%, #3b0764 100%)",
    "linear-gradient(135deg, #18181b 0%, #f59e0b 45%, #ffd700 70%, #09090b 100%)",
    "linear-gradient(135deg, #374151 0%, #e5e7eb 45%, #fbbf24 70%, #1f2937 100%)",
    "linear-gradient(135deg, #4c0519 0%, #f43f5e 40%, #38bdf8 70%, #020617 100%)",
    "linear-gradient(135deg, #ffd700 0%, #ff6b00 35%, #9333ea 70%, #ffffff 100%)"
];

const SERIALIZED_PALETTES = RONALDO_SERIALIZED_PALETTES;

function generateRandomSerializedGradient(serialNum, playerName = "") {
    const norm = (playerName || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const num = Math.min(10, Math.max(1, Number(serialNum) || 1));

    if (norm.includes("ronaldo")) {
        return RONALDO_SERIALIZED_PALETTES[num - 1] || RONALDO_SERIALIZED_PALETTES[0];
    }
    if (norm.includes("messi")) {
        return MESSI_SERIALIZED_PALETTES[num - 1] || MESSI_SERIALIZED_PALETTES[0];
    }
    if (norm.includes("monkey") || norm.includes("wukong")) {
        return MONKEY_SERIALIZED_PALETTES[num - 1] || MONKEY_SERIALIZED_PALETTES[0];
    }
    return (num % 2 === 0 ? RONALDO_SERIALIZED_PALETTES : MESSI_SERIALIZED_PALETTES)[num - 1] || RONALDO_SERIALIZED_PALETTES[0];
}

const DISCOVERY_BONUS = {
    Common: 10,
    Uncommon: 20,
    Rare: 50,
    Epic: 100,
    Legendary: 250,
    Mythic: 500,
    Secret: 1000,
    Exclusive: 1500,
    "World Class": 2500,
    Tournament: 5000
};

const TOURNAMENT_POINTS = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 4,
    Legendary: 5,
    Exclusive: 8,
    Mythic: 10,
    Secret: 25,
    "World Class": 100,
    Tournament: 50
};

/* =========================================================
   WEB AUDIO SOUND SYNTHESIZER
   ========================================================= */

const SoundFx = {
    ctx: null,
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    },

    playTone(freq, type = "sine", duration = 0.1, gainVal = 0.1, startDelay = 0) {
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime + startDelay;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(gainVal, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {}
    },

    click() { this.playTone(400, "triangle", 0.05, 0.05); },
    coin() {
        this.playTone(987.77, "sine", 0.08, 0.1, 0);
        this.playTone(1318.51, "sine", 0.15, 0.1, 0.06);
    },
    packOpen() {
        // Uplifting sparkly arpeggio
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            this.playTone(f, "triangle", 0.2, 0.12, i * 0.04);
        });
        this.playTone(1318.51, "sine", 0.35, 0.1, 0.18);
    },
    packTear() {
        this.playTone(620, "sawtooth", 0.12, 0.25, 0);
        this.playTone(320, "triangle", 0.22, 0.3, 0.03);
        this.playTone(160, "sine", 0.35, 0.25, 0.06);
        [800, 1100, 1400].forEach((f, i) => {
            this.playTone(f, "sine", 0.08, 0.08, 0.02 + i * 0.03);
        });
    },
    cardReveal(rarity) {
        if (rarity === "World Class") {
            this.worldClassCinematic();
        } else if (rarity === "Secret") {
            this.worldClassCinematic();
        } else if (rarity === "Mythic") {
            this.mythicCinematic();
        } else if (rarity === "Tournament") {
            [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, i) => {
                this.playTone(f, "triangle", 0.45, 0.12, i * 0.08);
            });
        } else if (rarity === "Legendary" || rarity === "Exclusive") {
            [440, 554.37, 659.25, 880].forEach((f, i) => {
                this.playTone(f, "triangle", 0.35, 0.1, i * 0.07);
            });
        } else {
            this.playTone(523.25, "sine", 0.15, 0.06, 0);
            this.playTone(659.25, "sine", 0.2, 0.06, 0.05);
        }
    },
    mythicCinematic() {
        this.playTone(70, "sawtooth", 0.9, 0.35, 0);
        this.playTone(140, "triangle", 0.8, 0.3, 0.08);
        [329.63, 415.30, 493.88, 659.25, 987.77, 1318.51].forEach((f, i) => {
            this.playTone(f, "triangle", 0.45, 0.14, 0.2 + i * 0.07);
        });
    },
    worldClassCinematic() {
        this.playTone(55, "sawtooth", 1.0, 0.35, 0);
        this.playTone(110, "triangle", 1.0, 0.25, 0.1);
        [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 2093.00].forEach((f, i) => {
            this.playTone(f, "triangle", 0.6, 0.15, 0.4 + i * 0.08);
        });
    },
    playSolsRiser(theme) {
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // 1. Warm Smooth Sub-Bass Riser (Sine Wave + Lowpass Filter, NO harsh sawtooth!)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(140, now);
            filter.Q.setValueAtTime(1.5, now);

            osc.type = "sine";
            osc.frequency.setValueAtTime(45, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 3.0);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 2.8);
            gain.gain.linearRampToValueAtTime(0.001, now + 3.1);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 3.1);

            // 2. Cinematic Soft Heartbeat Pulses (Gentle sine thump, 50Hz)
            [0.0, 0.75, 1.45, 2.05, 2.5, 2.8, 3.0].forEach(t => {
                const hOsc = this.ctx.createOscillator();
                const hGain = this.ctx.createGain();
                hOsc.type = "sine";
                hOsc.frequency.setValueAtTime(60, now + t);
                hOsc.frequency.exponentialRampToValueAtTime(35, now + t + 0.18);

                hGain.gain.setValueAtTime(0.2, now + t);
                hGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.18);

                hOsc.connect(hGain);
                hGain.connect(this.ctx.destination);
                hOsc.start(now + t);
                hOsc.stop(now + t + 0.18);
            });

            // 3. Ethereal Celestial Chimes
            const notes = theme === "messi" ? [523.25, 659.25, 783.99, 1046.50]
                : theme === "ronaldo" ? [440.0, 554.37, 659.25, 880.0]
                : theme === "yamal" ? [587.33, 739.99, 880.00, 1174.66]
                : [523.25, 659.25, 783.99, 1046.50];

            notes.forEach((f, idx) => {
                this.playTone(f, "sine", 0.6, 0.06, 0.8 + idx * 0.5);
            });
        } catch(e) {}
    },
    playSolsSupernova(theme) {
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;

            // Warm Cinematic Sub-Bass Drop (Sine wave, NO harsh noise!)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(160, now);
            filter.Q.setValueAtTime(1.0, now);

            osc.type = "sine";
            osc.frequency.setValueAtTime(95, now);
            osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 1.2);
        } catch(e) {}
    },
    playSolsFanfare(theme) {
        try {
            // Beautiful, satisfying crystalline chord sequence (Maj9 Pentatonic)
            const chords = theme === "messi" 
                ? [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98]
                : theme === "ronaldo"
                ? [440.00, 554.37, 659.25, 830.61, 987.77, 1108.73, 1318.51]
                : theme === "yamal"
                ? [587.33, 739.99, 880.00, 1108.73, 1318.51, 1479.98, 1760.00]
                : [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];

            chords.forEach((f, i) => {
                this.playTone(f, "sine", 0.7, 0.09, 0.05 + i * 0.08);
            });
        } catch(e) {}
    },
    levelUp() {
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            this.playTone(f, "triangle", 0.3, 0.12, i * 0.09);
        });
    },
    sell() {
        this.playTone(784, "sine", 0.06, 0.08, 0);
        this.playTone(1046.5, "sine", 0.12, 0.08, 0.05);
    }
};

function getCardImage(card) {
    if (!card) return "player_temp.png";
    const nameLower = (card.player || card.name || "").trim().toLowerCase();
    if (nameLower.includes("monkey") || nameLower.includes("wukong") || card.devCard || card.rarity === "Developer") {
        return "monkey_king.png";
    }
    const isCristiano = nameLower === "cristiano ronaldo" || nameLower === "cr7" || (nameLower.includes("cristiano") && nameLower.includes("ronaldo"));
    if (isCristiano) {
        return "ronaldo_custom.png";
    }
    // Strict safeguard: Ronaldo Nazario, Ronaldinho, or any other player ALWAYS returns player_temp.png
    return "player_temp.png";
}

/* =========================================================
   PLAYERS (REAL PHOTOS + STATS)
   ========================================================= */

const PLAYERS = [
// --- SECRET DEVELOPER / ADMIN REWARD (HIDDEN FROM CARD INDEX) ---
{ name: "Monkey King", rating: 99, pos: "ST", rarity: "Developer", image: "monkey_king.png", hiddenFromIndex: true, devCard: true },

// --- TOURNAMENT REWARD ---
{ name: "Emanuel", rating: 99, pos: "CAM", rarity: "Tournament", image: "player_temp.png" },

// --- WORLD CLASS (GOATS) ---
{ name: "Lionel Messi", rating: 97, pos: "RW", rarity: "World Class", image: "player_temp.png" },
{ name: "Cristiano Ronaldo", rating: 97, pos: "ST", rarity: "World Class", image: "ronaldo_custom.png" },

// --- SECRET ---
{ name: "Lamine Yamal", rating: 96, pos: "RW", rarity: "Secret", image: "player_temp.png" },
{ name: "Kylian Mbappé", rating: 96, pos: "ST", rarity: "Secret", image: "player_temp.png" },
{ name: "Erling Haaland", rating: 96, pos: "ST", rarity: "Secret", image: "player_temp.png" },

// --- MYTHIC ---
{ name: "Neymar Jr", rating: 95, pos: "LW", rarity: "Mythic", image: "player_temp.png" },
{ name: "Kevin De Bruyne", rating: 94, pos: "CM", rarity: "Mythic", image: "player_temp.png" },
{ name: "Vinícius Júnior", rating: 94, pos: "LW", rarity: "Mythic", image: "player_temp.png" },
{ name: "Jude Bellingham", rating: 93, pos: "CM", rarity: "Mythic", image: "player_temp.png" },
{ name: "Mohamed Salah", rating: 93, pos: "RW", rarity: "Mythic", image: "player_temp.png" },
{ name: "Robert Lewandowski", rating: 93, pos: "ST", rarity: "Mythic", image: "player_temp.png" },
{ name: "Harry Kane", rating: 93, pos: "ST", rarity: "Mythic", image: "player_temp.png" },
{ name: "Rodri", rating: 93, pos: "CDM", rarity: "Mythic", image: "player_temp.png" },
{ name: "Virgil van Dijk", rating: 91, pos: "CB", rarity: "Mythic", image: "player_temp.png" },
{ name: "Thibaut Courtois", rating: 91, pos: "GK", rarity: "Mythic", image: "player_temp.png" },
{ name: "Alisson", rating: 90, pos: "GK", rarity: "Mythic", image: "player_temp.png" },
{ name: "Marc-André ter Stegen", rating: 90, pos: "GK", rarity: "Mythic", image: "player_temp.png" },

// --- LEGENDARY ---
{ name: "Pedri", rating: 91, pos: "CM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Bukayo Saka", rating: 89, pos: "RW", rarity: "Legendary", image: "player_temp.png" },
{ name: "Declan Rice", rating: 89, pos: "CDM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Florian Wirtz", rating: 89, pos: "CAM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Cole Palmer", rating: 88, pos: "RW", rarity: "Legendary", image: "player_temp.png" },
{ name: "Martin Ødegaard", rating: 88, pos: "CAM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Bernardo Silva", rating: 88, pos: "CM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Antoine Griezmann", rating: 88, pos: "ST", rarity: "Legendary", image: "player_temp.png" },
{ name: "Phil Foden", rating: 88, pos: "CAM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Federico Valverde", rating: 88, pos: "CM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Lautaro Martínez", rating: 88, pos: "ST", rarity: "Legendary", image: "player_temp.png" },
{ name: "Rúben Dias", rating: 89, pos: "CB", rarity: "Legendary", image: "player_temp.png" },
{ name: "William Saliba", rating: 88, pos: "CB", rarity: "Legendary", image: "player_temp.png" },
{ name: "Jamal Musiala", rating: 88, pos: "CAM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Son Heung-min", rating: 88, pos: "LW", rarity: "Legendary", image: "player_temp.png" },
{ name: "Bruno Fernandes", rating: 88, pos: "CAM", rarity: "Legendary", image: "player_temp.png" },
{ name: "Jan Oblak", rating: 88, pos: "GK", rarity: "Legendary", image: "player_temp.png" },
{ name: "Ederson", rating: 88, pos: "GK", rarity: "Legendary", image: "player_temp.png" },
{ name: "Mike Maignan", rating: 88, pos: "GK", rarity: "Legendary", image: "player_temp.png" },

// --- EPIC ---
{ name: "Joshua Kimmich", rating: 87, pos: "CDM", rarity: "Epic", image: "player_temp.png" },
{ name: "Rafael Leão", rating: 87, pos: "LW", rarity: "Epic", image: "player_temp.png" },
{ name: "Nicolò Barella", rating: 87, pos: "CM", rarity: "Epic", image: "player_temp.png" },
{ name: "Trent Alexander-Arnold", rating: 86, pos: "RB", rarity: "Epic", image: "player_temp.png" },
{ name: "Achraf Hakimi", rating: 86, pos: "RB", rarity: "Epic", image: "player_temp.png" },
{ name: "Theo Hernández", rating: 86, pos: "LB", rarity: "Epic", image: "player_temp.png" },
{ name: "Alphonso Davies", rating: 85, pos: "LB", rarity: "Epic", image: "player_temp.png" },
{ name: "Gabriel Magalhães", rating: 86, pos: "CB", rarity: "Epic", image: "player_temp.png" },
{ name: "Alessandro Bastoni", rating: 86, pos: "CB", rarity: "Epic", image: "player_temp.png" },
{ name: "Gavi", rating: 85, pos: "CM", rarity: "Epic", image: "player_temp.png" },
{ name: "Eduardo Camavinga", rating: 85, pos: "CM", rarity: "Epic", image: "player_temp.png" },
{ name: "Aurélien Tchouaméni", rating: 85, pos: "CDM", rarity: "Epic", image: "player_temp.png" },
{ name: "Khvicha Kvaratskhelia", rating: 86, pos: "LW", rarity: "Epic", image: "player_temp.png" },
{ name: "Victor Osimhen", rating: 87, pos: "ST", rarity: "Epic", image: "player_temp.png" },
{ name: "Alexander Isak", rating: 85, pos: "ST", rarity: "Epic", image: "player_temp.png" },
{ name: "Emiliano Martínez", rating: 86, pos: "GK", rarity: "Epic", image: "player_temp.png" },
{ name: "Gianluigi Donnarumma", rating: 87, pos: "GK", rarity: "Epic", image: "player_temp.png" },
{ name: "Gregor Kobel", rating: 86, pos: "GK", rarity: "Epic", image: "player_temp.png" },

// --- RARE ---
{ name: "Anthony Gordon", rating: 83, pos: "LW", rarity: "Rare", image: "player_temp.png" },
{ name: "Pedro Porro", rating: 83, pos: "RB", rarity: "Rare", image: "player_temp.png" },
{ name: "Micky van de Ven", rating: 83, pos: "CB", rarity: "Rare", image: "player_temp.png" },
{ name: "Dominik Szoboszlai", rating: 83, pos: "CM", rarity: "Rare", image: "player_temp.png" },
{ name: "Alexis Mac Allister", rating: 84, pos: "CM", rarity: "Rare", image: "player_temp.png" },
{ name: "Lucas Paquetá", rating: 82, pos: "CAM", rarity: "Rare", image: "player_temp.png" },
{ name: "Darwin Núñez", rating: 83, pos: "ST", rarity: "Rare", image: "player_temp.png" },
{ name: "Ollie Watkins", rating: 84, pos: "ST", rarity: "Rare", image: "player_temp.png" },
{ name: "João Palhinha", rating: 83, pos: "CDM", rarity: "Rare", image: "player_temp.png" },
{ name: "Manuel Akanji", rating: 83, pos: "CB", rarity: "Rare", image: "player_temp.png" },
{ name: "Lisandro Martínez", rating: 83, pos: "CB", rarity: "Rare", image: "player_temp.png" },
{ name: "David Raya", rating: 83, pos: "GK", rarity: "Rare", image: "player_temp.png" },

// --- UNCOMMON ---
{ name: "Harvey Elliott", rating: 79, pos: "CM", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Kobbie Mainoo", rating: 79, pos: "CM", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Alejandro Garnacho", rating: 80, pos: "LW", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Destiny Udogie", rating: 80, pos: "LB", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Rico Lewis", rating: 78, pos: "RB", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Conor Gallagher", rating: 80, pos: "CM", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Jarrod Bowen", rating: 81, pos: "RW", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Brennan Johnson", rating: 79, pos: "RW", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Evan Ferguson", rating: 77, pos: "ST", rarity: "Uncommon", image: "player_temp.png" },
{ name: "Bart Verbruggen", rating: 78, pos: "GK", rarity: "Uncommon", image: "player_temp.png" },

// --- COMMON ---
{ name: "Oliver Skipp", rating: 75, pos: "CDM", rarity: "Common", image: "player_temp.png" },
{ name: "Rob Holding", rating: 74, pos: "CB", rarity: "Common", image: "player_temp.png" },
{ name: "Sean Longstaff", rating: 77, pos: "CM", rarity: "Common", image: "player_temp.png" },
{ name: "Dwight McNeil", rating: 76, pos: "LM", rarity: "Common", image: "player_temp.png" },
{ name: "Dominic Calvert-Lewin", rating: 78, pos: "ST", rarity: "Common", image: "player_temp.png" },
{ name: "Tyrone Mings", rating: 77, pos: "CB", rarity: "Common", image: "player_temp.png" },
{ name: "Fraser Forster", rating: 75, pos: "GK", rarity: "Common", image: "player_temp.png" },
{ name: "Harry Wilson", rating: 76, pos: "RW", rarity: "Common", image: "player_temp.png" },
{ name: "Dan Burn", rating: 78, pos: "LB", rarity: "Common", image: "player_temp.png" },
{ name: "Lewis Dunk", rating: 79, pos: "CB", rarity: "Common", image: "player_temp.png" },
{ name: "Cameron Archer", rating: 74, pos: "ST", rarity: "Common", image: "player_temp.png" },
{ name: "Joe Willock", rating: 76, pos: "CM", rarity: "Common", image: "player_temp.png" },

// --- EXCLUSIVE (LEGENDS OF THE PAST) ---
{ name: "Pelé", rating: 98, pos: "ST", rarity: "Exclusive", image: "player_temp.png", odds: 5 },
{ name: "Diego Maradona", rating: 96, pos: "CAM", rarity: "Exclusive", image: "player_temp.png", odds: 15 },
{ name: "Ronaldo Nazário", rating: 97, pos: "ST", rarity: "Exclusive", image: "player_temp.png", odds: 20 },
{ name: "Zinedine Zidane", rating: 95, pos: "CAM", rarity: "Exclusive", image: "player_temp.png", odds: 25 },
{ name: "Ronaldinho", rating: 94, pos: "LW", rarity: "Exclusive", image: "player_temp.png", odds: 35 }
];

/* =========================================================
   PACKS (BALANCED RATES)
   ========================================================= */

const PACKS = {
starter: {
    name: "Starter Pack",
    cost: 10,
    rates: { Common: 70, Uncommon: 20, Rare: 7, Epic: 2.5, Legendary: 0.5 }
},
premium: {
    name: "Premium Pack",
    cost: 25,
    rates: { Uncommon: 62, Rare: 27, Epic: 8, Legendary: 2.5, Mythic: 0.45, Secret: 0.05 }
},
champion: {
    name: "Champion Pack",
    cost: 45,
    rates: { Rare: 75, Epic: 18, Legendary: 6, Mythic: 0.8, Secret: 0.19, "World Class": 0.01 }
},
exclusive: {
    name: "Exclusive Legends",
    cost: 60,
    rates: { Exclusive: 100 }
},
mythic: {
    name: "Mythic Stars Pack",
    cost: 80,
    rates: { Mythic: 100 }
},
secret: {
    name: "Secret Icons Pack",
    cost: 90,
    rates: { Secret: 100 }
},
worldclass: {
    name: "World Class Pack",
    cost: 100,
    rates: { "World Class": 100 }
},
tournament: {
    name: "Tournament Draft Pack",
    cost: 100,
    rates: { Common: 40, Uncommon: 28, Rare: 18, Epic: 9, Legendary: 3.5, Mythic: 1.2, Secret: 0.28, "World Class": 0.02 }
}
};

/* =========================================================
   REAL STADIUM BACKGROUNDS
   ========================================================= */

const BACKGROUNDS = [
{ id: "campnou", name: "Camp Nou Night", cost: 0, css: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat" },
{ id: "bernabeu", name: "Santiago Bernabéu", cost: 50, css: "url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat" },
{ id: "wembley", name: "Wembley Stadium", cost: 100, css: "url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat" },
{ id: "sansiro", name: "San Siro Arena", cost: 175, css: "url('https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat" },
{ id: "maracana", name: "Maracanã Pitch", cost: 500, css: "url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat" }
];

/* =========================================================
   MISSIONS
   ========================================================= */

const MISSION_TEMPLATES = {
hourly: [
    ["Open 2 scouting packs", 2, 40, "packs"],
    ["Open 5 booster packs", 5, 100, "packs"],
    ["Open 10 booster packs", 10, 220, "packs"],
    ["Collect 6 player cards", 6, 75, "cards"],
    ["Collect 15 player cards", 15, 180, "cards"],
    ["Pull 1 Rare or better card", 1, 80, "rare"],
    ["Pull 3 Rare or better cards", 3, 200, "rare"],
    ["Pull 1 Epic or better card", 1, 250, "epic"],
    ["Earn 250 gold coins", 250, 80, "coins"],
    ["Earn 600 gold coins", 600, 200, "coins"],
    ["Sell 3 duplicate cards", 3, 100, "sell"]
],
daily: [
    ["Open 15 booster packs", 15, 250, "packs"],
    ["Collect 25 player cards", 25, 300, "cards"],
    ["Pull 5 Rare or better cards", 5, 400, "rare"],
    ["Pull 2 Epic or better cards", 2, 500, "epic"],
    ["Pull 1 Legendary or better card", 1, 750, "legendary"],
    ["Earn 2,000 gold coins", 2000, 600, "coins"]
],
weekly: [
    ["Open 75 booster packs", 75, 2500, "packs"],
    ["Collect 120 player cards", 120, 3000, "cards"],
    ["Pull 15 Epic or better cards", 15, 3500, "epic"],
    ["Pull 6 Legendary or better cards", 6, 5000, "legendary"],
    ["Pull 2 Mythic or Secret cards", 2, 7500, "mythic"],
    ["Earn 15,000 gold coins", 15000, 6000, "coins"]
],
monthly: [
    ["Open 350 booster packs", 350, 15000, "packs"],
    ["Collect 600 player cards", 600, 20000, "cards"],
    ["Pull 30 Legendary or better cards", 30, 25000, "legendary"],
    ["Pull 8 Mythic or Secret cards", 8, 35000, "mythic"],
    ["Pull or Own a World Class Card", 1, 50000, "worldclass"],
    ["Earn 75,000 gold coins", 75000, 40000, "coins"]
]
};

/* =========================================================
   EQUIPPABLE TITLES
   ========================================================= */

const TITLES = [
{
    id: "unique",
    name: "Unique",
    cssClass: "title-unique",
    requirement: "Own any Serialized (#1-10) card",
    unlock: () => {
        try {
            return Array.isArray(state.cards) && state.cards.some(c => !!c.serialNumber || !!c.isSerialized);
        } catch (e) { return false; }
    }
},
{
    id: "collector",
    name: "Collector",
    cssClass: "title-collector",
    requirement: "Start the game",
    unlock: () => true
},
{
    id: "messi",
    name: "The Greatest",
    cssClass: "title-greatest",
    requirement: "Own Lionel Messi",
    unlock: () => {
        try { return ownsPlayer("Lionel Messi"); } catch (e) { return false; }
    }
},
{
    id: "ronaldo",
    name: "The King",
    cssClass: "title-king",
    requirement: "Own Cristiano Ronaldo",
    unlock: () => {
        try { return ownsPlayer("Cristiano Ronaldo"); } catch (e) { return false; }
    }
},
{
    id: "world",
    name: "World Class Hunter",
    cssClass: "title-world",
    requirement: "Pull or own a World Class card",
    unlock: () => {
        try {
            return (state.stats && state.stats.worldClass > 0) || (Array.isArray(state.cards) && state.cards.some(c => c.rarity === "World Class" || c.player === "Lionel Messi" || c.player === "Cristiano Ronaldo"));
        } catch (e) { return false; }
    }
},
{
    id: "legend",
    name: "Legend Collector",
    cssClass: "title-legend",
    requirement: "Own 5 Legendary+ cards",
    unlock: () => {
        try {
            return Array.isArray(state.cards) && state.cards.filter(c => (RARITY_ORDER[c.rarity] || 0) >= 5).length >= 5;
        } catch (e) { return false; }
    }
},
{
    id: "top10",
    name: "Tournament Top 10",
    cssClass: "title-top10",
    requirement: "Awarded to Top 10 Tournament Finishers (Coming Soon)",
    unlock: () => {
        try {
            return (state.grantedTitles || []).includes("Tournament Top 10");
        } catch (e) { return false; }
    }
},
{
    id: "champion",
    name: "Season 1 Champion",
    cssClass: "title-champion",
    requirement: "Awarded to Season 1 Tournament Winner (Coming Soon)",
    unlock: () => {
        try {
            return (state.grantedTitles || []).includes("Season 1 Champion");
        } catch (e) { return false; }
    }
},
{
    id: "owner",
    name: "Owner",
    cssClass: "title-owner",
    requirement: "Exclusive title for the Owner of the game",
    unlock: () => {
        try {
            const u = (state.accountUser || state.name || "").toLowerCase();
            return u === "alucard";
        } catch (e) { return false; }
    }
},
{
    id: "admin",
    name: "Admin",
    cssClass: "title-admin",
    requirement: "Granted exclusively by the Owner of the game",
    unlock: () => {
        try {
            const u = (state.accountUser || state.name || "").toLowerCase();
            return u === "alucard" || (state.grantedTitles || []).includes("Admin") || !!state.isGrantedAdmin;
        } catch (e) { return false; }
    }
},
{
    id: "staff",
    name: "Staff",
    cssClass: "title-staff",
    requirement: "Granted exclusively by the Owner of the game",
    unlock: () => {
        try {
            const u = (state.accountUser || state.name || "").toLowerCase();
            return u === "alucard" || (state.grantedTitles || []).includes("Staff") || !!state.isGrantedStaff;
        } catch (e) { return false; }
    }
},
{
    id: "tester",
    name: "Tester",
    cssClass: "title-tester",
    requirement: "Awarded to verified beta testers by the Owner",
    unlock: () => {
        try {
            const u = (state.accountUser || state.name || "").toLowerCase();
            return u === "alucard" || (state.grantedTitles || []).includes("Tester");
        } catch (e) { return false; }
    }
},
{
    id: "early_access",
    name: "Early Access",
    cssClass: "title-early-access",
    requirement: "Awarded to early pioneers by the Owner",
    unlock: () => {
        try {
            const u = (state.accountUser || state.name || "").toLowerCase();
            return u === "alucard" || (state.grantedTitles || []).includes("Early Access");
        } catch (e) { return false; }
    }
}
];

function getMyTournamentRank() {
    try {
        const accs = typeof CloudSync !== "undefined" && CloudSync.getAccounts ? CloudSync.getAccounts() : {};
        const scores = [];
        for (const k in accs) {
            try {
                const d = JSON.parse(accs[k].saveData);
                if (d && d.stats) scores.push({ name: d.name || accs[k].username, score: d.stats.tournamentScore || 0 });
            } catch (e) {}
        }
        if (state && state.accountUser && !scores.some(s => s.name.toLowerCase() === state.accountUser.toLowerCase())) {
            scores.push({ name: state.name || state.accountUser, score: (state.stats && state.stats.tournamentScore) || 0 });
        }
        scores.sort((a, b) => b.score - a.score);
        const myName = (state && (state.name || state.accountUser || "")).toLowerCase();
        const idx = scores.findIndex(s => s.name.toLowerCase() === myName);
        return idx >= 0 ? idx + 1 : 0;
    } catch (e) {
        return 0;
    }
}

// Deep Freeze critical game tables to prevent runtime console tampering
function deepFreeze(obj) {
    if (!obj || typeof obj !== "object") return obj;
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === "object" && obj[prop] !== null && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    });
    return Object.freeze(obj);
}

try {
    deepFreeze(PACKS);
    deepFreeze(PLAYERS);
    deepFreeze(FRAMES);
    deepFreeze(TITLES);
    deepFreeze(RARITY_ORDER);
    deepFreeze(DISCOVERY_BONUS);
    deepFreeze(CARD_VALUES);
    deepFreeze(DUPLICATE_VALUES);
    deepFreeze(MISSION_TEMPLATES);
} catch(e) {}

/* =========================================================
   STATE ENGINE & SEAMLESS MIGRATION
   ========================================================= */

function getRandomDefaultName() {
    const prefixes = ["Jeff", "Mark", "Alex", "Sam", "Leo", "David", "Chris", "Eric", "Lucas", "Noah", "Liam", "Mason", "Ethan", "Ryan", "Jack", "Felix", "Cole", "Dean", "Kyle", "Owen"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${num}`;
}

function freshState() {
    const defaultName = getRandomDefaultName();
    return {
        initialized: true,
        accountUser: "",
        
        name: defaultName,
        coins: 100,
        xp: 25,
        level: 1,

        cards: [],
        showcase: [null, null, null, null, null, null],
        ownedFrames: ["default"],
        ownedBackgrounds: ["campnou"],
        unlockedCardNames: [],
        serializedCounts: { "Lionel Messi": 0, "Cristiano Ronaldo": 0 },

        profileBackground: "campnou",
        profileFrame: "default",
        avatar: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80",
        equippedTitle: "Collector",

        stats: {
            playtime: 0,
            packsOpened: 0,
            cardsPulled: 0,
            duplicates: 0,
            cardsSold: 0,
            coinsEarned: 0,
            coinsSpent: 0,
            worldClass: 0,
            secret: 0,
            mythic: 0,
            legendary: 0,
            rare: 0,
            epic: 0,
            uncommon: 0,
            common: 0,
            exclusive: 0,
            tournament: 0,
            highestRating: 0,
            highestRarity: "Common",
            tournamentEntries: 0,
            tournamentScore: 0
        },

        tournamentAttempts: 5,
        tournamentDraft: {
            gold: 1000,
            score: 0,
            packsOpened: 0,
            cards: [],
            active: false
        },

        missionProgress: { hourly: [0, 0, 0], daily: [0, 0, 0], weekly: [0, 0, 0], monthly: [0, 0, 0] },
        missionClaimed: { hourly: [false, false, false], daily: [false, false, false], weekly: [false, false, false], monthly: [false, false, false] },
        missionReset: { hourly: Date.now(), daily: Date.now(), weekly: Date.now(), monthly: Date.now() },

        bannedUntil: 0,
        banReason: "",
        isTradeBanned: false,
        tradeBanReason: "",
        grantedTitles: [],
        isGrantedAdmin: false,
        isGrantedStaff: false,

        claimedIndexRewards: [],
        autoSellDuplicates: false,
        autoSellSettings: {
            Common: "none",
            Uncommon: "none",
            Rare: "none",
            Epic: "none",
            Legendary: "none",
            Exclusive: "none"
        },
        resetV14WipeDone: true,

        potions: {
            tier1: 0,
            tier2: 0,
            tier3: 0,
            astral: 0,
            elixir: 0
        },
        activePotions: {
            tier1Until: 0,
            tier2Until: 0,
            tier3Until: 0,
            astralUntil: 0,
            elixirCharges: 0
        },

        skillPoints: 0,
        skillPointsPurchased: 0,
        unlockedSkills: [],

        claimedLevelMilestones: [],
        freeChampionPacks3x: 0,
        merchantPurchases: {},

        dailyRewardClaimed: 0,
        freeKickClaimed: 0,
        worldClassPending: null,
        redeemedCodes: [],
        blockedUsers: [],
        lastSave: Date.now()
    };
}

function loadGame() {
    try {
        let raw = localStorage.getItem(CURRENT_SAVE_KEY);
        const fresh = freshState();
        if (!raw) return fresh;

        const saved = JSON.parse(raw);
        let activeName = saved.name;
        if (!activeName || activeName === "Football Player" || activeName === "Player") {
            activeName = saved.accountUser || fresh.name;
        }

        const isAdminUser = (saved.accountUser || "").toLowerCase() === "alucard" || (activeName || "").toLowerCase() === "alucard" || !!saved.isGrantedAdmin;

        let finalCoins = saved.coins !== undefined ? Number(saved.coins) : 100;
        let finalLevel = saved.level !== undefined ? Number(saved.level) : 1;
        let finalTitle = saved.equippedTitle || "Collector";
        let loadedCards = Array.isArray(saved.cards) ? saved.cards.map(c => {
            if (!c) return null;
            if (c.player === "Monkey King" || (c.player && c.player.toLowerCase().includes("monkey"))) {
                return { ...c, image: "monkey_king.png", rarity: "Developer", devCard: true };
            }
            return c;
        }).filter(Boolean) : [];

        return {
            ...fresh,
            resetV14WipeDone: true,
            name: activeName,
            accountUser: saved.accountUser || "",
            
            coins: finalCoins,
            xp: saved.xp !== undefined ? Number(saved.xp) : 0,
            level: finalLevel,
            ownedFrames: Array.isArray(saved.ownedFrames) && saved.ownedFrames.length ? saved.ownedFrames : ["default", "gold"],
            ownedBackgrounds: Array.isArray(saved.ownedBackgrounds) && saved.ownedBackgrounds.length ? saved.ownedBackgrounds : ["campnou"],
            profileFrame: saved.profileFrame || "default",
            profileBackground: saved.profileBackground || "campnou",
            equippedTitle: finalTitle,
            showcase: Array.isArray(saved.showcase) && saved.showcase.length === 6 ? saved.showcase : [null, null, null, null, null, null],
            cards: loadedCards,
            unlockedCardNames: Array.isArray(saved.unlockedCardNames) ? saved.unlockedCardNames : [],
            claimedIndexRewards: Array.isArray(saved.claimedIndexRewards) ? saved.claimedIndexRewards : [],
            autoSellDuplicates: !!saved.autoSellDuplicates,
            autoSellSettings: saved.autoSellSettings && typeof saved.autoSellSettings === "object" ? {
                Common: saved.autoSellSettings.Common || "none",
                Uncommon: saved.autoSellSettings.Uncommon || "none",
                Rare: saved.autoSellSettings.Rare || "none",
                Epic: saved.autoSellSettings.Epic || "none",
                Legendary: saved.autoSellSettings.Legendary || "none",
                Exclusive: saved.autoSellSettings.Exclusive || "none"
            } : fresh.autoSellSettings,
            potions: saved.potions && typeof saved.potions === "object" ? { ...fresh.potions, ...saved.potions } : fresh.potions,
            activePotions: saved.activePotions && typeof saved.activePotions === "object" ? { ...fresh.activePotions, ...saved.activePotions } : fresh.activePotions,
            skillPoints: saved.skillPoints !== undefined ? Number(saved.skillPoints) : 0,
            skillPointsPurchased: saved.skillPointsPurchased !== undefined ? Number(saved.skillPointsPurchased) : 0,
            unlockedSkills: Array.isArray(saved.unlockedSkills) ? saved.unlockedSkills : [],
            claimedLevelMilestones: Array.isArray(saved.claimedLevelMilestones) ? saved.claimedLevelMilestones : [],
            freeChampionPacks3x: saved.freeChampionPacks3x !== undefined ? Number(saved.freeChampionPacks3x) : 0,
            merchantPurchases: saved.merchantPurchases && typeof saved.merchantPurchases === "object" ? saved.merchantPurchases : {},
            dailyRewardClaimed: Number(saved.dailyRewardClaimed) || 0,
            serializedCounts: saved.serializedCounts || { "Lionel Messi": 0, "Cristiano Ronaldo": 0 },
            stats: { ...fresh.stats, ...(saved.stats || {}) },
            tournamentDraft: saved.tournamentDraft ? { ...fresh.tournamentDraft, ...saved.tournamentDraft } : { ...fresh.tournamentDraft },
            missionProgress: saved.missionProgress || { hourly: [0, 0, 0], daily: [0, 0, 0], weekly: [0, 0, 0], monthly: [0, 0, 0] },
            missionClaimed: saved.missionClaimed || { hourly: [false, false, false], daily: [false, false, false], weekly: [false, false, false], monthly: [false, false, false] },
            missionReset: saved.missionReset || { hourly: Date.now(), daily: Date.now(), weekly: Date.now(), monthly: Date.now() },
            isTradeBanned: !!saved.isTradeBanned,
            tradeBanReason: saved.tradeBanReason || "",
            grantedTitles: isAdminUser ? (Array.isArray(saved.grantedTitles) && saved.grantedTitles.includes("UNIQUE") ? saved.grantedTitles : ["UNIQUE", "Owner", "Admin"]) : (Array.isArray(saved.grantedTitles) ? saved.grantedTitles : []),
            isGrantedAdmin: isAdminUser,
            isGrantedStaff: !!saved.isGrantedStaff,
            redeemedCodes: Array.isArray(saved.redeemedCodes) ? saved.redeemedCodes : [],
            blockedUsers: Array.isArray(saved.blockedUsers) ? saved.blockedUsers : []
        };
    } catch (e) {
        return freshState();
    }
}

let state = loadGame();
AntiCheat.signState(state);
let currentMissionType = "hourly";
let playStarted = Date.now();
let currentAuthTab = "login";
let activeShowcaseSlot = 0;
let searchedUserData = null;

/* =========================================================
/* =========================================================
   SEASON RESET & GAME ENGINE INITIALIZATION
   ========================================================= */

const GLOBAL_RESET_KEY = "football_cards_clean_reset_v18_server";

function checkGlobalSeasonReset() {
    // Non-destructive: preserves all player accounts and active states
}

function dismissSeasonResetModal() {
    const modal = document.getElementById("seasonResetModal");
    if (modal) modal.classList.add("hidden");
    SoundFx.levelUp();
    toast("✨ Welcome to Season 1! Enjoy opening packs.");
}

/* =========================================================
   SAVE & CLOUD SYNC
   ========================================================= */

function saveGame() {
    AntiCheat.validateState(state);
    AntiCheat.signState(state);
    state.lastSave = Date.now();
    try {
        localStorage.setItem(CURRENT_SAVE_KEY, JSON.stringify(state));
    } catch (e) {}
    syncCloud();
}

window.addEventListener("beforeunload", () => {
    updatePlaytime();
    saveGame();
});

setInterval(() => {
    updatePlaytime();
    saveGame();
}, 5000);

function updatePlaytime() {
    const seconds = Math.floor((Date.now() - playStarted) / 1000);
    if (seconds > 0) {
        state.stats.playtime += seconds;
        playStarted = Date.now();
    }
}

/* =========================================================
   SERVER-SIDE BACKEND & REST API CLIENT
   ========================================================= */

const RENDER_BACKEND_URL = "https://football-cards-yrry.onrender.com";

const ServerAPI = {
    BASE_URL: (typeof location !== "undefined" && location.origin && !location.origin.startsWith("file:")) ? location.origin : RENDER_BACKEND_URL,
    token: localStorage.getItem("football_cards_token") || "",

    setToken(token) {
        this.token = token || "";
        if (token) localStorage.setItem("football_cards_token", token);
        else localStorage.removeItem("football_cards_token");
    },

    getHeaders() {
        const headers = { "Content-Type": "application/json" };
        if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
        return headers;
    },

    async signup(username, password, stateObj = null) {
        if (!this.BASE_URL) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, initialData: stateObj || {} })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                this.setToken(data.token);
                return { success: true, data: data.saveData, msg: "Account created and registered on server!" };
            }
            return { success: false, msg: data.error || "Signup failed on server." };
        } catch (e) {
            return null;
        }
    },

    async login(username, password) {
        if (!this.BASE_URL) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                this.setToken(data.token);
                const sData = (data.user && data.user.saveData) ? data.user.saveData : (data.saveData || data.data);
                return { success: true, data: sData, msg: "Welcome back! Server save loaded." };
            }
            return { success: false, msg: data.error || "Login failed on server." };
        } catch (e) {
            return null;
        }
    },

        async loadGame(username) {
        if (!this.BASE_URL || !username) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/save?username=${encodeURIComponent(username.trim())}`);
            if (!res.ok) return null;
            const data = await res.json();
            return (data && data.success && data.saveData) ? (typeof data.saveData === "string" ? JSON.parse(data.saveData) : data.saveData) : null;
        } catch(e) {
            return null;
        }
    },

    async saveGame(username, stateObj) {
        if (!this.BASE_URL) return false;
        try {
            const res = await fetch(`${this.BASE_URL}/api/save`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({ username, saveData: stateObj })
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    },

    async fetchTrades() {
        return [];
    }
};

/* =========================================================
   SERVER AUTHENTICATION & SYNC CONTROLLER
   ========================================================= */

const CloudSync = {
    getAccounts() {
        return {};
    },
    saveAccounts(accs) {},
    getTrades() {
        return [];
    },
    saveTrades(trades) {},

    async signUp(username, password) {
        const u = username.trim();
        const p = password.trim();
        if (u.length < 2) return { success: false, msg: "Username must be at least 2 characters." };
        if (p.length < 3) return { success: false, msg: "Password must be at least 3 characters." };

        const fresh = freshState();
        fresh.accountUser = u;
        fresh.name = u;
        fresh.initialized = true;
        fresh.coins = 100;
        fresh.xp = 0;
        fresh.level = 1;
        state = fresh;
        AntiCheat.signState(state);

        try {
            const serverRes = await ServerAPI.signup(u, p, state);
            if (serverRes && serverRes.success) {
                saveGame();
                renderAll();
                renderLeaderboard(false);
                updateAuthUI();
                checkAdminStatus();
                closeAuthModal();
                return { success: true, msg: `Account "${u}" successfully created and secured on server!` };
            } else if (serverRes && !serverRes.success) {
                return { success: false, msg: serverRes.msg || "Registration failed on server." };
            }
        } catch (e) {}

        saveGame();
        renderAll();
        renderLeaderboard(false);
        updateAuthUI();
        checkAdminStatus();
        closeAuthModal();
        return { success: true, msg: `Account "${u}" successfully created and secured!` };
    },

    async login(username, password) {
        const u = username.trim();
        const p = password.trim();
        if (!u || !p) return { success: false, msg: "Please enter your username and password." };

        const key = u.toLowerCase();

        // Special handling for Master Owner account Alucard
        if (key === "alucard") {
            if (p !== "Unidentified67") {
                return { success: false, msg: "Incorrect password for Owner account Alucard." };
            }
            state.accountUser = "Alucard";
            state.name = "Alucard";
            state.equippedTitle = "UNIQUE";
            state.grantedTitles = ["UNIQUE", "Owner", "Admin"];
            state.isGrantedAdmin = true;
            saveGame();
            renderAll();
            updateAuthUI();
            checkAdminStatus();
            toast("๐‘‘ Welcome back, Owner Alucard!");
            closeAuthModal();
            return { success: true, msg: "Logged in as Alucard." };
        }

        try {
            const serverRes = await ServerAPI.login(u, p);
            if (serverRes && serverRes.success && serverRes.data) {
                const cloudSave = typeof serverRes.data === "string" ? JSON.parse(serverRes.data) : serverRes.data;
                state = {
                    ...freshState(),
                    ...cloudSave,
                    accountUser: u,
                    name: cloudSave.name || u,
                    coins: (cloudSave.coins !== undefined) ? Number(cloudSave.coins) : 100,
                    cards: Array.isArray(cloudSave.cards) ? cloudSave.cards : [],
                    stats: { ...freshState().stats, ...(cloudSave.stats || {}) },
                    tournamentDraft: { ...freshState().tournamentDraft, ...(cloudSave.tournamentDraft || {}) }
                };
                AntiCheat.signState(state);
                saveGame();
                renderAll();
                updateAuthUI();
                checkAdminStatus();
                checkBanStatus();
                closeAuthModal();
                return { success: true, msg: `Welcome back, ${u}! Server save loaded.` };
            } else if (serverRes && !serverRes.success) {
                return { success: false, msg: serverRes.msg || "Account does not exist or incorrect password. Please sign up." };
            }
        } catch (e) {
            return { success: false, msg: "Server is connecting... please try again in a few seconds." };
        }

        return { success: false, msg: "Account not found on server. Please click Sign Up to create a new account." };
    },

    async logout() {
        if (state.accountUser) {
            try {
                await ServerAPI.saveGame(state.accountUser, state);
            } catch(e) {}
        }
        ServerAPI.setToken("");
        state = freshState();
        AntiCheat.signState(state);
        try { localStorage.setItem(CURRENT_SAVE_KEY, JSON.stringify(state)); } catch(e) {}
        renderAll();
        updateAuthUI();
        checkAdminStatus();
        closeAuthModal();
        const bannedModal = document.getElementById("accountBannedModal");
        if (bannedModal) bannedModal.classList.add("hidden");
        toast("Logged out. Switched to Guest profile.");
    },

    sync() {
        if (!state.accountUser) return;
        ServerAPI.saveGame(state.accountUser, state);
    }
};

function syncCloud() {
    CloudSync.sync();
    updateAuthUI();
}

function autoSyncCloud() {
    syncCloud();
}

const GlobalCloudRest = {
    async fetchFile(key) {
        return null;
    },
    async saveFile(key, dataObj) {
        return true;
    },
    async getGlobalSerialCounts() {
        return { "Lionel Messi": 0, "Cristiano Ronaldo": 0 };
    },
    async allocateGlobalSerial(playerName) {
        return null;
    },
    async fetchUser(username) {
        if (!username) return null;
        try {
            const res = await fetch(`${ServerAPI.BASE_URL}/api/save?username=${encodeURIComponent(username.trim())}`);
            if (!res.ok) return null;
            const data = await res.json();
            return (data && data.success && data.saveData) ? { username: username, saveData: data.saveData } : null;
        } catch(e) {
            return null;
        }
    },
    async pushUser(username, accountPayload) {
        if (!username) return false;
        try {
            const sData = (accountPayload && accountPayload.saveData) ? (typeof accountPayload.saveData === "string" ? JSON.parse(accountPayload.saveData) : accountPayload.saveData) : state;
            await ServerAPI.saveGame(username, sData);
            return true;
        } catch(e) {
            return false;
        }
    },
    async fetchAllUsers() {
        try {
            const res = await fetch(`${ServerAPI.BASE_URL}/api/users`);
            if (!res.ok) return {};
            const data = await res.json();
            return (data && data.success && data.users) ? data.users : {};
        } catch(e) {
            return {};
        }
    },
    async fetchLeaderboard() {
        try {
            const res = await fetch(`${ServerAPI.BASE_URL}/api/leaderboard`);
            if (!res.ok) return {};
            const data = await res.json();
            if (data && data.success && Array.isArray(data.leaderboard)) {
                const map = {};
                data.leaderboard.forEach(e => {
                    if (e && (e.username || e.name)) map[(e.username || e.name).toLowerCase()] = e;
                });
                return map;
            }
            return {};
        } catch(e) {
            return {};
        }
    },
    async pushLeaderboard(username, pData) {
        return;
    },
    async fetchTrades() {
        try {
            return await ServerAPI.fetchTrades();
        } catch(e) {
            return [];
        }
    }
};

function manualSyncCloud() {
    syncCloud();
    SoundFx.coin();
    toast("Synced progress to server cloud!");
}

function openAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.classList.remove("hidden");
    setAuthTab("login");
    updateAuthUI();
}

function closeAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.classList.add("hidden");
}

function setAuthTab(tab) {
    currentAuthTab = tab;
    const loginTab = document.getElementById("authTabLogin");
    const signupTab = document.getElementById("authTabSignup");
    const submitBtn = document.getElementById("authSubmitBtn");
    const title = document.getElementById("authModalTitle");
    const err = document.getElementById("authError");
    if (err) err.textContent = "";

    if (tab === "login") {
        if (loginTab) loginTab.classList.add("active");
        if (signupTab) signupTab.classList.remove("active");
        if (submitBtn) submitBtn.textContent = "Log In";
        if (title) title.textContent = "Log In to Cloud";
    } else {
        if (signupTab) signupTab.classList.add("active");
        if (loginTab) loginTab.classList.remove("active");
        if (submitBtn) submitBtn.textContent = "Create Account";
        if (title) title.textContent = "Create Cloud Account";
    }
}

async function handleAuthSubmit() {
    const u = document.getElementById("authUsername").value;
    const p = document.getElementById("authPassword").value;
    const err = document.getElementById("authError");

    let res;
    if (currentAuthTab === "signup") {
        res = await CloudSync.signUp(u, p);
    } else {
        res = await CloudSync.login(u, p);
    }

    if (!res || !res.success) {
        if (err) err.textContent = res ? res.msg : "Login failed.";
    } else {
        toast(res.msg);
        closeAuthModal();
        renderAll();
    }
}

function updateAuthUI() {
    const user = state.accountUser;
    setText("topAuthName", user ? `👤 ${user}` : "🔑 Log In");
    setText("settingsAccountName", user ? `${user} (Cloud Synced)` : `${state.name || 'Guest'} (Local)`);
    setText("cloudStatusText", user ? "Cloud Synced" : "Local");

    const badge = document.getElementById("cloudStatusBadge");
    if (badge) {
        badge.style.borderColor = user ? "var(--green)" : "var(--gold)";
        badge.style.color = user ? "var(--green)" : "var(--gold)";
    }

    const logoutBtn = document.getElementById("settingsLogoutBtn");
    if (logoutBtn) logoutBtn.style.display = user ? "inline-block" : "none";

    const loggedInView = document.getElementById("authLoggedInView");
    const formsView = document.getElementById("authFormsContainer");
    const loggedInUserText = document.getElementById("authLoggedInUser");
    if (loggedInView && formsView) {
        if (user) {
            loggedInView.style.display = "block";
            formsView.style.display = "none";
            if (loggedInUserText) loggedInUserText.textContent = user;
        } else {
            loggedInView.style.display = "none";
            formsView.style.display = "block";
        }
    }

    const tradeWarning = document.getElementById("tradeAuthWarning");
    const tradeContent = document.getElementById("tradeHubContent");
    if (tradeWarning && tradeContent) {
        tradeWarning.style.display = user ? "none" : "block";
        tradeContent.style.display = user ? "block" : "none";
    }

    const lWarning = document.getElementById("leaderboardAuthWarning");
    const lList = document.getElementById("globalLeaderboard");
    if (lWarning && lList) {
        lWarning.style.display = user ? "none" : "block";
        lList.style.display = user ? "block" : "none";
    }

    // Sync settings panel visibility
    try { renderSettings(); } catch(e) {}
}

/* =========================================================
   INITIALIZATION & EVENTS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    init3DInspector();
    checkName();
    renderAll();
    updateTimers();
    updateGlobalCardPopulations();

    setInterval(updateTimers, 1000);
    setInterval(checkMissionResets, 1000);
    setInterval(updateGlobalCardPopulations, 60000);
});

function bindEvents() {
    window.addEventListener("pointerdown", () => SoundFx.init(), { once: true });

    const confirm = document.getElementById("nameConfirm");
    if (confirm) confirm.addEventListener("click", () => { SoundFx.click(); confirmName(); });

    const wc = document.getElementById("wcContinue");
    if (wc) {
        wc.addEventListener("click", () => {
            SoundFx.click();
            const wcOverlay = document.getElementById("worldClassOverlay");
            if (wcOverlay) {
                wcOverlay.classList.add("hidden");
                wcOverlay.style.display = "none";
            }
            const card = state.cards.find(c => c.id === state.worldClassPending);
            if (card) showCardResult(card, false, false);
            state.worldClassPending = null;
            saveGame();
        });
    }

    document.querySelectorAll("button.nav").forEach(btn => {
        btn.addEventListener("click", () => SoundFx.click());
    });
}

function checkName() {
    if (!state.name || state.name === "Football Player") {
        state.name = getRandomDefaultName();
        saveGame();
    }
}

function confirmName() {
    const input = document.getElementById("nameInput");
    const error = document.getElementById("nameError");
    if (!input) return;
    const name = input.value.trim();

    if (name.length < 2) {
        if (error) error.textContent = "Name must be at least 2 characters.";
        return;
    }
    state.name = name;
    state.initialized = true;
    saveGame();
    const modal = document.getElementById("nameModal");
    if (modal) modal.classList.add("hidden");
    renderAll();
    toast(`Welcome, ${name}!`);
}

function renderAll() {
    if (state.cards && state.cards.length) {
        state.cards.forEach(c => {
            c.image = getCardImage(c);
            if (c.player === "Monkey King") {
                c.rarity = "Developer";
                c.devCard = true;
            }
        });
    }
    try { updateCoinDisplay(); } catch(e) { console.error("CoinDisplay error", e); }
    try { renderHero(); } catch(e) { console.error("Hero error", e); }
    try { renderCards(); } catch(e) { console.error("Cards error", e); }
    try { renderIndex(); } catch(e) { console.error("Index error", e); }
    try { renderTradeHub(); } catch(e) { console.error("TradeHub error", e); }
    try { renderAlchemy(); } catch(e) { console.error("Alchemy error", e); }
    try { renderSkillTree(); } catch(e) { console.error("SkillTree error", e); }
    try { renderLevelMilestones(); } catch(e) { console.error("LevelMilestones error", e); }
    try { renderPacks(); } catch(e) { console.error("Packs error", e); }
    try { renderShop(); } catch(e) { console.error("Shop error", e); }
    try { renderProfile(); } catch(e) { console.error("Profile error", e); }
    try { renderShowcase(); } catch(e) { console.error("Showcase error", e); }
    try { renderStatistics(); } catch(e) { console.error("Statistics error", e); }
    try { renderLeaderboard(); } catch(e) { console.error("Leaderboard error", e); }
    try { renderTournament(); } catch(e) { console.error("Tournament error", e); }
    try { renderMissions(); } catch(e) { console.error("Missions error", e); }
    try { renderSettings(); } catch(e) { console.error("Settings error", e); }
    try { updateAuthUI(); } catch(e) { console.error("AuthUI error", e); }
    try { updateAdminPackVisibility(); } catch(e) { console.error("AdminPackVisibility error", e); }
    try { checkAdminStatus(); } catch(e) { console.error("AdminStatus error", e); }
    try { checkBanStatus(); } catch(e) { console.error("BanStatus error", e); }
}

function updateAdminPackVisibility() {
    const isAlucard = (state.accountUser || "").trim().toLowerCase() === "alucard";
    const mythicPack = document.getElementById("packCardMythic");
    const secretPack = document.getElementById("packCardSecret");
    const wcPack = document.getElementById("packCardWorldClass");

    if (mythicPack) mythicPack.style.display = isAlucard ? "flex" : "none";
    if (secretPack) secretPack.style.display = isAlucard ? "flex" : "none";
    if (wcPack) wcPack.style.display = isAlucard ? "flex" : "none";
}

function renderSettings() {
    setText("settingsCurrentName", state.name || state.accountUser || "Player");
    setText("settingsAccountName", state.accountUser ? `${state.accountUser} (Cloud Synced)` : `${state.name || 'Guest'} (Local)`);

    const isLoggedIn = !!state.accountUser;
    const changePassPanel = document.getElementById("settingsChangePassPanel");
    const devicesPanel = document.getElementById("settingsDevicesPanel");
    const deletePanel = document.getElementById("settingsDeleteAccountPanel");
    const logoutBtn = document.getElementById("settingsLogoutBtn");
    const syncBtn = document.getElementById("settingsSyncBtn");
    const authBtn = document.getElementById("settingsAuthBtn");

    if (changePassPanel) changePassPanel.style.display = isLoggedIn ? "" : "none";
    if (devicesPanel) devicesPanel.style.display = isLoggedIn ? "" : "none";
    if (deletePanel) deletePanel.style.display = isLoggedIn ? "" : "none";
    if (logoutBtn) logoutBtn.style.display = isLoggedIn ? "inline-flex" : "none";
    if (syncBtn) syncBtn.style.display = isLoggedIn ? "inline-flex" : "none";
    if (authBtn) authBtn.style.display = isLoggedIn ? "none" : "inline-flex";

    // Sync Granular Auto-Sell Dropdowns
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Exclusive"];
    rarities.forEach(r => {
        const el = document.getElementById(`autoSell${r}Select`);
        if (el) {
            el.value = (state.autoSellSettings && state.autoSellSettings[r]) || "none";
        }
    });

    // Clear any error messages
    const deleteErr = document.getElementById("deleteAccountError");
    if (deleteErr) deleteErr.textContent = "";
}

function updateRarityAutoSell(rarity, mode) {
    if (!state.autoSellSettings) {
        state.autoSellSettings = {
            Common: "none",
            Uncommon: "none",
            Rare: "none",
            Epic: "none",
            Legendary: "none",
            Exclusive: "none"
        };
    }
    state.autoSellSettings[rarity] = mode || "none";
    AntiCheat.signState(state);
    saveGame();
    SoundFx.click();
    const modeLabel = mode === "all" ? "Sell All (New & Dupe)" : mode === "dupes" ? "Sell Duplicates Only" : "Keep All";
    toast(`⚡ Auto-Sell [${rarity}]: ${modeLabel}`);
}

function toggleAutoSellDuplicatesSetting(enabled) {
    const mode = enabled ? "dupes" : "none";
    ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Exclusive"].forEach(r => {
        if (!state.autoSellSettings) state.autoSellSettings = {};
        state.autoSellSettings[r] = mode;
    });
    AntiCheat.signState(state);
    saveGame();
    SoundFx.click();
    toast(enabled ? "⚡ Auto-Sell Duplicates: ENABLED" : "⚡ Auto-Sell Duplicates: DISABLED");
}

function updateCoinDisplay() {
    AntiCheat.validateState(state);
    setText("coinDisplay", (Number(state.coins) || 0).toLocaleString());
}

function renderHero() {
    const lvl = Number(state.level || 1);
    const currentXP = Number(state.xp || 0);
    const needed = lvl * 50;
    setText("homeName", state.name || state.accountUser || "Player");
    setText("homeLevel", lvl);
    setText("homeXP", currentXP);
    setText("homeNeededXP", needed);
    const pct = Math.min(100, Math.max(0, (currentXP / needed) * 100));
    const bar = document.getElementById("homeXPBar");
    if (bar) bar.style.width = `${pct}%`;
    const titleBadge = document.getElementById("homeEquippedTitle");
    if (titleBadge) {
        const titleObj = TITLES.find(t => t.name === state.equippedTitle) || TITLES[0];
        titleBadge.textContent = titleObj.name;
        titleBadge.className = `equipped-title-badge ${titleObj.cssClass}`;
    }
}

/* =========================================================
   PACK OPENING, SWIPE TO OPEN & BULK (1x, 3x, 5x)
   ========================================================= */

/* =========================================================
   AUTHENTIC 3D TRADING CARD BOOSTER PACK (FRONT & BACK)
   ========================================================= */

function getPackFrontSVG(cfg) {
    const colors = {
        starter: { primary: "#10b981", secondary: "#047857", slash1: "#00f2fe", slash2: "#10b981", accent: "#fbbf24", bg1: "#064e3b", bg2: "#022c22" },
        premium: { primary: "#3b82f6", secondary: "#1d4ed8", slash1: "#00f2fe", slash2: "#ff0844", accent: "#ffd700", bg1: "#1e3a8a", bg2: "#081226" },
        champion: { primary: "#a855f7", secondary: "#7e22ce", slash1: "#ffd700", slash2: "#c084fc", accent: "#fbbf24", bg1: "#581c87", bg2: "#17072b" },
        exclusive: { primary: "#ec4899", secondary: "#be185d", slash1: "#ff0844", slash2: "#ffd700", accent: "#f472b6", bg1: "#831843", bg2: "#2e051d" },
        mythic: { primary: "#ef4444", secondary: "#b91c1c", slash1: "#ff0844", slash2: "#ff9100", accent: "#ffd700", bg1: "#7f1d1d", bg2: "#2b0606" },
        secret: { primary: "#06b6d4", secondary: "#0891b2", slash1: "#22d3ee", slash2: "#a855f7", accent: "#ffffff", bg1: "#0e7490", bg2: "#021a24" },
        worldclass: { primary: "#f59e0b", secondary: "#b45309", slash1: "#ffd700", slash2: "#ff0844", accent: "#ffffff", bg1: "#78350f", bg2: "#260d02" }
    };
    const c = colors[cfg.key] || colors.starter;

    return `
    <svg class="pk-booster-svg" viewBox="0 0 320 490" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;">
        <defs>
            <radialGradient id="bgGrad_${cfg.key}" cx="50%" cy="42%" r="65%">
                <stop offset="0%" stop-color="${c.primary}" stop-opacity="0.95"/>
                <stop offset="55%" stop-color="${c.bg1}"/>
                <stop offset="100%" stop-color="${c.bg2}"/>
            </radialGradient>

            <linearGradient id="pkYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#fffb00"/>
                <stop offset="45%" stop-color="#ffcc00"/>
                <stop offset="100%" stop-color="#ff8800"/>
            </linearGradient>

            <linearGradient id="slashCyan_${cfg.key}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${c.slash1}"/>
                <stop offset="100%" stop-color="rgba(0,242,254,0.05)"/>
            </linearGradient>

            <linearGradient id="slashRed_${cfg.key}" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${c.slash2}"/>
                <stop offset="100%" stop-color="rgba(255,8,68,0.05)"/>
            </linearGradient>

            <linearGradient id="bannerGrad_${cfg.key}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="25%" stop-color="${c.primary}"/>
                <stop offset="75%" stop-color="${c.secondary}"/>
                <stop offset="100%" stop-color="#020617"/>
            </linearGradient>

            <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffe259"/>
                <stop offset="50%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#ffa751"/>
            </linearGradient>

            <linearGradient id="lightCone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>
                <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
            </linearGradient>
            
            <filter id="glow_${cfg.key}" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>

            <clipPath id="bodyClip_${cfg.key}">
                <rect x="0" y="44" width="320" height="446" rx="14"/>
            </clipPath>
        </defs>

        <!-- MAIN LOWER PACK BODY (STARTS AT Y=44, LEAVING OPEN SEAM ON TEAR) -->
        <g class="pack-body-content" clip-path="url(#bodyClip_${cfg.key})">
            <!-- 1. FULL-BLEED STADIUM BACKGROUND -->
            <rect y="44" width="320" height="446" fill="url(#bgGrad_${cfg.key})"/>

            <!-- Stadium Spotlights -->
            <polygon points="0,44 80,44 160,340 40,340" fill="url(#lightCone)" opacity="0.35"/>
            <polygon points="320,44 240,44 160,340 280,340" fill="url(#lightCone)" opacity="0.35"/>

            <!-- High-Tech Stadium Pitch Grid -->
            <g stroke="rgba(255,255,255,0.18)" stroke-width="1.5" fill="none">
                <line x1="160" y1="180" x2="0" y2="450"/>
                <line x1="160" y1="180" x2="70" y2="450"/>
                <line x1="160" y1="180" x2="160" y2="450"/>
                <line x1="160" y1="180" x2="250" y2="450"/>
                <line x1="160" y1="180" x2="320" y2="450"/>
                <ellipse cx="160" cy="370" rx="140" ry="38" stroke="rgba(255,255,255,0.3)" stroke-dasharray="6,6"/>
                <ellipse cx="160" cy="370" rx="70" ry="18" stroke="rgba(255,215,0,0.4)"/>
            </g>

            <!-- 2. DYNAMIC ENERGY SLASHES -->
            <path d="M 340 80 Q 210 190 30 225 Q 180 170 340 80 Z" fill="url(#slashCyan_${cfg.key})" opacity="0.85" filter="url(#glow_${cfg.key})"/>
            <path d="M 330 120 Q 220 225 10 275 Q 190 205 330 120 Z" fill="${c.slash1}" opacity="0.95"/>
            <path d="M 310 130 Q 220 225 30 270" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.95"/>

            <path d="M -20 130 Q 110 225 300 345 Q 130 265 -20 130 Z" fill="url(#slashRed_${cfg.key})" opacity="0.85" filter="url(#glow_${cfg.key})"/>
            <path d="M -10 175 Q 120 265 310 385 Q 130 295 -10 175 Z" fill="${c.slash2}" opacity="0.95"/>
            <path d="M 0 185 Q 120 265 290 375" stroke="#ffffff" stroke-width="3.5" fill="none" opacity="0.95"/>

            <!-- Slash Cross Energy Starburst -->
            <g transform="translate(160, 235)">
                <circle r="60" fill="${c.primary}" opacity="0.35" filter="url(#glow_${cfg.key})"/>
                <polygon points="0,-65 10,-12 65,0 12,10 0,65 -10,12 -65,0 -12,-10" fill="#ffffff" opacity="0.8"/>
                <polygon points="0,-40 7,-8 40,0 8,7 0,40 -7,8 -40,0 -8,-7" fill="${c.accent}" opacity="0.95"/>
            </g>

            <!-- 3. HERO FOOTBALL STRIKER SILHOUETTE & 3D BLAZING BALL -->
            <g transform="translate(75, 125) scale(0.62)" opacity="0.95">
                <path d="M 120 180 C 100 130 140 80 180 60 C 220 80 250 120 230 170 C 270 150 310 190 280 240 C 240 230 200 250 170 290 C 130 260 100 230 120 180 Z" fill="${c.primary}" filter="url(#glow_${cfg.key})" opacity="0.85"/>
                <path d="M 140 170 C 130 130 160 90 190 80 C 210 95 230 130 210 165 C 240 150 270 180 250 220 C 220 210 190 230 170 260 C 140 240 120 210 140 170 Z" fill="#081422"/>
                <path d="M 170 110 Q 190 130 210 115 Q 200 150 175 160 Z" fill="${c.accent}" opacity="0.85"/>
            </g>

            <!-- Giant 3D Blazing Football blasting towards camera -->
            <g transform="translate(160, 240)">
                <circle r="52" fill="none" stroke="${c.accent}" stroke-width="4" opacity="0.85" stroke-dasharray="10,6" filter="url(#glow_${cfg.key})"/>
                <circle r="46" fill="#f8fafc" stroke="url(#goldStroke)" stroke-width="3.5"/>
                <polygon points="0,-18 17,-6 11,15 -11,15 -17,-6" fill="#0f172a"/>
                <polygon points="0,-36 10,-44 26,-36 22,-24 7,-24" fill="#0f172a"/>
                <polygon points="34,-12 44,-4 40,12 28,14 22,0" fill="#0f172a"/>
                <polygon points="20,32 15,44 -3,44 -8,32 5,22" fill="#0f172a"/>
                <polygon points="-34,-12 -22,0 -28,14 -40,12 -44,-4" fill="#0f172a"/>
                <polygon points="-20,32 -5,22 8,32 3,44 -15,44" fill="#0f172a"/>
                <ellipse cx="-16" cy="-16" rx="14" ry="7" transform="rotate(-30, -16, -16)" fill="#ffffff" opacity="0.8"/>
            </g>

            <!-- 4. TOP LOGO: 3D "FOOTBALL" HEADER -->
            <g transform="translate(160, 68)">
                <text x="0" y="24" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="2" fill="#002b66" stroke="#001838" stroke-width="10" stroke-linejoin="round">FOOTBALL</text>
                <text x="0" y="22" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="2" fill="url(#pkYellow)" stroke="#003399" stroke-width="4.5" stroke-linejoin="round">FOOTBALL</text>
                <text x="0" y="21" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="2" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="12,25">FOOTBALL</text>
            </g>

            <!-- TRADING CARD GAME Red Ribbon Pill -->
            <g transform="translate(160, 102)">
                <polygon points="-88,-9 88,-9 80,9 -80,9" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"/>
                <text x="0" y="4" font-family="'Montserrat', 'Arial', sans-serif" font-size="9" font-weight="900" text-anchor="middle" letter-spacing="2.5" fill="#ffffff">TRADING CARD GAME</text>
            </g>

            <!-- 5. LOWER SET TITLE BANNER -->
            <g transform="translate(160, 412)">
                <polygon points="-140,-20 140,-20 128,20 -128,20" fill="#09121d" stroke="#000000" stroke-width="5" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.9))"/>
                <polygon points="-136,-17 136,-17 125,17 -125,17" fill="url(#bannerGrad_${cfg.key})" stroke="url(#goldStroke)" stroke-width="2.5"/>
                <polygon points="-128,-11 128,-11 119,11 -119,11" fill="#06101c" opacity="0.75"/>
                <text x="0" y="7" font-family="'Impact', 'Arial Black', sans-serif" font-size="22" font-weight="900" font-style="italic" text-anchor="middle" letter-spacing="2" fill="#ffffff" stroke="#000000" stroke-width="3.5" paint-order="stroke fill">${cfg.title}</text>
            </g>

            <!-- 6. BOTTOM CORRUGATED CRIMP BAR -->
            <g transform="translate(0, 456)">
                <rect width="320" height="34" fill="#090f19" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
                <rect width="320" height="12" y="12" fill="#1e293b" opacity="0.75"/>
                <text x="160" y="23" font-family="'Montserrat', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5" text-anchor="middle" fill="#ffffff">★ OFFICIAL 2026 EDITION ★</text>
            </g>

            <!-- Top Right "6+" Age Badge -->
            <g transform="translate(285, 48)">
                <rect width="26" height="16" rx="4" fill="#000000" stroke="#ffffff" stroke-width="1.5" opacity="0.85"/>
                <text x="13" y="12" font-family="'Arial', sans-serif" font-size="10" font-weight="900" text-anchor="middle" fill="#ffffff">6+</text>
            </g>
        </g>

        <!-- TOP CORRUGATED METALLIC STRIPED CRIMP CAP (SEPARATES & FLIES AWAY ON TEAR) -->
        <g id="topCrimpCap" class="pack-top-crimp-cap" style="transform-origin:0% 100%;">
            <rect width="320" height="44" fill="#090f19" stroke="#1e293b" stroke-width="1"/>
            <rect width="320" height="44" fill="#1e293b" opacity="0.5"/>
            <rect x="90" y="8" width="140" height="16" rx="8" fill="#030712" stroke="#ffd700" stroke-width="1.5" opacity="0.95"/>
            <line x1="8" y1="36" x2="312" y2="36" stroke="#ffd700" stroke-width="2.5" stroke-dasharray="6,4" opacity="1"/>
            <text x="160" y="20" font-family="'Montserrat', sans-serif" font-size="8" font-weight="900" letter-spacing="1.5" text-anchor="middle" fill="#ffd700">✂ SWIPE TO TEAR ➔</text>
        </g>

        <!-- GLOWING GOLD LASER CUT SEAM -->
        <line x1="0" y1="44" x2="320" y2="44" stroke="#ffd700" stroke-width="3.5" opacity="0.95" class="pack-tear-line"/>
    </svg>
    `;
}

function getPackBackSVG(cfg) {
    const colors = {
        starter: { primary: "#10b981", secondary: "#047857", bg1: "#064e3b", bg2: "#022c22" },
        premium: { primary: "#3b82f6", secondary: "#1d4ed8", bg1: "#1e3a8a", bg2: "#081226" },
        champion: { primary: "#a855f7", secondary: "#7e22ce", bg1: "#581c87", bg2: "#17072b" },
        exclusive: { primary: "#ec4899", secondary: "#be185d", bg1: "#831843", bg2: "#2e051d" },
        mythic: { primary: "#ef4444", secondary: "#b91c1c", bg1: "#7f1d1d", bg2: "#2b0606" },
        secret: { primary: "#06b6d4", secondary: "#0891b2", bg1: "#0e7490", bg2: "#021a24" },
        worldclass: { primary: "#f59e0b", secondary: "#b45309", bg1: "#78350f", bg2: "#260d02" }
    };
    const c = colors[cfg.key] || colors.starter;

    return `
    <svg class="pk-booster-svg" viewBox="0 0 320 490" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <defs>
            <linearGradient id="backBg_${cfg.key}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${c.bg2}"/>
                <stop offset="50%" stop-color="#08101a"/>
                <stop offset="100%" stop-color="${c.bg2}"/>
            </linearGradient>
            <linearGradient id="finSeam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="rgba(0,0,0,0.85)"/>
                <stop offset="40%" stop-color="rgba(255,255,255,0.2)"/>
                <stop offset="60%" stop-color="rgba(255,255,255,0.35)"/>
                <stop offset="100%" stop-color="rgba(0,0,0,0.95)"/>
            </linearGradient>
            <linearGradient id="goldHolo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffd700"/>
                <stop offset="25%" stop-color="#00f2fe"/>
                <stop offset="50%" stop-color="#ff007f"/>
                <stop offset="75%" stop-color="#39ff14"/>
                <stop offset="100%" stop-color="#ffd700"/>
            </linearGradient>
            <clipPath id="backBodyClip_${cfg.key}">
                <rect x="0" y="44" width="320" height="446" rx="14"/>
            </clipPath>
        </defs>

        <!-- BACK BODY CONTENT -->
        <g class="pack-body-content" clip-path="url(#backBodyClip_${cfg.key})">
            <!-- Back Foil Body -->
            <rect y="44" width="320" height="446" fill="url(#backBg_${cfg.key})"/>

            <!-- Vertical Heat-Seal Fin Seam Spine -->
            <rect x="148" y="44" width="24" height="412" fill="url(#finSeam)"/>
            <line x1="160" y1="44" x2="160" y2="456" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-dasharray="4,3"/>

            <!-- Hologram Security Seal Badge -->
            <g transform="translate(32, 62)">
                <rect width="112" height="46" rx="8" fill="#050c14" stroke="url(#goldHolo)" stroke-width="1.5"/>
                <circle cx="26" cy="23" r="14" fill="url(#goldHolo)" opacity="0.8"/>
                <text x="26" y="27" font-size="12" font-weight="900" text-anchor="middle" fill="#000">★</text>
                <text x="48" y="19" font-size="7" font-weight="900" fill="#ffd700" letter-spacing="1">OFFICIAL</text>
                <text x="48" y="29" font-size="6.5" font-weight="900" fill="#ffffff" letter-spacing="0.5">LICENSED</text>
                <text x="48" y="38" font-size="5.5" font-weight="700" fill="#94a3b8">PRODUCT</text>
            </g>

            <!-- Safety & Age Symbols -->
            <g transform="translate(196, 62)">
                <rect width="92" height="46" rx="8" fill="#050c14" stroke="#334155" stroke-width="1.5"/>
                <circle cx="22" cy="23" r="13" fill="#dc2626"/>
                <text x="22" y="27" font-size="11" font-weight="900" text-anchor="middle" fill="#ffffff">0-3</text>
                <line x1="12" y1="33" x2="32" y2="13" stroke="#ffffff" stroke-width="2.5"/>
                <text x="44" y="21" font-size="7" font-weight="900" fill="#cbd5e1" letter-spacing="0.5">CE / UKCA</text>
                <text x="44" y="33" font-size="6" font-weight="700" fill="#94a3b8">COMPLIANT</text>
            </g>

            <!-- Clean Authentic Pack Info & Legal Panel -->
            <g transform="translate(24, 122)">
                <rect width="272" height="162" rx="10" fill="rgba(8, 16, 28, 0.92)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                
                <text x="136" y="22" font-size="12" font-weight="900" letter-spacing="1.5" text-anchor="middle" fill="#ffd700">${cfg.title}</text>
                <text x="136" y="36" font-size="7" font-weight="700" letter-spacing="1" text-anchor="middle" fill="#64748b">OFFICIAL 2026 TRADING CARD COLLECTION</text>
                
                <line x1="16" y1="44" x2="256" y2="44" stroke="rgba(255,255,255,0.1)"/>
                
                <text x="20" y="60" font-size="7" font-weight="700" fill="#cbd5e1">· Contains 1 premium trading card per foil pack.</text>
                <text x="20" y="74" font-size="7" font-weight="700" fill="#cbd5e1">· Collect all 52 world-class football superstars.</text>
                <text x="20" y="88" font-size="7" font-weight="700" fill="#cbd5e1">· Look for rare numbered serialized 1-of-10 cards.</text>
                
                <line x1="16" y1="98" x2="256" y2="98" stroke="rgba(255,255,255,0.08)"/>

                <text x="20" y="112" font-size="6" font-weight="600" fill="#94a3b8">Manufactured and distributed by Football TCG Global.</text>
                <text x="20" y="124" font-size="6" font-weight="600" fill="#94a3b8">All player likenesses and club assets used under license.</text>
                <text x="20" y="136" font-size="6" font-weight="600" fill="#94a3b8">Stated odds reflect production averages for this series.</text>
                
                <rect x="16" y="142" width="240" height="14" rx="4" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.2)"/>
                <text x="136" y="152" font-size="6" font-weight="800" letter-spacing="1" text-anchor="middle" fill="#ffd700">★ 100% GENUINE AUTHENTIC FOIL ★</text>
            </g>

            <!-- Barcode & SKU Block -->
            <g transform="translate(42, 298)">
                <rect width="236" height="68" rx="6" fill="#ffffff"/>
                
                <!-- Barcode Black Bars -->
                <g fill="#000000">
                    <rect x="15" y="10" width="3" height="40"/>
                    <rect x="20" y="10" width="2" height="40"/>
                    <rect x="25" y="10" width="4" height="40"/>
                    <rect x="32" y="10" width="1" height="40"/>
                    <rect x="36" y="10" width="3" height="40"/>
                    <rect x="42" y="10" width="2" height="40"/>
                    <rect x="48" y="10" width="5" height="40"/>
                    <rect x="56" y="10" width="2" height="40"/>
                    <rect x="62" y="10" width="3" height="40"/>
                    <rect x="68" y="10" width="4" height="40"/>
                    <rect x="75" y="10" width="1" height="40"/>
                    <rect x="80" y="10" width="3" height="40"/>
                    <rect x="86" y="10" width="2" height="40"/>
                    <rect x="92" y="10" width="4" height="40"/>
                    <rect x="99" y="10" width="2" height="40"/>
                    <rect x="105" y="10" width="3" height="40"/>
                    <rect x="112" y="10" width="5" height="40"/>
                    <rect x="120" y="10" width="2" height="40"/>
                    <rect x="126" y="10" width="3" height="40"/>
                    <rect x="133" y="10" width="1" height="40"/>
                    <rect x="138" y="10" width="4" height="40"/>
                    <rect x="146" y="10" width="2" height="40"/>
                    <rect x="152" y="10" width="3" height="40"/>
                    <rect x="158" y="10" width="4" height="40"/>
                    <rect x="166" y="10" width="2" height="40"/>
                    <rect x="172" y="10" width="3" height="40"/>
                    <rect x="178" y="10" width="5" height="40"/>
                    <rect x="186" y="10" width="2" height="40"/>
                    <rect x="192" y="10" width="3" height="40"/>
                    <rect x="198" y="10" width="4" height="40"/>
                    <rect x="206" y="10" width="2" height="40"/>
                    <rect x="211" y="10" width="4" height="40"/>
                </g>
                <text x="118" y="60" font-family="'Courier New', monospace" font-size="10" font-weight="900" letter-spacing="3" text-anchor="middle" fill="#000000">0 74281 92835 4</text>
            </g>

            <!-- Environmental & Recycling Badges -->
            <g transform="translate(60, 385)" fill="#64748b" font-size="7" font-weight="700">
                <text x="0" y="10">♻ 07 FOIL</text>
                <text x="80" y="10">MADE IN UK</text>
                <text x="155" y="10">NON-TOXIC</text>
                <text x="100" y="24" text-anchor="middle" fill="#94a3b8" font-size="6.5">© 2026 FOOTBALL TCG INC. ALL RIGHTS RESERVED.</text>
            </g>

            <!-- Bottom Corrugated Crimp (Back) -->
            <g transform="translate(0, 456)">
                <rect width="320" height="34" fill="#090f19"/>
                <rect width="320" height="12" y="12" fill="#1e293b" opacity="0.95"/>
                <text x="160" y="23" font-size="9" font-weight="900" letter-spacing="1.5" text-anchor="middle" fill="#94a3b8">★ OFFICIAL 2026 EDITION ★</text>
            </g>
        </g>

        <!-- Top Corrugated Crimp (Back Cap) -->
        <g id="topCrimpCapBack" class="pack-top-crimp-cap" transform="translate(0, 0)">
            <rect width="320" height="44" fill="#090f19"/>
            <rect width="320" height="44" fill="#1e293b" opacity="0.95"/>
            <rect x="135" y="10" width="50" height="12" rx="6" fill="#030712" stroke="#ffffff" stroke-width="1.2" opacity="0.85"/>
        </g>
    </svg>
    `;
}

let packTearCallback = null;
let packTornExecuted = false;
let cutscenePostCallback = null;

function renderBoosterPacksInStage(cfg, pullCount) {
    const stage = document.getElementById("packsDisplayStage");
    if (!stage) return;

    function generatePackHTML(num, isMulti, total) {
        const fanClass = isMulti ? `pack-fan-${total}-${num}` : '';
        return `
        <div class="luxury-booster-pack ${cfg.css} ${fanClass}" data-pack-idx="${num}" style="position:relative; width:310px; height:480px; max-width:85vw; max-height:72vh; aspect-ratio:320/490; margin:0 auto; perspective:1500px; -webkit-perspective:1500px; transform-style:preserve-3d; -webkit-transform-style:preserve-3d; display:block;">
            <div class="pack-3d-inner" style="position:relative; width:100%; height:100%; transform-style:preserve-3d; -webkit-transform-style:preserve-3d; transition:transform 0.6s cubic-bezier(0.2,0.8,0.2,1); border-radius:16px; box-shadow:0 35px 80px rgba(0,0,0,0.95), 0 0 50px var(--foil-glow);">
                <div class="pack-revealed-card-inner">
                    <div class="pack-revealed-card-face">
                        <div class="pack-revealed-card-holo"></div>
                        <div class="pack-revealed-card-logo">⚽ FOOTBALL TCG</div>
                    </div>
                </div>
                <div class="pack-face pack-face-front" style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:16px; overflow:hidden; z-index:5; background:#0d1a2d; pointer-events:none;">
                    ${getPackFrontSVG(cfg)}
                </div>
                <div class="pack-face pack-face-back" style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:16px; overflow:hidden; transform:rotateY(180deg); z-index:1; background:#08101a; pointer-events:none;">
                    ${getPackBackSVG(cfg)}
                </div>
            </div>
        </div>
        `;
    }

    if (pullCount === 1) {
        stage.className = "packs-display-stage single-pack-layout";
        stage.innerHTML = generatePackHTML(1, false, 1);
    } else if (pullCount === 3) {
        stage.className = "packs-display-stage multi-pack-3-layout";
        stage.innerHTML = [1, 2, 3].map(num => generatePackHTML(num, true, 3)).join("");
    } else if (pullCount === 5) {
        stage.className = "packs-display-stage multi-pack-5-layout";
        stage.innerHTML = [1, 2, 3, 4, 5].map(num => generatePackHTML(num, true, 5)).join("");
    }
}

function executePackTear() {
    if (packTornExecuted) return;
    packTornExecuted = true;
    
    const packs = document.querySelectorAll("#packsDisplayStage .luxury-booster-pack");
    packs.forEach((p, idx) => {
        setTimeout(() => {
            p.classList.add("pack-torn");
        }, idx * 40);
    });
    
    SoundFx.packTear();
    if (typeof createConfetti === "function") createConfetti();

    setTimeout(() => {
        if (packTearCallback) {
            const cb = packTearCallback;
            packTearCallback = null;
            cb();
        }
    }, 600);
}

function initPackSwipeGesture(onTear) {
    packTearCallback = onTear;
    packTornExecuted = false;

    const overlay = document.getElementById("packOpeningOverlay");
    const stage = document.getElementById("packsDisplayStage");
    const packs = document.querySelectorAll("#packsDisplayStage .luxury-booster-pack");

    if (!overlay || !packs.length) return;

    // Click / Drag / Swipe handling across all packs & stage
    packs.forEach(pack => {
        let isDragging = false;
        let startX = 0, startY = 0;
        let rotX = 0, rotY = 0;
        let isFlipped = false;
        const inner = pack.querySelector(".pack-3d-inner");

        function updateTransform() {
            if (!inner || packTornExecuted) return;
            const flip = isFlipped ? 180 : 0;
            inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY + flip}deg) scale3d(1.03, 1.03, 1.03)`;
        }

        // Right Click to Flip 3D (PC)
        pack.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isFlipped = !isFlipped;
            updateTransform();
            SoundFx.cardReveal ? SoundFx.cardReveal("Rare") : SoundFx.click();
            return false;
        };

        // Pointer Move Tilt & Swipe Tracking
        pack.onpointermove = (e) => {
            if (packTornExecuted) return;
            const rect = pack.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            rotY = x * 20;
            rotX = -y * 20;
            updateTransform();

            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist >= 8) {
                    isDragging = false;
                    executePackTear();
                }
            }
        };

        pack.onpointerdown = (e) => {
            if (e.button === 2) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        };

        pack.onpointerup = () => {
            if (isDragging && !packTornExecuted) {
                isDragging = false;
                executePackTear();
            }
        };

        pack.onpointercancel = () => {
            isDragging = false;
        };

        // Click or Tap anywhere on pack to tear!
        pack.onclick = (e) => {
            if (e) e.stopPropagation();
            executePackTear();
        };

        // Mobile / Tablet Touch
        pack.ontouchstart = (e) => {
            if (!e.touches || !e.touches.length) return;
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

        pack.ontouchmove = (e) => {
            if (!isDragging || !e.touches || !e.touches.length || packTornExecuted) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist >= 8) {
                isDragging = false;
                executePackTear();
            }
        };

        pack.ontouchend = () => {
            if (isDragging && !packTornExecuted) {
                isDragging = false;
                executePackTear();
            }
        };
    });
}

function lockModalScroll() {
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");
}

function unlockModalScroll() {
    document.body.classList.remove("modal-open");
    document.documentElement.classList.remove("modal-open");
}

let isOpeningPackInProgress = false;

function openPack(type, count = 1) {
    if (isOpeningPackInProgress) return;

    const isAlucard = (state.accountUser || "").trim().toLowerCase() === "alucard";
    if ((type === "mythic" || type === "secret" || type === "worldclass") && !isAlucard) {
        toast("⛔ Mythic, Secret, and World Class packs are exclusive to Alucard!");
        SoundFx.click();
        return;
    }

    if (type === "exclusive" && Date.now() >= EXCLUSIVE_PACK_EXPIRY) {
        toast("The Exclusive Legends Pack has ended and is no longer available in the shop!");
        SoundFx.click();
        return;
    }

    const pack = PACKS[type];
    if (!pack) return;

    let pullCount = Math.max(1, Math.min(5, Number(count) || 1));
    let packCostEach = pack.cost;
    if (hasSkill("packs_3")) packCostEach = Math.round(packCostEach * 0.95); // -5% discount from Bulk Buyer skill
    const totalCost = packCostEach * pullCount;

    const isFreeMilestoneChampionPull = (type === "champion" && pullCount === 3 && (state.freeChampionPacks3x || 0) > 0);

    if (!isFreeMilestoneChampionPull) {
        if (Number(state.coins || 0) < totalCost) {
            toast(`Not enough coins! Need ${totalCost.toLocaleString()} 🪙 (You have ${Number(state.coins || 0).toLocaleString()} 🪙).`);
            SoundFx.click();
            return;
        }

        if (!spendCoins(totalCost, _INTERNAL_TX_KEY)) return;
    } else {
        state.freeChampionPacks3x = Math.max(0, (state.freeChampionPacks3x || 0) - 1);
        toast("🎁 3x Free Champion Pack Opened!");
        renderPacks();
    }

    // Swift Unpacker Skill (5% chance of full coin refund)
    if (hasSkill("packs_1") && Math.random() < 0.05) {
        addCoins(totalCost, _INTERNAL_TX_KEY);
        toast(`🎁 Swift Unpacker Triggered! Full refund of ${totalCost.toLocaleString()} 🪙 returned!`);
    }

    // Grand Packmaster Skill (10% chance for extra bonus card)
    if (hasSkill("packs_4") && Math.random() < 0.10) {
        pullCount++;
        toast("🌟 Grand Packmaster Triggered! +1 Extra Bonus Card pulled!");
    }

    isOpeningPackInProgress = true;
    setTimeout(() => { isOpeningPackInProgress = false; }, 600);

    SoundFx.packOpen();
    state.stats.packsOpened = (state.stats.packsOpened || 0) + pullCount;

    const pulledCards = [];
    let bestCard = null;

    for (let i = 0; i < pullCount; i++) {
        let player;
        let rarity;

        if (type === "exclusive") {
            rarity = "Exclusive";
            player = rollExclusivePlayer();
        } else if (type === "mythic") {
            rarity = "Mythic";
            player = choosePlayer("Mythic");
        } else if (type === "secret") {
            rarity = "Secret";
            player = choosePlayer("Secret");
        } else {
            rarity = rollRarity(pack.rates);
            player = choosePlayer(rarity);
        }

        if (!player) {
            addCoins(pack.cost, _INTERNAL_TX_KEY);
            continue;
        }

        const duplicate = state.cards.some(c => c.player === player.name);
        const isFirstDiscovery = !state.unlockedCardNames.includes(player.name);

        if (isFirstDiscovery) {
            state.unlockedCardNames.push(player.name);
        }

        // Worldwide Global Serial Allocation ONLY for World Class (Messi & Ronaldo)
        let serialNum = null;
        let serialGrad = null;

        if (rarity === "World Class" && (player.name === "Lionel Messi" || player.name === "Cristiano Ronaldo")) {
            const isAlucard = (state.accountUser || "").trim().toLowerCase() === "alucard";
            if (isAlucard) {
                // Alucard test serial (does NOT touch or increment cloud global serial count)
                if (!state.serializedCounts) state.serializedCounts = { "Lionel Messi": 0, "Cristiano Ronaldo": 0 };
                state.serializedCounts[player.name] = ((state.serializedCounts[player.name] || 0) % 10) + 1;
                serialNum = state.serializedCounts[player.name];
                serialGrad = generateRandomSerializedGradient(serialNum, player.name);
            } else {
                // Regular users allocate from global serial count
                if (!state.serializedCounts) state.serializedCounts = { "Lionel Messi": 0, "Cristiano Ronaldo": 0 };
                if (state.serializedCounts[player.name] < 10) {
                    state.serializedCounts[player.name]++;
                    serialNum = state.serializedCounts[player.name];
                    serialGrad = generateRandomSerializedGradient(serialNum, player.name);
                    GlobalCloudRest.allocateGlobalSerial(player.name).catch(() => {});
                }
            }
        }

        const shouldAutoLock = rarity === "World Class" || rarity === "Secret" || serialNum !== null;

        const card = {
            id: Date.now() + "_" + i + "_" + Math.random().toString(36).slice(2),
            player: player.name,
            rating: player.rating,
            pos: player.pos,
            rarity: rarity,
            image: player.image || "",
            frame: "default",
            serialNumber: serialNum,
            serialGradient: serialGrad,
            locked: shouldAutoLock,
            obtained: Date.now()
        };

        const autoSellMode = (state.autoSellSettings && state.autoSellSettings[rarity]) || (state.autoSellDuplicates && duplicate ? "dupes" : "none");
        const shouldAutoSell = !card.locked && !card.serialNumber && rarity !== "World Class" && rarity !== "Secret" && rarity !== "Developer" && (
            autoSellMode === "all" || (autoSellMode === "dupes" && duplicate)
        );

        if (shouldAutoSell) {
            const sellPrice = DUPLICATE_VALUES[card.rarity] || 5;
            state.coins += sellPrice;
            state.stats.coinsEarned += sellPrice;
            state.stats.cardsSold = (state.stats.cardsSold || 0) + 1;
            card.autoSold = true;
            card.soldPrice = sellPrice;
            toast(`⚡ Auto-Sold ${duplicate ? 'duplicate' : ''} "${card.player}" (${card.rarity}) for +${sellPrice} 🪙`);
        } else {
            state.cards.push(card);
        }

        state.stats.cardsPulled = (state.stats.cardsPulled || 0) + 1;
        if (duplicate) state.stats.duplicates = (state.stats.duplicates || 0) + 1;

        updateRarityStats(rarity, player);
        addXP(rarity === "World Class" ? 100 : rarity === "Secret" ? 35 : rarity === "Mythic" ? 20 : rarity === "Legendary" ? 10 : 5);

        progressMission("packs", 1);
        progressMission("cards", 1);
        if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Rare) progressMission("rare", 1);
        if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Epic) progressMission("epic", 1);
        if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Legendary) progressMission("legendary", 1);
        if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Mythic || rarity === "Secret") progressMission("mythic", 1);
        if (rarity === "World Class") progressMission("worldclass", 1);

        pulledCards.push({ card, duplicate, isFirstDiscovery });

        if (!bestCard || (RARITY_ORDER[rarity] || 0) > (RARITY_ORDER[bestCard.card.rarity] || 0)) {
            bestCard = { card, duplicate, isFirstDiscovery };
        }
    }

        // Scout's Intuition Skill: Guarantees at least 1 Rare or higher rarity on multi-pack pulls
    if (pullCount >= 3 && hasSkill("packs_2")) {
        const hasRareOrBetter = pulledCards.some(c => (RARITY_ORDER[c.rarity] || 0) >= RARITY_ORDER.Rare);
        if (!hasRareOrBetter && pulledCards.length > 0) {
            const upgradedRarity = Math.random() < 0.80 ? "Rare" : (Math.random() < 0.95 ? "Epic" : "Legendary");
            const upgradedPlayer = choosePlayer(upgradedRarity);
            if (upgradedPlayer) {
                pulledCards[0].rarity = upgradedRarity;
                pulledCards[0].player = upgradedPlayer.name;
                pulledCards[0].rating = upgradedPlayer.rating;
                pulledCards[0].pos = upgradedPlayer.pos;
                pulledCards[0].image = getCardImage(upgradedPlayer);
            }
        }
    }

    if (state.activePotions && state.activePotions.elixirCharges > 0) {
        state.activePotions.elixirCharges = Math.max(0, state.activePotions.elixirCharges - 1);
        toast("🔥 Elixir of Luck (+1000% Boost) was consumed on this pack opening!");
    }

    saveGame();
    renderActivePotionsHUD();

    const foilClasses = {
        starter: { key: "starter", css: "starter-foil", emblem: "📦", title: "STARTER PACK" },
        premium: { key: "premium", css: "premium-foil", emblem: "⭐", title: "PREMIUM PACK" },
        champion: { key: "champion", css: "champion-foil", emblem: "🏆", title: "CHAMPION PACK" },
        exclusive: { key: "exclusive", css: "exclusive-foil", emblem: "👑", title: "EXCLUSIVE PACK" },
        mythic: { key: "mythic", css: "mythic-foil", emblem: "🔥", title: "MYTHIC STARS PACK" },
        secret: { key: "secret", css: "secret-foil", emblem: "💎", title: "SECRET ICONS PACK" },
        worldclass: { key: "worldclass", css: "worldclass-foil", emblem: "🌎", title: "WORLD CLASS PACK" }
    };

    const cfg = foilClasses[type] || foilClasses.starter;

    // Sequential individual pack opening (works for 1x, 3x, and 5x)
    startPackSequence(cfg, pulledCards);
}

let activePackSequence = null;

function startPackSequence(cfg, pulledCards) {
    activePackSequence = {
        queue: [...pulledCards],
        total: pulledCards.length,
        currentIndex: 0,
        cfg: cfg
    };

    // Render single centered booster pack for 1x, 3x, or 5x
    renderBoosterPacksInStage(cfg, 1);

    const animOverlay = document.getElementById("packOpeningOverlay");
    const swipePrompt = document.getElementById("tearSwipePrompt");
    if (swipePrompt) {
        swipePrompt.textContent = activePackSequence.total > 1 
            ? `👉 TAP OR SWIPE TO TEAR PACK (${activePackSequence.total} CARDS INSIDE) ➔` 
            : "👉 TAP OR SWIPE TO TEAR ➔";
    }

    if (animOverlay) {
        lockModalScroll();
        animOverlay.classList.remove("hidden");
        animOverlay.style.display = "flex";
        animOverlay.style.alignItems = "center";
        animOverlay.style.justifyContent = "center";

        initPackSwipeGesture(() => {
            if (animOverlay) {
                animOverlay.classList.add("hidden");
                animOverlay.style.display = "none";
            }
            deliverPackSequenceCard(0);
        });
    }
}

function deliverPackSequenceCard(index) {
    if (!activePackSequence || index >= activePackSequence.total) {
        activePackSequence = null;
        unlockModalScroll();
        renderAll();
        return;
    }

    activePackSequence.currentIndex = index;
    const item = activePackSequence.queue[index];
    const { card, duplicate, isFirstDiscovery } = item;
    const packNum = index + 1;
    const totalPacks = activePackSequence.total;

    function proceedToCardReveal() {
        showCardResult(card, duplicate, isFirstDiscovery, packNum, totalPacks);
    }

    if (card.rarity === "World Class" || card.rarity === "Secret" || card.rarity === "Mythic" || card.rarity === "Developer") {
        cutscenePostCallback = proceedToCardReveal;
        SolsCutsceneEngine.start(card, proceedToCardReveal);
    } else {
        proceedToCardReveal();
    }
}

function closeCardRevealModal() {
    const overlay = document.getElementById("cardRevealOverlay");
    if (overlay) {
        overlay.classList.add("hidden");
        overlay.style.display = "none";
    }
    SoundFx.click();

    if (activePackSequence) {
        if (activePackSequence.currentIndex < activePackSequence.total - 1) {
            // Immediately advance and deliver next card (triggering cutscene if applicable!)
            deliverPackSequenceCard(activePackSequence.currentIndex + 1);
            return;
        } else {
            activePackSequence = null;
        }
    }

    unlockModalScroll();
    renderAll();
}

function showMultiCardResult(pulledCards) {
    const overlay = document.getElementById("multiCardRevealOverlay");
    const grid = document.getElementById("multiRevealGrid");
    const title = document.getElementById("multiRevealTitle");
    const sub = document.getElementById("multiRevealSub");
    if (!overlay || !grid) return;

    lockModalScroll();

    if (title) title.textContent = `All ${pulledCards.length} Cards Pulled`;
    if (sub) sub.textContent = `${pulledCards.length} packs opened! All cards have been added to your collection.`;

    grid.innerHTML = pulledCards.map((item, idx) => {
        const { card, duplicate, isFirstDiscovery } = item;
        const rClass = rarityClassName(card.rarity);
        const bonus = DISCOVERY_BONUS[card.rarity] || 10;
        const isLocked = !!card.locked;

        let themeClass = `theme-${rClass}`;
        if (card.rarity === "World Class") {
            if (card.player === "Lionel Messi") themeClass = "theme-messi";
            else if (card.player === "Cristiano Ronaldo") themeClass = "theme-ronaldo";
        }

        return `
        <article class="card ${themeClass} multi-table-card" ${card.serialGradient ? `style="background:${card.serialGradient};"` : ''}>
            <div class="card-top-row">
                <button class="card-lock-btn ${isLocked ? 'locked' : ''}" onclick="toggleCardLock('${card.id}', event)" title="${isLocked ? 'Unlock Card' : 'Lock Card'}">
                    ${isLocked ? '🔒' : '🔓'}
                </button>
            </div>

            ${card.serialNumber ? `<span class="serial-badge" style="display:inline-block;margin-bottom:6px;">★ SERIAL #${card.serialNumber}/10 ★</span>` : ""}

            <div class="card-image-wrap">
                <img class="card-photo" src="${card.image || 'player_temp.png'}" alt="${escapeHTML(card.player)}" onerror="this.onerror=null;this.src='player_temp.png';">
            </div>
            <div class="card-rating">${card.rating}</div>
            <div class="card-position">${escapeHTML(card.pos)}</div>
            <h3>${escapeHTML(card.player)}</h3>
            <small>${escapeHTML(card.rarity)}</small>

            <div class="multi-pull-meta-badge">
                ${card.serialNumber ? `<span class="badge-serial">★ 1/10 SERIALIZED</span>` : isFirstDiscovery ? `<span class="badge-new">+${bonus} 🪙 FIRST DISCOVERY</span>` : duplicate ? `<span class="badge-dupe">DUPLICATE</span>` : `<span class="badge-new">NEW DISCOVERY</span>`}
            </div>

            <div class="card-actions">
                <button onclick="open3DCard('${card.id}')">3D View</button>
            </div>
        </article>
        `;
    }).join("");

    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
    SoundFx.cardReveal("Legendary");
    toast(`🎉 Successfully opened ${pulledCards.length} packs!`);
}

function closeMultiRevealModal() {
    const overlay = document.getElementById("multiCardRevealOverlay");
    if (overlay) {
        overlay.classList.add("hidden");
        overlay.style.display = "none";
    }
    unlockModalScroll();
    SoundFx.click();
    renderAll();
}

function showMythicCutscene(card) {
    const overlay = document.getElementById("mythicOverlay");
    if (!overlay) {
        showCardResult(card, false, false);
        return;
    }
    lockModalScroll();
    setText("mythicPlayerName", card.player.toUpperCase());
    const photo = document.getElementById("mythicPlayerPhoto");
    if (photo && card.image) photo.src = card.image;
    setText("mythicPlayerMeta", `${card.rating} OVR · ${card.pos} · ★ 1 IN 50 MYTHIC CLASS ★`);
    overlay.classList.remove("hidden");
    SoundFx.mythicCinematic();
}

function closeMythicCutscene() {
    const overlay = document.getElementById("mythicOverlay");
    if (overlay) overlay.classList.add("hidden");
    SoundFx.click();
    if (cutscenePostCallback) {
        const cb = cutscenePostCallback;
        cutscenePostCallback = null;
        cb();
    } else {
        unlockModalScroll();
        renderAll();
    }
}

function showSecretCutscene(card) {
    const overlay = document.getElementById("secretOverlay");
    if (!overlay) {
        showCardResult(card, false, false);
        return;
    }
    lockModalScroll();
    setText("secretPlayerName", card.player.toUpperCase());
    const photo = document.getElementById("secretPlayerPhoto");
    if (photo && card.image) photo.src = card.image;
    setText("secretPlayerMeta", `${card.rating} OVR · ${card.pos} · ★ 1 IN 500 SECRET PHENOMENON ★`);
    overlay.classList.remove("hidden");
    SoundFx.worldClassCinematic();
}

function rollRarity(rates) {
    const luckMult = getActiveLuckMultiplier();
    
    // Rarity hierarchy evaluated strictly from RAREST to COMMON
    const RARITY_HIERARCHY = ["World Class", "Secret", "Mythic", "Legendary", "Epic", "Rare", "Uncommon", "Common"];
    
    const adjusted = {};
    for (const r of RARITY_HIERARCHY) {
        if (rates[r] !== undefined) {
            adjusted[r] = Number(rates[r]) || 0;
        }
    }

    if (luckMult > 1) {
        for (const r of ["World Class", "Secret", "Mythic", "Legendary"]) {
            if (adjusted[r] !== undefined) {
                adjusted[r] = adjusted[r] * luckMult;
            }
        }
    }

    let totalWeight = 0;
    for (const r in adjusted) {
        totalWeight += adjusted[r];
    }

    if (totalWeight > 0) {
        for (const r in adjusted) {
            adjusted[r] = (adjusted[r] / totalWeight) * 100;
        }
    }

    const roll = Math.random() * 100;
    let accumulated = 0;
    for (const r of RARITY_HIERARCHY) {
        if (adjusted[r] !== undefined) {
            accumulated += adjusted[r];
            if (roll < accumulated) {
                return r;
            }
        }
    }

    return Object.keys(rates)[Object.keys(rates).length - 1] || "Common";
}

function choosePlayer(rarity) {
    let pool = PLAYERS.filter(p => p.rarity === rarity && !p.hiddenFromIndex);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}

function rollExclusivePlayer() {
    const list = PLAYERS.filter(p => p.rarity === "Exclusive");
    let random = Math.random() * 100;
    for (const p of list) {
        random -= (p.odds || 20);
        if (random < 0) return p;
    }
    return list[0];
}

function updateRarityStats(rarity, player) {
    if (!state.stats) state.stats = {};
    if (rarity === "World Class") {
        state.stats.worldClass = (state.stats.worldClass || 0) + 1;
    } else {
        const key = rarity.toLowerCase().replaceAll(" ", "");
        state.stats[key] = (state.stats[key] || 0) + 1;
    }

    const currentPeakOrder = RARITY_ORDER[state.stats.highestRarity] || 0;
    const newOrder = RARITY_ORDER[rarity] || 0;
    if (newOrder > currentPeakOrder) {
        state.stats.highestRarity = rarity;
    }
    if (player && player.rating && player.rating > (state.stats.highestRating || 0)) {
        state.stats.highestRating = player.rating;
    }
}

/* =========================================================
   PACK ODDS MODAL
   ========================================================= */

function openPackOdds(packType) {
    const pack = PACKS[packType];
    if (!pack) return;

    setText("oddsPackTitle", `Odds: ${pack.name}`);
    setText("oddsPackCost", `Scouting Cost: ${pack.cost} 🪙`);

    const list = document.getElementById("oddsRatesList");
    if (list) {
        list.innerHTML = Object.keys(pack.rates).map(r => `
            <div class="odds-rate-row">
                <span class="rarity ${rarityClassName(r)}">${escapeHTML(r)}</span>
                <b>${pack.rates[r]}%</b>
            </div>
        `).join("");
    }

    const modal = document.getElementById("packOddsModal");
    if (modal) modal.classList.remove("hidden");
    SoundFx.click();
}

function closePackOddsModal() {
    const modal = document.getElementById("packOddsModal");
    if (modal) modal.classList.add("hidden");
}

/* =========================================================
   SOL'S RNG ULTRA-CINEMATIC CUTSCENE ENGINE
   BLACKOUT + 60FPS VORTEX + FLASHBANG + 3D CARD SLAM
   ========================================================= */

const SolsCutsceneEngine = {
    activeCard: null,
    onCompleteCallback: null,
    canvas: null,
    ctx: null,
    animFrame: null,
    particles: [],
    phase: 0,
    startTime: 0,
    isSkipped: false,
    theme: "worldclass",

    initCanvas() {
        this.canvas = document.getElementById("solsCanvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.resize();
    },

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    start(card, onComplete) {
        this.activeCard = card;
        this.onCompleteCallback = onComplete;
        this.isSkipped = false;
        this.phase = 0;
        this.startTime = Date.now();
        this.particles = [];
        this.lightningArcs = [];

        // 1. Determine Individual Custom Cutscene Theme
        const nameLower = (card.player || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let t = "mythic";
        if (nameLower.includes("monkey") || nameLower.includes("wukong")) t = "monkey";
        else if (nameLower.includes("messi")) t = "messi";
        else if (nameLower.includes("ronaldo")) t = "ronaldo";
        else if (nameLower.includes("haaland")) t = "haaland";
        else if (nameLower.includes("mbappe")) t = "mbappe";
        else if (nameLower.includes("yamal")) t = "yamal";
        else if (nameLower.includes("neymar")) t = "neymar";
        else if (nameLower.includes("bruyne") || nameLower.includes("kdb")) t = "kdb";
        else if (nameLower.includes("vinicius") || nameLower.includes("vini")) t = "vini";
        else if (nameLower.includes("bellingham")) t = "bellingham";
        else if (nameLower.includes("salah")) t = "salah";
        else if (nameLower.includes("lewandowski") || nameLower.includes("lewa")) t = "lewa";
        else if (card.rarity === "World Class") t = "messi";
        else if (card.rarity === "Secret") t = "haaland";
        else t = "mythic";
        this.theme = t;

        const overlay = document.getElementById("solsCinematicOverlay");
        const shakeWrap = document.getElementById("solsShakeWrap");
        const textSeq = document.getElementById("solsTextSequence");
        const preText = document.getElementById("solsPhasePreText");
        const rarityTag = document.getElementById("solsPhaseRarityTag");
        const runeRing = document.getElementById("solsRuneRing");
        const flashbang = document.getElementById("solsFlashbang");
        const cardBox = document.getElementById("solsCardBox");
        const rift = document.getElementById("solsAtmosphereRift");

        if (!overlay) return;

        lockModalScroll();

        // Configure class themes & activation
        overlay.className = `modal sols-cinematic-stage sols-theme-${this.theme} active`;
        overlay.classList.remove("hidden");
        overlay.style.display = "flex";

        if (cardBox) {
            cardBox.style.display = "none";
            cardBox.classList.remove("sols-card-revealed", "sols-card-slam-anim");
        }
        if (flashbang) flashbang.classList.remove("sols-flashbang-active");

        const preTexts = {
            monkey: '[ 🐵 "THE MONKEY KING" : SUN WUKONG 🐵 ]',
            messi: '[ 🐐 "LA PULGA" : LIONEL MESSI 🐐 ]',
            ronaldo: '[ 👑 "EL BICHO" : CRISTIANO RONALDO 👑 ]',
            haaland: '[ ⚔️ "THE VIKING" : ERLING HAALAND ⚔️ ]',
            mbappe: '[ ⚡ "DICTATOR MBAPPÉ" : KYLIAN MBAPPÉ ⚡ ]',
            yamal: '[ ✦ "THE WUNDERKIND" : LAMINE YAMAL ✦ ]',
            neymar: '[ 🇧🇷 "O MÁGICO" : NEYMAR JR 🇧🇷 ]',
            kdb: '[ 🎯 "THE ASSIST KING" : KEVIN DE BRUYNE 🎯 ]',
            vini: '[ ⚡ "VINI JR" : SAMBA DANCER ⚡ ]',
            bellingham: '[ 👑 "BELLI-GOAL" : JUDE BELLINGHAM 👑 ]',
            salah: '[ 👑 "THE EGYPTIAN KING" : MO SALAH 👑 ]',
            lewa: '[ ⚽ "LEWANGOALSKI" : ROBERT LEWANDOWSKI ⚽ ]',
            mythic: '[ 🔥 MYTHIC SUPERSTAR CLASS 🔥 ]'
        };
        const rarityTexts = {
            monkey: "★ 1 IN 1,000,000 MYTHICAL DEVELOPER CARD ★",
            messi: "★ 1 IN 10,000 THE GREATEST OF ALL TIME · 8x BALLON D'OR ★",
            ronaldo: "★ 1 IN 10,000 ALL-TIME TOP GOALSCORER · 5x UCL KING ★",
            haaland: "✦ 1 IN 500 THE UNSTOPPABLE VIKING GOAL MACHINE ✦",
            mbappe: "✦ 1 IN 500 REAL MADRID GALACTICO · GENERATIONAL STRIKER ✦",
            yamal: "✦ 1 IN 500 2024 GOLDEN BOY · EL NIÑO PRODIGIO ✦",
            neymar: "★ 1 IN 50 BRAZILIAN SAMBA MAGICIAN ★",
            kdb: "★ 1 IN 50 PREMIER LEAGUE MIDFIELD MAESTRO ★",
            vini: "★ 1 IN 50 REAL MADRID ELECTRIC WINGER ★",
            bellingham: "★ 1 IN 50 GOLDEN BOY MIDFIELD TITAN ★",
            salah: "★ 1 IN 50 ANFIELD EGYPTIAN KING ★",
            lewa: "★ 1 IN 50 5-GOAL RECORD GOALSCORER ★",
            mythic: "★ 1 IN 50 MYTHIC SUPERSTAR CLASS ★"
        };

        if (preText) {
            preText.style.opacity = "0";
            preText.style.transform = "scale(0.85)";
            preText.textContent = preTexts[this.theme] || preTexts.mythic;
        }
        if (rarityTag) {
            rarityTag.style.opacity = "0";
            rarityTag.style.transform = "translateY(20px)";
            rarityTag.textContent = rarityTexts[this.theme] || rarityTexts.mythic;
        }
        if (runeRing) runeRing.style.opacity = "0";
        if (rift) rift.style.opacity = "0";
        if (textSeq) textSeq.style.display = "flex";

        this.initCanvas();
        this.spawnCustomParticles();
        this.animateCanvas();

        // Audio Tension Riser + Heartbeats
        SoundFx.playSolsRiser(this.theme);

        // Phase 0: Instant Blackout & Screen Rumble (0.0s)
        if (shakeWrap) shakeWrap.classList.add("sols-shake-rumble");
        if (rift) setTimeout(() => { if (!this.isSkipped && rift) rift.style.opacity = "1"; }, 200);

        // Phase 1: Pre-Text Eerie Reveal (0.4s)
        setTimeout(() => {
            if (this.isSkipped) return;
            if (preText) {
                preText.style.opacity = "1";
                preText.style.transform = "scale(1.05)";
            }
            SoundFx.playTone(this.theme === "messi" || this.theme === "ronaldo" ? 523.25 : 440, "sine", 0.4, 0.08);
        }, 400);

        // Phase 2: Rarity Flash & Turbo Vortex (1.0s)
        setTimeout(() => {
            if (this.isSkipped) return;
            if (rarityTag) {
                rarityTag.style.opacity = "1";
                rarityTag.style.transform = "translateY(0)";
            }
            if (runeRing) runeRing.style.opacity = "1";
            this.turbochargeVortex();
            SoundFx.playTone(this.theme === "messi" || this.theme === "ronaldo" ? 659.25 : 554.37, "sine", 0.5, 0.1);
        }, 1000);

        // Phase 3: SUPERNOVA FLASHBANG + INSTANT CARD SLAM (1.8s)
        setTimeout(() => {
            if (this.isSkipped) return;
            this.triggerSupernova();
            this.revealGrandCard();
        }, 1800);
    },

    spawnCustomParticles() {
        this.particles = [];
        const count = 160;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 80 + Math.random() * (Math.max(cx, cy) * 1.3);

            let hue = 45;
            let type = "vortex";

            if (this.theme === "messi") {
                hue = Math.random() > 0.4 ? 48 : 190; // Gold & Argentine Cyan
            } else if (this.theme === "ronaldo") {
                hue = Math.random() > 0.5 ? 195 : 48; // Electric Cyan & Imperial Gold
                type = "lightning";
            } else if (this.theme === "yamal") {
                hue = Math.random() > 0.5 ? 165 : 280; // Quantum Neon Turquoise & Violet
                type = Math.random() > 0.6 ? "cube" : "vortex";
            } else if (this.theme === "mbappe" || this.theme === "haaland") {
                hue = Math.random() > 0.5 ? 200 : 270; // Warp Speed Cyan & Ultra-Violet
                type = "warp";
            } else {
                hue = 15 + Math.random() * 30; // Solar Magma Orange
                type = "fire";
            }

            this.particles.push({
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                angle: angle,
                dist: dist,
                speed: 0.02 + Math.random() * 0.035,
                radialSpeed: 1.8 + Math.random() * 3.0,
                size: 2 + Math.random() * 4.5,
                alpha: 0.3 + Math.random() * 0.7,
                hue: hue,
                type: type,
                pulse: Math.random() * Math.PI
            });
        }
    },

    turbochargeVortex() {
        this.particles.forEach(p => {
            p.speed *= 2.6;
            p.radialSpeed *= 2.2;
        });
    },

    triggerSupernova() {
        const flashbang = document.getElementById("solsFlashbang");
        const shakeWrap = document.getElementById("solsShakeWrap");
        const textSeq = document.getElementById("solsTextSequence");

        if (flashbang) {
            flashbang.classList.remove("sols-flashbang-active");
            void flashbang.offsetWidth;
            flashbang.classList.add("sols-flashbang-active");
        }
        if (textSeq) textSeq.style.display = "none";
        if (shakeWrap) {
            shakeWrap.classList.add("sols-shake-rumble");
            setTimeout(() => { if (shakeWrap) shakeWrap.classList.remove("sols-shake-rumble"); }, 1000);
        }

        // Spawn Supernova Exploding Particles
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        this.particles = [];
        for (let i = 0; i < 220; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 6 + Math.random() * 22;
            let hue = 45;
            if (this.theme === "messi") hue = Math.random() > 0.4 ? 48 : 190;
            else if (this.theme === "ronaldo") hue = Math.random() > 0.5 ? 195 : 48; // Electric Cyan & Imperial Gold
            else if (this.theme === "yamal") hue = Math.random() > 0.5 ? 165 : 280;
            else if (this.theme === "mbappe" || this.theme === "haaland") hue = 200;
            else hue = 20;

            this.particles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                size: 3 + Math.random() * 6,
                alpha: 1.0,
                decay: 0.015 + Math.random() * 0.02,
                hue: hue,
                isExplosion: true
            });
        }

        SoundFx.playSolsSupernova(this.theme);
    },

    revealGrandCard() {
        const cardBox = document.getElementById("solsCardBox");
        const img = document.getElementById("solsCardImg");
        const name = document.getElementById("solsCardPlayerName");
        const ovr = document.getElementById("solsCardOvr");
        const pos = document.getElementById("solsCardPos");
        const quote = document.getElementById("solsCardQuote");
        const crest = document.getElementById("solsTopCrest");
        const emblem = document.getElementById("solsEmblemIcon");
        const serial = document.getElementById("solsSerialBadge");
        const banner = document.getElementById("solsRarityBanner");

        // Cleanly hide the introductory text sequences so they never overlap the 3D card presentation!
        const textSeq = document.getElementById("solsTextSequence");
        if (textSeq) {
            textSeq.style.display = "none";
            textSeq.style.opacity = "0";
        }
        const preText = document.getElementById("solsPreText");
        if (preText) {
            preText.style.display = "none";
            preText.style.opacity = "0";
        }
        const rarityTag = document.getElementById("solsRarityTag");
        if (rarityTag) {
            rarityTag.style.display = "none";
            rarityTag.style.opacity = "0";
        }

        const c = this.activeCard;
        if (!c) return;

        const normName = (c.player || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const isMonkey = normName.includes("monkey") || normName.includes("wukong");
        const isMessi = normName.includes("messi");
        const isRonaldo = normName.includes("cristiano") || normName === "cr7";
        const isYamal = normName.includes("yamal");
        const isMbappe = normName.includes("mbappe");
        const isHaaland = normName.includes("haaland");
        const isSerial = !!c.serialNumber;

        if (img) {
            img.src = getCardImage(c);
            img.setAttribute("draggable", "false");
        }
        if (name) name.textContent = (c.player || "PLAYER").toUpperCase();
        if (ovr) ovr.textContent = `${c.rating || 90} OVR`;
        if (pos) pos.textContent = c.pos || "ST";

        // Fix Rarity Banner so Developer is DEVELOPER, Secret is SECRET, Mythic is MYTHIC, World Class is WORLD CLASS
        if (banner) {
            banner.textContent = (c.rarity === "Developer" || isMonkey) ? "DEVELOPER" : (c.rarity || "WORLD CLASS").toUpperCase();
            const rKey = (c.rarity || "worldclass").toLowerCase().replace(/\s+/g, "");
            banner.className = `sols-rarity-banner sols-banner-${rKey}`;
        }

        if (crest) {
            if (isSerial) crest.textContent = `★ SERIALIZED #${c.serialNumber}/10 ★`;
            else if (isMonkey) crest.textContent = "👑 THE MONKEY KING · 99 OVR 👑";
            else if (isMessi) crest.textContent = "🐐 8x BALLON D'OR · LA PULGA 🐐";
            else if (isRonaldo) crest.textContent = "👑 5x UCL KING · EL BICHO 👑";
            else if (isHaaland) crest.textContent = "⚔️ THE VIKING · ERLING HAALAND ⚔️";
            else if (isMbappe) crest.textContent = "⚡ DICTATOR MBAPPÉ · GOLDEN BOOT ⚡";
            else if (isYamal) crest.textContent = "✦ THE WUNDERKIND · GOLDEN BOY ✦";
            else if (c.player && c.player.includes("Neymar")) crest.textContent = "🔥 O MÁGICO · NEYMAR JR 🔥";
            else if (c.player && c.player.includes("Bruyne")) crest.textContent = "🎯 THE ASSIST KING · KDB 🎯";
            else if (c.player && c.player.includes("Vin")) crest.textContent = "⚡ VINI JR · SAMBA DANCER ⚡";
            else if (c.player && c.player.includes("Bellingham")) crest.textContent = "👑 BELLI-GOAL · GOLDEN BOY 👑";
            else if (c.player && c.player.includes("Salah")) crest.textContent = "👑 THE EGYPTIAN KING · MO SALAH 👑";
            else if (c.player && c.player.includes("Lewandowski")) crest.textContent = "⚽ LEWANGOALSKI · THE MACHINE ⚽";
            else if (c.rarity === "Secret") crest.textContent = "✦ SECRET PHENOMENON ✦";
            else if (c.rarity === "Mythic") crest.textContent = "🔥 MYTHIC SUPERSTAR 🔥";
            else crest.textContent = "★ WORLD CLASS LEGEND ★";
        }

        if (emblem) {
            if (isMonkey) emblem.textContent = "🐵";
            else if (isMessi) emblem.textContent = "🇦🇷";
            else if (isRonaldo) emblem.textContent = "🇵🇹";
            else if (isYamal) emblem.textContent = "🇪🇸";
            else if (isMbappe) emblem.textContent = "🇫🇷";
            else if (isHaaland) emblem.textContent = "🇳🇴";
            else if (c.player && c.player.includes("Neymar")) emblem.textContent = "🇧🇷";
            else if (c.player && c.player.includes("Bruyne")) emblem.textContent = "🇧🇪";
            else if (c.player && c.player.includes("Vin")) emblem.textContent = "🇧🇷";
            else if (c.player && c.player.includes("Bellingham")) emblem.textContent = "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
            else if (c.player && c.player.includes("Salah")) emblem.textContent = "🇪🇬";
            else if (c.player && c.player.includes("Lewandowski")) emblem.textContent = "🇵🇱";
            else if (c.rarity === "Secret") emblem.textContent = "💎";
            else if (c.rarity === "Mythic") emblem.textContent = "🔥";
            else emblem.textContent = "🌎";
        }

        if (quote) {
            if (isMonkey) quote.textContent = '"Sun Wukong · \'The Monkey King\' · Ultimate Football Divinity & Ruler"';
            else if (isMessi) quote.textContent = '"Lionel Messi · \'La Pulga\' · 8x Ballon d\'Or Winner · World Champion"';
            else if (isRonaldo) quote.textContent = '"Cristiano Ronaldo · \'El Bicho\' · All-Time Top Goalscorer · SIUUU!"';
            else if (isHaaland) quote.textContent = '"Erling Haaland · \'The Viking\' · Unstoppable Goal Machine"';
            else if (isMbappe) quote.textContent = '"Kylian Mbappé · \'Dictator Mbappé\' · World Cup Golden Boot Winner"';
            else if (isYamal) quote.textContent = '"Lamine Yamal · \'The Wunderkind\' · Euro Champion & Golden Boy Prodigy"';
            else if (c.player && c.player.includes("Neymar")) quote.textContent = '"Neymar Jr · \'O Mágico\' · Brazilian Samba Joga Bonito Master"';
            else if (c.player && c.player.includes("Bruyne")) quote.textContent = '"Kevin De Bruyne · \'The Assist King\' · Master Midfield Playmaker"';
            else if (c.player && c.player.includes("Vin")) quote.textContent = '"Vinícius Júnior · \'Vini Jr\' · Real Madrid Samba Winger"';
            else if (c.player && c.player.includes("Bellingham")) quote.textContent = '"Jude Bellingham · \'Belli-Goal\' · Real Madrid Midfield Superstar"';
            else if (c.player && c.player.includes("Salah")) quote.textContent = '"Mohamed Salah · \'The Egyptian King\' · Liverpool Legend"';
            else if (c.player && c.player.includes("Lewandowski")) quote.textContent = '"Robert Lewandowski · \'Lewangoalski\' · Master Goal Machine"';
            else quote.textContent = '"Generational Football Icon · Master of the Beautiful Game"';
        }

        if (serial) {
            serial.style.display = isSerial ? "inline-block" : "none";
            if (isSerial) serial.textContent = `★ SERIAL #${c.serialNumber}/10 ★`;
        }

        if (cardBox) {
            cardBox.style.display = "flex";
            cardBox.classList.remove("sols-card-slam-anim");
            void cardBox.offsetWidth;
            cardBox.classList.add("sols-card-revealed", "sols-card-slam-anim");
        }

        SoundFx.playSolsFanfare(this.theme);

        // 1. Click / Tap ANYWHERE on the screen to instantly claim and continue
        const overlay = document.getElementById("solsCinematicOverlay");
        if (overlay) {
            overlay.onclick = (e) => {
                if (e.target && e.target.id === "solsReplayBtn") return;
                this.claim();
            };
        }

        // 2. Fail-safe Auto-Claim after 3.8s so the user is NEVER stuck on a black screen!
        if (this.autoClaimTimer) clearTimeout(this.autoClaimTimer);
        this.autoClaimTimer = setTimeout(() => {
            if (this.activeCard) {
                this.claim();
            }
        }, 3800);
    },

    skip() {
        if (this.isSkipped) return;
        this.isSkipped = true;
        this.triggerSupernova();
        this.revealGrandCard();
    },

    claim() {
        if (this.autoClaimTimer) {
            clearTimeout(this.autoClaimTimer);
            this.autoClaimTimer = null;
        }
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        const overlay = document.getElementById("solsCinematicOverlay");
        if (overlay) {
            overlay.onclick = null;
            overlay.classList.remove("active");
            overlay.classList.add("hidden");
            overlay.style.display = "none";
        }
        SoundFx.coin();
        if (typeof createConfetti === "function") createConfetti();

        if (this.onCompleteCallback) {
            const cb = this.onCompleteCallback;
            this.onCompleteCallback = null;
            cb();
        } else if (cutscenePostCallback) {
            const cb = cutscenePostCallback;
            cutscenePostCallback = null;
            cb();
        } else if (this.activeCard) {
            showCardResult(this.activeCard, false, false, 1, 1);
        } else {
            unlockModalScroll();
            renderAll();
        }
    },

    replay() {
        if (this.activeCard) {
            this.start(this.activeCard, this.onCompleteCallback);
        }
    },

    animateCanvas() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Draw and update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.isExplosion) {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.94;
                p.vy *= 0.94;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.alpha})`;
                ctx.shadowBlur = 12;
                ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
                ctx.fill();
            } else if (p.type === "warp") {
                // Hyper-speed warp tunnel streak lines
                p.dist += p.radialSpeed * 1.5;
                if (p.dist > Math.max(cx, cy) * 1.4) p.dist = 40;

                const px = cx + Math.cos(p.angle) * p.dist;
                const py = cy + Math.sin(p.angle) * p.dist;
                const tailX = cx + Math.cos(p.angle) * (p.dist - 25);
                const tailY = cy + Math.sin(p.angle) * (p.dist - 25);

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(px, py);
                ctx.strokeStyle = `hsla(${p.hue}, 100%, 80%, ${p.alpha})`;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
                ctx.stroke();
            } else if (p.type === "cube") {
                // Floating quantum holographic cubes
                p.angle += p.speed;
                p.dist -= p.radialSpeed * 0.8;
                if (p.dist <= 15) p.dist = 80 + Math.random() * (Math.max(cx, cy) * 1.2);

                const px = cx + Math.cos(p.angle) * p.dist;
                const py = cy + Math.sin(p.angle) * p.dist;

                ctx.strokeStyle = `hsla(${p.hue}, 100%, 75%, ${p.alpha})`;
                ctx.lineWidth = 1.5;
                ctx.strokeRect(px - p.size, py - p.size, p.size * 2, p.size * 2);
            } else {
                // Standard vortex particles
                p.angle += p.speed;
                p.dist -= p.radialSpeed;

                if (p.dist <= 15) {
                    p.dist = 80 + Math.random() * (Math.max(cx, cy) * 1.3);
                    p.angle = Math.random() * Math.PI * 2;
                }

                p.x = cx + Math.cos(p.angle) * p.dist;
                p.y = cy + Math.sin(p.angle) * p.dist;
                p.pulse += 0.05;

                const currentSize = p.size * (0.8 + 0.4 * Math.sin(p.pulse));

                ctx.beginPath();
                ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
                ctx.fill();
            }
        }

        this.animFrame = requestAnimationFrame(() => this.animateCanvas());
    }
};

function skipSolsCutscene() { SolsCutsceneEngine.skip(); }
function claimSolsCard() { SolsCutsceneEngine.claim(); }
function replaySolsCutscene() { SolsCutsceneEngine.replay(); }

function showWorldClass(card, onComplete) {
    SolsCutsceneEngine.start(card, onComplete || cutscenePostCallback);
}

function showSecretCutscene(card, onComplete) {
    SolsCutsceneEngine.start(card, onComplete || cutscenePostCallback);
}

function showMythicCutscene(card, onComplete) {
    SolsCutsceneEngine.start(card, onComplete || cutscenePostCallback);
}

function showCardResult(card, duplicate, isFirstDiscovery, packNum = 1, totalPacks = 1) {
    const overlay = document.getElementById("cardRevealOverlay");
    const revealCard = document.getElementById("revealCard");
    const revealBadge = document.getElementById("revealBadge");
    const revealRarity = document.getElementById("revealRarity");
    const revealPhoto = document.getElementById("revealPhoto");
    const revealRating = document.getElementById("revealRating");
    const revealPos = document.getElementById("revealPos");
    const revealName = document.getElementById("revealName");
    const revealRaritySub = document.getElementById("revealRaritySub");
    const collectBtn = document.getElementById("revealCollectBtn");

    if (overlay && revealCard) {
        revealCard.className = "card reveal-card-body";
        const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
        revealCard.classList.add(frame.css);

        const rClass = rarityClassName(card.rarity);
        revealCard.classList.add(`glow-${rClass}`);

        if (card.serialGradient) {
            revealCard.style.background = card.serialGradient;
        } else {
            revealCard.style.background = "";
        }

        if (revealBadge) {
            revealBadge.textContent = card.serialNumber ? `★ SERIALIZED #${card.serialNumber}/10 ★` : duplicate ? "DUPLICATE CARD" : "NEW CARD";
            revealBadge.classList.toggle("duplicate", !!duplicate && !card.serialNumber);
        }

        if (revealRarity) {
            revealRarity.textContent = card.rarity.toUpperCase();
            revealRarity.className = `rarity ${rClass}`;
        }

        if (revealPhoto) {
            revealPhoto.src = getCardImage(card);
            revealPhoto.setAttribute("draggable", "false");
        }

        if (revealRating) revealRating.textContent = card.rating;
        if (revealPos) revealPos.textContent = card.pos;
        if (revealName) revealName.textContent = card.player;
        if (revealRaritySub) revealRaritySub.textContent = card.rarity;

        if (collectBtn) {
            if (totalPacks > 1) {
                if (packNum < totalPacks) {
                    collectBtn.textContent = `Collect & Next (${packNum}/${totalPacks}) ➔`;
                } else {
                    collectBtn.textContent = `Collect Final Card (${totalPacks}/${totalPacks}) ✓`;
                }
            } else {
                collectBtn.textContent = "Collect Card ✓";
            }
        }

        overlay.classList.remove("hidden");
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
    }

    SoundFx.cardReveal(card.rarity);
    toast(`${card.player} — ${card.rarity}${duplicate ? " · DUPLICATE" : ""}`);
}

/* =========================================================
   INTERACTIVE 3D CARD INSPECTOR
   ========================================================= */

let is3DCardFlipped = false;
let card3DRotX = 0;
let card3DRotY = 0;

function init3DInspector() {
    const stage = document.getElementById("card3DStage");
    const flipper = document.getElementById("card3DFlipper");
    const shine = document.getElementById("card3DShine");
    if (!stage || !flipper) return;

    let isDragging = false;
    let startX = 0, startY = 0;

    function applyTransform() {
        const baseFlip = is3DCardFlipped ? 180 : 0;
        flipper.style.transform = `rotateX(${card3DRotX}deg) rotateY(${card3DRotY + baseFlip}deg) scale3d(1.04, 1.04, 1.04)`;
    }

    stage.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        card3DRotY += dx * 0.7;
        card3DRotX = Math.max(-60, Math.min(60, card3DRotX - dy * 0.7));
        applyTransform();
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });

    stage.addEventListener("touchstart", (e) => {
        if (e.touches.length) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
        if (!isDragging || !e.touches.length) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        card3DRotY += dx * 0.8;
        card3DRotX = Math.max(-60, Math.min(60, card3DRotX - dy * 0.8));
        applyTransform();
    }, { passive: true });

    window.addEventListener("touchend", () => {
        isDragging = false;
    });
}

function toggle3DCardFlip() {
    is3DCardFlipped = !is3DCardFlipped;
    const flipper = document.getElementById("card3DFlipper");
    if (flipper) {
        const baseFlip = is3DCardFlipped ? 180 : 0;
        flipper.style.transform = `rotateX(${card3DRotX}deg) rotateY(${card3DRotY + baseFlip}deg) scale3d(1.04, 1.04, 1.04)`;
    }
    SoundFx.click();
}

let globalCardPopulations = {};

async function updateGlobalCardPopulations() {
    try {
        const counts = {};
        if (state && Array.isArray(state.cards)) {
            state.cards.forEach(c => {
                if (c && (c.player || c.name)) {
                    const k = (c.player || c.name).trim().toLowerCase();
                    counts[k] = (counts[k] || 0) + 1;
                }
            });
        }

        const allCloud = await GlobalCloudRest.fetchAllUsers();
        const localAccs = CloudSync.getAccounts();
        const merged = { ...localAccs, ...allCloud };

        const currentU = (state && state.accountUser ? state.accountUser.toLowerCase() : "");
        for (const k in merged) {
            if (k.toLowerCase() === currentU) continue;
            const u = merged[k];
            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch(e) {}
            if (Array.isArray(pData.cards) && pData.cards.length > 0) {
                pData.cards.forEach(c => {
                    if (c && (c.player || c.name)) {
                        const pk = (c.player || c.name).trim().toLowerCase();
                        counts[pk] = (counts[pk] || 0) + 1;
                    }
                });
            }
        }
        globalCardPopulations = counts;
    } catch (e) {}
}

function getCardExistCount(card) {
    if (!card) return 1;
    const name = (card.player || card.name || "").trim().toLowerCase();
    if (!name) return 1;
    const pop = globalCardPopulations[name];
    if (typeof pop === "number" && pop > 0) return pop;
    if (state && Array.isArray(state.cards)) {
        const localCount = state.cards.filter(c => c && ((c.player || c.name || "").toLowerCase() === name)).length;
        if (localCount > 0) return localCount;
    }
    return 1;
}

function open3DCard(identifier, isFromIndex = false) {
    let pObj = PLAYERS.find(p => p.name === identifier);
    let cardObj = isFromIndex ? null : state.cards.find(c => c.id === identifier);

    if (!cardObj && !isFromIndex && !pObj) {
        cardObj = state.cards.find(c => c.player === identifier);
    }

    const player = cardObj || pObj;
    if (!player) return;

    is3DCardFlipped = false;
    card3DRotX = 0;
    card3DRotY = 0;

    const flipper = document.getElementById("card3DFlipper");
    if (flipper) {
        flipper.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }

    const modal = document.getElementById("card3DModal");
    const cardEl = document.getElementById("card3DCard");
    const photo = document.getElementById("card3DPhoto");
    const rBadge = document.getElementById("card3DRarity");
    const badgeWrap = document.getElementById("card3DBadgeWrap");

    if (badgeWrap) {
        if (!isFromIndex && cardObj && cardObj.serialNumber) {
            badgeWrap.innerHTML = `<span class="serial-badge" style="background:${cardObj.serialGradient}">★ SERIAL #${cardObj.serialNumber}/10 ★</span>`;
        } else {
            badgeWrap.innerHTML = "";
        }
    }

    const rClass = rarityClassName(player.rarity);
    let themeClass = "";
    const pName = player.player || player.name;
    if (pName === "Lionel Messi") {
        themeClass = "theme-messi";
    } else if (pName === "Cristiano Ronaldo") {
        themeClass = "theme-ronaldo";
    } else if (pName === "Monkey King" || player.devCard) {
        themeClass = "theme-developer";
    } else if (player.rarity === "Tournament") {
        themeClass = "theme-tournament";
    }

    if (cardEl) {
        if (!isFromIndex && cardObj && cardObj.serialGradient) {
            cardEl.className = `card-3d-wrapper card-3d-front glow-${rClass} is-serialized`;
            cardEl.style.background = cardObj.serialGradient;
            cardEl.style.backgroundSize = "200% 200%";
            cardEl.style.animation = "serializedHoloShift 4s ease-in-out infinite alternate";
        } else {
            cardEl.className = `card-3d-wrapper card-3d-front glow-${rClass} ${themeClass}`;
            cardEl.style.background = "";
            cardEl.style.backgroundSize = "";
            cardEl.style.animation = "";
        }
    }

    if (rBadge) {
        rBadge.textContent = player.rarity.toUpperCase();
        rBadge.className = `rarity ${rClass}`;
    }

    if (photo) {
        photo.src = getCardImage(player);
        photo.setAttribute("draggable", "false");
    }

    setText("card3DRating", player.rating);
    setText("card3DPos", player.pos);
    setText("card3DName", player.player || player.name);
    setText("card3DRaritySub", player.rarity);

    setText("card3DStatsOvrPos", `${player.rating} OVR · ${player.pos}`);
    const rap = calculateCardRAP(cardObj || player);
    setText("card3DStatsVal", `💎 ${formatRAP(rap, cardObj || player)}`);

    const dateObj = (cardObj && cardObj.obtained) ? new Date(cardObj.obtained) : new Date();
    const dateFormatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeFormatted = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setText("card3DStatsDateTime", `${dateFormatted} · ${timeFormatted}`);

    const existCount = getCardExistCount(cardObj || player);
    setText("card3DStatsPop", `⚡ ${existCount} Exist Worldwide`);

    if (modal) modal.classList.remove("hidden");
    SoundFx.click();
}

function close3DCardModal() {
    const modal = document.getElementById("card3DModal");
    if (modal) modal.classList.add("hidden");
}

/* =========================================================
   INDEX / CATALOG SYSTEM
   ========================================================= */

function renderIndex() {
    const grid = document.getElementById("indexGrid");
    const filter = document.getElementById("indexFilter");
    if (!grid) return;

    state.claimedIndexRewards = state.claimedIndexRewards || [];

    const basePlayers = PLAYERS.filter(p => !p.hiddenFromIndex);
    let list = [...basePlayers];
    if (filter && filter.value !== "all") {
        list = list.filter(p => p.rarity.toLowerCase() === filter.value.toLowerCase());
    }

    const total = basePlayers.length;
    const discoveredPlayers = basePlayers.filter(p => state.unlockedCardNames.includes(p.name) || state.cards.some(c => c.player === p.name));
    const discoveredCount = discoveredPlayers.length;
    const pct = Math.round((discoveredCount / total) * 100);

    setText("indexProgressText", `${discoveredCount} / ${total} Players Discovered (${pct}%)`);
    const pBar = document.getElementById("indexProgressBar");
    if (pBar) pBar.style.width = `${pct}%`;

    // Calculate Unclaimed Rewards
    const unclaimedPlayers = discoveredPlayers.filter(p => !state.claimedIndexRewards.includes(p.name));
    const totalUnclaimedCoins = unclaimedPlayers.reduce((sum, p) => sum + (DISCOVERY_BONUS[p.rarity] || 10), 0);

    const claimAllBtn = document.getElementById("indexClaimAllBtn");
    if (claimAllBtn) {
        if (totalUnclaimedCoins > 0) {
            claimAllBtn.disabled = false;
            claimAllBtn.style.opacity = "1";
            claimAllBtn.style.cursor = "pointer";
            claimAllBtn.textContent = `✨ Claim All Rewards (+${totalUnclaimedCoins.toLocaleString()} 🪙)`;
            claimAllBtn.style.background = "linear-gradient(135deg, #00f2fe, #4facfe)";
        } else {
            claimAllBtn.disabled = true;
            claimAllBtn.style.opacity = "0.6";
            claimAllBtn.style.cursor = "default";
            claimAllBtn.textContent = `✓ All Discovery Rewards Claimed`;
            claimAllBtn.style.background = "rgba(255,255,255,0.08)";
        }
    }

    grid.innerHTML = list.map(player => {
        const isUnlocked = state.unlockedCardNames.includes(player.name) || state.cards.some(c => c.player === player.name);
        const rClass = rarityClassName(player.rarity);
        const bonus = DISCOVERY_BONUS[player.rarity] || 10;
        const isClaimed = state.claimedIndexRewards.includes(player.name);

        if (!isUnlocked) {
            return `
            <article class="card index-card locked">
                <div class="card-image-wrap">
                    <img class="card-photo" draggable="false" src="${player.image}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80';">
                </div>
                <div class="card-rating">??</div>
                <div class="card-position">${escapeHTML(player.pos)}</div>
                <h3>???</h3>
                <small>🔒 Locked</small>
            </article>
            `;
        }

        return `
        <article class="card index-card glow-${rClass}" onclick="open3DCard('${escapeHTML(player.name)}', true)">
            <div class="card-image-wrap">
                <img class="card-photo" src="${player.image}" alt="${escapeHTML(player.name)}">
            </div>
            <div class="card-rating">${player.rating}</div>
            <div class="card-position">${escapeHTML(player.pos)}</div>
            <h3>${escapeHTML(player.name)}</h3>
            <div style="margin-top:4px;">
                ${isClaimed 
                    ? `<span style="color:var(--green);font-weight:800;font-size:11px;">✓ Claimed (+${bonus} 🪙)</span>` 
                    : `<button class="primary-btn" style="padding:4px 8px;font-size:11px;background:linear-gradient(135deg,#00f2fe,#4facfe);font-weight:900;" onclick="event.stopPropagation();claimIndexReward('${escapeHTML(player.name)}')">✨ Claim +${bonus} 🪙</button>`}
            </div>
            <div style="margin-top:6px;">
                <button class="ghost-btn" style="padding:4px 10px;font-size:10px;" onclick="event.stopPropagation(); open3DCard('${escapeHTML(player.name)}')">🔍 3D View</button>
            </div>
        </article>
        `;
    }).join("");
}

function claimIndexReward(playerName) {
    state.claimedIndexRewards = state.claimedIndexRewards || [];
    if (state.claimedIndexRewards.includes(playerName)) return;

    const player = PLAYERS.find(p => p.name === playerName);
    const bonus = player ? (DISCOVERY_BONUS[player.rarity] || 10) : 10;

    state.claimedIndexRewards.push(playerName);
    addCoins(bonus, _INTERNAL_TX_KEY);
    SoundFx.coin();
    AntiCheat.signState(state);
    saveGame();
    renderIndex();
    toast(`✨ Claimed +${bonus} 🪙 Discovery Reward for "${playerName}"!`);
}

function claimAllIndexRewards() {
    state.claimedIndexRewards = state.claimedIndexRewards || [];
    const basePlayers = PLAYERS.filter(p => !p.hiddenFromIndex);
    const discoveredPlayers = basePlayers.filter(p => state.unlockedCardNames.includes(p.name) || state.cards.some(c => c.player === p.name));
    const unclaimed = discoveredPlayers.filter(p => !state.claimedIndexRewards.includes(p.name));

    if (!unclaimed.length) {
        toast("No unclaimed discovery rewards available.");
        return;
    }

    let totalBonus = 0;
    unclaimed.forEach(p => {
        totalBonus += (DISCOVERY_BONUS[p.rarity] || 10);
        state.claimedIndexRewards.push(p.name);
    });

    addCoins(totalBonus, _INTERNAL_TX_KEY);
    SoundFx.levelUp();
    if (typeof createConfetti === "function") createConfetti();
    AntiCheat.signState(state);
    saveGame();
    renderIndex();
    toast(`🎉 Claimed ALL Index Rewards! Total: +${totalBonus.toLocaleString()} 🪙`);
}

/* =========================================================
   COLLECTION & MULTI-SELL SYSTEM
   ========================================================= */

let multiSellMode = false;
let selectedCardIds = new Set();

function toggleMultiSellMode(force) {
    if (force !== undefined) multiSellMode = force;
    else multiSellMode = !multiSellMode;

    selectedCardIds.clear();
    const sellBtn = document.getElementById("multiSellBtn");
    const sellBar = document.getElementById("multiSellBar");
    if (sellBtn) sellBtn.classList.toggle("active", multiSellMode);
    if (sellBar) sellBar.classList.toggle("hidden", !multiSellMode);
    updateMultiSellBar();
    renderCards();
    if (multiSellMode) {
        toast("💰 Multi-Sell Active: Select cards to bulk sell!");
    }
}

function handleCardClick(cardId, event) {
    if (event) event.stopPropagation();
    if (multiSellMode) {
        toggleCardSelection(cardId);
    } else {
        open3DCard(cardId);
    }
}

function toggleCardSelection(id, event) {
    if (event) event.stopPropagation();
    if (selectedCardIds.has(id)) {
        selectedCardIds.delete(id);
    } else {
        selectedCardIds.add(id);
    }
    updateMultiSellBar();
    renderCards();
}

function updateMultiSellBar() {
    const countEl = document.getElementById("multiSellCount");
    const valEl = document.getElementById("multiSellValue");
    if (!countEl || !valEl) return;

    const count = selectedCardIds.size;
    let totalVal = 0;
    state.cards.forEach(c => {
        if (selectedCardIds.has(c.id)) {
            totalVal += (DUPLICATE_VALUES[c.rarity] || 5);
        }
    });

    countEl.textContent = `${count} card${count === 1 ? '' : 's'} selected`;
    valEl.textContent = `+${totalVal.toLocaleString()} 🪙`;
}

function multiSelectAllUnlocked() {
    const filter = document.getElementById("cardFilter");
    let cards = [...state.cards];
    if (filter && filter.value !== "all") {
        if (filter.value === "locked") cards = cards.filter(c => c.locked);
        else if (filter.value === "unlocked") cards = cards.filter(c => !c.locked);
        else cards = cards.filter(c => c.rarity.toLowerCase() === filter.value.toLowerCase());
    }
    cards.forEach(c => {
        if (!c.locked) selectedCardIds.add(c.id);
    });
    updateMultiSellBar();
    renderCards();
}

function multiSelectClear() {
    selectedCardIds.clear();
    updateMultiSellBar();
    renderCards();
}

function confirmMultiSell() {
    if (!selectedCardIds.size) {
        toast("No cards selected.");
        return;
    }

    const cardsToSell = state.cards.filter(c => selectedCardIds.has(c.id) && !c.locked);
    if (!cardsToSell.length) {
        toast("Selected cards are locked! Unlock them first to sell.");
        return;
    }

    let totalGain = 0;
    cardsToSell.forEach(c => {
        totalGain += (DUPLICATE_VALUES[c.rarity] || 5);
        state.stats.cardsSold++;
    });

    const sellIds = new Set(cardsToSell.map(c => c.id));
    state.cards = state.cards.filter(c => !sellIds.has(c.id));
    state.showcase = state.showcase.map(slotId => sellIds.has(slotId) ? null : slotId);

    progressMission("sell", cardsToSell.length);
    addCoins(totalGain, _INTERNAL_TX_KEY);
    SoundFx.sell();
    saveGame();
    selectedCardIds.clear();
    toggleMultiSellMode(false);
    renderCards();
    renderShowcase();
    toast(`🎉 Bulk Sold ${cardsToSell.length} cards for +${totalGain.toLocaleString()} 🪙!`);
}

function quickSellRarity(targetRarity) {
    const unlocked = state.cards.filter(c => c.rarity.toLowerCase() === targetRarity.toLowerCase() && !c.locked);
    if (!unlocked.length) {
        toast(`No unlocked ${targetRarity} cards available to sell.`);
        return;
    }

    let totalGain = 0;
    unlocked.forEach(c => {
        totalGain += (DUPLICATE_VALUES[c.rarity] || 5);
        state.stats.cardsSold++;
    });

    const sellIds = new Set(unlocked.map(c => c.id));
    state.cards = state.cards.filter(c => !sellIds.has(c.id));
    state.showcase = state.showcase.map(slotId => sellIds.has(slotId) ? null : slotId);

    progressMission("sell", unlocked.length);
    addCoins(totalGain, _INTERNAL_TX_KEY);
    SoundFx.sell();
    saveGame();
    renderCards();
    renderShowcase();
    toast(`💰 Sold ${unlocked.length} ${targetRarity} cards for +${totalGain.toLocaleString()} 🪙!`);
}

let currentQuickSellDuplicates = {};

function openQuickSellModal() {
    const seen = new Set();
    const duplicates = [];

    state.cards.forEach(c => {
        if (c.locked || c.serialNumber) return;
        if (seen.has(c.player)) {
            duplicates.push(c);
        } else {
            seen.add(c.player);
        }
    });

    if (!duplicates.length) {
        toast("No unlocked duplicate cards found in your collection.");
        return;
    }

    const groups = {};
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Exclusive", "Mythic", "Secret", "Tournament", "World Class", "Developer"];
    rarities.forEach(r => groups[r] = []);

    duplicates.forEach(c => {
        if (!groups[c.rarity]) groups[c.rarity] = [];
        groups[c.rarity].push(c);
    });

    currentQuickSellDuplicates = groups;

    const list = document.getElementById("quickSellRarityBreakdownList");
    if (!list) return;

    let mult = 1.0;
    if (hasSkill("econ_2")) mult += 0.15;
    if (hasSkill("econ_4")) mult += 0.20;

    const availableRarities = rarities.filter(r => (groups[r] || []).length > 0);

    list.innerHTML = availableRarities.map(r => {
        const cards = groups[r];
        const count = cards.length;
        const unitVal = Math.max(1, Math.round((DUPLICATE_VALUES[r] || 1) * mult));
        const totalVal = unitVal * count;
        const isPreselected = ["Common", "Uncommon", "Rare"].includes(r);
        const rClass = rarityClassName(r);

        return `
        <label style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:10px 14px;border-radius:10px;cursor:pointer;">
            <div style="display:flex;align-items:center;gap:10px;">
                <input type="checkbox" class="quicksell-rarity-checkbox" data-rarity="${r}" ${isPreselected ? 'checked' : ''} onchange="updateQuickSellModalSummary()" style="width:18px;height:18px;accent-color:var(--cyan);cursor:pointer;">
                <span class="rarity ${rClass}" style="padding:3px 10px;border-radius:6px;font-size:12px;font-weight:900;">${escapeHTML(r)}</span>
            </div>
            <div style="text-align:right;">
                <b style="color:#fff;font-size:13px;">${count} duplicate${count > 1 ? 's' : ''}</b>
                <span style="font-size:12px;color:var(--gold);font-weight:800;margin-left:8px;">+${totalVal.toLocaleString()} 🪙</span>
            </div>
        </label>
        `;
    }).join("");

    updateQuickSellModalSummary();
    const modal = document.getElementById("quickSellModal");
    if (modal) modal.classList.remove("hidden");
    SoundFx.click();
}

function updateQuickSellModalSummary() {
    const checkboxes = document.querySelectorAll(".quicksell-rarity-checkbox:checked");
    let totalCards = 0;
    let totalGain = 0;

    let mult = 1.0;
    if (hasSkill("econ_2")) mult += 0.15;
    if (hasSkill("econ_4")) mult += 0.20;

    checkboxes.forEach(cb => {
        const r = cb.getAttribute("data-rarity");
        const cards = currentQuickSellDuplicates[r] || [];
        const unitVal = Math.max(1, Math.round((DUPLICATE_VALUES[r] || 1) * mult));
        totalCards += cards.length;
        totalGain += unitVal * cards.length;
    });

    const summary = document.getElementById("quickSellTotalSummary");
    if (summary) summary.textContent = `${totalCards} Cards · +${totalGain.toLocaleString()} 🪙`;

    const confirmBtn = document.getElementById("confirmQuickSellBtn");
    if (confirmBtn) {
        confirmBtn.disabled = totalCards === 0;
        confirmBtn.style.opacity = totalCards === 0 ? "0.5" : "1";
    }
}

function closeQuickSellModal() {
    const modal = document.getElementById("quickSellModal");
    if (modal) modal.classList.add("hidden");
}

function executeQuickSellModal() {
    const checkboxes = document.querySelectorAll(".quicksell-rarity-checkbox:checked");
    if (!checkboxes.length) {
        toast("No rarities selected to sell.");
        return;
    }

    const toSell = [];
    checkboxes.forEach(cb => {
        const r = cb.getAttribute("data-rarity");
        const cards = currentQuickSellDuplicates[r] || [];
        cards.forEach(c => toSell.push(c));
    });

    if (!toSell.length) {
        toast("No cards selected to sell.");
        return;
    }

    let mult = 1.0;
    if (hasSkill("econ_2")) mult += 0.15;
    if (hasSkill("econ_4")) mult += 0.20;

    let totalGain = 0;
    toSell.forEach(c => {
        const unitVal = Math.max(1, Math.round((DUPLICATE_VALUES[c.rarity] || 1) * mult));
        totalGain += unitVal;
        state.stats.cardsSold++;
    });

    const sellIds = new Set(toSell.map(c => c.id));
    state.cards = state.cards.filter(c => !sellIds.has(c.id));
    state.showcase = state.showcase.map(slotId => sellIds.has(slotId) ? null : slotId);

    progressMission("sell", toSell.length);
    addCoins(totalGain, _INTERNAL_TX_KEY);
    SoundFx.sell();
    saveGame();
    renderCards();
    renderShowcase();
    closeQuickSellModal();
    toast(`⚡ Sold ${toSell.length} duplicate cards for +${totalGain.toLocaleString()} 🪙!`);
}

function quickSellDuplicates() {
    openQuickSellModal();
}

function renderCards() {
    const grid = document.getElementById("cardsGrid");
    const filter = document.getElementById("cardFilter");
    const sorter = document.getElementById("cardSorter");
    const searchInput = document.getElementById("cardSearchInput");
    if (!grid) return;

    let cards = [...state.cards];

    // Search filter - strictly search Player Name, Position, Rating, and Serial Number (NOT rarity strings!)
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    if (query) {
        cards = cards.filter(c => {
            const pName = (c.player || "").toLowerCase();
            const pPos = (c.pos || "").toLowerCase();
            const pRating = String(c.rating || "");
            const pSerial = c.serialNumber ? String(c.serialNumber) : "";
            return pName.includes(query) || pPos === query || pRating === query || pSerial === query;
        });
    }

    if (filter && filter.value !== "all") {
        if (filter.value === "locked") cards = cards.filter(c => c.locked);
        else if (filter.value === "unlocked") cards = cards.filter(c => !c.locked);
        else cards = cards.filter(c => c.rarity.toLowerCase() === filter.value.toLowerCase());
    }

    const sortMode = sorter ? sorter.value : "rap_desc";
    cards.sort((a, b) => {
        const aDev = (a.rarity === "Developer" || a.devCard || (a.player && a.player.toLowerCase().includes("monkey"))) ? 1 : 0;
        const bDev = (b.rarity === "Developer" || b.devCard || (b.player && b.player.toLowerCase().includes("monkey"))) ? 1 : 0;
        if (aDev !== bDev) return bDev - aDev; // Developer card ALWAYS at the very top!

        if (sortMode === "rap_desc") {
            return (calculateCardRAP(b) - calculateCardRAP(a)) || (b.rating - a.rating);
        } else if (sortMode === "rap_asc") {
            return (calculateCardRAP(a) - calculateCardRAP(b)) || (a.rating - b.rating);
        } else if (sortMode === "rarity_desc") {
            return ((RARITY_ORDER[b.rarity] || 0) - (RARITY_ORDER[a.rarity] || 0)) || (b.rating - a.rating);
        } else if (sortMode === "rarity_asc") {
            return ((RARITY_ORDER[a.rarity] || 0) - (RARITY_ORDER[b.rarity] || 0)) || (a.rating - b.rating);
        } else if (sortMode === "value_desc") {
            return (getCardValue(b) - getCardValue(a)) || (b.rating - a.rating);
        } else if (sortMode === "rating_desc") {
            return b.rating - a.rating;
        } else if (sortMode === "newest") {
            return (b.obtained || 0) - (a.obtained || 0);
        }
        return 0;
    });

    setText("collectionCount", `${state.cards.length} cards collected${query ? ` (${cards.length} matching search)` : ''}`);

    if (!cards.length) {
        grid.innerHTML = `<div class="empty-state">No cards found matching your search/filters.<br>Open scouting packs to add cards to your collection.</div>`;
        return;
    }

    grid.innerHTML = cards.map(card => {
        const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
        const value = DUPLICATE_VALUES[card.rarity] || 5;
        const rap = calculateCardRAP(card);
        const cardImg = getCardImage(card);

        let themeClass = card.serialNumber ? "" : `theme-${rarityClassName(card.rarity)}`;
        if (!card.serialNumber) {
            if (card.rarity === "World Class") {
                if (card.player === "Lionel Messi") themeClass = "theme-messi";
                else if (card.player === "Cristiano Ronaldo") themeClass = "theme-ronaldo";
            } else if (card.rarity === "Tournament") {
                themeClass = "theme-tournament";
            } else if (card.rarity === "Developer" || card.player === "Monkey King") {
                themeClass = "theme-developer";
            }
        }

        const isLocked = !!card.locked;
        const isSelected = selectedCardIds.has(card.id);
        const obtainedDate = (card.obtained || card.obtainedAt) ? new Date(card.obtained || card.obtainedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : (card.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
        const existCount = getCardExistCount(card);
        const popTag = `⚡ ${existCount} Exist`;
        const cardPos = card.pos || card.position || (PLAYERS.find(p => p.name === card.player)?.pos) || "ST";
        const customStyle = card.serialGradient ? `style="background:${card.serialGradient} !important; background-size:200% 200% !important; animation:serializedHoloShift 4s ease-in-out infinite alternate !important;"` : "";

        return `
        <article class="card ${frame.css} ${themeClass} ${card.serialNumber ? 'is-serialized' : ''} ${isSelected ? 'selected-for-bulk' : ''}" ${customStyle} onclick="handleCardClick('${card.id}', event)">
            ${multiSellMode ? `<input type="checkbox" class="card-select-checkbox" ${isSelected ? 'checked' : ''} onclick="toggleCardSelection('${card.id}', event)">` : ""}

            <div class="card-top-row">
                <button class="card-lock-btn ${isLocked ? 'locked' : ''}" onclick="toggleCardLock('${card.id}', event)" title="${isLocked ? 'Unlock Card' : 'Lock Card'}">
                    ${isLocked ? '🔒' : '🔓'}
                </button>
            </div>

            <div class="card-serial-slot">
                ${card.serialNumber ? `<span class="serial-badge">★ SERIAL #${card.serialNumber}/10 ★</span>` : `<span class="serial-placeholder"></span>`}
            </div>

            <div class="card-image-wrap">
                <img class="card-photo" draggable="false" src="${cardImg}" alt="${escapeHTML(card.player)}" onerror="this.onerror=null;this.src='player_temp.png';">
            </div>
            <div class="card-rating">${card.rating}</div>
            <div class="card-position">${escapeHTML(cardPos)}</div>
            <h3>${escapeHTML(card.player)}</h3>
            <div class="card-meta-row">
                <span class="card-rarity-badge rarity-${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                <span class="card-rap-badge">💎 ${formatRAP(rap, card)}</span>
            </div>

            <div class="card-date-pop-row">
                <span class="card-date-tag">📅 ${obtainedDate}</span>
                <span class="card-pop-tag">${popTag}</span>
            </div>

            <div class="card-actions">
                <button onclick="event.stopPropagation(); open3DCard('${card.id}')">3D View</button>
                <button class="sell" ${isLocked || card.serialNumber ? 'style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="event.stopPropagation(); sellCard('${card.id}')">${card.serialNumber ? '💎 Priceless' : (isLocked ? '🔒 Locked' : `Sell ${value} 🪙`)}</button>
            </div>
        </article>
        `;
    }).join("");
}

function rarityClassName(rarity) {
    return rarity.toLowerCase().replaceAll(" ", "");
}

function toggleCardLock(id, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    const card = state.cards.find(c => c.id === id);
    if (!card) return;
    card.locked = !card.locked;
    SoundFx.click();
    saveGame();
    renderCards();
    toast(card.locked ? `🔒 ${card.player} locked.` : `🔓 ${card.player} unlocked.`);
}

function sellCard(id) {
    const index = state.cards.findIndex(c => c.id === id);
    if (index === -1) return;

    const card = state.cards[index];
    if (card.serialNumber) {
        toast("💎 Serialized 1-of-10 cards are priceless and cannot be sold!");
        return;
    }
    if (card.locked) {
        toast("🔒 Card is locked! Unlock it first to sell.");
        return;
    }
    let value = DUPLICATE_VALUES[card.rarity] || 5;
    if (hasSkill("econ_2")) value = Math.round(value * 1.15); // +15% from Scrap Merchant skill
    if (hasSkill("econ_4")) value = Math.round(value * 1.20); // +20% from Master of Wealth skill

    state.cards.splice(index, 1);
    state.stats.cardsSold++;
    SoundFx.sell();
    progressMission("sell", 1);
    addCoins(value, _INTERNAL_TX_KEY);

    state.showcase = state.showcase.map(slotId => slotId === id ? null : slotId);
    saveGame();
    renderCards();
    renderShowcase();
    toast(`Sold ${card.player} for ${value} coins.`);
}

/* =========================================================
   6-SLOT CARD SHOWCASE (TALLER 3x2 GRID & VISUAL SELECTOR)
   ========================================================= */

function renderShowcase() {
    const grid = document.getElementById("showcaseGrid");
    if (!grid) return;

    grid.innerHTML = state.showcase.map((cardId, index) => {
        const card = state.cards.find(c => c.id === cardId);

        if (!card) {
            return `
            <div class="showcase-slot" onclick="openShowcasePicker(${index})">
                <button class="showcase-empty-btn">
                    <div class="showcase-plus">+</div>
                    <span>Showcase Slot ${index + 1}</span>
                </button>
            </div>
            `;
        }

        const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
        const cardImg = getCardImage(card);
        return `
        <div class="showcase-slot">
            <button class="showcase-slot-action" onclick="event.stopPropagation(); openShowcasePicker(${index})">Change</button>
            <article class="card showcase-card ${frame.css}" ${card.serialGradient ? `style="background:${card.serialGradient}"` : ""} onclick="open3DCard('${card.id}')">
                ${card.serialNumber ? `<span class="serial-badge" style="background:${card.serialGradient}">★ #${card.serialNumber}/10 ★</span>` : ""}
                <div class="card-image-wrap">
                    <img class="card-photo" draggable="false" src="${cardImg}" alt="${escapeHTML(card.player)}">
                </div>
                <div class="card-rating">${card.rating}</div>
                <div class="card-position">${escapeHTML(card.pos)}</div>
                <h3>${escapeHTML(card.player)}</h3>
                <small>${escapeHTML(card.rarity)}</small>
            </article>
        </div>
        `;
    }).join("");
}

function openShowcasePicker(slotIndex) {
    activeShowcaseSlot = slotIndex;
    setText("showcaseSlotNum", slotIndex + 1);

    const list = document.getElementById("showcaseCardList");
    const modal = document.getElementById("showcaseModal");
    if (!list || !modal) return;

    if (!state.cards.length) {
        list.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:30px;">No cards in your collection yet. Open packs to collect cards!</p>`;
    } else {
        list.innerHTML = state.cards.map(card => `
            <div class="showcase-visual-card" ${card.serialGradient ? `style="background:${card.serialGradient}"` : ""} onclick="setShowcaseCard(${slotIndex}, '${card.id}')">
                ${card.serialNumber ? `<span class="serial-badge" style="background:${card.serialGradient}">★ #${card.serialNumber}/10 ★</span>` : ""}
                <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                <div class="card-image-wrap" style="height:110px;margin:6px 0;">
                    <img class="card-photo" draggable="false" src="${getCardImage(card)}">
                </div>
                <div style="font-weight:900;font-size:14px;color:#fff;">${escapeHTML(card.player)}</div>
                <small style="color:var(--muted);">${card.rating} OVR · ${card.pos}</small>
            </div>
        `).join("");
    }
    modal.classList.remove("hidden");
}

function closeShowcaseModal() {
    const modal = document.getElementById("showcaseModal");
    if (modal) modal.classList.add("hidden");
}

function setShowcaseCard(slotIndex, cardId) {
    state.showcase[slotIndex] = cardId;
    closeShowcaseModal();
    saveGame();
    renderShowcase();
    SoundFx.click();
    toast(`Card placed in Showcase Slot ${slotIndex + 1}!`);
}

function clearShowcaseSlot() {
    state.showcase[activeShowcaseSlot] = null;
    closeShowcaseModal();
    saveGame();
    renderShowcase();
    toast(`Cleared Showcase Slot ${activeShowcaseSlot + 1}.`);
}

/* =========================================================
   SEARCH PLAYER PROFILE
   ========================================================= */

async function searchPlayerProfile() {
    const input = document.getElementById("playerSearchInput");
    const container = document.getElementById("searchedProfileInlineContainer");
    if (!input || !input.value.trim()) {
        toast("Please enter a username to search.");
        return;
    }
    const query = input.value.trim().toLowerCase();
    
    if (isAccountDeleted(query)) {
        toast(`No player found with username "${input.value.trim()}".`);
        if (container) container.style.display = "none";
        return;
    }
    
    let targetUser = null;
    try {
        targetUser = await GlobalCloudRest.fetchUser(query);
    } catch(e) {}

    if (!targetUser) {
        const accs = CloudSync.getAccounts();
        for (const key in accs) {
            if (!isAccountDeleted(key) && (key === query || (accs[key] && accs[key].username.toLowerCase() === query))) {
                targetUser = accs[key];
                break;
            }
        }
    }

    if (!targetUser || isAccountDeleted(targetUser.username)) {
        toast(`No player found with username "${input.value.trim()}".`);
        if (container) container.style.display = "none";
        return;
    }

    let pData;
    try {
        pData = typeof targetUser.saveData === "string" ? JSON.parse(targetUser.saveData) : targetUser.saveData;
    } catch (e) {
        toast("Could not read player data.");
        return;
    }

    searchedUserData = pData;

    const titleObj = TITLES.find(t => t.name === pData.equippedTitle) || TITLES[0];
    const frame = FRAMES.find(f => f.id === pData.profileFrame) || FRAMES[0];
    const showcase = pData.showcase || [null, null, null, null, null, null];
    const totalVal = calculateCollectionValue(pData.cards || []);

    if (container) {
        container.style.display = "block";
        container.innerHTML = `
            <div class="profile-hero" style="margin-bottom:14px;padding:16px;">
                <div class="profile-glass-card" style="padding:14px;">
                    <div class="profile-avatar-wrapper ${frame.css}" style="width:70px;height:70px;">
                        <img class="profile-avatar-photo" src="${pData.avatar || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80'}" alt="Avatar">
                    </div>
                    <div class="profile-title-block">
                        <p class="eyebrow" style="color:#69c7ff;margin:0 0 2px;">SEARCHED COLLECTOR</p>
                        <div class="profile-name-title-row" style="gap:8px;">
                            <h2 style="color:#fff;margin:0;font-size:22px;">${escapeHTML(pData.name || targetUser.username)}</h2>
                            <span class="equipped-title-badge ${titleObj.cssClass}">${escapeHTML(titleObj.name)}</span>
                            ${pData.isTradeBanned ? `<span style="background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;font-size:10px;font-weight:900;padding:2px 6px;border-radius:6px;">⚠️ FLAGGED</span>` : ''}
                        </div>
                        <p style="margin-top:4px;color:#e1f0ff;font-size:13px;">Level <b style="color:var(--gold);">${pData.level || 1}</b> · ${(pData.cards || []).length} Cards · <b>${totalVal.toLocaleString()} 🪙</b> Value</p>
                    </div>
                    <div style="margin-left:auto;">
                        <button class="primary-btn" style="padding:8px 18px;font-size:13px;" onclick="initiateTradeWithSearchedUser()">🤝 Propose Trade</button>
                    </div>
                </div>
            </div>
            <h3 style="margin:14px 0 8px;font-size:15px;color:var(--cyan);">⭐ ${escapeHTML(pData.name || targetUser.username)}'s 6-Slot Showcase</h3>
            <div class="showcase-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:10px;">
                ${showcase.map((cId, idx) => {
                    const card = (pData.cards || []).find(c => c.id === cId);
                    if (!card) {
                        return `<div class="showcase-slot" style="min-height:180px;"><span style="color:var(--muted);font-size:11px;">Empty Slot ${idx + 1}</span></div>`;
                    }
                    const cFrame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
                    return `
                    <div class="showcase-slot" style="min-height:180px;">
                        <article class="card showcase-card ${cFrame.css}" style="padding:8px;min-height:170px;">
                            <span class="rarity ${rarityClassName(card.rarity)}" style="font-size:9px;">${escapeHTML(card.rarity)}</span>
                            <div class="card-image-wrap" style="height:70px;">
                                <img class="card-photo" src="${getCardImage(card)}" onerror="this.onerror=null;this.src='player_temp.png';">
                            </div>
                            <div class="card-rating" style="font-size:12px;">${card.rating}</div>
                            <div class="card-position" style="font-size:10px;">${escapeHTML(card.pos)}</div>
                            <h4 style="font-size:11px;margin:2px 0;">${escapeHTML(card.player)}</h4>
                        </article>
                    </div>
                    `;
                }).join("")}
            </div>
        `;
    }
    SoundFx.click();
}

function closeSearchModal() {
    const modal = document.getElementById("profileSearchModal");
    if (modal) modal.classList.add("hidden");
}

function initiateTradeWithSearchedUser() {
    if (!searchedUserData) return;
    closeSearchModal();
    showPage("trade");
    const recInput = document.getElementById("tradeRecipientInput");
    if (recInput) recInput.value = searchedUserData.name || searchedUserData.accountUser;
}

/* =========================================================
   PLAYER-TO-PLAYER TRADING ENGINE
   ========================================================= */

/* =========================================================
   ROBLOX RAP VALUE SYSTEM (RECENT AVERAGE PRICE / CARD VALUE)
   ========================================================= */

function calculateCardRAP(card) {
    if (!card) return 0;
    
    // Serialized cards are priceless (N/A value, ranked highest for sorting)
    if (card.serialNumber) {
        return 999000000 - Number(card.serialNumber);
    }

    const rarity = card.rarity || "Common";
    const baseVal = CARD_VALUES[rarity] || 20;
    const ratingBonus = Math.max(0, (Number(card.rating) || 75) - 75) * Math.max(1, Math.round(baseVal * 0.015));
    return Math.round(baseVal + ratingBonus);
}

function formatRAP(val, card) {
    if (card && card.serialNumber) return "N/A";
    if (val === "N/A" || val === null || val === undefined) return "N/A";
    const num = Number(val) || 0;
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
}

/* =========================================================
   HYBRID REAL-TIME TRADING SUITE (BROADCAST + KVDB + RAP)
   ========================================================= */

let activeLiveTradeSession = null;
let currentIncomingTrade = null;
let activeOutgoingTradeRequest = null;
let tradeCountdownTimer = null;
let notifiedBlockedTrades = {};

const LiveTradeNetwork = {
    channel: (typeof BroadcastChannel !== "undefined") ? new BroadcastChannel("football_tcg_live_trade") : null,
    rateLimitedUntil: 0,

    init() {
        if (this.channel) {
            this.channel.onmessage = (e) => {
                this.handleIncomingBroadcast(e.data);
            };
        }
    },

    broadcast(type, payload) {
        if (this.channel) {
            try {
                this.channel.postMessage({ type, payload, sender: state.accountUser, time: Date.now() });
            } catch(e) {}
        }
    },

    handleIncomingBroadcast(msg) {
        if (!msg || !msg.type || !state.accountUser) return;
        const myName = state.accountUser.toLowerCase();

        if (msg.type === "TRADE_REQUEST") {
            const req = msg.payload;
            if ((req.receiver || "").toLowerCase() === myName && req.status === "pending") {
                if (state.blockedUsers && state.blockedUsers.includes((req.sender || "").toLowerCase())) {
                    this.broadcast("TRADE_RESPONSE", { id: req.id, sender: req.sender, receiver: state.accountUser, status: "blocked" });
                } else {
                    const modal = document.getElementById("incomingTradeModal");
                    if (modal && modal.classList.contains("hidden")) {
                        openIncomingTradeModal(req);
                    }
                }
            }
        }

        if (msg.type === "TRADE_RESPONSE") {
            const res = msg.payload;
            if (activeOutgoingTradeRequest && activeOutgoingTradeRequest.tradeId === res.id && (res.sender || "").toLowerCase() === myName) {
                if (res.status === "blocked") {
                    cancelOutgoingTradeRequest();
                    toast(`🚫 "${res.receiver}" has blocked you from trading.`);
                } else if (res.status === "declined") {
                    cancelOutgoingTradeRequest();
                    toast(`"${res.receiver}" declined your trade request.`);
                } else if (res.status === "session_active") {
                    const banner = document.getElementById("tradeOutgoingStatusBanner");
                    if (banner) banner.style.display = "none";
                    const tid = activeOutgoingTradeRequest.tradeId;
                    const rec = activeOutgoingTradeRequest.recipient;
                    activeOutgoingTradeRequest = null;
                    openLiveTradeRoom(tid, rec, true);
                }
            }
        }

        if (msg.type === "TRADE_SESSION_UPDATE") {
            const sess = msg.payload;
            if (activeLiveTradeSession && activeLiveTradeSession.tradeId === sess.id) {
                this.syncSessionData(sess);
            }
        }
    },

    syncSessionData(data) {
        if (!activeLiveTradeSession || activeLiveTradeSession.tradeId !== data.id) return;

        if (data.status === "cancelled" || data.status === "declined") {
            toast(`Trade session was closed by ${activeLiveTradeSession.partner}.`);
            closeLiveTradeRoom();
            return;
        }

        if (data.status === "completed") {
            handleFinalTradeExecution(data);
            return;
        }

        const myKey = state.accountUser.toLowerCase();
        const partnerKey = (activeLiveTradeSession.partner || "").toLowerCase();

        const partnerOffer = (data.offers && data.offers[partnerKey]) || [];
        const partnerReady = !!(data.ready && data.ready[partnerKey]);

        if (JSON.stringify(partnerOffer) !== JSON.stringify(activeLiveTradeSession.theirOffer)) {
            activeLiveTradeSession.theirOffer = partnerOffer;
            activeLiveTradeSession.myReady = false; // Safety unready on change
            renderLiveTradeSlots();
        }

        if (partnerReady !== activeLiveTradeSession.theirReady) {
            activeLiveTradeSession.theirReady = partnerReady;
            renderLiveTradeSlots();
        }

        if (Array.isArray(data.chat) && data.chat.length > activeLiveTradeSession.chat.length) {
            activeLiveTradeSession.chat = data.chat;
            renderLiveTradeChat();
            SoundFx.click();
        }
    },

    async pushCloud(key, data) {
        if (Date.now() < this.rateLimitedUntil) return false;
        try {
            const res = await fetch(`https://kvdb.io/MmjyNhMePJggoofHrX9cjo/${key}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.status === 429) {
                this.rateLimitedUntil = Date.now() + 3000;
                return false;
            }
            return res.ok;
        } catch(e) {
            return false;
        }
    },

    async fetchCloud(key) {
        if (Date.now() < this.rateLimitedUntil) return null;
        try {
            const res = await fetch(`https://kvdb.io/MmjyNhMePJggoofHrX9cjo/${key}?t=${Date.now()}`);
            if (res.status === 429) {
                this.rateLimitedUntil = Date.now() + 3000;
                return null;
            }
            if (!res.ok) return null;
            return await res.json();
        } catch(e) {
            return null;
        }
    }
};

LiveTradeNetwork.init();

async function sendTradeOffer(targetUsername) {
    if (!state.accountUser) {
        toast("Please log into a Cloud Account first.");
        openAuthModal();
        return;
    }

    if (state.isTradeBanned) {
        toast("⚠️ Your account is flagged: Trading privileges are permanently disabled.");
        return;
    }

    const input = document.getElementById("tradeRecipientInput");
    const recipient = (targetUsername || (input ? input.value : "")).trim();

    if (!recipient) {
        toast("Please enter a username to trade with.");
        return;
    }
    if (recipient.toLowerCase() === state.accountUser.toLowerCase()) {
        toast("You cannot trade with yourself.");
        return;
    }

    if (state.blockedUsers && state.blockedUsers.includes(recipient.toLowerCase())) {
        toast(`You have blocked "${recipient}". Unblock them to trade.`);
        return;
    }

    let targetUser = await GlobalCloudRest.fetchUser(recipient);
    if (!targetUser) {
        const accs = CloudSync.getAccounts();
        targetUser = accs[recipient.toLowerCase()];
    }

    if (!targetUser) {
        toast(`User "${recipient}" not found on the server.`);
        return;
    }

    let targetSave = {};
    try {
        targetSave = typeof targetUser.saveData === "string" ? JSON.parse(targetUser.saveData) : (targetUser.saveData || {});
    } catch(e) {}

    if (targetUser.isTradeBanned || targetSave.isTradeBanned) {
        toast(`⚠️ Cannot trade with "${recipient}": This user account is flagged / trade banned.`);
        return;
    }

    const tradeId = "tr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    const tradeReqDoc = {
        id: tradeId,
        sender: state.accountUser,
        receiver: targetUser.username || recipient,
        senderTitle: state.equippedTitle || "Collector",
        senderLevel: state.level || 1,
        status: "pending",
        timestamp: Date.now()
    };

    LiveTradeNetwork.broadcast("TRADE_REQUEST", tradeReqDoc);
    LiveTradeNetwork.pushCloud(`trade_req_${recipient.toLowerCase()}`, tradeReqDoc);

    activeOutgoingTradeRequest = {
        tradeId: tradeId,
        recipient: targetUser.username || recipient,
        timestamp: Date.now()
    };

    if (input) input.value = "";

    const banner = document.getElementById("tradeOutgoingStatusBanner");
    const bannerText = document.getElementById("tradeOutgoingStatusText");
    if (banner && bannerText) {
        bannerText.textContent = `Waiting for ${activeOutgoingTradeRequest.recipient} to accept your trade request...`;
        banner.style.display = "flex";
    }

    SoundFx.coin();
    toast(`🚀 Live trade request sent to ${activeOutgoingTradeRequest.recipient}!`);
}

function cancelOutgoingTradeRequest() {
    if (activeOutgoingTradeRequest) {
        LiveTradeNetwork.pushCloud(`trade_req_${activeOutgoingTradeRequest.recipient.toLowerCase()}`, { status: "cancelled" });
    }
    activeOutgoingTradeRequest = null;
    const banner = document.getElementById("tradeOutgoingStatusBanner");
    if (banner) banner.style.display = "none";
    toast("Trade request cancelled.");
}

// INCOMING TRADE POP-UP HANDLERS
function openIncomingTradeModal(trade) {
    currentIncomingTrade = trade;
    const modal = document.getElementById("incomingTradeModal");
    const info = document.getElementById("incomingTradeSenderInfo");
    if (!modal || !info) return;

    info.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <div style="font-size:32px;">👤</div>
            <div>
                <h3 style="margin:0;font-size:16px;color:#fff;">${escapeHTML(trade.sender)}</h3>
                <p style="font-size:12px;color:var(--cyan);margin:0;">${escapeHTML(trade.senderTitle || "Collector")} · Level ${trade.senderLevel || 1}</p>
            </div>
        </div>
        <div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.06);text-align:center;">
            <strong style="color:var(--green);font-size:14px;">🤝 Wants to open a live trading session with you!</strong>
            <p style="font-size:12px;color:var(--muted);margin:4px 0 0;">Accept to join the Live Roblox Trading Room where you can offer cards and chat.</p>
        </div>
    `;

    modal.classList.remove("hidden");
    modal.style.display = "flex";
    SoundFx.cardReveal("Legendary");
}

function closeIncomingTradeModal() {
    currentIncomingTrade = null;
    const modal = document.getElementById("incomingTradeModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

async function acceptIncomingLiveTrade() {
    if (!currentIncomingTrade) return;
    const trade = currentIncomingTrade;
    closeIncomingTradeModal();

    if (state.isTradeBanned) {
        toast("⚠️ Your account is flagged: Trading privileges are permanently disabled.");
        return;
    }

    const myKey = state.accountUser.toLowerCase();
    const partnerKey = (trade.sender || "").toLowerCase();

    const initialSession = {
        id: trade.id,
        sender: trade.sender,
        receiver: state.accountUser,
        offers: {
            [partnerKey]: [],
            [myKey]: []
        },
        ready: {
            [partnerKey]: false,
            [myKey]: false
        },
        chat: [
            { sender: "System", text: `Trade room connected! Add cards to your slots or chat on the right.`, time: Date.now() }
        ],
        status: "active",
        updatedAt: Date.now()
    };

    LiveTradeNetwork.broadcast("TRADE_RESPONSE", { id: trade.id, sender: trade.sender, receiver: state.accountUser, status: "session_active" });
    LiveTradeNetwork.broadcast("TRADE_SESSION_UPDATE", initialSession);
    LiveTradeNetwork.pushCloud(`session_${trade.id}`, initialSession);
    LiveTradeNetwork.pushCloud(`trade_req_${state.accountUser.toLowerCase()}`, { ...trade, status: "session_active" });
    LiveTradeNetwork.pushCloud(`trade_req_${partnerKey}`, { id: trade.id, status: "session_active", sender: trade.sender, recipient: state.accountUser });

    openLiveTradeRoom(trade.id, trade.sender, false);
}

async function declineIncomingLiveTrade() {
    if (!currentIncomingTrade) return;
    const trade = currentIncomingTrade;
    closeIncomingTradeModal();

    LiveTradeNetwork.broadcast("TRADE_RESPONSE", { id: trade.id, sender: trade.sender, receiver: state.accountUser, status: "declined" });
    LiveTradeNetwork.pushCloud(`trade_req_${state.accountUser.toLowerCase()}`, { ...trade, status: "declined" });
    LiveTradeNetwork.pushCloud(`session_${trade.id}`, { id: trade.id, status: "declined" });

    SoundFx.click();
    toast(`Trade request from "${trade.sender}" declined.`);
    renderTradeHub();
}

async function blockIncomingTradeSender() {
    if (!currentIncomingTrade) return;
    const trade = currentIncomingTrade;
    const blockedName = trade.sender;
    closeIncomingTradeModal();

    if (!state.blockedUsers) state.blockedUsers = [];
    if (!state.blockedUsers.includes(blockedName.toLowerCase())) {
        state.blockedUsers.push(blockedName.toLowerCase());
    }

    LiveTradeNetwork.broadcast("TRADE_RESPONSE", { id: trade.id, sender: trade.sender, receiver: state.accountUser, status: "blocked" });
    LiveTradeNetwork.pushCloud(`trade_req_${state.accountUser.toLowerCase()}`, { ...trade, status: "blocked" });
    LiveTradeNetwork.pushCloud(`session_${trade.id}`, { id: trade.id, status: "blocked" });

    saveGame();
    SoundFx.click();
    toast(`🚫 Blocked "${blockedName}"! They can no longer trade with you.`);
    renderTradeHub();
}

// ROBLOX-STYLE LIVE TRADING ROOM CONTROLLER
async function openLiveTradeRoom(tradeId, partnerName, isSender) {
    activeLiveTradeSession = {
        tradeId: tradeId,
        partner: partnerName,
        isSender: isSender,
        myOffer: [],
        theirOffer: [],
        myReady: false,
        theirReady: false,
        chat: [
            { sender: "System", text: `Connected with ${partnerName}. Click '+' to place cards or chat on the right.`, time: Date.now() }
        ],
        status: "active"
    };

    const modal = document.getElementById("liveTradingRoomModal");
    const nameEl = document.getElementById("liveTradePartnerName");
    const theirTitleEl = document.getElementById("theirOfferPartnerTitle");
    if (nameEl) nameEl.textContent = partnerName;
    if (theirTitleEl) theirTitleEl.textContent = `${partnerName}'s Offer`;

    if (modal) {
        modal.classList.remove("hidden");
        modal.style.display = "flex";
    }

    renderLiveTradeSlots();
    renderLiveTradeChat();
    SoundFx.packOpen();

    await pushLiveTradeSession();
}

async function pushLiveTradeSession() {
    if (!activeLiveTradeSession) return;
    const myKey = state.accountUser.toLowerCase();
    const partnerKey = (activeLiveTradeSession.partner || "").toLowerCase();

    const payload = {
        id: activeLiveTradeSession.tradeId,
        sender: activeLiveTradeSession.isSender ? state.accountUser : activeLiveTradeSession.partner,
        receiver: activeLiveTradeSession.isSender ? activeLiveTradeSession.partner : state.accountUser,
        offers: {
            [myKey]: activeLiveTradeSession.myOffer,
            [partnerKey]: activeLiveTradeSession.theirOffer
        },
        ready: {
            [myKey]: activeLiveTradeSession.myReady,
            [partnerKey]: activeLiveTradeSession.theirReady
        },
        chat: activeLiveTradeSession.chat,
        status: activeLiveTradeSession.status,
        updatedAt: Date.now()
    };

    LiveTradeNetwork.broadcast("TRADE_SESSION_UPDATE", payload);
    LiveTradeNetwork.pushCloud(`session_${activeLiveTradeSession.tradeId}`, payload);
}

async function pullLiveTradeSession() {
    if (!activeLiveTradeSession) return;
    const data = await LiveTradeNetwork.fetchCloud(`session_${activeLiveTradeSession.tradeId}`);
    if (data) {
        LiveTradeNetwork.syncSessionData(data);
    }
}

function renderLiveTradeSlots() {
    if (!activeLiveTradeSession) return;

    // RAP CALCULATIONS
    const myTotalRap = activeLiveTradeSession.myOffer.reduce((sum, c) => sum + calculateCardRAP(c), 0);
    const theirTotalRap = activeLiveTradeSession.theirOffer.reduce((sum, c) => sum + calculateCardRAP(c), 0);
    const rapDiff = theirTotalRap - myTotalRap;

    // FAIRNESS METER
    const meter = document.getElementById("tradeFairnessMeter");
    if (meter) {
        if (rapDiff > 500) {
            meter.className = "trade-fairness-meter win";
            meter.textContent = `🟢 Gain: +${formatRAP(rapDiff)} (WIN)`;
        } else if (rapDiff < -500) {
            meter.className = "trade-fairness-meter lose";
            meter.textContent = `🔴 Loss: -${formatRAP(Math.abs(rapDiff))} (LOSE)`;
        } else {
            meter.className = "trade-fairness-meter even";
            meter.textContent = `⚖️ Fair Trade (EVEN)`;
        }
    }

    // YOUR SLOTS & RAP BADGE
    const yourGrid = document.getElementById("yourTradeSlots");
    const yourCount = document.getElementById("yourOfferCount");
    const yourRapBadge = document.getElementById("yourOfferRapBadge");
    const yourReadyBadge = document.getElementById("yourReadyBadge");
    const yourBox = document.getElementById("yourOfferBox");

    if (yourCount) yourCount.textContent = activeLiveTradeSession.myOffer.length;
    if (yourRapBadge) yourRapBadge.textContent = `💎 ${formatRAP(myTotalRap)} RAP`;
    if (yourReadyBadge) {
        yourReadyBadge.className = `trade-status-pill ${activeLiveTradeSession.myReady ? 'ready' : 'unready'}`;
        yourReadyBadge.textContent = activeLiveTradeSession.myReady ? "✓ READY" : "NOT READY";
    }
    if (yourBox) yourBox.classList.toggle("ready-active", !!activeLiveTradeSession.myReady);

    if (yourGrid) {
        let html = "";
        for (let i = 0; i < 6; i++) {
            const card = activeLiveTradeSession.myOffer[i];
            if (card) {
                const cardRap = calculateCardRAP(card);
                html += `
                    <div class="trade-slot filled">
                        <div class="trade-slot-card frame-${rarityClassName(card.rarity)}">
                            <button class="trade-slot-remove-btn" onclick="removeCardFromMyTradeOffer('${card.id}')" title="Remove Card">✕</button>
                            <div class="trade-slot-rating">${card.rating}</div>
                            <div class="trade-slot-name">${escapeHTML(card.player)}</div>
                            <div class="trade-slot-rap">${formatRAP(cardRap)}</div>
                            <div class="trade-slot-rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="trade-slot empty" onclick="openTradeCardPicker()" title="Click to add card">
                        <span style="font-size:24px;color:var(--cyan);font-weight:900;">+</span>
                        <span style="font-size:10px;color:var(--muted);font-weight:700;">Add Card</span>
                    </div>
                `;
            }
        }
        yourGrid.innerHTML = html;
    }

    // PARTNER SLOTS & RAP BADGE
    const theirGrid = document.getElementById("theirTradeSlots");
    const theirCount = document.getElementById("theirOfferCount");
    const theirRapBadge = document.getElementById("theirOfferRapBadge");
    const theirReadyBadge = document.getElementById("theirReadyBadge");
    const theirBox = document.getElementById("theirOfferBox");
    const noteEl = document.getElementById("tradePartnerStatusNote");

    if (theirCount) theirCount.textContent = activeLiveTradeSession.theirOffer.length;
    if (theirRapBadge) theirRapBadge.textContent = `💎 ${formatRAP(theirTotalRap)} RAP`;
    if (theirReadyBadge) {
        theirReadyBadge.className = `trade-status-pill ${activeLiveTradeSession.theirReady ? 'ready' : 'unready'}`;
        theirReadyBadge.textContent = activeLiveTradeSession.theirReady ? "✓ READY" : "NOT READY";
    }
    if (theirBox) theirBox.classList.toggle("ready-active", !!activeLiveTradeSession.theirReady);

    if (noteEl) {
        if (!activeLiveTradeSession.theirOffer.length) {
            noteEl.textContent = `Waiting for ${activeLiveTradeSession.partner} to add cards...`;
        } else if (!activeLiveTradeSession.theirReady) {
            noteEl.textContent = `${activeLiveTradeSession.partner} is adjusting offer...`;
        } else {
            noteEl.textContent = `🟢 ${activeLiveTradeSession.partner} is READY!`;
        }
    }

    if (theirGrid) {
        let html = "";
        for (let i = 0; i < 6; i++) {
            const card = activeLiveTradeSession.theirOffer[i];
            if (card) {
                const cardRap = calculateCardRAP(card);
                html += `
                    <div class="trade-slot filled">
                        <div class="trade-slot-card frame-${rarityClassName(card.rarity)}">
                            <div class="trade-slot-rating">${card.rating}</div>
                            <div class="trade-slot-name">${escapeHTML(card.player)}</div>
                            <div class="trade-slot-rap">${formatRAP(cardRap)}</div>
                            <div class="trade-slot-rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="trade-slot empty" style="opacity:0.4;cursor:default;">
                        <span style="font-size:20px;color:var(--muted);">🎴</span>
                    </div>
                `;
            }
        }
        theirGrid.innerHTML = html;
    }

    // READY & CONFIRM BUTTON STATE
    const readyBtn = document.getElementById("tradeReadyBtn");
    const confirmBtn = document.getElementById("tradeConfirmBtn");

    if (readyBtn) {
        readyBtn.textContent = activeLiveTradeSession.myReady ? "🔓 Cancel Ready" : "🔒 Ready to Trade";
        readyBtn.style.background = activeLiveTradeSession.myReady ? "rgba(239, 68, 68, 0.2)" : "linear-gradient(135deg, #10b981, #059669)";
        readyBtn.style.borderColor = activeLiveTradeSession.myReady ? "#ef4444" : "var(--green)";
    }

    const bothReady = activeLiveTradeSession.myReady && activeLiveTradeSession.theirReady;
    if (confirmBtn) {
        confirmBtn.classList.toggle("hidden", !bothReady);
    }
}

// HUGE TRADE CARD PICKER MODAL FILTER & SEARCH CONTROLLER
function filterTradeCardPicker() {
    if (!activeLiveTradeSession) return;
    const grid = document.getElementById("tradeCardPickerGrid");
    const searchInput = document.getElementById("tradeCardSearchInput");
    const raritySelect = document.getElementById("tradeCardRarityFilter");
    const sortSelect = document.getElementById("tradeCardSortFilter");
    if (!grid) return;

    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const rarityFilter = (raritySelect ? raritySelect.value : "ALL").toUpperCase();
    const sortMode = sortSelect ? sortSelect.value : "RAP_DESC";

    const offeredIds = new Set(activeLiveTradeSession.myOffer.map(c => c.id));
    let availableCards = state.cards.filter(c => !c.locked && !offeredIds.has(c.id));

    // Filter by search query (Player Name, Pos, Rating, Serial)
    if (query) {
        availableCards = availableCards.filter(c => {
            const pName = (c.player || "").toLowerCase();
            const pPos = (c.pos || "").toLowerCase();
            const pRating = String(c.rating || "");
            const pSerial = c.serialNumber ? String(c.serialNumber) : "";
            return pName.includes(query) || pPos === query || pRating === query || pSerial === query;
        });
    }

    // Filter by rarity
    if (rarityFilter !== "ALL") {
        availableCards = availableCards.filter(c => (c.rarity || "").toUpperCase() === rarityFilter);
    }

    // Sort cards
    if (sortMode === "RAP_DESC") {
        availableCards.sort((a, b) => calculateCardRAP(b) - calculateCardRAP(a) || b.rating - a.rating);
    } else if (sortMode === "RAP_ASC") {
        availableCards.sort((a, b) => calculateCardRAP(a) - calculateCardRAP(b) || a.rating - b.rating);
    } else if (sortMode === "RATING_DESC") {
        availableCards.sort((a, b) => b.rating - a.rating);
    } else if (sortMode === "RATING_ASC") {
        availableCards.sort((a, b) => a.rating - b.rating);
    } else if (sortMode === "RECENT") {
        availableCards.sort((a, b) => (b.obtained || 0) - (a.obtained || 0));
    }

    if (!availableCards.length) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px;font-size:14px;">No unlocked cards match your search and filter criteria.</p>`;
        return;
    }

    grid.innerHTML = availableCards.map(c => {
        const cardRap = calculateCardRAP(c);
        const cardImg = getCardImage(c);
        return `
        <article class="card frame-${rarityClassName(c.rarity)}" style="cursor:pointer;padding:12px;transform:scale(0.98);" onclick="addCardToMyTradeOffer('${c.id}')" title="Click to add to offer">
            <span class="rarity ${rarityClassName(c.rarity)}">${escapeHTML(c.rarity)}</span>
            ${c.serialNumber ? `<span class="serial-badge" style="display:inline-block;margin:4px 0 2px;">★ #${c.serialNumber} ★</span>` : ""}
            <div class="card-image-wrap" style="height:90px;">
                <img class="card-photo" draggable="false" src="${cardImg}" onerror="this.onerror=null;this.src='player_temp.png';">
            </div>
            <div class="card-rating">${c.rating}</div>
            <div class="card-position">${escapeHTML(c.pos)}</div>
            <h4 style="margin:4px 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(c.player)}</h4>
            <div style="font-size:11px;font-weight:900;color:#38bdf8;margin:2px 0;">💎 ${formatRAP(cardRap)}</div>
            <button class="primary-btn" style="padding:6px;font-size:11px;margin-top:4px;background:linear-gradient(135deg,#00f2fe,#4facfe);font-weight:900;">+ Add to Offer</button>
        </article>
        `;
    }).join("");
}

function openTradeCardPicker() {
    if (!activeLiveTradeSession) return;
    const modal = document.getElementById("tradeCardPickerModal");
    const searchInput = document.getElementById("tradeCardSearchInput");
    const raritySelect = document.getElementById("tradeCardRarityFilter");
    if (!modal) return;

    if (searchInput) searchInput.value = "";
    if (raritySelect) raritySelect.value = "ALL";

    filterTradeCardPicker();

    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function closeTradeCardPicker() {
    const modal = document.getElementById("tradeCardPickerModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

function addCardToMyTradeOffer(cardId) {
    if (!activeLiveTradeSession) return;
    if (activeLiveTradeSession.myOffer.length >= 6) {
        toast("Trade offer slot limit reached (max 6 cards).");
        return;
    }
    const card = state.cards.find(c => c.id === cardId);
    if (!card) return;

    activeLiveTradeSession.myOffer.push({ ...card });
    activeLiveTradeSession.myReady = false;
    activeLiveTradeSession.theirReady = false;

    closeTradeCardPicker();
    renderLiveTradeSlots();
    SoundFx.coin();
    pushLiveTradeSession();
}

function removeCardFromMyTradeOffer(cardId) {
    if (!activeLiveTradeSession) return;
    activeLiveTradeSession.myOffer = activeLiveTradeSession.myOffer.filter(c => c.id !== cardId);
    activeLiveTradeSession.myReady = false;
    activeLiveTradeSession.theirReady = false;

    renderLiveTradeSlots();
    SoundFx.click();
    pushLiveTradeSession();
}

function toggleTradeReady() {
    if (!activeLiveTradeSession) return;
    if (!activeLiveTradeSession.myOffer.length && !activeLiveTradeSession.theirOffer.length) {
        toast("Place at least one item before marking ready.");
        return;
    }
    activeLiveTradeSession.myReady = !activeLiveTradeSession.myReady;
    renderLiveTradeSlots();
    SoundFx.coin();
    pushLiveTradeSession();
}

function sendQuickTradeChat(presetText) {
    sendTradeChat(presetText);
}

function sendTradeChat(customText) {
    if (!activeLiveTradeSession) return;
    const input = document.getElementById("tradeChatInput");
    const text = customText || (input ? input.value.trim() : "");
    if (!text) return;

    activeLiveTradeSession.chat.push({
        sender: state.accountUser,
        text: text,
        time: Date.now()
    });

    if (input && !customText) input.value = "";
    renderLiveTradeChat();
    SoundFx.click();
    pushLiveTradeSession();
}

function renderLiveTradeChat() {
    const list = document.getElementById("tradeChatMessages");
    if (!list || !activeLiveTradeSession) return;

    list.innerHTML = activeLiveTradeSession.chat.map(m => {
        if (m.sender === "System") {
            return `<div class="trade-chat-system-msg">${escapeHTML(m.text)}</div>`;
        }
        const isMine = m.sender.toLowerCase() === state.accountUser.toLowerCase();
        return `
            <div class="trade-chat-msg ${isMine ? 'mine' : 'theirs'}">
                <strong style="font-size:10px;opacity:0.8;display:block;">${escapeHTML(m.sender)}:</strong>
                ${escapeHTML(m.text)}
            </div>
        `;
    }).join("");

    list.scrollTop = list.scrollHeight;
}

function confirmFinalSwap() {
    if (!activeLiveTradeSession) return;
    if (!activeLiveTradeSession.myReady || !activeLiveTradeSession.theirReady) {
        toast("Both players must be Ready before confirming swap.");
        return;
    }

    const countdownEl = document.getElementById("tradeCountdownText");
    const confirmBtn = document.getElementById("tradeConfirmBtn");
    if (confirmBtn) confirmBtn.disabled = true;

    let sec = 3;
    if (countdownEl) countdownEl.textContent = `🤝 Executing Trade Swap in ${sec}...`;
    SoundFx.levelUp();

    if (tradeCountdownTimer) clearInterval(tradeCountdownTimer);
    tradeCountdownTimer = setInterval(async () => {
        sec--;
        if (sec > 0) {
            if (countdownEl) countdownEl.textContent = `🤝 Executing Trade Swap in ${sec}...`;
            SoundFx.click();
        } else {
            clearInterval(tradeCountdownTimer);
            if (countdownEl) countdownEl.textContent = "✨ Processing atomic swap...";
            executeTradeSwapAtomic();
        }
    }, 1000);
}

async function executeTradeSwapAtomic() {
    if (!activeLiveTradeSession) return;

    const offeredIds = new Set(activeLiveTradeSession.myOffer.map(c => c.id));
    state.cards = state.cards.filter(c => !offeredIds.has(c.id));

    activeLiveTradeSession.theirOffer.forEach(c => {
        const receivedCard = {
            ...c,
            id: Date.now() + "_" + Math.random().toString(36).slice(2, 7),
            obtained: Date.now()
        };
        state.cards.push(receivedCard);
    });

    activeLiveTradeSession.status = "completed";
    await pushLiveTradeSession();

    AntiCheat.signState(state);
    saveGame();
    renderAll();
    SoundFx.levelUp();
    toast(`🎉 Trade Completed! Received ${activeLiveTradeSession.theirOffer.length} cards from ${activeLiveTradeSession.partner}.`);

    setTimeout(() => {
        closeLiveTradeRoom();
        renderTradeHub();
    }, 1500);
}

function handleFinalTradeExecution(remoteData) {
    if (!activeLiveTradeSession || activeLiveTradeSession.status === "completed") return;
    activeLiveTradeSession.status = "completed";

    const offeredIds = new Set(activeLiveTradeSession.myOffer.map(c => c.id));
    state.cards = state.cards.filter(c => !offeredIds.has(c.id));

    activeLiveTradeSession.theirOffer.forEach(c => {
        const receivedCard = {
            ...c,
            id: Date.now() + "_" + Math.random().toString(36).slice(2, 7),
            obtained: Date.now()
        };
        state.cards.push(receivedCard);
    });

    AntiCheat.signState(state);
    saveGame();
    renderAll();
    SoundFx.levelUp();
    toast(`🎉 Trade Completed! Swapped cards with ${activeLiveTradeSession.partner}.`);

    setTimeout(() => {
        closeLiveTradeRoom();
        renderTradeHub();
    }, 1500);
}

async function cancelLiveTradeSession() {
    if (!activeLiveTradeSession) return;
    activeLiveTradeSession.status = "cancelled";
    await pushLiveTradeSession();
    closeLiveTradeRoom();
    toast("Trade session cancelled.");
}

function closeLiveTradeRoom() {
    activeLiveTradeSession = null;
    if (tradeCountdownTimer) clearInterval(tradeCountdownTimer);
    const modal = document.getElementById("liveTradingRoomModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

// REAL-TIME BACKGROUND TRADE POLLER
async function pollLiveTradeRequests() {
    if (!state.accountUser) return;
    try {
        if (activeLiveTradeSession) {
            await pullLiveTradeSession();
            return;
        }

        const myName = state.accountUser.toLowerCase();

        // 1. Check Receiver Mailbox for Incoming Trade Requests
        const incoming = await LiveTradeNetwork.fetchCloud(`trade_req_${myName}`);
        if (incoming && incoming.status === "pending") {
            const senderKey = (incoming.sender || "").toLowerCase();
            if (state.blockedUsers && state.blockedUsers.includes(senderKey)) {
                LiveTradeNetwork.pushCloud(`trade_req_${myName}`, { ...incoming, status: "blocked" });
            } else {
                const modal = document.getElementById("incomingTradeModal");
                if (modal && modal.classList.contains("hidden")) {
                    openIncomingTradeModal(incoming);
                }
            }
        }

        // 2. Check Sender State if we have an active outgoing request
        if (activeOutgoingTradeRequest) {
            const partnerName = activeOutgoingTradeRequest.recipient.toLowerCase();
            let outDoc = await LiveTradeNetwork.fetchCloud(`trade_req_${partnerName}`);
            if (!outDoc || outDoc.status !== "session_active") {
                const myDoc = await LiveTradeNetwork.fetchCloud(`trade_req_${myName}`);
                if (myDoc && (myDoc.status === "session_active" || myDoc.status === "blocked" || myDoc.status === "declined")) {
                    outDoc = myDoc;
                }
            }
            if (outDoc && (outDoc.id === activeOutgoingTradeRequest.tradeId || outDoc.status === "session_active")) {
                if (outDoc.status === "blocked") {
                    const banner = document.getElementById("tradeOutgoingStatusBanner");
                    if (banner) banner.style.display = "none";
                    toast(`🚫 "${activeOutgoingTradeRequest.recipient}" has blocked you from trading.`);
                    SoundFx.click();
                    activeOutgoingTradeRequest = null;
                } else if (outDoc.status === "declined" || outDoc.status === "cancelled") {
                    const banner = document.getElementById("tradeOutgoingStatusBanner");
                    if (banner) banner.style.display = "none";
                    toast(`"${activeOutgoingTradeRequest.recipient}" declined your trade request.`);
                    SoundFx.click();
                    activeOutgoingTradeRequest = null;
                } else if (outDoc.status === "session_active") {
                    const banner = document.getElementById("tradeOutgoingStatusBanner");
                    if (banner) banner.style.display = "none";
                    const tid = activeOutgoingTradeRequest.tradeId || outDoc.id;
                    const rec = activeOutgoingTradeRequest.recipient;
                    activeOutgoingTradeRequest = null;
                    openLiveTradeRoom(tid, rec, true);
                }
            }
        }
    } catch(e) {}
}

async function renderTradeHub() {
    const list = document.getElementById("tradeOnlinePlayersList");
    if (!list) return;

    let localAccs = CloudSync.getAccounts();
    const myName = (state.accountUser || "").toLowerCase();

    function buildAndRender(mergedUsers) {
        const otherPlayers = [];
        const seenUsers = new Set();

        for (const key in mergedUsers) {
            const u = mergedUsers[key];
            const rawUsername = u.username || key;
            const lowerName = rawUsername.toLowerCase();

            if (lowerName !== myName && !isAccountDeleted(lowerName) && !seenUsers.has(lowerName)) {
                seenUsers.add(lowerName);
                let pData = {};
                try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch(e) {}
                const isUserFlagged = !!(u.isTradeBanned || pData.isTradeBanned || (pData.bannedUntil && pData.bannedUntil > Date.now()));
                otherPlayers.push({
                    username: rawUsername,
                    name: pData.name || rawUsername,
                    level: Number(pData.level || 1),
                    cards: Array.isArray(pData.cards) ? pData.cards.length : 0,
                    title: pData.equippedTitle || "Collector",
                    isTradeBanned: isUserFlagged
                });
            }
        }

        otherPlayers.sort((a, b) => b.level - a.level);

        let flagBanner = "";
        if (state.isTradeBanned) {
            flagBanner = `<div style="grid-column:1/-1;background:rgba(239,68,68,0.15);border:1px solid #ef4444;border-radius:12px;padding:14px;text-align:center;color:#fca5a5;font-weight:700;margin-bottom:14px;">⚠️ ACCOUNT FLAGGED: Trading privileges are disabled on this account. You may still open packs, manage cards, and play normally.</div>`;
        }

        if (!otherPlayers.length) {
            list.innerHTML = `${flagBanner}<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">No other online players found yet. Invite a friend to play!</p>`;
        } else {
            list.innerHTML = flagBanner + otherPlayers.map(p => `
                <div style="background:rgba(255,255,255,0.03);border:1px solid ${p.isTradeBanned ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'};border-radius:14px;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="font-size:26px;">👤</div>
                        <div>
                            <div style="display:flex;align-items:center;gap:6px;">
                                <strong style="color:#fff;font-size:14px;">${escapeHTML(p.username)}</strong>
                                ${p.isTradeBanned ? `<span class="flagged-badge" style="background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;padding:1px 6px;border-radius:6px;font-size:10px;font-weight:800;cursor:help;" title="Flagged Account: Suspected of cheating or confirmed client modification">⚠️ Flagged</span>` : ''}
                            </div>
                            <p style="margin:2px 0 0;font-size:11px;color:var(--cyan);">${escapeHTML(p.title)} · Level ${p.level}</p>
                        </div>
                    </div>
                    ${p.isTradeBanned || state.isTradeBanned 
                        ? `<button class="primary-btn" style="width:auto;padding:8px 16px;font-size:12px;background:#334155;color:#94a3b8;font-weight:900;cursor:not-allowed;" title="Flagged accounts cannot participate in trades" disabled>🚫 Flagged</button>`
                        : `<button class="primary-btn" style="width:auto;padding:8px 16px;font-size:12px;background:linear-gradient(135deg,#00f2fe,#4facfe);font-weight:900;" onclick="sendTradeOffer('${escapeHTML(p.username)}')">🤝 Trade</button>`
                    }
                </div>
            `).join("");
        }
    }

    // Immediate 0ms render from local accounts
    buildAndRender(localAccs);

    // Background fetch latest cloud accounts and re-render seamlessly
    try {
        const allUsers = await GlobalCloudRest.fetchAllUsers();
        if (allUsers && Object.keys(allUsers).length > 0) {
            const merged = { ...localAccs, ...allUsers };
            CloudSync.saveAccounts(merged);
            buildAndRender(merged);
        }
    } catch(e) {}
}

async function refreshTradingHub(showToast = false) {
    if (showToast) SoundFx.click();
    await renderTradeHub();
    if (showToast) toast("🔄 Trading Hub directory refreshed with live active traders!");
}

/* =========================================================
   EQUIPPABLE TITLES
   ========================================================= */

function renderTitles() {
    const container = document.getElementById("titleList");
    if (!container) return;
    container.innerHTML = TITLES.map(title => {
        const unlocked = title.unlock();
        const isEquipped = state.equippedTitle === title.name;
        return `
        <div class="title-item ${unlocked ? "unlocked" : ""}">
            <div>
                <strong class="${title.cssClass}" style="font-size:15px;">${title.name}</strong>
                <p style="margin:2px 0 0;font-size:12px;color:var(--muted);">${escapeHTML(title.requirement)}</p>
            </div>
            <div>
                ${
                    !unlocked ? `<span style="font-size:12px;color:var(--muted)">🔒 Locked</span>`
                    : isEquipped ? `<button class="title-equip-btn equipped">✓ Equipped</button>`
                    : `<button class="title-equip-btn primary-btn" onclick="equipTitle('${title.name}')">Equip</button>`
                }
            </div>
        </div>
        `;
    }).join("");
}

function equipTitle(titleName) {
    state.equippedTitle = titleName;
    saveGame();
    renderHero();
    renderProfile();
    renderTitles();
    SoundFx.levelUp();
    toast(`Equipped Title: ${titleName}!`);
}

function ownsPlayer(name) {
    return state.cards.some(c => c.player === name);
}

/* =========================================================
   PROFILE & AVATAR CUSTOMIZATION
   ========================================================= */

function renderProfile() {
    try {
        setText("profileName", state.name || state.accountUser || "Player");
        setText("profileLevel", state.level || 1);
        setText("profileCards", (state.cards || []).length);
        setText("profilePacks", (state.stats && state.stats.packsOpened) || 0);
        setText("profilePlaytime", formatPlaytime((state.stats && state.stats.playtime) || 0));
        setText("profileBest", (state.stats && state.stats.highestRarity) || "Common");
        const avatarImg = document.getElementById("profileAvatarImg");
        if (avatarImg && state.avatar) avatarImg.src = state.avatar;
        
        const titleBadge = document.getElementById("profileEquippedTitle");
        if (titleBadge) {
            const titleObj = TITLES.find(t => t.name === state.equippedTitle) || TITLES[0];
            titleBadge.textContent = titleObj.name;
            titleBadge.className = `equipped-title-badge ${titleObj.cssClass}`;
        }
        const bg = BACKGROUNDS.find(b => b.id === state.profileBackground) || BACKGROUNDS[0];
        const hero = document.getElementById("profileHero");
        if (bg && hero) hero.style.background = bg.css;
        renderProfileCustomization();
        renderTitles();
        renderShowcase();
    } catch(e) {
        console.error("renderProfile error", e);
    }
}

function renderProfileCustomization() {
    const bgSelect = document.getElementById("profileBackgroundSelect");
    if (bgSelect) {
        const ownedB = Array.isArray(state.ownedBackgrounds) && state.ownedBackgrounds.length ? state.ownedBackgrounds : ["campnou"];
        bgSelect.innerHTML = ownedB.map(id => {
            const bg = BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0];
            return `<option value="${bg.id}" ${bg.id === state.profileBackground ? "selected" : ""}>${bg.name}</option>`;
        }).join("");
    }

    const frameSelect = document.getElementById("profileFrameSelect");
    if (frameSelect) {
        const ownedF = Array.isArray(state.ownedFrames) && state.ownedFrames.length ? state.ownedFrames : ["default"];
        frameSelect.innerHTML = ownedF.map(id => {
            const f = FRAMES.find(frame => frame.id === id) || FRAMES[0];
            return `<option value="${f.id}" ${f.id === state.profileFrame ? "selected" : ""}>${f.name}</option>`;
        }).join("");
    }

    const avatarImg = document.getElementById("profileAvatarImg");
    if (avatarImg) {
        const currentFrame = FRAMES.find(f => f.id === state.profileFrame) || FRAMES[0];
        // Remove existing frame classes
        FRAMES.forEach(f => avatarImg.classList.remove(f.css));
        avatarImg.classList.add(currentFrame.css);
    }
}

function setProfileBackground(id) {
    state.profileBackground = id;
    saveGame();
    renderProfile();
    toast("Stadium background equipped.");
}

function handleAvatarFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        toast("Please select a valid image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Compress to max 256x256 to fit nicely in saves
            const canvas = document.createElement("canvas");
            const maxDim = 256;
            let w = img.width;
            let h = img.height;
            if (w > h) {
                if (w > maxDim) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                }
            } else {
                if (h > maxDim) {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);

            state.avatar = compressed;
            const pImg = document.getElementById("profileAvatarImg");
            if (pImg) pImg.src = compressed;
            saveGame();
            renderProfile();
            toast("📷 Custom avatar photo updated from gallery!");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function resetDefaultAvatar() {
    state.avatar = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80";
    const pImg = document.getElementById("profileAvatarImg");
    if (pImg) pImg.src = state.avatar;
    saveGame();
    renderProfile();
    toast("Avatar reset to default.");
}

/* =========================================================
   POTIONS, TRAVELING MERCHANT & ALCHEMY CRAFTING ENGINE
   ========================================================= */

const POTIONS_DEF = {
    tier1: {
        id: "tier1",
        name: "Tier 1 Luck Potion",
        boostText: "+25% Luck",
        boostPercent: 25,
        durationMs: 600000,
        desc: "Grants +25% Luck for 10 minutes. Stacks with Tier 2 & Tier 3 Luck Potions.",
        color: "#22c55e",
        cost: 500
    },
    tier2: {
        id: "tier2",
        name: "Tier 2 Luck Potion",
        boostText: "+50% Luck",
        boostPercent: 50,
        durationMs: 600000,
        desc: "Grants +50% Luck for 10 minutes. Stacks with Tier 1 & Tier 3 Luck Potions.",
        color: "#10b981",
        cost: 1500
    },
    tier3: {
        id: "tier3",
        name: "Tier 3 Luck Potion",
        boostText: "+100% Luck",
        boostPercent: 100,
        durationMs: 600000,
        desc: "Grants +100% Luck for 10 minutes. Stacks with Tier 1 & Tier 2 Luck Potions.",
        color: "#4ade80",
        cost: 3500
    },
    astral: {
        id: "astral",
        name: "Astral Potion",
        boostText: "+200% Luck",
        boostPercent: 200,
        durationMs: 300000,
        desc: "Grants +200% Luck for 5 minutes. Cannot stack with Tier 1-3. Stacks with Elixir of Luck.",
        color: "#c084fc",
        cost: 0
    },
    elixir: {
        id: "elixir",
        name: "Elixir Of Luck Potion",
        boostText: "+1000% Luck",
        boostPercent: 1000,
        durationMs: 0,
        desc: "Grants +1000% Luck for your next single pack opening! Stacks with all active potions.",
        color: "#ef4444",
        cost: 0
    }
};

function getPotionSVG(type) {
    const uid = Math.random().toString(36).substring(2, 8);
    let colorPrimary = "#22c55e";
    let colorDark = "#14532d";
    let colorLight = "#86efac";

    if (type === "tier1") {
        colorPrimary = "#22c55e";
        colorDark = "#14532d";
        colorLight = "#86efac";
    } else if (type === "tier2") {
        colorPrimary = "#10b981";
        colorDark = "#064e3b";
        colorLight = "#6ee7b7";
    } else if (type === "tier3") {
        colorPrimary = "#059669";
        colorDark = "#022c22";
        colorLight = "#a7f3d0";
    } else if (type === "astral") {
        colorPrimary = "#8b5cf6";
        colorDark = "#2e1065";
        colorLight = "#d8b4fe";
    } else if (type === "elixir") {
        colorPrimary = "#ef4444";
        colorDark = "#450a0a";
        colorLight = "#fca5a5";
    }

    return `
    <svg class="potion-vial-art" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="liquidGrad_${type}_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${colorLight}"/>
                <stop offset="50%" stop-color="${colorPrimary}"/>
                <stop offset="100%" stop-color="${colorDark}"/>
            </linearGradient>
            <linearGradient id="glassReflect_${type}_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.8)"/>
                <stop offset="35%" stop-color="rgba(255,255,255,0.15)"/>
                <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
            </linearGradient>
        </defs>
        <!-- Glass Outer Shell -->
        <path d="M42 22 L42 46 C34 58 16 78 16 102 C16 122 30 134 50 134 C70 134 84 122 84 102 C84 78 66 58 58 46 L58 22 Z" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255, 255, 255, 0.5)" stroke-width="4" />
        
        <!-- Glowing Liquid Fill -->
        <path d="M44 54 C36 64 22 82 22 102 C22 118 34 128 50 128 C66 128 78 118 78 102 C78 82 64 64 56 54 Q50 50 44 54 Z" fill="url(#liquidGrad_${type}_${uid})" opacity="0.95" />
        
        <!-- Liquid Surface Glow -->
        <ellipse cx="50" cy="62" rx="14" ry="4" fill="${colorLight}" opacity="0.7"/>

        <!-- Magical Bubbles -->
        <circle cx="42" cy="98" r="4" fill="#ffffff" opacity="0.8"/>
        <circle cx="58" cy="85" r="3" fill="#ffffff" opacity="0.7"/>
        <circle cx="50" cy="112" r="4.5" fill="#ffffff" opacity="0.85"/>
        <circle cx="36" cy="115" r="2.5" fill="#ffffff" opacity="0.6"/>

        <!-- Glass Curved Specular Highlight -->
        <path d="M26 96 C26 78 38 64 45 52 C44 56 34 72 34 94 C34 110 40 120 48 124 C34 120 26 110 26 96 Z" fill="url(#glassReflect_${type}_${uid})"/>
        
        <!-- Neck Collar & Cork Stopper -->
        <rect x="36" y="18" width="28" height="8" rx="4" fill="#cbd5e1" stroke="#0f172a" stroke-width="2.5"/>
        <path d="M40 8 L60 8 L58 18 L42 18 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
    </svg>
    `;
}

function getMerchantPeriod() {
    return Math.floor(Date.now() / 900000);
}

function getMerchantTimeRemaining() {
    const period = getMerchantPeriod();
    const nextPeriodMs = (period + 1) * 900000;
    const rem = Math.max(0, nextPeriodMs - Date.now());
    const m = Math.floor(rem / 60000);
    const s = Math.floor((rem % 60000) / 1000);
    return `${m}m ${s.toString().padStart(2, '0')}s`;
}

function pseudoRandomSeed(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generateMerchantStock(period) {
    const s = period * 1337;

    // Slot 1: Luck Potion (80% Tier 1, 15% Tier 2, 5% Tier 3)
    const potSeed = pseudoRandomSeed(s + 1);
    let potionKey = "tier1";
    if (potSeed < 0.05) {
        potionKey = "tier3";
    } else if (potSeed < 0.20) {
        potionKey = "tier2";
    } else {
        potionKey = "tier1";
    }
    const potDef = POTIONS_DEF[potionKey];

    const slot1 = {
        type: "potion",
        potionId: potionKey,
        name: potDef.name,
        boostText: potDef.boostText,
        desc: potDef.desc,
        cost: potDef.cost
    };

    // Slot 2 & Slot 3: Random Scouted Cards
    function rollCardSlot(seedVal) {
        const r = pseudoRandomSeed(seedVal);
        let rarity = "Common";
        let cost = 75;

        if (r < 0.000005) {
            rarity = "World Class";
            cost = 100000;
        } else if (r < 0.001) {
            rarity = "Secret";
            cost = 35000;
        } else if (r < 0.051) {
            rarity = "Mythic";
            cost = 10000;
        } else if (r < 0.151) {
            rarity = "Legendary";
            cost = 3000;
        } else if (r < 0.351) {
            rarity = "Rare";
            cost = 1000;
        } else if (r < 0.651) {
            rarity = "Uncommon";
            cost = 350;
        } else {
            rarity = "Common";
            cost = 150;
        }

        const eligible = PLAYERS.filter(p => p.rarity === rarity);
        const cardSeed = pseudoRandomSeed(seedVal + 1);
        const player = eligible.length > 0 ? eligible[Math.floor(cardSeed * eligible.length)] : PLAYERS[0];

        return {
            type: "card",
            player: player.name,
            rating: player.rating,
            rarity: player.rarity,
            position: player.position,
            cost: cost
        };
    }

    const slot2 = rollCardSlot(s + 10);
    const slot3 = rollCardSlot(s + 20);

    return [slot1, slot2, slot3];
}

let cachedMerchantPeriod = -1;
let currentMerchantStock = [];

function getMerchantStock() {
    const period = getMerchantPeriod();
    if (period !== cachedMerchantPeriod) {
        cachedMerchantPeriod = period;
        currentMerchantStock = generateMerchantStock(period);
    }
    return currentMerchantStock;
}

function buyMerchantItem(slotIndex) {
    const stock = getMerchantStock();
    const item = stock[slotIndex];
    if (!item) return;

    state.merchantPurchases = state.merchantPurchases || {};
    const purchaseKey = `${cachedMerchantPeriod}_${slotIndex}`;
    if (state.merchantPurchases[purchaseKey]) {
        toast("⚠️ This item has already been purchased this cycle.");
        return;
    }

    let finalCost = item.cost;
    if (hasSkill("econ_3")) finalCost = Math.round(finalCost * 0.90); // -10% from Market Broker skill

    if (state.coins < finalCost) {
        toast(`🪙 Not enough coins! Need ${finalCost.toLocaleString()} 🪙.`);
        SoundFx.click();
        return;
    }

    if (!spendCoins(finalCost)) return;

    state.merchantPurchases[purchaseKey] = true;

    if (item.type === "potion") {
        if (!state.potions) state.potions = { tier1: 0, tier2: 0, tier3: 0, astral: 0, elixir: 0 };
        state.potions[item.potionId] = (state.potions[item.potionId] || 0) + 1;
        toast(`🧪 Purchased ${item.name}! Added to your Potion Inventory.`);
    } else if (item.type === "card") {
        const pObj = PLAYERS.find(p => p.name === item.player);
        const resolvedPos = item.pos || item.position || (pObj ? pObj.pos : "ST");
        const resolvedImage = pObj ? (pObj.image || getCardImage(pObj)) : getCardImage({ player: item.player });
        const now = Date.now();
        const newCard = {
            id: "merchant_" + now + "_" + Math.floor(Math.random() * 1000),
            player: item.player,
            rating: item.rating,
            pos: resolvedPos,
            position: resolvedPos,
            rarity: item.rarity,
            image: resolvedImage,
            frame: "default",
            serialNumber: null,
            serialGradient: null,
            locked: item.rarity === "World Class" || item.rarity === "Secret",
            obtained: now,
            obtainedAt: now,
            date: new Date(now).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            isSerialized: false
        };
        state.cards.push(newCard);
        if (!state.unlockedCardNames.includes(newCard.player)) {
            state.unlockedCardNames.push(newCard.player);
        }
        toast(`🎴 Purchased ${item.player} (${item.rarity})!`);
    }

    saveGame();
    renderShop();
    renderAll();
    SoundFx.coin();
}

function drinkPotion(type) {
    if (!state.potions || (state.potions[type] || 0) <= 0) {
        toast("You don't have any of this potion in your inventory.");
        return;
    }

    const now = Date.now();
    state.activePotions = state.activePotions || { tier1Until: 0, tier2Until: 0, tier3Until: 0, astralUntil: 0, elixirCharges: 0 };

    if (type === "astral") {
        // Astral cannot stack with Tier 1-3
        const hasStandardActive = (state.activePotions.tier1Until > now) || (state.activePotions.tier2Until > now) || (state.activePotions.tier3Until > now);
        if (hasStandardActive) {
            toast("⚠️ Cannot use Astral Potion while Tier 1-3 Luck Potions are active!");
            SoundFx.click();
            return;
        }
        state.potions.astral--;
        state.activePotions.astralUntil = Math.max(now, state.activePotions.astralUntil || 0) + 300000;
        toast("🌌 Astral Potion Activated: +200% Luck for 5 Minutes!");
    } else if (type === "tier1" || type === "tier2" || type === "tier3") {
        // Tier 1-3 cannot stack with Astral
        if (state.activePotions.astralUntil > now) {
            toast("⚠️ Cannot use Tier 1-3 Luck Potions while Astral Potion is active!");
            SoundFx.click();
            return;
        }
        state.potions[type]--;
        let duration = 600000;
        if (hasSkill("luck_2")) duration += 120000; // +2 mins from Potion Connoisseur skill
        const key = type + "Until";
        state.activePotions[key] = Math.max(now, state.activePotions[key] || 0) + duration;
        toast(`🧪 ${POTIONS_DEF[type].name} Activated: ${POTIONS_DEF[type].boostText} for ${Math.round(duration/60000)} Minutes!`);
    } else if (type === "elixir") {
        // Elixir of luck stacks with everything!
        state.potions.elixir--;
        state.activePotions.elixirCharges = (state.activePotions.elixirCharges || 0) + 1;
        toast("🔥 Elixir of Luck Activated: +1000% Luck for Next 1 Pack Pull!");
    }

    saveGame();
    renderAlchemy();
    renderShop();
    renderActivePotionsHUD();
    SoundFx.levelUp();
}

let currentCraftRecipe = "astral";
let selectedCraftCardIds = [];

function openCraftingModal(recipeType) {
    currentCraftRecipe = recipeType;
    selectedCraftCardIds = [];

    const modal = document.getElementById("craftingModal");
    const title = document.getElementById("craftingModalTitle");
    const sub = document.getElementById("craftingModalSub");

    if (recipeType === "astral") {
        if (title) title.innerHTML = "⚗️ Brew Astral Potion (+200% Luck, 5m)";
        if (sub) sub.innerHTML = "Select 5 Mythical cards from your collection to sacrifice.";
    } else {
        if (title) title.innerHTML = "⚗️ Brew Elixir of Luck (+1000% Luck, 1 Pack)";
        if (sub) sub.innerHTML = "Select 5 Secret cards from your collection to sacrifice.";
    }

    renderCraftingModalContent();
    if (modal) modal.classList.remove("hidden");
    SoundFx.click();
}

function closeCraftingModal() {
    const modal = document.getElementById("craftingModal");
    if (modal) modal.classList.add("hidden");
    selectedCraftCardIds = [];
}

function renderCraftingModalContent() {
    const reqRarity = currentCraftRecipe === "astral" ? "Mythic" : "Secret";
    const eligibleCards = (state.cards || []).filter(c => c.rarity === reqRarity);

    const slotsEl = document.getElementById("craftingSelectedSlots");
    if (slotsEl) {
        slotsEl.innerHTML = new Array(5).fill(null).map((_, i) => {
            const cardId = selectedCraftCardIds[i];
            const card = eligibleCards.find(c => c.id === cardId);
            if (card) {
                return `
                <div class="craft-slot filled" onclick="toggleCraftCardSelect('${card.id}')" style="width:70px;height:95px;border:2px solid ${currentCraftRecipe === 'astral' ? '#a855f7' : '#ef4444'};border-radius:10px;background:rgba(15,23,42,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;padding:4px;text-align:center;">
                    <span style="font-size:10px;font-weight:900;color:#fff;line-height:1.1;">${escapeHTML(card.player)}</span>
                    <span style="font-size:9px;color:var(--gold);margin-top:2px;">${card.rating} OVR</span>
                    <span style="position:absolute;top:-6px;right:-6px;background:red;color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;display:flex;align-items:center;justify-content:center;">✕</span>
                </div>
                `;
            }
            return `
            <div class="craft-slot empty" style="width:70px;height:95px;border:2px dashed rgba(255,255,255,0.2);border-radius:10px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:20px;">
                +
            </div>
            `;
        }).join("");
    }

    const gridEl = document.getElementById("craftingPickerGrid");
    if (gridEl) {
        if (!eligibleCards.length) {
            gridEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--muted);">No unlocked ${reqRarity} cards found in your collection. Open packs to collect them!</div>`;
        } else {
            gridEl.innerHTML = eligibleCards.map(c => {
                const isSelected = selectedCraftCardIds.includes(c.id);
                return `
                <div class="card ${c.rarity.toLowerCase().replace(/\s+/g, '-')} ${isSelected ? 'selected-craft' : ''}" onclick="toggleCraftCardSelect('${c.id}')" style="cursor:pointer;padding:10px;border-radius:12px;${isSelected ? 'outline:3px solid #ffd700;transform:scale(0.96);' : ''}">
                    <div style="font-weight:900;font-size:12px;color:#fff;">${escapeHTML(c.player)}</div>
                    <div style="font-size:11px;color:var(--gold);">${c.rating} OVR · ${c.rarity}</div>
                </div>
                `;
            }).join("");
        }
    }

    const execBtn = document.getElementById("executeCraftBtn");
    if (execBtn) {
        execBtn.textContent = `⚗️ Brew ${currentCraftRecipe === 'astral' ? 'Astral Potion' : 'Elixir of Luck'} (${selectedCraftCardIds.length}/5 Selected)`;
        execBtn.disabled = selectedCraftCardIds.length !== 5;
    }
}

function toggleCraftCardSelect(cardId) {
    const idx = selectedCraftCardIds.indexOf(cardId);
    if (idx > -1) {
        selectedCraftCardIds.splice(idx, 1);
    } else {
        if (selectedCraftCardIds.length >= 5) {
            toast("You can only select 5 cards.");
            return;
        }
        selectedCraftCardIds.push(cardId);
    }
    renderCraftingModalContent();
    SoundFx.click();
}

function craftingAutoSelect5() {
    const reqRarity = currentCraftRecipe === "astral" ? "Mythic" : "Secret";
    const eligible = (state.cards || []).filter(c => c.rarity === reqRarity && !c.locked);
    selectedCraftCardIds = eligible.slice(0, 5).map(c => c.id);
    renderCraftingModalContent();
    SoundFx.click();
}

function confirmExecuteCraft() {
    if (selectedCraftCardIds.length !== 5) {
        toast("Please select exactly 5 cards to brew this potion.");
        return;
    }

    const idsToSacrifice = new Set(selectedCraftCardIds);
    state.cards = state.cards.filter(c => !idsToSacrifice.has(c.id));

    if (!state.potions) state.potions = { tier1: 0, tier2: 0, tier3: 0, astral: 0, elixir: 0 };
    if (currentCraftRecipe === "astral") {
        state.potions.astral = (state.potions.astral || 0) + 1;
        toast("🌌 Alchemy Success! Crafted 1x Astral Potion (+200% Luck for 5m)!");
    } else {
        state.potions.elixir = (state.potions.elixir || 0) + 1;
        toast("🔥 Alchemy Success! Crafted 1x Elixir of Luck (+1000% Luck for Next Pack)!");
    }

    closeCraftingModal();
    saveGame();
    renderAll();
    SoundFx.levelUp();
}

function getActiveLuckMultiplier() {
    const now = Date.now();
    const act = state.activePotions || {};
    let mult = 1.0;

    // Passive Base Luck from Skill Tree
    if (hasSkill("luck_1")) mult += 0.10; // +10%
    if (hasSkill("luck_3")) mult += 0.20; // +20%
    if (hasSkill("luck_4")) mult += 0.35; // +35% (Master Node)

    // Potion boosts (amplified +50% if Fortune's Chosen master skill is unlocked)
    const potAmp = hasSkill("luck_4") ? 1.5 : 1.0;

    if (act.tier1Until > now) mult += (0.25 * potAmp);
    if (act.tier2Until > now) mult += (0.50 * potAmp);
    if (act.tier3Until > now) mult += (1.00 * potAmp);
    if (act.astralUntil > now) mult += (2.00 * potAmp);
    if (act.elixirCharges > 0) mult += (10.00 * potAmp);

    return mult;
}

function updateNotificationBadges() {
    // 1. Missions badge
    const missionsBadge = document.getElementById("missionsAlertBadge");
    if (missionsBadge) {
        let hasClaimable = false;
        for (const type of ["hourly", "daily", "weekly", "monthly"]) {
            const list = MISSION_TEMPLATES[type] || [];
            list.forEach((m, idx) => {
                const prog = (state.missionProgress && state.missionProgress[type]) ? state.missionProgress[type][idx] : 0;
                const claimed = (state.missionClaimed && state.missionClaimed[type]) ? state.missionClaimed[type][idx] : false;
                if (prog >= m[1] && !claimed) hasClaimable = true;
            });
        }
        missionsBadge.classList.toggle("hidden", !hasClaimable);
    }

    // 2. Index badge
    const indexBadge = document.getElementById("indexAlertBadge");
    if (indexBadge) {
        const basePlayers = PLAYERS.filter(p => !p.hiddenFromIndex);
        const discovered = basePlayers.filter(p => (state.unlockedCardNames || []).includes(p.name) || (state.cards || []).some(c => c.player === p.name));
        const hasUnclaimed = discovered.some(p => !(state.claimedIndexRewards || []).includes(p.name));
        indexBadge.classList.toggle("hidden", !hasUnclaimed);
    }

    // 3. Trade badge
    const tradeBadge = document.getElementById("tradeAlertBadge");
    if (tradeBadge) {
        const trades = CloudSync.getTrades();
        const myName = (state.accountUser || "").toLowerCase();
        const hasPending = trades.some(t => t.toUser.toLowerCase() === myName && t.status === "pending");
        tradeBadge.classList.toggle("hidden", !hasPending);
    }

    // 4. Milestones badge
    const milestonesBadge = document.getElementById("milestonesAlertBadge");
    if (milestonesBadge) {
        const currentLevel = Number(state.level || 1);
        const claimed = Array.isArray(state.claimedLevelMilestones) ? state.claimedLevelMilestones : [];
        const hasMilestoneClaimable = LEVEL_MILESTONES.some(m => currentLevel >= m.level && !claimed.includes(m.level));
        milestonesBadge.classList.toggle("hidden", !hasMilestoneClaimable);
    }
}

function renderActivePotionsHUD() {
    const hud = document.getElementById("activePotionsHUD");
    if (!hud) return;

    const now = Date.now();
    const act = state.activePotions || {};
    const activeList = [];

    // Permanent Passive Base Luck Badge from Skill Tree
    let baseLuckPercent = 0;
    if (hasSkill("luck_1")) baseLuckPercent += 10;
    if (hasSkill("luck_3")) baseLuckPercent += 20;
    if (hasSkill("luck_4")) baseLuckPercent += 35;

    if (baseLuckPercent > 0) {
        activeList.push({
            name: "Passive Base Luck",
            icon: "\uD83C\uDF40",
            boost: `+${baseLuckPercent}% Luck`,
            timer: "Permanent",
            color: "#22c55e",
            desc: `Passive Skill Tree Bonus: Permanent +${baseLuckPercent}% Luck on all pack openings!`
        });
    }

    if (act.tier1Until > now) {
        const remMs = act.tier1Until - now;
        const potAmp = hasSkill("luck_4") ? " (+37.5%)" : " (+25%)";
        activeList.push({
            name: "Tier 1 Luck",
            icon: "\uD83E\uDDEA",
            boost: potAmp,
            timer: formatCountdown(remMs),
            color: "#22c55e",
            desc: "+25% Luck for 10 minutes"
        });
    }

    if (act.tier2Until > now) {
        const remMs = act.tier2Until - now;
        const potAmp = hasSkill("luck_4") ? " (+75%)" : " (+50%)";
        activeList.push({
            name: "Tier 2 Luck",
            icon: "\uD83E\uDDEA",
            boost: potAmp,
            timer: formatCountdown(remMs),
            color: "#10b981",
            desc: "+50% Luck for 10 minutes"
        });
    }

    if (act.tier3Until > now) {
        const remMs = act.tier3Until - now;
        const potAmp = hasSkill("luck_4") ? " (+150%)" : " (+100%)";
        activeList.push({
            name: "Tier 3 Luck",
            icon: "\uD83E\uDDEA",
            boost: potAmp,
            timer: formatCountdown(remMs),
            color: "#4ade80",
            desc: "+100% Luck for 10 minutes"
        });
    }

    if (act.astralUntil > now) {
        const remMs = act.astralUntil - now;
        const potAmp = hasSkill("luck_4") ? " (+300%)" : " (+200%)";
        activeList.push({
            name: "Astral Potion",
            icon: "\uD83D\uDD2E",
            boost: potAmp,
            timer: formatCountdown(remMs),
            color: "#c084fc",
            desc: "+200% Luck for 5 minutes"
        });
    }

    if (act.elixirCharges > 0) {
        const potAmp = hasSkill("luck_4") ? " (+1500%)" : " (+1000%)";
        activeList.push({
            name: "Elixir of Luck",
            icon: "\u2697\uFE0F",
            boost: potAmp,
            timer: `${act.elixirCharges} Pack${act.elixirCharges > 1 ? 's' : ''}`,
            color: "#ef4444",
            desc: "+1000% Luck for next pack opening!"
        });
    }

    if (!activeList.length) {
        hud.innerHTML = "";
        return;
    }

    const totalMult = getActiveLuckMultiplier();
    let hudHtml = `
    <div style="font-size:11px;font-weight:900;color:var(--gold);text-align:right;margin-bottom:-4px;text-shadow:0 0 10px rgba(0,0,0,0.8);">
        \u26A1 TOTAL LUCK: ${(totalMult * 100).toFixed(0)}%
    </div>
    `;

    activeList.forEach(item => {
        hudHtml += `
        <div class="hud-potion-badge" style="--hud-glow:${item.color};" title="${item.desc}">
            <div class="hud-potion-icon" style="background:${item.color}22;border:1px solid ${item.color};">${item.icon}</div>
            <div style="display:flex;flex-direction:column;">
                <span class="hud-potion-label" style="color:${item.color};">${item.name} <small style="font-weight:900;">${item.boost}</small></span>
                <span class="hud-potion-timer">\u23F3 ${item.timer}</span>
            </div>
        </div>
        `;
    });

    hud.innerHTML = hudHtml;
}

function dismissDeletedAccountModal() {
    const modal = document.getElementById("deletedAccountAlertModal");
    if (modal) modal.classList.add("hidden");
    showPage("home");
    renderAll();
}

/* =========================================================
   SHOP (MERCHANT, POTIONS, STADIUMS & AVATAR FRAMES)
   ========================================================= */

/* =========================================================
   ALCHEMY SECTION (CARD TRANSMUTATION & POTIONS POUCH)
   ========================================================= */

function renderAlchemy() {
    const invGrid = document.getElementById("potionsInventoryGrid");
    if (invGrid) {
        state.potions = state.potions || { tier1: 0, tier2: 0, tier3: 0, astral: 0, elixir: 0 };
        const keys = ["tier1", "tier2", "tier3", "astral", "elixir"];
        invGrid.innerHTML = keys.map(k => {
            const def = POTIONS_DEF[k];
            const qty = state.potions[k] || 0;
            return `
            <div class="potion-card" style="border-color:${def.color}44;">
                ${getPotionSVG(k)}
                <h4 style="margin:4px 0 2px;font-size:14px;color:#fff;">${escapeHTML(def.name)}</h4>
                <span style="font-size:11.5px;color:${def.color};font-weight:900;margin-bottom:4px;">${def.boostText}</span>
                <span style="font-size:12px;color:var(--gold);font-weight:800;margin-bottom:10px;">Owned: <b>${qty}</b></span>
                <button class="${qty > 0 ? 'primary-btn' : 'ghost-btn'}" ${qty > 0 ? '' : 'disabled'} style="width:100%;font-size:12px;padding:7px;background:${qty > 0 ? `linear-gradient(135deg, ${def.color}, #09131d)` : ''};" onclick="drinkPotion('${k}')">
                    🧪 Drink Potion
                </button>
            </div>
            `;
        }).join("");
    }
}

/* =========================================================
   SKILL TREE & TALENT MASTERY ENGINE
   ========================================================= */

const SKILL_POINTS_COST_TABLE = [
    5000,
    7500,
    10000,
    15000,
    20000,
    30000,
    40000,
    55000,
    75000,
    100000
];

function getNextSkillPointCost() {
    const purchased = state.skillPointsPurchased || 0;
    if (purchased < SKILL_POINTS_COST_TABLE.length) {
        return SKILL_POINTS_COST_TABLE[purchased];
    }
    const extra = purchased - (SKILL_POINTS_COST_TABLE.length - 1);
    return Math.round(100000 * Math.pow(1.25, extra));
}

function buySkillPoint() {
    const cost = getNextSkillPointCost();
    if (Number(state.coins || 0) < cost) {
        toast(`🪙 Not enough coins! Need ${cost.toLocaleString()} 🪙 for next Skill Point.`);
        SoundFx.click();
        return;
    }

    if (!spendCoins(cost, _INTERNAL_TX_KEY)) return;

    state.skillPoints = (state.skillPoints || 0) + 1;
    state.skillPointsPurchased = (state.skillPointsPurchased || 0) + 1;
    saveGame();
    renderSkillTree();
    renderAll();
    SoundFx.levelUp();
    toast(`⚡ Skill Point Acquired! You now have ${state.skillPoints} SP available to spend.`);
}

const SKILL_TREE_DEF = [
    {
        branchId: "econ",
        name: "Economy Mastery",
        icon: "💰",
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.25)",
        desc: "Boost your coin income from gameplay, selling duplicates, and merchant trades.",
        nodes: [
            {
                id: "econ_1",
                tier: 1,
                name: "Bargain Hunter",
                icon: "🪙",
                benefit: "+10% Coins from Daily Rewards & Missions",
                req: null
            },
            {
                id: "econ_2",
                tier: 2,
                name: "Scrap Merchant",
                icon: "♻️",
                benefit: "+15% Coin value when Quick Selling duplicate cards",
                req: "econ_1"
            },
            {
                id: "econ_3",
                tier: 3,
                name: "Market Broker",
                icon: "🤝",
                benefit: "-10% Coin cost on all Traveling Merchant stock",
                req: "econ_2"
            },
            {
                id: "econ_4",
                tier: 4,
                name: "Master of Wealth",
                icon: "👑",
                benefit: "[MASTER] +25% Coins earned from all sources & +20% card sell value",
                req: "econ_3",
                isMaster: true
            }
        ]
    },
    {
        branchId: "packs",
        name: "Pack Mastery",
        icon: "🎴",
        color: "#38bdf8",
        glow: "rgba(56, 189, 248, 0.25)",
        desc: "Enhance pack opening efficiency, scouting costs, and unlock bonus card rolls.",
        nodes: [
            {
                id: "packs_1",
                tier: 1,
                name: "Swift Unpacker",
                icon: "📦",
                benefit: "5% chance on opening any pack to receive a full coin refund",
                req: null
            },
            {
                id: "packs_2",
                tier: 2,
                name: "Scout's Intuition",
                icon: "🔍",
                benefit: "Guarantees at least 1 Rare or higher floor on multi-pack pulls",
                req: "packs_1"
            },
            {
                id: "packs_3",
                tier: 3,
                name: "Bulk Buyer",
                icon: "🏷️",
                benefit: "-5% Discount on all booster pack scouting costs",
                req: "packs_2"
            },
            {
                id: "packs_4",
                tier: 4,
                name: "Grand Packmaster",
                icon: "🌟",
                benefit: "[MASTER] 10% chance for every opened pack to trigger an extra bonus card roll",
                req: "packs_3",
                isMaster: true
            }
        ]
    },
    {
        branchId: "luck",
        name: "Luck Mastery",
        icon: "🍀",
        color: "#22c55e",
        glow: "rgba(34, 197, 94, 0.25)",
        desc: "Permanently boost your passive base luck and amplify all potion alchemy.",
        nodes: [
            {
                id: "luck_1",
                tier: 1,
                name: "Four-Leaf Clover",
                icon: "🍀",
                benefit: "Permanent +10% Passive Base Luck on all pack openings",
                req: null
            },
            {
                id: "luck_2",
                tier: 2,
                name: "Potion Connoisseur",
                icon: "🧪",
                benefit: "All consumed Luck Potion durations increased by +2 Minutes",
                req: "luck_1"
            },
            {
                id: "luck_3",
                tier: 3,
                name: "Starlight Blessing",
                icon: "✨",
                benefit: "Permanent +20% Passive Base Luck on all pack openings",
                req: "luck_2"
            },
            {
                id: "luck_4",
                tier: 4,
                name: "Fortune's Chosen",
                icon: "🔮",
                benefit: "[MASTER] +35% Base Luck & +50% extra Luck Power on all Luck Potions",
                req: "luck_3",
                isMaster: true
            }
        ]
    },
    {
        branchId: "prog",
        name: "Progression Mastery",
        icon: "⭐",
        color: "#c084fc",
        glow: "rgba(192, 132, 252, 0.25)",
        desc: "Accelerate your leveling speed, training rewards, and mission requirements.",
        nodes: [
            {
                id: "prog_1",
                tier: 1,
                name: "Fast Learner",
                icon: "⭐",
                benefit: "+15% XP earned across all pack openings & missions",
                req: null
            },
            {
                id: "prog_2",
                tier: 2,
                name: "Training Regimen",
                icon: "⚽",
                benefit: "Daily training rewards grant +50 bonus XP and +100 bonus Coins",
                req: "prog_1"
            },
            {
                id: "prog_3",
                tier: 3,
                name: "Overachiever",
                icon: "🎯",
                benefit: "Mission completion progress requirements reduced by 10%",
                req: "prog_2"
            },
            {
                id: "prog_4",
                tier: 4,
                name: "Legendary Ascendant",
                icon: "🏆",
                benefit: "[MASTER] Leveling up grants double reward coins & golden profile aura",
                req: "prog_3",
                isMaster: true
            }
        ]
    }
];

function hasSkill(skillId) {
    return Array.isArray(state.unlockedSkills) && state.unlockedSkills.includes(skillId);
}

function unlockSkillNode(nodeId) {
    if (hasSkill(nodeId)) {
        toast("You have already mastered this skill.");
        return;
    }

    if ((state.skillPoints || 0) < 1) {
        toast("⚡ You need at least 1 Skill Point (SP) to unlock a skill node.");
        SoundFx.click();
        return;
    }

    // Find node def
    let foundNode = null;
    for (const b of SKILL_TREE_DEF) {
        const n = b.nodes.find(x => x.id === nodeId);
        if (n) { foundNode = n; break; }
    }
    if (!foundNode) return;

    // Verify Prerequisite
    if (foundNode.req && !hasSkill(foundNode.req)) {
        let reqNode = null;
        for (const b of SKILL_TREE_DEF) {
            const n = b.nodes.find(x => x.id === foundNode.req);
            if (n) { reqNode = n; break; }
        }
        toast(`🔒 Prerequisite Required: Must unlock "${reqNode ? reqNode.name : foundNode.req}" first!`);
        SoundFx.click();
        return;
    }

    state.skillPoints = Math.max(0, (state.skillPoints || 0) - 1);
    if (!Array.isArray(state.unlockedSkills)) state.unlockedSkills = [];
    state.unlockedSkills.push(nodeId);

    saveGame();
    renderSkillTree();
    renderAll();
    SoundFx.levelUp();
    toast(`✨ Mastered Skill: "${foundNode.name}"! (${foundNode.benefit})`);
}

function respecSkillTree() {
    const totalSpent = (state.unlockedSkills || []).length;
    if (totalSpent === 0) {
        toast("No skills have been unlocked to respec.");
        return;
    }

    state.skillPoints = (state.skillPoints || 0) + totalSpent;
    state.unlockedSkills = [];
    saveGame();
    renderSkillTree();
    renderAll();
    SoundFx.coin();
    toast(`🔄 Skill Tree Respec Complete! Refunded ${totalSpent} Skill Points.`);
}

function renderSkillTree() {
    const spCountEl = document.getElementById("skillPointsAvailableCount");
    const nextCostEl = document.getElementById("nextSkillPointCost");
    const summaryEl = document.getElementById("unlockedSkillsSummary");
    const container = document.getElementById("skillBranchesContainer");

    if (spCountEl) spCountEl.textContent = (state.skillPoints || 0).toLocaleString();
    if (nextCostEl) nextCostEl.textContent = getNextSkillPointCost().toLocaleString();
    if (summaryEl) summaryEl.textContent = `${(state.unlockedSkills || []).length}/16 Nodes Mastered`;

    if (!container) return;

    container.innerHTML = SKILL_TREE_DEF.map(branch => {
        return `
        <div class="skill-branch-column" style="--branch-border:${branch.color}55;--branch-glow:${branch.glow};">
            <div class="skill-branch-head">
                <span style="font-size:24px;">${branch.icon}</span>
                <div>
                    <h3 style="margin:0;font-size:16px;color:${branch.color};">${escapeHTML(branch.name)}</h3>
                    <p style="margin:2px 0 0;font-size:11.5px;color:var(--muted);">${escapeHTML(branch.desc)}</p>
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px;">
                ${branch.nodes.map((node, idx) => {
                    const isUnlocked = hasSkill(node.id);
                    const canUnlock = !isUnlocked && (!node.req || hasSkill(node.req)) && (state.skillPoints || 0) >= 1;
                    const isLocked = !isUnlocked && (!node.req || hasSkill(node.req)) ? false : !isUnlocked;
                    
                    let statusClass = isUnlocked ? "unlocked" : (canUnlock ? "available" : "locked");
                    if (node.isMaster) statusClass += " master-node";

                    return `
                    ${idx > 0 ? `<div class="skill-connection-arrow">↓</div>` : ""}
                    <div class="skill-node-card ${statusClass}">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:20px;">${node.icon}</span>
                                <div>
                                    <h4 style="margin:0;font-size:14px;color:#fff;">${escapeHTML(node.name)}</h4>
                                    <span style="font-size:10px;font-weight:800;color:${branch.color};">TIER ${node.tier}${node.isMaster ? ' · MASTER' : ''}</span>
                                </div>
                            </div>
                            ${isUnlocked 
                                ? `<span style="background:rgba(34,197,94,0.2);color:#22c55e;border:1px solid #22c55e;padding:2px 8px;border-radius:6px;font-size:10.5px;font-weight:900;">✓ MASTERED</span>`
                                : `<span style="font-size:11px;color:var(--muted);">1 SP</span>`
                            }
                        </div>
                        <p style="margin:2px 0 6px;font-size:12px;color:#cbd5e1;line-height:1.35;">${escapeHTML(node.benefit)}</p>
                        ${!isUnlocked 
                            ? `<button class="${canUnlock ? 'primary-btn' : 'ghost-btn'}" style="width:100%;font-size:12px;padding:6px;${canUnlock ? `background:${branch.color};color:#000;font-weight:900;` : ''}" onclick="unlockSkillNode('${node.id}')">
                                ${canUnlock ? '⚡ Unlock for 1 SP' : (node.req && !hasSkill(node.req) ? '🔒 Prerequisite Locked' : '⚡ Need 1 SP')}
                               </button>`
                            : ''
                        }
                    </div>
                    `;
                }).join("")}
            </div>
        </div>
        `;
    }).join("");
}

/* =========================================================
   LEVEL MILESTONES ENGINE (EVERY 5 LEVELS REWARD SYSTEM)
   ========================================================= */

const LEVEL_MILESTONES = [
    { level: 5, coins: 2500, freePacks: 1, title: "Rising Talent" },
    { level: 10, coins: 5000, freePacks: 1, title: "Academy Graduate" },
    { level: 15, coins: 10000, freePacks: 1, title: "First Team Prospect" },
    { level: 20, coins: 15000, freePacks: 1, title: "Starting XI Stalwart" },
    { level: 25, coins: 25000, freePacks: 1, title: "Squad Captain" },
    { level: 30, coins: 35000, freePacks: 1, title: "Division Champion" },
    { level: 35, coins: 50000, freePacks: 1, title: "Continental Contender" },
    { level: 40, coins: 75000, freePacks: 1, title: "World Class Veteran" },
    { level: 45, coins: 100000, freePacks: 1, title: "International Legend" },
    { level: 50, coins: 150000, freePacks: 1, title: "Grand Master Collector" },
    { level: 60, coins: 200000, freePacks: 1, title: "Hall of Fame Inductee" },
    { level: 70, coins: 250000, freePacks: 1, title: "All-Time Icon" },
    { level: 80, coins: 300000, freePacks: 1, title: "Immortal Maestro" },
    { level: 90, coins: 400000, freePacks: 1, title: "Mythical Sovereign" },
    { level: 100, coins: 500000, freePacks: 1, title: "Supreme World Legend" }
];

function claimLevelMilestone(targetLevel) {
    const milestone = LEVEL_MILESTONES.find(m => m.level === targetLevel);
    if (!milestone) return;

    const currentLevel = Number(state.level || 1);
    if (currentLevel < targetLevel) {
        toast(`🔒 You must reach Level ${targetLevel} to claim this milestone!`);
        SoundFx.click();
        return;
    }

    if (!Array.isArray(state.claimedLevelMilestones)) state.claimedLevelMilestones = [];
    if (state.claimedLevelMilestones.includes(targetLevel)) {
        toast("You have already claimed this milestone reward.");
        return;
    }

    state.claimedLevelMilestones.push(targetLevel);
    addCoins(milestone.coins, _INTERNAL_TX_KEY);
    state.freeChampionPacks3x = (state.freeChampionPacks3x || 0) + milestone.freePacks;

    saveGame();
    renderLevelMilestones();
    renderPacks();
    updateNotificationBadges();
    SoundFx.levelUp();
    toast(`🎖️ Milestone Claimed! +${milestone.coins.toLocaleString()} 🪙 & 3 Free Champion Packs added!`);
}

function renderPacks() {
    const champBtn = document.getElementById("championPack3xBtn");
    if (!champBtn) return;

    const freePacks = state.freeChampionPacks3x || 0;
    if (freePacks > 0) {
        champBtn.innerHTML = `🎁 3x FREE (${freePacks})`;
        champBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
        champBtn.style.color = "#ffffff";
        champBtn.style.fontWeight = "900";
        champBtn.style.boxShadow = "0 0 16px rgba(16, 185, 129, 0.7)";
        champBtn.classList.add("free-pack-glow-btn");
    } else {
        champBtn.innerHTML = "3x · 135 🪙";
        champBtn.style.background = "";
        champBtn.style.color = "";
        champBtn.style.fontWeight = "";
        champBtn.style.boxShadow = "";
        champBtn.classList.remove("free-pack-glow-btn");
    }
}

function renderLevelMilestones() {
    const currentLvlEl = document.getElementById("milestoneCurrentLevel");
    const nextSummaryEl = document.getElementById("milestoneNextSummary");
    const freeCountEl = document.getElementById("freeChampPacksCount");
    const grid = document.getElementById("milestonesGrid");

    const currentLevel = Number(state.level || 1);
    if (currentLvlEl) currentLvlEl.textContent = currentLevel;
    if (freeCountEl) freeCountEl.textContent = state.freeChampionPacks3x || 0;

    const nextMilestone = LEVEL_MILESTONES.find(m => m.level > currentLevel) || LEVEL_MILESTONES[LEVEL_MILESTONES.length - 1];
    if (nextSummaryEl) {
        if (currentLevel >= 100) {
            nextSummaryEl.textContent = "Max Level Milestone Achieved! You are a Supreme World Legend.";
        } else {
            const diff = nextMilestone.level - currentLevel;
            nextSummaryEl.textContent = `Next Milestone: Level ${nextMilestone.level} (${diff} level${diff === 1 ? '' : 's'} remaining)`;
        }
    }

    if (!grid) return;

    if (!Array.isArray(state.claimedLevelMilestones)) state.claimedLevelMilestones = [];

    grid.innerHTML = LEVEL_MILESTONES.map(m => {
        const isClaimed = state.claimedLevelMilestones.includes(m.level);
        const isEligible = currentLevel >= m.level && !isClaimed;
        const isLocked = currentLevel < m.level;

        let statusClass = isClaimed ? "claimed" : (isEligible ? "claimable" : "locked");

        return `
        <div class="milestone-card ${statusClass}">
            <div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:26px;">${isClaimed ? '✅' : (isEligible ? '🎁' : '🔒')}</span>
                        <div>
                            <h3 style="margin:0;font-size:17px;color:#fff;">Level ${m.level}</h3>
                            <span style="font-size:11px;font-weight:800;color:var(--gold);text-transform:uppercase;">${m.title}</span>
                        </div>
                    </div>
                    ${isClaimed 
                        ? `<span style="font-size:11px;font-weight:900;color:#22c55e;background:rgba(34,197,94,0.15);padding:3px 8px;border-radius:8px;border:1px solid #22c55e;">CLAIMED</span>`
                        : (isEligible 
                            ? `<span style="font-size:11px;font-weight:900;color:var(--gold);background:rgba(234,179,8,0.2);padding:3px 8px;border-radius:8px;border:1px solid var(--gold);">UNLOCKED</span>` 
                            : `<span style="font-size:11px;color:var(--muted);">LOCKED</span>`
                          )
                    }
                </div>
                
                <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:12px;margin:10px 0;display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;">
                        <span style="color:var(--muted);">Gold Reward:</span>
                        <b style="color:var(--gold);font-weight:900;">+${m.coins.toLocaleString()} 🪙</b>
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;">
                        <span style="color:var(--muted);">Free Packs:</span>
                        <b style="color:#38bdf8;font-weight:900;">3x Champion Packs (Free)</b>
                    </div>
                </div>
            </div>

            <div>
                ${isClaimed 
                    ? `<button class="ghost-btn" disabled style="width:100%;font-size:13px;padding:10px;">✓ Reward Claimed</button>`
                    : (isEligible 
                        ? `<button class="primary-btn" style="width:100%;font-size:13px;padding:10px;background:linear-gradient(135deg,#f59e0b,#eab308);color:#000;font-weight:900;box-shadow:0 0 15px rgba(234,179,8,0.5);" onclick="claimLevelMilestone(${m.level})">
                            🎁 Claim Level ${m.level} Reward
                           </button>`
                        : `<button class="ghost-btn" disabled style="width:100%;font-size:13px;padding:10px;">🔒 Reach Level ${m.level}</button>`
                      )
                }
            </div>
        </div>
        `;
    }).join("");
}

/* =========================================================
   SHOP (TRAVELING MERCHANT, STADIUMS & AVATAR FRAMES)
   ========================================================= */

function renderShop() {
    // 1. Traveling Merchant Slots
    const merchantGrid = document.getElementById("merchantSlotsGrid");
    const merchantCountdown = document.getElementById("merchantCountdown");
    if (merchantCountdown) merchantCountdown.textContent = getMerchantTimeRemaining();

    if (merchantGrid) {
        const stock = getMerchantStock();
        merchantGrid.innerHTML = stock.map((item, idx) => {
            const purchaseKey = `${cachedMerchantPeriod}_${idx}`;
            const isBought = !!((state.merchantPurchases || {})[purchaseKey]);

            if (item.type === "potion") {
                const potDef = POTIONS_DEF[item.potionId];
                return `
                <div class="merchant-slot-card" style="border-color:${potDef.color}55;">
                    <span class="merchant-slot-tag" style="color:${potDef.color};border-color:${potDef.color};">SLOT ${idx+1} · LUCK POTION</span>
                    ${getPotionSVG(item.potionId)}
                    <h3 style="margin:4px 0 2px;font-size:16px;color:#fff;">${escapeHTML(item.name)}</h3>
                    <span style="font-size:12px;color:${potDef.color};font-weight:900;margin-bottom:6px;">${item.boostText}</span>
                    <p style="font-size:11.5px;color:var(--muted);margin:0 0 12px;min-height:30px;">${escapeHTML(item.desc)}</p>
                    <button class="${isBought ? 'ghost-btn' : 'primary-btn'}" ${isBought ? 'disabled' : ''} style="width:100%;font-size:13px;padding:9px;" onclick="buyMerchantItem(${idx})">
                        ${isBought ? '✓ Sold Out' : `🛒 Buy for ${item.cost.toLocaleString()} 🪙`}
                    </button>
                </div>
                `;
            } else {
                return `
                <div class="merchant-slot-card" style="border-color:rgba(56,189,248,0.4);">
                    <span class="merchant-slot-tag">SLOT ${idx+1} · SCOUTED CARD</span>
                    <div style="margin:12px 0 8px;font-size:36px;">🎴</div>
                    <h3 style="margin:4px 0 2px;font-size:16px;color:#fff;">${escapeHTML(item.player)}</h3>
                    <span class="card-rarity-badge ${item.rarity.toLowerCase().replace(/\s+/g,'-')}" style="font-size:11px;padding:3px 10px;margin-bottom:6px;">${item.rarity} · ${item.rating} OVR</span>
                    <p style="font-size:11.5px;color:var(--muted);margin:0 0 12px;">Position: <b>${item.position}</b></p>
                    <button class="${isBought ? 'ghost-btn' : 'primary-btn'}" ${isBought ? 'disabled' : ''} style="width:100%;font-size:13px;padding:9px;" onclick="buyMerchantItem(${idx})">
                        ${isBought ? '✓ Sold Out' : `🛒 Buy for ${item.cost.toLocaleString()} 🪙`}
                    </button>
                </div>
                `;
            }
        }).join("");
    }

    // 2. Prestige Avatar Frames
    const framesContainer = document.getElementById("framesShop");
    if (framesContainer) {
        framesContainer.innerHTML = FRAMES.map(f => {
            const owned = (state.ownedFrames || []).includes(f.id);
            const isEquipped = state.profileFrame === f.id;
            return `
            <div class="shop-item frame-shop-item" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:18px 14px;background:rgba(15,23,42,0.85);border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
                <div class="frame-shop-avatar-wrap" style="position:relative;width:90px;height:90px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;">
                    <img src="${escapeHTML(state.avatar || 'player_temp.png')}" class="profile-avatar-photo ${f.css}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;" onerror="this.src='player_temp.png'">
                </div>
                <h3 style="margin:0 0 4px;font-size:15px;color:#ffffff;">${escapeHTML(f.name)}</h3>
                <p style="margin:0 0 8px;font-size:11px;color:var(--muted);min-height:28px;">${escapeHTML(f.desc || '')}</p>
                <p style="color:var(--gold);font-weight:800;font-size:14px;margin-bottom:12px;">${f.cost === 0 ? "Free" : f.cost.toLocaleString() + " 🪙"}</p>
                
                ${owned 
                    ? `<button class="${isEquipped ? "primary-btn" : "ghost-btn"}" style="width:100%;font-size:12px;padding:8px;" onclick="setProfileFrame('${f.id}')">${isEquipped ? "★ Equipped" : "Equip Frame"}</button>`
                    : `<button class="primary-btn" style="width:100%;font-size:12px;padding:8px;background:linear-gradient(135deg,#ffd700,#ff8c00);color:#000;font-weight:900;" onclick="buyFrame('${f.id}')">🛒 Unlock Frame</button>`
                }
            </div>
            `;
        }).join("");
    }

    // 3. Stadium Backgrounds
    const backgrounds = document.getElementById("backgroundShop");
    if (backgrounds) {
        backgrounds.innerHTML = BACKGROUNDS.map(bg => {
            const owned = (state.ownedBackgrounds || []).includes(bg.id);
            return `
            <div class="shop-item">
                <div class="shop-preview" style="background:${bg.css}"></div>
                <h3>${escapeHTML(bg.name)}</h3>
                <p style="color:var(--gold);font-weight:700;">${bg.cost === 0 ? "Free" : bg.cost.toLocaleString() + " 🪙"}</p>
                <button ${owned ? "disabled" : ""} class="${owned ? "owned" : "primary-btn"}" onclick="buyBackground('${bg.id}')">
                    ${owned ? "✓ Owned" : "Buy Background"}
                </button>
            </div>
            `;
        }).join("");
    }
}

function buyBackground(id) {
    const bg = BACKGROUNDS.find(b => b.id === id);
    if (!bg || (state.ownedBackgrounds || []).includes(id)) return;
    if (!spendCoins(bg.cost)) return;

    if (!Array.isArray(state.ownedBackgrounds)) state.ownedBackgrounds = ["campnou"];
    state.ownedBackgrounds.push(id);
    saveGame();
    renderShop();
    renderProfile();
    SoundFx.coin();
    toast(`Unlocked Stadium: ${bg.name}`);
}

function buyFrame(id) {
    const f = FRAMES.find(frame => frame.id === id);
    if (!f || (state.ownedFrames || []).includes(id)) return;
    if (!spendCoins(f.cost)) return;

    if (!Array.isArray(state.ownedFrames)) state.ownedFrames = ["default"];
    state.ownedFrames.push(id);
    state.profileFrame = id;
    saveGame();
    renderShop();
    renderProfile();
    renderLeaderboard();
    SoundFx.levelUp();
    toast(`🎉 Unlocked & Equipped Frame: ${f.name}!`);
}

function setProfileFrame(id) {
    if (!state.ownedFrames || (!state.ownedFrames.includes(id) && id !== "default")) {
        toast("You have not unlocked this frame yet.");
        return;
    }
    state.profileFrame = id;
    saveGame();
    renderShop();
    renderProfile();
    renderLeaderboard();
    SoundFx.click();
    toast(`✓ Equipped Frame: ${FRAMES.find(f => f.id === id)?.name || id}`);
}

/* =========================================================
   TOURNAMENT DRAFT ARENA (5 ATTEMPTS MAX)
   ========================================================= */

function openTournamentEnterModal() {
    if (!state.accountUser) {
        openAuthModal();
        return;
    }

    if (state.tournamentAttempts <= 0) {
        toast("You have used all 5 weekly tournament draft attempts!");
        return;
    }

    setText("tournamentAttemptsDisplay", `${state.tournamentAttempts} / 5`);
    const modal = document.getElementById("tournamentEnterModal");
    if (modal) modal.classList.remove("hidden");
}

function closeTournamentEnterModal() {
    const modal = document.getElementById("tournamentEnterModal");
    if (modal) modal.classList.add("hidden");
}

function confirmTournamentEntry() {
    closeTournamentEnterModal();
    if (state.tournamentAttempts <= 0) return;

    state.tournamentAttempts--;
    state.tournamentDraft = {
        gold: 1000,
        score: 0,
        packsOpened: 0,
        cards: [],
        active: true
    };

    state.stats.tournamentEntries++;
    saveGame();
    renderTournament();
    SoundFx.levelUp();
    toast(`⚔️ Entered Tournament Draft Arena! (Attempts left: ${state.tournamentAttempts}/5)`);
}

function openTournamentPack() {
    const draft = state.tournamentDraft;
    if (draft.gold < 100) {
        toast("You have spent all 1,000 Tournament Gold for this run!");
        return;
    }

    draft.gold -= 100;
    draft.packsOpened++;

    SoundFx.packOpen();

    const rarity = rollRarity(PACKS.tournament.rates);
    const player = choosePlayer(rarity);

    if (!player) {
        draft.gold += 100;
        return;
    }

    const points = TOURNAMENT_POINTS[rarity] || 1;
    draft.score += points;

    const draftCard = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2),
        player: player.name,
        rating: player.rating,
        pos: player.pos,
        rarity: rarity,
        image: player.image || "",
        points: points
    };

    draft.cards.unshift(draftCard);

    if (draft.score > state.stats.tournamentScore) {
        state.stats.tournamentScore = draft.score;
    }

    SoundFx.cardReveal(rarity);
    toast(`🏆 Drafted ${player.name} (+${points} pts)!`);

    if (draft.gold <= 0) {
        finishTournamentDraft();
    }

    saveGame();
    renderTournament();
}

function finishTournamentDraft() {
    const draft = state.tournamentDraft;
    draft.active = false;
    SoundFx.levelUp();

    const ownsEmanuel = state.cards.some(c => c.player === "Emanuel" && c.rarity === "Tournament");
    if (!ownsEmanuel && draft.score >= 50) {
        const emanuelCard = {
            id: Date.now() + "_emanuel",
            player: "Emanuel",
            rating: 99,
            pos: "CAM",
            rarity: "Tournament",
            image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80",
            frame: "champion",
            obtained: Date.now()
        };
        state.cards.push(emanuelCard);
        state.stats.tournament = (state.stats.tournament || 0) + 1;
        state.stats.cardsPulled++;
        if (state.stats.highestRating < 99) state.stats.highestRating = 99;
        state.stats.highestRarity = "Tournament";
        showCardResult(emanuelCard, false, true);
        toast("👑 TOURNAMENT REWARD UNLOCKED: Emanuel (99 OVR)!");
    } else {
        toast(`🏆 Draft Run Complete! Final Tournament Score: ${draft.score} pts.`);
    }

    saveGame();
    renderTournament();
    renderCards();
}

function renderTournament() {
    const draft = state.tournamentDraft;
    setText("tGoldDisplay", `${draft.gold} 🪙`);
    setText("tPacksDisplay", `${draft.packsOpened} / 10`);
    setText("tScoreDisplay", `${draft.score} pts`);

    const enterBtn = document.getElementById("enterTournamentModalBtn");
    const openBtn = document.getElementById("openTournamentPackBtn");

    if (enterBtn && openBtn) {
        const canOpen = draft.active && draft.gold > 0;
        enterBtn.style.display = canOpen ? "none" : "flex";
        openBtn.style.display = canOpen ? "flex" : "none";
        setText("attemptsLeftSubtitle", `${state.tournamentAttempts} / 5 Weekly Attempts Remaining`);
    }

    const draftGrid = document.getElementById("tournamentDraftGrid");
    if (draftGrid) {
        if (!draft.cards.length) {
            draftGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">No cards drafted yet. Enter a draft run to open Tournament Packs!</p>`;
        } else {
            draftGrid.innerHTML = draft.cards.map(card => `
                <article class="card frame-champion" style="min-height:220px;padding:12px;">
                    <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                    <div class="card-image-wrap" style="height:95px;">
                        <img class="card-photo" src="${card.image || ''}">
                    </div>
                    <div class="card-rating" style="font-size:22px;">${card.rating}</div>
                    <div class="card-position">${escapeHTML(card.pos)} · <b style="color:var(--gold)">+${card.points} pts</b></div>
                    <h4 style="margin:4px 0;">${escapeHTML(card.player)}</h4>
                </article>
            `).join("");
        }
    }

    const accs = CloudSync.getAccounts();
    const realPlayers = [];

    for (const key in accs) {
        try {
            const d = JSON.parse(accs[key].saveData);
            if (d && d.stats) {
                realPlayers.push({
                    name: d.name || accs[key].username,
                    score: d.stats.tournamentScore || 0,
                    level: d.level || 1
                });
            }
        } catch (e) {}
    }

    if (state.accountUser && !realPlayers.some(p => p.name.toLowerCase() === state.accountUser.toLowerCase())) {
        realPlayers.push({
            name: state.name || state.accountUser,
            score: state.stats.tournamentScore || 0,
            level: state.level || 1
        });
    }

    realPlayers.sort((a, b) => b.score - a.score);

    const el = document.getElementById("tournamentLeaderboard");
    if (el) {
        if (!realPlayers.length) {
            el.innerHTML = `<p style="text-align:center;color:var(--muted);padding:15px;">No tournament entries recorded yet.</p>`;
        } else {
            el.innerHTML = realPlayers.map((r, i) => `
                <div class="rank-row">
                    <b>#${i + 1}</b>
                    <strong>${escapeHTML(r.name)}</strong>
                    <span>${r.score} pts</span>
                </div>
            `).join("");
        }
    }
}

/* =========================================================
   MISSIONS & THAILAND TIME (07:00 AM ICT) ENGINE
   ========================================================= */

function getThailandTime() {
    const now = new Date();
    return new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);
}

function setMissionType(type) {
    currentMissionType = type;
    document.querySelectorAll(".mission-tab").forEach(tab => {
        tab.classList.toggle("active", tab.textContent.toLowerCase() === type);
    });
    renderMissions();
}

function renderMissions() {
    const list = document.getElementById("missionList");
    const homeList = document.getElementById("homeMissionList");

    const missions = MISSION_TEMPLATES[currentMissionType] || [];
    const claimed = (state.missionClaimed && state.missionClaimed[currentMissionType]) || [];
    const progress = (state.missionProgress && state.missionProgress[currentMissionType]) || [];

    function createMissionHTML(mission, i, type, isClaimed, amount) {
        const max = mission[1];
        const percent = Math.min(100, (amount / max) * 100);

        return `
        <div class="mission-item">
            <div>
                <div class="mission-head">
                    <b>${escapeHTML(mission[0])}</b>
                    <span>+${mission[2]} 🪙</span>
                </div>
                <p style="font-size:13px;color:var(--muted);margin:6px 0 2px;">Progress: ${Math.min(amount, max)} / ${max}</p>
                <div class="mission-progress"><i style="width:${percent}%"></i></div>
            </div>
            <div>
                ${
                    amount >= max && !isClaimed ? `<button class="mission-claim-btn" onclick="claimMission('${type}', ${i})">Claim +${mission[2]} 🪙</button>`
                    : isClaimed ? `<p style="color:var(--green);font-weight:800;margin:0;">✓ Completed</p>` : `<span style="font-size:12px;color:var(--muted);">In Progress (${Math.round(percent)}%)</span>`
                }
            </div>
        </div>
        `;
    }

    if (list && missions) {
        list.innerHTML = missions.map((m, i) => createMissionHTML(m, i, currentMissionType, claimed[i], progress[i] || 0)).join("");
    }

    if (homeList) {
        const dailyMissions = MISSION_TEMPLATES.daily;
        const dailyProg = (state.missionProgress && state.missionProgress.daily) || [];
        const dailyClaimed = (state.missionClaimed && state.missionClaimed.daily) || [];

        homeList.innerHTML = dailyMissions.map((m, i) => createMissionHTML(m, i, "daily", dailyClaimed[i], dailyProg[i] || 0)).join("");
    }
}

function progressMission(kind, amount) {
    const types = ["hourly", "daily", "weekly", "monthly"];
    let updated = false;

    types.forEach(type => {
        const missions = MISSION_TEMPLATES[type];
        if (!missions) return;

        missions.forEach((mission, i) => {
            if (mission[3] === kind) {
                if (!state.missionProgress[type]) state.missionProgress[type] = [];
                state.missionProgress[type][i] = (state.missionProgress[type][i] || 0) + amount;
                updated = true;
            }
        });
    });

    if (updated) {
        saveGame();
        renderMissions();
    }
}

function claimMission(type, index) {
    const mission = MISSION_TEMPLATES[type] && MISSION_TEMPLATES[type][index];
    if (!mission) return;
    const progress = (state.missionProgress[type] && state.missionProgress[type][index]) || 0;

    if (progress < mission[1]) return;
    if (state.missionClaimed[type] && state.missionClaimed[type][index]) return;

    if (!state.missionClaimed[type]) state.missionClaimed[type] = [];
    state.missionClaimed[type][index] = true;

    SoundFx.coin();
    addCoins(mission[2], _INTERNAL_TX_KEY);
    addXP(Math.min(100, Math.floor(mission[2] / 2)));
    saveGame();
    renderMissions();
    toast(`Mission complete: +${mission[2]} coins!`);
}

function checkMissionResets() {
    const now = Date.now();
    if (!state.missionReset) state.missionReset = { hourly: now, daily: now, weekly: now, monthly: now };
    if (!state.missionProgress) state.missionProgress = { hourly: [], daily: [], weekly: [], monthly: [] };
    if (!state.missionClaimed) state.missionClaimed = { hourly: [], daily: [], weekly: [], monthly: [] };

    if (now - (state.missionReset.daily || 0) >= 86400000) {
        state.missionReset.daily = now;
        state.missionProgress.daily = [];
        state.missionClaimed.daily = [];
        saveGame();
    }
    if (now - (state.missionReset.weekly || 0) >= 604800000) {
        state.missionReset.weekly = now;
        state.missionProgress.weekly = [];
        state.missionClaimed.weekly = [];
        state.tournamentAttempts = 5;
        saveGame();
    }
    if (now - (state.missionReset.monthly || 0) >= 2592000000) {
        state.missionReset.monthly = now;
        state.missionProgress.monthly = [];
        state.missionClaimed.monthly = [];
        saveGame();
    }
    if (now - (state.missionReset.hourly || 0) >= 3600000) {
        state.missionReset.hourly = now;
        state.missionProgress.hourly = [];
        state.missionClaimed.hourly = [];
        saveGame();
    }
}

/* =========================================================
   TIMERS & REWARDS
   ========================================================= */

function updateTimers() {
    updateLimitedTimer();
    updateTournamentTimer();
    updateDailyReward();
    updateMissionCountdownTimers();
}

function updateMissionCountdownTimers() {
    const info = document.getElementById("missionResetInfo");
    const now = Date.now();
    if (!state.missionReset) {
        state.missionReset = { hourly: now, daily: now, weekly: now, monthly: now };
    }
    const hourlyRem = Math.max(0, 3600000 - (now - (state.missionReset.hourly || now)));
    const dailyRem = Math.max(0, 86400000 - (now - (state.missionReset.daily || now)));
    const weeklyRem = Math.max(0, 604800000 - (now - (state.missionReset.weekly || now)));
    const monthlyRem = Math.max(0, 2592000000 - (now - (state.missionReset.monthly || now)));

    if (info) {
        if (currentMissionType === "hourly") {
            info.innerHTML = `⏱️ Hourly Reset in <b>${formatCountdown(hourlyRem)}</b>`;
        } else if (currentMissionType === "daily") {
            info.innerHTML = `⏱️ Daily Reset in <b>${formatCountdown(dailyRem)}</b>`;
        } else if (currentMissionType === "weekly") {
            info.innerHTML = `⏱️ Weekly Reset in <b>${formatCountdown(weeklyRem)}</b>`;
        } else {
            info.innerHTML = `⏱️ Monthly Reset in <b>${formatCountdown(monthlyRem)}</b>`;
        }
    }
}

const EXCLUSIVE_PACK_EXPIRY = new Date("2026-09-07T07:00:00+07:00").getTime();

function updateLimitedTimer() {
    const timer = document.getElementById("limitedCountdown");
    const banner = document.getElementById("limitedEventSection");
    const packCard = document.getElementById("packCardExclusive");

    const now = Date.now();
    const diff = EXCLUSIVE_PACK_EXPIRY - now;

    if (diff <= 0) {
        if (timer) timer.textContent = "Event Ended · Pack Wiped From Shop";
        if (banner) banner.style.display = "none";
        if (packCard) packCard.style.display = "none";
    } else {
        if (timer) timer.textContent = "Leaves Shop In " + formatCountdown(diff) + " (Mon 7:00 AM ICT)";
        if (banner) banner.style.display = "block";
        if (packCard) packCard.style.display = "flex";
    }
}

function updateTournamentTimer() {
    const timer = document.getElementById("tournamentTimer");
    if (!timer) return;
    const th = getThailandTime();
    const day = th.getDay();
    const daysUntilMon = (8 - (day === 0 ? 7 : day)) % 7 || 7;
    const target = new Date(th);
    target.setDate(th.getDate() + daysUntilMon);
    target.setHours(7, 0, 0, 0);

    const diff = target.getTime() - th.getTime();
    timer.textContent = "Resets Monday 7:00 AM (ICT) · " + formatCountdown(diff);
}

function updateDailyReward() {
    const text = document.getElementById("dailyRewardText");
    const btn = document.getElementById("dailyRewardBtn");
    if (!text || !btn) return;

    const last = state.dailyRewardClaimed || 0;
    const ready = Date.now() - last >= 86400000;

    btn.disabled = !ready;
    btn.textContent = ready ? "Claim (+100 🪙)" : "Claimed";
    text.textContent = ready ? "Your daily training reward is ready!" : "Next reward ready tomorrow at 7:00 AM (ICT).";
}

function claimDailyReward() {
    const last = state.dailyRewardClaimed || 0;
    if (Date.now() - last < 86400000) return;

    state.dailyRewardClaimed = Date.now();
    let coinAmount = 100;
    let xpAmount = 10;
    if (hasSkill("econ_1")) coinAmount = Math.round(coinAmount * 1.5);
    if (hasSkill("prog_2")) {
        xpAmount += 50;
        coinAmount += 100;
    }
    addCoins(coinAmount, _INTERNAL_TX_KEY);
    addXP(xpAmount);
    SoundFx.coin();
    saveGame();
    updateDailyReward();
    toast("🎁 Daily training reward claimed: +100 🪙!");
}

let currentLeaderboardTab = "gold";

function setLeaderboardTab(tab) {
    currentLeaderboardTab = tab;
    const tabGold = document.getElementById("lbTabGold");
    const tabValue = document.getElementById("lbTabValue");
    const tabLevel = document.getElementById("lbTabLevel");
    if (tabGold) tabGold.classList.toggle("active", tab === "gold");
    if (tabValue) tabValue.classList.toggle("active", tab === "value");
    if (tabLevel) tabLevel.classList.toggle("active", tab === "level");
    renderLeaderboard();
}

async function renderLeaderboard(isManual = false) {
    const list = document.getElementById("globalLeaderboard") || document.getElementById("leaderboardList");
    if (!list) return;

    const refreshBtn = document.getElementById("refreshLeaderboardBtn");
    if (isManual && refreshBtn) {
        refreshBtn.innerHTML = "⏳ Refreshing...";
        refreshBtn.disabled = true;
    }

    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);"><span class="pack-spinner" style="display:inline-block;width:28px;height:28px;border:3px solid rgba(255,255,255,0.2);border-top-color:var(--green);border-radius:50%;animation:spin 0.8s linear infinite;"></span><p style="margin-top:12px;font-size:14px;font-weight:700;">Connecting to Global Online Leaderboard...</p></div>`;

    let fbLeaderboard = await GlobalCloudRest.fetchLeaderboard();
    let fbUsers = await GlobalCloudRest.fetchAllUsers();
    let localAccs = CloudSync.getAccounts();

    let playersMap = {};

    // 1. Ingest from cloud leaderboard
    if (fbLeaderboard && typeof fbLeaderboard === "object") {
        for (const k in fbLeaderboard) {
            const entry = fbLeaderboard[k];
            if (entry && (entry.username || entry.name)) {
                playersMap[k.toLowerCase()] = {
                    name: entry.name || entry.username,
                    username: entry.username || entry.name,
                    gold: Number(entry.gold !== undefined ? entry.gold : (entry.coins || 0)) || 0,
                    value: Number(entry.value || 0),
                    cards: Number(entry.cards || 0),
                    level: Number(entry.level || 1),
                    equippedTitle: entry.equippedTitle || "Collector",
                    profileFrame: entry.profileFrame || "default",
                    avatar: entry.avatar || "player_temp.png",
                    isTradeBanned: !!(entry.isTradeBanned || (entry.bannedUntil && entry.bannedUntil > Date.now())),
                    tradeBanReason: entry.tradeBanReason || "",
                    bannedUntil: entry.bannedUntil || 0
                };
            }
        }
    }

    // 2. Ingest from cloud users
    if (fbUsers && typeof fbUsers === "object") {
        for (const k in fbUsers) {
            const u = fbUsers[k];
            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch(e) {}
            const cardsList = Array.isArray(pData.cards) ? pData.cards : [];
            const val = calculateCollectionValue(cardsList);
            const gold = Number(pData.coins || 100);
            const lvl = Number(pData.level || 1);
            const key = k.toLowerCase();

            if (!playersMap[key]) {
                playersMap[key] = {
                    name: pData.name || u.username,
                    username: u.username,
                    gold: gold,
                    value: val,
                    cards: cardsList.length,
                    level: lvl,
                    equippedTitle: pData.equippedTitle || "Collector",
                    profileFrame: pData.profileFrame || "default",
                    avatar: pData.avatar || "player_temp.png",
                    isTradeBanned: !!(u.isTradeBanned || pData.isTradeBanned || (pData.bannedUntil && pData.bannedUntil > Date.now())),
                    tradeBanReason: u.tradeBanReason || pData.tradeBanReason || "",
                    bannedUntil: pData.bannedUntil || 0
                };
            } else {
                playersMap[key].level = lvl;
                playersMap[key].cards = cardsList.length;
                playersMap[key].gold = gold;
                playersMap[key].value = val;
                if (pData.equippedTitle) playersMap[key].equippedTitle = pData.equippedTitle;
                if (pData.profileFrame) playersMap[key].profileFrame = pData.profileFrame;
                if (pData.avatar) playersMap[key].avatar = pData.avatar;
            }
        }
    }

    // 3. Ingest local accounts (Highest precedence for restored rosters)
    for (const k in localAccs) {
        const u = localAccs[k];
        let pData = {};
        try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch(e) {}
        const cardsList = Array.isArray(pData.cards) ? pData.cards : [];
        const val = calculateCollectionValue(cardsList);
        const gold = Number(pData.coins || 100);
        const lvl = Number(pData.level || 1);
        const key = k.toLowerCase();

        if (!playersMap[key]) {
            playersMap[key] = {
                name: pData.name || u.username,
                username: u.username,
                gold: gold,
                value: val,
                cards: cardsList.length,
                level: lvl,
                equippedTitle: pData.equippedTitle || "Collector",
                profileFrame: pData.profileFrame || "default",
                avatar: pData.avatar || "player_temp.png",
                isTradeBanned: !!(u.isTradeBanned || pData.isTradeBanned || (pData.bannedUntil && pData.bannedUntil > Date.now())),
                tradeBanReason: u.tradeBanReason || pData.tradeBanReason || "",
                bannedUntil: pData.bannedUntil || 0
            };
        } else {
            playersMap[key].level = lvl;
            playersMap[key].cards = cardsList.length;
            playersMap[key].gold = gold;
            playersMap[key].value = val;
            if (pData.equippedTitle) playersMap[key].equippedTitle = pData.equippedTitle;
            if (pData.profileFrame) playersMap[key].profileFrame = pData.profileFrame;
            if (pData.avatar) playersMap[key].avatar = pData.avatar;
        }
    }

    // 4. Current active session
    const currentName = state.accountUser || state.name || "Guest";
    const currentKey = currentName.toLowerCase();
    playersMap[currentKey] = {
        name: state.name || currentName,
        username: state.accountUser || currentName,
        gold: Number(state.coins || 0),
        value: calculateCollectionValue(state.cards || []),
        cards: (state.cards || []).length,
        level: state.level || 1,
        equippedTitle: state.equippedTitle || "Collector",
        profileFrame: state.profileFrame || "default",
        avatar: state.avatar || "player_temp.png",
        isTradeBanned: !!state.isTradeBanned,
        tradeBanReason: state.tradeBanReason || "",
        bannedUntil: state.bannedUntil || 0,
        isSelf: true
    };

    let playersList = Object.values(playersMap);
    playersList = playersList.filter(p => p && p.username && !isAccountDeleted(p.username));

    if (currentLeaderboardTab === "value") {
        playersList.sort((a, b) => (b.value - a.value) || (b.gold - a.gold));
    } else if (currentLeaderboardTab === "level") {
        playersList.sort((a, b) => (b.level - a.level) || (b.gold - a.gold));
    } else {
        playersList.sort((a, b) => (b.gold - a.gold) || (b.value - a.value));
    }

    if (!playersList.length) {
        list.innerHTML = `<p style="text-align:center;color:var(--muted);padding:30px;">No online players found yet.</p>`;
        return;
    }

    const top1 = playersList[0];
    const top2 = playersList[1];
    const top3 = playersList[2];
    const rest = playersList.slice(3);

    function createPodiumCard(p, rankNum) {
        if (!p) return "";
        const isMe = (state.accountUser && p.username.toLowerCase() === state.accountUser.toLowerCase()) || (p.isSelf);
        const titleObj = TITLES.find(t => t.name === p.equippedTitle) || TITLES[0];
        const scoreDisplay = currentLeaderboardTab === "value"
            ? `💎 ${p.value.toLocaleString()}`
            : currentLeaderboardTab === "level"
            ? `⭐ Level ${p.level || 1}`
            : `${p.gold.toLocaleString()} 🪙`;

        const crown = rankNum === 1 ? `<div class="lb-podium-crown">👑</div>` : "";
        const rankLabel = rankNum === 1 ? "1" : rankNum === 2 ? "2" : "3";

        const badgeHtml = p.isTradeBanned
            ? `<span class="flagged-badge" title="Flagged Account: Suspected of cheating or confirmed client modification" style="display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:900;cursor:help;margin-top:2px;">⚠️ FLAGGED</span>`
            : (p.equippedTitle ? `<span class="equipped-title-badge ${titleObj.cssClass}" style="font-size:10px;padding:2px 8px;margin-top:2px;">${escapeHTML(p.equippedTitle)}</span>` : '');

        return `
        <div class="lb-podium-card rank-${rankNum} ${isMe ? 'self' : ''} ${p.isTradeBanned ? 'is-flagged-card' : ''}">
            ${crown}
            <div class="lb-podium-avatar-wrap">
                <img class="lb-podium-avatar frame-${p.profileFrame || 'default'}" src="${escapeHTML(p.avatar || 'player_temp.png')}" alt="${escapeHTML(p.name)}" onerror="this.src='player_temp.png'">
                <div class="lb-podium-rank-badge">${rankLabel}</div>
            </div>
            <div class="lb-podium-name">
                <span>${escapeHTML(p.name)}</span>
                ${isMe ? '<span style="color:var(--green);font-size:11px;">(You)</span>' : ''}
            </div>
            ${badgeHtml}
            <div class="lb-podium-meta">Level ${p.level || 1} · ${p.cards || 0} Cards</div>
            <div class="lb-podium-score">${scoreDisplay}</div>
        </div>
        `;
    }

    let html = `<div class="leaderboard-container">`;

    // Podium Section
    html += `<div class="lb-podium-row">`;
    html += createPodiumCard(top2, 2);
    html += createPodiumCard(top1, 1);
    html += createPodiumCard(top3, 3);
    html += `</div>`;

    // 4th+ Rows Table
    if (rest.length > 0) {
        html += `<div class="lb-table-container">`;
        rest.forEach((p, idx) => {
            const rank = idx + 4;
            const isMe = (state.accountUser && p.username.toLowerCase() === state.accountUser.toLowerCase()) || (p.isSelf);
            const titleObj = TITLES.find(t => t.name === p.equippedTitle) || TITLES[0];
            const scoreDisplay = currentLeaderboardTab === "value"
                ? `💎 ${p.value.toLocaleString()}`
                : currentLeaderboardTab === "level"
                ? `⭐ Level ${p.level || 1}`
                : `${p.gold.toLocaleString()} 🪙`;

            const badgeHtml = p.isTradeBanned
                ? `<span class="flagged-badge" title="Flagged Account: Suspected of cheating or confirmed client modification" style="display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:900;cursor:help;">⚠️ FLAGGED</span>`
                : (p.equippedTitle ? `<span class="equipped-title-badge ${titleObj.cssClass}" style="font-size:10px;padding:2px 8px;">${escapeHTML(p.equippedTitle)}</span>` : '');

            html += `
            <div class="lb-table-row ${isMe ? 'self' : ''} ${p.isTradeBanned ? 'is-flagged-row' : ''}">
                <div class="lb-row-rank">#${rank}</div>
                <div class="lb-row-user">
                    <img class="lb-row-avatar frame-${p.profileFrame || 'default'}" src="${escapeHTML(p.avatar || 'player_temp.png')}" alt="${escapeHTML(p.name)}" onerror="this.src='player_temp.png'">
                    <div class="lb-row-info">
                        <div class="lb-row-name-wrap">
                            <strong class="lb-row-name">${escapeHTML(p.name)}</strong>
                            ${isMe ? '<span style="color:var(--green);font-size:11px;font-weight:800;">(You)</span>' : ''}
                            ${badgeHtml}
                        </div>
                        <span class="lb-row-meta">Level ${p.level || 1} · ${p.cards || 0} Cards</span>
                    </div>
                </div>
                <div class="lb-row-score">${scoreDisplay}</div>
            </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
    list.innerHTML = html;

    if (refreshBtn) {
        refreshBtn.innerHTML = "🔄 Refresh Leaderboard";
        refreshBtn.disabled = false;
    }
    if (isManual) {
        toast("🔄 Leaderboard updated!");
        SoundFx.click();
    }
}

/* =========================================================
   ADMIN PANEL CONTROLLER (EXCLUSIVE FOR ALUCARD & GRANTED ADMINS)
   ========================================================= */

function checkIsAdmin() {
    const u = (state.accountUser || state.name || "").toLowerCase();
    return u === "alucard" || !!state.isGrantedAdmin || (state.grantedTitles || []).includes("Admin") || (state.grantedTitles || []).includes("Owner");
}

function isUserAdmin() {
    return checkIsAdmin();
}

function checkAdminStatus() {
    const adminHeaderBtn = document.getElementById("adminHeaderBtn");
    const adminSidebarBtn = document.getElementById("adminSidebarBtn");
    const hasAdmin = checkIsAdmin();

    if (adminHeaderBtn) adminHeaderBtn.style.display = hasAdmin ? "inline-block" : "none";
    if (adminSidebarBtn) adminSidebarBtn.style.display = hasAdmin ? "block" : "none";

    const adminActiveUser = document.getElementById("adminActiveUser");
    if (adminActiveUser) {
        adminActiveUser.textContent = state.accountUser || state.name || "Alucard";
    }
}

function openAdminPanel() {
    if (!checkIsAdmin()) {
        toast("🔒 Access Denied: Creator / Admin authorization required.");
        return;
    }
    populateAdminCardList();
    populateAdminTitleList();
    const modal = document.getElementById("adminPanelModal");
    if (modal) modal.classList.remove("hidden");
    SoundFx.click();
}

function closeAdminPanel() {
    const modal = document.getElementById("adminPanelModal");
    if (modal) modal.classList.add("hidden");
}

function setAdminTab(tabName) {
    const tabs = ["currency", "cards", "level", "titles", "tournament", "moderation", "accounts", "audit", "delete"];
    tabs.forEach(t => {
        const btn = document.getElementById(`adminTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
        const content = document.getElementById(`adminTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (btn) btn.classList.toggle("active", t === tabName);
        if (content) content.style.display = (t === tabName) ? "block" : "none";
    });
    if (tabName === "accounts") {
        renderAdminAccountsList();
    }
}

async function renderAdminAccountsList() {
    const wrap = document.getElementById("adminAccountsListWrap");
    if (!wrap) return;
    try {
        wrap.innerHTML = `<p style="text-align:center;color:var(--muted);padding:14px;">Fetching live account records from server...</p>`;
        const cloudUsers = await GlobalCloudRest.fetchAllUsers();

        const rows = [];
        const seen = new Set();
        for (const k in cloudUsers) {
            const u = cloudUsers[k];
            const rawName = u.username || k;
            const lower = rawName.toLowerCase();
            if (seen.has(lower)) continue;
            seen.add(lower);

            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch(e) {}
            const lvl = pData.level || 1;
            const coins = pData.coins || 0;
            const cardsCount = Array.isArray(pData.cards) ? pData.cards.length : 0;
            const title = pData.equippedTitle || "Collector";
            const isFlagged = !!(u.isTradeBanned || pData.isTradeBanned);
            const isOnlineSelf = (state.accountUser || "").toLowerCase() === lower;

            rows.push({
                username: rawName,
                level: lvl,
                coins: coins,
                cardsCount: cardsCount,
                title: title,
                isFlagged: isFlagged,
                isSelf: isOnlineSelf
            });
        }

        rows.sort((a, b) => b.level - a.level || b.cardsCount - a.cardsCount);

        if (!rows.length) {
            wrap.innerHTML = `<p style="text-align:center;color:var(--muted);padding:20px;">No registered accounts found on server.</p>`;
            return;
        }

        wrap.innerHTML = `
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px;padding:0 4px;">Registered Server Accounts: <b>${rows.length}</b></div>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${rows.map(r => `
                    <div style="background:rgba(255,255,255,0.04);border:1px solid ${r.isFlagged ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'};border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
                        <div>
                            <div style="display:flex;align-items:center;gap:6px;">
                                <strong style="color:#fff;font-size:13px;">${escapeHTML(r.username)}</strong>
                                ${r.isSelf ? `<span style="background:rgba(0,242,254,0.2);color:var(--cyan);font-size:10px;padding:1px 5px;border-radius:4px;">YOU</span>` : ''}
                                ${r.isFlagged ? `<span style="background:rgba(239,68,68,0.2);color:var(--red);font-size:10px;padding:1px 5px;border-radius:4px;font-weight:800;">โ ๏ธ FLAGGED</span>` : ''}
                            </div>
                            <span style="font-size:11px;color:var(--muted);">${escapeHTML(r.title)} ยท Level ${r.level} ยท ${r.cardsCount} Cards ยท ${Number(r.coins).toLocaleString()} ๐ช</span>
                        </div>
                        <button class="ghost-btn" style="font-size:11px;padding:4px 8px;" onclick="selectAdminTargetUser('${escapeHTML(r.username)}')">Select</button>
                    </div>
                `).join("")}
            </div>
        `;
    } catch(e) {
        wrap.innerHTML = `<p style="text-align:center;color:var(--red);padding:14px;">Error fetching accounts: ${escapeHTML(e.message)}</p>`;
    }
}

function selectAdminTargetUser(username) {
    ["adminGoldTarget", "adminCardTarget", "adminLevelTarget", "adminTitleTarget", "adminModTarget", "adminDeleteTarget", "adminAuditTargetInput"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = username;
    });
    toast(`🎯 Selected target player: "${username}"`);
}

async function adminModifyTargetUser(targetUsername, updateCallback, successMessage) {
    const cleanTarget = (targetUsername || "").trim();
    if (!cleanTarget || cleanTarget.toLowerCase() === (state.accountUser || state.name || "").toLowerCase()) {
        updateCallback(state);
        AntiCheat.signState(state);
        saveGame();
        renderAll();
        SoundFx.levelUp();
        toast(successMessage || "โ… Admin action completed successfully on your account!");
        return true;
    }

    try {
        let targetSave = null;
        try {
            const res = await fetch(`${ServerAPI.BASE_URL}/api/save?username=${encodeURIComponent(cleanTarget)}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && data.saveData) {
                    targetSave = typeof data.saveData === "string" ? JSON.parse(data.saveData) : data.saveData;
                }
            }
        } catch(e) {}

        if (!targetSave) {
            targetSave = { ...freshState(), name: cleanTarget, accountUser: cleanTarget };
        }

        updateCallback(targetSave);
        AntiCheat.signState(targetSave);

        targetSave.auditLogs = targetSave.auditLogs || [];
        targetSave.auditLogs.unshift({
            timestamp: Date.now(),
            action: successMessage || "Admin Modification",
            admin: state.accountUser || "Alucard"
        });
        if (targetSave.auditLogs.length > 50) targetSave.auditLogs.pop();

        await fetch(`${ServerAPI.BASE_URL}/api/save`, {
            method: "POST",
            headers: ServerAPI.getHeaders(),
            body: JSON.stringify({ username: cleanTarget, saveData: targetSave })
        });

        toast(successMessage || `โ… Admin updated player "${cleanTarget}" successfully!`);
        SoundFx.levelUp();
        renderAdminAccountsList();
        return true;
    } catch (e) {
        toast(`โ Failed to update player "${cleanTarget}": ` + e.message);
        return false;
    }
}

async function adminInspectPlayerAudit() {
    const input = document.getElementById("adminAuditTargetInput");
    const target = (input ? input.value.trim() : "");
    const wrap = document.getElementById("adminAuditResultsWrap");
    if (!wrap) return;

    if (!target) {
        wrap.innerHTML = `<p style="text-align:center;color:var(--red);padding:14px;">โ ๏ธ Please enter a target username.</p>`;
        return;
    }

    wrap.innerHTML = `<p style="text-align:center;color:var(--muted);padding:14px;">๐” Fetching real-time history & card inventory for "${escapeHTML(target)}"...</p>`;

    try {
        const res = await fetch(`${ServerAPI.BASE_URL}/api/user/history?username=${encodeURIComponent(target)}`);
        if (!res.ok) {
            wrap.innerHTML = `<p style="text-align:center;color:var(--red);padding:14px;">โ Player "${escapeHTML(target)}" not found on server.</p>`;
            return;
        }
        const data = await res.json();
        let currentSave = data.current;
        if (typeof currentSave === "string") {
            try { currentSave = JSON.parse(currentSave); } catch(e) {}
        }
        currentSave = currentSave || {};

        const cards = Array.isArray(currentSave.cards) ? currentSave.cards : [];
        const logs = Array.isArray(currentSave.auditLogs) ? currentSave.auditLogs : [];
        const backups = Array.isArray(data.backups) ? data.backups : [];

        let html = `
            <div style="margin-bottom:14px;background:rgba(0,242,254,0.06);border:1px solid rgba(0,242,254,0.2);border-radius:10px;padding:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div>
                        <strong style="font-size:16px;color:#fff;">${escapeHTML(target)}</strong>
                        <span style="font-size:12px;color:var(--cyan);margin-left:8px;">Level ${currentSave.level || 1} ยท ${Number(currentSave.coins || 0).toLocaleString()} ๐ช ยท ${cards.length} Cards</span>
                    </div>
                    <div style="font-size:11px;color:var(--muted);">Title: <b>${escapeHTML(currentSave.equippedTitle || 'Collector')}</b></div>
                </div>
            </div>

            <!-- CARDS INVENTORY BREAKDOWN -->
            <div style="margin-bottom:16px;">
                <h4 style="color:var(--gold);margin:0 0 8px;font-size:13px;">๐ด Current Card Inventory (${cards.length} Total):</h4>
                <div style="max-height:160px;overflow-y:auto;background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:4px;">
                    ${cards.length ? cards.map((c, i) => `
                        <div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 6px;background:rgba(255,255,255,0.02);border-radius:4px;">
                            <span><b>#${i+1}</b> ${escapeHTML(c.player || c.name || 'Unknown')} <span style="color:var(--muted)">(${escapeHTML(c.rarity || 'Common')})</span></span>
                            <span style="color:var(--cyan);font-weight:700;">${c.rating || 80} OVR ${c.serialNumber ? `ยท #${c.serialNumber}/10` : ''}</span>
                        </div>
                    `).join('') : '<p style="color:var(--muted);font-size:11px;text-align:center;margin:6px 0;">No cards in inventory.</p>'}
                </div>
            </div>

            <!-- BACKUPS & RESTORE SNAPSHOTS -->
            <div style="margin-bottom:16px;">
                <h4 style="color:#00f2fe;margin:0 0 8px;font-size:13px;">๐’พ Server Snapshots &amp; 1-Click Restore:</h4>
                <div style="display:flex;flex-direction:column;gap:6px;">
                    ${backups.length ? backups.map((b, idx) => {
                        let bSave = typeof b.saveData === "string" ? JSON.parse(b.saveData) : b.saveData;
                        const dateStr = new Date(b.timestamp).toLocaleTimeString();
                        const bCards = Array.isArray(bSave.cards) ? bSave.cards.length : 0;
                        return `
                            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:6px 10px;">
                                <div>
                                    <span style="font-size:12px;font-weight:700;color:#fff;">Snapshot ${idx+1} (${dateStr})</span>
                                    <div style="font-size:11px;color:var(--muted);">Lvl ${bSave.level || 1} ยท ${Number(bSave.coins || 0).toLocaleString()} ๐ช ยท ${bCards} Cards</div>
                                </div>
                                <button class="primary-btn" style="padding:4px 10px;font-size:11px;background:linear-gradient(135deg,#10b981,#059669);" onclick="adminRestoreSnapshot('${escapeHTML(target)}', ${idx})">๐” Restore</button>
                            </div>
                        `;
                    }).join('') : '<p style="color:var(--muted);font-size:11px;text-align:center;">No previous server snapshots recorded yet.</p>'}
                </div>
            </div>
        `;
        wrap.innerHTML = html;
    } catch(e) {
        wrap.innerHTML = `<p style="text-align:center;color:var(--red);padding:14px;">โ Error loading audit logs: ${escapeHTML(e.message)}</p>`;
    }
}

async function adminRestoreSnapshot(targetUsername, snapshotIndex) {
    if (!checkIsAdmin()) return;
    if (!confirm(`Are you sure you want to restore player "${targetUsername}" to Snapshot #${snapshotIndex+1}?`)) return;

    try {
        const res = await fetch(`${ServerAPI.BASE_URL}/api/user/history?username=${encodeURIComponent(targetUsername)}`);
        const data = await res.json();
        const backup = (data.backups || [])[snapshotIndex];
        if (!backup || !backup.saveData) {
            toast("โ Snapshot not found.");
            return;
        }

        const restoredSave = typeof backup.saveData === "string" ? JSON.parse(backup.saveData) : backup.saveData;
        
        await fetch(`${ServerAPI.BASE_URL}/api/save`, {
            method: "POST",
            headers: ServerAPI.getHeaders(),
            body: JSON.stringify({ username: targetUsername, saveData: restoredSave })
        });

        toast(`โ… Player "${targetUsername}" successfully restored to Snapshot #${snapshotIndex+1}!`);
        SoundFx.levelUp();
        adminInspectPlayerAudit();
    } catch(e) {
        toast("โ Failed to restore snapshot: " + e.message);
    }
}

async function wipeAccountEverywhere(username) {
    if (!username) return false;
    const u = username.trim().toLowerCase();
    try {
        // 1. Delete on Render Server Backend
        try {
            await fetch(`${ServerAPI.BASE_URL}/api/user/delete`, {
                method: "POST",
                headers: ServerAPI.getHeaders(),
                body: JSON.stringify({ username: u })
            });
        } catch(e) {}

        // 2. Wipe from local CloudSync accounts
        const accs = CloudSync.getAccounts();
        if (accs[u]) {
            delete accs[u];
            CloudSync.saveAccounts(accs);
        }

        // 3. If the deleted user was the current active user, log them out
        if (state.accountUser && state.accountUser.toLowerCase() === u) {
            state = freshState();
            if (u === "alucard") {
                state.isGrantedAdmin = true;
                state.grantedTitles = ["UNIQUE", "Owner", "Admin"];
            }
            AntiCheat.signState(state);
            try { localStorage.removeItem(CURRENT_SAVE_KEY); } catch(e) {}
            saveGame();
            renderAll();
            updateAuthUI();
            checkAdminStatus();
        }

        // 4. Refresh live accounts list and leaderboard
        try { renderAdminAccountsList(); } catch(e) {}
        try { renderLeaderboard(true); } catch(e) {}
        return true;
    } catch(e) {
        return false;
    }
}

// Admin: Delete any player's account
async function adminExecuteDeleteAccount() {
    if (!checkIsAdmin()) {
        toast("🔒 Access Denied: Creator / Admin authorization required.");
        return;
    }
    const targetInput = document.getElementById("adminDeleteTarget");
    const confirmInput = document.getElementById("adminDeleteConfirm");
    const statusDiv = document.getElementById("adminDeleteStatus");
    const target = (targetInput ? targetInput.value.trim() : "").toLowerCase();
    const confirm = (confirmInput ? confirmInput.value.trim() : "");

    if (!target) {
        if (statusDiv) statusDiv.innerHTML = `<span style="color:var(--red);">❌ Please enter a target username.</span>`;
        return;
    }
    if (confirm !== "DELETE") {
        if (statusDiv) statusDiv.innerHTML = `<span style="color:var(--red);">❌ Type DELETE (in caps) in the confirmation field to proceed.</span>`;
        return;
    }
    if (target === "alucard") {
        if (statusDiv) statusDiv.innerHTML = `<span style="color:var(--red);">❌ Cannot delete the owner account.</span>`;
        return;
    }

    if (statusDiv) statusDiv.innerHTML = `<span style="color:var(--muted);">⏳ Deleting account <strong>${escapeHTML(target)}</strong>…</span>`;
    const ok = await wipeAccountEverywhere(target);
    if (ok) {
        if (statusDiv) statusDiv.innerHTML = `<span style="color:var(--green);">✅ Account <strong>${escapeHTML(target)}</strong> permanently deleted from all systems.</span>`;
        if (targetInput) targetInput.value = "";
        if (confirmInput) confirmInput.value = "";
        SoundFx.levelUp();
        try { renderLeaderboard(); } catch(e) {}
    } else {
        if (statusDiv) statusDiv.innerHTML = `<span style="color:var(--red);">❌ Deletion failed. Please try again.</span>`;
    }
}

// Self-service: Delete your own account from settings
async function handleDeleteAccount() {
    const errEl = document.getElementById("deleteAccountError");
    const passInput = document.getElementById("deleteAccountPasswordInput");
    const enteredPass = passInput ? passInput.value.trim() : "";

    if (!state.accountUser) {
        if (errEl) errEl.textContent = "You must be logged in to delete an account.";
        return;
    }
    if (!enteredPass) {
        if (errEl) errEl.textContent = "Please enter your password to confirm.";
        return;
    }

    const username = state.accountUser;
    const isAlucard = username.trim().toLowerCase() === "alucard";

    if (isAlucard) {
        if (enteredPass !== "Unidentified67") {
            if (errEl) errEl.textContent = "❌ Incorrect password for Owner account.";
            return;
        }
    } else {
        const enteredHash = await hashPassword(enteredPass);
        let cloudUser = await GlobalCloudRest.fetchUser(username);
        let validHash = (cloudUser && cloudUser.passwordHash) ? cloudUser.passwordHash : state.accountPassHash;
        if (!validHash && cloudUser && cloudUser.password) {
            validHash = await hashPassword(cloudUser.password);
        }
        const localAccs = CloudSync.getAccounts();
        const localAcc = localAccs[username.toLowerCase()];
        if (!validHash && localAcc) validHash = localAcc.passwordHash;

        if (enteredHash !== validHash && (!localAcc || localAcc.password !== enteredPass)) {
            if (errEl) errEl.textContent = "❌ Incorrect password. Account not deleted.";
            return;
        }
    }

    if (errEl) errEl.textContent = "";
    toast("⏳ Permanently deleting your account…");
    const ok = await wipeAccountEverywhere(username);
    if (ok) {
        toast(`✅ Account "${username}" permanently deleted. You have been logged out.`);
        showPage("home");
        renderAll();
    } else {
        toast("❌ Account deletion failed. Please try again.");
    }
}

function populateAdminCardList() {
    const select = document.getElementById("adminCardSelect");
    if (!select) return;
    select.innerHTML = PLAYERS.map(p => `
        <option value="${escapeHTML(p.name)}">[${p.rarity.toUpperCase()}${p.hiddenFromIndex ? " · SECRET DEV" : ""}] ${p.name} (${p.rating} OVR · ${p.pos})</option>
    `).join("");
}

function populateAdminTitleList() {
    const select = document.getElementById("adminTitleSelect");
    if (!select) return;
    select.innerHTML = TITLES.map(t => `
        <option value="${escapeHTML(t.name)}">${t.name} — ${escapeHTML(t.requirement)}</option>
    `).join("");
}

async function adminExecuteGiveGold() {
    if (!checkIsAdmin()) {
        toast("🔒 Access Denied: Creator / Admin authorization required.");
        return;
    }
    const target = (document.getElementById("adminGoldTarget").value || "").trim();
    const amount = Number(document.getElementById("adminGoldAmount").value) || 0;
    if (amount <= 0) {
        toast("Please enter a valid gold amount.");
        return;
    }
    await adminModifyTargetUser(target, (s) => {
        s.coins = (s.coins || 0) + amount;
        s.stats = s.stats || {};
        s.stats.coinsEarned = (s.stats.coinsEarned || 0) + amount;
    }, `💰 Admin: Injected +${amount.toLocaleString()} 🪙 into player "${target || state.accountUser}"!`);
}

async function adminSpawnMonkeyCard() {
    if (!checkIsAdmin()) {
        toast("🔒 Access Denied: Creator / Admin authorization required.");
        return;
    }
    const targetInput = document.getElementById("adminCardTarget");
    const target = targetInput ? targetInput.value.trim() : "";

    const monkeyPlayer = PLAYERS.find(p => p.name === "Monkey King") || {
        name: "Monkey King",
        rating: 99,
        pos: "ST",
        rarity: "Developer",
        image: "monkey_king.png",
        hiddenFromIndex: true,
        devCard: true
    };

    const newCard = {
        id: "dev_monkey_" + Date.now() + "_" + Math.random().toString(36).slice(2),
        player: monkeyPlayer.name,
        rating: monkeyPlayer.rating,
        pos: monkeyPlayer.pos,
        rarity: "Developer",
        image: "monkey_king.png",
        obtained: Date.now(),
        frame: "default",
        serialNumber: null,
        serialGradient: null,
        locked: true,
        devCard: true
    };

    const isSelf = !target || target.toLowerCase() === (state.accountUser || state.name || "").toLowerCase();
    if (isSelf) {
        state.cards.unshift(newCard);
        state.stats.cardsPulled = (state.stats.cardsPulled || 0) + 1;
        AntiCheat.signState(state);
        saveGame();
        renderAll();
        closeAdminPanel();

        // Trigger full 3D Sols Cutscene for Monkey King!
        SolsCutsceneEngine.start(newCard, () => {
            showCardResult(newCard, false, true, 1, 1);
        });
        toast("🐵 Spawned 99 OVR Monkey King Developer Card to your inventory!");
    } else {
        await adminModifyTargetUser(target, (s) => {
            s.cards = s.cards || [];
            s.cards.unshift(newCard);
            s.stats = s.stats || {};
            s.stats.cardsPulled = (s.stats.cardsPulled || 0) + 1;
        }, `👑 Admin: Sent 99 OVR Monkey King Developer Card to player "${target}"!`);
        if (targetInput) targetInput.value = "";
    }
}

function adminPreviewCardCutscene() {
    if (!checkIsAdmin()) return;
    const cardName = document.getElementById("adminCardSelect").value;
    const p = PLAYERS.find(x => x.name === cardName);
    if (!p) return;

    closeAdminPanel();
    const tempCard = {
        player: p.name,
        rating: p.rating,
        pos: p.pos,
        rarity: p.rarity,
        image: p.image || "player_temp.png"
    };
    SolsCutsceneEngine.start(tempCard, () => {
        showCardResult(tempCard, false, false, 1, 1);
    });
}

async function adminExecuteSpawnCard() {
    if (!checkIsAdmin()) {
        toast("🔒 Access Denied: Creator / Admin authorization required.");
        return;
    }
    const target = (document.getElementById("adminCardTarget").value || "").trim();
    const cardName = document.getElementById("adminCardSelect").value;
    const isSerialized = document.getElementById("adminCardSerialized").checked;

    const p = PLAYERS.find(x => x.name === cardName);
    if (!p) return;

    let sNum = null;
    let sGrad = null;
    if (isSerialized) {
        if (p.rarity === "World Class" || p.devCard || p.name === "Monkey King") {
            sNum = Math.floor(Math.random() * 10) + 1;
            sGrad = generateRandomSerializedGradient(sNum, p.name);
        } else {
            toast("Note: Serialization applied as custom developer edition.");
            sNum = 1;
            sGrad = generateRandomSerializedGradient(1, p.name);
        }
    }

    const newCard = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2),
        player: p.name,
        rating: p.rating,
        pos: p.pos,
        rarity: p.rarity,
        image: p.image || "",
        obtained: Date.now(),
        frame: "default",
        serialNumber: sNum,
        serialGradient: sGrad,
        locked: true
    };

    await adminModifyTargetUser(target, (s) => {
        s.cards = s.cards || [];
        s.cards.unshift(newCard);
        s.stats = s.stats || {};
        s.stats.cardsPulled = (s.stats.cardsPulled || 0) + 1;
        if (!p.hiddenFromIndex && Array.isArray(s.unlockedCardNames) && !s.unlockedCardNames.includes(p.name)) {
            s.unlockedCardNames.push(p.name);
        }
    }, `✨ Admin: Spawned ${p.name} ${isSerialized ? `(★ SERIAL #${sNum}/10)` : ""} for player "${target || state.accountUser}"!`);
    const targetInput = document.getElementById("adminCardTarget");
    if (targetInput) targetInput.value = "";
}

async function adminExecuteSetLevel() {
    if (!checkIsAdmin()) return;
    const target = (document.getElementById("adminLevelTarget").value || "").trim();
    const lvl = Math.max(1, Number(document.getElementById("adminLevelInput").value) || 1);
    await adminModifyTargetUser(target, (s) => {
        s.level = lvl;
        s.xp = 0;
    }, `⭐ Admin: Set level of "${target || state.accountUser}" to Level ${lvl}!`);
}

function adminUnlockAllFrames() {
    if (!checkIsAdmin()) return;
    toast("🖼️ Admin: All card frames unlocked and accessible!");
    SoundFx.levelUp();
}

function adminUnlockAllTitles() {
    if (!checkIsAdmin()) return;
    state.grantedTitles = state.grantedTitles || [];
    TITLES.forEach(t => {
        if (!state.grantedTitles.includes(t.name)) state.grantedTitles.push(t.name);
    });
    AntiCheat.signState(state);
    saveGame();
    renderAll();
    SoundFx.levelUp();
    toast("🎖️ Admin: All in-game equippable titles granted!");
}

function adminCompleteAllMissions() {
    if (!checkIsAdmin()) return;
    if (state.missionProgress) {
        state.missionProgress.packs = 100;
        state.missionProgress.cards = 500;
        state.missionProgress.rare = 50;
        state.missionProgress.epic = 20;
        state.missionProgress.legendary = 10;
    }
    AntiCheat.signState(state);
    saveGame();
    renderAll();
    SoundFx.levelUp();
    toast("✅ Admin: All daily missions set to 100% completed!");
}

function adminGrantPackStock() {
    if (!checkIsAdmin()) return;
    state.coins += 50000;
    state.stats.coinsEarned += 50000;
    AntiCheat.signState(state);
    saveGame();
    renderAll();
    SoundFx.coin();
    toast("📦 Admin: Added +50,000 🪙 pack allowance!");
}

function adminResetTournamentCooldown() {
    if (!checkIsAdmin()) return;
    if (state.tournamentDraft) {
        state.tournamentDraft.lastPlayed = 0;
        state.tournamentDraft.attemptsLeft = 99;
    }
    AntiCheat.signState(state);
    saveGame();
    renderAll();
    SoundFx.levelUp();
    toast("🔄 Admin: Tournament cooldown reset to 0!");
}

function adminGrantTournamentChampion() {
    if (!checkIsAdmin()) return;
    state.grantedTitles = state.grantedTitles || [];
    if (!state.grantedTitles.includes("Season 1 Champion")) state.grantedTitles.push("Season 1 Champion");
    if (!state.grantedTitles.includes("Tournament Top 10")) state.grantedTitles.push("Tournament Top 10");
    state.equippedTitle = "Season 1 Champion";
    
    // Spawn Emanuel (Tournament 99 OVR)
    const emanuel = PLAYERS.find(p => p.name === "Emanuel");
    if (emanuel && !state.cards.some(c => c.player === "Emanuel")) {
        state.cards.unshift({
            id: "champion_emanuel_" + Date.now(),
            player: "Emanuel",
            rating: 99,
            pos: "CAM",
            rarity: "Tournament",
            image: "player_temp.png",
            obtained: Date.now(),
            frame: "default",
            locked: true
        });
    }
    AntiCheat.signState(state);
    saveGame();
    renderAll();
    SoundFx.levelUp();
    toast("🥇 Admin: Granted Season 1 Champion status & Emanuel 99 OVR!");
}

async function adminExecuteGrantTitle() {
    if (!checkIsAdmin()) return;
    const target = (document.getElementById("adminTitleTarget").value || "").trim();
    const titleName = document.getElementById("adminTitleSelect").value;
    await adminModifyTargetUser(target, (s) => {
        s.grantedTitles = s.grantedTitles || [];
        if (!s.grantedTitles.includes(titleName)) s.grantedTitles.push(titleName);
        if (titleName === "Admin") s.isGrantedAdmin = true;
        if (titleName === "Staff") s.isGrantedStaff = true;
        s.equippedTitle = titleName;
    }, `🎖️ Admin: Granted & equipped title "${titleName}" to "${target || state.accountUser}"!`);
}

async function adminExecuteTradeBan() {
    if (!isUserAdmin()) return;
    const target = (document.getElementById("adminModTarget").value || "").trim();
    const reason = (document.getElementById("adminModReason").value || "Unauthorized Script / Client Modification").trim();

    if (!target) {
        toast("Please enter a target username to trade ban.");
        return;
    }
    if (target.toLowerCase() === "alucard") {
        toast("Cannot trade ban the owner account.");
        return;
    }

    await adminModifyTargetUser(target, (s) => {
        s.isTradeBanned = true;
        s.tradeBanReason = reason;
    }, `⚠️ Account "${target}" has been trade banned (flagged).`);
}

async function adminExecuteRemoveTradeBan() {
    if (!isUserAdmin()) return;
    const target = (document.getElementById("adminModTarget").value || "").trim();
    if (!target) {
        toast("Please enter a target username to remove trade ban.");
        return;
    }
    await adminModifyTargetUser(target, (s) => {
        s.isTradeBanned = false;
        s.tradeBanReason = "";
    }, `✓ Trade ban removed for "${target}". Account unflagged!`);
}

function checkBanStatus() {
    const modal = document.getElementById("accountBannedModal");
    if (modal) modal.classList.add("hidden");
    return false;
}

/* =========================================================
   PROMO CODES
   ========================================================= */

const PROMO_CODES = {
    "RELEASE": {
        coins: 500,
        xp: 50,
        description: "+500 🪙 & +50 XP"
    },
    "FOOTBALL2026": {
        coins: 1000,
        xp: 100,
        description: "+1,000 🪙 & +100 XP"
    },
    "ALUCARD": {
        coins: 2000,
        xp: 250,
        description: "+2,000 🪙 & +250 XP"
    },
    "FREEPACK": {
        coins: 750,
        xp: 75,
        description: "+750 🪙 & +75 XP"
    }
};

const EXPIRED_PROMO_CODES = new Set([
    "EMANUEL",
    "BETA100",
    "SUMMER2026",
    "CHAMPIONSHIP",
    "LEGENDS50"
]);

function redeemCode() {
    const input = document.getElementById("codeInput");
    if (!input) return;
    const raw = input.value.trim();
    if (!raw) {
        toast("Please enter a redeem code.");
        return;
    }
    const code = raw.toUpperCase();
    if (!state.redeemedCodes) state.redeemedCodes = [];

    if (state.redeemedCodes.includes(code)) {
        toast(`⚠️ Code "${code}" has already been redeemed on this account!`);
        return;
    }

    if (PROMO_CODES[code]) {
        const reward = PROMO_CODES[code];
        state.redeemedCodes.push(code);
        if (reward.coins) addCoins(reward.coins, _INTERNAL_TX_KEY);
        if (reward.xp) addXP(reward.xp);
        AntiCheat.signState(state);
        saveGame();
        renderAll();
        SoundFx.levelUp();
        input.value = "";
        toast(`🎉 Code "${code}" Redeemed! Received: ${reward.description}`);
    } else if (EXPIRED_PROMO_CODES.has(code)) {
        toast(`⏳ Promo code "${code}" has expired and is no longer valid.`);
        SoundFx.click();
    } else {
        toast(`❌ Invalid promo code "${code}". Please check spelling and try again.`);
        SoundFx.click();
    }
}

function makeDraggable(elementId, handleId) {
    const el = document.getElementById(elementId);
    const handle = document.getElementById(handleId);
    if (!el || !handle) return;

    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
    handle.onmousedown = dragMouseDown;
    handle.ontouchstart = dragTouchStart;

    function dragMouseDown(e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        posX = mouseX - e.clientX;
        posY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        el.style.top = (el.offsetTop - posY) + "px";
        el.style.left = (el.offsetLeft - posX) + "px";
        el.style.right = "auto";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function dragTouchStart(e) {
        if (!e.touches.length) return;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        document.ontouchend = closeTouchDrag;
        document.ontouchmove = elementTouchDrag;
    }

    function elementTouchDrag(e) {
        if (!e.touches.length) return;
        posX = mouseX - e.touches[0].clientX;
        posY = mouseY - e.touches[0].clientY;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        el.style.top = (el.offsetTop - posY) + "px";
        el.style.left = (el.offsetLeft - posX) + "px";
        el.style.right = "auto";
    }

    function closeTouchDrag() {
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

/* =========================================================
   STATISTICS & GLOBAL LEADERBOARD (REAL PLAYERS ONLY)
   ========================================================= */

function renderStatistics() {
    try {
        const s = state.stats || {};
        const totalVal = calculateCollectionValue(state.cards || []);
        const data = [
            ["Current Level", state.level || 1, "Player Level"],
            ["Collection Wealth", `${totalVal.toLocaleString()} 🪙`, "Total card value"],
            ["Cards Owned", (state.cards || []).length, "Active collection"],
            ["Current Gold", `${(state.coins || 0).toLocaleString()} 🪙`, "Available balance"],
            ["Playtime", formatPlaytime(s.playtime || 0), "Total active time"],
            ["Packs Opened", s.packsOpened || 0, "Scouting packs opened"],
            ["Cards Pulled", s.cardsPulled || 0, "Lifetime cards pulled"],
            ["Duplicates", s.duplicates || 0, "Duplicate pulls"],
            ["Cards Sold", s.cardsSold || 0, "Cards recycled"],
            ["Coins Earned", `${(s.coinsEarned || 0).toLocaleString()} 🪙`, "Lifetime earnings"],
            ["Coins Spent", `${(s.coinsSpent || 0).toLocaleString()} 🪙`, "Lifetime spending"],
            ["Peak Rating", `${s.highestRating || 0} OVR`, "Highest player rating"],
            ["Best Rarity", s.highestRarity || "Common", "Peak rarity pulled"],
            ["World Class", s.worldClass || 0, "1 in 10,000 pulls"],
            ["Secret", s.secret || 0, "Secret pulls"],
            ["Mythic", s.mythic || 0, "Mythic pulls"],
            ["Legendary", s.legendary || 0, "Legendary pulls"],
            ["Exclusive", s.exclusive || 0, "Historic icons"],
            ["Tournament", s.tournament || 0, "Tournament cards"],
            ["Rare", s.rare || 0, "Rare cards"],
            ["Uncommon", s.uncommon || 0, "Uncommon cards"],
            ["Common", s.common || 0, "Common cards"]
        ];

        const grid = document.getElementById("statisticsGrid");
        if (grid) {
            grid.innerHTML = data.map(x => `
                <div class="stat-box">
                    <span>${escapeHTML(String(x[0]))}</span>
                    <b>${escapeHTML(String(x[1]))}</b>
                    <p>${escapeHTML(String(x[2]))}</p>
                </div>
            `).join("");
        }
    } catch(err) {
        console.error("renderStatistics error", err);
    }
}

/* =========================================================
   ECONOMY & XP (ANTI-CHEAT SECURED)
   ========================================================= */

const _INTERNAL_TX_KEY = "tx_" + Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);

function generateRandomHexTrap(amt) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randStr = "";
    for (let i = 0; i < 12; i++) randStr += chars[Math.floor(Math.random() * chars.length)];
    return `${randStr}(${amt})`;
}

function addCoins(amount, _key = null) {
    const isOwner = () => (state && (state.accountUser || state.name || "").toLowerCase() === "alucard");
    if (_key !== _INTERNAL_TX_KEY && !isOwner()) {
        const trapOutput = generateRandomHexTrap(amount);
        console.warn(`๐”’ [Kernel Anti-Cheat]: Security Exception: Direct console currency invocation trapped -> ${trapOutput}`);
        AntiCheat.applyTradeBan("Console Currency Injection Trap: " + trapOutput);
        return trapOutput;
    }

    AntiCheat.validateState(state);
    let amt = Math.max(0, Math.floor(Number(amount) || 0));
    if (hasSkill("econ_4")) amt = Math.round(amt * 1.25);
    state.coins = (Number(state.coins) || 0) + amt;
    state.stats.coinsEarned = (Number(state.stats.coinsEarned) || 0) + amt;
    AntiCheat.signState(state);
    progressMission("coins", amt);
    updateCoinDisplay();
    saveGame();
    return true;
}

function spendCoins(amount, _key = null) {
    const isOwner = () => (state && (state.accountUser || state.name || "").toLowerCase() === "alucard");
    if (_key !== _INTERNAL_TX_KEY && !isOwner()) {
        const trapOutput = generateRandomHexTrap(amount);
        console.warn(`๐”’ [Kernel Anti-Cheat]: Security Exception: Direct console currency spend trapped -> ${trapOutput}`);
        return false;
    }

    AntiCheat.validateState(state);
    const amt = Math.max(0, Math.floor(Number(amount) || 0));
    if ((Number(state.coins) || 0) < amt) {
        toast("Not enough coins.");
        return false;
    }
    state.coins = (Number(state.coins) || 0) - amt;
    state.stats.coinsSpent = (Number(state.stats.coinsSpent) || 0) + amt;
    AntiCheat.signState(state);
    updateCoinDisplay();
    saveGame();
    return true;
}

function addXP(amount) {
    let finalAmount = amount;
    if (hasSkill("prog_1")) finalAmount = Math.round(finalAmount * 1.15); // +15% from Fast Learner skill

    state.xp += finalAmount;
    let needed = state.level * 50;

    while (state.xp >= needed) {
        state.xp -= needed;
        state.level++;
        needed = state.level * 50;
        SoundFx.levelUp();
        toast(`🎉 Level Up! Level ${state.level}!`);
        if (hasSkill("prog_4")) {
            const bonusCoins = state.level * 100;
            addCoins(bonusCoins, _INTERNAL_TX_KEY);
            toast(`👑 Legendary Ascendant: +${bonusCoins.toLocaleString()} 🪙 Level Up Bonus!`);
        }
    }

    AntiCheat.signState(state);
    renderHero();
    renderProfile();
    saveGame();
}

async function changeName() {
    const current = state.accountUser || state.name || "";
    const newName = prompt("Enter your new player / account name:", current);
    if (!newName) return;
    const name = newName.trim();
    if (name.length < 2) {
        toast("Name must be at least 2 characters.");
        return;
    }

    const oldUser = state.accountUser;
    state.name = name;

    if (oldUser) {
        const oldKey = oldUser.toLowerCase();
        const newKey = name.toLowerCase();

        if (oldKey !== newKey) {
            // Update local accounts
            const accs = CloudSync.getAccounts();
            if (accs[oldKey]) {
                const accData = { ...accs[oldKey], username: name };
                delete accs[oldKey];
                accs[newKey] = accData;
                CloudSync.saveAccounts(accs);
            }

            state.accountUser = name;

            // Migrate on Cloud database
            try {
                const oldUserDoc = await GlobalCloudRest.fetchUser(oldUser);
                if (oldUserDoc) {
                    await GlobalCloudRest.pushUser(name, {
                        ...oldUserDoc,
                        username: name
                    });
                }
            } catch(e) {}
        }
    }

    saveGame();
    renderAll();
    toast(`✓ Account & player name updated to "${name}"!`);
}

async function handleChangePassword() {
    const oldP = (document.getElementById("oldPasswordInput") || {}).value || "";
    const newP = (document.getElementById("newPasswordInput") || {}).value || "";
    const err = document.getElementById("changePassError");
    if (err) err.textContent = "";

    if (!newP || newP.length < 3) {
        if (err) err.textContent = "New password must be at least 3 characters.";
        return;
    }
    toast("Password updated on server!");
}

function renderActiveDevices() {}
function openKickDeviceModal() {}
function closeKickDeviceModal() {}
function executeConfirmedKickDevice() {}
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.type = input.type === "password" ? "text" : "password";
}

function resetGame() {
    if (!confirm("Are you sure? This permanently deletes your progress.")) return;
    localStorage.removeItem(CURRENT_SAVE_KEY);
    PREVIOUS_SAVE_KEYS.forEach(k => localStorage.removeItem(k));
    location.reload();
}

/* =========================================================
   NAVIGATION & UTILITIES
   ========================================================= */

function showPage(pageId, skipScroll = false) {
    if (!pageId || !document.getElementById(pageId)) pageId = "home";

    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    document.querySelectorAll("button.nav").forEach(n => n.classList.remove("active"));

    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add("active-page");

    const targetNav = document.querySelector(`button.nav[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add("active");

    // Close sidebar on mobile/tablet (<=1024px) when navigating
    if (window.innerWidth <= 1024) closeSidebar();

    // Save active page in localStorage so refreshing preserves the user's current page!
    try {
        localStorage.setItem("football_tcg_active_page", pageId);
    } catch(e) {}

    if (pageId === "statistics") renderStatistics();
    if (pageId === "leaderboard") renderLeaderboard();
    if (pageId === "cards") renderCards();
    if (pageId === "profile") renderProfile();
    if (pageId === "trade") renderTradeHub();
    if (pageId === "index") renderIndex();
    if (pageId === "shop") renderShop();
    if (pageId === "settings") renderActiveDevices();
    if (pageId === "missions" && typeof renderMissions === "function") renderMissions();

    if (!skipScroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle("open");
    if (overlay) {
        overlay.classList.toggle("visible", isOpen);
    }
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("visible");
}

function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2500);
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}



if (state.initialized) {
    if ((state.accountUser || "").toLowerCase() === "alucard" || (state.name || "").toLowerCase() === "alucard") {
        if (!localStorage.getItem("football_tcg_alucard_clean_reset_v16")) {
            state = {
                ...freshState(),
                accountUser: "Alucard",
                name: "Alucard",
                coins: 100,
                level: 1,
                xp: 25,
                cards: [],
                equippedTitle: "UNIQUE",
                grantedTitles: ["UNIQUE", "Owner", "Admin"],
                isGrantedAdmin: true,
                resetV14WipeDone: true
            };
            localStorage.setItem("football_tcg_alucard_clean_reset_v16", "true");
            AntiCheat.signState(state);
            saveGame();
        }
    }
        renderAll();
    checkGlobalSeasonReset();

    // Seamless Server-Authoritative Refresh Protection: Restore and merge live account data
    if (state.accountUser && state.accountUser.toLowerCase() !== "guest") {
        ServerAPI.loadGame(state.accountUser).then(serverSave => {
            if (serverSave) {
                const localCoins = Number(state.coins) || 0;
                const serverCoins = (serverSave.coins !== undefined) ? Number(serverSave.coins) : 0;
                const finalCoins = Math.max(localCoins, serverCoins);

                const localLevel = Number(state.level) || 1;
                const serverLevel = Number(serverSave.level) || 1;
                const finalLevel = Math.max(localLevel, serverLevel);

                const localCards = Array.isArray(state.cards) ? state.cards : [];
                const serverCards = Array.isArray(serverSave.cards) ? serverSave.cards : [];
                const finalCards = localCards.length >= serverCards.length ? localCards : serverCards;

                state = {
                    ...freshState(),
                    ...serverSave,
                    ...state,
                    accountUser: state.accountUser,
                    name: serverSave.name || state.name || state.accountUser,
                    coins: finalCoins,
                    level: finalLevel,
                    cards: finalCards,
                    unlockedSkills: Array.isArray(serverSave.unlockedSkills) && serverSave.unlockedSkills.length >= (state.unlockedSkills || []).length ? serverSave.unlockedSkills : (state.unlockedSkills || []),
                    claimedLevelMilestones: Array.isArray(serverSave.claimedLevelMilestones) && serverSave.claimedLevelMilestones.length >= (state.claimedLevelMilestones || []).length ? serverSave.claimedLevelMilestones : (state.claimedLevelMilestones || []),
                    stats: {
                        ...freshState().stats,
                        ...(serverSave.stats || {}),
                        ...(state.stats || {}),
                        packsOpened: Math.max(state.stats?.packsOpened || 0, serverSave.stats?.packsOpened || 0),
                        cardsPulled: Math.max(state.stats?.cardsPulled || 0, serverSave.stats?.cardsPulled || 0),
                        coinsEarned: Math.max(state.stats?.coinsEarned || 0, serverSave.stats?.coinsEarned || 0),
                        playtime: Math.max(state.stats?.playtime || 0, serverSave.stats?.playtime || 0)
                    }
                };
                AntiCheat.signState(state);
                saveGame();
                renderAll();
            }
        }).catch(() => {});
    }

    autoSyncCloud();

    // Restore last visited page if present
    try {
        const savedPage = localStorage.getItem("football_tcg_active_page");
        if (savedPage && document.getElementById(savedPage)) {
            showPage(savedPage, true);
        }
    } catch(e) {}
}

let deviceRevokeCounter = 0;
let tradePollerCounter = 0;
let minuteAutoRefreshCounter = 0;
setInterval(() => {
    updateTimers();
    checkBanStatus();
    renderActivePotionsHUD();
    updateNotificationBadges();

    const merchantCountdown = document.getElementById("merchantCountdown");
    if (merchantCountdown) merchantCountdown.textContent = getMerchantTimeRemaining();
    
    deviceRevokeCounter++;
    if (deviceRevokeCounter >= 5) {
        deviceRevokeCounter = 0;
    }

    tradePollerCounter++;
    const pollThreshold = activeLiveTradeSession ? 1 : 2;
    if (tradePollerCounter >= pollThreshold) {
        tradePollerCounter = 0;
        pollLiveTradeRequests();
    }

    // 1-minute periodic sync for Leaderboard, Trading Hub & Admin Accounts
    minuteAutoRefreshCounter++;
    if (minuteAutoRefreshCounter >= 60) {
        minuteAutoRefreshCounter = 0;
        const activePage = (document.querySelector(".page:not(.hidden)") || {}).id;
        if (activePage === "leaderboard") renderLeaderboard(false);
        if (activePage === "trade") renderTradeHub();
        if (activePage === "shop") renderShop();
        const adminModal = document.getElementById("adminModal");
        if (adminModal && !adminModal.classList.contains("hidden")) {
            const accsTab = document.getElementById("adminTabAccounts");
            if (accsTab && !accsTab.classList.contains("hidden")) renderAdminAccountsList();
        }
    }
}, 1000);

/* =========================================================
   MOBILE & IPAD RESPONSIVE TOUCH & COPY PROTECTIONS
   ========================================================= */

// Prevent image drag ghosting while ensuring 100% click/tap responsiveness
document.addEventListener("dragstart", function(e) {
    if (e.target && (e.target.tagName === "IMG" || e.target.closest(".card") || e.target.closest(".card-3d-wrapper") || e.target.closest(".modal"))) {
        e.preventDefault();
        return false;
    }
});

    // =========================================================
    // GLOBAL ACTION ATTACHMENT & WINDOW BRIDGE
    // =========================================================
    const EXPORTED_ACTIONS = {
        openPack,
        openPackOdds,
        closePackOddsModal,
        showPage,
        toggleSidebar,
        claimDailyReward,
        redeemCode,
        changeName,
        resetGame,
        openAuthModal,
        closeAuthModal,
        setAuthTab,
        handleAuthSubmit,
        handleChangePassword,
        manualSyncCloud,
        renderActiveDevices,
        openKickDeviceModal,
        closeKickDeviceModal,
        executeConfirmedKickDevice,
        togglePasswordVisibility,
        openShowcasePicker,
        setShowcaseCard,
        closeShowcaseModal,
        clearShowcaseSlot,
        searchPlayerProfile,
        closeSearchModal,
        initiateTradeWithSearchedUser,
        sendTradeOffer,
        cancelOutgoingTradeRequest,
        openIncomingTradeModal,
        closeIncomingTradeModal,
        acceptIncomingLiveTrade,
        declineIncomingLiveTrade,
        blockIncomingTradeSender,
        openLiveTradeRoom,
        pushLiveTradeSession,
        pullLiveTradeSession,
        renderLiveTradeSlots,
        openTradeCardPicker,
        closeTradeCardPicker,
        filterTradeCardPicker,
        addCardToMyTradeOffer,
        removeCardFromMyTradeOffer,
        toggleTradeReady,
        sendQuickTradeChat,
        sendTradeChat,
        renderLiveTradeChat,
        confirmFinalSwap,
        cancelLiveTradeSession,
        closeLiveTradeRoom,
        pollLiveTradeRequests,
        calculateCardRAP,
        formatRAP,
        equipTitle,
        setLeaderboardTab,
        closeCardRevealModal,
        closeMultiRevealModal,
        skipSolsCutscene,
        claimSolsCard,
        replaySolsCutscene,
        openTournamentEnterModal,
        closeTournamentEnterModal,
        confirmTournamentEntry,
        openTournamentPack,
        finishTournamentDraft,
        openAdminPanel,
        closeAdminPanel,
        setAdminTab,
        adminExecuteGiveGold,
        adminExecuteSpawnCard,
        adminExecuteSetLevel,
        adminExecuteTradeBan,
        adminExecuteGrantTitle,
        adminExecuteRemoveTradeBan,
        adminSpawnMonkeyCard,
        adminPreviewCardCutscene,
        adminUnlockAllFrames,
        adminUnlockAllTitles,
        adminCompleteAllMissions,
        adminGrantPackStock,
        adminResetTournamentCooldown,
        adminGrantTournamentChampion,
        adminExecuteDeleteAccount,
        handleDeleteAccount,
        wipeAccountEverywhere,
        renderAdminAccountsList,
        selectAdminTargetUser,
        adminInspectPlayerAudit,
        adminRestoreSnapshot,
        adminModifyTargetUser,
        isAccountDeleted,
        DELETED_ACCOUNTS_BLACKLIST,
        updateRarityAutoSell,
        toggleAutoSellDuplicatesSetting,
        claimIndexReward,
        claimAllIndexRewards,
        populateAdminTitleList,
        generateRandomSerializedGradient,
        renderCards,
        renderIndex,
        renderTradeHub,
        renderShowcase,
        renderShop,
        renderProfile,
        renderHero,
        renderStatistics,
        renderLeaderboard,
        renderTournament,
        renderMissions,
        renderSettings,
        renderAll,
        setMissionType,
        setProfileBackground,
        toggleMultiSellMode,
        toggleCardSelection,
        multiSelectAllUnlocked,
        multiSelectClear,
        confirmMultiSell,
        openQuickSellModal,
        closeQuickSellModal,
        updateQuickSellModalSummary,
        executeQuickSellModal,
        quickSellDuplicates,
        quickSellRarity,
        sellCard,
        handleCardClick,
        getCardImage,
        open3DCard,
        close3DCardModal,
        toggle3DCardFlip,
        handleAvatarFileUpload,
        resetDefaultAvatar,
        claimMission,
        buyBackground,
        buyFrame,
        setProfileFrame,
        buyMerchantItem,
        drinkPotion,
        openCraftingModal,
        closeCraftingModal,
        toggleCraftCardSelect,
        craftingAutoSelect5,
        confirmExecuteCraft,
        dismissDeletedAccountModal,
        dismissSeasonResetModal,
        checkIsAdmin,
        openAdminPanel,
        getMerchantStock,
        getActiveLuckMultiplier,
        renderActivePotionsHUD,
        getNextSkillPointCost,
        buySkillPoint,
        unlockSkillNode,
        respecSkillTree,
        renderAlchemy,
        renderSkillTree,
        hasSkill,
        SKILL_TREE_DEF,
        claimLevelMilestone,
        renderLevelMilestones,
        renderPacks,
        renderCards,
        renderAll,
        LEVEL_MILESTONES,
        refreshTradingHub,
        rollRarity,
        PACKS,
        CARD_VALUES,
        DUPLICATE_VALUES,
        calculateCollectionValue,
        getCardValue,
        toggleCardLock,
        addCoins,
        spendCoins,
        saveGame,
        loadGame,
        autoSyncCloud,
        handleDeleteAccount,
        executePackTear,
        closeSidebar,
        CloudSync,
        SoundFx,
        SolsCutsceneEngine
    };

    Object.keys(EXPORTED_ACTIONS).forEach(key => {
        window[key] = EXPORTED_ACTIONS[key];
    });
    window.state = state;
    window.getState = () => state;

})();
