const http = require(http);
const path = require(path);
const fs = require(fs);
const express = require(express);
const cors = require(cors);
const { WebSocketServer } = require(ws);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: 15mb }));
app.use(express.static(path.join(__dirname)));

// Persistent Data Storage
const DATA_DIR = path.join(__dirname, data);
if (!fs.existsSync(DATA_DIR)) {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

const DB_FILE = path.join(DATA_DIR, db.json);
let database = {
    users: {},
    trades: [],
    leaderboard: {}
};

function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, utf-8);
            database = JSON.parse(raw);
        }
    } catch (e) {
        console.error(Database load error:, e);
    }
}

function saveDatabase() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), utf-8);
    } catch (e) {
        console.error(Database save error:, e);
    }
}

loadDatabase();

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health Check
app.get(/api/health, (req, res) => {
    res.json({ status: online, time: Date.now(), usersCount: Object.keys(database.users).length });
});

// Authentication: Register
app.post(/api/auth/register, (req, res) => {
    const { username, password, initialData } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, error: Username and password required });
    }

    const key = username.trim().toLowerCase();
    if (database.users[key]) {
        return res.status(409).json({ success: false, error: Username already taken });
    }

    const userDoc = {
        username: username.trim(),
        password: password, // In production, bcrypt hash can be used
        saveData: initialData || {},
        createdAt: Date.now(),
        lastActive: Date.now()
    };

    database.users[key] = userDoc;
    saveDatabase();

    res.json({ success: true, message: Account registered successfully, user: { username: userDoc.username } });
});

// Authentication: Login
app.post(/api/auth/login, (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, error: Username and password required });
    }

    const key = username.trim().toLowerCase();
    const user = database.users[key];

    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, error: Incorrect username or password });
    }

    user.lastActive = Date.now();
    saveDatabase();

    res.json({
        success: true,
        user: {
            username: user.username,
            saveData: user.saveData
        }
    });
});

// Save Game Data
app.post(/api/save, (req, res) => {
    const { username, saveData } = req.body;
    if (!username || !saveData) {
        return res.status(400).json({ success: false, error: Username and saveData required });
    }

    const key = username.trim().toLowerCase();
    if (!database.users[key]) {
        database.users[key] = {
            username: username.trim(),
            password: ",
 saveData: saveData,
 createdAt: Date.now(),
 lastActive: Date.now()
 };
 } else {
 database.users[key].saveData = saveData;
 database.users[key].lastActive = Date.now();
 }

 saveDatabase();
 res.json({ success: true, message: Save game synchronized to server });
});

// Fetch Game Save
app.get(/api/save, (req, res) => {
 const { username } = req.query;
 if (!username) {
 return res.status(400).json({ success: false, error: Username required });
 }

 const key = String(username).trim().toLowerCase();
 const user = database.users[key];

 if (!user) {
 return res.status(404).json({ success: false, error: User not found });
 }

 res.json({ success: true, saveData: user.saveData });
});

// Fetch All Online Users Directory
app.get(/api/users, (req, res) => {
 const summary = {};
 for (const k in database.users) {
 const u = database.users[k];
 summary[k] = {
 username: u.username,
 lastActive: u.lastActive,
 saveData: u.saveData
 };
 }
 res.json({ success: true, users: summary });
});

// Fetch Global Leaderboard
app.get(/api/leaderboard, (req, res) => {
 const list = [];
 for (const k in database.users) {
 const u = database.users[k];
 let pData = {};
 try {
 pData = typeof u.saveData === string ? JSON.parse(u.saveData) : (u.saveData || {});
 } catch (e) {}

 list.push({
 username: u.username,
 name: pData.name || u.username,
 level: Number(pData.level || 1),
 cards: Array.isArray(pData.cards) ? pData.cards.length : 0,
 gold: Number(pData.coins || 100),
 equippedTitle: pData.equippedTitle || Collector,
 profileFrame: pData.profileFrame || default,
 avatar: pData.avatar || player_temp.png,
 isTradeBanned: !!pData.isTradeBanned
 });
 }

 list.sort((a, b) => b.level - a.level);
 res.json({ success: true, leaderboard: list });
});

// Fallback all frontend routes to index.html
app.get(*, (req, res) => {
 res.sendFile(path.join(__dirname, index.html));
});

// ==========================================
// HTTP & WEBSOCKET LIVE TRADING SERVER
// ==========================================

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: /ws });

const connectedClients = new Map(); // username -> ws socket

wss.on(connection, (ws, req) => {
 let clientUsername = null;

 ws.on(message, (rawMessage) => {
 try {
 const data = JSON.parse(rawMessage);
 const { type, payload } = data;

 if (type === AUTH) {
 clientUsername = (payload.username || ).trim().toLowerCase();
 connectedClients.set(clientUsername, ws);
 broadcastOnlineCount();
 } else if (type === TRADE_INVITE) {
 const targetWs = connectedClients.get((payload.toUser || ).trim().toLowerCase());
 if (targetWs && targetWs.readyState === 1) {
 targetWs.send(JSON.stringify({ type: INCOMING_TRADE, payload }));
 }
 } else if (type === TRADE_ACTION) {
 const targetWs = connectedClients.get((payload.targetUser || ).trim().toLowerCase());
 if (targetWs && targetWs.readyState === 1) {
 targetWs.send(JSON.stringify({ type: TRADE_UPDATE, payload }));
 }
 }
 } catch (e) {
 console.error(WS Message Error:, e);
 }
 });

 ws.on(close, () => {
 if (clientUsername) {
 connectedClients.delete(clientUsername);
 broadcastOnlineCount();
 }
 });
});

function broadcastOnlineCount() {
 const count = connectedClients.size;
 const msg = JSON.stringify({ type: ONLINE_COUNT, count });
 connectedClients.forEach(clientWs => {
 if (clientWs.readyState === 1) clientWs.send(msg);
 });
}

server.listen(PORT, () => {
 console.log([Football Cards Server] Running on http://localhost:);
 console.log([WebSocket] Live Trading Gateway active on ws://localhost:/ws);
});
