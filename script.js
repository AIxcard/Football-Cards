/* =========================================================
   FOOTBALL CARDS
   Complete client-side game
   ========================================================= */

const SAVE_KEY = "footballCardsSave_v4";

const RARITIES = [
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Mythic",
    "Secret",
    "World Class"
];

const RARITY_ORDER = {
    "Common": 1,
    "Uncommon": 2,
    "Rare": 3,
    "Epic": 4,
    "Legendary": 5,
    "Mythic": 6,
    "Secret": 7,
    "World Class": 8,
    "Limited": 9,
    "Tournament": 10
};

/* =========================================================
   PLAYERS
   60+ REAL FOOTBALL PLAYERS
   ========================================================= */

const PLAYERS = [
    {name:"Lionel Messi", rating:97, pos:"RW", rarity:"World Class"},
    {name:"Cristiano Ronaldo", rating:97, pos:"ST", rarity:"World Class"},
    {name:"Kylian Mbappé", rating:96, pos:"ST", rarity:"Secret"},
    {name:"Erling Haaland", rating:96, pos:"ST", rarity:"Secret"},
    {name:"Lamine Yamal", rating:94, pos:"RW", rarity:"Mythic"},
    {name:"Neymar Jr", rating:95, pos:"LW", rarity:"Mythic"},
    {name:"Kevin De Bruyne", rating:94, pos:"CM", rarity:"Mythic"},
    {name:"Vinícius Júnior", rating:94, pos:"LW", rarity:"Mythic"},
    {name:"Jude Bellingham", rating:93, pos:"CM", rarity:"Mythic"},
    {name:"Mohamed Salah", rating:93, pos:"RW", rarity:"Mythic"},
    {name:"Robert Lewandowski", rating:93, pos:"ST", rarity:"Mythic"},
    {name:"Harry Kane", rating:93, pos:"ST", rarity:"Legendary"},
    {name:"Rodri", rating:93, pos:"CDM", rarity:"Legendary"},
    {name:"Pedri", rating:91, pos:"CM", rarity:"Legendary"},
    {name:"Bukayo Saka", rating:91, pos:"RW", rarity:"Legendary"},
    {name:"Phil Foden", rating:91, pos:"RW", rarity:"Legendary"},
    {name:"Bernardo Silva", rating:91, pos:"CAM", rarity:"Legendary"},
    {name:"Martin Ødegaard", rating:91, pos:"CAM", rarity:"Legendary"},
    {name:"Antoine Griezmann", rating:91, pos:"CF", rarity:"Legendary"},
    {name:"Son Heung-min", rating:90, pos:"LW", rarity:"Legendary"},
    {name:"Virgil van Dijk", rating:91, pos:"CB", rarity:"Legendary"},
    {name:"Thibaut Courtois", rating:90, pos:"GK", rarity:"Legendary"},
    {name:"Alisson Becker", rating:90, pos:"GK", rarity:"Legendary"},
    {name:"Rúben Dias", rating:89, pos:"CB", rarity:"Epic"},
    {name:"William Saliba", rating:89, pos:"CB", rarity:"Epic"},
    {name:"Achraf Hakimi", rating:89, pos:"RB", rarity:"Epic"},
    {name:"Theo Hernández", rating:89, pos:"LB", rarity:"Epic"},
    {name:"Trent Alexander-Arnold", rating:88, pos:"RB", rarity:"Epic"},
    {name:"Declan Rice", rating:89, pos:"CDM", rarity:"Epic"},
    {name:"Bruno Fernandes", rating:89, pos:"CAM", rarity:"Epic"},
    {name:"Lautaro Martínez", rating:89, pos:"ST", rarity:"Epic"},
    {name:"Victor Osimhen", rating:89, pos:"ST", rarity:"Epic"},
    {name:"Rafael Leão", rating:88, pos:"LW", rarity:"Epic"},
    {name:"Cole Palmer", rating:88, pos:"CAM", rarity:"Epic"},
    {name:"Jamal Musiala", rating:89, pos:"CAM", rarity:"Epic"},
    {name:"Florian Wirtz", rating:88, pos:"CAM", rarity:"Epic"},
    {name:"Kai Havertz", rating:86, pos:"ST", rarity:"Rare"},
    {name:"Marcus Rashford", rating:85, pos:"LW", rarity:"Rare"},
    {name:"Mason Mount", rating:83, pos:"CM", rarity:"Rare"},
    {name:"Christian Pulisic", rating:86, pos:"LW", rarity:"Rare"},
    {name:"Federico Valverde", rating:88, pos:"CM", rarity:"Rare"},
    {name:"Eduardo Camavinga", rating:86, pos:"CM", rarity:"Rare"},
    {name:"Aurélien Tchouaméni", rating:86, pos:"CDM", rarity:"Rare"},
    {name:"Gabriel Martinelli", rating:84, pos:"LW", rarity:"Rare"},
    {name:"Ousmane Dembélé", rating:87, pos:"RW", rarity:"Rare"},
    {name:"Gianluigi Donnarumma", rating:89, pos:"GK", rarity:"Rare"},
    {name:"Manuel Neuer", rating:88, pos:"GK", rarity:"Rare"},
    {name:"Luka Modrić", rating:88, pos:"CM", rarity:"Legendary"},
    {name:"Toni Kroos", rating:88, pos:"CM", rarity:"Legendary"},
    {name:"Zlatan Ibrahimović", rating:91, pos:"ST", rarity:"Secret"},
    {name:"Sergio Ramos", rating:90, pos:"CB", rarity:"Secret"},
    {name:"Andrés Iniesta", rating:93, pos:"CM", rarity:"Secret"},
    {name:"Xavi", rating:92, pos:"CM", rarity:"Secret"},
    {name:"Ronaldinho", rating:94, pos:"LW", rarity:"Limited"},
    {name:"Zinedine Zidane", rating:95, pos:"CAM", rarity:"Limited"},
    {name:"Diego Maradona", rating:96, pos:"CAM", rarity:"Limited"},
    {name:"Pelé", rating:98, pos:"ST", rarity:"Limited"},
    {name:"Thierry Henry", rating:94, pos:"ST", rarity:"Limited"},
    {name:"Ronaldo Nazário", rating:97, pos:"ST", rarity:"Limited"},
    {name:"David Beckham", rating:91, pos:"RM", rarity:"Limited"},
    {name:"Andrea Pirlo", rating:91, pos:"CM", rarity:"Limited"},
    {name:"Paolo Maldini", rating:94, pos:"CB", rarity:"Limited"},
    {name:"Gianluigi Buffon", rating:94, pos:"GK", rarity:"Limited"}
];

/* =========================================================
   PACK RATES
   Premium removes Common.
   Elite removes Common + Uncommon.
   World Class remains extremely rare.
   ========================================================= */

const PACKS = {
    starter: {
        name:"Starter Pack",
        cost:10,
        rates:{
            Common:70,
            Uncommon:20,
            Rare:7,
            Epic:2.5,
            Legendary:.5,
            Mythic:0,
            Secret:0,
            "World Class":0
        }
    },

    premium: {
        name:"Premium Pack",
        cost:25,
        rates:{
            Common:0,
            Uncommon:72,
            Rare:20,
            Epic:6,
            Legendary:2,
            Mythic:0,
            Secret:0,
            "World Class":0
        }
    },

    elite: {
        name:"Elite Pack",
        cost:50,
        rates:{
            Common:0,
            Uncommon:0,
            Rare:72,
            Epic:20,
            Legendary:6,
            Mythic:1.9,
            Secret:.09,
            "World Class":.01
        }
    },

    worldtest: {
        name:"World Class Test",
        cost:1,
        rates:{
            "World Class":100
        }
    },

    limited: {
        name:"Legends of the Past Pack",
        cost:75,
        rates:{
            Limited:100
        }
    }
};

/* =========================================================
   ECONOMY
   ========================================================= */

const DUPLICATE_VALUES = {
    Common:2,
    Uncommon:3,
    Rare:5,
    Epic:8,
    Legendary:15,
    Mythic:30,
    Secret:75,
    "World Class":0,
    Tournament:0,
    Limited:25
};

/* =========================================================
   FRAMES
   ========================================================= */

const FRAMES = [
    {id:"default", name:"Classic", cost:0, css:"frame-default"},
    {id:"blue", name:"Blue Pulse", cost:20, css:"frame-blue"},
    {id:"green", name:"Emerald", cost:35, css:"frame-green"},
    {id:"purple", name:"Royal Purple", cost:50, css:"frame-purple"},
    {id:"gold", name:"Golden", cost:100, css:"frame-gold"},
    {id:"red", name:"Crimson", cost:150, css:"frame-red"},
    {id:"rainbow", name:"Animated Prism", cost:300, css:"frame-rainbow"},
    {id:"champion", name:"Champion", cost:500, css:"frame-champion"}
];

const BACKGROUNDS = [
    {
        id:"stadium",
        name:"Night Stadium",
        cost:0,
        css:"linear-gradient(135deg,#07101a,#153b5b,#07101a)"
    },
    {
        id:"pitch",
        name:"Football Pitch",
        cost:50,
        css:"linear-gradient(135deg,#082b1b,#0b633a,#062115)"
    },
    {
        id:"lights",
        name:"Stadium Lights",
        cost:100,
        css:"radial-gradient(circle at 50% 0%,#4a77aa,#0b111a 55%)"
    },
    {
        id:"champions",
        name:"Champions",
        cost:250,
        css:"linear-gradient(135deg,#16100a,#6a4d16,#0b111a)"
    },
    {
        id:"blue",
        name:"Blue Arena",
        cost:350,
        css:"linear-gradient(135deg,#06122b,#155fc1,#06122b)"
    },
    {
        id:"cosmic",
        name:"Cosmic Football",
        cost:500,
        css:"radial-gradient(circle at 30% 30%,#4b2180,#10152e 50%,#050713)"
    }
];

/* =========================================================
   MISSIONS
   ========================================================= */

const MISSION_TEMPLATES = {
    hourly:[
        ["Open 1 pack",1,5,"packs"],
        ["Earn 5 coins",5,5,"coins"],
        ["Collect 1 card",1,5,"cards"]
    ],
    daily:[
        ["Open 3 packs",3,20,"packs"],
        ["Collect 5 cards",5,25,"cards"],
        ["Pull Rare or better",1,30,"rare"]
    ],
    weekly:[
        ["Open 15 packs",15,100,"packs"],
        ["Collect 20 cards",20,120,"cards"],
        ["Pull Epic or better",3,150,"epic"]
    ],
    monthly:[
        ["Open 60 packs",60,500,"packs"],
        ["Collect 75 cards",75,650,"cards"],
        ["Pull Legendary or better",5,800,"legendary"]
    ]
};

/* =========================================================
   DEFAULT SAVE
   ========================================================= */

function freshState() {
    return {
        initialized:false,
        name:"",
        coins:100,
        xp:25,
        level:1,

        cards:[],
        ownedFrames:["default"],
        ownedBackgrounds:["stadium"],

        profileBackground:"stadium",
        avatar:"⚽",

        equippedTitle:"Football Collector",

        stats:{
            playtime:0,
            packsOpened:0,
            cardsPulled:0,
            duplicates:0,
            cardsSold:0,
            coinsEarned:0,
            coinsSpent:0,
            worldClass:0,
            secret:0,
            mythic:0,
            legendary:0,
            rare:0,
            epic:0,
            uncommon:0,
            common:0,
            limited:0,
            tournament:0,
            highestRating:0,
            highestRarity:"Common",
            tournamentEntries:0,
            tournamentScore:0
        },

        missionProgress:{
            hourly:[0,0,0],
            daily:[0,0,0],
            weekly:[0,0,0],
            monthly:[0,0,0]
        },

        missionClaimed:{
            hourly:[false,false,false],
            daily:[false,false,false],
            weekly:[false,false,false],
            monthly:[false,false,false]
        },

        missionReset:{
            hourly:Date.now(),
            daily:Date.now(),
            weekly:Date.now(),
            monthly:Date.now()
        },

        dailyRewardClaimed:0,
        freeKickClaimed:0,

        limitedStart:0,
        tournamentStart:0,

        worldClassPending:null,

        localPlayers:[],

        lastSave:Date.now()
    };
}

let state = loadGame();
let currentMissionType = "hourly";
let playStarted = Date.now();

/* =========================================================
   SAVE / LOAD
   ========================================================= */

function loadGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);

        if (!raw) return freshState();

        const saved = JSON.parse(raw);

        return Object.assign(freshState(), saved, {
            stats:Object.assign(freshState().stats,saved.stats || {}),
            missionProgress:Object.assign(freshState().missionProgress,saved.missionProgress || {}),
            missionClaimed:Object.assign(freshState().missionClaimed,saved.missionClaimed || {})
        });
    } catch(e) {
        return freshState();
    }
}

function saveGame() {
    state.lastSave = Date.now();
    localStorage.setItem(SAVE_KEY,JSON.stringify(state));
}

window.addEventListener("beforeunload",saveGame);

setInterval(() => {
    updatePlaytime();
    saveGame();
},10000);

function updatePlaytime() {
    const seconds = Math.floor((Date.now() - playStarted) / 1000);

    if (seconds > 0) {
        state.stats.playtime += seconds;
        playStarted = Date.now();
    }
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded",() => {
    checkName();
    renderAll();
    updateTimers();

    setInterval(updateTimers,1000);
    setInterval(checkMissionResets,1000);
});

function checkName() {
    if (!state.initialized || !state.name) {
        document.getElementById("nameModal").classList.remove("hidden");
    }
}

document.getElementById("nameConfirm").addEventListener("click",() => {
    const input = document.getElementById("nameInput");
    const error = document.getElementById("nameError");

    const name = input.value.trim();

    if (name.length < 3) {
        error.textContent = "Name must be at least 3 characters.";
        return;
    }

    if (!/^[a-zA-Z0-9 _-]+$/.test(name)) {
        error.textContent = "Use letters, numbers, spaces, - or _.";
        return;
    }

    const usedNames = JSON.parse(localStorage.getItem("footballCardsNames") || "[]");

    const lower = name.toLowerCase();

    if (usedNames.includes(lower) && lower !== state.name.toLowerCase()) {
        error.textContent = "That name is already used on this device.";
        return;
    }

    if (!usedNames.includes(lower)) {
        usedNames.push(lower);
        localStorage.setItem("footballCardsNames",JSON.stringify(usedNames));
    }

    state.name = name;
    state.initialized = true;

    startLimitedEvent();
    startTournament();

    saveGame();

    document.getElementById("nameModal").classList.add("hidden");

    renderAll();
    toast("Welcome to Football Cards!");
});

/* =========================================================
   NAVIGATION
   ========================================================= */

function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));

    const target = document.getElementById(page);

    if (target) target.classList.add("active-page");

    document.querySelectorAll(".nav").forEach(n => {
        n.classList.toggle("active",n.dataset.page === page);
    });

    if (page === "cards") renderCards();
    if (page === "profile") renderProfile();
    if (page === "shop") renderShop();
    if (page === "statistics") renderStatistics();
    if (page === "leaderboard") renderLeaderboard();
    if (page === "tournament") renderTournament();

    document.getElementById("sidebar").classList.remove("open");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

/* =========================================================
   BASIC UI
   ========================================================= */

function renderAll() {
    document.getElementById("coinDisplay").textContent = state.coins;

    const name = state.name || "Football Collector";

    document.getElementById("homeName").textContent = name;
    document.getElementById("profileName").textContent = name;
    document.getElementById("settingsCurrentName").textContent = name;

    document.getElementById("homeLevel").textContent = state.level;
    document.getElementById("profileLevel").textContent = state.level;

    document.getElementById("homeXP").textContent = state.xp;
    document.getElementById("profileXP").textContent = `${state.xp} / 50 XP`;

    const xpPercent = Math.min(100,(state.xp / 50) * 100);

    document.getElementById("homeXPBar").style.width = xpPercent + "%";
    document.getElementById("profileXPBar").style.width = xpPercent + "%";

    document.getElementById("homeCards").textContent = state.cards.length;
    document.getElementById("profileCards").textContent = state.cards.length;

    document.getElementById("profilePacks").textContent = state.stats.packsOpened;
    document.getElementById("profilePlaytime").textContent = formatPlaytime(state.stats.playtime);

    document.getElementById("homeAvatar").textContent = state.avatar;
    document.getElementById("profileAvatar").textContent = state.avatar;

    renderMissions();
    renderProfile();
    updateDailyReward();
    updateFreeKick();

    if (isLimitedActive()) {
        document.getElementById("limitedPackCard").style.display = "flex";
    } else {
        document.getElementById("limitedPackCard").style.display = "none";
    }
}

function toast(message) {
    const el = document.getElementById("toast");

    el.textContent = message;
    el.classList.add("show");

    clearTimeout(window.toastTimeout);

    window.toastTimeout = setTimeout(() => {
        el.classList.remove("show");
    },2500);
}

function formatPlaytime(seconds) {
    if (seconds < 60) return seconds + "s";

    const mins = Math.floor(seconds / 60);

    if (mins < 60) return mins + "m";

    const hours = Math.floor(mins / 60);

    return `${hours}h ${mins % 60}m`;
}

/* =========================================================
   COINS
   ========================================================= */

function addCoins(amount) {
    state.coins += amount;

    if (amount > 0) {
        state.stats.coinsEarned += amount;
    }

    saveGame();
    renderAll();
}

function spendCoins(amount) {
    if (state.coins < amount) {
        toast("Not enough coins.");
        return false;
    }

    state.coins -= amount;
    state.stats.coinsSpent += amount;

    saveGame();
    renderAll();

    return true;
}

function addTestCoins() {
    addCoins(1000);
    toast("+1,000 test coins added.");
}

/* =========================================================
   DAILY REWARD
   ========================================================= */

function claimDailyReward() {
    const now = Date.now();

    if (now - state.dailyRewardClaimed < 86400000) {
        toast("Daily reward is not ready yet.");
        return;
    }

    addCoins(100);
    state.dailyRewardClaimed = now;

    addXP(10);

    saveGame();
    renderAll();

    toast("🎁 Daily reward: +100 coins!");
}

function updateDailyReward() {
    const btn = document.getElementById("dailyRewardBtn");
    const text = document.getElementById("dailyRewardText");

    if (Date.now() - state.dailyRewardClaimed >= 86400000) {
        btn.disabled = false;
        btn.textContent = "Claim";
        text.textContent = "Your daily reward is ready.";
    } else {
        btn.disabled = true;
        btn.textContent = "Claimed";
        text.textContent = "Come back tomorrow.";
    }
}

/* =========================================================
   FREE KICK
   ========================================================= */

function freeKick() {
    if (state.coins > 0) {
        toast("Free Kick only appears when you have 0 coins.");
        return;
    }

    if (Date.now() - state.freeKickClaimed < 86400000) {
        toast("Free Kick already used today.");
        return;
    }

    state.freeKickClaimed = Date.now();
    addCoins(5);

    toast("🆘 Free Kick: +5 coins!");
}

function updateFreeKick() {
    const box = document.getElementById("freeKickBox");

    if (state.coins === 0) {
        box.style.display = "flex";
    } else {
        box.style.display = "none";
    }
}

/* =========================================================
   LEVEL
   ========================================================= */

function addXP(amount) {
    state.xp += amount;

    while (state.xp >= 50) {
        state.xp -= 50;
        state.level++;
        toast(`⭐ Level ${state.level}!`);
    }

    saveGame();
}

/* =========================================================
   PACK OPENING
   ========================================================= */

function openPack(type) {
    if (!PACKS[type]) return;

    if (type === "limited" && !isLimitedActive()) {
        toast("The limited event has ended.");
        return;
    }

    const pack = PACKS[type];

    if (!spendCoins(pack.cost)) return;

    state.stats.packsOpened++;

    const rarity = rollRarity(pack.rates);
    const player = choosePlayer(rarity);

    if (!player) {
        addCoins(pack.cost);
        toast("Pack error — your coins were returned.");
        return;
    }

    const duplicate = state.cards.some(c => c.player === player.name);

    const card = {
        id:Date.now() + "_" + Math.random().toString(36).slice(2),
        player:player.name,
        rating:player.rating,
        pos:player.pos,
        rarity:rarity,
        frame:"default",
        obtained:Date.now()
    };

    state.cards.push(card);

    state.stats.cardsPulled++;

    if (duplicate) state.stats.duplicates++;

    updateRarityStats(rarity,player);

    addXP(rarity === "World Class" ? 100 : rarity === "Secret" ? 35 : 5);

    progressMission("packs",1);
    progressMission("cards",1);

    if (RARITY_ORDER[rarity] >= RARITY_ORDER["Rare"]) {
        progressMission("rare",1);
    }

    if (RARITY_ORDER[rarity] >= RARITY_ORDER["Epic"]) {
        progressMission("epic",1);
    }

    if (RARITY_ORDER[rarity] >= RARITY_ORDER["Legendary"]) {
        progressMission("legendary",1);
    }

    saveGame();

    if (rarity === "World Class") {
        showWorldClass(card);
    } else {
        showCardResult(card,duplicate);
    }

    renderAll();
}

function rollRarity(rates) {
    const random = Math.random() * 100;
    let total = 0;

    for (const rarity of Object.keys(rates)) {
        total += rates[rarity];

        if (random <= total) {
            return rarity;
        }
    }

    return Object.keys(rates)[0];
}

function choosePlayer(rarity) {
    let pool = PLAYERS.filter(p => p.rarity === rarity);

    if (rarity === "World Class") {
        pool = PLAYERS.filter(p =>
            p.name === "Lionel Messi" ||
            p.name === "Cristiano Ronaldo"
        );
    }

    if (rarity === "Limited") {
        pool = PLAYERS.filter(p => p.rarity === "Limited");
    }

    if (pool.length === 0) {
        pool = PLAYERS.filter(p => p.rarity === "Common");
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

function updateRarityStats(rarity,player) {
    const key = rarity.toLowerCase().replace(" ","");

    if (state.stats[key] !== undefined) {
        state.stats[key]++;
    }

    if ((RARITY_ORDER[rarity] || 0) > (RARITY_ORDER[state.stats.highestRarity] || 0)) {
        state.stats.highestRarity = rarity;
    }

    if (player.rating > state.stats.highestRating) {
        state.stats.highestRating = player.rating;
    }
}

/* =========================================================
   WORLD CLASS CUTSCENE
   ========================================================= */

function showWorldClass(card) {
    const overlay = document.getElementById("worldClassOverlay");

    document.getElementById("wcPlayerName").textContent =
        card.player.toUpperCase();

    document.getElementById("wcPlayerMeta").textContent =
        `${card.rating} · ${card.pos} · WORLD CLASS`;

    overlay.classList.remove("hidden");

    state.worldClassPending = card.id;

    saveGame();
}

document.getElementById("wcContinue").addEventListener("click",() => {
    document.getElementById("worldClassOverlay").classList.add("hidden");

    const card = state.cards.find(c => c.id === state.worldClassPending);

    if (card) {
        showCardResult(card,false);
    }

    state.worldClassPending = null;
    saveGame();
});

/* =========================================================
   NORMAL CARD RESULT
   ========================================================= */

function showCardResult(card,duplicate) {
    const rarityClass = rarityClassName(card.rarity);

    toast(
        `${card.player} — ${card.rarity}${duplicate ? " · DUPLICATE" : ""}`
    );
}

function rarityClassName(rarity) {
    return rarity.toLowerCase().replace(" ","");
}

/* =========================================================
   CARDS PAGE
   ========================================================= */

function renderCards() {
    const grid = document.getElementById("cardsGrid");
    const filter = document.getElementById("cardFilter").value;

    let cards = [...state.cards];

    if (filter !== "all") {
        cards = cards.filter(c => c.rarity === filter);
    }

    document.getElementById("collectionCount").textContent =
        `${state.cards.length} cards collected`;

    if (cards.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                No cards here yet.<br>
                Open a pack to start collecting.
            </div>
        `;
        return;
    }

    grid.innerHTML = cards.map(card => {
        const frame = FRAMES.find(f => f.id === card.frame) || FRAMES[0];

        return `
            <article class="card ${frame.css}">
                <span class="rarity ${rarityClassName(card.rarity)}">
                    ${card.rarity}
                </span>

                <div class="card-image">${playerEmoji(card)}</div>

                <div class="card-rating">${card.rating}</div>
                <div class="card-position">${card.pos}</div>

                <h3>${escapeHTML(card.player)}</h3>
                <small>${card.rarity}</small>

                <div class="card-actions">
                    <button onclick="viewCard('${card.id}')">View</button>
                    ${
                        DUPLICATE_VALUES[card.rarity] > 0
                        ? `<button class="sell" onclick="sellCard('${card.id}')">
                            Sell ${DUPLICATE_VALUES[card.rarity]} 🪙
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

    if (card.rarity === "World Class") return "🌎";
    if (card.rarity === "Tournament") return "🏆";
    if (card.rarity === "Limited") return "👑";

    return "⚽";
}

function viewCard(id) {
    const card = state.cards.find(c => c.id === id);

    if (!card) return;

    toast(`${card.player} · ${card.rating} · ${card.rarity}`);
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

    state.cards.splice(index,1);

    state.stats.cardsSold++;

    addCoins(value);

    saveGame();
    renderCards();

    toast(`Sold ${card.player} for ${value} coins.`);
}

/* =========================================================
   SHOP
   ========================================================= */

function renderShop() {
    const frameShop = document.getElementById("frameShop");
    const backgroundShop = document.getElementById("backgroundShop");

    frameShop.innerHTML = FRAMES.map(frame => {
        const owned = state.ownedFrames.includes(frame.id);

        return `
            <div class="shop-item">
                <div class="shop-preview ${frame.css}"></div>
                <h3>${frame.name}</h3>
                <p>${frame.cost === 0 ? "Free" : frame.cost + " coins"}</p>

                <button
                    class="${owned ? "owned" : ""}"
                    ${owned ? "disabled" : ""}
                    onclick="buyFrame('${frame.id}')">
                    ${owned ? "Owned" : "Buy"}
                </button>
            </div>
        `;
    }).join("");

    backgroundShop.innerHTML = BACKGROUNDS.map(bg => {
        const owned = state.ownedBackgrounds.includes(bg.id);

        return `
            <div class="shop-item">
                <div class="shop-preview" style="background:${bg.css}"></div>
                <h3>${bg.name}</h3>
                <p>${bg.cost === 0 ? "Free" : bg.cost + " coins"}</p>

                <button
                    class="${owned ? "owned" : ""}"
                    ${owned ? "disabled" : ""}
                    onclick="buyBackground('${bg.id}')">
                    ${owned ? "Owned" : "Buy"}
                </button>
            </div>
        `;
    }).join("");
}

function buyFrame(id) {
    const frame = FRAMES.find(f => f.id === id);

    if (!frame) return;

    if (state.ownedFrames.includes(id)) {
        toast("You already own this frame.");
        return;
    }

    if (!spendCoins(frame.cost)) return;

    state.ownedFrames.push(id);

    saveGame();
    renderShop();

    toast(`Frame unlocked: ${frame.name}`);
}

function buyBackground(id) {
    const bg = BACKGROUNDS.find(b => b.id === id);

    if (!bg) return;

    if (state.ownedBackgrounds.includes(id)) {
        toast("You already own this background.");
        return;
    }

    if (!spendCoins(bg.cost)) return;

    state.ownedBackgrounds.push(id);

    saveGame();
    renderShop();

    toast(`Background unlocked: ${bg.name}`);
}

/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile() {
    document.getElementById("profileName").textContent =
        state.name || "Football Collector";

    document.getElementById("profileAvatar").textContent = state.avatar;

    const bg = BACKGROUNDS.find(b => b.id === state.profileBackground);

    if (bg) {
        document.getElementById("profileHero").style.background =
            `${bg.css}`;
    }

    const best = state.stats.highestRarity || "Common";

    document.getElementById("profileBest").textContent = best;

    renderProfileCustomization();
    renderTitles();
    renderProfileCards();
}

function renderProfileCustomization() {
    const select = document.getElementById("profileBackgroundSelect");

    select.innerHTML = state.ownedBackgrounds.map(id => {
        const bg = BACKGROUNDS.find(b => b.id === id);

        return `
            <option value="${bg.id}" ${bg.id === state.profileBackground ? "selected" : ""}>
                ${bg.name}
            </option>
        `;
    }).join("");

    document.getElementById("avatarSelect").value = state.avatar;
}

function setProfileBackground(id) {
    if (!state.ownedBackgrounds.includes(id)) {
        toast("You don't own that background.");
        return;
    }

    state.profileBackground = id;

    saveGame();
    renderProfile();

    toast("Profile background equipped.");
}

function setAvatar(value) {
    state.avatar = value;

    saveGame();
    renderAll();
}

function renderProfileCards() {
    const grid = document.getElementById("profileCardsGrid");

    if (!state.cards.length) {
        grid.innerHTML = `
            <div class="empty-state">
                Open some packs first.
            </div>
        `;
        return;
    }

    grid.innerHTML = state.cards.map(card => {
        return `
            <div class="profile-card-mini">
                <div class="mini-card-art ${(
                    FRAMES.find(f => f.id === card.frame) || FRAMES[0]
                ).css}">
                    ${playerEmoji(card)}
                </div>

                <b>${escapeHTML(card.player)}</b>

                <select onchange="setCardFrame('${card.id}',this.value)">
                    ${state.ownedFrames.map(frameId => {
                        const frame = FRAMES.find(f => f.id === frameId);

                        return `
                            <option
                                value="${frame.id}"
                                ${frame.id === card.frame ? "selected" : ""}>
                                ${frame.name}
                            </option>
                        `;
                    }).join("")}
                </select>
            </div>
        `;
    }).join("");
}

function setCardFrame(cardId,frameId) {
    const card = state.cards.find(c => c.id === cardId);

    if (!card) return;

    if (!state.ownedFrames.includes(frameId)) {
        toast("You don't own that frame.");
        return;
    }

    card.frame = frameId;

    saveGame();
    renderProfile();

    toast("Card frame equipped.");
}

/* =========================================================
   TITLES
   ========================================================= */

const TITLES = [
    {
        id:"collector",
        name:"Football Collector",
        requirement:"Start the game",
        unlock:() => state.initialized
    },
    {
        id:"messi",
        name:"The Greatest",
        requirement:"Own Lionel Messi",
        unlock:() => ownsPlayer("Lionel Messi")
    },
    {
        id:"ronaldo",
        name:"The King",
        requirement:"Own Cristiano Ronaldo",
        unlock:() => ownsPlayer("Cristiano Ronaldo")
    },
    {
        id:"world",
        name:"World Class Hunter",
        requirement:"Pull a World Class card",
        unlock:() => state.stats.worldClass > 0
    },
    {
        id:"legend",
        name:"Legend Collector",
        requirement:"Own 5 Legendary+ cards",
        unlock:() => state.cards.filter(c =>
            RARITY_ORDER[c.rarity] >= 5
        ).length >= 5
    },
    {
        id:"emanuel",
        name:"Emanuel's Challenger",
        requirement:"Enter Season 1 Tournament",
        unlock:() => state.stats.tournamentEntries > 0
    },
    {
        id:"champion",
        name:"Season 1 Champion",
        requirement:"Finish #1 in Tournament Season 1",
        unlock:() => state.stats.tournamentScore >= 1000
    }
];

function ownsPlayer(name) {
    return state.cards.some(c => c.player === name);
}

function renderTitles() {
    const container = document.getElementById("titleList");

    container.innerHTML = TITLES.map(title => {
        const unlocked = title.unlock();

        return `
            <div
                class="title ${unlocked ? "unlocked" : ""}"
                title="${title.requirement}">
                ${unlocked ? "✓ " : "🔒 "}
                ${title.name}
            </div>
        `;
    }).join("");
}

function changeName() {
    const newName = prompt(
        "Choose your new player name:",
        state.name
    );

    if (!newName) return;

    const name = newName.trim();

    if (name.length < 3) {
        toast("Name must be at least 3 characters.");
        return;
    }

    const names = JSON.parse(
        localStorage.getItem("footballCardsNames") || "[]"
    );

    const lower = name.toLowerCase();

    if (
        names.includes(lower) &&
        lower !== state.name.toLowerCase()
    ) {
        toast("That name is already used on this device.");
        return;
    }

    const old = state.name.toLowerCase();

    const index = names.indexOf(old);

    if (index >= 0) {
        names.splice(index,1);
    }

    names.push(lower);

    localStorage.setItem(
        "footballCardsNames",
        JSON.stringify(names)
    );

    state.name = name;

    saveGame();
    renderAll();

    toast("Name changed.");
}

/* =========================================================
   STATISTICS
   ========================================================= */

function renderStatistics() {
    const s = state.stats;

    const data = [
        ["Level",state.level,"Current collector level"],
        ["Playtime",formatPlaytime(s.playtime),"Total time spent playing"],
        ["Packs Opened",s.packsOpened,"Total packs opened"],
        ["Cards Pulled",s.cardsPulled,"Cards obtained from packs"],
        ["Cards Owned",state.cards.length,"Current collection"],
        ["Duplicates",s.duplicates,"Duplicate pulls"],
        ["Cards Sold",s.cardsSold,"Cards sold"],
        ["Coins Earned",s.coinsEarned,"Lifetime coins earned"],
        ["Coins Spent",s.coinsSpent,"Lifetime coins spent"],
        ["Common",s.common,"Common cards pulled"],
        ["Uncommon",s.uncommon,"Uncommon cards pulled"],
        ["Rare",s.rare,"Rare cards pulled"],
        ["Epic",s.epic,"Epic cards pulled"],
        ["Legendary",s.legendary,"Legendary cards pulled"],
        ["Mythic",s.mythic,"Mythic cards pulled"],
        ["Secret",s.secret,"Secret cards pulled"],
        ["World Class",s.worldClass,"World Class cards pulled"],
        ["Limited",s.limited,"Limited cards pulled"],
        ["Tournament",s.tournament,"Tournament cards pulled"],
        ["Highest Rating",s.highestRating,"Highest player rating obtained"],
        ["Best Rarity",s.highestRarity,"Highest rarity obtained"],
        ["Tournament Entries",s.tournamentEntries,"Season 1 entries"]
    ];

    document.getElementById("statisticsGrid").innerHTML =
        data.map(x => `
            <div class="stat-box">
                <h3>${x[0]}</h3>
                <b>${x[1]}</b>
                <p>${x[2]}</p>
            </div>
        `).join("");
}

/* =========================================================
   MISSIONS
   ========================================================= */

function setMissionType(type) {
    currentMissionType = type;

    document.querySelectorAll(".mission-tab").forEach(tab => {
        tab.classList.remove("active");

        if (tab.textContent.toLowerCase() === type) {
            tab.classList.add("active");
        }
    });

    renderMissions();
}

function renderMissions() {
    const missions = MISSION_TEMPLATES[currentMissionType];
    const progress = state.missionProgress[currentMissionType];
    const claimed = state.missionClaimed[currentMissionType];

    document.getElementById("missionList").innerHTML =
        missions.map((mission,i) => {
            const amount = progress[i] || 0;
            const max = mission[1];
            const percent = Math.min(100,(amount/max)*100);

            return `
                <div class="mission ${claimed[i] ? "completed" : ""}">
                    <div class="mission-top">
                        <b>${mission[0]}</b>
                        <span>+${mission[2]} 🪙</span>
                    </div>

                    <p>${Math.min(amount,max)} / ${max}</p>

                    <div class="mission-progress">
                        <i style="width:${percent}%"></i>
                    </div>

                    ${
                        amount >= max && !claimed[i]
                        ? `<button class="primary-btn"
                            style="margin-top:10px"
                            onclick="claimMission('${currentMissionType}',${i})">
                            Claim
                           </button>`
                        : claimed[i]
                        ? `<p>✓ Completed</p>`
                        : ""
                    }
                </div>
            `;
        }).join("");
}

function progressMission(type,amount) {
    const missions = MISSION_TEMPLATES[type];

    missions.forEach((mission,i) => {
        const kind = mission[3];

        if (kind === "packs" || kind === "cards") {
            state.missionProgress[type][i] += amount;
        }
    });

    saveGame();
}

function claimMission(type,index) {
    const mission = MISSION_TEMPLATES[type][index];

    const progress = state.missionProgress[type][index];

    if (progress < mission[1]) {
        return;
    }

    if (state.missionClaimed[type][index]) {
        return;
    }

    state.missionClaimed[type][index] = true;

    addCoins(mission[2]);
    addXP(Math.min(50,Math.floor(mission[2]/2)));

    saveGame();
    renderMissions();

    toast(`Mission complete: +${mission[2]} coins!`);
}

function checkMissionResets() {
    const now = Date.now();

    const durations = {
        hourly:3600000,
        daily:86400000,
        weekly:604800000,
        monthly:2592000000
    };

    for (const type in durations) {
        if (now - state.missionReset[type] >= durations[type]) {
            state.missionReset[type] = now;
            state.missionProgress[type] = [0,0,0];
            state.missionClaimed[type] = [false,false,false];

            saveGame();
        }
    }
}

/* =========================================================
   LIMITED EVENT
   ========================================================= */

function startLimitedEvent() {
    if (!state.limitedStart) {
        state.limitedStart = Date.now();
        saveGame();
    }
}

function isLimitedActive() {
    if (!state.limitedStart) return false;

    return Date.now() - state.limitedStart < 604800000;
}

function updateLimitedTimer() {
    const timer = document.getElementById("limitedTimer");

    if (!isLimitedActive()) {
        timer.textContent = "ENDED";
        return;
    }

    const remaining =
        604800000 - (Date.now() - state.limitedStart);

    timer.textContent = formatCountdown(remaining);
}

/* =========================================================
   TOURNAMENT
   ========================================================= */

function startTournament() {
    if (!state.tournamentStart) {
        state.tournamentStart = Date.now();
        saveGame();
    }
}

function updateTournamentTimer() {
    const timer = document.getElementById("tournamentTimer");

    const duration = 604800000;

    const remaining =
        duration - (Date.now() - state.tournamentStart);

    if (remaining <= 0) {
        timer.textContent = "SEASON ENDED";
        return;
    }

    timer.textContent = formatCountdown(remaining);
}

function enterTournament() {
    state.stats.tournamentEntries++;

    const score = Math.floor(
        state.level * 10 +
        state.cards.length * 2 +
        state.stats.worldClass * 100
    );

    state.stats.tournamentScore += score;

    addXP(25);

    saveGame();

    toast(`🏆 Tournament entry! +${score} score.`);
    renderTournament();
}

function renderTournament() {
    const rows = [
        ["1","Football Collector",state.stats.tournamentScore],
        ["2","Rising Striker",Math.max(850,state.stats.tournamentScore-100)],
        ["3","Card Hunter",Math.max(700,state.stats.tournamentScore-180)],
        ["4","Legend Seeker",650],
        ["5","Pitch Master",500]
    ];

    document.getElementById("tournamentLeaderboard").innerHTML =
        rows.map(r => `
            <div class="rank-row">
                <b>#${r[0]}</b>
                <strong>${escapeHTML(r[1])}</strong>
                <span>${r[2]} pts</span>
            </div>
        `).join("");
}

/* =========================================================
   GLOBAL LEADERBOARD
   ========================================================= */

function renderLeaderboard() {
    const entries = [
        {
            name:state.name || "Football Collector",
            level:state.level,
            playtime:state.stats.playtime,
            cards:state.cards.length,
            world:state.stats.worldClass
        },
        {
            name:"CardMaster",
            level:42,
            playtime:83200,
            cards:183,
            world:8
        },
        {
            name:"PitchKing",
            level:36,
            playtime:71200,
            cards:154,
            world:5
        },
        {
            name:"LegendHunter",
            level:29,
            playtime:55000,
            cards:121,
            world:3
        },
        {
            name:"FootballFan",
            level:21,
            playtime:38800,
            cards:94,
            world:1
        }
    ];

    entries.sort((a,b) => b.level-a.level);

    document.getElementById("globalLeaderboard").innerHTML =
        entries.map((e,i) => `
            <div class="rank-row">
                <b>#${i+1}</b>
                <strong>${escapeHTML(e.name)}</strong>
                <span>Lv.${e.level} · ${e.cards} cards · ${e.world} WC</span>
            </div>
        `).join("");
}

/* =========================================================
   PLAYER SEARCH
   ========================================================= */

function searchPlayer() {
    const query =
        document.getElementById("tradeSearch").value.trim().toLowerCase();

    const result = document.getElementById("tradeResult");

    if (!query) {
        result.innerHTML =
            `<div class="empty-state">Enter a player name.</div>`;
        return;
    }

    if (
        state.name &&
        state.name.toLowerCase().includes(query)
    ) {
        result.innerHTML = `
            <div class="profile-panel">
                <h2>${escapeHTML(state.name)}</h2>
                <p>Level ${state.level}</p>
                <p>${state.cards.length} cards</p>
                <p>Best rarity: ${state.stats.highestRarity}</p>
                <button class="primary-btn"
                    onclick="showPage('profile')">
                    View Profile
                </button>
            </div>
        `;
        return;
    }

    result.innerHTML = `
        <div class="empty-state">
            No local player named "${escapeHTML(query)}" was found.
            <br><br>
            Global player search requires an online backend.
        </div>
    `;
}

/* =========================================================
   TIMERS
   ========================================================= */

function updateTimers() {
    updateLimitedTimer();
    updateTournamentTimer();
    updateDailyReward();
    updateFreeKick();
}

function formatCountdown(ms) {
    if (ms <= 0) return "ENDED";

    let total = Math.floor(ms/1000);

    const days = Math.floor(total/86400);
    total %= 86400;

    const hours = Math.floor(total/3600);
    total %= 3600;

    const mins = Math.floor(total/60);
    const secs = total%60;

    return `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

function pad(num) {
    return String(num).padStart(2,"0");
}

/* =========================================================
   RESET
   ========================================================= */

function resetGame() {
    const yes = confirm(
        "Are you sure? This will permanently delete your local Football Cards progress."
    );

    if (!yes) return;

    localStorage.removeItem(SAVE_KEY);

    location.reload();
}

/* =========================================================
   UTILITIES
   ========================================================= */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

/* =========================================================
   FRAME STYLES
   ========================================================= */

const frameStyle = document.createElement("style");

frameStyle.textContent = `
.frame-default {
    border-color:rgba(255,255,255,.08)!important;
}

.frame-blue {
    border-color:#3295ff!important;
    box-shadow:0 0 12px rgba(50,149,255,.3);
}

.frame-green {
    border-color:#38db8b!important;
    box-shadow:0 0 12px rgba(56,219,139,.3);
}

.frame-purple {
    border-color:#a65cff!important;
    box-shadow:0 0 12px rgba(166,92,255,.3);
}

.frame-gold {
    border-color:#f4c44e!important;
    box-shadow:0 0 14px rgba(244,196,78,.35);
}

.frame-red {
    border-color:#ff4c63!important;
    box-shadow:0 0 14px rgba(255,76,99,.35);
}

.frame-rainbow {
    border:2px solid transparent!important;
    background:
        linear-gradient(#101722,#101722) padding-box,
        linear-gradient(90deg,#ff3d6e,#ffcc3d,#54e66e,#48baff,#a957ff,#ff3d6e) border-box!important;
    background-size:100% 100%,300% 100%!important;
    animation:rainbowFrame 3s linear infinite;
}

.frame-champion {
    border:2px solid #f5ce62!important;
    box-shadow:
        0 0 10px rgba(245,206,98,.4),
        inset 0 0 20px rgba(245,206,98,.08);
}

@keyframes rainbowFrame {
    from { background-position:0 0,0% 50%; }
    to { background-position:0 0,300% 50%; }
}
`;

document.head.appendChild(frameStyle);

/* =========================================================
   AUTOMATIC INITIAL EVENT START
   ========================================================= */

if (state.initialized) {
    startLimitedEvent();
    startTournament();
}

/* =========================================================
   FIRST RENDER
   ========================================================= */

renderAll();
