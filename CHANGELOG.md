# Changelog

How Status Drop got from a one-screen prototype to its current form. Each entry says what changed and why. Versions 0.1 through 1.0 all happened on 2026-10-17.

## 1.2: Built for phones and tablets

Added on 2026-10-27.

- **Added a built-in number pad to Type the code on touch screens.** *Why:* on a phone, tapping the answer box opened the keyboard, and the page slid up until only the bottom third of the arena showed. New blocks enter at the top, so they were hidden. The pad replaces the phone's keyboard, so the arena, the score, and the pad fit on one screen.
  - Phones get a 3 by 4 dial pad. Tablets get one row of keys under the arena and otherwise keep the desktop layout.
  - It still clears the moment three digits match, and a hardware keyboard still works.
- **Type the name fits the arena above the keyboard.** Names need the phone's keyboard, so the play screen now measures the space left above it and fits into that. When space is tight, the level line and the hint hide.
- **The round fills the screen on touch devices.** The header and footer hide during play. "Change" and the pause menu still lead out.
- **A block takes the same time to land on every screen.** The touch layout gives the arena whatever height is left, so the fall is scaled to that height. Blocks also keep their progress when the arena resizes mid-round, for example when the keyboard opens or the phone rotates.
- Desktop is unchanged.

## 1.1: More blocks the longer you last

Added on 2026-10-27.

- **The number of falling blocks now grows with time survived.** Two fall at first, then one more joins at 15, 30, and 45 seconds, up to five at once. Paused time doesn't count. *Why:* with two at most, the round never got busy, even late in a run.
- **A new block only has to miss the blocks still near the top.** *Why:* every block falls at the same speed, so two that start apart never meet. Five don't fit side by side on a phone, so a block with no clear spot waits a moment and enters right after the one ahead of it.

## 1.0: Ready to ship

- **Added an About page.** It opens with the real support question ("what status code did you get?") and explains why reading the code correctly matters.
- **Added a footer** with the About link, a GitHub link, and a privacy note: scores stay in the browser, and nothing is tracked.
- **Split the single file into `index.html`, `styles.css`, and `index.js`.** *Why:* separation of concerns. Structure, styling, and behavior each live in their own file, which makes the code easier to read and review.
- **Renamed the page to `index.html` and added `netlify.toml`**, so the repo deploys to a static host with no build settings.
- **Added a 404 page.** A "404 Not Found" sign drops onto the floor and tilts where it lands, with links back to the game and to the 404 entry in Codes. It reuses `styles.css` and loads it by absolute path, so it renders correctly at any broken URL depth.
- **Removed the developer answer key** from the game screen. *Why:* it was only for testing the mechanics during development.
- **Softened the definitions claim** to "based on RFC 9110 and related RFCs." *Why:* the definitions were written for the game, and "checked against" would claim a review that hadn't happened yet.

## 0.7: Faster to the flashcards

- **Moved the flashcards to the top of Learn**, with a "New here? Read how the first digit works below" link to the basics. *Why:* on a phone, the cards sat below 12 sections of reading.
- **Replaced the nine deck chips with four decks that don't overlap:** Common (18), Less common (14), Rare (33), and Misses. *Why:* the game's levels stack, so Medium repeated all of Easy. That makes sense for difficulty, but in flashcards it meant re-drilling cards you already knew.
- **Added "Practice these" buttons to each class band on Codes.** *Why:* studying one class is useful, but a chip that just says "4xx" means nothing to a newcomer. The band already says "4xx Client error" in full.
- **Fixed a mismatch on History:** "Most missed" showed 8 codes, but its link opened a deck of 13. It now reads "top 8 of 13" and "Drill all 13." The Misses chip shows its live count, so the two can't drift again.
- **Added pagination to History,** 5 rounds per page, with Newer and Older buttons.

## 0.6: Mobile menu and accessibility

- **Added a menu for tablet and phone.** It drops down as a departures-board panel. Each tab gets a flap tile with a fitting status code (200 Play, 404 Codes), and the current page's tile turns yellow. Opening it mid-round pauses the game. It closes with the same motion it opens with.
- **Fixed every automated accessibility issue** found by axe-core:
  - Darkened the success green from `#1F8A4C` to `#1A7A43` to reach 4.5:1 contrast with white text.
  - Gave the lives indicator a text label that updates as you lose lives.
  - Added a level-one heading to the game screen and to each code page.
  - Fixed contrast on deck counts and on the class practice buttons.

## 0.5: Wayfinding redesign

- **Rebuilt the whole look.** *Why:* the first version borrowed too heavily from existing reference sites. The new identity comes from airport and highway signage, because HTTP is full of travel words: gateway, redirect, moved permanently, not found.
  - Sign yellow for anything you must read, on a cool concourse grey.
  - Class colors that carry meaning everywhere: grey 1xx, green 2xx, blue 3xx, yellow 4xx, red 5xx.
  - Overpass, a typeface based on US highway signage.
  - A split-flap departures board on the home screen, the one ambient animation in the app.
  - Falling blocks as sign plates, lives as three green lights, a hazard stripe at the floor. A correct answer flashes the block in its class color.
- **Rebuilt the flashcards with a 3D flip.** Cards you are still learning come back later in the deck. Keyboard shortcuts: `Space` flips, `1` still learning, `2` got it.
- **Evened out the home screen.** The board shows 3 rows, one per main class, and both columns share the same top and bottom edge.
- **Made every view responsive.** Board text wraps between words, never mid-word. On phones, the start card comes before the board, and the game area is shorter so the answer box stays above the on-screen keyboard.
- **Made the board animate only on arrival**, not every time you change the level.
- **Added pause.** A button or `Esc` freezes and blurs the blocks. Paused time doesn't count toward "time survived." Start over and Quit don't save the round, so abandoned rounds don't drag down your history.

## 0.4: Home screen

- **Added a home screen** with a level picker and a choice of mode. Picking a mode starts a 3-2-1 countdown.
- **Fixed a hidden bug:** the variable holding score history was named `history`, which shadowed the browser's `window.history`. URL updates were failing silently.

## 0.3: Name mode

- **Added a second mode:** a code falls, and you spell out its name.
  - Case-insensitive, but spelling, hyphens, and apostrophes must match. Curly and straight apostrophes count the same.
  - The input border turns red as soon as your text can no longer become any falling name, so a typo shows right away.
  - `Enter` clears a wrong guess.
  - Blocks fall at 60% speed, since names take longer to type.
- **Split best scores by mode**, so rounds only compare against the same mode and level.

## 0.2: Learn, Codes, and History

- **Expanded from 26 codes to 65**, including three unofficial ones seen in real logs (444, 499, 599), and added three levels.
- **Added Codes:** every code by class, with search, and a page per code with a definition, a "how it shows up in a support ticket" note, and its Python `http.HTTPStatus` constant.
- **Added Learn:** what the first digit tells you, seven pairs people mix up (401 or 403, 502, 503, or 504, and more), and flashcards.
- **Added History and a results screen:** score, personal best, rank, time survived, average per code, and every code that hit the floor.
- **Fixed navigation inside sandboxed previews.** The router waited for the browser to report hash changes, which iframes can block. It now routes from its own state.
- **Replaced the browser's built-in confirm dialog** with a custom one for "Clear history." *Why:* sandboxed frames block native popups, so history cleared with no warning.
- **Added a logo:** a falling block reading "4xx," with speed lines.

## 0.1: Prototype

- Status names fall from the top. Type the matching code before they land.
- Two blocks fall at a time, and they never share a code.
- A block clears the moment the typed code matches. No Enter key.
- Three lives, lost when a block hits the floor. A wrong three-digit entry clears the field without costing a life.
- Each correct answer speeds up the fall.
- An answer key showing whatever is falling, for testing the mechanics.
