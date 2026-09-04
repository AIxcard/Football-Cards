# 🎯 Pillar 4: Proposed Actions (Roadmap, Sprints & Delegation)

This document manages all active tasks, assigned subagents, prioritized backlogs, and execution steps.

---

## 🚦 Action Priority Tiers
- `[P0 - Immediate]`: Critical path blocker (e.g. bug fixes preventing pack opening).
- `[P1 - High]`: Core gameplay loop features, drop rate balance, and missing DOM IDs.
- `[P2 - Medium]`: Polish, Web Audio synthesizer effects, card flip animations, HUD improvements.
- `[P3 - Low]`: Nice-to-have visual flourishes, mini-games (Penalty Shootout), team squad builder.

---

## 📋 Active Sprint & Immediate Next Steps

| `ACT-153` | `P0` | Rebalance Exclusive pack price to 1,000 coins (1x/3x/5x = 1k/3k/5k) and Exclusive card sell price to flat 800 coins | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-154` | `P0` | Build AntiBotGuard engine to block bookmarklet bot scripts and rapid autoclickers on pack opening | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-155` | `P0` | Implement Alucard Solo Tournament Arena with 4-stage card clash game mechanics, strictly locked for non-Alucard players | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-156` | `P0` | Implement permanent account deletion `/api/user/delete` and offline collection valuation on `/api/leaderboard` | `server.js` | `web_game_dev` | 🟢 Done |
| `ACT-157` | `P0` | Modernize iPad card image wrap aspect ratio to 1:1 and GitHub Pages redirect to Render | `style.css`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-151` | `P0` | Build 8 luxury avatar border frames with preview cards in Cosmetics Shop and Profile customizer | `index.html`, `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-152` | `P0` | Restore Chita Level 17 with 500 cards, and enforce strict isolation for Timekung vs Timekung2835 | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-149` | `P0` | Initialize Alucard master state (2,000,021,533 coins, Level 7, UNIQUE title, 2x Monkey King, Serial #1/10 Messi) on all devices | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-150` | `P0` | Seed and restore official player accounts (Dih, Aun, Gubbymaster170, Meboon, chita, hexkeys, Timekung2835) | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-146` | `P0` | Build universal DELETED_ACCOUNTS_BLACKLIST to purge test accounts everywhere | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-147` | `P0` | Add startup auto-sanitizer for localStorage cloud accounts & trades | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-148` | `P0` | Preserve all active accounts (jeff, Alucard, hexkeys, timekung2835) across devices | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-140` | `P0` | Add dailyRewardClaimed persistence to loadGame to prevent infinite reward claims on reload | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-141` | `P0` | Lock booster pack in absolute center with position: absolute 50% 50% coordinates | `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-142` | `P0` | Build granular per-rarity auto-sell configuration matrix in Settings | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-143` | `P0` | Remove discovery bonus text banner from pack reveal modal | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-144` | `P0` | Fix double user avatar icon in top navigation bar | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-145` | `P0` | Preserve all registered cloud accounts in accounts cache and retain isTradeBanned flag | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-131` | `P0` | Universal Remote Cloud Account Updater & "All Accounts" list in Admin Panel | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-132` | `P0` | Real-time live trading room two-way synchronization on accept | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-133` | `P0` | Single-tear multi-pack flow with "Next" card progression & instant Sol's cutscene pop | `script.js`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-134` | `P0` | Hide cutscene text sequences before 3D card presentation to fix text overlap glitch | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-135` | `P0` | Manual Index discovery rewards claiming with "Claim All Rewards" button | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-136` | `P0` | Promo codes specific rewards display, expired state & feedback toasts | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-137` | `P0` | Inline profile search result rendering below search bar | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-138` | `P0` | Auto-Sell duplicate cards setting in Settings section | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-139` | `P0` | Add content-visibility optimization to eliminate collection rendering lag | `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-129` | `P0` | Remove legacy top-level serial reset loop so serialized cards persist across page refreshes | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-130` | `P0` | Remove redundant (#X/10) text from bottom population tag on serialized cards | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-127` | `P0` | Display RAP in Gems (💎) in 3D Card Inspector Value box | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-128` | `P0` | Fix population aggregation to only count wiped v14 card inventories | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-125` | `P0` | Fix collection cards grid visibility by restoring obtainedDate variable in renderCards | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-126` | `P0` | Sanitize player level and cards in Trade Hub with isWiped check (reset to Level 1, 0 cards) | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-114` | `P0` | Replace game bans with Trade Ban ("Flagged") system in Trade Hub | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-115` | `P0` | Remove resize and debugger false-positive traps; silence console viewing | `script.js`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-112` | `P0` | Fix invalid radial-gradient fill in booster pack SVG front to prevent invisible pack | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-112` | `P0` | Fix invalid radial-gradient fill in booster pack SVG front to prevent invisible pack | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-108` | `P0` | Center pack opening stage dead-center via fixed 50% 50% coordinates | `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-109` | `P0` | Redesign 3D inspector info grid with 2x2 layout and exact timestamp | `index.html`, `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-110` | `P0` | Sanitize and purge all other player accounts on global leaderboard | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-111` | `P0` | Remove redeem code EMANUEL completely | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-101` | `P0` | Remove bottom tear prompt text and verify pack viewport centering | `index.html`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-111` | `P0` | Remove redeem code EMANUEL completely | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-101` | `P0` | Remove bottom tear prompt text and verify pack viewport centering | `index.html`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-102` | `P0` | Fix title persistence bug (hardcoded "Collector" in loadGame) | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-103` | `P0` | Isolate Alucard serials so test pulls do not consume global 1-10 count | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-104` | `P0` | Add date obtained & population badges to cards and 3D inspector | `index.html`, `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-105` | `P0` | Perform full database wipe & reset global leaderboard and serials | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-106` | `P0` | Update monthly mission to World Class only | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-107` | `P0` | Build ruthless multi-vector anti-cheat (getter traps, debugger timer, lock screen) | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-098` | `P0` | Remove World Class, Secret, and Mythic packs from store (Alucard account only) | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-099` | `P0` | Reset all serialized cards and global counter values across all saves | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-100` | `P0` | Direct flexbox centering on `.pack-opening-container` to guarantee pack visibility | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-095` | `P0` | Fix invalid CSS fills in SVG booster pack templates causing browser render failure | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-096` | `P0` | Synchronize Index 3D inspect gradients to match collection cards with `serializedHoloShift` | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-097` | `P0` | Prevent serialized cards from being sold (marked `💎 Priceless` & disabled) | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-091` | `P0` | Implement worldwide global serial counting (`global_serial_counts`) via cloud REST | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-092` | `P0` | Isolate serialized cards from `theme-messi`/`theme-ronaldo` to preserve custom gradients | `script.js`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-092` | `P0` | Isolate serialized cards from `theme-messi`/`theme-ronaldo` to preserve custom gradients | `script.js`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-093` | `P1` | Verify Index 3D inspect renders animated Albiceleste / CR7 gradients | `script.js`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-094` | `P0` | Enforce pack front face `translateZ(2px)` and prompt rendering for pack visibility | `style.css`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-087` | `P0` | Add gesture input guard in `initPackSwipeGesture` to prevent auto-tearing | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-088` | `P1` | Add `serializedHoloShift` animation to serialized card holographic gradients | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-089` | `P1` | Re-establish uniform black box `.card-rarity-badge` (96px x 24px) for collection | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-090` | `P1` | Restore `.theme-messi` & `.theme-ronaldo` animated colors in Index 3D inspect | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-085` | `P0` | Remove full-width gradient backgrounds from all rarity classes (`.common`, `.exclusive`, etc.) | `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-086` | `P0` | Enforce explicit booster pack dimensions & layout in modal to guarantee instant visibility | `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-082` | `P0` | Resolve pack opening modal positioning conflict & guarantee fluid tearing | `style.css`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-083` | `P0` | Add target player detection & cloud delivery to `adminSpawnMonkeyCard` | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-084` | `P1` | Remove background gradient box from card rarity (pure text with crisp glow) | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-077` | `P0` | Center 3D booster pack modal strictly dead-center on screen | `style.css`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-078` | `P1` | Rebalance RAP & card economy so World Class > Secret | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-079` | `P1` | Serialized cards display "N/A" RAP badge; normal Messi/Ronaldo show full value | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-080` | `P1` | Index catalog album renders standard normal 3D version rather than serialized | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-081` | `P2` | Uniform fixed width (95px / 80px) for all rarity & RAP badge boxes with centered text | `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-071` | `P0` | Export `sellCard` & `handleCardClick` to window bridge to fix selling | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-072` | `P0` | Disconnect collection & trade search from rarity strings (strictly match player name) | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-073` | `P1` | Add fixed `.card-serial-slot` (24px) placeholder to align all card photos horizontally | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-074` | `P1` | High-contrast `.card-rarity-badge` & `.card-rap-badge` with dark glass backing | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-075` | `P1` | Enforce `getCardImage(card)` in `renderAll`, `showcase`, `3D` to load `monkey_king.png` | `script.js`, `monkey_king.png` | `web_game_dev` | 🟢 Done |
| `ACT-076` | `P2` | Disable browser image dragging (`draggable="false"`, CSS, global dragstart handler) | `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-068` | `P0` | Add Monkey King Developer card image asset (`monkey_king.png`) | `monkey_king.png`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-069` | `P0` | Rename rarity to Developer & assign top-tier sorting priority in collection | `script.js`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-070` | `P0` | Verify Developer card exclusion from Player Index catalog album | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-060` | `P0` | Cryptographic SHA-256 password hashing & zero plaintext storage | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-061` | `P0` | Startup localStorage & memory sanitizer for legacy plaintext credentials | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-062` | `P0` | Console neutralization & DevTools active detection lockdown shield | `script.js`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-063` | `P0` | Mobile/iPad sidebar drawer (hamburger menu, slide-in, overlay backdrop, 1024px breakpoint) | `style.css`, `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-064` | `P1` | Delete Account — admin panel (wipes cloud + LB + trades) | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-065` | `P1` | Delete Account — settings page (self-service with password verification) | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-066` | `P1` | Highest Level leaderboard tab (⭐ sort, display, correct data source) | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-067` | `P0` | Expose `hashPassword` globally via `window.hashPassword` for external auth use | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-054` | `P0` | Universal viewport centering for all modals across mobile, iPad, and PC | `style.css`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-055` | `P0` | HUGE Trade Card Picker with live search input, rarity filter, and RAP sort | `index.html`, `script.js`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-056` | `P0` | Collection page search bar with real-time text matching and RAP sorting | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-057` | `P1` | Roblox-style RAP (Recent Average Price) card value system and profit meter | `script.js`, `index.html`, `style.css` | `web_game_dev` | 🟢 Done |
| `ACT-058` | `P1` | In-trade chat input and Send button pixel-perfect height & alignment | `style.css`, `index.html` | `web_game_dev` | 🟢 Done |
| `ACT-059` | `P0` | Deterministic username-keyed two-way state sync between PC & iPad | `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-051` | `P0` | Realistic 3D booster pack model with cap severing and paper/foil tear audio | `index.html`, `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-052` | `P0` | Dedicated Mythic magma cutscene and enhanced Secret celestial starlight cutscene | `index.html`, `style.css`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-053` | `P1` | Removed all instant reveal buttons and skip animation settings | `index.html`, `script.js` | `web_game_dev` | 🟢 Done |
| `ACT-005` | `P3` | Implement Interactive Penalty Shootout Mini-Game using Collected Cards | `index.html` & `script.js` | `web_game_dev` | ⚪ Queued |
| `ACT-006` | `P3` | Implement Starting XI Squad Builder & Chemistry System | `index.html` & `script.js` | `web_game_dev` | ⚪ Queued |

---

## 📈 Milestone Roadmap

- [x] **Milestone 1: Repository Audit & Architecture Synchronization** (Analyzed `Football-Cards`)
- [x] **Milestone 2: Critical Bugfixes & Drop Rate Stability** (`ISSUE-001` & `ISSUE-002` resolved)
- [x] **Milestone 3: Audio, 3D Cards & Sol's RNG Cutscenes** (Web Audio synth + Sol's RNG cutscenes)
- [x] **Milestone 4: Packs, Redeem Codes & Emanuel Tournament Reward** (Champion & World Class Packs, `RELEASE` + `EMANUEL` codes, #1 Emanuel 99)
- [x] **Milestone 5: Cloud Accounts, Trading Hub, Profile Search & 5-Attempt Arena**
- [x] **Milestone 6: Player Index Catalog, 3D Tilt Inspector, 1-of-10 Serialization & Mobile Optimization**
- [x] **Milestone 7: Rarity & Title Gradients, Save Migration Safety & UI Polishing**
- [x] **Milestone 8: Card Theme Gradients, Sound Revamp & Dual Leaderboards**
- [x] **Milestone 9: Account Isolation, Multi-Sell/Lock System, 3D Pack Opening Animation, Secret Cutscenes & Reset Serialized**
- [x] **Milestone 10: Multi-Lock & Multi-Sell Redesign, Customization Fix, Direct Typography & Serialized Cutscene Dynamics**
- [x] **Milestone 11: Scope Hoisting for Statistics/Showcase/Titles, Card Padding & Overlap Fix, Enhanced Bulk Sell UI**
- [x] **Milestone 12: Animated Pack Opening for All Packs & Cinematic Messi/Ronaldo GOAT Cutscenes**
- [x] **Milestone 13: True Online Multi-Device Sync, Gallery Avatar Upload, Swipe-to-Open & 89-Player Roster**
- [x] **Milestone 14: Realistic 3D Foil Pack Tear, Mythic & Secret Cutscenes, UI Overhaul & Zero Skip Options** (Pushed live to GitHub)
- [ ] **Milestone 15: Interactive Minigames & Squad Features** (Penalty Shootout & Starting XI)


---

## 🤝 Subagent Handoff Protocol
1. `game_orchestrator` updates this file before delegating.
2. `web_game_dev` or `game_qa_tester` completes the task and logs completion.
3. `game_orchestrator` verifies against [`GAME_DEV.md`](file:///d:/My%20Project/workspace/GAME_DEV.md) and [`ACTIVE_ISSUES.md`](file:///d:/My%20Project/workspace/ACTIVE_ISSUES.md), then moves task to "Done".



