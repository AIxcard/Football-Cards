---
name: clean-code-architecture
description: >-
  Standard guidelines and refactoring patterns for scalable web games and JavaScript/TypeScript
  applications. Focuses on modular design, non-blocking asynchronous event loops, throttled/debounced
  cloud syncing, error boundary isolation, lazy DOM rendering, and bug prevention. Use when writing,
  organizing, or refactoring codebase scripts.
---

# Clean Code & Resilient Architecture Skill

This skill establishes the engineering standards and design patterns to prevent bugs, avoid browser freezing, eliminate memory leaks, and maintain high code maintainability across all game systems.

---

## 1. The Core Architectural Rules

### Rule 1: Never Put Undefined Identifiers in Export/Global Objects
* When exporting actions (e.g. `const EXPORTED_ACTIONS = { ... }` or `window[key] = ...`), every single identifier **MUST** be defined in the script.
* An undefined identifier in an object shorthand `{ missingFunction }` is a syntax/runtime `ReferenceError` that terminates script execution instantly.

### Rule 2: Targeted Lazy DOM Rendering (Zero Freezing)
* **Never re-render the entire DOM** across all hidden tabs during high-frequency game events (such as coin updates, timers, or pack clicks).
* **Pattern**:
  ```javascript
  function renderAll() {
      updateCoinDisplay();
      renderHero();
      updateAuthUI();

      // Only render the CURRENT visible active page!
      const activePage = document.querySelector(".page.active-page")?.id || "home";
      if (activePage === "cards") renderCards();
      else if (activePage === "tournament") renderTournament();
      else if (activePage === "shop") renderShop();
      // ...
  }
  ```

### Rule 3: Debounce & Throttle Network / Auto-Save Calls
* High-frequency actions (such as opening 10 packs or trading) must **never** hit the backend REST API on every individual click.
* Auto-save intervals must be throttled to >= 30 seconds.
* Use optimistic local state updates with background asynchronous sync.

### Rule 4: Multi-Store Persistence & Immutable Session Anchors
* Guard against asynchronous race conditions where an unhydrated guest state overwrites a logged-in user save:
  1. Synchronous `localStorage` session key (`football_cards_user_session`).
  2. Master `localStorage` key (`football_cards_user_save_master`).
  3. Persistent `IndexedDB` key-value store.
  4. Server authoritative cloud document (`/api/save`).
* Only clear session keys when the user explicitly clicks `logout()`.

### Rule 5: Non-Blocking Interval Safety
* Wrap all recurring `setInterval` and `setTimeout` callbacks in safety guards.
* Never call functions in an interval without verifying their existence (`typeof fn === "function"` or explicit declarations).

---

## 2. Event-Driven Action Auditing

To ensure total transparency into game state mutations (card drops, card crafts, coin spending, trade exchanges), every modifying action must emit a structured audit log:

```javascript
logPlayerAudit("CARD_PULL", {
    packType: "Champion",
    cardId: card.id,
    playerName: card.name,
    rarity: card.rarity,
    rating: card.rating,
    timestamp: Date.now()
});
```
