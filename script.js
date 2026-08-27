/* =========================================================
   FOOTBALL CARDS
   ONLINE-READY CLIENT GAME
   ========================================================= */

"use strict";

const SAVE_KEY = "footballCardsSave_v5";
const NAMES_KEY = "footballCardsNames_v2";

/*
 * ONLINE BACKEND
 *
 * GitHub Pages itself cannot provide a database/backend.
 * Put your future backend URL here.
 *
 * Example:
 * const ONLINE_API = "https://your-backend.example.com/api";
 *
 * Leave it empty for local mode.
 */
const ONLINE_API = "";

const RARITY_ORDER = {
    Common:1,
    Uncommon:2,
    Rare:3,
    Epic:4,
    Legendary:5,
    Mythic:6,
    Secret:7,
    "World Class":8,
    Limited:9,
    Tournament:10
};

const DUPLICATE_VALUES = {
    Common:2,
    Uncommon:3,
    Rare:5,
    Epic:8,
    Legendary:15,
    Mythic:30,
    Secret:75,
    "World Class":100,
    Limited:25,
    Tournament:50
};

/* =========================================================
   PLAYERS
   ========================================================= */

const PLAYERS = [
{name:"Lionel Messi",rating:97,pos:"RW",rarity:"World Class"},
{name:"Cristiano Ronaldo",rating:97,pos:"ST",rarity:"World Class"},

{name:"Kylian Mbappé",rating:96,pos:"ST",rarity:"Secret"},
{name:"Erling Haaland",rating:96,pos:"ST",rarity:"Secret"},
{name:"Neymar Jr",rating:95,pos:"LW",rarity:"Mythic"},
{name:"Kevin De Bruyne",rating:94,pos:"CM",rarity:"Mythic"},
{name:"Vinícius Júnior",rating:94,pos:"LW",rarity:"Mythic"},
{name:"Jude Bellingham",rating:93,pos:"CM",rarity:"Mythic"},
{name:"Mohamed Salah",rating:93,pos:"RW",rarity:"Mythic"},
{name:"Robert Lewandowski",rating:93,pos:"ST",rarity:"Mythic"},
{name:"Lamine Yamal",rating:94,pos:"RW",rarity:"Mythic"},

{name:"Harry Kane",rating:93,pos:"ST",rarity:"Legendary"},
{name:"Rodri",rating:93,pos:"CDM",rarity:"Legendary"},
{name:"Pedri",rating:91,pos:"CM",rarity:"Legendary"},
{name:"Bukayo Saka",rating:91,pos:"RW",rarity:"Legendary"},
{name:"Phil Foden",rating:91,pos:"RW",rarity:"Legendary"},
{name:"Bernardo Silva",rating:91,pos:"CAM",rarity:"Legendary"},
{name:"Martin Ødegaard",rating:91,pos:"CAM",rarity:"Legendary"},
{name:"Antoine Griezmann",rating:91,pos:"CF",rarity:"Legendary"},
{name:"Son Heung-min",rating:90,pos:"LW",rarity:"Legendary"},
{name:"Virgil van Dijk",rating:91,pos:"CB",rarity:"Legendary"},
{name:"Thibaut Courtois",rating:90,pos:"GK",rarity:"Legendary"},
{name:"Alisson Becker",rating:90,pos:"GK",rarity:"Legendary"},
{name:"Luka Modrić",rating:88,pos:"CM",rarity:"Legendary"},
{name:"Toni Kroos",rating:88,pos:"CM",rarity:"Legendary"},

{name:"Rúben Dias",rating:89,pos:"CB",rarity:"Epic"},
{name:"William Saliba",rating:89,pos:"CB",rarity:"Epic"},
{name:"Achraf Hakimi",rating:89,pos:"RB",rarity:"Epic"},
{name:"Theo Hernández",rating:89,pos:"LB",rarity:"Epic"},
{name:"Trent Alexander-Arnold",rating:88,pos:"RB",rarity:"Epic"},
{name:"Declan Rice",rating:89,pos:"CDM",rarity:"Epic"},
{name:"Bruno Fernandes",rating:89,pos:"CAM",rarity:"Epic"},
{name:"Lautaro Martínez",rating:89,pos:"ST",rarity:"Epic"},
{name:"Victor Osimhen",rating:89,pos:"ST",rarity:"Epic"},
{name:"Rafael Leão",rating:88,pos:"LW",rarity:"Epic"},
{name:"Cole Palmer",rating:88,pos:"CAM",rarity:"Epic"},
{name:"Jamal Musiala",rating:89,pos:"CAM",rarity:"Epic"},
{name:"Florian Wirtz",rating:88,pos:"CAM",rarity:"Epic"},

{name:"Federico Valverde",rating:88,pos:"CM",rarity:"Rare"},
{name:"Eduardo Camavinga",rating:86,pos:"CM",rarity:"Rare"},
{name:"Aurélien Tchouaméni",rating:86,pos:"CDM",rarity:"Rare"},
{name:"Ousmane Dembélé",rating:87,pos:"RW",rarity:"Rare"},
{name:"Christian Pulisic",rating:86,pos:"LW",rarity:"Rare"},
{name:"Kai Havertz",rating:86,pos:"ST",rarity:"Rare"},
{name:"Marcus Rashford",rating:85,pos:"LW",rarity:"Rare"},
{name:"Gabriel Martinelli",rating:84,pos:"LW",rarity:"Rare"},
{name:"Gianluigi Donnarumma",rating:89,pos:"GK",rarity:"Rare"},
{name:"Manuel Neuer",rating:88,pos:"GK",rarity:"Rare"},
{name:"Mason Mount",rating:83,pos:"CM",rarity:"Rare"},

{name:"Zlatan Ibrahimović",rating:91,pos:"ST",rarity:"Secret"},
{name:"Sergio Ramos",rating:90,pos:"CB",rarity:"Secret"},
{name:"Andrés Iniesta",rating:93,pos:"CM",rarity:"Secret"},
{name:"Xavi",rating:92,pos:"CM",rarity:"Secret"},

{name:"Ronaldinho",rating:94,pos:"LW",rarity:"Limited"},
{name:"Zinedine Zidane",rating:95,pos:"CAM",rarity:"Limited"},
{name:"Diego Maradona",rating:96,pos:"CAM",rarity:"Limited"},
{name:"Pelé",rating:98,pos:"ST",rarity:"Limited"},
{name:"Thierry Henry",rating:94,pos:"ST",rarity:"Limited"},
{name:"Ronaldo Nazário",rating:97,pos:"ST",rarity:"Limited"},
{name:"David Beckham",rating:91,pos:"RM",rarity:"Limited"},
{name:"Andrea Pirlo",rating:91,pos:"CM",rarity:"Limited"},
{name:"Paolo Maldini",rating:94,pos:"CB",rarity:"Limited"},
{name:"Gianluigi Buffon",rating:94,pos:"GK",rarity:"Limited"}
];

/* =========================================================
   PACKS
   =========================================================
   Prices are intentionally lower.
   World Class remains extremely rare.
   ========================================================= */

const PACKS = {

starter:{
    name:"Starter Pack",
    cost:10,
    rates:{
        Common:70,
        Uncommon:20,
        Rare:7,
        Epic:2.5,
        Legendary:.5
    }
},

premium:{
    name:"Premium Pack",
    cost:25,
    rates:{
        Uncommon:65,
        Rare:25,
        Epic:8,
        Legendary:2
    }
},

elite:{
    name:"Mega Pack",
    cost:45,
    rates:{
        Rare:72,
        Epic:20,
        Legendary:6.9,
        Mythic:1,
        Secret:.09,
        "World Class":.01
    }
},

limited:{
    name:"Legends of the Past",
    cost:60,
    rates:{
        Limited:100
    }
}

};

/* =========================================================
   FRAMES
   ========================================================= */

const FRAMES = [
{id:"default",name:"Classic",cost:0,css:"frame-default"},
{id:"blue",name:"Blue Pulse",cost:20,css:"frame-blue"},
{id:"green",name:"Emerald",cost:35,css:"frame-green"},
{id:"purple",name:"Royal Purple",cost:50,css:"frame-purple"},
{id:"gold",name:"Golden",cost:100,css:"frame-gold"},
{id:"red",name:"Crimson",cost:150,css:"frame-red"},
{id:"rainbow",name:"Animated Prism",cost:300,css:"frame-rainbow"},
{id:"champion",name:"Champion",cost:500,css:"frame-champion"}
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
    cost:40,
    css:"linear-gradient(135deg,#082b1b,#0b633a,#062115)"
},
{
    id:"lights",
    name:"Stadium Lights",
    cost:80,
    css:"radial-gradient(circle at 50% 0%,#4a77aa,#0b111a 55%)"
},
{
    id:"champions",
    name:"Champions",
    cost:150,
    css:"linear-gradient(135deg,#16100a,#6a4d16,#0b111a)"
},
{
    id:"blue",
    name:"Blue Arena",
    cost:225,
    css:"linear-gradient(135deg,#06122b,#155fc1,#06122b)"
},
{
    id:"cosmic",
    name:"Cosmic Football",
    cost:350,
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
   STATE
   ========================================================= */

function freshState(){
return{
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
    lastSave:Date.now()
};
}

function loadGame(){
try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw)return freshState();

    const saved=JSON.parse(raw);
    const fresh=freshState();

    return{
        ...fresh,
        ...saved,
        stats:{...fresh.stats,...(saved.stats||{})},
        missionProgress:{
            ...fresh.missionProgress,
            ...(saved.missionProgress||{})
        },
        missionClaimed:{
            ...fresh.missionClaimed,
            ...(saved.missionClaimed||{})
        },
        missionReset:{
            ...fresh.missionReset,
            ...(saved.missionReset||{})
        }
    };
}catch(e){
    return freshState();
}
}

let state=loadGame();
let currentMissionType="hourly";
let playStarted=Date.now();

/* =========================================================
   SAVE
   ========================================================= */

function saveGame(){
    state.lastSave=Date.now();

    try{
        localStorage.setItem(SAVE_KEY,JSON.stringify(state));
    }catch(e){
        console.warn("Save failed",e);
    }
}

window.addEventListener("beforeunload",()=>{
    updatePlaytime();
    saveGame();
});

setInterval(()=>{
    updatePlaytime();
    saveGame();
},10000);

function updatePlaytime(){
    const seconds=Math.floor((Date.now()-playStarted)/1000);

    if(seconds>0){
        state.stats.playtime+=seconds;
        playStarted=Date.now();
    }
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded",()=>{
    bindEvents();
    checkName();
    renderAll();
    updateTimers();

    setInterval(updateTimers,1000);
    setInterval(checkMissionResets,1000);

    checkOnline();
});

function bindEvents(){

    const confirm=document.getElementById("nameConfirm");

    if(confirm){
        confirm.addEventListener("click",confirmName);
    }

    const wc=document.getElementById("wcContinue");

    if(wc){
        wc.addEventListener("click",()=>{
            document.getElementById("worldClassOverlay")
                .classList.add("hidden");

            const card=state.cards.find(
                c=>c.id===state.worldClassPending
            );

            if(card)showCardResult(card,false);

            state.worldClassPending=null;
            saveGame();
        });
    }
}

function checkName(){
    if(!state.initialized||!state.name){
        document.getElementById("nameModal")
            .classList.remove("hidden");
    }
}

function confirmName(){

    const input=document.getElementById("nameInput");
    const error=document.getElementById("nameError");

    const name=input.value.trim();

    if(name.length<3){
        error.textContent="Name must be at least 3 characters.";
        return;
    }

    if(!/^[a-zA-Z0-9 _-]+$/.test(name)){
        error.textContent="Use letters, numbers, spaces, - or _.";
        return;
    }

    const names=JSON.parse(
        localStorage.getItem(NAMES_KEY)||"[]"
    );

    const lower=name.toLowerCase();

    if(names.includes(lower)){
        error.textContent="That name is already used on this device.";
        return;
    }

    names.push(lower);

    localStorage.setItem(
        NAMES_KEY,
        JSON.stringify(names)
    );

    state.name=name;
    state.initialized=true;

    startLimitedEvent();
    startTournament();

    saveGame();

    document.getElementById("nameModal")
        .classList.add("hidden");

    renderAll();

    toast("Welcome to Football Cards!");
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showPage(page){

    document.querySelectorAll(".page")
        .forEach(p=>p.classList.remove("active-page"));

    const target=document.getElementById(page);

    if(target)target.classList.add("active-page");

    document.querySelectorAll(".nav")
        .forEach(n=>{
            n.classList.toggle(
                "active",
                n.dataset.page===page
            );
        });

    if(page==="cards")renderCards();
    if(page==="shop")renderShop();
    if(page==="profile")renderProfile();
    if(page==="statistics")renderStatistics();
    if(page==="leaderboard")renderLeaderboard();
    if(page==="tournament")renderTournament();
    if(page==="missions")renderMissions();

    document.getElementById("sidebar")
        .classList.remove("open");
}

function toggleSidebar(){
    document.getElementById("sidebar")
        .classList.toggle("open");
}

/* =========================================================
   RENDER
   ========================================================= */

function renderAll(){

    const coin=document.getElementById("coinDisplay");
    if(coin)coin.textContent=state.coins;

    const name=state.name||"Football Collector";

    setText("homeName",name);
    setText("profileName",name);
    setText("settingsCurrentName",name);

    setText("homeLevel",state.level);
    setText("profileLevel",state.level);

    setText("homeXP",state.xp);
    setText("profileXP",`${state.xp} / 50 XP`);

    const xpPercent=Math.min(
        100,
        state.xp/50*100
    );

    const homeXP=document.getElementById("homeXPBar");
    const profileXP=document.getElementById("profileXPBar");

    if(homeXP)homeXP.style.width=xpPercent+"%";
    if(profileXP)profileXP.style.width=xpPercent+"%";

    setText("homeCards",state.cards.length);
    setText("profileCards",state.cards.length);

    setText("profilePacks",state.stats.packsOpened);
    setText(
        "profilePlaytime",
        formatPlaytime(state.stats.playtime)
    );

    setText("homeAvatar",state.avatar);
    setText("profileAvatar",state.avatar);

    renderMissions();
    renderProfile();
    updateDailyReward();
    updateFreeKick();

    const limited=document.getElementById("limitedPackCard");

    if(limited){
        limited.style.display=
            isLimitedActive()?"block":"none";
    }
}

function setText(id,value){
    const el=document.getElementById(id);
    if(el)el.textContent=value;
}

function toast(message){

    const el=document.getElementById("toast");

    if(!el)return;

    el.textContent=message;
    el.classList.add("show");

    clearTimeout(window.toastTimeout);

    window.toastTimeout=setTimeout(()=>{
        el.classList.remove("show");
    },2500);
}

function formatPlaytime(seconds){

    if(seconds<60)return seconds+"s";

    const mins=Math.floor(seconds/60);

    if(mins<60)return mins+"m";

    const hours=Math.floor(mins/60);

    return `${hours}h ${mins%60}m`;
}

/* =========================================================
   ECONOMY
   ========================================================= */

function addCoins(amount){

    if(amount<=0)return;

    state.coins+=amount;
    state.stats.coinsEarned+=amount;

    progressMission("coins",amount);

    saveGame();
    renderAll();
}

function spendCoins(amount){

    if(state.coins<amount){
        toast("Not enough coins.");

        if(state.coins===0){
            updateFreeKick();
        }

        return false;
    }

    state.coins-=amount;
    state.stats.coinsSpent+=amount;

    saveGame();
    renderAll();

    return true;
}

/* =========================================================
   DAILY REWARD
   ========================================================= */

function claimDailyReward(){

    const now=Date.now();

    if(
        now-state.dailyRewardClaimed<
        86400000
    ){
        toast("Daily reward is not ready yet.");
        return;
    }

    state.dailyRewardClaimed=now;

    addCoins(100);
    addXP(10);

    toast("🎁 Daily reward: +100 coins!");
}

function updateDailyReward(){

    const btn=document.getElementById("dailyRewardBtn");
    const text=document.getElementById("dailyRewardText");

    if(!btn||!text)return;

    if(
        Date.now()-state.dailyRewardClaimed>=86400000
    ){
        btn.disabled=false;
        btn.textContent="Claim";
        text.textContent="Your daily reward is ready.";
    }else{
        btn.disabled=true;
        btn.textContent="Claimed";
        text.textContent="Come back tomorrow.";
    }
}

/* =========================================================
   FREE KICK
   ========================================================= */

function freeKick(){

    if(state.coins>0){
        toast("Free Kick appears when you reach 0 coins.");
        return;
    }

    if(
        Date.now()-state.freeKickClaimed<
        86400000
    ){
        toast("Free Kick already used today.");
        return;
    }

    state.freeKickClaimed=Date.now();

    addCoins(5);

    toast("🆘 Free Kick: +5 coins!");
}

function updateFreeKick(){

    const box=document.getElementById("freeKickBox");

    if(!box)return;

    box.style.display=
        state.coins===0?"flex":"none";
}

/* =========================================================
   XP
   ========================================================= */

function addXP(amount){

    state.xp+=amount;

    while(state.xp>=50){
        state.xp-=50;
        state.level++;

        toast(`⭐ Level ${state.level}!`);
    }

    saveGame();
}

/* =========================================================
   PACKS
   ========================================================= */

function openPack(type){

    const pack=PACKS[type];

    if(!pack)return;

    if(type==="limited"&&!isLimitedActive()){
        toast("The limited event has ended.");
        return;
    }

    if(!spendCoins(pack.cost))return;

    state.stats.packsOpened++;

    const rarity=rollRarity(pack.rates);
    const player=choosePlayer(rarity);

    if(!player){

        addCoins(pack.cost);

        toast("Pack error — coins returned.");
        return;
    }

    const duplicate=state.cards.some(
        c=>c.player===player.name
    );

    const card={
        id:
            Date.now()+"_"+Math.random()
            .toString(36)
            .slice(2),

        player:player.name,
        rating:player.rating,
        pos:player.pos,
        rarity:rarity,
        frame:"default",
        obtained:Date.now()
    };

    state.cards.push(card);

    state.stats.cardsPulled++;

    if(duplicate)state.stats.duplicates++;

    updateRarityStats(rarity,player);

    addXP(
        rarity==="World Class"?100:
        rarity==="Secret"?35:
        rarity==="Mythic"?20:
        rarity==="Legendary"?10:
        5
    );

    progressMission("packs",1);
    progressMission("cards",1);

    if(
        (RARITY_ORDER[rarity]||0)>=
        RARITY_ORDER.Rare
    ){
        progressMission("rare",1);
    }

    if(
        (RARITY_ORDER[rarity]||0)>=
        RARITY_ORDER.Epic
    ){
        progressMission("epic",1);
    }

    if(
        (RARITY_ORDER[rarity]||0)>=
        RARITY_ORDER.Legendary
    ){
        progressMission("legendary",1);
    }

    saveGame();

    if(rarity==="World Class"){
        showWorldClass(card);
    }else{
        showCardResult(card,duplicate);
    }

    renderAll();
}

function rollRarity(rates){

    let random=Math.random()*100;

    for(const rarity of Object.keys(rates)){

        random-=rates[rarity];

        if(random<0){
            return rarity;
        }
    }

    return Object.keys(rates)[
        Object.keys(rates).length-1
    ];
}

function choosePlayer(rarity){

    let pool=PLAYERS.filter(
        p=>p.rarity===rarity
    );

    if(rarity==="World Class"){
        pool=PLAYERS.filter(
            p=>
                p.name==="Lionel Messi"||
                p.name==="Cristiano Ronaldo"
        );
    }

    if(!pool.length)return null;

    return pool[
        Math.floor(Math.random()*pool.length)
    ];
}

function updateRarityStats(rarity,player){

    const key=rarity
        .toLowerCase()
        .replaceAll(" ","");

    if(state.stats[key]!==undefined){
        state.stats[key]++;
    }

    if(
        (RARITY_ORDER[rarity]||0)>
        (RARITY_ORDER[state.stats.highestRarity]||0)
    ){
        state.stats.highestRarity=rarity;
    }

    if(player.rating>state.stats.highestRating){
        state.stats.highestRating=player.rating;
    }
}

/* =========================================================
   WORLD CLASS
   ========================================================= */

function showWorldClass(card){

    const overlay=
        document.getElementById("worldClassOverlay");

    if(!overlay)return;

    setText(
        "wcPlayerName",
        card.player.toUpperCase()
    );

    setText(
        "wcPlayerMeta",
        `${card.rating} · ${card.pos} · WORLD CLASS`
    );

    overlay.classList.remove("hidden");

    state.worldClassPending=card.id;

    saveGame();
}

function showCardResult(card,duplicate){

    toast(
        `${card.player} — ${card.rarity}`+
        `${duplicate?" · DUPLICATE":""}`
    );
}

/* =========================================================
   COLLECTION
   ========================================================= */

function renderCards(){

    const grid=document.getElementById("cardsGrid");
    const filter=document.getElementById("cardFilter");

    if(!grid||!filter)return;

    let cards=[...state.cards];

    if(filter.value!=="all"){
        cards=cards.filter(
            c=>c.rarity===filter.value
        );
    }

    setText(
        "collectionCount",
        `${state.cards.length} cards collected`
    );

    if(!cards.length){

        grid.innerHTML=`
            <div class="empty-state">
                No cards here yet.<br>
                Open a pack to start collecting.
            </div>
        `;

        return;
    }

    grid.innerHTML=cards.map(card=>{

        const frame=
            FRAMES.find(f=>f.id===card.frame)||
            FRAMES[0];

        const value=
            DUPLICATE_VALUES[card.rarity]||0;

        return`
        <article class="card ${frame.css}">

            <span class="rarity ${rarityClassName(card.rarity)}">
                ${escapeHTML(card.rarity)}
            </span>

            <div class="card-image">
                ${playerEmoji(card)}
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

                <button onclick="viewCard('${card.id}')">
                    View
                </button>

                ${
                    value>0
                    ?
                    `<button class="sell"
                        onclick="sellCard('${card.id}')">
                        Sell ${value} 🪙
                    </button>`
                    :""
                }

            </div>

        </article>
        `;
    }).join("");
}

function playerEmoji(card){

    if(card.player.includes("Messi"))return"🔵";
    if(card.player.includes("Ronaldo"))return"🔴";
    if(card.player.includes("Mbapp"))return"⚡";
    if(card.player.includes("Haaland"))return"👑";
    if(card.player.includes("Yamal"))return"🌟";

    if(card.rarity==="World Class")return"🌎";
    if(card.rarity==="Limited")return"👑";

    return"⚽";
}

function rarityClassName(rarity){
    return rarity.toLowerCase().replaceAll(" ","");
}

function viewCard(id){

    const card=state.cards.find(
        c=>c.id===id
    );

    if(!card)return;

    toast(
        `${card.player} · ${card.rating} · ${card.rarity}`
    );
}

function sellCard(id){

    const index=state.cards.findIndex(
        c=>c.id===id
    );

    if(index===-1)return;

    const card=state.cards[index];

    const value=
        DUPLICATE_VALUES[card.rarity]||0;

    if(value<=0){
        toast("This card cannot be sold.");
        return;
    }

    state.cards.splice(index,1);

    state.stats.cardsSold++;

    addCoins(value);

    saveGame();
    renderCards();

    toast(
        `Sold ${card.player} for ${value} coins.`
    );
}

/* =========================================================
   SHOP
   ========================================================= */

function renderShop(){

    const frames=
        document.getElementById("frameShop");

    const backgrounds=
        document.getElementById("backgroundShop");

    if(frames){

        frames.innerHTML=FRAMES.map(frame=>{

            const owned=
                state.ownedFrames.includes(frame.id);

            return`
            <div class="shop-item">

                <div class="shop-preview ${frame.css}"></div>

                <h3>${frame.name}</h3>

                <p>
                    ${frame.cost===0?
                    "Free":
                    frame.cost+" coins"}
                </p>

                <button
                    ${owned?"disabled":""}
                    class="${owned?"owned":""}"
                    onclick="buyFrame('${frame.id}')">

                    ${owned?"Owned":"Buy"}

                </button>

            </div>
            `;

        }).join("");
    }

    if(backgrounds){

        backgrounds.innerHTML=
            BACKGROUNDS.map(bg=>{

                const owned=
                    state.ownedBackgrounds
                    .includes(bg.id);

                return`
                <div class="shop-item">

                    <div
                        class="shop-preview"
                        style="background:${bg.css}">
                    </div>

                    <h3>${bg.name}</h3>

                    <p>
                        ${bg.cost===0?
                        "Free":
                        bg.cost+" coins"}
                    </p>

                    <button
                        ${owned?"disabled":""}
                        class="${owned?"owned":""}"
                        onclick="buyBackground('${bg.id}')">

                        ${owned?"Owned":"Buy"}

                    </button>

                </div>
                `;

            }).join("");
    }
}

function buyFrame(id){

    const frame=FRAMES.find(
        f=>f.id===id
    );

    if(!frame)return;

    if(state.ownedFrames.includes(id)){
        toast("You already own this frame.");
        return;
    }

    if(!spendCoins(frame.cost))return;

    state.ownedFrames.push(id);

    saveGame();
    renderShop();

    toast(`Frame unlocked: ${frame.name}`);
}

function buyBackground(id){

    const bg=BACKGROUNDS.find(
        b=>b.id===id
    );

    if(!bg)return;

    if(state.ownedBackgrounds.includes(id)){
        toast("You already own this background.");
        return;
    }

    if(!spendCoins(bg.cost))return;

    state.ownedBackgrounds.push(id);

    saveGame();
    renderShop();

    toast(`Background unlocked: ${bg.name}`);
}

/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile(){

    setText(
        "profileName",
        state.name||"Football Collector"
    );

    setText(
        "profileAvatar",
        state.avatar
    );

    const bg=BACKGROUNDS.find(
        b=>b.id===state.profileBackground
    );

    const hero=document.getElementById(
        "profileHero"
    );

    if(bg&&hero){
        hero.style.background=bg.css;
    }

    setText(
        "profileBest",
        state.stats.highestRarity||"Common"
    );

    renderProfileCustomization();
    renderTitles();
    renderProfileCards();
}

function renderProfileCustomization(){

    const select=
        document.getElementById(
            "profileBackgroundSelect"
        );

    if(select){

        select.innerHTML=
            state.ownedBackgrounds
            .map(id=>{

                const bg=BACKGROUNDS.find(
                    b=>b.id===id
                );

                return`
                <option
                    value="${bg.id}"
                    ${bg.id===state.profileBackground?
                    "selected":""}>
                    ${bg.name}
                </option>
                `;

            }).join("");
    }

    const avatar=
        document.getElementById("avatarSelect");

    if(avatar)avatar.value=state.avatar;
}

function setProfileBackground(id){

    if(!state.ownedBackgrounds.includes(id)){
        toast("You don't own that background.");
        return;
    }

    state.profileBackground=id;

    saveGame();
    renderProfile();

    toast("Profile background equipped.");
}

function setAvatar(value){

    state.avatar=value;

    saveGame();
    renderAll();
}

function renderProfileCards(){

    const grid=
        document.getElementById(
            "profileCardsGrid"
        );

    if(!grid)return;

    if(!state.cards.length){

        grid.innerHTML=`
            <div class="empty-state">
                Open some packs first.
            </div>
        `;

        return;
    }

    grid.innerHTML=
        state.cards.map(card=>{

            const frame=
                FRAMES.find(
                    f=>f.id===card.frame
                )||FRAMES[0];

            return`
            <div class="profile-card-mini">

                <div class="mini-card-art ${frame.css}">
                    ${playerEmoji(card)}
                </div>

                <b>${escapeHTML(card.player)}</b>

                <select
                    onchange=
                    "setCardFrame('${card.id}',this.value)">

                    ${state.ownedFrames.map(id=>{

                        const f=
                            FRAMES.find(
                                x=>x.id===id
                            );

                        return`
                        <option
                            value="${f.id}"
                            ${f.id===card.frame?
                            "selected":""}>
                            ${f.name}
                        </option>
                        `;

                    }).join("")}

                </select>

            </div>
            `;

        }).join("");
}

function setCardFrame(cardId,frameId){

    const card=state.cards.find(
        c=>c.id===cardId
    );

    if(!card)return;

    if(!state.ownedFrames.includes(frameId)){
        toast("You don't own that frame.");
        return;
    }

    card.frame=frameId;

    saveGame();
    renderProfile();

    toast("Card frame equipped.");
}

/* =========================================================
   TITLES
   ========================================================= */

const TITLES=[
{
id:"collector",
name:"Football Collector",
requirement:"Start the game",
unlock:()=>state.initialized
},
{
id:"messi",
name:"The Greatest",
requirement:"Own Lionel Messi",
unlock:()=>ownsPlayer("Lionel Messi")
},
{
id:"ronaldo",
name:"The King",
requirement:"Own Cristiano Ronaldo",
unlock:()=>ownsPlayer("Cristiano Ronaldo")
},
{
id:"world",
name:"World Class Hunter",
requirement:"Pull a World Class card",
unlock:()=>state.stats.worldClass>0
},
{
id:"legend",
name:"Legend Collector",
requirement:"Own 5 Legendary+ cards",
unlock:()=>state.cards.filter(
c=>(RARITY_ORDER[c.rarity]||0)>=5
).length>=5
},
{
id:"champion",
name:"Season 1 Champion",
requirement:"Reach 1000 tournament score",
unlock:()=>state.stats.tournamentScore>=1000
}
];

function ownsPlayer(name){

    return state.cards.some(
        c=>c.player===name
    );
}

function renderTitles(){

    const container=
        document.getElementById("titleList");

    if(!container)return;

    container.innerHTML=
        TITLES.map(title=>{

            const unlocked=title.unlock();

            return`
            <div
                class="title ${unlocked?"unlocked":""}"
                title="${escapeHTML(title.requirement)}">

                ${unlocked?"✓":"🔒"}
                ${title.name}

            </div>
            `;

        }).join("");
}

function changeName(){

    const newName=prompt(
        "Choose your new player name:",
        state.name
    );

    if(!newName)return;

    const name=newName.trim();

    if(name.length<3){
        toast("Name must be at least 3 characters.");
        return;
    }

    if(!/^[a-zA-Z0-9 _-]+$/.test(name)){
        toast("Invalid name.");
        return;
    }

    const names=JSON.parse(
        localStorage.getItem(NAMES_KEY)||"[]"
    );

    const lower=name.toLowerCase();

    if(
        names.includes(lower)&&
        lower!==state.name.toLowerCase()
    ){
        toast("That name is already used on this device.");
        return;
    }

    const old=state.name.toLowerCase();
    const index=names.indexOf(old);

    if(index>=0)names.splice(index,1);

    names.push(lower);

    localStorage.setItem(
        NAMES_KEY,
        JSON.stringify(names)
    );

    state.name=name;

    saveGame();
    renderAll();

    toast("Name changed.");
}

/* =========================================================
   STATISTICS
   ========================================================= */

function renderStatistics(){

    const s=state.stats;

    const data=[
        ["Level",state.level,"Current level"],
        ["Playtime",formatPlaytime(s.playtime),"Time played"],
        ["Packs Opened",s.packsOpened,"Packs opened"],
        ["Cards Pulled",s.cardsPulled,"Cards obtained"],
        ["Cards Owned",state.cards.length,"Collection"],
        ["Duplicates",s.duplicates,"Duplicate pulls"],
        ["Cards Sold",s.cardsSold,"Cards sold"],
        ["Coins Earned",s.coinsEarned,"Lifetime"],
        ["Coins Spent",s.coinsSpent,"Lifetime"],
        ["Common",s.common,"Pulled"],
        ["Uncommon",s.uncommon,"Pulled"],
        ["Rare",s.rare,"Pulled"],
        ["Epic",s.epic,"Pulled"],
        ["Legendary",s.legendary,"Pulled"],
        ["Mythic",s.mythic,"Pulled"],
        ["Secret",s.secret,"Pulled"],
        ["World Class",s.worldClass,"Pulled"],
        ["Limited",s.limited,"Pulled"],
        ["Highest Rating",s.highestRating,"Best rating"],
        ["Best Rarity",s.highestRarity,"Best rarity"],
        ["Tournament Entries",s.tournamentEntries,"Entries"]
    ];

    const grid=
        document.getElementById(
            "statisticsGrid"
        );

    if(!grid)return;

    grid.innerHTML=
        data.map(x=>`
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

function setMissionType(type){

    currentMissionType=type;

    document.querySelectorAll(
        ".mission-tab"
    ).forEach(tab=>{
        tab.classList.toggle(
            "active",
            tab.textContent.toLowerCase()===type
        );
    });

    renderMissions();
}

function renderMissions(){

    const missions=
        MISSION_TEMPLATES[currentMissionType];

    const progress=
        state.missionProgress[currentMissionType];

    const claimed=
        state.missionClaimed[currentMissionType];

    const list=
        document.getElementById("missionList");

    if(!list)return;

    list.innerHTML=
        missions.map((mission,i)=>{

            const amount=
                progress[i]||0;

            const max=mission[1];

            const percent=Math.min(
                100,
                amount/max*100
            );

            return`
            <div class="mission ${claimed[i]?"completed":""}">

                <div class="mission-top">
                    <b>${mission[0]}</b>
                    <span>+${mission[2]} 🪙</span>
                </div>

                <p>
                    ${Math.min(amount,max)} / ${max}
                </p>

                <div class="mission-progress">
                    <i style="width:${percent}%"></i>
                </div>

                ${
                    amount>=max&&!claimed[i]
                    ?
                    `<button
                        class="primary-btn"
                        style="margin-top:10px"
                        onclick=
                        "claimMission('${currentMissionType}',${i})">
                        Claim
                    </button>`
                    :
                    claimed[i]
                    ?
                    `<p>✓ Completed</p>`
                    :""
                }

            </div>
            `;

        }).join("");
}

function progressMission(type,amount){

    const missions=MISSION_TEMPLATES[type];

    if(!missions)return;

    missions.forEach((mission,i)=>{

        const kind=mission[3];

        if(
            kind==="packs"||
            kind==="cards"||
            kind==="coins"
        ){
            state.missionProgress[type][i]+=amount;
        }
    });

    saveGame();
}

function claimMission(type,index){

    const mission=
        MISSION_TEMPLATES[type][index];

    const progress=
        state.missionProgress[type][index];

    if(progress<mission[1])return;

    if(state.missionClaimed[type][index]){
        return;
    }

    state.missionClaimed[type][index]=true;

    addCoins(mission[2]);
    addXP(
        Math.min(
            50,
            Math.floor(mission[2]/2)
        )
    );

    saveGame();
    renderMissions();

    toast(
        `Mission complete: +${mission[2]} coins!`
    );
}

function checkMissionResets(){

    const now=Date.now();

    const durations={
        hourly:3600000,
        daily:86400000,
        weekly:604800000,
        monthly:2592000000
    };

    for(const type in durations){

        if(
            now-state.missionReset[type]>=
            durations[type]
        ){

            state.missionReset[type]=now;

            state.missionProgress[type]=
                [0,0,0];

            state.missionClaimed[type]=
                [false,false,false];

            saveGame();
        }
    }
}

/* =========================================================
   LIMITED
   ========================================================= */

function startLimitedEvent(){

    if(!state.limitedStart){
        state.limitedStart=Date.now();
        saveGame();
    }
}

function isLimitedActive(){

    if(!state.limitedStart)return false;

    return(
        Date.now()-state.limitedStart<
        604800000
    );
}

function updateLimitedTimer(){

    const timer=
        document.getElementById(
            "limitedTimer"
        );

    if(!timer)return;

    if(!isLimitedActive()){
        timer.textContent="ENDED";
        return;
    }

    timer.textContent=
        formatCountdown(
            604800000-
            (Date.now()-state.limitedStart)
        );
}

/* =========================================================
   TOURNAMENT
   ========================================================= */

function startTournament(){

    if(!state.tournamentStart){
        state.tournamentStart=Date.now();
        saveGame();
    }
}

function updateTournamentTimer(){

    const timer=
        document.getElementById(
            "tournamentTimer"
        );

    if(!timer)return;

    const duration=604800000;

    const remaining=
        duration-
        (Date.now()-state.tournamentStart);

    if(remaining<=0){
        timer.textContent="SEASON ENDED";
        return;
    }

    timer.textContent=
        formatCountdown(remaining);
}

function enterTournament(){

    state.stats.tournamentEntries++;

    const score=Math.floor(
        state.level*10+
        state.cards.length*2+
        state.stats.worldClass*100
    );

    state.stats.tournamentScore+=score;

    addXP(25);

    saveGame();

    toast(
        `🏆 Tournament entry! +${score} score.`
    );

    renderTournament();
}

function renderTournament(){

    const score=
        state.stats.tournamentScore;

    const rows=[
        ["1",state.name||"Football Collector",score],
        ["2","Rising Striker",Math.max(850,score-100)],
        ["3","Card Hunter",Math.max(700,score-180)],
        ["4","Legend Seeker",650],
        ["5","Pitch Master",500]
    ];

    const el=
        document.getElementById(
            "tournamentLeaderboard"
        );

    if(!el)return;

    el.innerHTML=
        rows.map(r=>`
            <div class="rank-row">
                <b>#${r[0]}</b>
                <strong>${escapeHTML(r[1])}</strong>
                <span>${r[2]} pts</span>
            </div>
        `).join("");
}

/* =========================================================
   ONLINE
   ========================================================= */

async function checkOnline(){

    const status=
        document.getElementById(
            "onlineStatus"
        );

    if(!status)return;

    if(!ONLINE_API){

        status.textContent=
            "● Local mode · Online backend not configured";

        return;
    }

    try{

        const response=
            await fetch(
                `${ONLINE_API}/health`,
                {method:"GET"}
            );

        if(!response.ok)throw new Error();

        status.textContent=
            "● Online · Server connected";

    }catch(e){

        status.textContent=
            "● Offline · Local mode active";
    }
}

async function getOnlineLeaderboard(){

    if(!ONLINE_API)return null;

    try{

        const response=
            await fetch(
                `${ONLINE_API}/leaderboard`
            );

        if(!response.ok)throw new Error();

        return await response.json();

    }catch(e){

        return null;
    }
}

async function submitOnlineScore(){

    if(!ONLINE_API)return;

    try{

        await fetch(
            `${ONLINE_API}/leaderboard`,
            {
                method:"POST",
                headers:{
                    "Content-Type":
                        "application/json"
                },
                body:JSON.stringify({
                    name:state.name,
                    level:state.level,
                    cards:state.cards.length,
                    worldClass:state.stats.worldClass
                })
            }
        );

    }catch(e){
        console.warn(
            "Online score submission failed."
        );
    }
}

/* =========================================================
   LEADERBOARD
   ========================================================= */

async function renderLeaderboard(){

    const container=
        document.getElementById(
            "globalLeaderboard"
        );

    if(!container)return;

    container.innerHTML=
        `<div class="empty-state">
            Loading leaderboard...
        </div>`;

    const online=
        await getOnlineLeaderboard();

    if(online&&Array.isArray(online)){

        online.sort(
            (a,b)=>b.level-a.level
        );

        container.innerHTML=
            online.slice(0,25).map((e,i)=>`
                <div class="rank-row">
                    <b>#${i+1}</b>
                    <strong>${escapeHTML(e.name)}</strong>
                    <span>
                        Lv.${e.level} ·
                        ${e.cards} cards ·
                        ${e.worldClass||0} WC
                    </span>
                </div>
            `).join("");

        return;
    }

    const entries=[
        {
            name:state.name||"Football Collector",
            level:state.level,
            cards:state.cards.length,
            world:state.stats.worldClass
        },
        {
            name:"CardMaster",
            level:42,
            cards:183,
            world:8
        },
        {
            name:"PitchKing",
            level:36,
            cards:154,
            world:5
        },
        {
            name:"LegendHunter",
            level:29,
            cards:121,
            world:3
        },
        {
            name:"FootballFan",
            level:21,
            cards:94,
            world:1
        }
    ];

    entries.sort(
        (a,b)=>b.level-a.level
    );

    container.innerHTML=
        entries.map((e,i)=>`
            <div class="rank-row">
                <b>#${i+1}</b>
                <strong>${escapeHTML(e.name)}</strong>
                <span>
                    Lv.${e.level} ·
                    ${e.cards} cards ·
                    ${e.world} WC
                </span>
            </div>
        `).join("");
}

/* =========================================================
   TIMERS
   ========================================================= */

function updateTimers(){

    updateLimitedTimer();
    updateTournamentTimer();
    updateDailyReward();
    updateFreeKick();
}

function formatCountdown(ms){

    if(ms<=0)return"ENDED";

    let total=
        Math.floor(ms/1000);

    const days=
        Math.floor(total/86400);

    total%=86400;

    const hours=
        Math.floor(total/3600);

    total%=3600;

    const mins=
        Math.floor(total/60);

    const secs=
        total%60;

    return`${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

function pad(num){
    return String(num).padStart(2,"0");
}

/* =========================================================
   RESET
   ========================================================= */

function resetGame(){

    if(!confirm(
        "Are you sure? This permanently deletes your Football Cards progress."
    ))return;

    localStorage.removeItem(SAVE_KEY);

    location.reload();
}

/* =========================================================
   UTILITIES
   ========================================================= */

function escapeHTML(value){

    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

/* =========================================================
   AUTO START
   ========================================================= */

if(state.initialized){

    startLimitedEvent();
    startTournament();
}

renderAll();
