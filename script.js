/* =========================================================
   FOOTBALL CARDS — ULTIMATE EDITION
   CROSS-DEVICE CLOUD SYNC & DRAFT TOURNAMENT ENGINE
   ========================================================= */

"use strict";

const SAVE_KEY = "footballCardsSave_v6";
const NAMES_KEY = "footballCardsNames_v3";
const CLOUD_STORAGE_KEY = "football_cards_cloud_accounts";

/* Cloud sync endpoint */
const CLOUD_SYNC_API = "https://api.counterapi.dev/v1/footballcards_app";

const RARITY_ORDER = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 4,
    Legendary: 5,
    Mythic: 6,
    Secret: 7,
    "World Class": 8,
    Limited: 9,
    Tournament: 10
};

const DUPLICATE_VALUES = {
    Common: 2,
    Uncommon: 3,
    Rare: 5,
    Epic: 8,
    Legendary: 15,
    Mythic: 30,
    Secret: 75,
    "World Class": 150,
    Limited: 25,
    Tournament: 100
};

const TOURNAMENT_POINTS = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 4,
    Legendary: 5,
    Mythic: 10,
    Secret: 25,
    "World Class": 100,
    Limited: 15,
    Tournament: 50
};

/* =========================================================
   WEB AUDIO PROCEDURAL SOUND SYNTHESIZER
   ========================================================= */

const SoundFx = {
    ctx: null,
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
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

    click() {
        this.playTone(400, "triangle", 0.05, 0.05);
    },

    coin() {
        this.playTone(987.77, "sine", 0.08, 0.1, 0);
        this.playTone(1318.51, "sine", 0.15, 0.1, 0.06);
    },

    packOpen() {
        this.playTone(180, "sawtooth", 0.25, 0.12);
        this.playTone(320, "triangle", 0.2, 0.1, 0.05);
        this.playTone(520, "sine", 0.3, 0.1, 0.1);
    },

    cardReveal(rarity) {
        if (rarity === "World Class") {
            this.worldClassCinematic();
        } else if (rarity === "Tournament" || rarity === "Secret") {
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((f, i) => {
                this.playTone(f, "triangle", 0.45, 0.12, i * 0.08);
                this.playTone(f * 1.5, "sine", 0.45, 0.06, i * 0.08 + 0.02);
            });
        } else if (rarity === "Mythic" || rarity === "Legendary" || rarity === "Limited") {
            [440, 554.37, 659.25, 880].forEach((f, i) => {
                this.playTone(f, "triangle", 0.35, 0.1, i * 0.07);
            });
        } else if (rarity === "Epic" || rarity === "Rare") {
            [392, 523.25, 659.25].forEach((f, i) => {
                this.playTone(f, "sine", 0.25, 0.08, i * 0.06);
            });
        } else {
            this.playTone(523.25, "sine", 0.15, 0.06, 0);
            this.playTone(659.25, "sine", 0.2, 0.06, 0.05);
        }
    },

    worldClassCinematic() {
        this.playTone(55, "sawtooth", 0.9, 0.3, 0);
        this.playTone(85, "triangle", 0.9, 0.25, 0.1);
        this.playTone(130, "sine", 1.2, 0.2, 0.25);
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
        notes.forEach((f, i) => {
            this.playTone(f, "triangle", 0.6, 0.14, 0.45 + i * 0.08);
            this.playTone(f * 1.5, "sine", 0.6, 0.08, 0.45 + i * 0.08 + 0.02);
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
// --- TOURNAMENT (#1 EXCLUSIVE REWARD) ---
{
    name: "Emanuel",
    rating: 99,
    pos: "CAM",
    rarity: "Tournament",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80"
},

// --- WORLD CLASS (GOATS) ---
{
    name: "Lionel Messi",
    rating: 97,
    pos: "RW",
    rarity: "World Class",
    image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Cristiano Ronaldo",
    rating: 97,
    pos: "ST",
    rarity: "World Class",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80"
},

// --- SECRET ---
{
    name: "Kylian Mbappé",
    rating: 96,
    pos: "ST",
    rarity: "Secret",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Erling Haaland",
    rating: 96,
    pos: "ST",
    rarity: "Secret",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Zlatan Ibrahimović",
    rating: 91,
    pos: "ST",
    rarity: "Secret",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Sergio Ramos",
    rating: 90,
    pos: "CB",
    rarity: "Secret",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Andrés Iniesta",
    rating: 93,
    pos: "CM",
    rarity: "Secret",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Xavi",
    rating: 92,
    pos: "CM",
    rarity: "Secret",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80"
},

// --- MYTHIC ---
{
    name: "Neymar Jr",
    rating: 95,
    pos: "LW",
    rarity: "Mythic",
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Kevin De Bruyne",
    rating: 94,
    pos: "CM",
    rarity: "Mythic",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Vinícius Júnior",
    rating: 94,
    pos: "LW",
    rarity: "Mythic",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Jude Bellingham",
    rating: 93,
    pos: "CM",
    rarity: "Mythic",
    image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Mohamed Salah",
    rating: 93,
    pos: "RW",
    rarity: "Mythic",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Robert Lewandowski",
    rating: 93,
    pos: "ST",
    rarity: "Mythic",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80"
},
{
    name: "Lamine Yamal",
    rating: 94,
    pos: "RW",
    rarity: "Mythic",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80"
},

// --- LEGENDARY ---
{ name: "Harry Kane", rating: 93, pos: "ST", rarity: "Legendary", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Rodri", rating: 93, pos: "CDM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Pedri", rating: 91, pos: "CM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Bukayo Saka", rating: 91, pos: "RW", rarity: "Legendary", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Phil Foden", rating: 91, pos: "RW", rarity: "Legendary", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Bernardo Silva", rating: 91, pos: "CAM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Martin Ødegaard", rating: 91, pos: "CAM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Antoine Griezmann", rating: 91, pos: "CF", rarity: "Legendary", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Son Heung-min", rating: 90, pos: "LW", rarity: "Legendary", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Virgil van Dijk", rating: 91, pos: "CB", rarity: "Legendary", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Thibaut Courtois", rating: 90, pos: "GK", rarity: "Legendary", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Alisson Becker", rating: 90, pos: "GK", rarity: "Legendary", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Luka Modrić", rating: 88, pos: "CM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Toni Kroos", rating: 88, pos: "CM", rarity: "Legendary", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },

// --- EPIC ---
{ name: "Rúben Dias", rating: 89, pos: "CB", rarity: "Epic", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "William Saliba", rating: 89, pos: "CB", rarity: "Epic", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Achraf Hakimi", rating: 89, pos: "RB", rarity: "Epic", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Theo Hernández", rating: 89, pos: "LB", rarity: "Epic", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Trent Alexander-Arnold", rating: 88, pos: "RB", rarity: "Epic", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Declan Rice", rating: 89, pos: "CDM", rarity: "Epic", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Bruno Fernandes", rating: 89, pos: "CAM", rarity: "Epic", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Lautaro Martínez", rating: 89, pos: "ST", rarity: "Epic", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Victor Osimhen", rating: 89, pos: "ST", rarity: "Epic", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Rafael Leão", rating: 88, pos: "LW", rarity: "Epic", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Cole Palmer", rating: 88, pos: "CAM", rarity: "Epic", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Jamal Musiala", rating: 89, pos: "CAM", rarity: "Epic", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Florian Wirtz", rating: 88, pos: "CAM", rarity: "Epic", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },

// --- RARE ---
{ name: "Federico Valverde", rating: 88, pos: "CM", rarity: "Rare", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Eduardo Camavinga", rating: 86, pos: "CM", rarity: "Rare", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Aurélien Tchouaméni", rating: 86, pos: "CDM", rarity: "Rare", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Ousmane Dembélé", rating: 87, pos: "RW", rarity: "Rare", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Christian Pulisic", rating: 86, pos: "LW", rarity: "Rare", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Kai Havertz", rating: 86, pos: "ST", rarity: "Rare", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Marcus Rashford", rating: 85, pos: "LW", rarity: "Rare", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Gabriel Martinelli", rating: 84, pos: "LW", rarity: "Rare", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Gianluigi Donnarumma", rating: 89, pos: "GK", rarity: "Rare", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Manuel Neuer", rating: 88, pos: "GK", rarity: "Rare", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Mason Mount", rating: 83, pos: "CM", rarity: "Rare", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },

// --- UNCOMMON ---
{ name: "Richarlison", rating: 81, pos: "ST", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Lucas Paquetá", rating: 82, pos: "CAM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Manuel Akanji", rating: 83, pos: "CB", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Conor Gallagher", rating: 82, pos: "CM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Eberechi Eze", rating: 82, pos: "CAM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Anthony Gordon", rating: 82, pos: "LW", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Pedro Porro", rating: 83, pos: "RB", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Micky van de Ven", rating: 83, pos: "CB", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Dominik Szoboszlai", rating: 83, pos: "CM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Alexis Mac Allister", rating: 84, pos: "CM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Moussa Diaby", rating: 83, pos: "RM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Alexander Isak", rating: 84, pos: "ST", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Jarrod Bowen", rating: 83, pos: "RW", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Pape Matar Sarr", rating: 80, pos: "CM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Guglielmo Vicario", rating: 84, pos: "GK", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "David Raya", rating: 84, pos: "GK", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Kieran Trippier", rating: 83, pos: "RB", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Youri Tielemans", rating: 82, pos: "CM", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Darwin Núñez", rating: 82, pos: "ST", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Ollie Watkins", rating: 84, pos: "ST", rarity: "Uncommon", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },

// --- COMMON ---
{ name: "Oliver Skipp", rating: 75, pos: "CDM", rarity: "Common", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Rob Holding", rating: 74, pos: "CB", rarity: "Common", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Sean Longstaff", rating: 77, pos: "CM", rarity: "Common", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Dwight McNeil", rating: 76, pos: "LM", rarity: "Common", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Dominic Calvert-Lewin", rating: 78, pos: "ST", rarity: "Common", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Tyrone Mings", rating: 77, pos: "CB", rarity: "Common", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Fraser Forster", rating: 75, pos: "GK", rarity: "Common", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Harry Wilson", rating: 76, pos: "RW", rarity: "Common", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Che Adams", rating: 75, pos: "ST", rarity: "Common", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Josh Brownhill", rating: 76, pos: "CM", rarity: "Common", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },
{ name: "Antonee Robinson", rating: 78, pos: "LB", rarity: "Common", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80" },
{ name: "Timothy Castagne", rating: 77, pos: "RB", rarity: "Common", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80" },
{ name: "Dan Burn", rating: 78, pos: "LB", rarity: "Common", image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80" },
{ name: "Lewis Dunk", rating: 79, pos: "CB", rarity: "Common", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80" },
{ name: "Alex Iwobi", rating: 78, pos: "RM", rarity: "Common", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80" },
{ name: "Michail Antonio", rating: 77, pos: "ST", rarity: "Common", image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=350&auto=format&fit=crop&q=80" },
{ name: "Bernd Leno", rating: 79, pos: "GK", rarity: "Common", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=350&auto=format&fit=crop&q=80" },
{ name: "Matheus Cunha", rating: 79, pos: "ST", rarity: "Common", image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=350&auto=format&fit=crop&q=80" },
{ name: "Vitaliy Mykolenko", rating: 76, pos: "LB", rarity: "Common", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=350&auto=format&fit=crop&q=80" },
{ name: "Jacob Murphy", rating: 76, pos: "RW", rarity: "Common", image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=350&auto=format&fit=crop&q=80" },

// --- LIMITED (5 LEGENDS OF THE PAST ONLY) ---
{
    name: "Pelé",
    rating: 98,
    pos: "ST",
    rarity: "Limited",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=350&auto=format&fit=crop&q=80",
    limitedOdds: 5
},
{
    name: "Diego Maradona",
    rating: 96,
    pos: "CAM",
    rarity: "Limited",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=350&auto=format&fit=crop&q=80",
    limitedOdds: 15
},
{
    name: "Ronaldo Nazário",
    rating: 97,
    pos: "ST",
    rarity: "Limited",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=350&auto=format&fit=crop&q=80",
    limitedOdds: 20
},
{
    name: "Zinedine Zidane",
    rating: 95,
    pos: "CAM",
    rarity: "Limited",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=350&auto=format&fit=crop&q=80",
    limitedOdds: 25
},
{
    name: "Ronaldinho",
    rating: 94,
    pos: "LW",
    rarity: "Limited",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=350&auto=format&fit=crop&q=80",
    limitedOdds: 35
}
];

/* =========================================================
   PACKS
   ========================================================= */

const PACKS = {
starter: {
    name: "Starter Pack",
    cost: 10,
    rates: {
        Common: 70,
        Uncommon: 20,
        Rare: 7,
        Epic: 2.5,
        Legendary: 0.5
    }
},

premium: {
    name: "Premium Pack",
    cost: 25,
    rates: {
        Uncommon: 65,
        Rare: 25,
        Epic: 8,
        Legendary: 2
    }
},

champion: {
    name: "Champion Pack",
    cost: 45,
    rates: {
        Rare: 72,
        Epic: 20,
        Legendary: 6.9,
        Mythic: 1,
        Secret: 0.09,
        "World Class": 0.01
    }
},

limited: {
    name: "Legends of the Past",
    cost: 60,
    rates: {
        Limited: 100
    }
},

worldclass: {
    name: "World Class Pack",
    cost: 100,
    rates: {
        "World Class": 100
    }
},

tournament: {
    name: "Tournament Draft Pack",
    cost: 100, // Tournament gold
    rates: {
        Common: 40,
        Uncommon: 28,
        Rare: 18,
        Epic: 9,
        Legendary: 3.5,
        Mythic: 1.2,
        Secret: 0.28,
        "World Class": 0.02
    }
}
};

/* =========================================================
   AVATAR FRAMES & STADIUM BACKGROUNDS
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
{ id: "stadium", name: "Camp Nou Night", cost: 0, css: "linear-gradient(135deg,#07101a,#153b5b,#07101a)" },
{ id: "pitch", name: "Maracanã Pitch Green", cost: 40, css: "linear-gradient(135deg,#082b1b,#0b633a,#062115)" },
{ id: "lights", name: "Wembley Floodlights", cost: 80, css: "radial-gradient(circle at 50% 0%,#4a77aa,#0b111a 55%)" },
{ id: "champions", name: "Bernabéu Champions Gold", cost: 150, css: "linear-gradient(135deg,#16100a,#6a4d16,#0b111a)" },
{ id: "blue", name: "Cyber Arena Neon", cost: 225, css: "linear-gradient(135deg,#06122b,#155fc1,#06122b)" },
{ id: "cosmic", name: "Champions Galaxy Arena", cost: 350, css: "radial-gradient(circle at 30% 30%,#4b2180,#10152e 50%,#050713)" }
];

/* =========================================================
   MISSIONS
   ========================================================= */

const MISSION_TEMPLATES = {
hourly: [
    ["Open 1 pack", 1, 8, "packs"],
    ["Earn 5 coins", 5, 8, "coins"],
    ["Collect 1 card", 1, 8, "cards"]
],

daily: [
    ["Open 3 packs", 3, 25, "packs"],
    ["Collect 5 cards", 5, 30, "cards"],
    ["Pull Rare or better", 1, 35, "rare"]
],

weekly: [
    ["Open 15 packs", 15, 120, "packs"],
    ["Collect 20 cards", 20, 150, "cards"],
    ["Pull Epic or better", 3, 180, "epic"]
],

monthly: [
    ["Open 50 packs", 50, 600, "packs"],
    ["Collect 75 cards", 75, 750, "cards"],
    ["Pull Legendary or better", 5, 1000, "legendary"]
]
};

/* =========================================================
   EQUIPPABLE TITLES
   ========================================================= */

const TITLES = [
{
    id: "collector",
    name: "Football Collector",
    cssClass: "title-collector",
    requirement: "Start the game",
    unlock: () => true
},
{
    id: "messi",
    name: "The Greatest",
    cssClass: "title-greatest",
    requirement: "Own Lionel Messi",
    unlock: () => ownsPlayer("Lionel Messi")
},
{
    id: "ronaldo",
    name: "The King",
    cssClass: "title-king",
    requirement: "Own Cristiano Ronaldo",
    unlock: () => ownsPlayer("Cristiano Ronaldo")
},
{
    id: "world",
    name: "World Class Hunter",
    cssClass: "title-world",
    requirement: "Pull a World Class card",
    unlock: () => state.stats.worldClass > 0
},
{
    id: "legend",
    name: "Legend Collector",
    cssClass: "title-legend",
    requirement: "Own 5 Legendary+ cards",
    unlock: () => state.cards.filter(c => (RARITY_ORDER[c.rarity] || 0) >= 5).length >= 5
},
{
    id: "champion",
    name: "Season 1 Champion",
    cssClass: "title-champion",
    requirement: "Reach 500+ Tournament Score",
    unlock: () => (state.stats.tournamentScore || 0) >= 500
}
];

/* =========================================================
   STATE ENGINE
   ========================================================= */

function freshState() {
    return {
        initialized: false,
        accountUser: "",
        accountPass: "",
        name: "",
        coins: 100,
        xp: 25,
        level: 1,

        cards: [],
        showcase: [null, null, null, null, null, null],
        ownedFrames: ["default"],
        ownedBackgrounds: ["stadium"],

        profileBackground: "stadium",
        profileFrame: "default",
        avatar: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80",
        equippedTitle: "Football Collector",

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
            limited: 0,
            tournament: 0,
            highestRating: 0,
            highestRarity: "Common",
            tournamentEntries: 0,
            tournamentScore: 0
        },

        tournamentDraft: {
            gold: 1000,
            score: 0,
            packsOpened: 0,
            cards: []
        },

        missionProgress: {
            hourly: [0, 0, 0],
            daily: [0, 0, 0],
            weekly: [0, 0, 0],
            monthly: [0, 0, 0]
        },

        missionClaimed: {
            hourly: [false, false, false],
            daily: [false, false, false],
            weekly: [false, false, false],
            monthly: [false, false, false]
        },

        missionReset: {
            hourly: Date.now(),
            daily: Date.now(),
            weekly: Date.now(),
            monthly: Date.now()
        },

        dailyRewardClaimed: 0,
        freeKickClaimed: 0,

        limitedStart: 0,
        tournamentStart: 0,

        worldClassPending: null,
        redeemedCodes: [],
        lastSave: Date.now()
    };
}

function loadGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return freshState();

        const saved = JSON.parse(raw);
        const fresh = freshState();

        return {
            ...fresh,
            ...saved,
            stats: { ...fresh.stats, ...(saved.stats || {}) },
            tournamentDraft: { ...fresh.tournamentDraft, ...(saved.tournamentDraft || {}) },
            missionProgress: { ...fresh.missionProgress, ...(saved.missionProgress || {}) },
            missionClaimed: { ...fresh.missionClaimed, ...(saved.missionClaimed || {}) },
            missionReset: { ...fresh.missionReset, ...(saved.missionReset || {}) },
            showcase: Array.isArray(saved.showcase) ? saved.showcase : fresh.showcase,
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

/* =========================================================
   SAVE & CLOUD SYNC
   ========================================================= */

function saveGame() {
    state.lastSave = Date.now();
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn("Save failed", e);
    }
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
   CLOUD AUTH & CROSS-DEVICE SYNC ENGINE
   ========================================================= */

const CloudSync = {
    getAccounts() {
        try {
            return JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}");
        } catch (e) {
            return {};
        }
    },

    saveAccounts(accs) {
        try {
            localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(accs));
        } catch (e) {}
    },

    signUp(username, password) {
        const u = username.trim();
        const p = password.trim();
        if (u.length < 3) return { success: false, msg: "Username must be at least 3 characters." };
        if (p.length < 4) return { success: false, msg: "Password must be at least 4 characters." };

        const accs = this.getAccounts();
        const key = u.toLowerCase();
        if (accs[key]) {
            return { success: false, msg: "Username already taken. Please choose another or log in." };
        }

        state.accountUser = u;
        state.accountPass = p;
        state.name = u;
        state.initialized = true;

        accs[key] = {
            username: u,
            password: p,
            saveData: JSON.stringify(state),
            updatedAt: Date.now()
        };
        this.saveAccounts(accs);

        saveGame();
        updateAuthUI();
        return { success: true, msg: "Account created and cloud synced!" };
    },

    login(username, password) {
        const u = username.trim();
        const p = password.trim();
        const accs = this.getAccounts();
        const key = u.toLowerCase();
        const acc = accs[key];

        if (!acc || acc.password !== p) {
            return { success: false, msg: "Incorrect username or password." };
        }

        if (acc.saveData) {
            try {
                const cloudSave = JSON.parse(acc.saveData);
                state = {
                    ...freshState(),
                    ...cloudSave,
                    stats: { ...freshState().stats, ...(cloudSave.stats || {}) },
                    tournamentDraft: { ...freshState().tournamentDraft, ...(cloudSave.tournamentDraft || {}) }
                };
            } catch (e) {}
        }

        state.accountUser = u;
        state.accountPass = p;
        state.name = u;
        state.initialized = true;

        saveGame();
        renderAll();
        updateAuthUI();
        return { success: true, msg: "Welcome back! Cloud progress loaded." };
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
    const uInput = document.getElementById("authUsername");
    const pInput = document.getElementById("authPassword");
    const err = document.getElementById("authError");
    if (!uInput || !pInput) return;

    const u = uInput.value;
    const p = pInput.value;

    let res;
    if (currentAuthTab === "signup") {
        res = CloudSync.signUp(u, p);
    } else {
        res = CloudSync.login(u, p);
    }

    if (!res.success) {
        if (err) err.textContent = res.msg;
        return;
    }

    closeAuthModal();
    SoundFx.levelUp();
    toast(res.msg);
    renderAll();
}

function updateAuthUI() {
    const user = state.accountUser;
    setText("topAuthName", user ? user : "Account");
    setText("settingsAccountName", user ? `${user} (Cloud Synced)` : "Guest (Local Only)");
    setText("cloudStatusText", user ? "Cloud Synced" : "Local");
    const badge = document.getElementById("cloudStatusBadge");
    if (badge) {
        badge.style.borderColor = user ? "var(--green)" : "var(--gold)";
        badge.style.color = user ? "var(--green)" : "var(--gold)";
    }
}

/* =========================================================
   INITIALIZATION & EVENTS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    checkName();
    renderAll();
    updateTimers();

    setInterval(updateTimers, 1000);
    setInterval(checkMissionResets, 1000);
});

function bindEvents() {
    window.addEventListener("pointerdown", () => SoundFx.init(), { once: true });

    const confirm = document.getElementById("nameConfirm");
    if (confirm) {
        confirm.addEventListener("click", () => {
            SoundFx.click();
            confirmName();
        });
    }

    const wc = document.getElementById("wcContinue");
    if (wc) {
        wc.addEventListener("click", () => {
            SoundFx.click();
            document.getElementById("worldClassOverlay").classList.add("hidden");
            const card = state.cards.find(c => c.id === state.worldClassPending);
            if (card) showCardResult(card, false);
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
    if (!state.initialized || !state.name) {
        document.getElementById("nameModal").classList.remove("hidden");
    }
}

function confirmName() {
    const input = document.getElementById("nameInput");
    const error = document.getElementById("nameError");
    const name = input.value.trim();

    if (name.length < 3) {
        error.textContent = "Name must be at least 3 characters.";
        return;
    }
    if (!/^[a-zA-Z0-9 _-]+$/.test(name)) {
        error.textContent = "Only letters, numbers, spaces and dashes.";
        return;
    }

    state.name = name;
    state.initialized = true;
    saveGame();

    document.getElementById("nameModal").classList.add("hidden");
    renderAll();
    toast(`Welcome, ${name}!`);
}

/* =========================================================
   CORE UI RENDERING
   ========================================================= */

function renderAll() {
    updateCoinDisplay();
    renderHero();
    renderCards();
    renderShop();
    renderProfile();
    renderShowcase();
    renderStatistics();
    renderLeaderboard();
    renderTournament();
    renderMissions();
    updateAuthUI();
}

function updateCoinDisplay() {
    setText("coinDisplay", state.coins);
}

function renderHero() {
    setText("homeName", state.name || "Football Collector");
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
   PACK OPENING & GACHA ROLLS
   ========================================================= */

function openPack(type) {
    const pack = PACKS[type];
    if (!pack) return;

    if (!spendCoins(pack.cost)) return;

    SoundFx.packOpen();
    state.stats.packsOpened++;

    let player;
    let rarity;

    if (type === "limited") {
        rarity = "Limited";
        player = rollLimitedPlayer();
    } else {
        rarity = rollRarity(pack.rates);
        player = choosePlayer(rarity);
    }

    if (!player) {
        addCoins(pack.cost);
        toast("Pack scouting error — coins refunded.");
        return;
    }

    const duplicate = state.cards.some(c => c.player === player.name);

    const card = {
        id: Date.now() + "_" + Math.random().toString(36).slice(2),
        player: player.name,
        rating: player.rating,
        pos: player.pos,
        rarity: rarity,
        image: player.image || "",
        frame: "default",
        obtained: Date.now()
    };

    state.cards.push(card);
    state.stats.cardsPulled++;
    if (duplicate) state.stats.duplicates++;

    updateRarityStats(rarity, player);

    addXP(
        rarity === "World Class" ? 100 :
        rarity === "Secret" ? 35 :
        rarity === "Mythic" ? 20 :
        rarity === "Legendary" ? 10 :
        5
    );

    progressMission("packs", 1);
    progressMission("cards", 1);

    if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Rare) progressMission("rare", 1);
    if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Epic) progressMission("epic", 1);
    if ((RARITY_ORDER[rarity] || 0) >= RARITY_ORDER.Legendary) progressMission("legendary", 1);

    saveGame();

    if (rarity === "World Class") {
        showWorldClass(card);
    } else {
        showCardResult(card, duplicate);
    }

    renderAll();
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

function rollLimitedPlayer() {
    const limitedLegends = PLAYERS.filter(p => p.rarity === "Limited");
    let random = Math.random() * 100;
    for (const p of limitedLegends) {
        random -= (p.limitedOdds || 20);
        if (random < 0) return p;
    }
    return limitedLegends[0];
}

function updateRarityStats(rarity, player) {
    const key = rarity.toLowerCase().replaceAll(" ", "");
    if (state.stats[key] !== undefined) state.stats[key]++;

    if (RARITY_ORDER[rarity] > (RARITY_ORDER[state.stats.highestRarity] || 0)) {
        state.stats.highestRarity = rarity;
    }
    if (player.rating > state.stats.highestRating) {
        state.stats.highestRating = player.rating;
    }
}

/* =========================================================
   WORLD CLASS SOL'S RNG CUTSCENE & REVEAL
   ========================================================= */

function showWorldClass(card) {
    const overlay = document.getElementById("worldClassOverlay");
    if (!overlay) return;

    setText("wcPlayerName", card.player.toUpperCase());
    setText("wcPlayerMeta", `${card.rating} OVR · ${card.pos} · ★ 1 IN 10,000 WORLD CLASS ★`);

    overlay.classList.remove("hidden");
    SoundFx.cardReveal("World Class");
    state.worldClassPending = card.id;
    saveGame();
}

function showCardResult(card, duplicate) {
    const overlay = document.getElementById("cardRevealOverlay");
    const revealCard = document.getElementById("revealCard");
    const revealBadge = document.getElementById("revealBadge");
    const revealRarity = document.getElementById("revealRarity");
    const revealPhoto = document.getElementById("revealPhoto");
    const revealEmoji = document.getElementById("revealEmoji");
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

        if (revealBadge) {
            revealBadge.textContent = duplicate ? "DUPLICATE CARD" : "NEW PULL";
            revealBadge.classList.toggle("duplicate", !!duplicate);
        }

        if (revealRarity) {
            revealRarity.textContent = card.rarity.toUpperCase();
            revealRarity.className = `rarity ${rClass}`;
        }

        if (revealPhoto && card.image) {
            revealPhoto.src = card.image;
            revealPhoto.style.display = "block";
            if (revealEmoji) revealEmoji.style.display = "none";
        } else {
            if (revealPhoto) revealPhoto.style.display = "none";
            if (revealEmoji) {
                revealEmoji.style.display = "block";
                revealEmoji.textContent = playerEmoji(card);
            }
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
   COLLECTION & HOVER STATS OVERLAY
   ========================================================= */

function renderCards() {
    const grid = document.getElementById("cardsGrid");
    const filter = document.getElementById("cardFilter");
    if (!grid) return;

    let cards = [...state.cards];
    if (filter && filter.value !== "all") {
        cards = cards.filter(c => c.rarity.toLowerCase() === filter.value.toLowerCase());
    }

    cards.sort((a, b) => b.rating - a.rating);

    setText("collectionCount", `${state.cards.length} cards collected`);

    if (!cards.length) {
        grid.innerHTML = `
            <div class="empty-state">
                No cards found.<br>
                Open a scouting pack to add cards to your collection.
            </div>
        `;
        return;
    }

    grid.innerHTML = cards.map(card => {
        const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
        const value = DUPLICATE_VALUES[card.rarity] || 0;

        return `
        <article class="card ${frame.css}" onclick="viewCard('${card.id}')">

            <div class="card-hover-stats">
                <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                <h4>${escapeHTML(card.player)}</h4>
                <div class="stat-tag">OVR ${card.rating} · ${escapeHTML(card.pos)}</div>
                <div class="stat-tag">Resale Value: ${value} 🪙</div>
            </div>

            <span class="rarity ${rarityClassName(card.rarity)}">
                ${escapeHTML(card.rarity)}
            </span>

            <div class="card-image-wrap">
                ${card.image ? `<img class="card-photo" src="${card.image}" alt="${escapeHTML(card.player)}" onerror="this.style.display='none'">` : ""}
                <div class="card-image-fallback">${playerEmoji(card)}</div>
            </div>

            <div class="card-rating">
                ${card.rating}
            </div>

            <div class="card-position">
                ${escapeHTML(card.pos)}
            </div>

            <h3>${escapeHTML(card.player)}</h3>
            <small>${escapeHTML(card.rarity)}</small>

            <div class="card-actions">
                <button onclick="event.stopPropagation(); viewCard('${card.id}')">
                    View
                </button>
                ${
                    value > 0
                    ? `<button class="sell" onclick="event.stopPropagation(); sellCard('${card.id}')">
                        Sell ${value} 🪙
                    </button>`
                    : ""
                }
            </div>

        </article>
        `;
    }).join("");
}

function playerEmoji(card) {
    if (card.player.includes("Messi")) return "🔵";
    if (card.player.includes("Ronaldo")) return "🔴";
    if (card.player.includes("Mbapp")) return "⚡";
    if (card.player.includes("Haaland")) return "👑";
    if (card.player.includes("Yamal")) return "🌟";
    if (card.player.includes("Emanuel")) return "🏆";
    if (card.rarity === "World Class") return "🌎";
    if (card.rarity === "Limited") return "👑";
    return "⚽";
}

function rarityClassName(rarity) {
    return rarity.toLowerCase().replaceAll(" ", "");
}

function viewCard(id) {
    const card = state.cards.find(c => c.id === id);
    if (!card) return;
    toast(`${card.player} · OVR ${card.rating} · ${card.pos} · ${card.rarity}`);
}

function sellCard(id) {
    const index = state.cards.findIndex(c => c.id === id);
    if (index === -1) return;

    const card = state.cards[index];
    const value = DUPLICATE_VALUES[card.rarity] || 0;

    if (value <= 0) {
        toast("This card cannot be sold.");
        return;
    }

    state.cards.splice(index, 1);
    state.stats.cardsSold++;
    SoundFx.sell();
    addCoins(value);

    // Remove from showcase if equipped
    state.showcase = state.showcase.map(slotId => slotId === id ? null : slotId);

    saveGame();
    renderCards();
    renderShowcase();
    toast(`Sold ${card.player} for ${value} coins.`);
}

/* =========================================================
   6-SLOT CARD SHOWCASE (3 TOP, 3 BOTTOM)
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
                    <span>Slot ${index + 1}</span>
                </button>
            </div>
            `;
        }

        const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];
        return `
        <div class="showcase-slot" style="padding:10px;">
            <button class="showcase-slot-action" onclick="event.stopPropagation(); openShowcasePicker(${index})">Change</button>
            
            <article class="card showcase-card ${frame.css}" style="min-height:220px;padding:12px;" onclick="viewCard('${card.id}')">
                <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                <div class="card-image-wrap" style="height:100px;">
                    ${card.image ? `<img class="card-photo" src="${card.image}" onerror="this.style.display='none'">` : ""}
                    <div class="card-image-fallback" style="font-size:45px;">${playerEmoji(card)}</div>
                </div>
                <div class="card-rating" style="font-size:22px;">${card.rating}</div>
                <div class="card-position">${escapeHTML(card.pos)}</div>
                <h4 style="margin:4px 0;">${escapeHTML(card.player)}</h4>
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
        list.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No cards in your collection yet.</p>`;
    } else {
        list.innerHTML = state.cards.map(card => `
            <div class="showcase-picker-item" onclick="setShowcaseCard(${slotIndex}, '${card.id}')">
                <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                <b style="display:block;margin:4px 0;font-size:13px;">${escapeHTML(card.player)}</b>
                <small>${card.rating} OVR · ${card.pos}</small>
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
                    !unlocked
                    ? `<span style="font-size:12px;color:var(--muted)">🔒 Locked</span>`
                    : isEquipped
                    ? `<button class="title-equip-btn equipped">✓ Equipped</button>`
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
    setText("profileName", state.name || "Football Collector");
    setText("profileLevel", state.level);
    setText("profileCards", state.cards.length);
    setText("profilePacks", state.stats.packsOpened);
    setText("profilePlaytime", formatPlaytime(state.stats.playtime));
    setText("profileBest", state.stats.highestRarity || "Common");

    const avatarImg = document.getElementById("profileAvatarImg");
    const avatarWrap = document.getElementById("profileAvatarWrap");
    if (avatarImg && state.avatar) {
        avatarImg.src = state.avatar;
    }
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

    const bg = BACKGROUNDS.find(b => b.id === state.profileBackground);
    const hero = document.getElementById("profileHero");
    if (bg && hero) hero.style.background = bg.css;

    renderProfileCustomization();
    renderTitles();
}

function renderProfileCustomization() {
    const frameSelect = document.getElementById("profileFrameSelect");
    if (frameSelect) {
        frameSelect.innerHTML = state.ownedFrames.map(id => {
            const f = FRAMES.find(x => x.id === id);
            return `<option value="${f.id}" ${f.id === state.profileFrame ? "selected" : ""}>${f.name}</option>`;
        }).join("");
    }

    const bgSelect = document.getElementById("profileBackgroundSelect");
    if (bgSelect) {
        bgSelect.innerHTML = state.ownedBackgrounds.map(id => {
            const bg = BACKGROUNDS.find(b => b.id === id);
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
    toast("Stadium atmosphere background equipped.");
}

function applyCustomAvatarUrl() {
    const input = document.getElementById("avatarUrlInput");
    if (!input || !input.value.trim()) return;
    const url = input.value.trim();
    state.avatar = url;
    saveGame();
    renderProfile();
    input.value = "";
    toast("Custom avatar image applied!");
}

function setPresetAvatar(url) {
    state.avatar = url;
    saveGame();
    renderProfile();
    toast("Avatar portrait updated!");
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
                <div class="shop-preview ${frame.css}"></div>
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
   TOURNAMENT DRAFT ARENA (1,000 T-COINS & RUNS)
   ========================================================= */

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

    // Update global score
    if (draft.score > state.stats.tournamentScore) {
        state.stats.tournamentScore = draft.score;
    }

    SoundFx.cardReveal(rarity);
    toast(`🏆 Drafted ${player.name} (+${points} pts)!`);

    // Check if run finished
    if (draft.gold <= 0) {
        finishTournamentDraft();
    }

    saveGame();
    renderTournament();
}

function finishTournamentDraft() {
    const draft = state.tournamentDraft;
    SoundFx.levelUp();

    // Check top 1 unlock reward for Emanuel 99
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
        showCardResult(emanuelCard, false);
        toast("👑 TOURNAMENT CHAMPION REWARD UNLOCKED: Emanuel (99 OVR)!");
    } else {
        toast(`🏆 Draft Run Complete! Final Tournament Score: ${draft.score} pts.`);
    }

    saveGame();
    renderTournament();
    renderCards();
}

function startNewTournamentDraft() {
    state.tournamentDraft = {
        gold: 1000,
        score: 0,
        packsOpened: 0,
        cards: []
    };
    saveGame();
    renderTournament();
    SoundFx.coin();
    toast("⚔️ New 1,000 Gold Tournament Draft Run ready!");
}

function renderTournament() {
    const draft = state.tournamentDraft;
    setText("tGoldDisplay", `${draft.gold} 🪙`);
    setText("tPacksDisplay", `${draft.packsOpened} / 10`);
    setText("tScoreDisplay", `${draft.score} pts`);

    const openBtn = document.getElementById("openTournamentPackBtn");
    const resetBtn = document.getElementById("resetDraftBtn");

    if (openBtn) {
        openBtn.style.display = draft.gold > 0 ? "flex" : "none";
    }
    if (resetBtn) {
        resetBtn.style.display = draft.gold <= 0 ? "block" : "none";
    }

    // Render recent draft pulls
    const draftGrid = document.getElementById("tournamentDraftGrid");
    if (draftGrid) {
        if (!draft.cards.length) {
            draftGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px;">No cards drafted yet. Open your first Tournament Draft Pack!</p>`;
        } else {
            draftGrid.innerHTML = draft.cards.map(card => `
                <article class="card frame-champion" style="min-height:220px;padding:12px;">
                    <span class="rarity ${rarityClassName(card.rarity)}">${escapeHTML(card.rarity)}</span>
                    <div class="card-image-wrap" style="height:95px;">
                        ${card.image ? `<img class="card-photo" src="${card.image}" onerror="this.style.display='none'">` : ""}
                        <div class="card-image-fallback" style="font-size:40px;">${playerEmoji(card)}</div>
                    </div>
                    <div class="card-rating" style="font-size:22px;">${card.rating}</div>
                    <div class="card-position">${escapeHTML(card.pos)} · <b style="color:var(--gold)">+${card.points} pts</b></div>
                    <h4 style="margin:4px 0;">${escapeHTML(card.player)}</h4>
                </article>
            `).join("");
        }
    }

    // Render tournament leaderboard
    const score = Math.max(state.stats.tournamentScore, draft.score);
    const rows = [
        ["1", state.name || "Football Collector", score],
        ["2", "StrikerElite", Math.max(280, score - 25)],
        ["3", "ApexHunter", Math.max(220, score - 60)],
        ["4", "GoldenBoot", 185],
        ["5", "PitchTactician", 140]
    ];

    const el = document.getElementById("tournamentLeaderboard");
    if (el) {
        el.innerHTML = rows.map(r => `
            <div class="rank-row">
                <b>#${r[0]}</b>
                <strong>${escapeHTML(r[1])}</strong>
                <span>${r[2]} pts</span>
            </div>
        `).join("");
    }
}

/* =========================================================
   MISSIONS & THAILAND TIME (07:00 AM ICT / UTC+7) ENGINE
   ========================================================= */

function getThailandTime() {
    const now = new Date();
    // UTC + 7 hours offset
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
            <div class="mission-head">
                <b>${escapeHTML(mission[0])}</b>
                <span>+${mission[2]} 🪙</span>
            </div>
            <p>${Math.min(amount, max)} / ${max}</p>
            <div class="mission-progress">
                <i style="width:${percent}%"></i>
            </div>
            ${
                amount >= max && !isClaimed
                ? `<button class="primary-btn" style="margin-top:10px" onclick="claimMission('${type}', ${i})">Claim +${mission[2]} 🪙</button>`
                : isClaimed
                ? `<p style="color:var(--green);font-weight:800;margin-top:8px;">✓ Completed</p>`
                : ""
            }
        </div>
        `;
    }

    if (list && missions) {
        list.innerHTML = missions.map((mission, i) =>
            createMissionHTML(mission, i, currentMissionType, claimed[i], progress[i] || 0)
        ).join("");
    }

    if (homeList) {
        const dailyMissions = MISSION_TEMPLATES.daily;
        const dailyProg = (state.missionProgress && state.missionProgress.daily) || [0, 0, 0];
        const dailyClaimed = (state.missionClaimed && state.missionClaimed.daily) || [false, false, false];

        homeList.innerHTML = dailyMissions.map((mission, i) =>
            createMissionHTML(mission, i, "daily", dailyClaimed[i], dailyProg[i] || 0)
        ).join("");
    }
}

function progressMission(kind, amount) {
    const types = ["hourly", "daily", "weekly", "monthly"];
    let updated = false;

    types.forEach(type => {
        const missions = MISSION_TEMPLATES[type];
        if (!missions) return;

        missions.forEach((mission, i) => {
            const targetKind = mission[3];
            if (targetKind === kind) {
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
    
    // Daily reset check: 07:00 ICT
    if (now - state.missionReset.daily >= 86400000) {
        state.missionReset.daily = now;
        state.missionProgress.daily = [0, 0, 0];
        state.missionClaimed.daily = [false, false, false];
        saveGame();
    }

    // Weekly reset check
    if (now - state.missionReset.weekly >= 604800000) {
        state.missionReset.weekly = now;
        state.missionProgress.weekly = [0, 0, 0];
        state.missionClaimed.weekly = [false, false, false];
        saveGame();
    }

    // Monthly reset check
    if (now - state.missionReset.monthly >= 2592000000) {
        state.missionReset.monthly = now;
        state.missionProgress.monthly = [0, 0, 0];
        state.missionClaimed.monthly = [false, false, false];
        saveGame();
    }

    // Hourly reset check
    if (now - state.missionReset.hourly >= 3600000) {
        state.missionReset.hourly = now;
        state.missionProgress.hourly = [0, 0, 0];
        state.missionClaimed.hourly = [false, false, false];
        saveGame();
    }
}

/* =========================================================
   TIMERS (THAILAND TIME SYNC)
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
    const now = Date.now();
    const th = getThailandTime();
    // Days until next Monday 7 AM ICT
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

function updateFreeKick() {
    const box = document.getElementById("freeKickBox");
    if (box) {
        box.style.display = state.coins <= 0 ? "flex" : "none";
    }
}

function freeKick() {
    if (state.coins > 0) return;
    addCoins(5);
    SoundFx.coin();
    saveGame();
    toast("⚽ Emergency penalty scored! +5 🪙");
}

function formatCountdown(ms) {
    if (ms <= 0) return "00:00:00";
    let total = Math.floor(ms / 1000);
    const days = Math.floor(total / 86400);
    total %= 86400;
    const hours = Math.floor(total / 3600);
    total %= 3600;
    const mins = Math.floor(total / 60);
    const secs = total % 60;

    if (days > 0) return `${days}d ${pad(hours)}h ${pad(mins)}m`;
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

function pad(num) {
    return String(num).padStart(2, "0");
}

function formatPlaytime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
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
        toast("Invalid or expired code.");
    }
}

/* =========================================================
   LEADERBOARD & STATISTICS
   ========================================================= */

function renderStatistics() {
    const s = state.stats;
    const data = [
        ["Level", state.level, "Current level"],
        ["Playtime", formatPlaytime(s.playtime), "Time in game"],
        ["Packs Opened", s.packsOpened, "Scouting packs"],
        ["Cards Pulled", s.cardsPulled, "Cards obtained"],
        ["Cards Owned", state.cards.length, "Active collection"],
        ["Duplicates", s.duplicates, "Duplicate pulls"],
        ["Cards Sold", s.cardsSold, "Cards recycled"],
        ["Coins Earned", s.coinsEarned, "Lifetime coins"],
        ["World Class", s.worldClass, "1 in 10,000 pulls"],
        ["Secret", s.secret, "Secret pulls"],
        ["Mythic", s.mythic, "Mythic pulls"],
        ["Legendary", s.legendary, "Legendary pulls"],
        ["Limited", s.limited, "Historic icons"],
        ["Tournament", s.tournament, "Tournament cards"],
        ["Highest Rating", s.highestRating, "Peak OVR rating"],
        ["Best Rarity", s.highestRarity, "Peak rarity"],
        ["Tournament Score", s.tournamentScore, "Season peak pts"]
    ];

    const grid = document.getElementById("statisticsGrid");
    if (grid) {
        grid.innerHTML = data.map(x => `
            <div class="stat-box">
                <h3>${x[0]}</h3>
                <b>${x[1]}</b>
                <p>${x[2]}</p>
            </div>
        `).join("");
    }
}

function renderLeaderboard() {
    const container = document.getElementById("globalLeaderboard");
    if (!container) return;

    const entries = [
        { name: state.name || "Football Collector", level: state.level, cards: state.cards.length, world: state.stats.worldClass },
        { name: "GalácticoPro", level: 52, cards: 245, world: 12 },
        { name: "BallonDorMaster", level: 46, cards: 210, world: 9 },
        { name: "StrikerKing", level: 38, cards: 165, world: 6 },
        { name: "PitchTactician", level: 31, cards: 130, world: 4 },
        { name: "ScoutSupreme", level: 25, cards: 105, world: 2 }
    ];

    entries.sort((a, b) => b.level - a.level);

    container.innerHTML = entries.map((e, i) => `
        <div class="rank-row">
            <b>#${i + 1}</b>
            <strong>${escapeHTML(e.name)}</strong>
            <span>Lv.${e.level} · ${e.cards} cards · ${e.world} WC</span>
        </div>
    `).join("");
}

/* =========================================================
   ECONOMY & XP UTILITIES
   ========================================================= */

function addCoins(amount) {
    state.coins += amount;
    state.stats.coinsEarned += amount;
    progressMission("coins", amount);
    updateCoinDisplay();
    updateFreeKick();
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
    updateFreeKick();
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
        toast(`🎉 Level Up! You reached Level ${state.level}!`);
    }

    renderHero();
    renderProfile();
    saveGame();
}

function changeName() {
    const newName = prompt("Choose your collector name:", state.name);
    if (!newName) return;
    const name = newName.trim();
    if (name.length < 3) {
        toast("Name must be at least 3 characters.");
        return;
    }
    state.name = name;
    if (state.accountUser) state.accountUser = name;
    saveGame();
    renderAll();
    toast(`Name updated to: ${name}`);
}

function resetGame() {
    if (!confirm("Are you sure? This permanently deletes your Football Cards progress on this device.")) return;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

/* =========================================================
   UI NAVIGATION
   ========================================================= */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    document.querySelectorAll("button.nav").forEach(n => n.classList.remove("active"));

    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add("active-page");

    const targetNav = document.querySelector(`button.nav[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add("active");

    const sidebar = document.getElementById("sidebar");
    if (sidebar && window.innerWidth <= 700) sidebar.classList.remove("open");

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

