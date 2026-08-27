/* =========================================================
   FOOTBALL CARDS — ULTIMATE EDITION
   CLOUD TRADING, TOURNAMENT DRAFT, INDEX & 3D INSPECTOR
   ========================================================= */

"use strict";const CURRENT_SAVE_KEY = "footballCardsSave_v9";
const PREVIOUS_SAVE_KEYS = [
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
    Mythic: 6,
    Secret: 7,
    Exclusive: 8,
    "World Class": 9,
    Tournament: 10
};

const DUPLICATE_VALUES = {
    Common: 5,
    Uncommon: 12,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
    Mythic: 200,
    Secret: 500,
    Exclusive: 750,
    "World Class": 1000,
    Tournament: 2000
};

const CARD_VALUES = {
    Common: 5,
    Uncommon: 15,
    Rare: 40,
    Epic: 100,
    Legendary: 300,
    Exclusive: 750,
    Mythic: 1000,
    Secret: 2500,
    "World Class": 5000,
    Tournament: 15000
};

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

const SERIALIZED_PALETTES = [
    "linear-gradient(135deg, #1f0036 0%, #7928ca 50%, #ffffff 100%)", // #1 Dark Purple White
    "linear-gradient(135deg, #ff0844 0%, #7928ca 60%, #ff007f 100%)", // #2 Red Purple Fire
    "linear-gradient(135deg, #f9d423 0%, #ff4e50 50%, #0055a5 100%)", // #3 Yellow Blue Contrast
    "linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #111111 100%)", // #4 24K Gold Obsidian
    "linear-gradient(135deg, #051937 0%, #004d7a 40%, #008793 70%, #00bf72 100%)", // #5 Deep Cyber Mint
    "linear-gradient(135deg, #4a00e0 0%, #8e2de2 50%, #00f2fe 100%)", // #6 Violet Cyan Plasma
    "linear-gradient(135deg, #ff0055 0%, #ffffff 50%, #000000 100%)", // #7 Crimson Silver Onyx
    "linear-gradient(135deg, #f12711 0%, #f5af19 50%, #ffffff 100%)", // #8 Fiery Solar Gold
    "linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #ffffff 100%)", // #9 Mint Emerald Ice
    "linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)"  // #10 Sunset Royal Magenta
];

function generateRandomSerializedGradient(serialNum) {
    if (serialNum && serialNum >= 1 && serialNum <= SERIALIZED_PALETTES.length) {
        return SERIALIZED_PALETTES[serialNum - 1];
    }
    return SERIALIZED_PALETTES[Math.floor(Math.random() * SERIALIZED_PALETTES.length)];
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
    cardReveal(rarity) {
        if (rarity === "World Class") {
            this.worldClassCinematic();
        } else if (rarity === "Tournament" || rarity === "Secret") {
            [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, i) => {
                this.playTone(f, "triangle", 0.45, 0.12, i * 0.08);
            });
        } else if (rarity === "Mythic" || rarity === "Legendary" || rarity === "Exclusive") {
            [440, 554.37, 659.25, 880].forEach((f, i) => {
                this.playTone(f, "triangle", 0.35, 0.1, i * 0.07);
            });
        } else {
            this.playTone(523.25, "sine", 0.15, 0.06, 0);
            this.playTone(659.25, "sine", 0.2, 0.06, 0.05);
        }
    },
    worldClassCinematic() {
        this.playTone(55, "sawtooth", 1.0, 0.35, 0);
        this.playTone(110, "triangle", 1.0, 0.25, 0.1);
        [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 2093.00].forEach((f, i) => {
            this.playTone(f, "triangle", 0.6, 0.15, 0.4 + i * 0.08);
        });
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

/* =========================================================
   PLAYERS (REAL PHOTOS + STATS)
   ========================================================= */

const PLAYERS = [
// --- TOURNAMENT REWARD ---
{ name: "Emanuel", rating: 99, pos: "CAM", rarity: "Tournament", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },

// --- WORLD CLASS (GOATS) ---
{ name: "Lionel Messi", rating: 97, pos: "RW", rarity: "World Class", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Cristiano Ronaldo", rating: 97, pos: "ST", rarity: "World Class", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },

// --- SECRET ---
{ name: "Kylian Mbappé", rating: 96, pos: "ST", rarity: "Secret", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Erling Haaland", rating: 96, pos: "ST", rarity: "Secret", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Zlatan Ibrahimović", rating: 91, pos: "ST", rarity: "Secret", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Sergio Ramos", rating: 90, pos: "CB", rarity: "Secret", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Andrés Iniesta", rating: 93, pos: "CM", rarity: "Secret", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Xavi", rating: 92, pos: "CM", rarity: "Secret", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },

// --- MYTHIC ---
{ name: "Neymar Jr", rating: 95, pos: "LW", rarity: "Mythic", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Kevin De Bruyne", rating: 94, pos: "CM", rarity: "Mythic", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Vinícius Júnior", rating: 94, pos: "LW", rarity: "Mythic", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Jude Bellingham", rating: 93, pos: "CM", rarity: "Mythic", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Mohamed Salah", rating: 93, pos: "RW", rarity: "Mythic", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Robert Lewandowski", rating: 93, pos: "ST", rarity: "Mythic", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Lamine Yamal", rating: 94, pos: "RW", rarity: "Mythic", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },

// --- LEGENDARY ---
{ name: "Harry Kane", rating: 93, pos: "ST", rarity: "Legendary", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Rodri", rating: 93, pos: "CDM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Pedri", rating: 91, pos: "CM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Bukayo Saka", rating: 89, pos: "RW", rarity: "Legendary", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Declan Rice", rating: 89, pos: "CDM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Florian Wirtz", rating: 89, pos: "CAM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Cole Palmer", rating: 88, pos: "RW", rarity: "Legendary", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },

// --- EPIC ---
{ name: "Martin Ødegaard", rating: 88, pos: "CAM", rarity: "Epic", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Bernardo Silva", rating: 88, pos: "CM", rarity: "Epic", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Antoine Griezmann", rating: 88, pos: "ST", rarity: "Epic", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Phil Foden", rating: 88, pos: "CAM", rarity: "Epic", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Lautaro Martínez", rating: 87, pos: "ST", rarity: "Epic", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Federico Valverde", rating: 88, pos: "CM", rarity: "Epic", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },

// --- RARE ---
{ name: "Joshua Kimmich", rating: 86, pos: "CDM", rarity: "Rare", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Bruno Fernandes", rating: 87, pos: "CAM", rarity: "Rare", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Rafael Leão", rating: 86, pos: "LW", rarity: "Rare", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Nicolò Barella", rating: 87, pos: "CM", rarity: "Rare", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Son Heung-min", rating: 87, pos: "LW", rarity: "Rare", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },

// --- UNCOMMON ---
{ name: "Anthony Gordon", rating: 82, pos: "LW", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Pedro Porro", rating: 83, pos: "RB", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Micky van de Ven", rating: 83, pos: "CB", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Dominik Szoboszlai", rating: 83, pos: "CM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Alexis Mac Allister", rating: 84, pos: "CM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },

// --- COMMON ---
{ name: "Oliver Skipp", rating: 75, pos: "CDM", rarity: "Common", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Rob Holding", rating: 74, pos: "CB", rarity: "Common", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Sean Longstaff", rating: 77, pos: "CM", rarity: "Common", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Dwight McNeil", rating: 76, pos: "LM", rarity: "Common", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Dominic Calvert-Lewin", rating: 78, pos: "ST", rarity: "Common", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Tyrone Mings", rating: 77, pos: "CB", rarity: "Common", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Fraser Forster", rating: 75, pos: "GK", rarity: "Common", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Harry Wilson", rating: 76, pos: "RW", rarity: "Common", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Dan Burn", rating: 78, pos: "LB", rarity: "Common", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Lewis Dunk", rating: 79, pos: "CB", rarity: "Common", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },

// --- EXCLUSIVE (LEGENDS OF THE PAST) ---
{ name: "Pelé", rating: 98, pos: "ST", rarity: "Exclusive", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80", odds: 5 },
{ name: "Diego Maradona", rating: 96, pos: "CAM", rarity: "Exclusive", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80", odds: 15 },
{ name: "Ronaldo Nazário", rating: 97, pos: "ST", rarity: "Exclusive", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80", odds: 20 },
{ name: "Zinedine Zidane", rating: 95, pos: "CAM", rarity: "Exclusive", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80", odds: 25 },
{ name: "Ronaldinho", rating: 94, pos: "LW", rarity: "Exclusive", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80", odds: 35 }
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
   AVATAR FRAMES & REAL STADIUM BACKGROUNDS
   ========================================================= */

const FRAMES = [
{ id: "default", name: "Classic Silver", cost: 0, css: "frame-default" },
{ id: "blue", name: "Pitch Blue Matrix", cost: 20, css: "frame-blue" },
{ id: "green", name: "Emerald Stadium", cost: 35, css: "frame-green" },
{ id: "purple", name: "Royal Crest Purple", cost: 50, css: "frame-purple" },
{ id: "gold", name: "Golden Boot", cost: 100, css: "frame-gold" },
{ id: "red", name: "Pyro Crimson Flame", cost: 150, css: "frame-red" },
{ id: "rainbow", name: "Animated Prism Star", cost: 300, css: "frame-rainbow" },
{ id: "champion", name: "Master Champion", cost: 500, css: "frame-champion" }
];

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
    ["Open 1 pack", 1, 10, "packs"],
    ["Earn 10 coins", 10, 10, "coins"],
    ["Collect 1 card", 1, 10, "cards"]
],
daily: [
    ["Open 3 packs", 3, 35, "packs"],
    ["Collect 5 cards", 5, 40, "cards"],
    ["Pull Rare or better", 1, 50, "rare"]
],
weekly: [
    ["Open 15 packs", 15, 150, "packs"],
    ["Collect 20 cards", 20, 200, "cards"],
    ["Pull Epic or better", 3, 250, "epic"]
],
monthly: [
    ["Open 50 packs", 50, 800, "packs"],
    ["Collect 75 cards", 75, 1000, "cards"],
    ["Pull Legendary or better", 5, 1500, "legendary"]
]
};

/* =========================================================
   EQUIPPABLE TITLES
   ========================================================= */

const TITLES = [
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
    requirement: "Reach Top 10 on Tournament Leaderboard",
    unlock: () => {
        try {
            const rank = getMyTournamentRank();
            return rank > 0 && rank <= 10;
        } catch (e) { return false; }
    }
},
{
    id: "champion",
    name: "Season 1 Champion",
    cssClass: "title-champion",
    requirement: "Reach #1 Rank on Tournament Leaderboard",
    unlock: () => {
        try { return getMyTournamentRank() === 1; } catch (e) { return false; }
    }
},
{
    id: "owner",
    name: "Owner",
    cssClass: "title-owner",
    requirement: "Reach Level 50 or 50,000+ Collection Value",
    unlock: () => {
        try {
            return (state.level >= 50 || calculateCollectionValue(state.cards || []) >= 50000);
        } catch (e) { return false; }
    }
},
{
    id: "admin",
    name: "Admin",
    cssClass: "title-admin",
    requirement: "Reach Level 25 or 25,000+ Collection Value",
    unlock: () => {
        try {
            return (state.level >= 25 || calculateCollectionValue(state.cards || []) >= 25000);
        } catch (e) { return false; }
    }
},
{
    id: "staff",
    name: "Staff",
    cssClass: "title-staff",
    requirement: "Reach Level 10 or 10,000+ Collection Value",
    unlock: () => {
        try {
            return (state.level >= 10 || calculateCollectionValue(state.cards || []) >= 10000);
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
        accountPass: "",
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

        dailyRewardClaimed: 0,
        freeKickClaimed: 0,
        worldClassPending: null,
        redeemedCodes: [],
        lastSave: Date.now()
    };
}

function loadGame() {
    try {
        let raw = localStorage.getItem(CURRENT_SAVE_KEY);
        if (!raw) {
            for (const prevKey of PREVIOUS_SAVE_KEYS) {
                const prevData = localStorage.getItem(prevKey);
                if (prevData) {
                    raw = prevData;
                    try { localStorage.setItem(CURRENT_SAVE_KEY, prevData); } catch (e) {}
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

        const ownedFrames = Array.isArray(saved.ownedFrames) && saved.ownedFrames.length ? saved.ownedFrames : ["default"];
        const ownedBackgrounds = Array.isArray(saved.ownedBackgrounds) && saved.ownedBackgrounds.length ? saved.ownedBackgrounds : ["campnou"];

        let showcase = Array.isArray(saved.showcase) ? [...saved.showcase] : [null, null, null, null, null, null];
        while (showcase.length < 6) showcase.push(null);
        showcase = showcase.slice(0, 6);

        return {
            ...fresh,
            ...saved,
            name: activeName,
            ownedFrames: ownedFrames,
            ownedBackgrounds: ownedBackgrounds,
            showcase: showcase,
            profileFrame: saved.profileFrame || "default",
            profileBackground: saved.profileBackground || "campnou",
            equippedTitle: saved.equippedTitle || "Collector",
            cards: Array.isArray(saved.cards) ? saved.cards.map((c, idx) => {
                let sGrad = c.serialGradient;
                if (c.serialNumber && !sGrad) {
                    sGrad = generateRandomSerializedGradient(c.serialNumber);
                }
                return {
                    ...c,
                    serialGradient: sGrad,
                    locked: c.locked !== undefined ? c.locked : (c.rarity === "World Class" || c.rarity === "Secret" || !!c.serialNumber)
                };
            }) : fresh.cards,
            stats: { ...fresh.stats, ...(saved.stats || {}) },
            tournamentDraft: { ...fresh.tournamentDraft, ...(saved.tournamentDraft || {}) },
            missionProgress: { ...fresh.missionProgress, ...(saved.missionProgress || {}) },
            missionClaimed: { ...fresh.missionClaimed, ...(saved.missionClaimed || {}) },
            missionReset: { ...fresh.missionReset, ...(saved.missionReset || {}) },
            unlockedCardNames: Array.isArray(saved.unlockedCardNames) ? saved.unlockedCardNames : [],
            serializedCounts: saved.serializedCounts || { "Lionel Messi": 0, "Cristiano Ronaldo": 0 },
            redeemedCodes: Array.isArray(saved.redeemedCodes) ? saved.redeemedCodes : []
        };
    } catch (e) {
        return freshState();
    }
}

let state = loadGame();
let currentMissionType = "hourly";
let playStarted = Date.now();
let currentAuthTab = "login";
let activeShowcaseSlot = 0;
let searchedUserData = null;

/* =========================================================
   SAVE & CLOUD SYNC
   ========================================================= */

function saveGame() {
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
   CLOUD AUTH & TRADING BACKEND
   ========================================================= */

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

    signUp(username, password) {
        const u = username.trim();
        const p = password.trim();
        if (u.length < 2) return { success: false, msg: "Username must be at least 2 characters." };
        if (p.length < 3) return { success: false, msg: "Password must be at least 3 characters." };

        const accs = this.getAccounts();
        const key = u.toLowerCase();
        if (accs[key]) return { success: false, msg: "Username already taken." };

        // Fresh dedicated save for the newly created account
        const fresh = freshState();
        fresh.accountUser = u;
        fresh.accountPass = p;
        fresh.name = u;
        fresh.initialized = true;
        fresh.cards = [];
        fresh.unlockedCardNames = [];
        fresh.coins = 100;
        fresh.xp = 0;
        fresh.level = 1;
        state = fresh;

        accs[key] = {
            username: u,
            password: p,
            saveData: JSON.stringify(state),
            updatedAt: Date.now()
        };
        this.saveAccounts(accs);
        saveGame();
        renderAll();
        updateAuthUI();
        return { success: true, msg: "Account created and cloud synced!" };
    },

    login(username, password) {
        const u = username.trim();
        const p = password.trim();
        const accs = this.getAccounts();
        const key = u.toLowerCase();
        const acc = accs[key];

        if (!acc || acc.password !== p) return { success: false, msg: "Invalid username or password." };

        if (acc.saveData) {
            try {
                const cloudSave = JSON.parse(acc.saveData);
                state = {
                    ...freshState(),
                    ...cloudSave,
                    accountUser: u,
                    accountPass: p,
                    name: cloudSave.name || u,
                    cards: Array.isArray(cloudSave.cards) ? cloudSave.cards : [],
                    stats: { ...freshState().stats, ...(cloudSave.stats || {}) },
                    tournamentDraft: { ...freshState().tournamentDraft, ...(cloudSave.tournamentDraft || {}) }
                };
            } catch (e) {
                const fresh = freshState();
                fresh.accountUser = u;
                fresh.accountPass = p;
                fresh.name = u;
                state = fresh;
            }
        } else {
            const fresh = freshState();
            fresh.accountUser = u;
            fresh.accountPass = p;
            fresh.name = u;
            state = fresh;
        }

        saveGame();
        renderAll();
        updateAuthUI();
        return { success: true, msg: "Welcome back! Cloud progress loaded." };
    },

    logout() {
        state = freshState();
        saveGame();
        renderAll();
        updateAuthUI();
        closeAuthModal();
        toast("Logged out. Started fresh guest session.");
    },

    sync() {
        if (!state.accountUser) return;
        const accs = this.getAccounts();
        const key = state.accountUser.toLowerCase();
        if (accs[key]) {
            accs[key].saveData = JSON.stringify(state);
            accs[key].updatedAt = Date.now();
            this.saveAccounts(accs);
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
    toast("☁️ Cloud state successfully saved!");
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

function handleAuthSubmit() {
    const u = document.getElementById("authUsername").value;
    const p = document.getElementById("authPassword").value;
    const err = document.getElementById("authError");

    let res;
    if (currentAuthTab === "signup") {
        res = CloudSync.signUp(u, p);
    } else {
        res = CloudSync.login(u, p);
    }

    if (!res.success) {
        if (err) err.textContent = res.msg;
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
            document.getElementById("worldClassOverlay").classList.add("hidden");
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
}

function renderSettings() {
    setText("settingsCurrentName", state.name || state.accountUser || "Player");
    setText("settingsAccountName", state.accountUser ? `${state.accountUser} (Cloud Synced)` : `${state.name || 'Guest'} (Local)`);
}

function updateCoinDisplay() {
    setText("coinDisplay", state.coins);
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
   PACK OPENING & SERIALIZATION (MESSI & RONALDO FIRST 10)
   ========================================================= */

function openPack(type) {
    const pack = PACKS[type];
    if (!pack) return;
    if (!spendCoins(pack.cost)) return;

    SoundFx.packOpen();
    state.stats.packsOpened++;

    let player;
    let rarity;

    if (type === "exclusive") {
        rarity = "Exclusive";
        player = rollExclusivePlayer();
    } else {
        rarity = rollRarity(pack.rates);
        player = choosePlayer(rarity);
    }

    if (!player) {
        addCoins(pack.cost);
        toast("Scouting error — coins returned.");
        return;
    }

    const duplicate = state.cards.some(c => c.player === player.name);
    const isFirstDiscovery = !state.unlockedCardNames.includes(player.name);

    if (isFirstDiscovery) {
        state.unlockedCardNames.push(player.name);
        const bonus = DISCOVERY_BONUS[rarity] || 10;
        addCoins(bonus);
    }

    // Check serialization for first 10 Messi / Ronaldo pulls
    if (!state.serializedCounts) state.serializedCounts = { "Lionel Messi": 0, "Cristiano Ronaldo": 0 };
    let serialNum = null;
    let serialGrad = null;

    if ((player.name === "Lionel Messi" || player.name === "Cristiano Ronaldo") && (state.serializedCounts[player.name] < 10)) {
        state.serializedCounts[player.name]++;
        serialNum = state.serializedCounts[player.name];
        serialGrad = generateRandomSerializedGradient(serialNum);
    }

    const shouldAutoLock = rarity === "World Class" || rarity === "Secret" || serialNum !== null;

    const card = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2),
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
    state.stats.cardsPulled++;
    if (duplicate) state.stats.duplicates++;

    updateRarityStats(rarity, player);
    addXP(rarity === "World Class" ? 100 : rarity === "Secret" ? 35 : rarity === "Mythic" ? 20 : rarity === "Legendary" ? 10 : 5);

    progressMission("packs", 1);
    progressMission("cards", 1);
    if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Rare) progressMission("rare", 1);
    if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Epic) progressMission("epic", 1);
    if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Legendary) progressMission("legendary", 1);

    saveGame();

    // Show 3D Pack Opening Shaking Animation
    const animOverlay = document.getElementById("packOpeningOverlay");
    const animTitle = document.getElementById("packAnimTitle");
    const animIcon = document.getElementById("packAnimIcon");
    if (animOverlay) {
        if (animTitle) animTitle.textContent = `OPENING ${pack.name.toUpperCase()}...`;
        if (animIcon) animIcon.textContent = type === "worldclass" ? "🌎" : type === "exclusive" ? "👑" : "📦";
        animOverlay.classList.remove("hidden");
    }

    setTimeout(() => {
        if (animOverlay) animOverlay.classList.add("hidden");
        if (rarity === "World Class") {
            showWorldClass(card);
        } else if (rarity === "Secret") {
            showSecretCutscene(card);
        } else {
            showCardResult(card, duplicate, isFirstDiscovery);
        }
        renderAll();
    }, 600);
}

function showSecretCutscene(card) {
    const overlay = document.getElementById("secretOverlay");
    if (!overlay) {
        showCardResult(card, false, false);
        return;
    }
    setText("secretPlayerName", card.player.toUpperCase());
    setText("secretPlayerMeta", `${card.rating} OVR · ${card.pos} · ★ 1 IN 500 SECRET PHENOMENON ★`);
    overlay.classList.remove("hidden");
    SoundFx.worldClassCinematic();
}

function closeSecretCutscene() {
    const overlay = document.getElementById("secretOverlay");
    if (overlay) overlay.classList.add("hidden");
    SoundFx.click();
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
    let pool = PLAYERS.filter(p => p.rarity === rarity);
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
    const key = rarity.toLowerCase().replaceAll(" ", "");
    if (state.stats[key] !== undefined) state.stats[key]++;

    const currentPeakOrder = RARITY_ORDER[state.stats.highestRarity] || 0;
    const newOrder = RARITY_ORDER[rarity] || 0;
    if (newOrder > currentPeakOrder) {
        state.stats.highestRarity = rarity;
    }
    if (player.rating > state.stats.highestRating) {
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
   WORLD CLASS SOL'S RNG CUTSCENES (MESSI & RONALDO)
   ========================================================= */

function showWorldClass(card) {
    const animOverlay = document.getElementById("packOpeningOverlay");
    if (animOverlay) animOverlay.classList.add("hidden");

    const overlay = document.getElementById("worldClassOverlay");
    if (!overlay) return;

    const isMessi = card.player.includes("Messi");
    const isRonaldo = card.player.includes("Ronaldo");
    const isSerialized = !!card.serialNumber;

    const badge = document.getElementById("wcGoatBadge");
    const quote = document.getElementById("wcPlayerQuote");
    const icon = document.getElementById("wcIcon");
    const cardBox = overlay.querySelector(".world-card");
    const rift = overlay.querySelector(".sols-rift");

    if (isSerialized) {
        if (badge) badge.textContent = `★ SERIALIZED #${card.serialNumber}/10 WORLD CLASS GOAT ★`;
        if (cardBox) {
            cardBox.style.background = card.serialGradient || "linear-gradient(135deg, #1f0036 0%, #7928ca 50%, #ffffff 100%)";
            cardBox.style.borderColor = "#ffd700";
            cardBox.style.boxShadow = "0 0 60px rgba(255, 215, 0, 0.8), 0 0 120px rgba(121, 40, 202, 0.6)";
        }
        if (rift) {
            rift.style.background = card.serialGradient || "conic-gradient(from 0deg, #ff0844, #7928ca, #00f2fe, #ffd700, #ff0844)";
        }
    } else {
        if (badge) badge.textContent = isMessi ? "🐐 8x BALLON D'OR GOAT 🐐" : isRonaldo ? "🐐 5x CHAMPIONS LEAGUE GOAT 🐐" : "★ WORLD CLASS LEGEND ★";
        if (cardBox) {
            cardBox.style.background = isMessi
                ? "linear-gradient(135deg, #003b7a 0%, #0099ff 40%, #ffffff 70%, #003b7a 100%)"
                : "linear-gradient(135deg, #8b0014 0%, #ff1744 40%, #ffffff 70%, #8b0014 100%)";
            cardBox.style.borderColor = isMessi ? "#69c7ff" : "#ff5252";
            cardBox.style.boxShadow = isMessi
                ? "0 0 60px rgba(105, 199, 255, 0.8), 0 0 120px rgba(0, 153, 255, 0.5)"
                : "0 0 60px rgba(255, 23, 68, 0.8), 0 0 120px rgba(255, 76, 99, 0.5)";
        }
        if (rift) {
            rift.style.background = isMessi
                ? "conic-gradient(from 0deg, #003b7a, #0099ff, #ffffff, #0099ff, #003b7a)"
                : "conic-gradient(from 0deg, #8b0014, #ff1744, #ffffff, #ff1744, #8b0014)";
        }
    }

    if (icon) icon.textContent = isMessi ? "🇦🇷" : isRonaldo ? "🇵🇹" : "🌎";
    if (quote) quote.textContent = isMessi ? '"The Argentine Magician · World Champion · The Greatest of All Time"' : isRonaldo ? '"The Portuguese Legend · All-Time Top Goalscorer · SIUUU!"' : '"Generational Football Icon"';

    setText("wcPlayerName", card.player.toUpperCase());
    setText("wcPlayerMeta", `${card.rating} OVR · ${card.pos} · ★ 1 IN 10,000 WORLD CLASS ★`);

    overlay.classList.remove("hidden");
    overlay.style.display = "grid";
    SoundFx.cardReveal("World Class");
    state.worldClassPending = card.id;
    saveGame();
}

function showCardResult(card, duplicate, isFirstDiscovery) {
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

        if (revealPhoto && card.image) {
            revealPhoto.src = card.image;
        }

        if (revealRating) revealRating.textContent = card.rating;
        if (revealPos) revealPos.textContent = card.pos;
        if (revealName) revealName.textContent = card.player;
        if (revealRaritySub) revealRaritySub.textContent = card.rarity;

        overlay.classList.remove("hidden");
    }

    SoundFx.cardReveal(card.rarity);
    toast(`${card.player} — ${card.rarity}${duplicate ? " · DUPLICATE" : ""}`);
}

/* =========================================================
   INTERACTIVE 3D CARD INSPECTOR
   ========================================================= */

function init3DInspector() {
    const stage = document.getElementById("card3DStage");
    const card = document.getElementById("card3DCard");
    const shine = document.getElementById("card3DShine");
    if (!stage || !card) return;

    function handleMove(clientX, clientY) {
        const rect = stage.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;

        const rotX = -y * 32;
        const rotY = x * 32;

        card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.05, 1.05, 1.05)`;
        if (shine) {
            shine.style.opacity = Math.min(0.9, Math.abs(x) + Math.abs(y) + 0.3);
            shine.style.transform = `translate(${x * 100}px, ${y * 100}px) rotate(${rotY * 2}deg)`;
        }
    }

    stage.addEventListener("mousemove", (e) => handleMove(e.clientX, e.clientY));
    stage.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        if (shine) shine.style.opacity = 0.5;
    });

    stage.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
}

function open3DCard(identifier) {
    let pObj = PLAYERS.find(p => p.name === identifier);
    let cardObj = state.cards.find(c => c.id === identifier || c.player === identifier);

    const player = cardObj || pObj;
    if (!player) return;

    const modal = document.getElementById("card3DModal");
    const cardEl = document.getElementById("card3DCard");
    const photo = document.getElementById("card3DPhoto");
    const rBadge = document.getElementById("card3DRarity");
    const badgeWrap = document.getElementById("card3DBadgeWrap");

    if (badgeWrap) {
        if (cardObj && cardObj.serialNumber) {
            badgeWrap.innerHTML = `<span class="serial-badge" style="background:${cardObj.serialGradient}">★ SERIAL #${cardObj.serialNumber}/10 ★</span>`;
        } else {
            badgeWrap.innerHTML = "";
        }
    }

    const rClass = rarityClassName(player.rarity);
    if (cardEl) {
        cardEl.className = `card-3d-wrapper glow-${rClass}`;
        if (cardObj && cardObj.serialGradient) {
            cardEl.style.background = cardObj.serialGradient;
        } else {
            cardEl.style.background = "#0d1a26";
        }
    }

    if (rBadge) {
        rBadge.textContent = player.rarity.toUpperCase();
        rBadge.className = `rarity ${rClass}`;
    }

    if (photo) photo.src = player.image || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80";

    setText("card3DRating", player.rating);
    setText("card3DPos", player.pos);
    setText("card3DName", player.player || player.name);
    setText("card3DRaritySub", player.rarity);

    setText("card3DStatsOvr", `OVR: ${player.rating}`);
    setText("card3DStatsPos", `POS: ${player.pos}`);
    setText("card3DStatsVal", `VALUE: ${DUPLICATE_VALUES[player.rarity] || 5} 🪙`);

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

    let list = [...PLAYERS];
    if (filter && filter.value !== "all") {
        list = list.filter(p => p.rarity.toLowerCase() === filter.value.toLowerCase());
    }

    const total = PLAYERS.length;
    const discoveredCount = PLAYERS.filter(p => state.unlockedCardNames.includes(p.name) || state.cards.some(c => c.player === p.name)).length;
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
                <span class="rarity ${rClass}">${escapeHTML(player.rarity)}</span>
                <div class="card-image-wrap">
                    <img class="card-photo" src="${player.image}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80';">
                </div>
                <div class="card-rating">??</div>
                <div class="card-position">${escapeHTML(player.pos)}</div>
                <h3>???</h3>
                <small>🔒 Locked</small>
            </article>
            `;
        }

        return `
        <article class="card index-card glow-${rClass}" onclick="open3DCard('${escapeHTML(player.name)}')">
            <span class="rarity ${rClass}">${escapeHTML(player.rarity)}</span>
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

    addCoins(totalGain);
    SoundFx.sell();
    saveGame();
    renderCards();
    renderShowcase();
    toast(`💰 Sold ${toSell.length} duplicate cards for +${totalGain.toLocaleString()} 🪙!`);
}

function renderCards() {
    const grid = document.getElementById("cardsGrid");
    const filter = document.getElementById("cardFilter");
    const sorter = document.getElementById("cardSorter");
    if (!grid) return;

    let cards = [...state.cards];
    if (filter && filter.value !== "all") {
        if (filter.value === "locked") cards = cards.filter(c => c.locked);
        else if (filter.value === "unlocked") cards = cards.filter(c => !c.locked);
        else cards = cards.filter(c => c.rarity.toLowerCase() === filter.value.toLowerCase());
    }

    const sortMode = sorter ? sorter.value : "rarity_desc";
    if (sortMode === "rarity_desc") {
        cards.sort((a, b) => (RARITY_ORDER[b.rarity] || 0) - (RARITY_ORDER[a.rarity] || 0) || b.rating - a.rating);
    } else if (sortMode === "rarity_asc") {
        cards.sort((a, b) => (RARITY_ORDER[a.rarity] || 0) - (RARITY_ORDER[b.rarity] || 0) || a.rating - b.rating);
    } else if (sortMode === "value_desc") {
        cards.sort((a, b) => getCardValue(b) - getCardValue(a) || b.rating - a.rating);
    } else if (sortMode === "rating_desc") {
        cards.sort((a, b) => b.rating - a.rating);
    } else if (sortMode === "newest") {
        cards.sort((a, b) => (b.obtained || 0) - (a.obtained || 0));
    }

    setText("collectionCount", `${state.cards.length} cards collected`);

    if (!cards.length) {
        grid.innerHTML = `<div class="empty-state">No cards found.<br>Open scouting packs to add cards to your collection.</div>`;
        return;
    }

    grid.innerHTML = cards.map(card => {
        const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
        const value = DUPLICATE_VALUES[card.rarity] || 5;

        let themeClass = `theme-${rarityClassName(card.rarity)}`;
        if (card.rarity === "World Class") {
            if (card.player === "Lionel Messi") themeClass = "theme-messi";
            else if (card.player === "Cristiano Ronaldo") themeClass = "theme-ronaldo";
        } else if (card.rarity === "Tournament") {
            themeClass = "theme-tournament";
        }

        const isLocked = !!card.locked;
        const isSelected = selectedCardIds.has(card.id);

        return `
        <article class="card ${frame.css} ${themeClass} ${isSelected ? 'selected-for-bulk' : ''}" ${card.serialGradient ? `style="background:${card.serialGradient}"` : ""} onclick="handleCardClick('${card.id}', event)">
            ${multiSellMode ? `<input type="checkbox" class="card-select-checkbox" ${isSelected ? 'checked' : ''} onclick="toggleCardSelection('${card.id}', event)">` : ""}

            <div class="card-top-row">
                <span class="card-rarity-pill rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                <button class="card-lock-btn ${isLocked ? 'locked' : ''}" onclick="toggleCardLock('${card.id}', event)" title="${isLocked ? 'Unlock Card' : 'Lock Card'}">
                    ${isLocked ? '🔒' : '🔓'}
                </button>
            </div>

            ${card.serialNumber ? `<span class="serial-badge" style="display:inline-block;margin-bottom:6px;">★ SERIAL #${card.serialNumber}/10 ★</span>` : ""}

            <div class="card-image-wrap">
                <img class="card-photo" src="${card.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80'}" alt="${escapeHTML(card.player)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80';">
            </div>
            <div class="card-rating">${card.rating}</div>
            <div class="card-position">${escapeHTML(card.pos)}</div>
            <h3>${escapeHTML(card.player)}</h3>
            <small>${escapeHTML(card.rarity)}</small>

            <div class="card-actions">
                <button onclick="event.stopPropagation(); open3DCard('${card.id}')">3D View</button>
                <button class="sell" ${isLocked ? 'style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="event.stopPropagation(); sellCard('${card.id}')">${isLocked ? '🔒 Locked' : `Sell ${value} 🪙`}</button>
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
    if (card.locked) {
        toast("🔒 Card is locked! Unlock it first to sell.");
        return;
    }
    const value = DUPLICATE_VALUES[card.rarity] || 5;

    state.cards.splice(index, 1);
    state.stats.cardsSold++;
    SoundFx.sell();
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
        return `
        <div class="showcase-slot">
            <button class="showcase-slot-action" onclick="event.stopPropagation(); openShowcasePicker(${index})">Change</button>
            <article class="card showcase-card ${frame.css}" ${card.serialGradient ? `style="background:${card.serialGradient}"` : ""} onclick="open3DCard('${card.id}')">
                ${card.serialNumber ? `<span class="serial-badge" style="background:${card.serialGradient}">★ #${card.serialNumber}/10 ★</span>` : ""}
                <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                <div class="card-image-wrap">
                    <img class="card-photo" src="${card.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80'}" alt="${escapeHTML(card.player)}">
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
                    <img class="card-photo" src="${card.image}">
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

function sendTradeOffer() {
    if (!state.accountUser) {
        openAuthModal();
        return;
    }

    const recInput = document.getElementById("tradeRecipientInput");
    const cardSelect = document.getElementById("tradeOfferCardSelect");
    const noteInput = document.getElementById("tradeRequestNoteInput");

    const recipient = (recInput ? recInput.value : "").trim();
    const offeredCardId = cardSelect ? cardSelect.value : "";
    const note = (noteInput ? noteInput.value : "").trim();

    if (!recipient) {
        toast("Please specify a recipient username.");
        return;
    }
    if (recipient.toLowerCase() === state.accountUser.toLowerCase()) {
        toast("You cannot trade with yourself.");
        return;
    }

    const accs = CloudSync.getAccounts();
    if (!accs[recipient.toLowerCase()]) {
        toast(`User "${recipient}" not found.`);
        return;
    }

    const offeredCard = state.cards.find(c => c.id === offeredCardId);
    if (!offeredCard) {
        toast("Please select a valid card to offer.");
        return;
    }

    const trades = CloudSync.getTrades();
    const tradeObj = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2),
        sender: state.accountUser,
        receiver: accs[recipient.toLowerCase()].username,
        offeredCard: { ...offeredCard },
        requestedNote: note || "Open Trade",
        status: "pending",
        timestamp: Date.now()
    };

    trades.unshift(tradeObj);
    CloudSync.saveTrades(trades);

    if (noteInput) noteInput.value = "";
    SoundFx.coin();
    toast(`Trade request sent to ${tradeObj.receiver}!`);
    renderTradeHub();
}

function renderTradeHub() {
    const cardSelect = document.getElementById("tradeOfferCardSelect");
    if (cardSelect) {
        cardSelect.innerHTML = state.cards.map(c => `
            <option value="${c.id}">${c.player} (${c.rating} OVR · ${c.rarity})</option>
        `).join("");
    }

    const trades = CloudSync.getTrades();
    const user = (state.accountUser || "").toLowerCase();

    const inboxTrades = trades.filter(t => t.receiver.toLowerCase() === user && t.status === "pending");
    const inboxCount = document.getElementById("tradeInboxCount");
    if (inboxCount) inboxCount.textContent = inboxTrades.length;

    const inboxList = document.getElementById("tradeInboxList");
    if (inboxList) {
        if (!inboxTrades.length) {
            inboxList.innerHTML = `<p style="color:var(--muted)">No pending incoming trade requests.</p>`;
        } else {
            inboxList.innerHTML = inboxTrades.map(t => `
                <div class="trade-card-item">
                    <div class="trade-info-col">
                        <h4>From: <b>${escapeHTML(t.sender)}</b></h4>
                        <p>Offers: <strong style="color:var(--blue)">${escapeHTML(t.offeredCard.player)} (${t.offeredCard.rating} OVR · ${t.offeredCard.rarity})</strong></p>
                        <p style="font-size:12px;color:var(--muted);margin-top:2px;">Requested: "${escapeHTML(t.requestedNote)}"</p>
                    </div>
                    <div class="trade-actions">
                        <button class="primary-btn" onclick="acceptTrade('${t.id}')">Accept Trade</button>
                        <button class="danger-btn" onclick="declineTrade('${t.id}')">Decline</button>
                    </div>
                </div>
            `).join("");
        }
    }

    const historyList = document.getElementById("tradeHistoryList");
    if (historyList) {
        const userHistory = trades.filter(t => t.sender.toLowerCase() === user || t.receiver.toLowerCase() === user).slice(0, 10);
        if (!userHistory.length) {
            historyList.innerHTML = `<p style="color:var(--muted)">No trade history yet.</p>`;
        } else {
            historyList.innerHTML = userHistory.map(t => {
                const isSender = t.sender.toLowerCase() === user;
                const otherParty = isSender ? t.receiver : t.sender;
                const statusColor = t.status === "accepted" ? "var(--green)" : t.status === "declined" ? "var(--red)" : "var(--gold)";
                return `
                <div class="trade-card-item">
                    <div class="trade-info-col">
                        <h4>${isSender ? "Sent to" : "Received from"} <b>${escapeHTML(otherParty)}</b></h4>
                        <p>${escapeHTML(t.offeredCard.player)} (${t.offeredCard.rating} OVR · ${t.offeredCard.rarity})</p>
                    </div>
                    <span style="font-weight:900;text-transform:uppercase;color:${statusColor}">${t.status}</span>
                </div>
                `;
            }).join("");
        }
    }
}

function acceptTrade(tradeId) {
    const trades = CloudSync.getTrades();
    const trade = trades.find(t => t.id === tradeId);
    if (!trade || trade.status !== "pending") return;

    const accs = CloudSync.getAccounts();
    const senderKey = trade.sender.toLowerCase();
    const senderAcc = accs[senderKey];

    if (!senderAcc) {
        toast("Sender account no longer exists.");
        trade.status = "declined";
        CloudSync.saveTrades(trades);
        renderTradeHub();
        return;
    }

    let sData;
    try { sData = JSON.parse(senderAcc.saveData); } catch (e) { return; }

    const sCardIndex = sData.cards.findIndex(c => c.id === trade.offeredCard.id || (c.player === trade.offeredCard.player && c.rarity === trade.offeredCard.rarity));
    if (sCardIndex === -1) {
        toast("Sender no longer owns this card.");
        trade.status = "declined";
        CloudSync.saveTrades(trades);
        renderTradeHub();
        return;
    }

    const transferredCard = sData.cards.splice(sCardIndex, 1)[0];
    sData.showcase = sData.showcase.map(id => id === transferredCard.id ? null : id);
    senderAcc.saveData = JSON.stringify(sData);

    state.cards.push(transferredCard);
    trade.status = "accepted";

    CloudSync.saveAccounts(accs);
    CloudSync.saveTrades(trades);
    saveGame();
    renderAll();
    SoundFx.levelUp();
    toast(`Trade accepted! ${transferredCard.player} added to your collection.`);
}

function declineTrade(tradeId) {
    const trades = CloudSync.getTrades();
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;
    trade.status = "declined";
    CloudSync.saveTrades(trades);
    SoundFx.click();
    toast("Trade declined.");
    renderTradeHub();
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
        const avatarWrap = document.getElementById("profileAvatarWrap");
        if (avatarWrap) {
            const frame = FRAMES.find(f => f.id === state.profileFrame) || FRAMES[0];
            avatarWrap.className = `profile-avatar-wrapper ${frame.css}`;
        }
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
    const frameSelect = document.getElementById("profileFrameSelect");
    if (frameSelect) {
        const ownedF = Array.isArray(state.ownedFrames) && state.ownedFrames.length ? state.ownedFrames : ["default"];
        frameSelect.innerHTML = ownedF.map(id => {
            const f = FRAMES.find(x => x.id === id) || FRAMES[0];
            return `<option value="${f.id}" ${f.id === state.profileFrame ? "selected" : ""}>${f.name}</option>`;
        }).join("");
    }
    const bgSelect = document.getElementById("profileBackgroundSelect");
    if (bgSelect) {
        const ownedB = Array.isArray(state.ownedBackgrounds) && state.ownedBackgrounds.length ? state.ownedBackgrounds : ["campnou"];
        bgSelect.innerHTML = ownedB.map(id => {
            const bg = BACKGROUNDS.find(b => b.id === id) || BACKGROUNDS[0];
            return `<option value="${bg.id}" ${bg.id === state.profileBackground ? "selected" : ""}>${bg.name}</option>`;
        }).join("");
    }
}

function setProfileFrame(id) {
    state.profileFrame = id;
    saveGame();
    renderProfile();
    toast("Profile avatar frame equipped.");
}

function setProfileBackground(id) {
    state.profileBackground = id;
    saveGame();
    renderProfile();
    toast("Stadium background equipped.");
}

function applyCustomAvatarUrl() {
    const input = document.getElementById("avatarUrlInput");
    if (!input || !input.value.trim()) return;
    const url = input.value.trim();
    state.avatar = url;
    const pImg = document.getElementById("profileAvatarImg");
    if (pImg) pImg.src = url;
    saveGame();
    renderProfile();
    input.value = "";
    toast("Custom avatar applied!");
}

function setPresetAvatar(url) {
    state.avatar = url;
    const pImg = document.getElementById("profileAvatarImg");
    if (pImg) pImg.src = url;
    saveGame();
    renderProfile();
    toast("Avatar updated!");
}

/* =========================================================
   SHOP
   ========================================================= */

function renderShop() {
    const frames = document.getElementById("frameShop");
    const backgrounds = document.getElementById("backgroundShop");

    if (frames) {
        frames.innerHTML = FRAMES.map(frame => {
            const owned = state.ownedFrames.includes(frame.id);
            return `
            <div class="shop-item">
                <div class="shop-preview ${frame.css}">
                    <img class="shop-avatar-demo" src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80" alt="Avatar">
                </div>
                <h3>${frame.name}</h3>
                <p>${frame.cost === 0 ? "Free" : frame.cost + " coins"}</p>
                <button ${owned ? "disabled" : ""} class="${owned ? "owned" : ""}" onclick="buyFrame('${frame.id}')">
                    ${owned ? "Owned" : "Buy Frame"}
                </button>
            </div>
            `;
        }).join("");
    }

    if (backgrounds) {
        backgrounds.innerHTML = BACKGROUNDS.map(bg => {
            const owned = state.ownedBackgrounds.includes(bg.id);
            return `
            <div class="shop-item">
                <div class="shop-preview" style="background:${bg.css}"></div>
                <h3>${bg.name}</h3>
                <p>${bg.cost === 0 ? "Free" : bg.cost + " coins"}</p>
                <button ${owned ? "disabled" : ""} class="${owned ? "owned" : ""}" onclick="buyBackground('${bg.id}')">
                    ${owned ? "Owned" : "Buy Stadium"}
                </button>
            </div>
            `;
        }).join("");
    }
}

function buyFrame(id) {
    const frame = FRAMES.find(f => f.id === id);
    if (!frame || state.ownedFrames.includes(id)) return;
    if (!spendCoins(frame.cost)) return;

    state.ownedFrames.push(id);
    saveGame();
    renderShop();
    renderProfile();
    SoundFx.coin();
    toast(`Unlocked Avatar Frame: ${frame.name}`);
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

    const missions = MISSION_TEMPLATES[currentMissionType];
    const claimed = (state.missionClaimed && state.missionClaimed[currentMissionType]) || [false, false, false];
    const progress = (state.missionProgress && state.missionProgress[currentMissionType]) || [0, 0, 0];

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
        const dailyProg = (state.missionProgress && state.missionProgress.daily) || [0, 0, 0];
        const dailyClaimed = (state.missionClaimed && state.missionClaimed.daily) || [false, false, false];

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
                if (!state.missionProgress[type]) state.missionProgress[type] = [0, 0, 0];
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
    const mission = MISSION_TEMPLATES[type][index];
    const progress = (state.missionProgress[type] && state.missionProgress[type][index]) || 0;

    if (progress < mission[1]) return;
    if (state.missionClaimed[type] && state.missionClaimed[type][index]) return;

    if (!state.missionClaimed[type]) state.missionClaimed[type] = [false, false, false];
    state.missionClaimed[type][index] = true;

    SoundFx.coin();
    addCoins(mission[2]);
    addXP(Math.min(50, Math.floor(mission[2] / 2)));
    saveGame();
    renderMissions();
    toast(`Mission complete: +${mission[2]} coins!`);
}

function checkMissionResets() {
    const now = Date.now();
    if (now - state.missionReset.daily >= 86400000) {
        state.missionReset.daily = now;
        state.missionProgress.daily = [0, 0, 0];
        state.missionClaimed.daily = [false, false, false];
        saveGame();
    }
    if (now - state.missionReset.weekly >= 604800000) {
        state.missionReset.weekly = now;
        state.missionProgress.weekly = [0, 0, 0];
        state.missionClaimed.weekly = [false, false, false];
        state.tournamentAttempts = 5;
        saveGame();
    }
    if (now - state.missionReset.monthly >= 2592000000) {
        state.missionReset.monthly = now;
        state.missionProgress.monthly = [0, 0, 0];
        state.missionClaimed.monthly = [false, false, false];
        saveGame();
    }
    if (now - state.missionReset.hourly >= 3600000) {
        state.missionReset.hourly = now;
        state.missionProgress.hourly = [0, 0, 0];
        state.missionClaimed.hourly = [false, false, false];
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
    updateFreeKick();
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
    if (tabGold) tabGold.classList.toggle("active", tab === "gold");
    if (tabValue) tabValue.classList.toggle("active", tab === "value");
    renderLeaderboard();
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
    } else if (code === "EMANUEL") {
        state.redeemedCodes.push(code);
        addCoins(10000);
        addXP(100);
        SoundFx.levelUp();
        input.value = "";
        saveGame();
        toast("👑 Secret Code Emanuel redeemed! +10,000 🪙");
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
    const s = state.stats;
    const totalVal = calculateCollectionValue(state.cards);
    const data = [
        ["Current Level", state.level, "Player Level"],
        ["Collection Wealth", `${totalVal.toLocaleString()} 🪙`, "Total card value"],
        ["Cards Owned", state.cards.length, "Active collection"],
        ["Current Gold", `${state.coins.toLocaleString()} 🪙`, "Available balance"],
        ["Playtime", formatPlaytime(s.playtime), "Total active time"],
        ["Packs Opened", s.packsOpened, "Scouting packs opened"],
        ["Cards Pulled", s.cardsPulled, "Lifetime cards pulled"],
        ["Duplicates", s.duplicates, "Duplicate pulls"],
        ["Cards Sold", s.cardsSold, "Cards recycled"],
        ["Coins Earned", `${(s.coinsEarned || 0).toLocaleString()} 🪙`, "Lifetime earnings"],
        ["Coins Spent", `${(s.coinsSpent || 0).toLocaleString()} 🪙`, "Lifetime spending"],
        ["Peak Rating", `${s.highestRating || 0} OVR`, "Highest player rating"],
        ["Best Rarity", s.highestRarity || "Common", "Peak rarity pulled"],
        ["World Class", s.worldClass, "1 in 10,000 pulls"],
        ["Secret", s.secret, "Secret pulls"],
        ["Mythic", s.mythic, "Mythic pulls"],
        ["Legendary", s.legendary, "Legendary pulls"],
        ["Exclusive", s.exclusive, "Historic icons"],
        ["Tournament", s.tournament, "Tournament cards"],
        ["Rare", s.rare, "Rare cards"],
        ["Uncommon", s.uncommon, "Uncommon cards"],
        ["Common", s.common, "Common cards"]
    ];

    const grid = document.getElementById("statisticsGrid");
    if (grid) {
        grid.innerHTML = data.map(x => `
            <div class="stat-box">
                <span>${x[0]}</span>
                <b>${x[1]}</b>
                <p>${x[2]}</p>
            </div>
        `).join("");
    }
}

function renderLeaderboard() {
    const container = document.getElementById("globalLeaderboard");
    if (!container) return;

    const accs = CloudSync.getAccounts();
    const rows = [];

    for (const key in accs) {
        try {
            const d = JSON.parse(accs[key].saveData);
            if (d) {
                const totalVal = calculateCollectionValue(d.cards || []);
                const gold = d.coins || 0;
                rows.push({
                    name: d.name || accs[key].username,
                    gold: gold,
                    value: totalVal,
                    cards: (d.cards || []).length,
                    level: d.level || 1
                });
            }
        } catch (e) {}
    }

    const myName = state.name || state.accountUser || "Guest";
    const myVal = calculateCollectionValue(state.cards);
    if (!rows.some(r => r.name.toLowerCase() === myName.toLowerCase())) {
        rows.push({
            name: myName,
            gold: state.coins,
            value: myVal,
            cards: state.cards.length,
            level: state.level
        });
    }

    if (currentLeaderboardTab === "gold") {
        rows.sort((a, b) => b.gold - a.gold);
    } else {
        rows.sort((a, b) => b.value - a.value);
    }

    if (!rows.length) {
        container.innerHTML = `<div class="empty-state">No players found yet. Create a Cloud Account to join!</div>`;
        return;
    }

    container.innerHTML = rows.slice(0, 50).map((r, i) => {
        const isMe = r.name.toLowerCase() === myName.toLowerCase();
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
        const scoreDisplay = currentLeaderboardTab === "gold" ? `${r.gold.toLocaleString()} 🪙` : `${r.value.toLocaleString()} 💎 Value`;

        return `
        <div class="rank-row ${isMe ? 'highlight' : ''}" style="${isMe ? 'border:1px solid var(--green);background:rgba(34,199,122,0.1);' : ''}">
            <b>${medal}</b>
            <div>
                <strong>${escapeHTML(r.name)} ${isMe ? '<small style="color:var(--green)">(You)</small>' : ''}</strong>
                <p style="margin:2px 0 0;font-size:12px;color:var(--muted);">Lvl ${r.level} · ${r.cards} Cards</p>
            </div>
            <strong style="color:var(--gold);font-size:15px;">${scoreDisplay}</strong>
        </div>
        `;
    }).join("");
}

/* =========================================================
   ECONOMY & XP
   ========================================================= */

function addCoins(amount) {
    state.coins += amount;
    state.stats.coinsEarned += amount;
    progressMission("coins", amount);
    updateCoinDisplay();
    saveGame();
}

function spendCoins(amount) {
    if (state.coins < amount) {
        toast("Not enough coins.");
        return false;
    }
    state.coins -= amount;
    state.stats.coinsSpent += amount;
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

    renderHero();
    renderProfile();
    saveGame();
}

function changeName() {
    const newName = prompt("Enter your name:", state.name);
    if (!newName) return;
    const name = newName.trim();
    if (name.length < 2) {
        toast("Name must be at least 2 characters.");
        return;
    }
    state.name = name;
    if (state.accountUser) state.accountUser = name;
    saveGame();
    renderAll();
    toast(`Name updated to: ${name}`);
}

function resetGame() {
    if (!confirm("Are you sure? This permanently deletes your progress.")) return;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

/* =========================================================
   NAVIGATION & UTILITIES
   ========================================================= */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    document.querySelectorAll("button.nav").forEach(n => n.classList.remove("active"));

    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add("active-page");

    const targetNav = document.querySelector(`button.nav[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add("active");

    const sidebar = document.getElementById("sidebar");
    if (sidebar && window.innerWidth <= 768) sidebar.classList.remove("open");

    if (pageId === "statistics") renderStatistics();
    if (pageId === "leaderboard") renderLeaderboard();
    if (pageId === "cards") renderCards();
    if (pageId === "profile") renderProfile();
    if (pageId === "trade") renderTradeHub();
    if (pageId === "index") renderIndex();
    if (pageId === "shop") renderShop();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.toggle("open");
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
    renderAll();
}
