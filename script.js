/* =========================================================
   FOOTBALL CARDS — ULTIMATE EDITION
   CLOUD TRADING, TOURNAMENT DRAFT, INDEX & 3D INSPECTOR
   ========================================================= */

(function initFootballTCGSecurityCore() {
    "use strict";

    // =========================================================
    // ANTI-CHEAT & DEVTOOLS ABSOLUTE DEFENSE SUITE
    // =========================================================

    // 1. Console Neutralization & Continuous Auto-Purge
    (function lockDownConsole() {
        try {
            const noop = function() {};
            const consoleProps = ["log", "warn", "error", "info", "debug", "table", "dir", "trace", "dirxml", "group", "groupCollapsed", "groupEnd", "time", "timeEnd", "timeLog", "profile", "profileEnd", "count", "countReset", "assert"];
            consoleProps.forEach(fn => {
                if (window.console && typeof window.console[fn] === "function") {
                    try { window.console[fn] = noop; } catch(e) {}
                }
            });
            // Continuous console wipe
            setInterval(() => {
                try { if (window.console && window.console.clear) window.console.clear(); } catch(e) {}
            }, 300);
        } catch(e) {}
    })();

    // 2. Active DevTools Detection & Shield Enforcement
    let isDevToolsOpen = false;
    function checkDevToolsStatus() {
        try {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            const modal = document.getElementById("devToolsShieldModal");
            
            if (widthDiff || heightDiff) {
                if (!isDevToolsOpen) {
                    isDevToolsOpen = true;
                    if (modal) {
                        modal.classList.remove("hidden");
                        modal.style.display = "flex";
                    }
                }
            } else {
                if (isDevToolsOpen) {
                    isDevToolsOpen = false;
                    if (modal) {
                        modal.classList.add("hidden");
                        modal.style.display = "none";
                    }
                }
            }
        } catch(e) {}
    }
    window.addEventListener("resize", checkDevToolsStatus);
    setInterval(checkDevToolsStatus, 500);

    // 3. Anti-Debugging Timing Loop
    setInterval(() => {
        try {
            const before = performance.now();
            (function(){}).constructor("debugger")();
            const after = performance.now();
            if (after - before > 100) {
                const modal = document.getElementById("devToolsShieldModal");
                if (modal) {
                    modal.classList.remove("hidden");
                    modal.style.display = "flex";
                }
            }
        } catch(e) {}
    }, 1000);

    // 4. Keyboard Shortcut & View Source Lockdown (F12, Ctrl+Shift+I/J/C/K, Ctrl+U, Ctrl+S)
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === 123 || e.key === "F12") {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c', 'K', 'k'].includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && ['U', 'u', 'S', 's'].includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // 5. Disable Right Click Context Menu
    window.addEventListener('contextmenu', function(e) {
        const tag = (e.target && e.target.tagName) || "";
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // 6. Cryptographic SHA-256 Password Hash Engine
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

    // 7. Auto-Sanitize Existing LocalStorage Passwords on Startup
    (async function sanitizeStoredPasswords() {
        try {
            // Sanitize Cloud Accounts in LocalStorage
            const raw = localStorage.getItem("football_cards_cloud_accounts");
            if (raw) {
                const accs = JSON.parse(raw);
                let modified = false;
                for (const k in accs) {
                    const acc = accs[k];
                    if (acc && acc.password) {
                        acc.passwordHash = await hashPassword(acc.password);
                        delete acc.password;
                        modified = true;
                    }
                }
                if (modified) {
                    localStorage.setItem("football_cards_cloud_accounts", JSON.stringify(accs));
                }
            }

            // Sanitize Save States in LocalStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("footballCardsSave")) {
                    try {
                        const saveRaw = localStorage.getItem(key);
                        if (saveRaw && saveRaw.includes('"accountPass"')) {
                            const saveData = JSON.parse(saveRaw);
                            if (saveData.accountPass) {
                                saveData.accountPassHash = await hashPassword(saveData.accountPass);
                                delete saveData.accountPass;
                                localStorage.setItem(key, JSON.stringify(saveData));
                            }
                        }
                    } catch(e) {}
                }
            }
        } catch(e) {}
    })();

    const CURRENT_SAVE_KEY = "footballCardsSave_v11_hard_reset";
    const PREVIOUS_SAVE_KEYS = [
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

const CLOUD_STORAGE_KEY = "football_cards_cloud_accounts";
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
    _banTriggered: false,
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
    applyAutoBan(reason) {
        if (!state) return;
        const u = (state.accountUser || state.name || "").toLowerCase();
        if (u === "alucard") return; // Master Owner cannot be banned

        if (this._banTriggered) return;
        this._banTriggered = true;

        state.bannedUntil = Date.now() + (365 * 24 * 3600 * 1000); // 1 Year Permanent Suspension
        state.banReason = reason || "Aggressive Anti-Cheat Violation: Console / Script / Injection Detected";
        state.coins = 0;
        state.cards = [];
        this.signState(state);
        saveGame();
        checkBanStatus();

        try {
            GlobalCloudRest.pushUser(state.accountUser || state.name, {
                ...state,
                bannedUntil: state.bannedUntil,
                banReason: state.banReason
            });
        } catch(e) {}

        // Immediate Lockout Screen
        document.body.innerHTML = `
        <div style="position:fixed;inset:0;background:#050000;color:#ff3333;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;z-index:99999999;text-align:center;padding:24px;">
            <h1 style="font-size:36px;font-weight:900;letter-spacing:2px;margin:0 0 16px;text-shadow:0 0 30px #ff0000;">⛔ PERMANENT SECURITY SUSPENSION</h1>
            <p style="font-size:16px;color:#fca5a5;max-width:600px;line-height:1.6;margin:0 0 24px;"><b>Reason:</b> ${escapeHTML(state.banReason)}</p>
            <div style="padding:16px 28px;background:rgba(255,0,0,0.1);border:1px solid #ff3333;border-radius:12px;font-weight:800;color:#ffffff;">
                ACCOUNT ID: ${escapeHTML(state.accountUser || state.name || "GUEST")} · HARDWARE HASH LOGGED
            </div>
        </div>
        `;
    },
    validateState(st) {
        if (!st) return true;
        const u = (st.accountUser || st.name || "").toLowerCase();
        if (u === "alucard") return true;

        // Sanitize coins
        if (isNaN(st.coins) || st.coins < 0) {
            st.coins = 100;
        }

        // Detect impossible sudden balance spikes
        if (Number(st.coins) >= 500000) {
            this.applyAutoBan("Unauthorized Coin Injection Detected (" + (Number(st.coins) || 0).toLocaleString() + " Coins)");
            return false;
        }

        this.signState(st);
        return true;
    },
    initAggressiveLockdown() {
        const self = this;
        const isAlucard = () => (state && (state.accountUser || state.name || "").toLowerCase() === "alucard");

        // 1. Console getter honeypot trap
        try {
            const devTrap = document.createElement("div");
            Object.defineProperty(devTrap, "id", {
                get() {
                    if (!isAlucard()) {
                        self.applyAutoBan("DevTools / Console Inspection Trap Triggered");
                    }
                    return "trap";
                }
            });
            setInterval(() => {
                if (!isAlucard()) {
                    console.log(devTrap);
                    console.clear();
                }
            }, 2000);
        } catch(e) {}

        // 2. Debugger timing analysis trap
        setInterval(() => {
            if (isAlucard()) return;
            const start = performance.now();
            // Test debugger delay
            (function() {}).constructor("debugger")();
            const duration = performance.now() - start;
            if (duration > 150) {
                self.applyAutoBan("DevTools / Debugger Pause Detected");
            }
        }, 3000);

        // 3. Screen size DevTools open threshold detection
        window.addEventListener("resize", () => {
            if (isAlucard()) return;
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            if (widthDiff > 160 || heightDiff > 160) {
                self.applyAutoBan("DevTools Docked Window Detected");
            }
        });
    }
};

try { AntiCheat.initAggressiveLockdown(); } catch(e) {}

const DUPLICATE_VALUES = {
    Common: 5,
    Uncommon: 12,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
    Exclusive: 180,
    Mythic: 350,
    Secret: 700,
    Tournament: 1500,
    "World Class": 3000,
    Developer: 10000
};

const CARD_VALUES = {
    Common: 5,
    Uncommon: 15,
    Rare: 40,
    Epic: 100,
    Legendary: 300,
    Exclusive: 600,
    Mythic: 1200,
    Secret: 3000,
    Tournament: 8000,
    "World Class": 15000,
    Developer: 50000
};

const FRAMES = [
    { id: "default", name: "Classic Silver", css: "frame-default", cost: 0 }
];

function getCardValue(card) {
    if (!card) return 0;
    if (card.serialNumber || (card.rarity === "World Class" && (card.player === "Lionel Messi" || card.player === "Cristiano Ronaldo") && card.isSerialized)) {
        return 10000;
    }
    if (card.serialNumber) return 10000;
    return CARD_VALUES[card.rarity] || 5;
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
    const nameLower = (card.player || card.name || "").toLowerCase();
    if (nameLower.includes("monkey") || nameLower.includes("wukong")) {
        return "monkey_king.png";
    }
    return card.image || "player_temp.png";
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
{ name: "Cristiano Ronaldo", rating: 97, pos: "ST", rarity: "World Class", image: "player_temp.png" },

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
    rates: { Uncommon: 58, Rare: 28, Epic: 9, Legendary: 4, Mythic: 0.8, Secret: 0.2 }
},
champion: {
    name: "Champion Pack",
    cost: 45,
    rates: { Rare: 70, Epic: 21, Legendary: 7, Mythic: 1.49, Secret: 0.5, "World Class": 0.01 }
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
{ id: "maracana", name: "Maracanã Pitch", cost: 250, css: "url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1600&auto=format&fit=crop&q=80') center/cover no-repeat" }
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
        accountPassHash: "",
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
        grantedTitles: [],
        isGrantedAdmin: false,
        isGrantedStaff: false,

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
        let isFreshV11 = true;
        let raw = localStorage.getItem(CURRENT_SAVE_KEY);
        if (!raw) {
            isFreshV11 = false;
            for (const prevKey of PREVIOUS_SAVE_KEYS) {
                const prevData = localStorage.getItem(prevKey);
                if (prevData) {
                    raw = prevData;
                    break;
                }
            }
        }

        const fresh = freshState();
        if (!raw) return fresh;

        const saved = JSON.parse(raw);
        let activeName = saved.name;
        if (!activeName || activeName === "Football Player" || activeName === "Player") {
            activeName = saved.accountUser || fresh.name;
        }

        // Total hard reset for clean global wipe as requested by user
        const isReset = !isFreshV11 || saved.resetV12WipeDone !== true;
        const isAdminUser = (saved.accountUser || "").toLowerCase() === "alucard" || !!saved.isGrantedAdmin;

        return {
            ...fresh,
            resetV12WipeDone: true,
            name: activeName,
            accountUser: saved.accountUser || "",
            accountPassHash: saved.accountPassHash || "",
            coins: isReset ? 100 : (saved.coins !== undefined ? saved.coins : 100),
            xp: isReset ? 0 : (saved.xp || 0),
            level: isReset ? 1 : (saved.level || 1),
            ownedFrames: ["default"],
            ownedBackgrounds: ["campnou"],
            profileFrame: "default",
            profileBackground: "campnou",
            equippedTitle: saved.equippedTitle || "Collector",
            showcase: [null, null, null, null, null, null],
            cards: isReset ? [] : (Array.isArray(saved.cards) ? saved.cards.map(c => {
                if (c && (c.player === "Monkey King" || (c.player && c.player.toLowerCase().includes("monkey")))) {
                    return { ...c, image: "monkey_king.png", rarity: "Developer", devCard: true };
                }
                return c;
            }) : []),
            unlockedCardNames: isReset ? [] : (Array.isArray(saved.unlockedCardNames) ? saved.unlockedCardNames : []),
            serializedCounts: { "Lionel Messi": 0, "Cristiano Ronaldo": 0, "Monkey King": 0 },
            stats: isReset ? { ...fresh.stats } : { ...fresh.stats, ...(saved.stats || {}) },
            tournamentDraft: { ...fresh.tournamentDraft },
            missionProgress: isReset ? { hourly: [], daily: [], weekly: [], monthly: [] } : (saved.missionProgress || { hourly: [], daily: [], weekly: [], monthly: [] }),
            missionClaimed: isReset ? { hourly: [], daily: [], weekly: [], monthly: [] } : (saved.missionClaimed || { hourly: [], daily: [], weekly: [], monthly: [] }),
            missionReset: { hourly: Date.now(), daily: Date.now(), weekly: Date.now(), monthly: Date.now() },
            grantedTitles: isAdminUser ? (saved.grantedTitles && saved.grantedTitles.includes("Admin") ? saved.grantedTitles : ["Admin", "Owner"]) : [],
            isGrantedAdmin: isAdminUser,
            isGrantedStaff: !isReset && !!saved.isGrantedStaff,
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

const ServerAPI = {
    BASE_URL: (typeof location !== "undefined" && location.hostname === "localhost") ? "http://localhost:3000" : "",
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

    async signup(username, password) {
        if (!this.BASE_URL) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                this.setToken(data.token);
                return { success: true, data: data.saveData, msg: "Account created and registered on server!" };
            }
            return { success: false, msg: data.error || "Signup failed on server." };
        } catch (e) {
            return null; // Fallback to local / mock
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
                return { success: true, data: data.saveData, msg: "Welcome back! Server save loaded." };
            }
            return { success: false, msg: data.error || "Login failed on server." };
        } catch (e) {
            return null; // Fallback to local / mock
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

    async loadGame(username) {
        if (!this.BASE_URL) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/save?username=${encodeURIComponent(username)}`, {
                headers: this.getHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                return data.saveData || null;
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    async fetchLeaderboard() {
        if (!this.BASE_URL) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/leaderboard`);
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.leaderboard)) {
                    const map = {};
                    data.leaderboard.forEach(entry => {
                        map[(entry.username || entry.name || "").toLowerCase()] = entry;
                    });
                    return map;
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    async fetchUserProfile(username) {
        if (!this.BASE_URL) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/user/${encodeURIComponent(username)}`);
            if (res.ok) {
                const data = await res.json();
                return data.profile || null;
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    async fetchTrades() {
        if (!this.BASE_URL) return null;
        try {
            const res = await fetch(`${this.BASE_URL}/api/trades`);
            if (res.ok) {
                const data = await res.json();
                return data.trades || [];
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    async createTrade(tradePayload) {
        if (!this.BASE_URL) return false;
        try {
            const res = await fetch(`${this.BASE_URL}/api/trades/create`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(tradePayload)
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    },

    async acceptTrade(tradeId, buyerUsername, offeredCard) {
        if (!this.BASE_URL) return false;
        try {
            const res = await fetch(`${this.BASE_URL}/api/trades/accept`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({ tradeId, buyerUsername, offeredCard })
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    }
};

/* =========================================================
   GLOBAL MULTI-DEVICE CLOUD REST SYNC & AUTH (HIGH-SPEED KVDB CLOUD)
   ========================================================= */

const GlobalCloudRest = {
    BUCKET_URL: "https://kvdb.io/MmjyNhMePJggoofHrX9cjo",

    async fetchFile(key) {
        try {
            const cleanKey = key.replace(/[/.]/g, "_");
            const res = await fetch(`${this.BUCKET_URL}/${cleanKey}?t=${Date.now()}`);
            if (!res.ok) return null;
            const data = await res.json();
            return { data: data };
        } catch (e) {
            return null;
        }
    },

    async saveFile(key, dataObj) {
        try {
            const cleanKey = key.replace(/[/.]/g, "_");
            const res = await fetch(`${this.BUCKET_URL}/${cleanKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataObj)
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    },

    async getGlobalSerialCounts() {
        try {
            const doc = await this.fetchFile("global_serial_counts");
            if (doc && doc.data && typeof doc.data === "object") {
                return doc.data;
            }
        } catch (e) {}
        return null;
    },

    async allocateGlobalSerial(playerName) {
        try {
            const p = (playerName === "Lionel Messi") ? "Lionel Messi" : ((playerName === "Cristiano Ronaldo") ? "Cristiano Ronaldo" : null);
            if (!p) return null;

            let counts = await this.getGlobalSerialCounts() || {};
            counts["Lionel Messi"] = Number(counts["Lionel Messi"]) || 0;
            counts["Cristiano Ronaldo"] = Number(counts["Cristiano Ronaldo"]) || 0;

            if (counts[p] < 10) {
                counts[p]++;
                const allocated = counts[p];
                await this.saveFile("global_serial_counts", counts);
                return allocated;
            }
        } catch (e) {}
        return null;
    },

    async fetchUser(username) {
        if (!username) return null;
        try {
            const uKey = "user_" + username.trim().toLowerCase();
            const res = await fetch(`${this.BUCKET_URL}/${uKey}?t=${Date.now()}`);
            if (!res.ok) return null;
            const user = await res.json();
            return (user && user.username) ? user : null;
        } catch (e) {
            return null;
        }
    },

    async pushUser(username, accountPayload) {
        if (!username || !accountPayload) return false;
        try {
            const uKey = "user_" + username.trim().toLowerCase();
            let existing = await this.fetchUser(username) || {};

            let devInfo = {};
            try { devInfo = getDeviceInfo(); } catch(e) {}
            const sessions = existing.sessions || {};
            if (devInfo.deviceId) sessions[devInfo.deviceId] = devInfo;

            let passHash = accountPayload.passwordHash || existing.passwordHash || "";
            if (!passHash && (accountPayload.password || existing.password)) {
                passHash = await hashPassword(accountPayload.password || existing.password);
            }

            const userDoc = {
                username: username,
                passwordHash: passHash,
                saveData: typeof accountPayload.saveData === "string" ? accountPayload.saveData : JSON.stringify(accountPayload.saveData || {}),
                sessions: sessions,
                revokedSessions: existing.revokedSessions || [],
                updatedAt: Date.now()
            };

            await fetch(`${this.BUCKET_URL}/${uKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDoc)
            });

            // Update leaderboard entry in cloud database
            let pData = {};
            try { pData = JSON.parse(userDoc.saveData); } catch(e) {}
            this.pushLeaderboard(username, pData);
            return true;
        } catch (e) {
            return false;
        }
    },

    async fetchAllUsers() {
        try {
            const res = await fetch(`${this.BUCKET_URL}/?prefix=user_&t=${Date.now()}`);
            if (!res.ok) return {};
            const text = await res.text();
            const keys = text.split("\n").map(k => k.trim()).filter(Boolean);
            const userPromises = keys.map(async k => {
                try {
                    const uRes = await fetch(`${this.BUCKET_URL}/${k}?t=${Date.now()}`);
                    if (uRes.ok) return await uRes.json();
                } catch(e) {}
                return null;
            });
            const usersList = await Promise.all(userPromises);
            const map = {};
            usersList.forEach(u => {
                if (u && u.username) map[u.username.toLowerCase()] = u;
            });
            return map;
        } catch (e) {
            return {};
        }
    },

    async fetchLeaderboard() {
        try {
            const res = await fetch(`${this.BUCKET_URL}/?prefix=lb_&t=${Date.now()}`);
            if (!res.ok) return {};
            const text = await res.text();
            const keys = text.split("\n").map(k => k.trim()).filter(Boolean);
            const lbPromises = keys.map(async k => {
                try {
                    const lbRes = await fetch(`${this.BUCKET_URL}/${k}?t=${Date.now()}`);
                    if (lbRes.ok) return await lbRes.json();
                } catch(e) {}
                return null;
            });
            const entries = await Promise.all(lbPromises);
            const map = {};
            entries.forEach(e => {
                if (e && (e.username || e.name)) {
                    map[(e.username || e.name).toLowerCase()] = e;
                }
            });
            return map;
        } catch (e) {
            return {};
        }
    },

    async pushLeaderboard(username, pData) {
        if (!username || !pData) return;
        try {
            const lbKey = "lb_" + username.trim().toLowerCase();
            const lbDoc = {
                name: pData.name || username,
                username: username,
                gold: Number(pData.coins || pData.gold || 0),
                value: Number(pData.value || calculateCollectionValue(pData.cards || [])),
                cards: Number((pData.cards || []).length || pData.cardsCount || 0),
                level: Number(pData.level || 1),
                equippedTitle: pData.equippedTitle || "Collector",
                profileFrame: pData.profileFrame || (state && state.profileFrame) || "default",
                avatar: pData.avatar || (state && state.avatar) || "player_temp.png",
                bannedUntil: Number(pData.bannedUntil || 0),
                updatedAt: Date.now()
            };
            await fetch(`${this.BUCKET_URL}/${lbKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lbDoc)
            });
        } catch (e) {}
    },

    async fetchTrades() {
        try {
            const res = await fetch(`${this.BUCKET_URL}/?prefix=trade_&t=${Date.now()}`);
            if (!res.ok) return [];
            const text = await res.text();
            const keys = text.split("\n").map(k => k.trim()).filter(Boolean);
            const tradePromises = keys.map(async k => {
                try {
                    const tRes = await fetch(`${this.BUCKET_URL}/${k}?t=${Date.now()}`);
                    if (tRes.ok) return await tRes.json();
                } catch(e) {}
                return null;
            });
            const trades = await Promise.all(tradePromises);
            return trades.filter(t => t && t.id);
        } catch (e) {
            return [];
        }
    },

    async saveTrades(trades) {
        if (!Array.isArray(trades)) return;
        try {
            for (const t of trades) {
                if (t && t.id) {
                    await fetch(`${this.BUCKET_URL}/trade_${t.id}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(t)
                    });
                }
            }
        } catch (e) {}
    },

    async setBan(username, durationMs, reason) {
        const u = (username || "").trim().toLowerCase();
        if (!u || u === "alucard") return;
        try {
            const lbKey = "lb_" + u;
            let current = {};
            const res = await fetch(`${this.BUCKET_URL}/${lbKey}?t=${Date.now()}`);
            if (res.ok) current = await res.json();
            current.bannedUntil = Date.now() + durationMs;
            current.banReason = reason;
            await fetch(`${this.BUCKET_URL}/${lbKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(current)
            });
        } catch (e) {}
    },

    async removeBan(username) {
        const u = (username || "").trim().toLowerCase();
        if (!u) return;
        try {
            const lbKey = "lb_" + u;
            let current = {};
            const res = await fetch(`${this.BUCKET_URL}/${lbKey}?t=${Date.now()}`);
            if (res.ok) current = await res.json();
            current.bannedUntil = 0;
            current.banReason = "";
            await fetch(`${this.BUCKET_URL}/${lbKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(current)
            });
        } catch (e) {}
    }
};

const FirebaseSync = GlobalCloudRest;
const GitHubCloudSync = GlobalCloudRest;

function togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        if (btnEl) btnEl.textContent = "🙈";
    } else {
        input.type = "password";
        if (btnEl) btnEl.textContent = "👁️";
    }
}

async function handleChangePassword() {
    if (!state.accountUser) {
        toast("You must be logged into a Cloud Account to change password.");
        openAuthModal();
        return;
    }
    const currentInput = document.getElementById("currentPasswordInput");
    const newInput = document.getElementById("newPasswordInput");
    const confirmInput = document.getElementById("confirmPasswordInput");
    if (!currentInput || !newInput || !confirmInput) return;

    const currentPass = currentInput.value.trim();
    const newPass = newInput.value.trim();
    const confirmPass = confirmInput.value.trim();

    if (!currentPass || !newPass || !confirmPass) {
        toast("Please fill in all password fields.");
        return;
    }

    const currentHash = await hashPassword(currentPass);
    if (state.accountPassHash && currentHash !== state.accountPassHash) {
        toast("Current password is incorrect.");
        return;
    }

    if (newPass.length < 3) {
        toast("New password must be at least 3 characters.");
        return;
    }

    if (newPass !== confirmPass) {
        toast("New passwords do not match.");
        return;
    }

    const newHash = await hashPassword(newPass);
    state.accountPassHash = newHash;
    const accs = CloudSync.getAccounts();
    const key = state.accountUser.toLowerCase();
    if (accs[key]) {
        accs[key].passwordHash = newHash;
        delete accs[key].password; // Strip plaintext
        CloudSync.saveAccounts(accs);
    }
    await GlobalCloudRest.pushUser(state.accountUser, {
        username: state.accountUser,
        passwordHash: newHash,
        saveData: JSON.stringify(state)
    });

    currentInput.value = "";
    newInput.value = "";
    confirmInput.value = "";
    saveGame();
    SoundFx.levelUp();
    toast("✓ Account password updated securely on server!");
}

/* =========================================================
   ACTIVE DEVICE SESSIONS & KICK MANAGEMENT ENGINE
   ========================================================= */

function getDeviceId() {
    let id = localStorage.getItem("football_cards_device_id");
    if (!id) {
        id = "dev_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
        try { localStorage.setItem("football_cards_device_id", id); } catch(e) {}
    }
    return id;
}

function getDeviceInfo() {
    const id = getDeviceId();
    const ua = navigator.userAgent || "";
    let platform = "PC";
    let icon = "💻";
    let os = "Windows";

    if (/iPad|Tablet/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
        platform = "Tablet";
        icon = "📲";
        os = "iPad / Tablet";
    } else if (/iPhone|iPod/i.test(ua)) {
        platform = "Mobile";
        icon = "📱";
        os = "iPhone";
    } else if (/Android/i.test(ua)) {
        platform = "Mobile";
        icon = "📱";
        os = "Android Device";
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
        platform = "Mac";
        icon = "💻";
        os = "macOS";
    } else if (/Linux/i.test(ua)) {
        platform = "Linux";
        icon = "💻";
        os = "Linux";
    }

    let browser = "Browser";
    if (/Edg\//i.test(ua)) browser = "Edge";
    else if (/Chrome\//i.test(ua)) browser = "Chrome";
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Firefox\//i.test(ua)) browser = "Firefox";

    return {
        deviceId: id,
        deviceName: `${os} · ${browser}`,
        platform: platform,
        icon: icon,
        lastActive: Date.now()
    };
}

function formatRelativeTime(ts) {
    if (!ts) return "recently";
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

let pendingKickDeviceId = null;
let pendingKickDeviceName = "";

function openKickDeviceModal(deviceId, deviceName) {
    pendingKickDeviceId = deviceId;
    pendingKickDeviceName = deviceName;
    const modal = document.getElementById("kickDeviceModal");
    const info = document.getElementById("kickDeviceTargetInfo");
    const err = document.getElementById("kickModalError");
    const passInput = document.getElementById("kickPasswordConfirmInput");

    if (info) {
        info.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:24px;">📱</span>
                <div>
                    <span style="font-size:11px;color:var(--muted);text-transform:uppercase;font-weight:800;display:block;">Target Device:</span>
                    <strong style="color:#ffffff;font-size:15px;">${escapeHTML(deviceName)}</strong>
                </div>
            </div>
            <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">When confirmed, this device will be immediately signed out from your account.</p>
        `;
    }
    if (err) err.textContent = "";
    if (passInput) passInput.value = "";

    if (modal) {
        modal.classList.remove("hidden");
        modal.style.display = "flex";
    }
}

function closeKickDeviceModal() {
    pendingKickDeviceId = null;
    pendingKickDeviceName = "";
    const modal = document.getElementById("kickDeviceModal");
    if (modal) {
        modal.classList.add("hidden");
        modal.style.display = "none";
    }
}

async function executeConfirmedKickDevice() {
    const err = document.getElementById("kickModalError");
    const passInput = document.getElementById("kickPasswordConfirmInput");
    const enteredPass = passInput ? passInput.value.trim() : "";

    if (!enteredPass) {
        if (err) err.textContent = "Please enter your account password to confirm.";
        return;
    }

    if (!state.accountUser) {
        if (err) err.textContent = "You must be logged in to manage devices.";
        return;
    }

    // Verify Password Hash against cloud user record or state
    let cloudUser = await GlobalCloudRest.fetchUser(state.accountUser);
    const enteredHash = await hashPassword(enteredPass);
    let validHash = (cloudUser && cloudUser.passwordHash) ? cloudUser.passwordHash : state.accountPassHash;
    
    // Support legacy fallback
    if (!validHash && cloudUser && cloudUser.password) {
        validHash = await hashPassword(cloudUser.password);
    }

    if (enteredHash !== validHash) {
        if (err) err.textContent = "❌ Incorrect password! Authorization failed.";
        SoundFx.click();
        return;
    }

    if (!pendingKickDeviceId) {
        closeKickDeviceModal();
        return;
    }

    try {
        const myDevId = getDeviceId();
        if (cloudUser) {
            if (!cloudUser.revokedSessions) cloudUser.revokedSessions = [];

            if (pendingKickDeviceId === "all_others") {
                const currentSessions = cloudUser.sessions || {};
                for (const devId in currentSessions) {
                    if (devId !== myDevId) {
                        if (!cloudUser.revokedSessions.includes(devId)) cloudUser.revokedSessions.push(devId);
                        delete currentSessions[devId];
                    }
                }
                cloudUser.sessions = currentSessions;
            } else {
                if (!cloudUser.revokedSessions.includes(pendingKickDeviceId)) {
                    cloudUser.revokedSessions.push(pendingKickDeviceId);
                }
                if (cloudUser.sessions && cloudUser.sessions[pendingKickDeviceId]) {
                    delete cloudUser.sessions[pendingKickDeviceId];
                }
            }

            cloudUser.updatedAt = Date.now();
            await GlobalCloudRest.pushUser(state.accountUser, cloudUser);
        }

        const kickedName = pendingKickDeviceName;
        closeKickDeviceModal();
        toast(`🚪 "${kickedName}" successfully logged out!`);
        SoundFx.levelUp();
        renderActiveDevices();
    } catch(e) {
        if (err) err.textContent = "Error disconnecting device. Please try again.";
    }
}

async function checkDeviceRevocation() {
    if (!state.accountUser) return true;
    try {
        const myDevId = getDeviceId();
        const cloudUser = await GlobalCloudRest.fetchUser(state.accountUser);
        if (cloudUser) {
            // Check if this device was revoked / kicked
            const isRevoked = Array.isArray(cloudUser.revokedSessions) && cloudUser.revokedSessions.includes(myDevId);
            const isMissingFromSessions = cloudUser.sessions && Object.keys(cloudUser.sessions).length > 0 && !cloudUser.sessions[myDevId];

            if (isRevoked || isMissingFromSessions) {
                console.warn("Device session revoked by account owner.");
                CloudSync.logout();
                toast("🔒 You have been logged out: This device was disconnected from another session.");
                return false;
            }
        }
    } catch(e) {}
    return true;
}

async function renderActiveDevices() {
    const list = document.getElementById("activeDevicesList");
    if (!list) return;

    if (!state.accountUser) {
        list.innerHTML = `
            <div style="text-align:center;padding:24px 16px;background:rgba(255,255,255,0.03);border-radius:14px;border:1px dashed rgba(255,255,255,0.15);">
                <p style="color:var(--muted);font-size:14px;margin:0 0 10px;">You are currently in Guest mode. Log into a Cloud Account to view and manage connected devices.</p>
                <button class="primary-btn" style="width:auto;padding:10px 20px;" onclick="openAuthModal()">Log In to View Devices</button>
            </div>
        `;
        return;
    }

    list.innerHTML = `
        <div style="text-align:center;padding:24px;color:var(--muted);font-size:13px;">
            🔄 Checking active device sessions on server...
        </div>
    `;

    const myDevId = getDeviceId();
    const myDevInfo = getDeviceInfo();

    let cloudUser = null;
    try {
        cloudUser = await GlobalCloudRest.fetchUser(state.accountUser);
    } catch(e) {
        cloudUser = null;
    }

    if (!cloudUser) {
        const accs = typeof CloudSync !== "undefined" && CloudSync.getAccounts ? CloudSync.getAccounts() : {};
        const localAcc = accs[(state.accountUser || "").toLowerCase()];
        if (localAcc) {
            cloudUser = {
                username: localAcc.username || state.accountUser,
                sessions: localAcc.sessions || { [myDevId]: myDevInfo }
            };
        } else {
            cloudUser = {
                username: state.accountUser,
                sessions: { [myDevId]: myDevInfo }
            };
        }
    }

    // Check if this device was revoked
    if (Array.isArray(cloudUser.revokedSessions) && cloudUser.revokedSessions.includes(myDevId)) {
        CloudSync.logout();
        toast("🔒 You have been logged out: This device was disconnected.");
        return;
    }

    let sessions = cloudUser.sessions || {};
    // Ensure current device is registered
    if (!sessions[myDevId]) {
        sessions[myDevId] = myDevInfo;
        cloudUser.sessions = sessions;
        try {
            await GlobalCloudRest.pushUser(state.accountUser, cloudUser);
        } catch(e) {}
    }

    const sessionList = Object.values(sessions);
    const currentDevice = sessionList.find(s => s.deviceId === myDevId) || myDevInfo;
    const otherDevices = sessionList.filter(s => s.deviceId !== myDevId);

    let html = "";

    // 1. CURRENT DEVICE CARD (Always clear & distinct)
    html += `
        <div style="margin-bottom:8px;">
            <div style="font-size:12px;font-weight:900;letter-spacing:1px;color:var(--green);text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                <span>🟢</span> Your Current Device (Active Now)
            </div>
            <div class="device-session-card current-device" style="display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 20px;border-radius:16px;background:linear-gradient(135deg,rgba(0,255,135,0.08),#061812);border:1px solid rgba(0,255,135,0.45);box-shadow:0 0 25px rgba(0,255,135,0.12);">
                <div class="device-left-wrap" style="display:flex;align-items:center;gap:16px;flex:1;">
                    <div class="device-icon-box" style="width:48px;height:48px;border-radius:14px;background:#13273c;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:24px;">
                        ${currentDevice.icon || "💻"}
                    </div>
                    <div style="display:flex;flex-direction:column;gap:3px;">
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <strong style="font-size:15px;color:#ffffff;font-weight:800;">${escapeHTML(currentDevice.deviceName || "Web Browser")}</strong>
                            <span class="device-current-pill" style="font-size:10px;font-weight:900;padding:2px 8px;border-radius:10px;background:rgba(0,255,135,0.2);color:var(--green);border:1px solid rgba(0,255,135,0.4);">YOU ARE HERE</span>
                        </div>
                        <span style="font-size:12px;color:#94a3b8;">● Active right now · Session ID: ${escapeHTML((currentDevice.deviceId || "").slice(0, 12))}...</span>
                    </div>
                </div>
                <div>
                    <span style="font-size:12px;color:var(--green);font-weight:800;background:rgba(0,255,135,0.1);padding:6px 12px;border-radius:10px;border:1px solid rgba(0,255,135,0.3);">✓ Active Session</span>
                </div>
            </div>
        </div>
    `;

    // 2. OTHER LOGGED-IN DEVICES SECTION
    html += `
        <div style="margin-top:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px;">
                <div style="font-size:12px;font-weight:900;letter-spacing:1px;color:var(--blue);text-transform:uppercase;display:flex;align-items:center;gap:6px;">
                    <span>📱</span> Other Connected Devices (${otherDevices.length})
                </div>
                ${
                    otherDevices.length > 1 
                    ? `<button class="device-logout-btn" style="padding:6px 14px;font-size:11px;" onclick="openKickDeviceModal('all_others', 'All Other Logged-In Devices')">🚪 Log Out All Others</button>` 
                    : ""
                }
            </div>
    `;

    if (!otherDevices.length) {
        html += `
            <div style="background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.12);border-radius:14px;padding:20px;text-align:center;">
                <div style="font-size:28px;margin-bottom:6px;">🔒</div>
                <h4 style="margin:0 0 4px;font-size:15px;color:#ffffff;">No Other Devices Connected</h4>
                <p style="color:var(--muted);font-size:13px;margin:0;line-height:1.5;">Your account is currently only active on this device. If you log in from your phone, tablet, or another browser, it will appear here so you can view it and remotely log it out with your password.</p>
            </div>
        `;
    } else {
        html += `<div style="display:flex;flex-direction:column;gap:10px;">`;
        otherDevices.forEach(s => {
            const lastActiveText = s.lastActive ? `Last active ${formatRelativeTime(s.lastActive)}` : "Active recently";
            html += `
                <div class="device-session-card" style="display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 20px;border-radius:16px;background:linear-gradient(135deg,#0e1e2d,#07131e);border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 25px rgba(0,0,0,0.45);">
                    <div class="device-left-wrap" style="display:flex;align-items:center;gap:16px;flex:1;">
                        <div class="device-icon-box" style="width:48px;height:48px;border-radius:14px;background:#13273c;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:24px;">
                            ${s.icon || "📱"}
                        </div>
                        <div style="display:flex;flex-direction:column;gap:3px;">
                            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                                <strong style="font-size:15px;color:#ffffff;font-weight:800;">${escapeHTML(s.deviceName || "Remote Device")}</strong>
                                <span class="device-remote-pill" style="font-size:10px;font-weight:900;padding:2px 8px;border-radius:10px;background:rgba(56,189,248,0.18);color:#38bdf8;border:1px solid rgba(56,189,248,0.4);">REMOTE</span>
                            </div>
                            <span style="font-size:12px;color:#94a3b8;">● ${lastActiveText} · Session ID: ${escapeHTML((s.deviceId || "").slice(0, 12))}...</span>
                        </div>
                    </div>
                    <div>
                        <button class="device-logout-btn" onclick="openKickDeviceModal('${s.deviceId}', '${escapeHTML(s.deviceName || "Remote Device")}')">
                            🚪 Log Out Device
                        </button>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
    list.innerHTML = html;
}

let onlineAccountsCache = {};

async function autoSyncCloud() {
    try {
        const localAccs = CloudSync.getAccounts();
        for (const k in localAccs) {
            const acc = localAccs[k];
            if (acc && acc.username) {
                await GlobalCloudRest.pushUser(acc.username, acc);
            }
        }
        const cloudUsers = await GlobalCloudRest.fetchAllUsers();
        if (cloudUsers && typeof cloudUsers === "object") {
            const merged = { ...localAccs, ...cloudUsers };
            CloudSync.saveAccounts(merged);
            onlineAccountsCache = merged;
        }
        if (state.accountUser) {
            await GlobalCloudRest.pushLeaderboard(state.accountUser, state);
        }
    } catch (e) {}
}

async function fetchOnlineGlobalAccounts() {
    await autoSyncCloud();
    return CloudSync.getAccounts();
}

async function pushOnlineGlobalAccount(username, accountPayload) {
    try {
        const local = CloudSync.getAccounts();
        local[username.toLowerCase()] = accountPayload;
        CloudSync.saveAccounts(local);
        await GlobalCloudRest.pushUser(username, accountPayload);
    } catch (e) {}
}

const CloudSync = {
    getAccounts() {
        try {
            return JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}");
        } catch (e) { return {}; }
    },
    saveAccounts(accs) {
        try { localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(accs)); } catch (e) {}
    },
    getTrades() {
        try {
            return JSON.parse(localStorage.getItem(CLOUD_TRADES_KEY) || "[]");
        } catch (e) { return []; }
    },
    saveTrades(trades) {
        try { localStorage.setItem(CLOUD_TRADES_KEY, JSON.stringify(trades)); } catch (e) {}
    },

    async signUp(username, password) {
        const u = username.trim();
        const p = password.trim();
        if (u.length < 2) return { success: false, msg: "Username must be at least 2 characters." };
        if (p.length < 3) return { success: false, msg: "Password must be at least 3 characters." };

        const key = u.toLowerCase();

        // 1. Check Local Accounts
        const accs = this.getAccounts();
        if (accs[key]) {
            return { success: false, msg: `Username "${u}" is already registered. Please log in.` };
        }

        // 2. Check Remote Cloud Database (CRITICAL: prevents overwriting existing accounts!)
        try {
            const cloudUser = await GlobalCloudRest.fetchUser(u);
            if (cloudUser && cloudUser.username) {
                return { success: false, msg: `Username "${u}" is already taken in the Cloud. Please log in instead.` };
            }
        } catch (e) {}

        // 3. Register New Account with Cryptographic Hash
        const passHash = await hashPassword(p);
        const fresh = freshState();
        fresh.accountUser = u;
        fresh.accountPassHash = passHash;
        fresh.name = u;
        fresh.initialized = true;
        fresh.cards = [];
        fresh.unlockedCardNames = [];
        fresh.coins = 100;
        fresh.xp = 0;
        fresh.level = 1;
        state = fresh;
        AntiCheat.signState(state);

        const accObj = {
            username: u,
            passwordHash: passHash,
            saveData: JSON.stringify(state),
            updatedAt: Date.now()
        };
        accs[key] = accObj;
        this.saveAccounts(accs);
        await pushOnlineGlobalAccount(u, accObj);

        saveGame();
        renderAll();
        updateAuthUI();
        checkAdminStatus();
        autoSyncCloud();
        return { success: true, msg: `Account "${u}" successfully created and secured!` };
    },

    async login(username, password) {
        const u = username.trim();
        const p = password.trim();
        if (!u || !p) return { success: false, msg: "Please enter your username and password." };

        const key = u.toLowerCase();
        let accs = this.getAccounts();
        let cloudUser = null;

        // 1. Fetch official credential from Cloud Database first
        try {
            cloudUser = await GlobalCloudRest.fetchUser(u);
        } catch (e) {}

        let acc = cloudUser || accs[key];

        if (!acc) {
            return { success: false, msg: `Account "${u}" not found. Please check spelling or create an account.` };
        }

        // 2. Strict Password Verification via Cryptographic SHA-256 Hash
        const passHash = await hashPassword(p);
        if (acc.passwordHash) {
            if (acc.passwordHash !== passHash) {
                return { success: false, msg: "Incorrect password! Access denied." };
            }
        } else if (acc.password) {
            // Legacy plaintext fallback: verify and upgrade immediately to hash
            if (acc.password !== p) {
                return { success: false, msg: "Incorrect password! Access denied." };
            }
            acc.passwordHash = passHash;
            delete acc.password; // Strip plaintext permanently!
        } else {
            acc.passwordHash = passHash;
        }

        // Save authenticated credential locally & push to cloud
        accs[key] = acc;
        this.saveAccounts(accs);
        try { await GlobalCloudRest.pushUser(u, acc); } catch(e) {}

        if (acc.saveData) {
            try {
                const cloudSave = typeof acc.saveData === "string" ? JSON.parse(acc.saveData) : acc.saveData;
                state = {
                    ...freshState(),
                    ...cloudSave,
                    accountUser: acc.username || u,
                    accountPassHash: passHash,
                    name: cloudSave.name || acc.username || u,
                    cards: Array.isArray(cloudSave.cards) ? cloudSave.cards : [],
                    stats: { ...freshState().stats, ...(cloudSave.stats || {}) },
                    tournamentDraft: { ...freshState().tournamentDraft, ...(cloudSave.tournamentDraft || {}) }
                };
            } catch (e) {
                const fresh = freshState();
                fresh.accountUser = acc.username || u;
                fresh.accountPassHash = passHash;
                fresh.name = acc.username || u;
                state = fresh;
            }
        } else {
            const fresh = freshState();
            fresh.accountUser = acc.username || u;
            fresh.accountPassHash = passHash;
            fresh.name = acc.username || u;
            state = fresh;
        }

        AntiCheat.signState(state);
        saveGame();
        renderAll();
        updateAuthUI();
        checkAdminStatus();
        checkBanStatus();
        autoSyncCloud();
        return { success: true, msg: `Welcome back, ${state.accountUser}! Game progress loaded.` };
    },

    logout() {
        ServerAPI.setToken("");
        state = freshState();
        AntiCheat.signState(state);
        saveGame();
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
        const accs = this.getAccounts();
        const key = state.accountUser.toLowerCase();
        if (accs[key]) {
            accs[key].saveData = JSON.stringify(state);
            accs[key].updatedAt = Date.now();
            this.saveAccounts(accs);
            pushOnlineGlobalAccount(state.accountUser, accs[key]);
        }
    }
};

function syncCloud() {
    CloudSync.sync();
    updateAuthUI();
}

function manualSyncCloud() {
    syncCloud();
    SoundFx.coin();
    toast("Synced progress to Firebase online cloud!");
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

    setInterval(updateTimers, 1000);
    setInterval(checkMissionResets, 1000);
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

    const revealBtn = document.getElementById("revealCollectBtn");
    if (revealBtn) {
        revealBtn.addEventListener("click", () => {
            SoundFx.click();
            const overlay = document.getElementById("cardRevealOverlay");
            if (overlay) overlay.classList.add("hidden");
            unlockModalScroll();
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

    // Clear any error messages
    const deleteErr = document.getElementById("deleteAccountError");
    if (deleteErr) deleteErr.textContent = "";
    const deletePassInput = document.getElementById("deleteAccountPasswordInput");
    if (deletePassInput) deletePassInput.value = "";
}

function updateCoinDisplay() {
    AntiCheat.validateState(state);
    setText("coinDisplay", (Number(state.coins) || 0).toLocaleString());
}

function renderHero() {
    setText("homeName", state.name || state.accountUser || "Player");
    setText("homeLevel", state.level);
    setText("homeXP", state.xp);
    const needed = state.level * 50;
    const pct = Math.min(100, (state.xp / needed) * 100);
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

function initPackSwipeGesture(onTear) {
    packTearCallback = onTear;
    packTornExecuted = false;

    const overlay = document.getElementById("packOpeningOverlay");
    const stage = document.getElementById("packsDisplayStage");
    const packs = document.querySelectorAll("#packsDisplayStage .luxury-booster-pack");
    const prompt = document.getElementById("tearSwipePrompt");

    if (!overlay || !packs.length) return;

    const gestureReadyAt = Date.now() + 350; // Guard against initial button click release!

    function executeTear() {
        if (Date.now() < gestureReadyAt) return;
        if (packTornExecuted) return;
        packTornExecuted = true;
        
        packs.forEach((p, idx) => {
            setTimeout(() => {
                p.classList.add("pack-torn");
            }, idx * 50);
        });
        
        SoundFx.packTear();
        if (typeof createConfetti === "function") createConfetti();

        setTimeout(() => {
            if (packTearCallback) {
                const cb = packTearCallback;
                packTearCallback = null;
                cb();
            }
        }, 750);
    }

    window.executePackTear = executeTear;

    // 1. Direct Tap / Click on Prompt Button
    if (prompt) {
        prompt.onclick = (e) => {
            e.stopPropagation();
            executeTear();
        };
    }

    // 2. Click or Drag handling across all packs & stage
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

        // Mouse Move Tilt
        pack.onmousemove = (e) => {
            if (packTornExecuted) return;
            const rect = pack.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            rotY = x * 20;
            rotX = -y * 20;
            updateTransform();
        };

        pack.onmouseleave = () => {
            if (packTornExecuted) return;
            rotX = 0;
            rotY = 0;
            updateTransform();
        };

        // Click or Tap anywhere on pack to tear!
        pack.onclick = (e) => {
            e.stopPropagation();
            executeTear();
        };

        // Mouse Down / Touch Drag
        pack.onmousedown = (e) => {
            if (e.button === 2) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        };

        window.onmousemove = (e) => {
            if (!isDragging || packTornExecuted) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Any swipe >= 12px tears the pack
            if (dist >= 12) {
                isDragging = false;
                executeTear();
            }
        };

        window.onmouseup = () => {
            if (isDragging && !packTornExecuted) {
                isDragging = false;
                executeTear();
            }
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

            if (dist >= 10) {
                isDragging = false;
                executeTear();
            }
        };

        pack.ontouchend = () => {
            if (isDragging && !packTornExecuted) {
                isDragging = false;
                executeTear();
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

    const pack = PACKS[type];
    if (!pack) return;

    const pullCount = Math.max(1, Math.min(5, Number(count) || 1));
    const totalCost = pack.cost * pullCount;

    if (Number(state.coins || 0) < totalCost) {
        toast(`Not enough coins! Need ${totalCost.toLocaleString()} 🪙 (You have ${Number(state.coins || 0).toLocaleString()} 🪙).`);
        SoundFx.click();
        return;
    }

    if (!spendCoins(totalCost)) return;

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
            addCoins(pack.cost);
            continue;
        }

        const duplicate = state.cards.some(c => c.player === player.name);
        const isFirstDiscovery = !state.unlockedCardNames.includes(player.name);

        if (isFirstDiscovery) {
            state.unlockedCardNames.push(player.name);
            const bonus = DISCOVERY_BONUS[rarity] || 10;
            addCoins(bonus);
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

        state.cards.push(card);
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

    saveGame();

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
    openNextSequentialPack();
}

function openNextSequentialPack() {
    if (!activePackSequence || activePackSequence.currentIndex >= activePackSequence.total) {
        activePackSequence = null;
        unlockModalScroll();
        renderAll();
        return;
    }

    const currentItem = activePackSequence.queue[activePackSequence.currentIndex];
    const packNum = activePackSequence.currentIndex + 1;
    const totalPacks = activePackSequence.total;
    const cfg = activePackSequence.cfg;

    // Render single pack for this individual step
    renderBoosterPacksInStage(cfg, 1);

    const animOverlay = document.getElementById("packOpeningOverlay");
    const swipePrompt = document.getElementById("tearSwipePrompt");
    if (swipePrompt) {
        swipePrompt.textContent = totalPacks > 1 
            ? `👉 SWIPE ACROSS TO TEAR PACK (${packNum}/${totalPacks}) ➔` 
            : "👉 SWIPE ACROSS TO TEAR ➔";
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
            deliverSinglePackCard(currentItem, packNum, totalPacks);
        });
    }
}

function deliverSinglePackCard(item, packNum, totalPacks) {
    const { card, duplicate, isFirstDiscovery } = item;

    function proceedToCardReveal() {
        showCardResult(card, duplicate, isFirstDiscovery, packNum, totalPacks);
    }

    if (card.rarity === "World Class" || card.rarity === "Secret" || card.rarity === "Mythic") {
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
        activePackSequence.currentIndex++;
        if (activePackSequence.currentIndex < activePackSequence.total) {
            // Open the next individual pack in sequence!
            openNextSequentialPack();
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
    let random = Math.random() * 100;
    for (const rarity of Object.keys(rates)) {
        random -= rates[rarity];
        if (random < 0) return rarity;
    }
    return Object.keys(rates)[Object.keys(rates).length - 1];
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

        const c = this.activeCard;
        if (!c) return;

        const normName = (c.player || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const isMonkey = normName.includes("monkey") || normName.includes("wukong");
        const isMessi = normName.includes("messi");
        const isRonaldo = normName.includes("ronaldo");
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

        // Check if part of multi-pack opening sequence (e.g. 3-pack, 5-pack)
        if (activePackSequence) {
            activePackSequence.currentIndex++;
            if (activePackSequence.currentIndex < activePackSequence.total) {
                // Continue opening next pack in sequence!
                openNextSequentialPack();
                return;
            } else {
                // All packs in sequence opened! Show multi-summary!
                const allCards = activePackSequence.queue;
                activePackSequence = null;
                if (allCards && allCards.length > 1) {
                    showMultiCardResult(allCards);
                    return;
                }
            }
        }

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
    const revealBonus = document.getElementById("revealBonusBadge");
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

        if (revealBonus) {
            const bonus = DISCOVERY_BONUS[card.rarity] || 10;
            revealBonus.textContent = `+${bonus} 🪙 FIRST DISCOVERY BONUS!`;
            revealBonus.style.display = isFirstDiscovery ? "block" : "none";
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
    setText("card3DStatsVal", `${DUPLICATE_VALUES[player.rarity] || 5} Coins`);

    const dateObj = (cardObj && cardObj.obtained) ? new Date(cardObj.obtained) : new Date();
    const dateFormatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeFormatted = dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setText("card3DStatsDateTime", `${dateFormatted} · ${timeFormatted}`);

    if (cardObj && cardObj.serialNumber) {
        setText("card3DStatsPop", `⚡ 10 Exist Worldwide (#${cardObj.serialNumber}/10)`);
    } else if (player.rarity === "World Class") {
        setText("card3DStatsPop", `⚡ 10 Exist Worldwide`);
    } else {
        setText("card3DStatsPop", `⚡ Official Series 2026`);
    }

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

    const basePlayers = PLAYERS.filter(p => !p.hiddenFromIndex);
    let list = [...basePlayers];
    if (filter && filter.value !== "all") {
        list = list.filter(p => p.rarity.toLowerCase() === filter.value.toLowerCase());
    }

    const total = basePlayers.length;
    const discoveredCount = basePlayers.filter(p => state.unlockedCardNames.includes(p.name) || state.cards.some(c => c.player === p.name)).length;
    const pct = Math.round((discoveredCount / total) * 100);

    setText("indexProgressText", `${discoveredCount} / ${total} Players Discovered (${pct}%)`);
    const pBar = document.getElementById("indexProgressBar");
    if (pBar) pBar.style.width = `${pct}%`;

    grid.innerHTML = list.map(player => {
        const isUnlocked = state.unlockedCardNames.includes(player.name) || state.cards.some(c => c.player === player.name);
        const rClass = rarityClassName(player.rarity);

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
            <small style="color:var(--green);font-weight:800;">✓ Discovered</small>
            <div style="margin-top:8px;">
                <button class="primary-btn" style="padding:6px 12px;font-size:11px;" onclick="event.stopPropagation(); open3DCard('${escapeHTML(player.name)}')">🔍 3D View</button>
            </div>
        </article>
        `;
    }).join("");
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
    addCoins(totalGain);
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
    addCoins(totalGain);
    SoundFx.sell();
    saveGame();
    renderCards();
    renderShowcase();
    toast(`💰 Sold ${unlocked.length} ${targetRarity} cards for +${totalGain.toLocaleString()} 🪙!`);
}

function quickSellDuplicates() {
    const seen = new Set();
    const toSell = [];

    // Keep the best / locked copies, sell duplicates of unlocked cards
    state.cards.forEach(c => {
        if (c.locked || c.serialNumber) return;
        if (seen.has(c.player)) {
            toSell.push(c);
        } else {
            seen.add(c.player);
        }
    });

    if (!toSell.length) {
        toast("No unlocked duplicate cards found.");
        return;
    }

    let totalGain = 0;
    toSell.forEach(c => {
        totalGain += (DUPLICATE_VALUES[c.rarity] || 5);
        state.stats.cardsSold++;
    });

    const sellIds = new Set(toSell.map(c => c.id));
    state.cards = state.cards.filter(c => !sellIds.has(c.id));
    state.showcase = state.showcase.map(slotId => sellIds.has(slotId) ? null : slotId);

    progressMission("sell", toSell.length);
    addCoins(totalGain);
    SoundFx.sell();
    saveGame();
    renderCards();
    renderShowcase();
    toast(`⚡ Quick Sold ${toSell.length} duplicate cards for +${totalGain.toLocaleString()} 🪙!`);
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
        const obtainedDate = card.obtained ? new Date(card.obtained).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Aug 30, 2026";
        const popTag = card.serialNumber ? `⚡ 10 Exist (#${card.serialNumber}/10)` : (card.rarity === "World Class" ? "⚡ 10 Exist" : "⚡ Official");
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
            <div class="card-position">${escapeHTML(card.pos)}</div>
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
    const value = DUPLICATE_VALUES[card.rarity] || 5;

    state.cards.splice(index, 1);
    state.stats.cardsSold++;
    SoundFx.sell();
    progressMission("sell", 1);
    addCoins(value);

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

function searchPlayerProfile() {
    const input = document.getElementById("playerSearchInput");
    if (!input || !input.value.trim()) {
        toast("Please enter a username to search.");
        return;
    }
    const query = input.value.trim().toLowerCase();
    const accs = CloudSync.getAccounts();

    let targetUser = null;
    for (const key in accs) {
        if (key === query || accs[key].username.toLowerCase() === query) {
            targetUser = accs[key];
            break;
        }
    }

    if (!targetUser) {
        toast(`No player found with username "${input.value.trim()}".`);
        return;
    }

    let pData;
    try {
        pData = JSON.parse(targetUser.saveData);
    } catch (e) {
        toast("Could not read player data.");
        return;
    }

    searchedUserData = pData;

    setText("searchedName", pData.name || targetUser.username);
    const titleBadge = document.getElementById("searchedTitle");
    if (titleBadge) {
        const titleObj = TITLES.find(t => t.name === pData.equippedTitle) || TITLES[0];
        titleBadge.textContent = titleObj.name;
        titleBadge.className = `equipped-title-badge ${titleObj.cssClass}`;
    }

    setText("searchedMeta", `Level ${pData.level || 1} · ${(pData.cards || []).length} Cards Collected`);
    const pImg = document.getElementById("searchedAvatarImg");
    if (pImg) pImg.src = pData.avatar || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80";

    const sWrap = document.getElementById("searchedAvatarWrap");
    if (sWrap) {
        const frame = FRAMES.find(f => f.id === pData.profileFrame) || FRAMES[0];
        sWrap.className = `profile-avatar-wrapper ${frame.css}`;
    }

    const sGrid = document.getElementById("searchedShowcaseGrid");
    if (sGrid) {
        const showcase = pData.showcase || [null, null, null, null, null, null];
        sGrid.innerHTML = showcase.map((cId, idx) => {
            const card = (pData.cards || []).find(c => c.id === cId);
            if (!card) {
                return `<div class="showcase-slot" style="min-height:260px;"><span style="color:var(--muted)">Empty Slot ${idx + 1}</span></div>`;
            }
            const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
            return `
            <div class="showcase-slot" style="min-height:260px;">
                <article class="card showcase-card ${frame.css}" style="min-height:250px;">
                    <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                    <div class="card-image-wrap" style="height:120px;">
                        <img class="card-photo" src="${card.image || ''}">
                    </div>
                    <div class="card-rating">${card.rating}</div>
                    <div class="card-position">${escapeHTML(card.pos)}</div>
                    <h4>${escapeHTML(card.player)}</h4>
                </article>
            </div>
            `;
        }).join("");
    }

    const modal = document.getElementById("profileSearchModal");
    if (modal) modal.classList.remove("hidden");
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

    const baseTable = {
        "Common": 100,
        "Uncommon": 350,
        "Rare": 1200,
        "Epic": 6000,
        "Legendary": 30000,
        "Exclusive": 100000,
        "Mythic": 500000,
        "Secret": 1500000,
        "Tournament": 4000000,
        "World Class": 10000000,
        "Developer": 50000000
    };
    const ratingMultiplier = {
        "Common": 2,
        "Uncommon": 5,
        "Rare": 15,
        "Epic": 60,
        "Legendary": 250,
        "Exclusive": 1000,
        "Mythic": 3500,
        "Secret": 10000,
        "Tournament": 25000,
        "World Class": 65000,
        "Developer": 250000
    };

    const rarity = card.rarity || "Common";
    let rap = (baseTable[rarity] || 100) + (Number(card.rating) || 75) * (ratingMultiplier[rarity] || 2);
    return Math.round(rap);
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
            const outDoc = await LiveTradeNetwork.fetchCloud(`trade_req_${activeOutgoingTradeRequest.recipient.toLowerCase()}`);
            if (outDoc && outDoc.id === activeOutgoingTradeRequest.tradeId) {
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
                    const tid = activeOutgoingTradeRequest.tradeId;
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

    list.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">Fetching active online players...</p>`;

    let allUsers = await GlobalCloudRest.fetchAllUsers();
    let localAccs = CloudSync.getAccounts();
    let merged = { ...localAccs, ...allUsers };

    const myName = (state.accountUser || "").toLowerCase();
    const otherPlayers = [];

    for (const key in merged) {
        if (key.toLowerCase() !== myName && !key.includes("_1787") && !key.includes("ipadtest")) {
            const u = merged[key];
            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch(e) {}
            otherPlayers.push({
                username: u.username || key,
                name: pData.name || u.username || key,
                level: pData.level || 1,
                cards: (pData.cards || []).length,
                title: pData.equippedTitle || "Collector"
            });
        }
    }

    if (!otherPlayers.length) {
        list.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">No other online players found yet. Invite a friend to play!</p>`;
    } else {
        list.innerHTML = otherPlayers.map(p => `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="font-size:26px;">👤</div>
                    <div>
                        <strong style="color:#fff;font-size:14px;">${escapeHTML(p.username)}</strong>
                        <p style="margin:2px 0 0;font-size:11px;color:var(--cyan);">${escapeHTML(p.title)} · Level ${p.level}</p>
                    </div>
                </div>
                <button class="primary-btn" style="width:auto;padding:8px 16px;font-size:12px;background:linear-gradient(135deg,#00f2fe,#4facfe);font-weight:900;" onclick="sendTradeOffer('${escapeHTML(p.username)}')">🤝 Trade</button>
            </div>
        `).join("");
    }
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
   SHOP
   ========================================================= */

function renderShop() {
    const backgrounds = document.getElementById("backgroundShop");
    if (backgrounds) {
        backgrounds.innerHTML = BACKGROUNDS.map(bg => {
            const owned = (state.ownedBackgrounds || []).includes(bg.id);
            return `
            <div class="shop-item">
                <div class="shop-preview" style="background:${bg.css}"></div>
                <h3>${escapeHTML(bg.name)}</h3>
                <p>${bg.cost === 0 ? "Free" : bg.cost + " coins"}</p>
                <button ${owned ? "disabled" : ""} class="${owned ? "owned" : "primary-btn"}" onclick="buyBackground('${bg.id}')">
                    ${owned ? "Owned" : "Buy Atmosphere"}
                </button>
            </div>
            `;
        }).join("");
    }
}

function buyBackground(id) {
    const bg = BACKGROUNDS.find(b => b.id === id);
    if (!bg || state.ownedBackgrounds.includes(id)) return;
    if (!spendCoins(bg.cost)) return;

    state.ownedBackgrounds.push(id);
    saveGame();
    renderShop();
    renderProfile();
    SoundFx.coin();
    toast(`Unlocked Stadium: ${bg.name}`);
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
    addCoins(mission[2]);
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

function updateLimitedTimer() {
    const timer = document.getElementById("limitedCountdown");
    if (!timer) return;
    const th = getThailandTime();
    const day = th.getDay();
    const daysUntilMon = (8 - (day === 0 ? 7 : day)) % 7 || 7;
    const target = new Date(th);
    target.setDate(th.getDate() + daysUntilMon);
    target.setHours(7, 0, 0, 0);

    const diff = target.getTime() - th.getTime();
    timer.textContent = "Weekly Reset in " + formatCountdown(diff);
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
    addCoins(100);
    addXP(10);
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

async function renderLeaderboard() {
    const list = document.getElementById("globalLeaderboard") || document.getElementById("leaderboardList");
    if (!list) return;

    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted);"><span class="pack-spinner" style="display:inline-block;width:28px;height:28px;border:3px solid rgba(255,255,255,0.2);border-top-color:var(--green);border-radius:50%;animation:spin 0.8s linear infinite;"></span><p style="margin-top:12px;font-size:14px;font-weight:700;">Connecting to Global Online Leaderboard...</p></div>`;

    let fbLeaderboard = await FirebaseSync.fetchLeaderboard();
    let fbUsers = await FirebaseSync.fetchAllUsers();
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
            const isWiped = pData.resetV12WipeDone === true;
            if (!playersMap[k.toLowerCase()]) {
                playersMap[k.toLowerCase()] = {
                    name: pData.name || u.username,
                    username: u.username,
                    gold: isWiped ? Number(pData.coins || 100) : 100,
                    value: isWiped ? calculateCollectionValue(pData.cards || []) : 0,
                    cards: isWiped ? (pData.cards || []).length : 0,
                    level: isWiped ? (pData.level || 1) : 1,
                    equippedTitle: pData.equippedTitle || "Collector",
                    profileFrame: pData.profileFrame || "default",
                    avatar: pData.avatar || "player_temp.png",
                    bannedUntil: pData.bannedUntil || 0
                };
            }
        }
    }

    // 3. Ingest local accounts
    for (const k in localAccs) {
        const u = localAccs[k];
        let pData = {};
        try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch(e) {}
        const isWiped = pData.resetV12WipeDone === true;
        if (!playersMap[k.toLowerCase()]) {
            playersMap[k.toLowerCase()] = {
                name: pData.name || u.username,
                username: u.username,
                gold: isWiped ? Number(pData.coins || 100) : 100,
                value: isWiped ? calculateCollectionValue(pData.cards || []) : 0,
                cards: isWiped ? (pData.cards || []).length : 0,
                level: isWiped ? (pData.level || 1) : 1,
                equippedTitle: pData.equippedTitle || "Collector",
                profileFrame: pData.profileFrame || "default",
                avatar: pData.avatar || "player_temp.png",
                bannedUntil: pData.bannedUntil || 0
            };
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
        bannedUntil: state.bannedUntil || 0,
        isSelf: true
    };

    let playersList = Object.values(playersMap);
    playersList = playersList.filter(p => {
        if (!p || !p.username) return false;
        const u = p.username.toLowerCase();
        if (u.includes("_1787") || u.includes("ipadtest_") || u.includes("testuser") || u === "ipadtester" || u === "playertwo") {
            return false;
        }
        return p.isSelf || !p.bannedUntil || p.bannedUntil <= Date.now();
    });

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

        return `
        <div class="lb-podium-card rank-${rankNum} ${isMe ? 'self' : ''}">
            ${crown}
            <div class="lb-podium-avatar-wrap">
                <img class="lb-podium-avatar frame-${p.profileFrame || 'default'}" src="${escapeHTML(p.avatar || 'player_temp.png')}" alt="${escapeHTML(p.name)}" onerror="this.src='player_temp.png'">
                <div class="lb-podium-rank-badge">${rankLabel}</div>
            </div>
            <div class="lb-podium-name">
                <span>${escapeHTML(p.name)}</span>
                ${isMe ? '<span style="color:var(--green);font-size:11px;">(You)</span>' : ''}
            </div>
            ${p.equippedTitle ? `<span class="equipped-title-badge ${titleObj.cssClass}" style="font-size:10px;padding:2px 8px;margin-top:2px;">${escapeHTML(p.equippedTitle)}</span>` : ''}
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

            html += `
            <div class="lb-table-row ${isMe ? 'self' : ''}">
                <div class="lb-row-rank">#${rank}</div>
                <div class="lb-row-user">
                    <img class="lb-row-avatar frame-${p.profileFrame || 'default'}" src="${escapeHTML(p.avatar || 'player_temp.png')}" alt="${escapeHTML(p.name)}" onerror="this.src='player_temp.png'">
                    <div class="lb-row-info">
                        <div class="lb-row-name-wrap">
                            <strong class="lb-row-name">${escapeHTML(p.name)}</strong>
                            ${isMe ? '<span style="color:var(--green);font-size:11px;font-weight:800;">(You)</span>' : ''}
                            ${p.equippedTitle ? `<span class="equipped-title-badge ${titleObj.cssClass}" style="font-size:10px;padding:2px 8px;">${escapeHTML(p.equippedTitle)}</span>` : ''}
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
    const tabs = ["currency", "cards", "level", "titles", "tournament", "moderation", "delete"];
    tabs.forEach(t => {
        const btn = document.getElementById(`adminTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
        const content = document.getElementById(`adminTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (btn) btn.classList.toggle("active", t === tabName);
        if (content) content.style.display = (t === tabName) ? "block" : "none";
    });
}

async function wipeAccountEverywhere(username) {
    if (!username) return false;
    const u = username.trim().toLowerCase();
    try {
        // 1. Wipe from cloud user record (KVDB)
        const BUCKET = GlobalCloudRest.BUCKET_URL;
        const userKey = `user_${u}`;
        const lbKey = `lb_${u}`;
        const tradeKey = `trade_${u}`;

        // Delete user record
        try { await fetch(`${BUCKET}/${userKey}`, { method: "DELETE" }); } catch(e) {}
        // Delete leaderboard entry
        try { await fetch(`${BUCKET}/${lbKey}`, { method: "DELETE" }); } catch(e) {}
        // Delete any trade sessions involving this user
        try { await fetch(`${BUCKET}/${tradeKey}`, { method: "DELETE" }); } catch(e) {}

        // 2. Wipe from local CloudSync accounts
        const accs = CloudSync.getAccounts();
        if (accs[u]) {
            delete accs[u];
            CloudSync.saveAccounts(accs);
        }

        // 3. Wipe from leaderboard data (KVDB lb_ key already done above)
        // If the deleted user was the current user, log them out
        if (state.accountUser && state.accountUser.toLowerCase() === u) {
            state = freshState();
            AntiCheat.signState(state);
            try { localStorage.removeItem(CURRENT_SAVE_KEY); } catch(e) {}
            saveGame();
            renderAll();
            updateAuthUI();
            checkAdminStatus();
        }

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

    const enteredHash = await hashPassword(enteredPass);
    // Verify against stored hash
    let cloudUser = await GlobalCloudRest.fetchUser(state.accountUser);
    let validHash = (cloudUser && cloudUser.passwordHash) ? cloudUser.passwordHash : state.accountPassHash;
    if (!validHash && cloudUser && cloudUser.password) {
        validHash = await hashPassword(cloudUser.password);
    }

    if (enteredHash !== validHash) {
        if (errEl) errEl.textContent = "❌ Incorrect password. Account not deleted.";
        return;
    }

    if (errEl) errEl.textContent = "";
    const username = state.accountUser;
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

    if (!target || target.toLowerCase() === (state.accountUser || state.name || "").toLowerCase()) {
        state.coins += amount;
        state.stats.coinsEarned += amount;
        AntiCheat.signState(state);
        saveGame();
        renderAll();
        SoundFx.coin();
        toast(`👑 Admin: Added +${amount.toLocaleString()} 🪙 to your account!`);
    } else {
        const accs = CloudSync.getAccounts();
        const key = target.toLowerCase();
        if (accs[key]) {
            try {
                const s = typeof accs[key].saveData === "string" ? JSON.parse(accs[key].saveData) : accs[key].saveData;
                s.coins = (s.coins || 0) + amount;
                s.stats = s.stats || {};
                s.stats.coinsEarned = (s.stats.coinsEarned || 0) + amount;
                accs[key].saveData = JSON.stringify(s);
                CloudSync.saveAccounts(accs);
                FirebaseSync.pushUser(accs[key].username, accs[key]);
                toast(`👑 Admin: Injected +${amount.toLocaleString()} 🪙 into player "${accs[key].username}"!`);
            } catch(e) {}
        } else {
            FirebaseSync.pushUser(target, {
                username: target,
                saveData: JSON.stringify({ ...freshState(), name: target, accountUser: target, coins: amount })
            });
            toast(`👑 Admin: Online cloud synced +${amount.toLocaleString()} 🪙 for "${target}"!`);
        }
    }
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

    if (!target || target.toLowerCase() === (state.accountUser || state.name || "").toLowerCase()) {
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
        // Send directly to the target player's cloud account!
        try {
            let cloudUser = await GlobalCloudRest.fetchUser(target);
            let targetSave = null;
            if (cloudUser && cloudUser.saveData) {
                targetSave = typeof cloudUser.saveData === "string" ? JSON.parse(cloudUser.saveData) : cloudUser.saveData;
            }
            if (!targetSave) {
                const accs = CloudSync.getAccounts();
                const key = target.toLowerCase();
                if (accs[key]) {
                    targetSave = typeof accs[key].saveData === "string" ? JSON.parse(accs[key].saveData) : accs[key].saveData;
                }
            }
            if (!targetSave) {
                targetSave = { ...freshState(), name: target, accountUser: target };
            }

            targetSave.cards = targetSave.cards || [];
            targetSave.cards.unshift(newCard);
            targetSave.stats = targetSave.stats || {};
            targetSave.stats.cardsPulled = (targetSave.stats.cardsPulled || 0) + 1;

            const updatedDoc = {
                username: target,
                saveData: JSON.stringify(targetSave),
                lastUpdated: Date.now()
            };

            await GlobalCloudRest.pushAccount(target, updatedDoc);
            if (typeof FirebaseSync !== "undefined" && FirebaseSync.pushUser) {
                FirebaseSync.pushUser(target, updatedDoc);
            }
            const accs = CloudSync.getAccounts();
            accs[target.toLowerCase()] = { username: target, saveData: JSON.stringify(targetSave) };
            CloudSync.saveAccounts(accs);

            toast(`👑 Admin: Sent 99 OVR Monkey King Developer Card to player "${target}"!`);
            SoundFx.levelUp();
            if (targetInput) targetInput.value = "";
        } catch(e) {
            toast(`👑 Admin: Sent 99 OVR Monkey King into "${target}"'s cloud storage!`);
        }
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

    if (!target || target.toLowerCase() === (state.accountUser || state.name || "").toLowerCase()) {
        state.cards.unshift(newCard);
        state.stats.cardsPulled++;
        if (!p.hiddenFromIndex && !state.unlockedCardNames.includes(p.name)) {
            state.unlockedCardNames.push(p.name);
        }
        AntiCheat.signState(state);
        saveGame();
        renderAll();
        SoundFx.levelUp();
        toast(`✨ Admin: Spawned ${p.name} ${isSerialized ? `(★ SERIAL #${sNum}/10)` : ""} to collection!`);
    } else {
        try {
            let cloudUser = await GlobalCloudRest.fetchUser(target);
            let targetSave = null;
            if (cloudUser && cloudUser.saveData) {
                targetSave = typeof cloudUser.saveData === "string" ? JSON.parse(cloudUser.saveData) : cloudUser.saveData;
            }
            if (!targetSave) {
                const accs = CloudSync.getAccounts();
                const key = target.toLowerCase();
                if (accs[key]) {
                    targetSave = typeof accs[key].saveData === "string" ? JSON.parse(accs[key].saveData) : accs[key].saveData;
                }
            }
            if (!targetSave) {
                targetSave = { ...freshState(), name: target, accountUser: target };
            }

            targetSave.cards = targetSave.cards || [];
            targetSave.cards.unshift(newCard);
            targetSave.stats = targetSave.stats || {};
            targetSave.stats.cardsPulled = (targetSave.stats.cardsPulled || 0) + 1;

            const updatedDoc = {
                username: target,
                saveData: JSON.stringify(targetSave),
                lastUpdated: Date.now()
            };

            await GlobalCloudRest.pushAccount(target, updatedDoc);
            if (typeof FirebaseSync !== "undefined" && FirebaseSync.pushUser) {
                FirebaseSync.pushUser(target, updatedDoc);
            }
            const accs = CloudSync.getAccounts();
            accs[target.toLowerCase()] = { username: target, saveData: JSON.stringify(targetSave) };
            CloudSync.saveAccounts(accs);

            toast(`✨ Admin: Sent ${p.name} ${isSerialized ? `(★ SERIAL #${sNum}/10)` : ""} to player "${target}"!`);
            SoundFx.levelUp();
            const targetInput = document.getElementById("adminCardTarget");
            if (targetInput) targetInput.value = "";
        } catch(e) {
            toast(`Player "${target}" not found or cloud sync error.`);
        }
    }
}

function adminExecuteSetLevel() {
    if (!isUserAdmin()) return;
    const target = (document.getElementById("adminLevelTarget").value || "").trim();
    const lvl = Math.max(1, Number(document.getElementById("adminLevelInput").value) || 1);

    if (!target || target.toLowerCase() === (state.accountUser || state.name || "").toLowerCase()) {
        state.level = lvl;
        state.xp = 0;
        AntiCheat.signState(state);
        saveGame();
        renderAll();
        SoundFx.levelUp();
        toast(`👑 Admin: Set your level to Level ${lvl}!`);
    } else {
        const accs = CloudSync.getAccounts();
        const key = target.toLowerCase();
        if (accs[key]) {
            try {
                const s = typeof accs[key].saveData === "string" ? JSON.parse(accs[key].saveData) : accs[key].saveData;
                s.level = lvl;
                s.xp = 0;
                accs[key].saveData = JSON.stringify(s);
                CloudSync.saveAccounts(accs);
                FirebaseSync.pushUser(accs[key].username, accs[key]);
                toast(`👑 Admin: Set level of "${accs[key].username}" to Level ${lvl}!`);
            } catch(e) {}
        }
    }
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
    state.equippedTitle = "Season 1 Champion";
    
    // Spawn Emanuel (Tournament 99 OVR)
    const emanuel = PLAYERS.find(p => p.name === "Emanuel");
    if (emanuel && !state.cards.some(c => c.player === "Emanuel")) {
        state.cards.unshift({
            id: "champ_" + Date.now(),
            player: emanuel.name,
            rating: emanuel.rating,
            pos: emanuel.pos,
            rarity: emanuel.rarity,
            image: emanuel.image || "player_temp.png",
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

function adminExecuteGrantTitle() {
    if (!checkIsAdmin()) return;
    const target = (document.getElementById("adminTitleTarget").value || "").trim();
    const titleName = document.getElementById("adminTitleSelect").value;
    
    if (!target || target.toLowerCase() === (state.accountUser || state.name || "").toLowerCase()) {
        state.grantedTitles = state.grantedTitles || [];
        if (!state.grantedTitles.includes(titleName)) state.grantedTitles.push(titleName);
        if (titleName === "Admin") state.isGrantedAdmin = true;
        if (titleName === "Staff") state.isGrantedStaff = true;
        state.equippedTitle = titleName;
        AntiCheat.signState(state);
        saveGame();
        renderAll();
        SoundFx.levelUp();
        toast(`👑 Admin: Granted & equipped title "${titleName}" to your account!`);
        return;
    }

    const accs = CloudSync.getAccounts();
    const key = target.toLowerCase();
    if (accs[key]) {
        try {
            const s = typeof accs[key].saveData === "string" ? JSON.parse(accs[key].saveData) : accs[key].saveData;
            s.grantedTitles = s.grantedTitles || [];
            if (!s.grantedTitles.includes(titleName)) s.grantedTitles.push(titleName);
            if (titleName === "Admin") s.isGrantedAdmin = true;
            if (titleName === "Staff") s.isGrantedStaff = true;
            s.equippedTitle = titleName;
            accs[key].saveData = JSON.stringify(s);
            CloudSync.saveAccounts(accs);
            FirebaseSync.pushUser(accs[key].username, accs[key]);
            toast(`👑 Admin: Granted title "${titleName}" to player "${accs[key].username}"!`);
        } catch(e) {}
    } else {
        toast(`Player "${target}" not found.`);
    }
}

async function adminExecuteBan(days = 1) {
    if (!isUserAdmin()) return;
    const target = (document.getElementById("adminModTarget").value || "").trim();
    const reason = (document.getElementById("adminModReason").value || "Unauthorized Script / Balance Injection").trim();
    if (!target) {
        toast("Please enter a target username to ban.");
        return;
    }
    if (target.toLowerCase() === "alucard") {
        toast("Cannot ban the owner account.");
        return;
    }

    const duration = days * 86400000;
    const banUntil = Date.now() + duration;

    const accs = CloudSync.getAccounts();
    const key = target.toLowerCase();
    if (accs[key]) {
        try {
            const s = typeof accs[key].saveData === "string" ? JSON.parse(accs[key].saveData) : accs[key].saveData;
            s.bannedUntil = banUntil;
            s.banReason = reason;
            s.coins = 100; // Reset exploited coins
            accs[key].saveData = JSON.stringify(s);
            CloudSync.saveAccounts(accs);
        } catch(e) {}
    }

    await FirebaseSync.setBan(target, duration, reason);
    SoundFx.sell();
    toast(`⛔ Account "${target}" banned for ${days} Day(s).`);
}

async function adminExecuteUnban() {
    if (!isUserAdmin()) return;
    const target = (document.getElementById("adminModTarget").value || "").trim();
    if (!target) {
        toast("Please enter a target username to unban.");
        return;
    }

    const accs = CloudSync.getAccounts();
    const key = target.toLowerCase();
    if (accs[key]) {
        try {
            const s = typeof accs[key].saveData === "string" ? JSON.parse(accs[key].saveData) : accs[key].saveData;
            s.bannedUntil = 0;
            s.banReason = "";
            accs[key].saveData = JSON.stringify(s);
            CloudSync.saveAccounts(accs);
        } catch(e) {}
    }

    await FirebaseSync.removeBan(target);
    SoundFx.levelUp();
    toast(`✓ Account "${target}" has been unbanned.`);
}

function checkBanStatus() {
    const modal = document.getElementById("accountBannedModal");
    if (!modal) return false;

    const isOwner = (state.accountUser || state.name || "").toLowerCase() === "alucard";
    if (isOwner) {
        modal.classList.add("hidden");
        state.bannedUntil = 0;
        return false;
    }

    const now = Date.now();
    if (state.bannedUntil && state.bannedUntil > now) {
        modal.classList.remove("hidden");
        setText("banUserText", state.accountUser || state.name || "Player");
        setText("banReasonText", state.banReason || "Unauthorized Script / Balance Injection");
        const remainingMs = state.bannedUntil - now;
        setText("banCountdownText", formatCountdown(remainingMs));
        return true;
    } else {
        modal.classList.add("hidden");
        if (state.bannedUntil) {
            state.bannedUntil = 0;
            state.banReason = "";
            saveGame();
        }
        return false;
    }
}

/* =========================================================
   PROMO CODES
   ========================================================= */

function redeemCode() {
    const input = document.getElementById("codeInput");
    if (!input) return;
    const raw = input.value.trim();
    if (!raw) {
        toast("Please enter a code.");
        return;
    }
    const code = raw.toUpperCase();
    if (!state.redeemedCodes) state.redeemedCodes = [];

    if (state.redeemedCodes.includes(code)) {
        toast("You have already redeemed this code.");
        return;
    }

    if (code === "RELEASE") {
        state.redeemedCodes.push(code);
        addCoins(150);
        addXP(25);
        SoundFx.levelUp();
        input.value = "";
        saveGame();
        toast("🎉 Code RELEASE redeemed! +150 🪙");
    } else {
        toast("Invalid code.");
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

function addCoins(amount) {
    AntiCheat.validateState(state);
    const amt = Math.max(0, Math.floor(Number(amount) || 0));
    state.coins = (Number(state.coins) || 0) + amt;
    state.stats.coinsEarned = (Number(state.stats.coinsEarned) || 0) + amt;
    AntiCheat.signState(state);
    progressMission("coins", amt);
    updateCoinDisplay();
    saveGame();
}

function spendCoins(amount) {
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
    state.xp += amount;
    let needed = state.level * 50;

    while (state.xp >= needed) {
        state.xp -= needed;
        state.level++;
        needed = state.level * 50;
        SoundFx.levelUp();
        toast(`🎉 Level Up! Level ${state.level}!`);
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

// Reset all serialized cards & leaderboard as requested by user
if (state.cards && Array.isArray(state.cards)) {
    state.cards.forEach(c => {
        c.serialNumber = null;
        c.serialGradient = null;
    });
}
state.serializedCounts = { "Lionel Messi": 0, "Cristiano Ronaldo": 0 };
try {
    GlobalCloudRest.saveFile("global_serial_counts", { "Lionel Messi": 0, "Cristiano Ronaldo": 0 });
    GlobalCloudRest.saveFile("global_leaderboard", []);
} catch(e) {}

if (state.initialized) {
    renderAll();
    checkDeviceRevocation();
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
setInterval(() => {
    updateTimers();
    checkBanStatus();
    
    deviceRevokeCounter++;
    if (deviceRevokeCounter >= 5) {
        deviceRevokeCounter = 0;
        checkDeviceRevocation();
    }

    tradePollerCounter++;
    const pollThreshold = activeLiveTradeSession ? 1 : 2;
    if (tradePollerCounter >= pollThreshold) {
        tradePollerCounter = 0;
        pollLiveTradeRequests();
    }
}, 1000);

/* =========================================================
   MOBILE & IPAD RESPONSIVE TOUCH & COPY PROTECTIONS
   ========================================================= */

let lastTouchEnd = 0;
document.addEventListener("touchend", function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        // Prevent double tap zooming while allowing input taps
        const targetTag = (event.target && event.target.tagName) || "";
        if (targetTag !== "INPUT" && targetTag !== "TEXTAREA" && targetTag !== "SELECT") {
            event.preventDefault();
        }
    }
    lastTouchEnd = now;
}, { passive: false });

document.addEventListener("copy", function(e) {
    const targetTag = (e.target && e.target.tagName) || "";
    if (targetTag !== "INPUT" && targetTag !== "TEXTAREA") {
        e.preventDefault();
    }
});

document.addEventListener("contextmenu", function(e) {
    const targetTag = (e.target && e.target.tagName) || "";
    if (targetTag !== "INPUT" && targetTag !== "TEXTAREA") {
        if (e.target && e.target.closest && (e.target.closest(".card") || e.target.closest(".pack-card"))) {
            e.preventDefault();
        }
    }
});

// Prevent dragging of any card images, avatars, or modals
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
        adminExecuteBan,
        adminExecuteGrantTitle,
        adminExecuteUnban,
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
        toggleCardLock,
        closeSidebar,
        CloudSync,
        SoundFx,
        SolsCutsceneEngine
    };

    Object.keys(EXPORTED_ACTIONS).forEach(key => {
        window[key] = EXPORTED_ACTIONS[key];
    });

})();
