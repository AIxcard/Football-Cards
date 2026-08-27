/* =========================================================
   FOOTBALL LEGENDS
   Main game script
   ========================================================= */


/* =========================
   PLAYER DATABASE
   ========================= */

const PLAYERS = [

  {
    id:1,
    name:"Lionel Messi",
    position:"RW",
    club:"Inter Miami",
    nation:"🇦🇷",
    rating:97,
    rarity:"World Class"
  },

  {
    id:2,
    name:"Cristiano Ronaldo",
    position:"ST",
    club:"Al Nassr",
    nation:"🇵🇹",
    rating:97,
    rarity:"World Class"
  },

  {
    id:3,
    name:"Kylian Mbappé",
    position:"ST",
    club:"Real Madrid",
    nation:"🇫🇷",
    rating:95,
    rarity:"Secret"
  },

  {
    id:4,
    name:"Erling Haaland",
    position:"ST",
    club:"Manchester City",
    nation:"🇳🇴",
    rating:95,
    rarity:"Secret"
  },

  {
    id:5,
    name:"Lamine Yamal",
    position:"RW",
    club:"Barcelona",
    nation:"🇪🇸",
    rating:93,
    rarity:"Mythic"
  },

  {
    id:6,
    name:"Vinícius Júnior",
    position:"LW",
    club:"Real Madrid",
    nation:"🇧🇷",
    rating:93,
    rarity:"Mythic"
  },

  {
    id:7,
    name:"Jude Bellingham",
    position:"CM",
    club:"Real Madrid",
    nation:"🏴",
    rating:92,
    rarity:"Legendary"
  },

  {
    id:8,
    name:"Rodri",
    position:"CDM",
    club:"Manchester City",
    nation:"🇪🇸",
    rating:91,
    rarity:"Legendary"
  },

  {
    id:9,
    name:"Mohamed Salah",
    position:"RW",
    club:"Liverpool",
    nation:"🇪🇬",
    rating:91,
    rarity:"Legendary"
  },

  {
    id:10,
    name:"Harry Kane",
    position:"ST",
    club:"Bayern Munich",
    nation:"🏴",
    rating:90,
    rarity:"Legendary"
  },

  {
    id:11,
    name:"Kevin De Bruyne",
    position:"CM",
    club:"Napoli",
    nation:"🇧🇪",
    rating:90,
    rarity:"Epic"
  },

  {
    id:12,
    name:"Neymar Jr",
    position:"LW",
    club:"Santos",
    nation:"🇧🇷",
    rating:90,
    rarity:"Epic"
  },

  {
    id:13,
    name:"Robert Lewandowski",
    position:"ST",
    club:"Barcelona",
    nation:"🇵🇱",
    rating:90,
    rarity:"Epic"
  },

  {
    id:14,
    name:"Bukayo Saka",
    position:"RW",
    club:"Arsenal",
    nation:"🏴",
    rating:89,
    rarity:"Epic"
  },

  {
    id:15,
    name:"Son Heung-min",
    position:"LW",
    club:"LAFC",
    nation:"🇰🇷",
    rating:89,
    rarity:"Epic"
  },

  {
    id:16,
    name:"Virgil van Dijk",
    position:"CB",
    club:"Liverpool",
    nation:"🇳🇱",
    rating:89,
    rarity:"Rare"
  },

  {
    id:17,
    name:"Rúben Dias",
    position:"CB",
    club:"Manchester City",
    nation:"🇵🇹",
    rating:88,
    rarity:"Rare"
  },

  {
    id:18,
    name:"Thibaut Courtois",
    position:"GK",
    club:"Real Madrid",
    nation:"🇧🇪",
    rating:89,
    rarity:"Rare"
  },

  {
    id:19,
    name:"Alisson",
    position:"GK",
    club:"Liverpool",
    nation:"🇧🇷",
    rating:89,
    rarity:"Rare"
  },

  {
    id:20,
    name:"Pedri",
    position:"CM",
    club:"Barcelona",
    nation:"🇪🇸",
    rating:88,
    rarity:"Rare"
  },

  {
    id:21,
    name:"Federico Valverde",
    position:"CM",
    club:"Real Madrid",
    nation:"🇺🇾",
    rating:88,
    rarity:"Rare"
  },

  {
    id:22,
    name:"Martin Ødegaard",
    position:"CM",
    club:"Arsenal",
    nation:"🇳🇴",
    rating:87,
    rarity:"Uncommon"
  },

  {
    id:23,
    name:"Cole Palmer",
    position:"AM",
    club:"Chelsea",
    nation:"🏴",
    rating:87,
    rarity:"Uncommon"
  },

  {
    id:24,
    name:"Declan Rice",
    position:"CDM",
    club:"Arsenal",
    nation:"🏴",
    rating:87,
    rarity:"Uncommon"
  },

  {
    id:25,
    name:"William Saliba",
    position:"CB",
    club:"Arsenal",
    nation:"🇫🇷",
    rating:86,
    rarity:"Uncommon"
  },

  {
    id:26,
    name:"Achraf Hakimi",
    position:"RB",
    club:"PSG",
    nation:"🇲🇦",
    rating:86,
    rarity:"Uncommon"
  },

  {
    id:27,
    name:"Nuno Mendes",
    position:"LB",
    club:"PSG",
    nation:"🇵🇹",
    rating:85,
    rarity:"Common"
  },

  {
    id:28,
    name:"Dani Carvajal",
    position:"RB",
    club:"Real Madrid",
    nation:"🇪🇸",
    rating:85,
    rarity:"Common"
  },

  {
    id:29,
    name:"Bernardo Silva",
    position:"AM",
    club:"Manchester City",
    nation:"🇵🇹",
    rating:86,
    rarity:"Common"
  },

  {
    id:30,
    name:"Ousmane Dembélé",
    position:"RW",
    club:"PSG",
    nation:"🇫🇷",
    rating:86,
    rarity:"Common"
  },

  {
    id:31,
    name:"Jamal Musiala",
    position:"AM",
    club:"Bayern Munich",
    nation:"🇩🇪",
    rating:86,
    rarity:"Common"
  },

  {
    id:32,
    name:"Florian Wirtz",
    position:"AM",
    club:"Liverpool",
    nation:"🇩🇪",
    rating:86,
    rarity:"Common"
  }

];


/* =========================
   ECONOMY
   ========================= */

const SELL_VALUES = {

  Common:2,

  Uncommon:3,

  Rare:5,

  Epic:8,

  Legendary:15,

  Mythic:30,

  Secret:75,

  "World Class":0

};


const PACKS = {

  starter:{
    cost:10,

    odds:{
      Common:38.95,
      Uncommon:30,
      Rare:20,
      Epic:10,
      Legendary:1,
      Mythic:0.05,
      Secret:0,
      "World Class":0
    }
  },

  premium:{
    cost:25,

    odds:{
      Common:30.85,
      Uncommon:30,
      Rare:25,
      Epic:12,
      Legendary:2,
      Mythic:.15,
      Secret:0,
      "World Class":0
    }
  },

  mega:{
    cost:50,

    odds:{
      Common:20.49,
      Uncommon:30,
      Rare:30,
      Epic:15,
      Legendary:4,
      Mythic:.5,
      Secret:.01,
      "World Class":0
    }
  },

  world:{
    cost:1,

    odds:{
      "World Class":100
    }
  }

};


/* =========================
   MISSIONS
   ========================= */

const MISSION_TEMPLATE = [

  {
    id:"packs",
    text:"Open 2 packs",
    goal:2,
    reward:5
  },

  {
    id:"rare",
    text:"Pull a Rare+ card",
    goal:1,
    reward:5
  },

  {
    id:"collect",
    text:"Collect 3 cards",
    goal:3,
    reward:8
  }

];


/* =========================
   SAVE DATA
   ========================= */

const SAVE_KEY = "footballLegendsSave";


function createNewGame(){

  return {

    coins:100,

    coinsEarned:0,

    packsOpened:0,

    collection:[],

    squad:[],

    xp:0,

    dailyClaim:0,

    freeKickUsed:false,

    missions:createMissions(),

    shopItems:[],

    settings:{
      animation:"normal",
      compact:false
    }

  };

}


function createMissions(){

  return MISSION_TEMPLATE.map(m => ({

    id:m.id,

    text:m.text,

    goal:m.goal,

    reward:m.reward,

    progress:0,

    done:false

  }));

}


let game;


function loadGame(){

  try{

    const saved =
      JSON.parse(localStorage.getItem(SAVE_KEY));

    if(saved){

      game = {

        ...createNewGame(),

        ...saved,

        settings:{
          ...createNewGame().settings,
          ...(saved.settings || {})
        }

      };

    }else{

      game = createNewGame();

    }

  }catch(error){

    game = createNewGame();

  }

}


function saveGame(){

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(game)
  );

}


/* =========================
   NAVIGATION
   ========================= */

function showPage(pageName){

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const page =
    document.getElementById(pageName);

  if(page){

    page.classList.add("active");

  }


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });


  renderAll();

}


/* =========================
   COINS
   ========================= */

function addCoins(amount){

  game.coins += amount;

  if(amount > 0){

    game.coinsEarned += amount;

  }

}


function spendCoins(amount){

  if(game.coins < amount){

    toast("You don't have enough coins.");

    return false;

  }

  game.coins -= amount;

  return true;

}


/* =========================
   DAILY CLAIM
   ========================= */

function claimDaily(){

  const now = Date.now();

  if(game.dailyClaim !== 0){

    const difference =
      now - game.dailyClaim;

    if(difference < 86400000){

      toast("Daily reward already claimed.");

      return;

    }

  }


  addCoins(15);

  game.dailyClaim = now;

  saveGame();

  toast("+15 coins!");

  renderAll();

}


/* =========================
   FREE KICK
   ========================= */

function freeKick(){

  if(game.coins !== 0){

    toast("Free Kick is only available at 0 coins.");

    return;

  }


  if(game.freeKickUsed){

    toast("Free Kick already used today.");

    return;

  }


  addCoins(5);

  game.freeKickUsed = true;

  saveGame();

  toast("+5 coins! You're back in the game.");

  renderAll();

}


/* =========================
   RARITY ROLL
   ========================= */

function rollRarity(odds){

  let random =
    Math.random() * 100;


  for(const rarity in odds){

    random -= odds[rarity];

    if(random <= 0){

      return rarity;

    }

  }


  return "Common";

}


/* =========================
   PLAYER ROLL
   ========================= */

function getPlayerByRarity(rarity){

  const players =
    PLAYERS.filter(
      player => player.rarity === rarity
    );


  if(players.length === 0){

    return PLAYERS[
      Math.floor(
        Math.random() * PLAYERS.length
      )
    ];

  }


  return players[
    Math.floor(
      Math.random() * players.length
    )
  ];

}


/* =========================
   PACK OPENING
   ========================= */

function openPack(packName){

  const pack =
    PACKS[packName];


  if(!pack){

    return;

  }


  if(!spendCoins(pack.cost)){

    return;

  }


  const rarity =
    rollRarity(pack.odds);


  const player =
    getPlayerByRarity(rarity);


  game.packsOpened++;

  game.collection.push(player.id);

  game.xp += 5;


  updateMission("packs",1);


  if([
    "Rare",
    "Epic",
    "Legendary",
    "Mythic",
    "Secret",
    "World Class"

  ].includes(player.rarity)){

    updateMission("rare",1);

  }


  updateMission("collect",1);


  saveGame();


  showPackAnimation(
    player,
    packName
  );


  renderAll();

}


/* =========================
   PACK ANIMATION
   ========================= */

function showPackAnimation(player,packName){

  const modal =
    document.getElementById("packModal");

  const animation =
    document.getElementById("packAnimation");

  const reveal =
    document.getElementById("cardReveal");


  modal.classList.add("show");


  animation.classList.remove("hidden");

  reveal.classList.add("hidden");


  const speed =
    game.settings.animation === "fast"
      ? 500
      : 1800;


  setTimeout(() => {

    animation.classList.add("hidden");

    reveal.classList.remove("hidden");


    reveal.innerHTML = `

      <div class="small-title">
        NEW CARD
      </div>

      <div class="reveal-card">

        ${createCardHTML(player)}

      </div>

      <h2>${player.name}</h2>

      <p>
        ${player.rarity}
        · ${player.rating} OVR
      </p>

      <button
        class="main-btn"
        onclick="closeModal()"
      >
        CONTINUE
      </button>

    `;

  },speed);

}


function closeModal(){

  document
    .getElementById("packModal")
    .classList.remove("show");

}


/* =========================
   CARD HTML
   ========================= */

function createCardHTML(player){

  const rarityClass =
    player.rarity.replaceAll(" ","-");


  return `

    <div class="football-card rarity-${rarityClass}">

      <div class="card-rating">
        ${player.rating}
      </div>

      <div class="card-position">
        ${player.position}
      </div>

      <div class="card-flag">
        ${player.nation}
      </div>

      <div class="card-player">
        ${player.name}
      </div>

      <div class="card-club">
        ${player.club}
      </div>

      <div class="card-rarity">
        ${player.rarity.toUpperCase()}
      </div>

    </div>

  `;

}


/* =========================
   COLLECTION
   ========================= */

let currentFilter = "all";


function filterCards(filter,button){

  currentFilter = filter;


  document
    .querySelectorAll(".filter")
    .forEach(btn => {

      btn.classList.remove("active");

    });


  button.classList.add("active");


  renderCollection();

}


function getCounts(){

  const counts = {};

  game.collection.forEach(id => {

    counts[id] =
      (counts[id] || 0) + 1;

  });


  return counts;

}


function renderCollection(){

  const grid =
    document.getElementById(
      "collectionGrid"
    );


  if(!grid){

    return;

  }


  const counts =
    getCounts();


  let ids =
    Object.keys(counts)
      .map(Number);


  if(currentFilter !== "all"){

    ids = ids.filter(id => {

      const player =
        PLAYERS.find(p => p.id === id);

      return player &&
        player.rarity === currentFilter;

    });

  }


  if(ids.length === 0){

    grid.innerHTML = `

      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:60px 10px;
        color:#77849a;
      ">

        No cards here yet.<br>
        Open a pack to start your collection.

      </div>

    `;

    return;

  }


  grid.innerHTML =
    ids.map(id => {

      const player =
        PLAYERS.find(p => p.id === id);


      return `

        <div class="card-wrapper">

          ${createCardHTML(player)}

          <div style="
            margin-top:5px;
            text-align:center;
            color:#8996aa;
            font-size:11px;
          ">
            Owned ×${counts[id]}
          </div>

        </div>

      `;

    }).join("");

}


/* =========================
   MISSIONS
   ========================= */

function updateMission(id,amount){

  const mission =
    game.missions.find(
      m => m.id === id
    );


  if(!mission || mission.done){

    return;

  }


  mission.progress =
    Math.min(
      mission.goal,
      mission.progress + amount
    );


  if(
    mission.progress >=
    mission.goal
  ){

    mission.done = true;

    addCoins(mission.reward);

    toast(
      `Mission complete! +${mission.reward} coins`
    );

  }

}


function renderMissions(){

  const container =
    document.getElementById("missions");


  if(!container){

    return;

  }


  let completed = 0;


  container.innerHTML =
    game.missions.map(mission => {

      if(mission.done){

        completed++;

      }


      const percentage =
        Math.min(
          100,
          mission.progress /
          mission.goal * 100
        );


      return `

        <div class="mission">

          <div>
            ${mission.done ? "✅" : "🎯"}
          </div>

          <div class="mission-info">

            <strong>
              ${mission.text}
            </strong>

            <div class="progress">

              <div
                class="progress-bar"
                style="
                  width:${percentage}%;
                "
              ></div>

            </div>

            <small>
              ${mission.progress}/${mission.goal}
            </small>

          </div>

          <strong>
            +${mission.reward}
          </strong>

        </div>

      `;

    }).join("");


  document.getElementById(
    "missionCounter"
  ).textContent =
    `${completed}/3`;

}


/* =========================
   SQUAD
   ========================= */

function autoBuildSquad(){

  const counts =
    getCounts();


  const ownedPlayers =
    PLAYERS
      .filter(player => counts[player.id])
      .sort(
        (a,b) =>
          b.rating - a.rating
      );


  if(ownedPlayers.length === 0){

    toast("Collect some players first.");

    return;

  }


  const selected = [];


  const positions = [
    "GK",
    "LB",
    "CB",
    "CB",
    "RB",
    "CDM",
    "CM",
    "AM",
    "LW",
    "ST",
    "RW"
  ];


  positions.forEach(position => {

    const player =
      ownedPlayers.find(
        p =>
          p.position === position &&
          !selected.includes(p.id)
      );


    if(player){

      selected.push(player.id);

    }

  });


  ownedPlayers.forEach(player => {

    if(
      selected.length < 11 &&
      !selected.includes(player.id)
    ){

      selected.push(player.id);

    }

  });


  game.squad =
    selected.slice(0,11);


  saveGame();

  toast("Squad updated!");

  renderSquad();

}


function renderSquad(){

  const squad =
    game.squad || [];


  for(let i=0;i<11;i++){

    const slot =
      document.getElementById(
        `slot${i}`
      );


    if(!slot){

      continue;

    }


    const player =
      PLAYERS.find(
        p => p.id === squad[i]
      );


    if(!player){

      slot.innerHTML = `

        <button>
          +
        </button>

        <small>
          Empty
        </small>

      `;

      continue;

    }


    slot.innerHTML = `

      <button>
        ${player.rating}
      </button>

      <small>
        ${player.name.split(" ").pop()}
      </small>

    `;

  }


  const list =
    document.getElementById(
      "squadPlayers"
    );


  if(!list){

    return;

  }


  list.innerHTML =
    Array.from(
      {length:11},
      (_,index) => {

        const player =
          PLAYERS.find(
            p => p.id === squad[index]
          );


        if(!player){

          return `

            <div class="squad-player">

              <span>
                ${index+1}. Empty
              </span>

              <small>
                —
              </small>

            </div>

          `;

        }


        return `

          <div class="squad-player">

            <span>
              ${index+1}. ${player.name}
            </span>

            <small>
              ${player.rating}
            </small>

          </div>

        `;

      }
    ).join("");

}


/* =========================
   PROFILE / SELL
   ========================= */

function renderSellList(){

  const container =
    document.getElementById(
      "sellList"
    );


  if(!container){

    return;

  }


  const counts =
    getCounts();


  const ids =
    Object.keys(counts)
      .map(Number);


  if(ids.length === 0){

    container.innerHTML = `

      <p style="color:#77849a">
        You don't have any cards yet.
      </p>

    `;

    return;

  }


  container.innerHTML =
    ids.map(id => {

      const player =
        PLAYERS.find(
          p => p.id === id
        );


      const amount =
        counts[id];


      const value =
        SELL_VALUES[player.rarity];


      if(value === 0){

        return `

          <div class="sell-row">

            <span>
              ${player.name}
              · ${player.rarity}
              · ×${amount}
            </span>

            <small>
              CANNOT SELL
            </small>

          </div>

        `;

      }


      return `

        <div class="sell-row">

          <span>
            ${player.name}
            · ${player.rarity}
            · ×${amount}
          </span>

          <button
            onclick="sellCard(${player.id})"
          >
            SELL 1 · +${value}
          </button>

        </div>

      `;

    }).join("");

}


function sellCard(playerId){

  const index =
    game.collection.indexOf(
      playerId
    );


  if(index === -1){

    return;

  }


  const player =
    PLAYERS.find(
      p => p.id === playerId
    );


  const value =
    SELL_VALUES[player.rarity];


  if(!value){

    toast("This card cannot be sold.");

    return;

  }


  game.collection.splice(
    index,
    1
  );


  addCoins(value);


  game.squad =
    game.squad.filter(
      id => id !== playerId
    );


  saveGame();

  toast(
    `${player.name} sold for +${value} coins`
  );

  renderAll();

}


/* =========================
   SHOP
   ========================= */

function buyItem(item,cost){

  if(game.shopItems.includes(item)){

    toast("You already own this.");

    return;

  }


  if(!spendCoins(cost)){

    return;

  }


  game.shopItems.push(item);

  saveGame();

  toast(`${item} purchased!`);

  renderAll();

}


/* =========================
   SETTINGS
   ========================= */

function changeAnimationSpeed(value){

  game.settings.animation =
    value;

  saveGame();

}


function toggleCompact(enabled){

  game.settings.compact =
    enabled;


  document.body.classList.toggle(
    "compact",
    enabled
  );


  saveGame();

}


/* =========================
   RESET
   ========================= */

function resetGame(){

  const answer =
    confirm(
      "Are you sure you want to delete ALL Football Legends progress?"
    );


  if(!answer){

    return;

  }


  game =
    createNewGame();


  saveGame();

  showPage("home");

  toast("Save reset.");

}


/* =========================
   TIMER
   ========================= */

function updateTimer(){

  const timer =
    document.getElementById(
      "dailyTimer"
    );


  const button =
    document.getElementById(
      "dailyButton"
    );


  if(!timer || !button){

    return;

  }


  if(game.dailyClaim === 0){

    timer.textContent = "READY";

    button.disabled = false;

    button.textContent = "CLAIM";

    return;

  }


  const remaining =
    86400000 -
    (Date.now() - game.dailyClaim);


  if(remaining <= 0){

    game.dailyClaim = 0;

    game.freeKickUsed = false;

    game.missions =
      createMissions();


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

  button.textContent = "USED";

}


/* =========================
   MAIN RENDER
   ========================= */

function renderAll(){

  document.getElementById(
    "coinAmount"
  ).textContent =
    game.coins;


  document.getElementById(
    "packCoins"
  ).textContent =
    game.coins;


  const unique =
    new Set(
      game.collection
    );


  document.getElementById(
    "uniqueCards"
  ).textContent =
    `${unique.size}/${PLAYERS.length}`;


  document.getElementById(
    "packsOpened"
  ).textContent =
    game.packsOpened;


  const level =
    Math.min(
      100,
      1 +
      Math.floor(
        game.xp / 50
      )
    );


  document.getElementById(
    "playerLevel"
  ).textContent =
    level;


  document.getElementById(
    "profileLevel"
  ).textContent =
    level;


  document.getElementById(
    "xpText"
  ).textContent =
    `${game.xp % 50}/50 XP`;


  document.getElementById(
    "coinsEarned"
  ).textContent =
    game.coinsEarned;


  document.getElementById(
    "profilePacks"
  ).textContent =
    game.packsOpened;


  document.getElementById(
    "cardsOwned"
  ).textContent =
    game.collection.length;


  document.getElementById(
    "collectionAmount"
  ).textContent =
    `${game.collection.length} cards`;


  const freeKick =
    document.getElementById(
      "freeKickCard"
    );


  if(freeKick){

    freeKick.style.display =
      game.coins === 0 &&
      !game.freeKickUsed
        ? "flex"
        : "none";

  }


  const compact =
    document.getElementById(
      "compactCards"
    );


  if(compact){

    compact.checked =
      game.settings.compact;

  }


  const animation =
    document.getElementById(
      "animationSpeed"
    );


  if(animation){

    animation.value =
      game.settings.animation;

  }


  document.body.classList.toggle(
    "compact",
    game.settings.compact
  );


  renderMissions();

  renderCollection();

  renderSquad();

  renderSellList();

  updateTimer();

}


/* =========================
   TOAST
   ========================= */

function toast(message){

  const element =
    document.getElementById(
      "toast"
    );


  element.textContent =
    message;


  element.classList.add(
    "show"
  );


  setTimeout(() => {

    element.classList.remove(
      "show"
    );

  },1800);

}


/* =========================
   START GAME
   ========================= */

loadGame();

renderAll();

setInterval(
  updateTimer,
  1000
);
