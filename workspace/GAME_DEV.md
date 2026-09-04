# 🎮 Pillar 1: Gaming Dev (Active Technical Architecture)

This document is the single source of truth for the game's active codebase, architecture, engine configuration, and technical assets.

---

## ⚙️ Tech Stack & Engine Configuration
- **Game Title**: **Football Cards** (`AIxcard/Football-Cards`)
- **Engine / Renderer**: Pure Vanilla HTML5, CSS3 Custom Properties & Responsive Flex/Grid Canvas/DOM UI (Optimized for Mobile, Tablet, and Desktop, v440.0)
- **Language & Runtime**: Modern ES6+ JavaScript (`script.js`)
- **Data Persistence**: Cross-Device Cloud Account Sync (`GlobalCloudRest` + `CloudSync` + `localStorage` Key: `footballCardsSave_v14_hard_reset`)
- **Sound / Audio**: Web Audio API Procedural Sound Synthesizer (`SoundFx` with Sol's RNG fanfare and chord synthesizers)
- **Target Frame Rate**: Smooth 60 FPS CSS Animations & Transitions with `content-visibility: auto`
- **Target Platforms**: Phone, Tablet, and PC Responsive Web (iOS/Android/Desktop viewports)

---

## 🏗️ Active Architecture & Modules

```text
Football-Cards/
├── index.html        # Single-page UI (Auth, Packs Store, Collection, Trade Hub, Shop, Profile Search, Showcase, Tournament Arena, Missions, Settings, Admin Panel)
├── script.js         # CloudSync & LiveTradeNetwork, SolsCutsceneEngine, Admin Controller, Discovery Rewards, Auto-Sell Settings, Promo Codes
├── style.css         # Stadium theme, 3D card flips, animated titles, luxury booster pack shaders, Sol's cutscene overlays
└── README.md         # Repository documentation
```

### Key Subsystems:
1. **Cloud Trading & Inbox System (`CloudSync`)**:
   - Send trade requests to any player username, receive pending trade requests in Trade Inbox, Accept (atomic card swap) or Decline, and browse Trade History.
2. **Player Profile Search**:
   - Search any account username (e.g. `b`) to view their level, stats, avatar, and live 6-Slot Card Showcase. Includes "Propose Trade" quick button.
3. **Tournament Draft Arena (5 Weekly Attempts & Real Leaderboard)**:
   - Requires login. Capped at 5 draft attempts per weekly season with an "Enter Tournament" confirmation modal.
   - Separate 1,000 Tournament Gold per run. Real authenticated players on leaderboard (no bots).
   - Scoring: Common = +1, Uncommon = +2, Rare = +3, Epic = +4, Legendary = +5, Exclusive = +8, Mythic = +10, Secret = +25, World Class = +100.
   - Rewards: Unlocks **Emanuel (99 OVR, CAM)**, "Tournament Top 10", and "Season 1 Champion" titles.
4. **Exclusive Rarity (formerly Limited)**:
   - Signature shimmering Purple & White gradient (`#b66cff` to `#ffffff`).
   - Best rarity hierarchy properly identifies World Class / Tournament at peak tier.
5. **New Card Discovery Gold Bonus**:
   - Unlocking a card for the first time awards instant gold (+10 🪙 Common up to +5,000 🪙 Tournament) with celebratory visual fanfare.
6. **Dedicated GOAT Reveal Cutscenes (Lionel Messi & Cristiano Ronaldo)**:
   - Tailored Sol's RNG cutscenes with player-specific quotes, crest badges (8x Ballon d'Or / 5x Champions League), and unique musical fanfares.
7. **Packs & Navigation Restructure**:
   - Home page features the most popular pack (**Premium Pack**), while all scouting packs reside in the dedicated **`📦 Packs`** sidebar tab.
8. **Responsive UI & Real Stadium Photography**:
   - Centered alignment rules, taller 6-slot showcase slots to fit full player portraits, and authentic stadium backgrounds (Camp Nou, Bernabéu, Wembley, San Siro, Maracanã).

---

## 📝 Recent Technical Updates
* **2026-09-04 (Phase 20)**:
  - **Exclusive Economy Calibration (1,000 Coins / 800 Sell Value)**: Configured Exclusive pack cost to 1,000 coins (1x=1,000, 3x=3,000, 5x=5,000) and card duplicate/manual sell price to a flat 800 coins across all Exclusive players.
  - **Anti-Bot & Anti-Autoclicker Guard (`AntiBotGuard`)**: Installed active bot detection on pack rip and opening triggers, verifying `e.isTrusted` flag, mouse event coordinates, and sliding-window event interval variance (< 15ms variance flag) to terminate bookmarklet scripts and macro tools.
  - **Alucard Solo Championship Tournament Game Engine**: Built a 4-Stage Solo Card Clash Arena (Quarter-Finals -> Semi-Finals -> Finals -> Grand Championship) requiring top 5 collection cards, featuring real-time rating comparison and 4 tactical clash choices (All-Out Attack, Tactical Counter, Defensive Press, Midfield Control). Access is strictly restricted to account `Alucard` (`#tournamentAlucardView`), presenting a clean "Season 1 Locked" placeholder for all other users (`#tournamentLockedView`).
  - **Backend Deletion API & Offline Leaderboard Retention**: Added permanent account deletion endpoint `/api/user/delete` and server-side collection valuation in `/api/leaderboard` for accurate offline player rankings.
  - **iPad Responsive Image Aspect Ratio**: Modernized `.card-image-wrap` to responsive `aspect-ratio: 1 / 1` and responsive card flex rules.

* **2026-08-29 (Phase 19)**:
  - **Cryptographic SHA-256 Password Hashing (`hashPassword`)**: Implemented Web Crypto API SHA-256 salted password hashing (`crypto.subtle.digest`). Converted all password fields in state, cloud payloads, and localStorage accounts to irreversible `passwordHash` tokens with zero plaintext passwords stored.
  - **Automatic Startup Sanitizer (`sanitizeStoredPasswords`)**: Added boot-time database scrubber that scans `football_cards_cloud_accounts` and all `footballCardsSave_` keys in `localStorage`, converting legacy plaintext passwords into SHA-256 hashes and deleting the plaintext `password` attribute.
  - **Complete Console Neutralization & Continuous Auto-Purge**: Neutralized `console.log`, `console.warn`, `console.error`, `console.info`, `console.dir`, `console.table`, and all inspection methods into noops, backed by a 300ms auto-clear interval.
  - **Active DevTools Detection & Inspection Shield (`#devToolsShieldModal`)**: Added window dimension traps (`window.outerWidth - window.innerWidth > 160`) and anti-debugging execution probes (`debugger` timing) that render a fullscreen shield blocking all gameplay whenever DevTools or Console is opened.
  - **DevTools Shortcut & Context Menu Lockdown**: Blocked `F12`, `Ctrl+Shift+I/J/C/K`, `Ctrl+U`, `Ctrl+S`, `Cmd+Option+I/J/C`, and right-click inspect menus.

* **2026-08-29 (Phase 18)**:
  - **Universal Modal Viewport Centering**: Fixed CSS rules for `.modal`, `#incomingTradeModal`, `#tradeCardPickerModal`, `#liveTradingRoomModal`, and `#kickDeviceModal` using `display: flex !important; align-items: center !important; justify-content: center !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; margin: auto !important;` to ensure strict center alignment on PC, iPad, and mobile viewports.
  - **HUGE Trade Card Picker with Real-Time Search & Rarity/RAP Filters**: Overhauled `#tradeCardPickerModal` into a massive, multi-column inventory selector (`.trade-picker-huge-box`) with player name search, rarity filtering dropdown, and sorting by RAP, OVR, and recent obtainment.
  - **Collection Search Bar**: Added `#cardSearchInput` alongside `#cardFilter` and `#cardSorter` on the `#cards` Collection page with real-time text matching across player names, positions, rarities, ratings, and serial numbers.
  - **Roblox-Style RAP (Recent Average Price) Card Value System**: Designed `calculateCardRAP(card)` and `formatRAP(val)` calculating fair market value based on base rarity values, rating coefficients, and serialized multipliers (e.g. Serial #1 = 10x multiplier). Added RAP badges on cards and a live **Fairness / Profit-Loss Meter** in the live trade room.
  - **Pixel-Perfect In-Trade Chat Alignment**: Aligned `.trade-chat-input-row` input and Send button to matching `42px` heights, padding, and vertical flex centers.
  - **Deterministic Username-Keyed Two-Way State Sync**: Structured trade session state by direct player usernames (`offers[username]`, `ready[username]`), eliminating race conditions between PC and iPad, ensuring instant ready status reflection and instant cleanup on decline/cancel.

* **2026-08-28 (Phase 17)**:
  - **Realistic 3D Physical Booster Pack & Cap-Tear Mechanic**: Overhauled pack opening stage to render a genuine 3D metallic foil trading card booster pack (`.realistic-booster-pack`) with embossed serrated ribbed top/bottom seals, metallic sheen reflections, brand badges, and a laser-perforated tear strip.
  - **Diagonal Cap-Severing Swipe Animation**: Swiping across the top crimp seal severs the top foil cap diagonally (`transform: translateY(-110px) rotate(-26deg) scale(0.85)` + fade) with a paper/foil ripping sound effect (`SoundFx.packTear()`), while inner card models smoothly slide upward out of the sleeve (`transform: translateY(-200px)`).
  - **Complete Removal of Instant Reveal Options**: Removed the Instant Reveal button and skip toggles to guarantee an immersive physical card opening experience.
  - **Epic Secret & Mythic Cutscenes**:
    - **Secret Phenomenon**: Deep space blackout, spinning celestial starlight rift, lightning bursts, rotating star card with player photo, and 1-in-500 stardust fanfare.
    - **Mythic Stars**: Fiery magma vortex rift with crimson shockwaves, pulsing flame crest, and dedicated `SoundFx.mythicCinematic()` synth fanfare.
  - **Comprehensive UI Overhaul**: Modernized top navigation bar, pack cards, 3D card inspection modal, collection grid, showcase, and modal backdrops with glossy glassmorphism.

* **2026-08-28 (Phase 16)**:
  - **Gallery / Device File Avatar Upload**: Replaced external image URL input with direct HTML5 `<input type="file">` file picker with client-side canvas compression (max 256x256 at JPEG 0.85 quality) to ensure fast and lightweight cross-device profile avatars.
  - **Complete Wipe of Profile Frames**: Removed profile frames system across Shop, Profile page, and CSS.
  - **100% Guaranteed Online Cross-Device Cloud REST Backend**: Connected to REST cloud storage endpoints (`https://api.restful-api.dev/objects/ff8081819ff5b11001a047e7c0a846e2` for Global Leaderboard and `ff8081819ff5b11001a047e82a2c46e3` for Global Users) allowing PC, iPad, iPhone, and Android accounts to sync in real-time worldwide.
  - **Interactive Swipe-to-Open Pack Opening & Bulk Scouting (1x, 3x, 5x)**: Added multi-pack buttons (`1x`, `3x`, `5x`) to all scouting packs, interactive drag-to-rip swipe bar (`#packSwipeTrack`), and `⚡ Fast Pack Opening (Skip Animation)` toggle in Settings.
  - **Bespoke Pack Designs & Testing Packs**: Added unique foil visual themes for Starter, Premium, Champion, Exclusive, Mythic, Secret, and World Class packs. Added dedicated **Mythic Stars Pack** (100% Mythic) and **Secret Icons Pack** (100% Secret) for testing.
  - **Player Roster Expansion (89 Players) & Secret Lamine Yamal**: Expanded database from 52 to 89 real players across all positions and upgraded Lamine Yamal (96 RW) to Secret rarity.
  - **Serialization Exclusivity**: Enforced serialization strictly for World Class cards (Lionel Messi & Cristiano Ronaldo).
  - **Mobile & iPad Usability Optimizations**: Added `maximum-scale=1.0, user-scalable=no, viewport-fit=cover`, CSS touch manipulation, text-selection locks on non-inputs, and touchend double-tap zoom preventers.
  - **Password Security Upgrades**: Added show/hide password buttons (`👁️`) on Auth modal and a secure Change Password panel in Settings.
  - **Title System & Description Updates**: Cleaned up title descriptions so they don't hardcode specific usernames; marked tournament titles as locked/unobtainable for normal gameplay.

* **2026-08-28 (Phase 13)**:
  - **Animated Pack Opening for All Packs**: Implemented interactive 3D pack opening modal (`#packOpeningOverlay`) with glowing cosmic rays, foil shimmering light animation, pack-themed emoji badges (🌎, 🏆, 👑, ⭐, 📦), and a dynamic animated rip progress bar running before every card reveal.
  - **Full Sol's RNG GOAT Cutscenes for Messi & Ronaldo**: Pulling Lionel Messi or Cristiano Ronaldo (or any World Class card) triggers fullscreen Sol's RNG cinematic cutscene with blackout, cosmic aura vortex rift, player portrait in golden crest, Ballon d'Or / Champions League laurels, custom player quote, and `CLAIM GOAT CARD` action.
  - **Serialized GOAT Procedural Cutscene Variants**: Serialized World Class cards dynamically theme the cosmic vortex rift and card borders using the player's bespoke procedural gradient with `★ SERIALIZED #X/10 WORLD CLASS GOAT ★`.

* **2026-08-28 (Phase 12)**:
  - **Fixed Script Initialization Order (Restored Statistics, Showcase, Titles, Customization)**: Moved `CARD_VALUES`, `getCardValue`, and `calculateCollectionValue` definitions to the top of `script.js` before `TITLES` and `freshState()`. Wrapped all title unlock functions in `try/catch` and safe `CloudSync` guards so rendering never halts.
  - **Removed Multi-Lock Button**: Removed `Multi-Lock` toolbar button as per user preference (direct 1-click lock button on each card is already fully interactive).
  - **Enhanced Bulk Multi-Sell UI**: Upgraded `#multiSellBar` floating action bar with uppercase `💰 BULK CARD SELLER` title, dual-stat selected count & glowing gold payout (`+X 🪙`), `[Select All Unlocked]`, `[Clear]`, and shiny gradient `[💰 Confirm Sell & Claim Gold]`.
  - **Card Padding & Button Overlap Fix**: Added `margin-bottom: 28px;` to `.collection-action-toolbar` and configured flex layout on `.card` with `margin-top: auto; padding-top: 14px;` on `.card-actions` and `margin-bottom: 12px;` on `.card-top-row` to guarantee zero overlapping.

* **2026-08-28 (Phase 11)**:
  - **Removed Admin Panel & Code `sixseven67`**: Completely removed admin markup, floating toggle pill, and promo code triggers. Converted `Owner`, `Admin`, and `Staff` titles to legitimate level/collection progression achievements.
  - **Toolbar Alignment & Dedicated Multi-Lock / Multi-Sell Buttons**: Replaced complex multi-select toggle with matching `.ghost-btn` styled `🔒 Multi-Lock` (click any card to toggle lock) and `💰 Multi-Sell` (click cards to select and bulk sell).
  - **Purged Black Pill Box Artifact**: Removed dark background from `.card-rarity-pill` and applied high-contrast drop-shadow typography directly to cards so that no black pill box artifacts ever render.
  - **Fixed Profile Customization Crash**: Added safe fallback parsing for `ownedFrames` and `ownedBackgrounds` in `loadGame()` and `renderProfileCustomization()` so dropdowns and owned items populate flawlessly without errors.
  - **Dynamic Serialized World Class Cutscenes**: World Class cutscene now dynamically adapts to the card's specific holographic serial gradient, rift coloration, and custom serial banner text.

* **2026-08-27 (Phase 10)**:
  - **Account Isolation Fix**: Completely decoupled accounts during login, signup, and logout (`CloudSync`) to prevent cross-account progress sharing.
  - **Multi-Select, Multi-Lock & Multi-Sell System**: Added multi-select mode with checkboxes, floating action bar (`[Select All Unlocked]`, `[🔒 Multi-Lock]`, `[🔓 Multi-Unlock]`, `[💰 Multi-Sell]`), and Quick Sell buttons (`Sell All Common`, `Sell All Uncommon`, `Sell Duplicates`).
  - **Card Locking & Overlay Fix**: Removed black box hover overlay (`.card-hover-stats`) so cards, art, and lock buttons are 100% interactable and never blocked.
  - **Reset Serialized Cards & Random Gradients**: Reset counter to start cleanly from #1 to #10 with procedural randomized color palettes (Purple Dark, Purple White, Red Purple, Yellow Blue, Gold Obsidian, Cyan Mint).
  - **Pack Opening 3D Animation & Secret Cutscenes**: Added 3D rumbling pack opening animation modal plus full Sol's RNG Secret manifestation cutscene.
  - **Rarity Hierarchy & Sorting System**: Corrected hierarchy (Tournament $\rightarrow$ World Class $\rightarrow$ Exclusive $\rightarrow$ Secret $\rightarrow$ Mythic $\rightarrow$ Legendary $\rightarrow$ Epic $\rightarrow$ Rare $\rightarrow$ Uncommon $\rightarrow$ Common) and added Rarity/Value/Rating/Newest sorting in Collection.
  - **High-Contrast Statistics Grid**: Boosted contrast and ensured real-time data sync on page navigation.

* **2026-08-27 (Phase 9)**:
  - **OP Admin Panel & Secret Code `sixseven67`**: Movable draggable and collapsible panel allowing instant Gold generation, spawning any card in the game (including Emanuel 99 OVR and Serialized cards), unlocking all titles, +10 level skips, and tournament attempt resets. Persistent `⚡ Admin Panel` floating toggle button added.
  - **Card Rarity Animated Theme Gradients**: Added bespoke animated background gradients for every rarity, including dedicated animated Sky Blue & White for World Class Messi, Red & White for World Class Ronaldo, and Cosmic Gold & Cyan for Emanuel.
  - **Audio Synthesizer Revamp**: Replaced low sawtooth buzzer with an uplifting multi-tone chime arpeggio for pack openings.
  - **Leaderboards Rework**: Split into `💰 Most Gold` and `💎 Highest Card Value` tabs (with Serialized World Class cards valued at 10,000 🪙 each).

* **2026-08-27 (Phase 8)**:
  - **Auto-Assigned Random Usernames**: Replaced initial modal popup with auto-assigned names (e.g. `Jeff7246`, `Mark2424`).
  - **Fixed Pack Card `?` Button**: Scoped `.pack-info-btn` to a 24x24 circular badge.
  - **Champion Pack Secret Odds & Rarity Overhaul**: Elevated Champion Pack Secret rate to 0.5%.
  - **Permanent Save Migration Engine**: Multi-version fallback loader across `_v9` through `_v1`.
  - **GitHub Deployment**: Pushed directly to `AIxcard/Football-Cards` (`index.html`, `style.css`, `script.js`).

* **2026-08-27 (Phase 7)**:
  - **Fixed Infinite Loading Spinner**: Removed empty `src=""` on search avatar and added `onerror` safety fallback to prevent browser re-fetch loop.
  - **Balanced Mission UI Placement**: Replaced full-width stretched green bars with responsive `.mission-grid` cards with right-aligned claim buttons.
  - **Shop Avatar Frame Previews**: Added footballer portrait inside frame preview circles.
  - **Restored Messi & Ronaldo Titles**: Added `The Greatest` (Lionel Messi) and `The King` (Cristiano Ronaldo) with ownership checks.
  - **Tournament Titles by Rank**: Linked `Tournament Top 10` (Top 10 leaderboard rank) and `Season 1 Champion` (#1 leaderboard rank) to dynamic leaderboard rankings.
  - **1-of-10 Serialization with Permanent Random Gradients**: First 10 Messi and Ronaldo cards rolled get unique permanent holographic multi-hue gradient backgrounds and `★ SERIAL #X/10 ★` badges.
  - **High-Contrast Profile Glass Card**: Added dark frosted glassmorphism backdrop (`rgba(6, 16, 26, 0.85)` + `backdrop-filter: blur(14px)`) behind profile stats so text is 100% visible against grass/stadium backgrounds.
  - **Premium Pack Upgraded**: Now drops up to Secret rarity.
  - **Pack Odds Info Modal `( ? )`**: Added circular inspection button in top right of all pack cards.
  - **Player Index & Interactive 3D Card Inspector**: Added full catalog with discovery percentage and tilt-interactive 3D card inspection modal with specular holographic reflections.
  - **Visual 6-Slot Showcase Card Picker**: Overhauled picker modal to display large visual cards with portraits and stats.
  - **Mobile & Tablet Full Optimization**: Touch gestures, responsive drawer navigation, viewport adjustments, and auto-collapsing grids.
  - **GitHub Deployment**: Pushed directly to `https://github.com/AIxcard/Football-Cards`.

* **2026-08-31 (Phase 40)**:
  - **Permanent Serialized Persistence**: Removed the legacy top-level serial reset loop on script startup that was setting `c.serialNumber = null` on page refreshes. Serialized cards now persist permanently in state and cloud storage.
  - **Alucard Account Test Isolation**: Maintained test isolation for `Alucard` so pulling or spawning serialized cards does not consume or alter global cloud serial allocations.
  - **Clean Population Tag Formatting**: Simplified population badges to `⚡ ${existCount} Exist` across collection cards and 3D inspect views, removing the redundant `(#X/10)` suffix.
  - **GitHub Deployment**: Pushed **v360.0** directly to GitHub Pages (`AIxcard/Football-Cards`).

