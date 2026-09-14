const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 10000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

const ALUCARD_USER = {
    username: "Alucard",
    password: "Unidentified67",
    saveData: {
        name: "Alucard",
        accountUser: "Alucard",
        coins: 270000,
        xp: 3500,
        level: 7,
        equippedTitle: "UNIQUE",
        grantedTitles: ["UNIQUE", "Owner", "Admin", "Season 1 Champion"],
        isGrantedAdmin: true,
        cards: [
            {
                id: "alucard_mk_1",
                player: "Monkey King",
                position: "ST",
                rarity: "Developer",
                rating: 99,
                devCard: true,
                image: "monkey_king.png",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_mk_2",
                player: "Monkey King",
                position: "ST",
                rarity: "Developer",
                rating: 99,
                devCard: true,
                image: "monkey_king.png",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_messi_wc1",
                player: "Lionel Messi",
                position: "RW",
                rarity: "World Class",
                rating: 99,
                serialNumber: 1,
                maxSerial: 10,
                image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_ronaldo_wc1",
                player: "Cristiano Ronaldo",
                position: "ST",
                rarity: "World Class",
                rating: 99,
                serialNumber: 1,
                maxSerial: 10,
                image: "ronaldo_custom.png",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_emanuel_tourn",
                player: "Emanuel",
                position: "CAM",
                rarity: "Tournament",
                rating: 99,
                image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now(),
                locked: true
            },
            {
                id: "alucard_haaland_sec",
                player: "Erling Haaland",
                position: "ST",
                rarity: "Secret",
                rating: 98,
                image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_mbappe_sec",
                player: "Kylian Mbappé",
                position: "ST",
                rarity: "Secret",
                rating: 97,
                image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_vini_myth",
                player: "Vinícius Júnior",
                position: "LW",
                rarity: "Mythic",
                rating: 95,
                image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_jude_myth",
                player: "Jude Bellingham",
                position: "CAM",
                rarity: "Mythic",
                rating: 94,
                image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            },
            {
                id: "alucard_kdb_leg",
                player: "Kevin De Bruyne",
                position: "CM",
                rarity: "Legendary",
                rating: 93,
                image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60",
                obtained: Date.now()
            }
        ],
        stats: {
            playtime: 3600,
            packsOpened: 150,
            cardsPulled: 200,
            duplicates: 30,
            cardsSold: 20,
            coinsEarned: 270000,
            coinsSpent: 10000,
            tournamentScore: 850
        }
    },
    createdAt: Date.now(),
    lastActive: Date.now()
};

let database = {
    users: {
        "alucard": ALUCARD_USER
    },
    trades: [],
    leaderboard: {}
};

const HARD_WIPE_VERSION = "v25_season1_launch_reset";

function saveDatabase() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), "utf-8");
    } catch (e) {
        console.error("Error saving database:", e);
    }
}

function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
            if (raw && raw.wipeVersion === HARD_WIPE_VERSION && raw.users) {
                database = raw;
                database.users = database.users || {};
                database.trades = database.trades || [];
                database.tradeSessions = database.tradeSessions || {};
                database.auditLogs = database.auditLogs || {};
                database.backups = database.backups || {};
                if (!database.users["alucard"]) {
                    database.users["alucard"] = ALUCARD_USER;
                }
                return;
            }
        }
    } catch (e) {
        console.error("Error loading database:", e);
    }

    // Official Season 1 Clean Launch Reset
    database = {
        wipeVersion: HARD_WIPE_VERSION,
        users: {
            "alucard": JSON.parse(JSON.stringify(ALUCARD_USER))
        },
        trades: [],
        tradeSessions: {},
        auditLogs: {},
        backups: {},
        leaderboard: {}
    };
    saveDatabase();
}

loadDatabase();

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml; charset=utf-8",
    ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Helper to send JSON
    const sendJSON = (statusCode, data) => {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    };

    // Helper to read body
    const getBody = (callback) => {
        let body = "";
        req.on("data", chunk => { body += chunk.toString(); });
        req.on("end", () => {
            try {
                const parsed = body ? JSON.parse(body) : {};
                callback(null, parsed);
            } catch (e) {
                callback(e, null);
            }
        });
    };

    // API Routes
    if (pathname === "/api/health" && req.method === "GET") {
        return sendJSON(200, { status: "online", time: Date.now(), usersCount: Object.keys(database.users || {}).length });
    }

    if ((pathname === "/api/auth/register" || pathname === "/api/auth/signup") && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.password) return sendJSON(400, { success: false, error: "Invalid data" });
            const key = body.username.trim().toLowerCase();
            if (database.users[key]) return sendJSON(409, { success: false, error: "Username already taken" });
            database.users[key] = {
                username: body.username.trim(),
                password: body.password,
                saveData: body.initialData || {},
                createdAt: Date.now(),
                lastActive: Date.now()
            };
            saveDatabase();
            return sendJSON(200, { success: true, message: "Registered", user: { username: body.username.trim() } });
        });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.password) return sendJSON(400, { success: false, error: "Please provide both username and password." });
            const key = body.username.trim().toLowerCase();
            const user = database.users[key];
            if (!user) {
                return sendJSON(404, { success: false, error: "Username does not exist. Please click Sign Up to create this account." });
            }
            if (user.password !== body.password) {
                return sendJSON(401, { success: false, error: "Incorrect password. Please try again." });
            }
            user.lastActive = Date.now();
            saveDatabase();
            return sendJSON(200, { success: true, user: { username: user.username, saveData: user.saveData } });
        });
    }

    
    // Audit Transaction Log Endpoint
    if (pathname === "/api/audit/log" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.action) return sendJSON(400, { success: false });
            const key = body.username.trim().toLowerCase();
            database.auditLogs = database.auditLogs || {};
            database.auditLogs[key] = database.auditLogs[key] || [];
            database.auditLogs[key].unshift({
                timestamp: Date.now(),
                action: body.action,
                details: body.details || {},
                snapshot: body.snapshot || {}
            });
            if (database.auditLogs[key].length > 200) {
                database.auditLogs[key] = database.auditLogs[key].slice(0, 200);
            }
            saveDatabase();
            return sendJSON(200, { success: true });
        });
    }

    if (pathname === "/api/audit/history" && req.method === "GET") {
        const username = parsedUrl.query.username;
        if (!username) return sendJSON(400, { success: false, error: "Username required" });
        const key = username.trim().toLowerCase();
        database.auditLogs = database.auditLogs || {};
        return sendJSON(200, { success: true, logs: database.auditLogs[key] || [] });
    }

    if (pathname === "/api/save" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.username || !body.saveData) return sendJSON(400, { success: false, error: "Invalid data" });
            const key = body.username.trim().toLowerCase();
            database.backups = database.backups || {};
            
            let incoming = body.saveData;
            if (typeof incoming === "string") {
                try { incoming = JSON.parse(incoming); } catch(e) {}
            }

            if (!database.users[key]) {
                database.users[key] = { username: body.username.trim(), password: "", saveData: incoming, lastActive: Date.now() };
            } else {
                const existing = database.users[key].saveData || {};
                
                // If incoming save has 0 cards but server has master cards, protect server cards from blank device saves
                if (key === "alucard") {
                    incoming.isGrantedAdmin = true;
                    incoming.equippedTitle = incoming.equippedTitle || existing.equippedTitle || "UNIQUE";
                    incoming.grantedTitles = ["UNIQUE", "Owner", "Admin", "Season 1 Champion"];
                    if ((!incoming.cards || incoming.cards.length === 0) && Array.isArray(existing.cards) && existing.cards.length > 0) {
                        incoming.cards = existing.cards;
                    }
                    if ((!incoming.coins || Number(incoming.coins) < 1000) && Number(existing.coins) >= 1000) {
                        incoming.coins = existing.coins;
                    }
                }

                if (database.users[key].saveData) {
                    database.backups[key] = database.backups[key] || [];
                    database.backups[key].unshift({
                        timestamp: Date.now(),
                        saveData: database.users[key].saveData
                    });
                    if (database.backups[key].length > 15) database.backups[key].pop();
                }
                incoming.lastSave = Date.now();
                database.users[key].saveData = incoming;
                database.users[key].lastActive = Date.now();
            }
            saveDatabase();
            return sendJSON(200, { success: true });
        });
    }

    if (pathname === "/api/user/history" && req.method === "GET") {
        const username = parsedUrl.query.username;
        if (!username) return sendJSON(400, { success: false, error: "Username required" });
        const key = String(username).trim().toLowerCase();
        database.backups = database.backups || {};
        const backups = database.backups[key] || [];
        const currentUser = database.users[key];
        return sendJSON(200, {
            success: true,
            current: currentUser ? currentUser.saveData : null,
            backups: backups
        });
    }

    if (pathname === "/api/save" && req.method === "GET") {
        const username = parsedUrl.query.username;
        if (!username) return sendJSON(400, { success: false, error: "Username required" });
        const key = String(username).trim().toLowerCase();
        const user = database.users[key];
        if (!user) return sendJSON(404, { success: false, error: "User not found" });
        return sendJSON(200, { success: true, saveData: user.saveData });
    }

    if (pathname === "/api/users" && req.method === "GET") {
        const summary = {};
        for (const k in database.users) {
            const u = database.users[k];
            summary[k] = { username: u.username, lastActive: u.lastActive, saveData: u.saveData };
        }
        return sendJSON(200, { success: true, users: summary });
    }

    // ==================== TRADING REST API ====================
    if (pathname === "/api/trade/request" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.sender || !body.receiver) return sendJSON(400, { success: false, error: "Invalid trade request" });
            const sKey = String(body.sender).trim().toLowerCase();
            const rKey = String(body.receiver).trim().toLowerCase();
            if (sKey === rKey) return sendJSON(400, { success: false, error: "Cannot trade with yourself" });
            if (!database.users[rKey]) return sendJSON(404, { success: false, error: "Recipient user not found on server" });

            const tradeId = body.id || ("tr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7));
            const tradeReq = {
                id: tradeId,
                sender: database.users[sKey] ? database.users[sKey].username : body.sender,
                receiver: database.users[rKey].username,
                senderTitle: body.senderTitle || "Collector",
                senderLevel: Number(body.senderLevel || 1),
                status: "pending",
                timestamp: Date.now()
            };

            database.trades = database.trades || [];
            // Remove expired or duplicate requests
            database.trades = database.trades.filter(t => t.id !== tradeId && (Date.now() - t.timestamp < 300000));
            database.trades.push(tradeReq);
            saveDatabase();
            return sendJSON(200, { success: true, trade: tradeReq });
        });
    }

    if (pathname === "/api/trade/pending" && req.method === "GET") {
        const username = parsedUrl.query.username;
        if (!username) return sendJSON(400, { success: false, error: "Username required" });
        const key = String(username).trim().toLowerCase();
        database.trades = database.trades || [];
        // Filter pending trades for this user created in the last 5 minutes
        const pending = database.trades.filter(t => 
            (t.receiver.toLowerCase() === key || t.sender.toLowerCase() === key) && 
            (Date.now() - t.timestamp < 300000)
        );
        return sendJSON(200, { success: true, trades: pending });
    }

    if (pathname === "/api/trade/respond" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.id || !body.action) return sendJSON(400, { success: false, error: "Invalid trade response" });
            database.trades = database.trades || [];
            database.tradeSessions = database.tradeSessions || {};
            const trade = database.trades.find(t => t.id === body.id);
            if (!trade) return sendJSON(404, { success: false, error: "Trade request expired or not found" });

            const action = body.action.toLowerCase();
            if (action === "accept") {
                trade.status = "session_active";
                const p1 = trade.sender.toLowerCase();
                const p2 = trade.receiver.toLowerCase();
                database.tradeSessions[trade.id] = {
                    id: trade.id,
                    sender: trade.sender,
                    receiver: trade.receiver,
                    offers: { [p1]: [], [p2]: [] },
                    ready: { [p1]: false, [p2]: false },
                    chat: [
                        { sender: "System", text: `Trade room connected! Add cards to your slots or chat.`, time: Date.now() }
                    ],
                    status: "active",
                    updatedAt: Date.now()
                };
                saveDatabase();
                return sendJSON(200, { success: true, status: "session_active", session: database.tradeSessions[trade.id] });
            } else if (action === "decline") {
                trade.status = "declined";
                if (database.tradeSessions[trade.id]) database.tradeSessions[trade.id].status = "declined";
                saveDatabase();
                return sendJSON(200, { success: true, status: "declined" });
            } else if (action === "block") {
                trade.status = "blocked";
                if (database.tradeSessions[trade.id]) database.tradeSessions[trade.id].status = "blocked";
                saveDatabase();
                return sendJSON(200, { success: true, status: "blocked" });
            }
            return sendJSON(400, { success: false, error: "Unknown action" });
        });
    }

    if (pathname === "/api/trade/session" && req.method === "GET") {
        const id = parsedUrl.query.id;
        if (!id) return sendJSON(400, { success: false, error: "Session ID required" });
        database.tradeSessions = database.tradeSessions || {};
        const session = database.tradeSessions[id];
        if (!session) return sendJSON(404, { success: false, error: "Session not found" });
        return sendJSON(200, { success: true, session });
    }

    if (pathname === "/api/trade/session/update" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.id || !body.username) return sendJSON(400, { success: false, error: "Invalid update" });
            database.tradeSessions = database.tradeSessions || {};
            const session = database.tradeSessions[body.id];
            if (!session) return sendJSON(404, { success: false, error: "Session not found" });

            const uKey = String(body.username).trim().toLowerCase();
            session.offers = session.offers || {};
            session.ready = session.ready || {};

            if (Array.isArray(body.offer)) {
                session.offers[uKey] = body.offer;
                // If offer changed, reset both users' ready states for safety
                session.ready = { [session.sender.toLowerCase()]: false, [session.receiver.toLowerCase()]: false };
            }
            if (body.ready !== undefined) {
                session.ready[uKey] = !!body.ready;
            }
            if (body.chatMessage && typeof body.chatMessage === "string" && body.chatMessage.trim()) {
                session.chat = session.chat || [];
                session.chat.push({
                    sender: body.username,
                    text: body.chatMessage.trim(),
                    time: Date.now()
                });
                if (session.chat.length > 50) session.chat = session.chat.slice(-50);
            }

            session.updatedAt = Date.now();
            saveDatabase();
            return sendJSON(200, { success: true, session });
        });
    }

    if (pathname === "/api/trade/session/cancel" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.id) return sendJSON(400, { success: false, error: "Session ID required" });
            database.tradeSessions = database.tradeSessions || {};
            const session = database.tradeSessions[body.id];
            if (session) {
                session.status = "cancelled";
                session.updatedAt = Date.now();
            }
            database.trades = database.trades || [];
            const trade = database.trades.find(t => t.id === body.id);
            if (trade) trade.status = "cancelled";
            saveDatabase();
            return sendJSON(200, { success: true });
        });
    }

    if (pathname === "/api/trade/session/complete" && req.method === "POST") {
        return getBody((err, body) => {
            if (err || !body.id) return sendJSON(400, { success: false, error: "Session ID required" });
            database.tradeSessions = database.tradeSessions || {};
            const session = database.tradeSessions[body.id];
            if (!session) return sendJSON(404, { success: false, error: "Session not found" });
            if (session.status === "completed") {
                return sendJSON(200, { success: true, alreadyCompleted: true, session });
            }

            const u1Key = session.sender.toLowerCase();
            const u2Key = session.receiver.toLowerCase();
            const u1 = database.users[u1Key];
            const u2 = database.users[u2Key];

            if (u1 && u2 && session.offers) {
                const u1Offer = Array.isArray(session.offers[u1Key]) ? session.offers[u1Key] : [];
                const u2Offer = Array.isArray(session.offers[u2Key]) ? session.offers[u2Key] : [];

                let sData1 = typeof u1.saveData === "string" ? JSON.parse(u1.saveData) : (u1.saveData || {});
                let sData2 = typeof u2.saveData === "string" ? JSON.parse(u2.saveData) : (u2.saveData || {});
                sData1.cards = Array.isArray(sData1.cards) ? sData1.cards : [];
                sData2.cards = Array.isArray(sData2.cards) ? sData2.cards : [];

                const u1OfferedIds = new Set(u1Offer.map(c => c.id));
                const u2OfferedIds = new Set(u2Offer.map(c => c.id));

                // Remove offered cards
                sData1.cards = sData1.cards.filter(c => !u1OfferedIds.has(c.id));
                sData2.cards = sData2.cards.filter(c => !u2OfferedIds.has(c.id));

                // Add received cards with fresh IDs and obtained timestamp
                u2Offer.forEach(c => {
                    sData1.cards.push({ ...c, id: "card_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7), obtained: Date.now() });
                });
                u1Offer.forEach(c => {
                    sData2.cards.push({ ...c, id: "card_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7), obtained: Date.now() });
                });

                u1.saveData = sData1;
                u2.saveData = sData2;

                // Log audit for both users
                database.auditLogs = database.auditLogs || {};
                database.auditLogs[u1Key] = database.auditLogs[u1Key] || [];
                database.auditLogs[u1Key].unshift({
                    timestamp: Date.now(),
                    action: "TRADE_COMPLETED",
                    details: { partner: session.receiver, given: u1Offer.length, received: u2Offer.length }
                });
                database.auditLogs[u2Key] = database.auditLogs[u2Key] || [];
                database.auditLogs[u2Key].unshift({
                    timestamp: Date.now(),
                    action: "TRADE_COMPLETED",
                    details: { partner: session.sender, given: u2Offer.length, received: u1Offer.length }
                });
            }

            session.status = "completed";
            session.updatedAt = Date.now();
            saveDatabase();
            return sendJSON(200, { success: true, session });
        });
    }

const SERVER_CARD_VALUES = {
    Common: 10,
    Uncommon: 25,
    Rare: 75,
    Epic: 200,
    Legendary: 600,
    Exclusive: 800,
    Mythic: 2500,
    Secret: 6000,
    Tournament: 10000,
    "World Class": 25000,
    Developer: 50000
};

function calculateServerCollectionValue(cards) {
    if (!Array.isArray(cards)) return 0;
    return cards.reduce((sum, c) => {
        if (!c) return sum;
        if (c.serialNumber) {
            const serialNum = Math.max(1, Math.min(10, Number(c.serialNumber) || 1));
            return sum + (55000 - serialNum * 2500);
        }
        return sum + (SERVER_CARD_VALUES[c.rarity] || 10);
    }, 0);
}

    if ((pathname === "/api/user/delete" || pathname === "/api/user") && (req.method === "POST" || req.method === "DELETE")) {
        return getBody((err, body) => {
            const rawTarget = (body && body.username) || parsedUrl.query.username;
            if (!rawTarget) return sendJSON(400, { success: false, error: "Username required" });
            const key = String(rawTarget).trim().toLowerCase();
            if (key === "alucard") return sendJSON(403, { success: false, error: "Cannot delete owner account" });
            if (database.users[key]) {
                delete database.users[key];
            }
            if (database.backups && database.backups[key]) {
                delete database.backups[key];
            }
            saveDatabase();
            return sendJSON(200, { success: true, message: `Account ${rawTarget} deleted permanently.` });
        });
    }

    if (pathname === "/api/leaderboard" && req.method === "GET") {
        const list = [];
        for (const k in database.users) {
            const u = database.users[k];
            let pData = {};
            try { pData = typeof u.saveData === "string" ? JSON.parse(u.saveData) : (u.saveData || {}); } catch (e) {}
            const cardsArr = Array.isArray(pData.cards) ? pData.cards : [];
            const colVal = (pData.collectionValue !== undefined && Number(pData.collectionValue) > 0)
                ? Number(pData.collectionValue)
                : calculateServerCollectionValue(cardsArr);
            const tScore = Number((pData.stats && pData.stats.tournamentScore) || pData.tournamentScore || 0);
            const tWins = Number((pData.stats && pData.stats.tournamentWins) || pData.tournamentWins || 0);
            list.push({
                username: u.username,
                name: pData.name || u.username,
                level: Number(pData.level || 1),
                cards: cardsArr.length,
                gold: Number(pData.coins || 100),
                value: colVal,
                tournamentScore: tScore,
                tournamentWins: tWins,
                equippedTitle: pData.equippedTitle || "Collector",
                profileFrame: pData.profileFrame || "default",
                avatar: pData.avatar || "player_temp.png",
                isTradeBanned: !!pData.isTradeBanned
            });
        }
        list.sort((a, b) => b.level - a.level || b.value - a.value);
        return sendJSON(200, { success: true, leaderboard: list });
    }

    // Static Files Serving (Cross-platform POSIX / Windows path normalization)
    const cleanPath = (pathname === "/" || !pathname) ? "index.html" : pathname.replace(/^\/+/, "");
    let filePath = path.join(__dirname, cleanPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(__dirname, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end("Server Error");
        } else {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`[Football Cards Server] Listening on 0.0.0.0:${PORT}`);
});