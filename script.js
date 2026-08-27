/* ==========================================
   FOOTBALL CARDS
   Core game system
========================================== */


/* ---------- PLAYER DATABASE ---------- */

const players = [
    { name: "Harry Kane", rating: 90, position: "ST", club: "Bayern Munich", rarity: "Legendary" },
    { name: "Kevin De Bruyne", rating: 91, position: "CM", club: "Manchester City", rarity: "Legendary" },
    { name: "Mohamed Salah", rating: 90, position: "RW", club: "Liverpool", rarity: "Legendary" },
    { name: "Vinícius Jr.", rating: 91, position: "LW", club: "Real Madrid", rarity: "Epic" },
    { name: "Jude Bellingham", rating: 91, position: "CM", club: "Real Madrid", rarity: "Epic" },
    { name: "Kylian Mbappé", rating: 92, position: "ST", club: "Real Madrid", rarity: "Mythic" },
    { name: "Erling Haaland", rating: 91, position: "ST", club: "Manchester City", rarity: "Epic" },
    { name: "Lamine Yamal", rating: 89, position: "RW", club: "Barcelona", rarity: "Epic" },
    { name: "Rodri", rating: 90, position: "CDM", club: "Manchester City", rarity: "Legendary" },
    { name: "Virgil van Dijk", rating: 89, position: "CB", club: "Liverpool", rarity: "Rare" },
    { name: "Bukayo Saka", rating: 88, position: "RW", club: "Arsenal", rarity: "Rare" },
    { name: "Pedri", rating: 88, position: "CM", club: "Barcelona", rarity: "Rare" },
    { name: "Phil Foden", rating: 88, position: "CAM", club: "Manchester City", rarity: "Rare" },
    { name: "Cole Palmer", rating: 87, position: "CAM", club: "Chelsea", rarity: "Rare" },
    { name: "Son Heung-min", rating: 87, position: "LW", club: "Tottenham", rarity: "Uncommon" },
    { name: "Bernardo Silva", rating: 88, position: "CM", club: "Manchester City", rarity: "Uncommon" },
    { name: "Martin Ødegaard", rating: 87, position: "CAM", club: "Arsenal", rarity: "Uncommon" },
    { name: "Alisson", rating: 89, position: "GK", club: "Liverpool", rarity: "Rare" },
    { name: "Thibaut Courtois", rating: 89, position: "GK", club: "Real Madrid", rarity: "Epic" },
    { name: "Achraf Hakimi", rating: 86, position: "RB", club: "PSG", rarity: "Uncommon" },

    /* SECRET */
    { name: "Diego Maradona", rating: 98, position: "CAM", club: "Argentina", rarity: "Secret" },
    { name: "Pelé", rating: 98, position: "ST", club: "Brazil", rarity: "Secret" },

    /* WORLD CLASS */
    { name: "Lionel Messi", rating: 99, position: "RW", club: "Argentina", rarity: "World Class" },
    { name: "Cristiano Ronaldo", rating: 99, position: "ST", club: "Portugal", rarity: "World Class" }
];


/* ---------- GAME DATA ---------- */

const defaultData = {
    coins: 100000,
    packsOpened: 0,
    coinsSpent: 0,
    cards: [],
    featured: [],
    ownedItems: [],
    bestRating: 0,
    bestPlayer: null
};

let gameData = loadGame();


function loadGame() {
    try {
        const saved = localStorage.getItem("footballCardsSave");

        if (saved) {
            return {
                ...defaultData,
                ...JSON.parse(saved)
            };
        }
    } catch (error) {
        console.log("Save could not be loaded.");
    }

    return JSON.parse(JSON.stringify(defaultData));
}


function saveGame() {
    localStorage.setItem(
        "footballCardsSave",
        JSON.stringify(gameData)
    );
}


/* ---------- NAVIGATION ---------- */

function openPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active-page");
    }

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );
    });

    updateUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
}


document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
        openPage(button.dataset.page);
    });
});


/* ---------- CURRENCY ---------- */

function updateCoins() {
    document.getElementById("coinDisplay").textContent =
        gameData.coins.toLocaleString();
}


/* ---------- RNG ---------- */

function rollRarity(packType) {

    let random = Math.random() * 100;

    let chances;

    if (packType === "mega") {

        chances = [
            ["World Class", 0.02],
            ["Secret", 0.4],
            ["Mythic", 3],
            ["Legendary", 10],
            ["Epic", 18],
            ["Rare", 25],
            ["Uncommon", 23.56],
            ["Common", 20.02]
        ];

    } else if (packType === "premium") {

        chances = [
            ["World Class", 0.01],
            ["Secret", 0.2],
            ["Mythic", 1.8],
            ["Legendary", 7],
            ["Epic", 12],
            ["Rare", 20],
            ["Uncommon", 25],
            ["Common", 34.99]
        ];

    } else {

        chances = [
            ["World Class", 0.01],
            ["Secret", 0.19],
            ["Mythic", 1.8],
            ["Legendary", 5],
            ["Epic", 8],
            ["Rare", 15],
            ["Uncommon", 25],
            ["Common", 45]
        ];
    }

    let total = 0;

    for (const [rarity, chance] of chances) {

        total += chance;

        if (random <= total) {
            return rarity;
        }
    }

    return "Common";
}


/* ---------- PLAYER SELECTION ---------- */

function getPlayer(rarity) {

    const matching = players.filter(
        player => player.rarity === rarity
    );

    if (matching.length > 0) {
        return matching[
            Math.floor(Math.random() * matching.length)
        ];
    }

    const fallback = players.filter(
        player => player.rarity === "Common"
    );

    return fallback[
        Math.floor(Math.random() * fallback.length)
    ];
}


/* ---------- PACK OPENING ---------- */

document.querySelectorAll(".pack-open").forEach(button => {

    button.addEventListener("click", () => {

        const cost = Number(button.dataset.cost);

        if (gameData.coins < cost) {
            showToast("Not enough coins!");
            return;
        }

        let packType = "starter";

        if (cost === 15000) {
            packType = "premium";
        }

        if (cost === 35000) {
            packType = "mega";
        }

        gameData.coins -= cost;
        gameData.coinsSpent += cost;
        gameData.packsOpened++;

        const rarity = rollRarity(packType);
        const player = getPlayer(rarity);

        gameData.cards.push({
            ...player,
            id: Date.now() + Math.random()
        });

        if (player.rating > gameData.bestRating) {
            gameData.bestRating = player.rating;
            gameData.bestPlayer = player.name;
        }

        saveGame();
        updateUI();
        showReveal(player);
    });
});


/* ---------- REVEAL ---------- */

function showReveal(player) {

    const overlay = document.getElementById("revealOverlay");
    const card = document.getElementById("revealCard");

    const rarityClass = player.rarity
        .toLowerCase()
        .replaceAll(" ", "-");

    overlay.className = "reveal-overlay show " + rarityClass;

    card.className =
        "reveal-card card-" +
        player.rarity.replaceAll(" ", "-");

    document.querySelector(".reveal-rarity").textContent =
        player.rarity.toUpperCase();

    document.querySelector(".reveal-rarity").className =
        "reveal-rarity rarity " + rarityClass;

    document.querySelector(".reveal-number").textContent =
        player.rating;

    document.querySelector(".reveal-player").textContent =
        getPlayerEmoji(player.position);

    document.querySelector(".reveal-info h2").textContent =
        player.name;

    document.querySelector(".reveal-position").textContent =
        player.position;

    document.querySelector(".reveal-club").textContent =
        player.club;

    document.querySelector(".reveal-rating").textContent =
        player.rating;

    const message = document.getElementById("revealMessage");

    message.textContent =
        getRevealMessage(player.rarity);

    message.style.opacity = "1";

    card.classList.remove("revealing");

    void card.offsetWidth;

    card.classList.add("revealing");

    const continueButton =
        document.getElementById("revealContinue");

    continueButton.classList.remove("visible");

    setTimeout(() => {
        continueButton.classList.add("visible");
    }, player.rarity === "World Class" ? 1800 : 1300);
}


function closeReveal() {

    const overlay = document.getElementById("revealOverlay");

    overlay.className = "reveal-overlay";

    document.getElementById("revealCard")
        .classList.remove("revealing");

    document.getElementById("revealContinue")
        .classList.remove("visible");

    updateUI();
}


function getRevealMessage(rarity) {

    switch (rarity) {

        case "Common":
            return "NOT BAD...";

        case "Uncommon":
            return "NICE PULL!";

        case "Rare":
            return "RARE PULL!";

        case "Epic":
            return "EPIC!";

        case "Legendary":
            return "LEGENDARY!";

        case "Mythic":
            return "MYTHIC PULL!";

        case "Secret":
            return "SECRET!";

        case "World Class":
            return "WORLD CLASS!";

        default:
            return "PULL!";
    }
}


function getPlayerEmoji(position) {

    if (position === "GK") return "🧤";
    if (position === "CB" || position === "RB") return "🛡️";
    if (position === "CM" || position === "CAM" || position === "CDM") return "⚽";
    return "👟";
}


/* ---------- COLLECTION ---------- */

let currentFilter = "all";


document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderCollection();
    });
});


function renderCollection() {

    const grid = document.getElementById("collectionGrid");

    let cards = [...gameData.cards];

    if (currentFilter !== "all") {
        cards = cards.filter(
            card => card.rarity === currentFilter
        );
    }

    grid.innerHTML = "";

    if (cards.length === 0) {

        grid.innerHTML = `
            <div style="
                grid-column:1/-1;
                padding:70px;
                text-align:center;
                color:#8d96a5;
            ">
                <div style="font-size:45px;">🃏</div>
                <h3 style="color:white;margin:15px 0 8px;">
                    No cards here yet
                </h3>
                <p>Open some packs to start your collection.</p>
            </div>
        `;

        return;
    }

    cards.forEach(card => {

        const element =
            document.createElement("div");

        element.innerHTML =
            createPlayerCard(card);

        const cardElement =
            element.firstElementChild;

        cardElement.addEventListener("click", () => {
            toggleFeatured(card.id);
        });

        grid.appendChild(cardElement);
    });
}


function createPlayerCard(card) {

    const rarityClass =
        card.rarity.replaceAll(" ", "-");

    return `
        <div class="player-card card-${rarityClass}">
            <div class="small-rarity ${rarityClass.toLowerCase()}">
                ${card.rarity.toUpperCase()}
            </div>

            <div class="rating">
                ${card.rating}
            </div>

            <div class="number">
                ${card.position}
            </div>

            <div class="face">
                ${getPlayerEmoji(card.position)}
            </div>

            <div class="name">
                ${card.name}
            </div>

            <div class="details">
                ${card.club}
            </div>
        </div>
    `;
}


/* ---------- PROFILE ---------- */

function toggleFeatured(id) {

    const index = gameData.featured.indexOf(id);

    if (index !== -1) {

        gameData.featured.splice(index, 1);

        showToast("Removed from featured cards.");

    } else {

        if (gameData.featured.length >= 6) {
            showToast("You can only feature 6 cards!");
            return;
        }

        gameData.featured.push(id);

        showToast("Added to your profile!");
    }

    saveGame();
    renderFeatured();
}


function renderFeatured() {

    const container =
        document.getElementById("featuredCards");

    container.innerHTML = "";

    const featuredCards =
        gameData.featured
            .map(id =>
                gameData.cards.find(card => card.id === id)
            )
            .filter(Boolean);

    if (featuredCards.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column:1/-1;
                padding:50px;
                text-align:center;
                color:#8d96a5;
            ">
                Open packs and click cards in your collection
                to feature them here.
            </div>
        `;

        return;
    }

    featuredCards.forEach(card => {

        const element =
            document.createElement("div");

        element.innerHTML =
            createPlayerCard(card);

        const cardElement =
            element.firstElementChild;

        cardElement.style.height = "250px";

        cardElement.addEventListener("click", () => {
            toggleFeatured(card.id);
        });

        container.appendChild(cardElement);
    });
}


/* ---------- SHOP ---------- */

document.querySelectorAll(".shop-buy")
    .forEach(button => {

        button.addEventListener("click", () => {

            const item = button.dataset.item;
            const price = Number(button.dataset.price);

            if (gameData.ownedItems.includes(item)) {
                showToast("You already own this!");
                return;
            }

            if (gameData.coins < price) {
                showToast("Not enough coins!");
                return;
            }

            gameData.coins -= price;
            gameData.ownedItems.push(item);

            button.textContent = "OWNED";
            button.disabled = true;

            saveGame();
            updateUI();

            showToast(item + " purchased!");
        });
    });


/* ---------- UI ---------- */

function updateUI() {

    updateCoins();

    document.getElementById("homePacks").textContent =
        gameData.packsOpened.toLocaleString();

    document.getElementById("homeCards").textContent =
        gameData.cards.length.toLocaleString();

    document.getElementById("homeBest").textContent =
        gameData.bestPlayer
            ? `${gameData.bestPlayer} (${gameData.bestRating})`
            : "None";

    document.getElementById("collectionCount").textContent =
        `${gameData.cards.length} cards collected`;

    document.getElementById("profileBest").textContent =
        gameData.bestPlayer
            ? `${gameData.bestPlayer} (${gameData.bestRating})`
            : "None";

    document.getElementById("statPacks").textContent =
        gameData.packsOpened.toLocaleString();

    document.getElementById("statSpent").textContent =
        gameData.coinsSpent.toLocaleString();

    document.getElementById("statCards").textContent =
        gameData.cards.length.toLocaleString();

    document.getElementById("statBest").textContent =
        gameData.bestPlayer
            ? `${gameData.bestPlayer} (${gameData.bestRating})`
            : "None";

    const legendaryPlus =
        gameData.cards.filter(card =>
            ["Legendary", "Mythic", "Secret", "World Class"]
                .includes(card.rarity)
        ).length;

    const rarePlus =
        gameData.cards.filter(card =>
            ["Rare", "Epic", "Legendary", "Mythic", "Secret", "World Class"]
                .includes(card.rarity)
        ).length;

    document.getElementById("statLegendary").textContent =
        legendaryPlus;

    document.getElementById("statRare").textContent =
        rarePlus;

    renderCollection();
    renderFeatured();

    document.querySelectorAll(".shop-buy")
        .forEach(button => {

            if (gameData.ownedItems.includes(button.dataset.item)) {
                button.textContent = "OWNED";
                button.disabled = true;
            }
        });
}


/* ---------- TOAST ---------- */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
}


/* ---------- START ---------- */

updateUI();
