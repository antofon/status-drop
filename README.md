# Status Drop

A browser game for learning HTTP status codes. Status names fall from the top of the screen, and you type the code before they land. Or flip it: codes fall, and you spell out the name.

It covers 65 codes, from `100 Continue` to `511 Network Authentication Required`, plus three unofficial ones you will meet in real logs (`444`, `499`, `599`).

## Why it exists

A customer writes in: "the API is broken." The first question is always the same: what status code did you get? A `401` and a `403` send you down completely different paths. So does a `502` versus a `504`.

Reading that code correctly is the fastest way to a fix. Status Drop turns that skill into a game, then backs it with flashcards and a full reference.

## What's inside

### Play
- **Two modes.** *Type the code:* a name falls, you type its three digits. *Type the name:* a code falls, you spell out its name.
- **Three levels.** Easy (18 common codes), Medium (32), Hard (all 65). Levels stack, so Hard includes everything.
- **Two blocks fall at a time.** A block that hits the floor costs a life. Three lives per round.
- **Speed builds.** Each correct answer makes the next blocks fall a little faster.
- **No Enter key.** A block clears the moment your answer matches.
- **Name mode is strict on spelling, loose on case.** Capitals don't matter. Spelling, hyphens, and apostrophes do. The input border turns red as soon as your text can no longer match any falling name.
- **Pause anytime.** The pause button or `Esc` freezes and blurs the blocks. Resume, start over, or quit to home.
- **Results screen.** Score, personal best, rank among your own rounds, time survived, average time per code, and every code that hit the floor.

### Learn
- **Flashcards with a 3D flip.** Click, tap, or press `Space` to flip. Press `1` for still learning (the card comes back later) or `2` for got it.
- **Four decks that don't overlap:** Common (18), Less common (14), Rare (33), and Misses, which is built from every code that hit the floor in your rounds.
- **Class decks.** Every class on the Codes page has a "Practice these" button that opens a deck for just that class.
- **Name first or code first**, so you can drill in either direction.
- **The basics, below the cards:** what the first digit tells you, and seven pairs people mix up (401 or 403, 400 or 422, 502, 503, or 504, and more).

### Codes
- Every code, grouped by class, with search by number or name.
- A page for each code: the definition, how it shows up in a support ticket (for the codes you will actually see at work), and its Python `http.HTTPStatus` constant.

### History
- Totals, best score per mode, your most-missed codes, and every round, newest first, 5 per page.
- "Drill all" sends your misses straight to the flashcards.

## Design

The look borrows from airport and highway wayfinding, because HTTP is full of travel words: gateway, redirect, moved permanently, not found.

- **Sign yellow** marks anything you must read.
- **Class colors carry meaning everywhere:** grey for 1xx, green for 2xx, blue for 3xx, yellow for 4xx, red for 5xx.
- **Overpass**, a typeface based on US highway signage, with tabular numbers.
- **A split-flap departures board** on the home screen. It animates once when you arrive.

## Accessibility

- **Zero automated violations.** Every view passes [axe-core](https://github.com/dequelabs/axe-core) checks for WCAG 2 A and AA plus best practices.
- **Color contrast** meets the 4.5:1 minimum for text, including the text on every class color.
- **Color is never the only signal** in the reference: every class color sits next to its name, such as "4xx Client error."
- **Keyboard support.** Every control is reachable by keyboard, focus outlines stay visible, `Esc` pauses the game and closes menus and dialogs, and the flashcards have their own shortcuts.
- **Reduced motion.** With your system's reduced-motion setting on, the board animation, card flips, and menu transitions turn off.
- **Responsive layout.** Tested at phone, tablet, laptop, and desktop widths with no sideways scrolling. On tablet and phone, navigation moves into a menu, and the game pauses itself if you open the menu mid-round.
- **Pause control.** Moving content can always be stopped.

## Tech

- Three files: `index.html` for structure, `styles.css` for the look, `index.js` for routing and the game. Plus `404.html`, which Netlify serves for any path that doesn't exist. Plain HTML, CSS, and JavaScript. No framework, no build step, no dependencies beyond a Google Fonts stylesheet.
- A small hash router (`#/learn`, `#/codes/404`) that routes from in-memory state, so links also work inside sandboxed previews and iframes.
- The game loop runs on `requestAnimationFrame` with time-based movement, so speed stays consistent across frame rates. Paused time is excluded from "time survived."
- Scores and settings save to `localStorage`, wrapped so the app still runs when storage is blocked.
- No accounts, no analytics, no tracking. Your scores stay in your browser.

## Run it locally

Open `index.html` in a browser. That's it.

Or serve the folder if you prefer:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy

The repo deploys as-is to any static host. On Netlify, connect the repo with no build command and the repo root as the publish directory. The included `netlify.toml` already sets this.

## About the definitions

The definitions and support notes are written for this game, based on [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) and related RFCs. Unofficial codes (`444`, `499`, `599`) are marked. For a few codes, Python renamed the `http.HTTPStatus` constant in newer versions (for example, `CONTENT_TOO_LARGE` replaced `REQUEST_ENTITY_TOO_LARGE`), and this game shows the newer names.
