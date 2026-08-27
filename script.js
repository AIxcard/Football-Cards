/* =========================================================
   FOOTBALL CARDS
   FULL GAME SCRIPT
   ========================================================= */


/* =========================================================
   PLAYER DATABASE
   ========================================================= */

const PLAYERS = [

    {
        id: 1,
        name: "Lionel Messi",
        position: "RW",
        club: "Inter Miami",
        nation: "🇦🇷",
        rating: 97,
        rarity: "World Class",
        worldStyle: "messi"
    },

    {
        id: 2,
        name: "Cristiano Ronaldo",
        position: "ST",
        club: "Al Nassr",
        nation: "🇵🇹",
        rating: 97,
        rarity: "World Class",
        worldStyle: "ronaldo"
    },

    {
        id: 3,
        name: "Kylian Mbappé",
        position: "ST",
        club: "Real Madrid",
        nation: "🇫🇷",
        rating: 95,
        rarity: "Secret"
    },

    {
        id: 4,
        name: "Erling Haaland",
        position: "ST",
        club: "Manchester City",
        nation: "🇳🇴",
        rating: 95,
        rarity: "Secret"
    },

    {
        id: 5,
        name: "Lamine Yamal",
        position: "RW",
        club: "Barcelona",
        nation: "🇪🇸",
        rating: 93,
        rarity: "Mythic"
    },

    {
        id: 6,
        name: "Vinícius Júnior",
        position: "LW",
        club: "Real Madrid",
        nation: "🇧🇷",
        rating: 93,
        rarity: "Mythic"
    },

    {
        id: 7,
        name: "Jude Bellingham",
        position: "CM",
        club: "Real Madrid",
        nation: "🏴",
        rating: 92,
        rarity: "Legendary"
    },

    {
        id: 8,
        name: "Rodri",
        position: "CDM",
        club: "Manchester City",
        nation: "🇪🇸",
        rating: 91,
        rarity: "Legendary"
    },

    {
        id: 9,
        name: "Mohamed Salah",
        position: "RW",
        club: "Liverpool",
        nation: "🇪🇬",
        rating: 91,
        rarity: "Legendary"
    },

    {
        id: 10,
        name: "Harry Kane",
        position: "ST",
        club: "Bayern Munich",
        nation: "🏴",
        rating: 90,
        rarity: "Legendary"
    },

    {
        id: 11,
        name: "Kevin De Bruyne",
        position: "CM",
        club: "Napoli",
        nation: "🇧🇪",
        rating: 90,
        rarity: "Epic"
    },

    {
        id: 12,
        name: "Neymar Jr",
        position: "LW",
        club: "Santos",
        nation: "🇧🇷",
        rating: 90,
        rarity: "Epic"
    },

    {
        id: 13,
        name: "Robert Lewandowski",
        position: "ST",
        club: "Barcelona",
        nation: "🇵🇱",
        rating: 90,
        rarity: "Epic"
    },

    {
        id: 14,
        name: "Bukayo Saka",
        position: "RW",
        club: "Arsenal",
        nation: "🏴",
        rating: 89,
        rarity: "Epic"
    },

    {
        id: 15,
        name: "Son Heung-min",
        position: "LW",
        club: "LAFC",
        nation: "🇰🇷",
        rating: 89,
        rarity: "Epic"
    },

    {
        id: 16,
        name: "Virgil van Dijk",
        position: "CB",
        club: "Liverpool",
        nation: "🇳🇱",
        rating: 89,
        rarity: "Rare"
    },

    {
        id: 17,
        name: "Rúben Dias",
        position: "CB",
        club: "Manchester City",
        nation: "🇵🇹",
        rating: 88,
        rarity: "Rare"
    },

    {
        id: 18,
        name: "Thibaut Courtois",
        position: "GK",
        club: "Real Madrid",
        nation: "🇧🇪",
        rating: 89,
        rarity: "Rare"
    },

    {
        id: 19,
        name: "Alisson",
        position: "GK",
        club: "Liverpool",
        nation: "🇧🇷",
        rating: 89,
        rarity: "Rare"
    },

    {
        id: 20,
        name: "Pedri",
        position: "CM",
        club: "Barcelona",
        nation: "🇪🇸",
        rating: 88,
        rarity: "Rare"
    },

    {
        id: 21,
        name: "Federico Valverde",
        position: "CM",
        club: "Real Madrid",
        nation: "🇺🇾",
        rating: 88,
        rarity: "Rare"
    },

    {
        id: 22,
        name: "Martin Ødegaard",
        position: "CM",
        club: "Arsenal",
        nation: "🇳🇴",
        rating: 87,
        rarity: "Uncommon"
    },

    {
        id: 23,
        name: "Cole Palmer",
        position: "AM",
        club: "Chelsea",
        nation: "🏴",
        rating: 87,
        rarity: "Uncommon"
    },

    {
        id: 24,
        name: "Declan Rice",
        position: "CDM",
        club: "Arsenal",
        nation: "🏴",
        rating: 87,
        rarity: "Uncommon"
    },

    {
        id: 25,
        name: "William Saliba",
        position: "CB",
        club: "Arsenal",
        nation: "🇫🇷",
        rating: 86,
        rarity: "Uncommon"
    },

    {
        id: 26,
        name: "Achraf Hakimi",
        position: "RB",
        club: "PSG",
        nation: "🇲🇦",
        rating: 86,
        rarity: "Uncommon"
    },

    {
        id: 27,
        name: "Nuno Mendes",
        position: "LB",
        club: "PSG",
        nation: "🇵🇹",
        rating: 85,
        rarity: "Common"
    },

    {
        id: 28,
        name: "Dani Carvajal",
        position: "RB",
        club: "Real Madrid",
        nation: "🇪🇸",
        rating: 85,
        rarity: "Common"
    },

    {
        id: 29,
        name: "Bernardo Silva",
        position: "AM",
        club: "Manchester City",
        nation: "🇵🇹",
        rating: 86,
        rarity: "Common"
    },

    {
        id: 30,
        name: "Ousmane Dembélé",
        position: "RW",
        club: "PSG",
        nation: "🇫🇷",
        rating: 86,
        rarity: "Common"
    },

    {
        id: 31,
        name: "Jamal Musiala",
        position: "AM",
        club: "Bayern Munich",
        nation: "🇩🇪",
        rating: 86,
        rarity: "Common"
    },

    {
        id: 32,
        name: "Florian Wirtz",
        position: "AM",
        club: "Liverpool",
        nation: "🇩🇪",
        rating: 86,
        rarity: "Common"
    }

];


/* =========================================================
   RARITIES
   ========================================================= */

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


const SELL_VALUES = {

    "Common": 2,

    "Uncommon": 3,

    "Rare": 5,

    "Epic": 8,

    "Legendary": 15,

    "Mythic": 30,

    "Secret": 75,

    "World Class": 0

};


/* =========================================================
   PACKS
   ========================================================= */

const PACKS = {

    starter: {

        name: "Starter Pack",

        cost: 10,

        odds: {

            Common: 38.95,

            Uncommon: 30,

            Rare: 20,

            Epic: 10,

            Legendary: 1,

            Mythic: 0.05,

            Secret: 0,

            "World Class": 0

        }

    },


    premium: {

        name: "Premium Pack",

        cost: 25,

        odds: {

            Common: 30.85,

            Uncommon: 30,

            Rare: 25,

            Epic: 12,

            Legendary: 2,

            Mythic: 0.15,

            Secret: 0,

            "World Class": 0

        }

    },


    mega: {

        name: "Mega Pack",

        cost: 50,

        odds: {

            Common: 20.49,

            Uncommon: 30,

            Rare: 30,

            Epic: 15,

            Legendary: 4,

            Mythic: 0.5,

            Secret: 0.01,

            "World Class": 0

        }

    },


    world: {

        name: "World Class Test",

        cost: 1,

        odds: {

            "World Class": 100

        }

    }

};


/* =========================================================
   MISSIONS
   ========================================================= */

const MISSION_TEMPLATES = [

    {
        id: "open",
        text: "Open 2 packs",
        goal: 2,
        reward: 5
    },

    {
        id: "rare",
        text: "Pull a Rare+ card",
        goal: 1,
        reward: 5
    },

    {
        id: "collect",
        text: "Collect 3 cards",
        goal: 3,
        reward: 8
    }

];


function createMissions() {

    return MISSION_TEMPLATES.map(mission => ({

        id: mission.id,

        text: mission.text,

        goal: mission.goal,

        reward: mission.reward,

        progress: 0,

        completed: false

    }));

}


/* =========================================================
   BACKGROUNDS
   ========================================================= */

const BACKGROUNDS = {

    Stellar: 0,

    Nebula: 50,

    Singularity: 100,

    Abyss: 200,

    Grid: 300

};


/* =========================================================
   SAVE
   ========================================================= */

const SAVE_KEY = "footballCardsSave_v4";


function defaultGame() {

    return {

        coins: 100,

        coinsEarned: 0,

        coinsSpent: 0,

        highestCoins: 100,

        xp: 0,

        packsOpened: 0,

        cardsSold: 0,

        dailyClaims: 0,

        missionsCompleted: 0,

        collection: [],

        ownedBackgrounds: ["Stellar"],

        currentBackground: "Stellar",

        cosmetics: [],

        dailyClaimTime: 0,

        freeKickUsed: false,

        missions: createMissions(),

        playtimeSeconds: 0,

        sessionStarted: Date.now(),

        packStats: {

            starter: 0,

            premium: 0,

            mega: 0,

            world: 0

        },

        bestPull: null,

        settings: {

            animation: "normal",

            compact: false

        }

    };

}


let game = defaultGame();


let currentPage = "home";


let currentFilter = "all";


let playtimeInterval = null;


/* =========================================================
   LOAD
   ========================================================= */

function loadGame() {

    try {

        const saved =
            JSON.parse(localStorage.getItem(SAVE_KEY));


        if (!saved) {

            game = defaultGame();

            return;

        }


        const fresh = defaultGame();


        game = {

            ...fresh,

            ...saved,

            settings: {

                ...fresh.settings,

                ...(saved.settings || {})

            },

            packStats: {

                ...fresh.packStats,

                ...(saved.packStats || {})

            },

            missions:
                Array.isArray(saved.missions)
                    ? saved.missions
                    : createMissions(),

            collection:
                Array.isArray(saved.collection)
                    ? saved.collection
                    : [],

            ownedBackgrounds:
                Array.isArray(saved.ownedBackgrounds)
                    ? saved.ownedBackgrounds
                    : ["Stellar"],

            cosmetics:
                Array.isArray(saved.cosmetics)
                    ? saved.cosmetics
                    : []

        };


        if (!game.ownedBackgrounds.includes("Stellar")) {

            game.ownedBackgrounds.unshift("Stellar");

        }


    } catch (error) {

        console.error("Save loading error:", error);

        game = defaultGame();

    }

}


function saveGame() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
    );

}


/* =========================================================
   PLAYTIME
   ========================================================= */

function startPlaytime() {

    if (playtimeInterval) {

        clearInterval(playtimeInterval);

    }


    game.sessionStarted = Date.now();


    playtimeInterval = setInterval(() => {

        game.playtimeSeconds++;

        if (game.playtimeSeconds % 10 === 0) {

            saveGame();

        }

        renderPlaytimeOnly();

    }, 1000);

}


function formatPlaytime(seconds) {

    seconds = Math.max(0, Math.floor(seconds));


    const hours =
        Math.floor(seconds / 3600);


    const minutes =
        Math.floor((seconds % 3600) / 60);


    if (hours > 0) {

        return `${hours}h ${minutes}m`;

    }


    if (minutes > 0) {

        return `${minutes}m`;

    }


    return `${seconds}s`;

}


function renderPlaytimeOnly() {

    const ids = [

        "homePlaytime",

        "profilePlaytime",

        "statPlaytime"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                formatPlaytime(game.playtimeSeconds);

        }

    });

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function navigate(page) {

    currentPage = page;


    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove("active");

        });


    const target =
        document.getElementById(`page-${page}`);


    if (!target) {

        return;

    }


    target.classList.add("active");


    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    renderAll();

}


/* =========================================================
   COINS
   ========================================================= */

function addCoins(amount) {

    amount = Number(amount) || 0;


    game.coins += amount;


    if (amount > 0) {

        game.coinsEarned += amount;

    }


    if (game.coins > game.highestCoins) {

        game.highestCoins = game.coins;

    }

}


function spendCoins(amount) {

    amount = Number(amount) || 0;


    if (game.coins < amount) {

        toast("Not enough coins.");

        return false;

    }


    game.coins -= amount;

    game.coinsSpent += amount;


    return true;

}


/* =========================================================
   DAILY CLAIM
   ========================================================= */

function claimDaily() {

    const now = Date.now();


    if (
        game.dailyClaimTime &&
        now - game.dailyClaimTime < 86400000
    ) {

        toast("Your daily reward is already claimed.");

        return;

    }


    addCoins(15);


    game.dailyClaimTime = now;

    game.dailyClaims++;


    resetDailyMissions();


    saveGame();

    toast("+15 coins!");

    renderAll();

}


/* =========================================================
   FREE KICK
   ========================================================= */

function claimFreeKick() {

    if (game.coins !== 0) {

        toast("Free Kick is only available at 0 coins.");

        return;

    }


    if (game.freeKickUsed) {

        toast("Free Kick has already been used today.");

        return;

    }


    addCoins(5);


    game.freeKickUsed = true;


    saveGame();

    toast("Free Kick! +5 coins.");

    renderAll();

}


/* =========================================================
   DAILY RESET
   ========================================================= */

function checkDailyReset() {

    if (!game.dailyClaimTime) {

        return;

    }


    if (
        Date.now() -
        game.dailyClaimTime >=
        86400000
    ) {

        game.dailyClaimTime = 0;

        game.freeKickUsed = false;

        resetDailyMissions();

        saveGame();

    }

}


function resetDailyMissions() {

    game.missions = createMissions();

}


/* =========================================================
   RARITY ROLL
   ========================================================= */

function rollRarity(odds) {

    const roll =
        Math.random() * 100;


    let cumulative = 0;


    for (const rarity of RARITIES) {

        const chance =
            Number(odds[rarity]) || 0;


        cumulative += chance;


        if (roll < cumulative) {

            return rarity;

        }

    }


    return "Common";

}


/* =========================================================
   PLAYER SELECTION
   ========================================================= */

function getPlayerForRarity(rarity) {

    const candidates =
        PLAYERS.filter(
            player =>
                player.rarity === rarity
        );


    if (candidates.length === 0) {

        return PLAYERS[
            Math.floor(
                Math.random() *
                PLAYERS.length
            )
        ];

    }


    return candidates[
        Math.floor(
            Math.random() *
            candidates.length
        )
    ];

}


/* =========================================================
   PACK OPENING
   ========================================================= */

function openPack(packType) {

    const pack =
        PACKS[packType];


    if (!pack) {

        return;

    }


    if (!spendCoins(pack.cost)) {

        return;

    }


    const rarity =
        rollRarity(pack.odds);


    const player =
        getPlayerForRarity(rarity);


    game.collection.push(player.id);


    game.packsOpened++;


    if (game.packStats[packType] !== undefined) {

        game.packStats[packType]++;

    }


    game.xp += 5;


    if (
        !game.bestPull ||
        rarityRank(player.rarity) >
        rarityRank(game.bestPull.rarity)
    ) {

        game.bestPull = {

            id: player.id,

            rarity: player.rarity

        };

    }


    updateMission("open", 1);


    if (rarityRank(player.rarity) >= rarityRank("Rare")) {

        updateMission("rare", 1);

    }


    updateMission("collect", 1);


    saveGame();


    showPackReveal(player);

    renderAll();

}


/* =========================================================
   RARITY RANK
   ========================================================= */

function rarityRank(rarity) {

    return RARITIES.indexOf(rarity);

}


/* =========================================================
   PACK MODAL
   ========================================================= */

function showPackReveal(player) {

    const modal =
        document.getElementById("packModal");


    const opening =
        document.getElementById("packOpening");


    const reveal =
        document.getElementById("cardReveal");


    modal.classList.add("show");


    opening.classList.remove("hidden");

    reveal.classList.add("hidden");


    const delay =
        game.settings.animation === "fast"
            ? 450
            : 1800;


    setTimeout(() => {

        opening.classList.add("hidden");

        reveal.classList.remove("hidden");


        reveal.innerHTML = `

            <div class="eyebrow">
                NEW CARD
            </div>

            ${createCardHTML(player, false)}

            <h2>${escapeHTML(player.name)}</h2>

            <p style="color:#7f8ca0">
                ${escapeHTML(player.rarity)}
                · ${player.rating} OVR
            </p>

            <button
                class="primary-button"
                onclick="closePackModal()"
            >
                CONTINUE
            </button>

        `;

    }, delay);

}


function closePackModal() {

    const modal =
        document.getElementById("packModal");


    modal.classList.remove("show");

}


/* =========================================================
   CARD HTML
   ========================================================= */

function createCardHTML(player, includeSell = true) {

    let rarityClass =
        player.rarity
            .toLowerCase()
            .replaceAll(" ", "-");


    let worldClass = "";


    if (player.rarity === "World Class") {

        if (player.worldStyle === "messi") {

            worldClass = " world-messi";

        }

        if (player.worldStyle === "ronaldo") {

            worldClass = " world-ronaldo";

        }

    }


    const counts =
        getCollectionCounts();


    const owned =
        counts[player.id] || 0;


    const sellValue =
        SELL_VALUES[player.rarity];


    const sellHTML =
        includeSell
            ? `

                <div class="sell-box">

                    <span class="owned-count">
                        Owned ×${owned}
                    </span>

                    ${
                        sellValue > 0
                            ? `
                                <button
                                    class="sell-button"
                                    onclick="sellCard(${player.id})"
                                >
                                    SELL · +${sellValue}
                                </button>
                              `
                            : `
                                <span class="owned-count">
                                    CANNOT SELL
                                </span>
                              `
                    }

                </div>

              `
            : "";


    return `

        <div class="card-wrapper">

            <div class="football-card rarity-${rarityClass}${worldClass}">

                <div class="card-rarity">
                    ${escapeHTML(player.rarity.toUpperCase())}
                </div>

                <div class="card-rating">
                    ${player.rating}
                </div>

                <div class="card-position">
                    ${escapeHTML(player.position)}
                </div>

                <div class="card-flag">
                    ${player.nation}
                </div>

                <div class="card-player">
                    ${escapeHTML(player.name)}
                </div>

                <div class="card-club">
                    ${escapeHTML(player.club)}
                </div>

                <div class="card-rarity-name">
                    ${escapeHTML(player.rarity.toUpperCase())}
                </div>

            </div>

            ${sellHTML}

        </div>

    `;

}


/* =========================================================
   COLLECTION
   ========================================================= */

function getCollectionCounts() {

    const counts = {};


    game.collection.forEach(id => {

        counts[id] =
            (counts[id] || 0) + 1;

    });


    return counts;

}


function setCardFilter(filter, button) {

    currentFilter = filter;


    document
        .querySelectorAll(".filter")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    renderCards();

}


function renderCards() {

    const grid =
        document.getElementById("cardGrid");


    if (!grid) {

        return;

    }


    const counts =
        getCollectionCounts();


    let ids =
        Object.keys(counts)
            .map(Number);


    if (currentFilter !== "all") {

        ids = ids.filter(id => {

            const player =
                PLAYERS.find(
                    item => item.id === id
                );


            return player &&
                player.rarity === currentFilter;

        });

    }


    ids.sort((a, b) => {

        const playerA =
            PLAYERS.find(p => p.id === a);

        const playerB =
            PLAYERS.find(p => p.id === b);


        return (
            rarityRank(playerB.rarity) -
            rarityRank(playerA.rarity)
        ) ||
        playerB.rating -
        playerA.rating;

    });


    if (ids.length === 0) {

        grid.innerHTML = `

            <div style="
                grid-column:1/-1;
                padding:70px 15px;
                text-align:center;
                color:#758297;
            ">

                <div style="font-size:45px;margin-bottom:10px;">
                    🃏
                </div>

                ${
                    currentFilter === "all"
                        ? "Your collection is empty."
                        : `You don't have any ${escapeHTML(currentFilter)} cards yet.`
                }

                <br><br>

                <button
                    class="primary-button"
                    onclick="navigate('packs')"
                >
                    OPEN A PACK
                </button>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        ids.map(id => {

            const player =
                PLAYERS.find(
                    p => p.id === id
                );


            return createCardHTML(player, true);

        }).join("");

}


/* =========================================================
   SELL CARDS
   ========================================================= */

function sellCard(playerId) {

    const index =
        game.collection.indexOf(playerId);


    if (index === -1) {

        toast("You don't own this card.");

        return;

    }


    const player =
        PLAYERS.find(
            p => p.id === playerId
        );


    if (!player) {

        return;

    }


    const value =
        SELL_VALUES[player.rarity];


    if (!value) {

        toast("World Class cards cannot be sold.");

        return;

    }


    game.collection.splice(index, 1);


    addCoins(value);


    game.cardsSold++;


    saveGame();


    toast(
        `${player.name} sold for +${value} coins.`
    );


    renderAll();

}


/* =========================================================
   MISSIONS
   ========================================================= */

function updateMission(id, amount) {

    const mission =
        game.missions.find(
            item => item.id === id
        );


    if (!mission || mission.completed) {

        return;

    }


    mission.progress =
        Math.min(
            mission.goal,
            mission.progress + amount
        );


    if (
        mission.progress >=
        mission.goal
    ) {

        mission.completed = true;

        game.missionsCompleted++;

        addCoins(mission.reward);


        setTimeout(() => {

            toast(
                `Mission complete! +${mission.reward} coins`
            );

        }, 50);

    }

}


function renderMissions() {

    const list =
        document.getElementById("missionList");


    if (!list) {

        return;

    }


    let completed = 0;


    list.innerHTML =
        game.missions.map(mission => {

            if (mission.completed) {

                completed++;

            }


            const percentage =
                Math.min(
                    100,
                    (mission.progress /
                    mission.goal) *
                    100
                );


            return `

                <div class="mission">

                    <div style="font-size:20px;">
                        ${mission.completed ? "✅" : "🎯"}
                    </div>

                    <div class="mission-info">

                        <strong>
                            ${escapeHTML(mission.text)}
                        </strong>

                        <div class="mission-progress">

                            <div style="
                                width:${percentage}%;
                            "></div>

                        </div>

                        <div class="mission-count">
                            ${mission.progress}/${mission.goal}
                        </div>

                    </div>

                    <strong>
                        +${mission.reward}
                    </strong>

                </div>

            `;

        }).join("");


    const counter =
        document.getElementById(
            "missionProgressText"
        );


    if (counter) {

        counter.textContent =
            `${completed} / 3`;

    }

}


/* =========================================================
   LEVEL
   ========================================================= */

function getLevel() {

    return Math.min(
        100,
        1 + Math.floor(game.xp / 50)
    );

}


function getLevelXP() {

    return game.xp % 50;

}


/* =========================================================
   SHOP BACKGROUNDS
   ========================================================= */

function buyBackground(name, cost) {

    if (game.ownedBackgrounds.includes(name)) {

        setBackground(name);

        return;

    }


    if (!spendCoins(cost)) {

        return;

    }


    game.ownedBackgrounds.push(name);


    setBackground(name);


    saveGame();


    toast(`${name} background unlocked!`);

}


function setBackground(name) {

    if (!game.ownedBackgrounds.includes(name)) {

        toast("You haven't unlocked this background.");

        return;

    }


    game.currentBackground = name;


    applyBackground(name);


    saveGame();

    renderAll();

}


function applyBackground(name) {

    const body =
        document.body;


    body.dataset.background =
        name.toLowerCase();


    const preview =
        document.getElementById(
            "shopBackgroundPreview"
        );


    if (!preview) {

        return;

    }


    const backgroundClasses = {

        Stellar: "stellar-bg",

        Nebula: "nebula-bg",

        Singularity: "singularity-bg",

        Abyss: "abyss-bg",

        Grid: "grid-bg"

    };


    preview.className =
        `shop-background-preview ${
            backgroundClasses[name] || "stellar-bg"
        }`;

}


function renderBackgrounds() {

    const container =
        document.getElementById(
            "profileBackgroundChoices"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        Object.keys(BACKGROUNDS)
            .map(name => {

                const owned =
                    game.ownedBackgrounds.includes(name);


                const selected =
                    game.currentBackground === name;


                return `

                    <button
                        class="
                            profile-bg-choice
                            ${selected ? "selected" : ""}
                        "
                        ${
                            owned
                                ? `onclick="setBackground('${name}')"`
                                : `onclick="navigate('shop')"`
                        }
                    >

                        <strong>
                            ${escapeHTML(name)}
                        </strong>

                        <small>
                            ${
                                selected
                                    ? "Currently equipped"
                                    : owned
                                        ? "Owned"
                                        : `${BACKGROUNDS[name]} 🪙`
                            }
                        </small>

                    </button>

                `;

            }).join("");

}


/* =========================================================
   COSMETICS
   ========================================================= */

function buyCosmetic(name, cost) {

    if (game.cosmetics.includes(name)) {

        toast("You already own this cosmetic.");

        return;

    }


    if (!spendCoins(cost)) {

        return;

    }


    game.cosmetics.push(name);


    saveGame();


    toast(`${name} purchased!`);

    renderAll();

}


/* =========================================================
   PROFILE RARITY STATS
   ========================================================= */

function getRarityCounts() {

    const result = {};


    RARITIES.forEach(rarity => {

        result[rarity] = 0;

    });


    game.collection.forEach(id => {

        const player =
            PLAYERS.find(
                p => p.id === id
            );


        if (player) {

            result[player.rarity]++;

        }

    });


    return result;

}


function renderProfileRarities() {

    const container =
        document.getElementById(
            "profileRarityStats"
        );


    if (!container) {

        return;

    }


    const counts =
        getRarityCounts();


    const max =
        Math.max(
            1,
            ...Object.values(counts)
        );


    container.innerHTML =
        RARITIES.map(rarity => {

            const amount =
                counts[rarity];


            const width =
                amount / max * 100;


            return `

                <div class="rarity-stat-row">

                    <span>
                        ${escapeHTML(rarity)}
                    </span>

                    <div class="rarity-stat-bar">

                        <div style="
                            width:${width}%;
                        "></div>

                    </div>

                    <span>
                        ${amount}
                    </span>

                </div>

            `;

        }).join("");

}


/* =========================================================
   DETAILED STATISTICS
   ========================================================= */

function renderStatistics() {

    const counts =
        getRarityCounts();


    const uniqueCards =
        new Set(game.collection).size;


    const duplicates =
        Math.max(
            0,
            game.collection.length -
            uniqueCards
        );


    setText(
        "statPlaytime",
        formatPlaytime(game.playtimeSeconds)
    );


    setText(
        "statLevel",
        getLevel()
    );


    setText(
        "statXP",
        game.xp
    );


    setText(
        "statCoinsEarned",
        game.coinsEarned
    );


    setText(
        "statCoinsSpent",
        game.coinsSpent
    );


    setText(
        "statHighestCoins",
        game.highestCoins
    );


    setText(
        "statPacks",
        game.packsOpened
    );


    setText(
        "statStarter",
        game.packStats.starter
    );


    setText(
        "statPremium",
        game.packStats.premium
    );


    setText(
        "statMega",
        game.packStats.mega
    );


    setText(
        "statWorld",
        game.packStats.world
    );


    let bestPullText = "None";


    if (game.bestPull) {

        const player =
            PLAYERS.find(
                p => p.id === game.bestPull.id
            );


        if (player) {

            bestPullText =
                `${player.name} · ${player.rarity}`;

        }

    }


    setText(
        "statBestPull",
        bestPullText
    );


    setText(
        "statCardsOwned",
        game.collection.length
    );


    setText(
        "statUniqueCards",
        uniqueCards
    );


    setText(
        "statDuplicates",
        duplicates
    );


    setText(
        "statCardsSold",
        game.cardsSold
    );


    setText(
        "statDailyClaims",
        game.dailyClaims
    );


    setText(
        "statMissions",
        game.missionsCompleted
    );


    const detailed =
        document.getElementById(
            "detailedRarityStats"
        );


    if (!detailed) {

        return;

    }


    detailed.innerHTML =
        RARITIES.map(rarity => {

            const amount =
                counts[rarity];


            const uniqueAvailable =
                PLAYERS.filter(
                    p => p.rarity === rarity
                ).length;


            const percentage =
                uniqueAvailable
                    ? Math.min(
                        100,
                        amount /
                        uniqueAvailable *
                        100
                    )
                    : 0;


            return `

                <div class="detailed-rarity-row">

                    <strong>
                        ${escapeHTML(rarity)}
                    </strong>

                    <div class="bar">

                        <div style="
                            width:${percentage}%;
                        "></div>

                    </div>

                    <span>
                        ${amount}/${uniqueAvailable}
                    </span>

                </div>

            `;

        }).join("");

}


/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile() {

    const level =
        getLevel();


    const xp =
        getLevelXP();


    const xpPercentage =
        Math.min(
            100,
            xp / 50 * 100
        );


    setText(
        "profileLevel",
        level
    );


    setText(
        "profileXP",
        `${xp} / 50 XP`
    );


    setText(
        "profilePlaytime",
        formatPlaytime(
            game.playtimeSeconds
        )
    );


    setText(
        "profileCards",
        game.collection.length
    );


    setText(
        "profilePacks",
        game.packsOpened
    );


    setText(
        "profileCoinsEarned",
        game.coinsEarned
    );


    const xpBar =
        document.getElementById(
            "profileXPBar"
        );


    if (xpBar) {

        xpBar.style.width =
            `${xpPercentage}%`;

    }


    renderBackgrounds();

    renderProfileRarities();

}


/* =========================================================
   SETTINGS
   ========================================================= */

function changeAnimation(value) {

    if (
        value !== "normal" &&
        value !== "fast"
    ) {

        return;

    }


    game.settings.animation =
        value;


    saveGame();

}


function toggleCompact(enabled) {

    game.settings.compact =
        Boolean(enabled);


    document.body.classList.toggle(
        "compact",
        game.settings.compact
    );


    saveGame();

}


function renderSettings() {

    const animation =
        document.getElementById(
            "animationSetting"
        );


    const compact =
        document.getElementById(
            "compactSetting"
        );


    if (animation) {

        animation.value =
            game.settings.animation;

    }


    if (compact) {

        compact.checked =
            game.settings.compact;

    }


    document.body.classList.toggle(
        "compact",
        game.settings.compact
    );

}


/* =========================================================
   DEVELOPER TEST BUTTON
   ========================================================= */

function developerAddCoins() {

    addCoins(1000);


    saveGame();


    toast("+1,000 coins added for testing.");


    renderAll();

}


/* =========================================================
   DAILY TIMER
   ========================================================= */

function renderDailyTimer() {

    const timer =
        document.getElementById(
            "dailyCountdown"
        );


    const button =
        document.getElementById(
            "dailyClaimButton"
        );


    if (!timer || !button) {

        return;

    }


    if (!game.dailyClaimTime) {

        timer.textContent = "READY";

        button.disabled = false;

        button.textContent = "CLAIM";

        return;

    }


    const remaining =
        86400000 -
        (Date.now() -
        game.dailyClaimTime);


    if (remaining <= 0) {

        game.dailyClaimTime = 0;

        game.freeKickUsed = false;

        resetDailyMissions();

        saveGame();

        timer.textContent = "READY";

        button.disabled = false;

        button.textContent = "CLAIM";

        return;

    }


    const hours =
        Math.floor(
            remaining / 3600000
        );


    const minutes =
        Math.floor(
            (remaining % 3600000) /
            60000
        );


    const seconds =
        Math.floor(
            (remaining % 60000) /
            1000
        );


    timer.textContent =
        `${hours}h ${minutes}m ${seconds}s`;


    button.disabled = true;

    button.textContent = "CLAIMED";

}


/* =========================================================
   MAIN RENDER
   ========================================================= */

function renderAll() {

    checkDailyReset();


    setText(
        "coinDisplay",
        game.coins
    );


    setText(
        "packCoinDisplay",
        game.coins
    );


    setText(
        "shopCoinDisplay",
        game.coins
    );


    const uniqueCards =
        new Set(game.collection).size;


    setText(
        "homeCollected",
        `${uniqueCards}/${PLAYERS.length}`
    );


    setText(
        "homePacks",
        game.packsOpened
    );


    setText(
        "homeLevel",
        getLevel()
    );


    setText(
        "collectionCount",
        uniqueCards
    );


    renderPlaytimeOnly();


    renderMissions();


    renderCards();


    renderProfile();


    renderStatistics();


    renderSettings();


    renderDailyTimer();


    const freeKick =
        document.getElementById(
            "freeKickReward"
        );


    if (freeKick) {

        freeKick.style.display =
            game.coins === 0 &&
            !game.freeKickUsed
                ? "flex"
                : "none";

    }


    const backgroundName =
        document.getElementById(
            "currentBackgroundName"
        );


    if (backgroundName) {

        backgroundName.textContent =
            game.currentBackground;

    }


    applyBackground(
        game.currentBackground
    );

}


/* =========================================================
   HELPERS
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function toast(message) {

    const element =
        document.getElementById("toast");


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            element.classList.remove("show");

        }, 2000);

}


/* =========================================================
   RESET
   ========================================================= */

function resetGame() {

    const confirmed =
        confirm(
            "Are you sure you want to delete ALL Football Cards progress?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        SAVE_KEY
    );


    game =
        defaultGame();


    saveGame();


    navigate("home");


    toast("Game progress reset.");

}


/* =========================================================
   START
   ========================================================= */

loadGame();

applyBackground(
    game.currentBackground
);

renderAll();

startPlaytime();


setInterval(() => {

    renderDailyTimer();

}, 1000);


/* =========================================================
   PREVENT MODAL CLICK ISSUES
   ========================================================= */

document
    .getElementById("packModal")
    ?.addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "packModal"
            ) {

                closePackModal();

            }

        }
    );
