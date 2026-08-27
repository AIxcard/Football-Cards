/* =========================================================
   FOOTBALL ULTIMATE
   Complete game script
========================================================= */

const players = [

    // COMMON
    {name:"Harry Maguire",club:"England",position:"CB",rating:78,rarity:"Common"},
    {name:"Jordan Pickford",club:"England",position:"GK",rating:79,rarity:"Common"},
    {name:"Olivier Giroud",club:"France",position:"ST",rating:79,rarity:"Common"},
    {name:"Mats Hummels",club:"Germany",position:"CB",rating:79,rarity:"Common"},
    {name:"Thiago Silva",club:"Brazil",position:"CB",rating:80,rarity:"Common"},
    {name:"Edinson Cavani",club:"Uruguay",position:"ST",rating:80,rarity:"Common"},
    {name:"Angel Di Maria",club:"Argentina",position:"RW",rating:81,rarity:"Common"},
    {name:"Marco Reus",club:"Germany",position:"CAM",rating:81,rarity:"Common"},

    // UNCOMMON
    {name:"Marcus Rashford",club:"England",position:"LW",rating:82,rarity:"Uncommon"},
    {name:"Bruno Fernandes",club:"Portugal",position:"CAM",rating:88,rarity:"Uncommon"},
    {name:"Bernardo Silva",club:"Portugal",position:"CAM",rating:88,rarity:"Uncommon"},
    {name:"Rodri",club:"Spain",position:"CDM",rating:89,rarity:"Uncommon"},
    {name:"Antoine Griezmann",club:"France",position:"ST",rating:89,rarity:"Uncommon"},
    {name:"Lautaro Martinez",club:"Argentina",position:"ST",rating:88,rarity:"Uncommon"},
    {name:"Alisson",club:"Brazil",position:"GK",rating:89,rarity:"Uncommon"},
    {name:"Thibaut Courtois",club:"Belgium",position:"GK",rating:90,rarity:"Uncommon"},

    // RARE
    {name:"Vinicius Jr",club:"Brazil",position:"LW",rating:91,rarity:"Rare"},
    {name:"Jude Bellingham",club:"England",position:"CAM",rating:91,rarity:"Rare"},
    {name:"Kevin De Bruyne",club:"Belgium",position:"CAM",rating:91,rarity:"Rare"},
    {name:"Mohamed Salah",club:"Egypt",position:"RW",rating:90,rarity:"Rare"},
    {name:"Harry Kane",club:"England",position:"ST",rating:90,rarity:"Rare"},
    {name:"Erling Haaland",club:"Norway",position:"ST",rating:91,rarity:"Rare"},
    {name:"Robert Lewandowski",club:"Poland",position:"ST",rating:90,rarity:"Rare"},
    {name:"Ruben Dias",club:"Portugal",position:"CB",rating:89,rarity:"Rare"},

    // EPIC
    {name:"Kylian Mbappe",club:"France",position:"ST",rating:94,rarity:"Epic"},
    {name:"Luka Modric",club:"Croatia",position:"CM",rating:93,rarity:"Epic"},
    {name:"Toni Kroos",club:"Germany",position:"CM",rating:93,rarity:"Epic"},
    {name:"Neymar Jr",club:"Brazil",position:"LW",rating:94,rarity:"Epic"},
    {name:"Sergio Ramos",club:"Spain",position:"CB",rating:93,rarity:"Epic"},
    {name:"Manuel Neuer",club:"Germany",position:"GK",rating:93,rarity:"Epic"},
    {name:"Karim Benzema",club:"France",position:"ST",rating:93,rarity:"Epic"},
    {name:"Luis Suarez",club:"Uruguay",position:"ST",rating:93,rarity:"Epic"},

    // LEGENDARY
    {name:"Cristiano Ronaldo",club:"Portugal",position:"ST",rating:96,rarity:"Legendary"},
    {name:"Lionel Messi",club:"Argentina",position:"RW",rating:97,rarity:"Legendary"},
    {name:"Zinedine Zidane",club:"France",position:"CAM",rating:96,rarity:"Legendary"},
    {name:"Ronaldinho",club:"Brazil",position:"LW",rating:95,rarity:"Legendary"},
    {name:"Ronaldo Nazario",club:"Brazil",position:"ST",rating:97,rarity:"Legendary"},
    {name:"Andres Iniesta",club:"Spain",position:"CM",rating:95,rarity:"Legendary"},

    // MYTHIC
    {name:"Diego Maradona",club:"Argentina",position:"CAM",rating:98,rarity:"Mythic"},
    {name:"Pele",club:"Brazil",position:"ST",rating:99,rarity:"Mythic"},
    {name:"Johan Cruyff",club:"Netherlands",position:"CF",rating:98,rarity:"Mythic"},
    {name:"Franz Beckenbauer",club:"Germany",position:"CB",rating:98,rarity:"Mythic"},

    // SECRET
    {name:"Lev Yashin",club:"Soviet Union",position:"GK",rating:99,rarity:"Secret"},
    {name:"Paolo Maldini",club:"Italy",position:"CB",rating:98,rarity:"Secret"},
    {name:"Ronaldinho Prime",club:"Brazil",position:"LW",rating:99,rarity:"Secret"},

    // WORLD CLASS
    {name:"Cristiano Ronaldo World Class",club:"Portugal",position:"ST",rating:100,rarity:"World Class"},
    {name:"Lionel Messi World Class",club:"Argentina",position:"RW",rating:100,rarity:"World Class"},
    {name:"Pele World Class",club:"Brazil",position:"ST",rating:100,rarity:"World Class"}
];


/* =========================================================
   PACKS
========================================================= */

const packs = [

    {
        id:"starter",
        name:"Starter Pack",
        className:"starter",
        icon:"⚽",
        price:50,
        cards:5,
        description:"A basic pack for new managers.",
        rate:"Beginner friendly"
    },

    {
        id:"premium",
        name:"Premium Pack",
        className:"premium",
        icon:"🥇",
        price:150,
        cards:5,
        description:"Better players with Common rarity removed.",
        rate:"Rare+ guaranteed"
    },

    {
        id:"champion",
        name:"Champion Pack",
        className:"champion",
        icon:"🏆",
        price:300,
        cards:5,
        description:"Only Rare and above. World Class can appear.",
        rate:"High rarity"
    },

    {
        id:"worldclass",
        name:"World Class Pack",
        className:"worldclass",
        icon:"🌟",
        price:500,
        cards:3,
        description:"Your best chance at elite footballers.",
        rate:"World Class possible"
    },

    {
        id:"limited",
        name:"Limited Time Pack",
        className:"limited",
        icon:"🔥",
        price:400,
        cards:5,
        description:"A special limited pack with boosted legendary odds.",
        rate:"Limited availability"
    }

];


/* =========================================================
   PACK ODDS
========================================================= */

const odds = {

    starter:{
        Common:55,
        Uncommon:25,
        Rare:12,
        Epic:5,
        Legendary:2.5,
        Mythic:.4,
        Secret:.09,
        "World Class":.01
    },

    premium:{
        Uncommon:42,
        Rare:30,
        Epic:16,
        Legendary:8,
        Mythic:3,
        Secret:.8,
        "World Class":.2
    },

    champion:{
        Rare:43,
        Epic:30,
        Legendary:17,
        Mythic:7,
        Secret:2.5,
        "World Class":.5
    },

    worldclass:{
        Legendary:52,
        Mythic:25,
        Secret:15,
        "World Class":8
    },

    limited:{
        Rare:25,
        Epic:30,
        Legendary:27,
        Mythic:12,
        Secret:5,
        "World Class":1
    }

};


/* =========================================================
   GAME STATE
========================================================= */

let game = JSON.parse(localStorage.getItem("footballUltimateSave")) || {

    name:"",
    coins:100,
    xp:0,
    level:1,

    collection:[],
    packsOpened:0,

    dailyClaimed:"",
    freeKickToday:"",

    luckBoost:false,

    missions:{
        open:0,
        collect:0,
        legendary:0
    }

};


/* =========================================================
   SAVE
========================================================= */

function saveGame(){

    localStorage.setItem(
        "footballUltimateSave",
        JSON.stringify(game)
    );

}


/* =========================================================
   UTILITIES
========================================================= */

function toast(message){

    const el = document.getElementById("toast");

    el.textContent = message;
    el.classList.add("show");

    setTimeout(()=>{
        el.classList.remove("show");
    },2200);

}


function rarityClass(rarity){

    return rarity
        .toLowerCase()
        .replace(" ","");
}


function addXP(amount){

    game.xp += amount;

    while(game.xp >= game.level * 100){

        game.xp -= game.level * 100;
        game.level++;

        toast(`⭐ Level Up! You are now Level ${game.level}!`);
    }

    saveGame();
    updateUI();

}


/* =========================================================
   NAVIGATION
========================================================= */

function showPage(page){

    document.querySelectorAll(".page").forEach(p=>{
        p.classList.remove("active-page");
    });

    const target = document.getElementById("page-" + page);

    if(target){
        target.classList.add("active-page");
    }

    document.querySelectorAll(".nav").forEach(btn=>{
        btn.classList.toggle(
            "active",
            btn.dataset.page === page
        );
    });

    if(page === "collection"){
        renderCollection();
    }

    if(page === "profile"){
        renderProfile();
    }

    if(page === "statistics"){
        renderStatistics();
    }

    if(page === "missions"){
        renderMissions();
    }

    document.getElementById("sidebar").classList.remove("open");
}


document.querySelectorAll(".nav").forEach(button=>{

    button.addEventListener("click",()=>{

        showPage(button.dataset.page);

    });

});


document.querySelectorAll("[data-page]").forEach(button=>{

    if(!button.classList.contains("nav")){

        button.addEventListener("click",()=>{
            showPage(button.dataset.page);
        });

    }

});


/* =========================================================
   RENDER PACK
========================================================= */

function packHTML(pack){

    return `

        <div class="pack ${pack.className}">

            <div class="pack-ball">${pack.icon}</div>

            <p class="rarity">${pack.name.toUpperCase()}</p>

            <h2>${pack.name}</h2>

            <p>${pack.description}</p>

            <div class="pack-rate">
                ${pack.cards} cards • ${pack.rate}
            </div>

            <button onclick="openPack('${pack.id}')">
                OPEN • ${pack.price} 🪙
            </button>

        </div>

    `;

}


function renderPacks(){

    const html = packs.map(packHTML).join("");

    document.getElementById("packsGrid").innerHTML = html;

    document.getElementById("homePacks").innerHTML =
        packs.slice(0,4).map(packHTML).join("");

}


/* =========================================================
   RARITY ROLL
========================================================= */

function rollRarity(packId){

    const packOdds = odds[packId];

    let entries = Object.entries(packOdds);

    let total = entries.reduce(
        (sum,[,chance])=>sum + chance,
        0
    );

    let roll = Math.random() * total;

    for(const [rarity,chance] of entries){

        roll -= chance;

        if(roll <= 0){
            return rarity;
        }

    }

    return entries[entries.length-1][0];

}


/* =========================================================
   PLAYER ROLL
========================================================= */

function getPlayer(packId){

    let rarity = rollRarity(packId);

    let available = players.filter(
        p => p.rarity === rarity
    );

    if(!available.length){

        available = players.filter(
            p => p.rarity !== "Common"
        );

    }

    if(game.luckBoost){

        if(Math.random() < .35){

            const better = players.filter(
                p =>
                    ["Legendary","Mythic","Secret","World Class"]
                    .includes(p.rarity)
            );

            if(better.length){

                available = better;

            }

        }

        game.luckBoost = false;
    }

    return available[
        Math.floor(Math.random() * available.length)
    ];

}


/* =========================================================
   OPEN PACK
========================================================= */

function openPack(packId){

    const pack = packs.find(p=>p.id === packId);

    if(!pack) return;

    if(game.coins < pack.price){

        toast("❌ Not enough Coins!");

        return;
    }

    game.coins -= pack.price;

    game.packsOpened++;

    game.missions.open++;

    const results = [];

    for(let i=0;i<pack.cards;i++){

        const player = getPlayer(packId);

        results.push(player);

        game.collection.push({
            ...player,
            id:Date.now() + Math.random()
        });

        game.missions.collect++;

        if(
            ["Legendary","Mythic","Secret","World Class"]
            .includes(player.rarity)
        ){
            game.missions.legendary++;
        }

    }

    addXP(10 + pack.cards * 2);

    saveGame();

    showPackResults(pack,results);

    updateUI();
    renderMissions();

}


/* =========================================================
   PACK RESULT MODAL
========================================================= */

function showPackResults(pack,results){

    const modal = document.getElementById("packModal");
    const result = document.getElementById("packResult");
    const title = document.getElementById("openingPackName");
    const close = document.getElementById("closePackBtn");

    title.textContent = pack.name.toUpperCase();

    result.innerHTML = `
        <p>Pack opened!</p>

        <div class="pack-results">
            ${results.map(player=>`

                <div class="result-card">

                    <div class="card-image">⚽</div>

                    <span class="rarity ${rarityClass(player.rarity)}">
                        ${player.rarity.toUpperCase()}
                    </span>

                    <div class="rating">
                        ${player.rating}
                    </div>

                    <div class="player-name">
                        ${player.name}
                    </div>

                    <div class="card-position">
                        ${player.position} • ${player.club}
                    </div>

                </div>

            `).join("")}
        </div>
    `;

    close.classList.remove("hidden");

    modal.classList.remove("hidden");

}


document.getElementById("closePackBtn").addEventListener(
    "click",
    ()=>{
        document.getElementById("packModal")
            .classList.add("hidden");
    }
);


/* =========================================================
   COLLECTION
========================================================= */

function renderCollection(){

    const grid = document.getElementById("collectionGrid");

    document.getElementById("collectionCount").textContent =
        `${game.collection.length} players collected`;

    if(!game.collection.length){

        grid.innerHTML = `
            <div class="empty-state">
                <h2>Your collection is empty</h2>
                <p>Open your first pack to collect a footballer.</p>
            </div>
        `;

        return;
    }

    grid.innerHTML = game.collection.map(player=>`

        <div class="card">

            <div class="card-image">
                ⚽
            </div>

            <span class="rarity ${rarityClass(player.rarity)}">
                ${player.rarity.toUpperCase()}
            </span>

            <div class="card-rating">
                ${player.rating}
            </div>

            <h3>${player.name}</h3>

            <div class="card-position">
                ${player.position}
            </div>

            <small>${player.club}</small>

        </div>

    `).join("");

}


/* =========================================================
   DAILY REWARD
========================================================= */

document.getElementById("dailyBtn").addEventListener(
    "click",
    claimDaily
);


function claimDaily(){

    const today = new Date().toDateString();

    if(game.dailyClaimed === today){

        toast("🎁 You already claimed today's reward.");

        return;
    }

    game.dailyClaimed = today;

    game.coins += 75;

    addXP(25);

    saveGame();
    updateUI();

    toast("🎁 +75 Coins and +25 XP!");

}


/* =========================================================
   FREE KICK
========================================================= */

document.getElementById("freeKickBtn").addEventListener(
    "click",
    freeKick
);


function freeKick(){

    const today = new Date().toDateString();

    if(game.freeKickToday === today){

        toast("⚡ You already took today's shot!");

        return;
    }

    game.freeKickToday = today;

    const success = Math.random() < .6;

    if(success){

        const reward = 40 + Math.floor(Math.random()*41);

        game.coins += reward;

        addXP(20);

        toast(`⚽ GOAL! +${reward} Coins!`);

    }else{

        addXP(10);

        toast("🥅 Saved! +10 XP for the attempt.");

    }

    saveGame();
    updateUI();

}


/* =========================================================
   SHOP
========================================================= */

document.querySelectorAll("[data-buy]").forEach(button=>{

    button.addEventListener("click",()=>{

        const type = button.dataset.buy;

        if(type === "100coins"){

            if(game.coins < 80){

                toast("❌ Not enough Coins.");

                return;
            }

            game.coins -= 80;
            game.coins += 100;

            toast("🪙 Purchased 100 Coins!");

        }

        if(type === "100xp"){

            if(game.coins < 60){

                toast("❌ Not enough Coins.");

                return;
            }

            game.coins -= 60;

            addXP(100);

            toast("⭐ +100 XP!");

        }

        if(type === "luck"){

            if(game.coins < 120){

                toast("❌ Not enough Coins.");

                return;
            }

            game.coins -= 120;

            game.luckBoost = true;

            toast("🍀 Lucky Boost activated!");

        }

        saveGame();
        updateUI();

    });

});


/* =========================================================
   MISSIONS
========================================================= */

function renderMissions(){

    const list = document.getElementById("missionsList");

    const missions = [

        {
            name:"Pack Hunter",
            description:"Open 5 packs.",
            value:game.missions.open,
            goal:5,
            reward:100
        },

        {
            name:"Collector",
            description:"Collect 20 players.",
            value:game.missions.collect,
            goal:20,
            reward:150
        },

        {
            name:"Elite Hunter",
            description:"Get 5 Legendary or better players.",
            value:game.missions.legendary,
            goal:5,
            reward:250
        }

    ];

    list.innerHTML = missions.map((m,index)=>{

        const progress = Math.min(
            100,
            (m.value/m.goal)*100
        );

        const complete = m.value >= m.goal;

        return `

            <div class="mission">

                <div class="mission-top">

                    <div>
                        <strong>${m.name}</strong>
                        <p>${m.description}</p>
                    </div>

                    <strong>
                        ${Math.min(m.value,m.goal)}/${m.goal}
                    </strong>

                </div>

                <div class="mission-progress">
                    <i style="width:${progress}%"></i>
                </div>

                <br>

                <button
                    class="ghost-btn"
                    ${complete ? "" : "disabled"}
                    onclick="claimMission(${index})"
                >
                    ${complete ? `CLAIM • ${m.reward} 🪙` : "IN PROGRESS"}
                </button>

            </div>

        `;

    }).join("");

}


const claimedMissions = JSON.parse(
    localStorage.getItem("footballUltimateClaimedMissions") || "[]"
);


function claimMission(index){

    if(claimedMissions.includes(index)){

        toast("Already claimed.");

        return;
    }

    const data = [
        [5,100],
        [20,150],
        [5,250]
    ];

    const mission = data[index];

    let value;

    if(index === 0) value = game.missions.open;
    if(index === 1) value = game.missions.collect;
    if(index === 2) value = game.missions.legendary;

    if(value < mission[0]){

        toast("Mission isn't complete yet.");

        return;
    }

    game.coins += mission[1];

    claimedMissions.push(index);

    localStorage.setItem(
        "footballUltimateClaimedMissions",
        JSON.stringify(claimedMissions)
    );

    saveGame();

    toast(`🎯 Mission reward: +${mission[1]} Coins!`);

    updateUI();
    renderMissions();

}


/* =========================================================
   PROFILE
========================================================= */

function renderProfile(){

    document.getElementById("profileName").textContent =
        game.name || "Manager";

    document.getElementById("profileLevel").textContent =
        game.level;

    document.getElementById("profilePlayers").textContent =
        game.collection.length;

    document.getElementById("profilePacks").textContent =
        game.packsOpened;

    document.getElementById("profileCoins").textContent =
        game.coins;

    document.getElementById("nameInput").value =
        game.name;

}


document.getElementById("saveNameBtn").addEventListener(
    "click",
    ()=>{
        const value =
            document.getElementById("nameInput").value.trim();

        if(!value){

            toast("Enter a manager name.");

            return;
        }

        game.name = value;

        saveGame();

        updateUI();

        toast("✅ Manager name saved!");

    }
);


/* =========================================================
   STATISTICS
========================================================= */

function renderStatistics(){

    const rare = game.collection.filter(
        p =>
            ["Rare","Epic","Legendary","Mythic","Secret","World Class"]
            .includes(p.rarity)
    ).length;

    const world = game.collection.filter(
        p => p.rarity === "World Class"
    ).length;

    const best = game.collection.length
        ? Math.max(...game.collection.map(p=>p.rating))
        : 0;

    document.getElementById("statPacks").textContent =
        game.packsOpened;

    document.getElementById("statPlayers").textContent =
        game.collection.length;

    document.getElementById("statRare").textContent =
        rare;

    document.getElementById("statBest").textContent =
        best;

    document.getElementById("statWorld").textContent =
        world;

}


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI(){

    document.getElementById("coinDisplay").textContent =
        game.coins;

    document.getElementById("levelDisplay").textContent =
        game.level;

    const needed = game.level * 100;

    document.getElementById("xpDisplay").textContent =
        `${game.xp} / ${needed} XP`;

    document.getElementById("xpBar").style.width =
        `${Math.min(100,(game.xp/needed)*100)}%`;

    renderProfile();
    renderStatistics();

}


/* =========================================================
   NAME SETUP
========================================================= */

function checkName(){

    const modal = document.getElementById("nameModal");

    if(!game.name){

        modal.classList.remove("hidden");

    }else{

        modal.classList.add("hidden");

    }

}


document.getElementById("startGameBtn").addEventListener(
    "click",
    startCareer
);


document.getElementById("firstNameInput").addEventListener(
    "keydown",
    event=>{
        if(event.key === "Enter"){
            startCareer();
        }
    }
);


function startCareer(){

    const input =
        document.getElementById("firstNameInput");

    const error =
        document.getElementById("nameError");

    const name = input.value.trim();

    if(name.length < 2){

        error.textContent =
            "Please enter at least 2 characters.";

        return;
    }

    game.name = name;

    saveGame();

    document.getElementById("nameModal")
        .classList.add("hidden");

    updateUI();

    toast(`⚽ Welcome, ${game.name}!`);

}


/* =========================================================
   MENU
========================================================= */

document.getElementById("menuBtn").addEventListener(
    "click",
    ()=>{
        document.getElementById("sidebar")
            .classList.toggle("open");
    }
);


/* =========================================================
   TOURNAMENT
========================================================= */

document.getElementById("tournamentBtn").addEventListener(
    "click",
    ()=>{
        toast("🏆 Tournament mode is coming soon!");
    }
);


/* =========================================================
   SETTINGS
========================================================= */

document.getElementById("themeSelect").addEventListener(
    "change",
    event=>{

        document.body.classList.remove(
            "pitch-theme",
            "stadium-theme"
        );

        if(event.target.value === "pitch"){
            document.body.classList.add("pitch-theme");
        }

        if(event.target.value === "stadium"){
            document.body.classList.add("stadium-theme");
        }

    }
);


document.getElementById("resetBtn").addEventListener(
    "click",
    ()=>{
        const confirmed =
            confirm("Reset your entire Football Ultimate career?");

        if(!confirmed) return;

        localStorage.removeItem("footballUltimateSave");
        localStorage.removeItem(
            "footballUltimateClaimedMissions"
        );

        location.reload();
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

renderPacks();
renderMissions();
updateUI();
checkName();
