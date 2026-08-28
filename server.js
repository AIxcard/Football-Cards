/**
 * =========================================================
 * FOOTBALL CARDS TCG โ€” DEDICATED NODE.JS SERVER BACKEND
 * Persistent Database Storage, Auth, Cloud Saves, Trading & Leaderboard
 * =========================================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const url = require("url");

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");

// Ensure data directory and JSON stores exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FILES = {
    users: path.join(DATA_DIR, "users.json"),
    saves: path.join(DATA_DIR, "saves.json"),
    trades: path.join(DATA_DIR, "trades.json"),
    leaderboard: path.join(DATA_DIR, "leaderboard.json")
};

function readJSON(file, fallback = {}) {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify(fallback, null, 2), "utf8");
            return fallback;
        }
        const raw = fs.readFileSync(file, "utf8");
        return JSON.parse(raw);
    } catch (e) {
        console.error(`Error reading ${file}:`, e);
        return fallback;
    }
}

function writeJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
        return true;
    } catch (e) {
        console.error(`Error writing ${file}:`, e);
        return false;
    }
}

// In-memory active tokens: token -> { username, expires }
const activeSessions = new Map();

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function createToken(username) {
    const token = crypto.randomBytes(32).toString("hex");
    activeSessions.set(token, {
        username: username.toLowerCase(),
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    return token;
}

function getSessionUser(req) {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token && activeSessions.has(token)) {
        const session = activeSessions.get(token);
        if (session.expires > Date.now()) {
            return session.username;
        } else {
            activeSessions.delete(token);
        }
    }
    return null;
}

const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav"
};

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
            if (body.length > 50 * 1024 * 1024) { // 50MB max payload
                req.connection.destroy();
                reject(new Error("Payload too large"));
            }
        });
        req.on("end", () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({});
            }
        });
        req.on("error", reject);
    });
}

// Server Request Router
const server = http.createServer(async (req, res) => {
    // Enable CORS for all requests
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        });
        return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // ==========================================
    // REST API ENDPOINTS
    // ==========================================

    // 1. Healthcheck
    if (pathname === "/api/health" && req.method === "GET") {
        const users = readJSON(FILES.users, {});
        const saves = readJSON(FILES.saves, {});
        const trades = readJSON(FILES.trades, []);
        return sendJSON(res, 200, {
            status: "online",
            serverTime: Date.now(),
            totalRegisteredUsers: Object.keys(users).length,
            activeTrades: Array.isArray(trades) ? trades.filter(t => t.status === "open").length : 0,
            version: "1.0.0 (Server-Side Persistent)"
        });
    }

    // 2. Auth: Sign Up
    if (pathname === "/api/auth/signup" && req.method === "POST") {
        const body = await parseBody(req);
        const username = (body.username || "").trim();
        const password = body.password || "";

        if (!username || username.length < 3 || username.length > 20) {
            return sendJSON(res, 400, { error: "Username must be between 3 and 20 characters." });
        }
        if (!password || password.length < 4) {
            return sendJSON(res, 400, { error: "Password must be at least 4 characters long." });
        }

        const key = username.toLowerCase();
        const users = readJSON(FILES.users, {});

        if (users[key]) {
            return sendJSON(res, 400, { error: "Username already taken. Please choose another." });
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const hash = hashPassword(password, salt);

        users[key] = {
            username: username,
            salt: salt,
            hash: hash,
            registeredAt: Date.now(),
            lastLogin: Date.now()
        };
        writeJSON(FILES.users, users);

        // Initialize user save data
        const saves = readJSON(FILES.saves, {});
        const isOwner = key === "alucard";
        const initialSave = {
            name: username,
            accountUser: username,
            coins: isOwner ? 999999999 : 250,
            level: 1,
            xp: 0,
            cards: [
                {
                    id: "starter_" + Date.now(),
                    player: "Marcus Rashford",
                    rating: 81,
                    pos: "LW",
                    rarity: "Uncommon",
                    image: "player_temp.png",
                    frame: "default",
                    locked: false,
                    obtained: Date.now()
                }
            ],
            stats: {
                packsOpened: 0,
                cardsPulled: 1,
                duplicates: 0,
                cardsSold: 0,
                coinsEarned: 250,
                coinsSpent: 0,
                highestRating: 81,
                highestRarity: "Uncommon",
                playtime: 0
            },
            unlockedCardNames: ["Marcus Rashford"],
            equippedTitle: isOwner ? "Owner" : "Collector",
            grantedTitles: isOwner ? ["Owner", "Admin", "Staff"] : [],
            isGrantedAdmin: isOwner,
            isGrantedStaff: isOwner,
            serializedCounts: { "Lionel Messi": 0, "Cristiano Ronaldo": 0 },
            redeemedCodes: [],
            lastSave: Date.now()
        };

        saves[key] = initialSave;
        writeJSON(FILES.saves, saves);

        // Update leaderboard
        updateLeaderboardEntry(username, initialSave);

        const token = createToken(username);
        return sendJSON(res, 200, {
            success: true,
            token: token,
            username: username,
            saveData: initialSave
        });
    }

    // 3. Auth: Log In
    if (pathname === "/api/auth/login" && req.method === "POST") {
        const body = await parseBody(req);
        const username = (body.username || "").trim();
        const password = body.password || "";

        if (!username || !password) {
            return sendJSON(res, 400, { error: "Please provide username and password." });
        }

        const key = username.toLowerCase();
        const users = readJSON(FILES.users, {});
        const user = users[key];

        if (!user) {
            return sendJSON(res, 400, { error: "User not found. Please register first." });
        }

        const checkHash = hashPassword(password, user.salt);
        if (checkHash !== user.hash) {
            return sendJSON(res, 400, { error: "Invalid password." });
        }

        user.lastLogin = Date.now();
        writeJSON(FILES.users, users);

        const saves = readJSON(FILES.saves, {});
        const saveData = saves[key] || { name: username, accountUser: username, coins: 250, cards: [] };

        const token = createToken(username);
        return sendJSON(res, 200, {
            success: true,
            token: token,
            username: user.username,
            saveData: saveData
        });
    }

    // 4. Game Save: GET (Fetch latest server save)
    if (pathname === "/api/save" && req.method === "GET") {
        const sessionUser = getSessionUser(req);
        const queryUser = (parsedUrl.query.username || "").toLowerCase();
        const target = sessionUser || queryUser;

        if (!target) {
            return sendJSON(res, 401, { error: "Unauthorized. Please log in." });
        }

        const saves = readJSON(FILES.saves, {});
        const saveData = saves[target];

        if (!saveData) {
            return sendJSON(res, 404, { error: "Save data not found." });
        }

        return sendJSON(res, 200, { success: true, saveData: saveData });
    }

    // 5. Game Save: POST (Persist save state to server disk)
    if (pathname === "/api/save" && req.method === "POST") {
        const body = await parseBody(req);
        const sessionUser = getSessionUser(req);
        const username = (body.username || sessionUser || "").toLowerCase();

        if (!username) {
            return sendJSON(res, 401, { error: "Unauthorized. Please log in." });
        }

        const saves = readJSON(FILES.saves, {});
        const incomingState = body.saveData || body;

        // Server-side safety checks
        if (incomingState && typeof incomingState === "object") {
            incomingState.accountUser = incomingState.accountUser || username;
            incomingState.name = incomingState.name || username;
            incomingState.lastSave = Date.now();

            saves[username] = incomingState;
            writeJSON(FILES.saves, saves);

            // Update leaderboard asynchronously
            updateLeaderboardEntry(incomingState.name || username, incomingState);

            return sendJSON(res, 200, { success: true, timestamp: Date.now() });
        }

        return sendJSON(res, 400, { error: "Invalid save payload." });
    }

    // 6. Global Leaderboard: GET
    if (pathname === "/api/leaderboard" && req.method === "GET") {
        const lb = readJSON(FILES.leaderboard, {});
        const list = Object.values(lb).sort((a, b) => (b.value || 0) - (a.value || 0));
        return sendJSON(res, 200, { success: true, leaderboard: list });
    }

    // 7. Public User Profile: GET /api/user/:username
    if (pathname.startsWith("/api/user/") && req.method === "GET") {
        const targetUsername = decodeURIComponent(pathname.replace("/api/user/", "")).toLowerCase().trim();
        const saves = readJSON(FILES.saves, {});
        const userSave = saves[targetUsername];

        if (!userSave) {
            return sendJSON(res, 404, { error: "Player not found." });
        }

        const publicProfile = {
            username: userSave.name || targetUsername,
            level: userSave.level || 1,
            totalCards: (userSave.cards || []).length,
            collectionValue: (userSave.cards || []).reduce((sum, c) => sum + (c.rating || 80) * 5, 0),
            equippedTitle: userSave.equippedTitle || "Collector",
            showcase: (userSave.showcase || []).map(id => (userSave.cards || []).find(c => c.id === id)).filter(Boolean),
            bannedUntil: userSave.bannedUntil || 0
        };

        return sendJSON(res, 200, { success: true, profile: publicProfile });
    }

    // 8. P2P Trades: GET /api/trades
    if (pathname === "/api/trades" && req.method === "GET") {
        const trades = readJSON(FILES.trades, []);
        const active = Array.isArray(trades) ? trades.filter(t => t.status === "open") : [];
        return sendJSON(res, 200, { success: true, trades: active });
    }

    // 9. P2P Trades: POST /api/trades/create
    if (pathname === "/api/trades/create" && req.method === "POST") {
        const body = await parseBody(req);
        const { sender, card, requestedRarity, requestedPos } = body;

        if (!sender || !card) {
            return sendJSON(res, 400, { error: "Invalid trade parameters." });
        }

        const trades = readJSON(FILES.trades, []);
        const newTrade = {
            id: "trade_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
            sender: sender,
            card: card,
            requestedRarity: requestedRarity || "Any",
            requestedPos: requestedPos || "Any",
            status: "open",
            createdAt: Date.now()
        };

        trades.unshift(newTrade);
        writeJSON(FILES.trades, trades);

        return sendJSON(res, 200, { success: true, trade: newTrade });
    }

    // 10. P2P Trades: POST /api/trades/accept
    if (pathname === "/api/trades/accept" && req.method === "POST") {
        const body = await parseBody(req);
        const { tradeId, buyerUsername, offeredCard } = body;

        const trades = readJSON(FILES.trades, []);
        const trade = trades.find(t => t.id === tradeId && t.status === "open");

        if (!trade) {
            return sendJSON(res, 404, { error: "Trade listing no longer available." });
        }

        if (trade.sender.toLowerCase() === buyerUsername.toLowerCase()) {
            return sendJSON(res, 400, { error: "You cannot trade with yourself." });
        }

        const saves = readJSON(FILES.saves, {});
        const sellerSave = saves[trade.sender.toLowerCase()];
        const buyerSave = saves[buyerUsername.toLowerCase()];

        if (sellerSave && buyerSave) {
            // Remove seller offered card, give to buyer
            sellerSave.cards = sellerSave.cards.filter(c => c.id !== trade.card.id);
            buyerSave.cards.unshift({ ...trade.card, locked: false, obtained: Date.now() });

            // Remove buyer offered card, give to seller
            if (offeredCard) {
                buyerSave.cards = buyerSave.cards.filter(c => c.id !== offeredCard.id);
                sellerSave.cards.unshift({ ...offeredCard, locked: false, obtained: Date.now() });
            }

            writeJSON(FILES.saves, saves);
        }

        trade.status = "completed";
        trade.buyer = buyerUsername;
        trade.completedAt = Date.now();
        writeJSON(FILES.trades, trades);

        return sendJSON(res, 200, { success: true, trade: trade });
    }

    // ==========================================
    // STATIC FILE SERVER (Frontend Assets)
    // ==========================================

    let reqPath = pathname;
    if (reqPath === "/" || reqPath === "") reqPath = "/index.html";

    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("404 Not Found");
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType,
            "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400"
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

function updateLeaderboardEntry(username, pData) {
    try {
        const lb = readJSON(FILES.leaderboard, {});
        const cards = pData.cards || [];
        const value = cards.reduce((sum, c) => sum + (c.rating || 80) * 10, 0);

        lb[username.toLowerCase()] = {
            name: pData.name || username,
            username: username,
            gold: Number(pData.coins || 0),
            value: value,
            cards: cards.length,
            level: Number(pData.level || 1),
            equippedTitle: pData.equippedTitle || "Collector",
            bannedUntil: Number(pData.bannedUntil || 0),
            updatedAt: Date.now()
        };

        writeJSON(FILES.leaderboard, lb);
    } catch (e) {
        console.error("updateLeaderboardEntry error:", e);
    }
}

server.listen(PORT, () => {
    console.log(`\n=========================================================`);
    console.log(`๐€ FOOTBALL CARDS SERVER IS LIVE ON PORT ${PORT}!`);
    console.log(`๐“ Persistent storage active at: ${DATA_DIR}`);
    console.log(`๐ Open in browser: http://localhost:${PORT}`);
    console.log(`=========================================================\n`);
});