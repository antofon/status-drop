/* ---------- DATA ---------- */
// c code, n name, d definition, t what it looks like in a ticket, py Python HTTPStatus name, tier E/M/H, u unofficial
const CODES = [
  {c:100,n:"Continue",d:"The server received the request headers. The client should send the body.",py:"CONTINUE",tier:"H"},
  {c:101,n:"Switching Protocols",d:"The server agrees to switch protocols, for example upgrading to WebSocket.",t:"Seen on a successful WebSocket handshake. If a customer expects 101 and gets 200 or 400, a proxy is probably stripping the Upgrade header.",py:"SWITCHING_PROTOCOLS",tier:"H"},
  {c:102,n:"Processing",d:"The server accepted a long WebDAV request and is still working on it.",py:"PROCESSING",tier:"H"},
  {c:103,n:"Early Hints",d:"The server sends preload hints before the final response.",py:"EARLY_HINTS",tier:"H"},
  {c:200,n:"OK",d:"The request succeeded.",t:"A 200 with an error message inside the body is still a failure. Read the payload, not only the status.",py:"OK",tier:"E"},
  {c:201,n:"Created",d:"The request succeeded and created a new resource. The Location header often points to it.",py:"CREATED",tier:"E"},
  {c:202,n:"Accepted",d:"The server accepted the request, but the work is not done yet.",t:"\"It said success but nothing happened.\" The job is async. Check the job status endpoint or the webhook that reports completion.",py:"ACCEPTED",tier:"M"},
  {c:203,n:"Non-Authoritative Information",d:"Success, but a proxy changed the payload from the origin's response.",py:"NON_AUTHORITATIVE_INFORMATION",tier:"H"},
  {c:204,n:"No Content",d:"Success with no body to return.",t:"A client that always runs JSON.parse on the body will throw on a 204. The request worked; the parsing code is wrong.",py:"NO_CONTENT",tier:"E"},
  {c:205,n:"Reset Content",d:"Success. The client should reset the form or view.",py:"RESET_CONTENT",tier:"H"},
  {c:206,n:"Partial Content",d:"The server returned only the byte range the client asked for.",py:"PARTIAL_CONTENT",tier:"M"},
  {c:207,n:"Multi-Status",d:"A WebDAV response that carries a separate status for each item.",py:"MULTI_STATUS",tier:"H"},
  {c:208,n:"Already Reported",d:"A WebDAV member was already listed earlier in the same response.",py:"ALREADY_REPORTED",tier:"H"},
  {c:226,n:"IM Used",d:"The server applied an instance manipulation, such as a delta, to the response.",py:"IM_USED",tier:"H"},
  {c:300,n:"Multiple Choices",d:"More than one representation is available, and the client can choose.",py:"MULTIPLE_CHOICES",tier:"H"},
  {c:301,n:"Moved Permanently",d:"The resource has a new permanent URL. Clients may change a POST into a GET.",t:"A POST that becomes a GET after a 301 loses its body. Point the customer at the new URL directly.",py:"MOVED_PERMANENTLY",tier:"E"},
  {c:302,n:"Found",d:"The resource is temporarily at another URL. Clients may change a POST into a GET.",py:"FOUND",tier:"E"},
  {c:303,n:"See Other",d:"Get the result at another URL with a GET. Common after a form POST.",py:"SEE_OTHER",tier:"M"},
  {c:304,n:"Not Modified",d:"The cached copy is still valid, so no body is sent.",t:"Not an error. If a customer reports \"empty responses,\" check whether their client sends If-None-Match and handles 304.",py:"NOT_MODIFIED",tier:"E"},
  {c:305,n:"Use Proxy",d:"Deprecated. The resource must be accessed through a proxy.",py:"USE_PROXY",tier:"H"},
  {c:307,n:"Temporary Redirect",d:"The resource is temporarily at another URL. Repeat the same method and body.",py:"TEMPORARY_REDIRECT",tier:"M"},
  {c:308,n:"Permanent Redirect",d:"The resource is permanently at another URL. Repeat the same method and body.",py:"PERMANENT_REDIRECT",tier:"M"},
  {c:400,n:"Bad Request",d:"The server cannot process the request because it is malformed.",t:"Malformed JSON, a bad query parameter, or a missing required header. Ask for the raw request body.",py:"BAD_REQUEST",tier:"E"},
  {c:401,n:"Unauthorized",d:"Authentication is missing, invalid, or expired.",t:"Check for an expired token, a missing \"Bearer \" prefix, or a key from the wrong environment. The server does not know who this is.",py:"UNAUTHORIZED",tier:"E"},
  {c:402,n:"Payment Required",d:"Reserved. Some APIs use it for billing or plan limits.",py:"PAYMENT_REQUIRED",tier:"H"},
  {c:403,n:"Forbidden",d:"The server knows who you are but refuses the action.",t:"Credentials are valid but lack permission. Check scopes, roles, org membership, or an IP allowlist.",py:"FORBIDDEN",tier:"E"},
  {c:404,n:"Not Found",d:"The server cannot find the resource.",t:"Wrong base URL, wrong ID, or wrong environment. Some APIs also return 404 to hide resources you cannot access.",py:"NOT_FOUND",tier:"E"},
  {c:405,n:"Method Not Allowed",d:"The resource exists but does not support this HTTP method.",t:"Usually a PUT sent where the API expects PATCH, or a GET on a POST-only endpoint. The Allow header lists valid methods.",py:"METHOD_NOT_ALLOWED",tier:"E"},
  {c:406,n:"Not Acceptable",d:"The server cannot return a format that matches the Accept header.",py:"NOT_ACCEPTABLE",tier:"M"},
  {c:407,n:"Proxy Authentication Required",d:"The client must authenticate with a proxy first.",t:"Common in CI runners behind a corporate proxy. The API never saw the request.",py:"PROXY_AUTHENTICATION_REQUIRED",tier:"H"},
  {c:408,n:"Request Timeout",d:"The server gave up waiting for the client to finish sending.",py:"REQUEST_TIMEOUT",tier:"M"},
  {c:409,n:"Conflict",d:"The request conflicts with the current state, such as a duplicate or a version clash.",t:"Creating something that already exists, or two writers racing. Ask whether a retry or a parallel job sent it twice.",py:"CONFLICT",tier:"E"},
  {c:410,n:"Gone",d:"The resource was removed on purpose and will not return.",t:"Often a deprecated API version. Point the customer at the migration guide.",py:"GONE",tier:"M"},
  {c:411,n:"Length Required",d:"The server requires a Content-Length header.",py:"LENGTH_REQUIRED",tier:"H"},
  {c:412,n:"Precondition Failed",d:"A conditional header such as If-Match did not hold.",py:"PRECONDITION_FAILED",tier:"M"},
  {c:413,n:"Content Too Large",d:"The request body is bigger than the server allows.",t:"Large uploads or batch payloads. Check the documented size limit and suggest chunking.",py:"CONTENT_TOO_LARGE",tier:"M"},
  {c:414,n:"URI Too Long",d:"The URL is longer than the server will process.",py:"URI_TOO_LONG",tier:"H"},
  {c:415,n:"Unsupported Media Type",d:"The server does not accept the body format, often because of a wrong Content-Type.",t:"Form data sent where the API expects application/json, or the Content-Type header is missing.",py:"UNSUPPORTED_MEDIA_TYPE",tier:"M"},
  {c:416,n:"Range Not Satisfiable",d:"The requested byte range is outside the resource.",py:"RANGE_NOT_SATISFIABLE",tier:"H"},
  {c:417,n:"Expectation Failed",d:"The server cannot meet the Expect header.",py:"EXPECTATION_FAILED",tier:"H"},
  {c:418,n:"I'm a Teapot",d:"An April Fools joke code. The teapot refuses to brew coffee.",py:"IM_A_TEAPOT",tier:"M"},
  {c:421,n:"Misdirected Request",d:"The request reached a server that cannot answer for this host.",py:"MISDIRECTED_REQUEST",tier:"H"},
  {c:422,n:"Unprocessable Content",d:"The body is well formed but fails validation.",t:"The JSON parsed fine, but a required field is missing or a value is invalid. The error body usually names the field.",py:"UNPROCESSABLE_CONTENT",tier:"E"},
  {c:423,n:"Locked",d:"The WebDAV resource is locked.",py:"LOCKED",tier:"H"},
  {c:424,n:"Failed Dependency",d:"The action failed because an earlier action failed.",py:"FAILED_DEPENDENCY",tier:"H"},
  {c:425,n:"Too Early",d:"The server will not process a request that might be replayed.",py:"TOO_EARLY",tier:"H"},
  {c:426,n:"Upgrade Required",d:"The client must switch to a different protocol, such as a newer TLS or HTTP version.",py:"UPGRADE_REQUIRED",tier:"H"},
  {c:428,n:"Precondition Required",d:"The server requires a conditional request to prevent lost updates.",py:"PRECONDITION_REQUIRED",tier:"H"},
  {c:429,n:"Too Many Requests",d:"The client sent too many requests in a time window.",t:"Check the Retry-After header and the documented rate limit. The fix is exponential backoff, not a faster retry loop.",py:"TOO_MANY_REQUESTS",tier:"E"},
  {c:431,n:"Request Header Fields Too Large",d:"The request headers are too large, often from oversized cookies.",py:"REQUEST_HEADER_FIELDS_TOO_LARGE",tier:"H"},
  {c:444,n:"No Response",d:"Unofficial nginx code. The server closed the connection without a response.",tier:"H",u:true},
  {c:451,n:"Unavailable For Legal Reasons",d:"Access is blocked for legal reasons.",py:"UNAVAILABLE_FOR_LEGAL_REASONS",tier:"H"},
  {c:499,n:"Client Closed Request",d:"Unofficial nginx code. The client closed the connection before the server answered.",t:"The client timeout is shorter than the server's processing time. Compare both timeout settings.",tier:"H",u:true},
  {c:500,n:"Internal Server Error",d:"The server hit an unexpected error.",t:"Collect the request ID, timestamp, endpoint, and payload, then escalate. The customer probably did nothing wrong.",py:"INTERNAL_SERVER_ERROR",tier:"E"},
  {c:501,n:"Not Implemented",d:"The server does not support the functionality the request needs.",py:"NOT_IMPLEMENTED",tier:"M"},
  {c:502,n:"Bad Gateway",d:"A gateway or proxy got an invalid response from the upstream server.",t:"The upstream service crashed or returned garbage. Check the status page and upstream logs.",py:"BAD_GATEWAY",tier:"E"},
  {c:503,n:"Service Unavailable",d:"The server is overloaded or down for maintenance.",t:"Check the status page and the Retry-After header. If every customer sees it, it is an incident, not a ticket.",py:"SERVICE_UNAVAILABLE",tier:"E"},
  {c:504,n:"Gateway Timeout",d:"A gateway or proxy did not get a response from upstream in time.",t:"The upstream is slow, not down. Look for long-running queries or large payloads.",py:"GATEWAY_TIMEOUT",tier:"E"},
  {c:505,n:"HTTP Version Not Supported",d:"The server does not support the HTTP version in the request.",py:"HTTP_VERSION_NOT_SUPPORTED",tier:"M"},
  {c:506,n:"Variant Also Negotiates",d:"The server's content negotiation is misconfigured.",py:"VARIANT_ALSO_NEGOTIATES",tier:"H"},
  {c:507,n:"Insufficient Storage",d:"The WebDAV server cannot store what the request needs.",py:"INSUFFICIENT_STORAGE",tier:"H"},
  {c:508,n:"Loop Detected",d:"The WebDAV server found an infinite loop.",py:"LOOP_DETECTED",tier:"H"},
  {c:510,n:"Not Extended",d:"The request needs further extensions to be fulfilled.",py:"NOT_EXTENDED",tier:"H"},
  {c:511,n:"Network Authentication Required",d:"The client must log in to the network first, such as a captive portal.",py:"NETWORK_AUTHENTICATION_REQUIRED",tier:"H"},
  {c:599,n:"Network Connect Timeout Error",d:"Unofficial code some proxies use when a network connection times out.",tier:"H",u:true}
];
const BY_CODE = Object.fromEntries(CODES.map(x => [x.c, x]));
const cls = c => Math.floor(c / 100);
const CLASSES = [
  {k:1,label:"Informational",short:"Hold on",d:"The server is still talking. Rare in support tickets."},
  {k:2,label:"Success",short:"It worked",d:"The request worked. Still read the body: some APIs hide errors inside a 200."},
  {k:3,label:"Redirection",short:"Go elsewhere",d:"The resource lives somewhere else. Watch for redirects that drop the method or body."},
  {k:4,label:"Client error",short:"Check the request",d:"Something about the customer's request is wrong. Start with their payload, headers, and credentials."},
  {k:5,label:"Server error",short:"Check our side",d:"The server or something upstream failed. Gather evidence and escalate."}
];
const CLASS_BY_K = Object.fromEntries(CLASSES.map(k => [k.k, k]));
const DIFFS = {
  Easy: CODES.filter(x => x.tier === "E"),
  Medium: CODES.filter(x => x.tier !== "H"),
  Hard: CODES
};
const PAIRS = [
  {t:"401 or 403", d:"401 means the server does not know who you are: the credentials are missing, invalid, or expired. 403 means it knows who you are and still says no: wrong scope, role, or IP allowlist."},
  {t:"400 or 422", d:"400 means the server could not parse the request, like broken JSON. 422 means it parsed fine, but the values failed validation."},
  {t:"404 or 410", d:"404 means not found, and it might come back or never existed. 410 means it was removed on purpose and will not return."},
  {t:"301 and 302, or 307 and 308", d:"301 and 308 are permanent. 302 and 307 are temporary. 307 and 308 keep the method and body; with 301 and 302, clients may turn a POST into a GET."},
  {t:"502, 503, or 504", d:"502: upstream sent back something invalid. 503: the service is overloaded or in maintenance. 504: upstream did not answer in time."},
  {t:"429 or 503", d:"429 means this client is rate limited. 503 means the service is struggling for everyone."},
  {t:"200, 204, or 304", d:"200 returns a body. 204 succeeds with no body. 304 says your cached copy is still good, and also sends no body."}
];
const MODES = { code: "Type the code", name: "Type the name" };
const chip = c => `<span class="chip k${cls(c)}">${c}</span>`;
const tagChip = c => `<a class="tag-chip" href="#/codes/${c}">${chip(c)}${BY_CODE[c].n}</a>`;

/* ---------- CONFIG ---------- */
// Paste the repo URL here once it's pushed. Empty means the footer link stays hidden.
const REPO_URL = "https://github.com/antofon/status-drop";

/* ---------- STORAGE ---------- */
const mem = {};
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return key in mem ? mem[key] : fallback; }
}
function save(key, value) {
  mem[key] = value;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
let rounds = load("sd_history", []);
let settings = load("sd_settings", { diff: "Easy", mode: "code" });
if (!settings.mode) settings.mode = "code";
const modeOf = r => r.mode || "code";
// Name mode: case insensitive, but spelling, hyphens, and apostrophes must match.
const norm = s => s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
const best = filter => rounds.filter(filter).reduce((m, r) => Math.max(m, r.score), 0);

function refreshBar() {
  const b = best(() => true);
  document.getElementById("chipBest").textContent = b;
  document.getElementById("chipRounds").textContent = rounds.length;
  document.getElementById("mmBest").textContent = b;
  document.getElementById("mmRounds").textContent = rounds.length;
}

/* ---------- MOBILE MENU ---------- */
const menuBtn = document.getElementById("menuBtn");
const mmenu = document.getElementById("mmenu");
let menuCloseTimer = null;
function openMenu() {
  if (G && G.running && !G.paused) pauseGame();   // never let the game run under the menu
  clearTimeout(menuCloseTimer);
  mmenu.classList.remove("closing");
  mmenu.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  menuBtn.setAttribute("aria-label", "Close menu");
  mmenu.querySelector("a").focus();
}
function closeMenu(returnFocus) {
  if (mmenu.hidden || mmenu.classList.contains("closing")) return;
  // play the same motion in reverse, then hide
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  mmenu.classList.add("closing");
  menuCloseTimer = setTimeout(() => { mmenu.hidden = true; mmenu.classList.remove("closing"); }, reduce ? 0 : 180);
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open menu");
  if (returnFocus) menuBtn.focus();
}
menuBtn.addEventListener("click", () => (mmenu.hidden || mmenu.classList.contains("closing")) ? openMenu() : closeMenu(true));
document.addEventListener("keydown", e => { if (e.key === "Escape" && !mmenu.hidden) { e.stopImmediatePropagation(); closeMenu(true); } }, true);
document.addEventListener("click", e => { if (!mmenu.hidden && !e.target.closest("header")) closeMenu(); });

/* ---------- LOGO ---------- */
// The falling-block mark, recolored as a wayfinding sign.
function logoSVG(size) {
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true" style="flex-shrink:0">
    <rect x="1" y="1" width="38" height="38" rx="10" fill="#FFC72C"/>
    <rect x="14" y="5" width="2.5" height="7" rx="1.25" fill="#000" opacity=".3"/>
    <rect x="19" y="3.5" width="2.5" height="10" rx="1.25" fill="#000" opacity=".55"/>
    <rect x="24" y="5" width="2.5" height="7" rx="1.25" fill="#000" opacity=".3"/>
    <rect x="7" y="16" width="26" height="17" rx="4.5" fill="#000"/>
    <text x="20" y="28.8" text-anchor="middle" font-family="Overpass, Arial, sans-serif" font-weight="900" font-size="11" fill="#FFC72C">4xx</text>
  </svg>`;
}

/* ---------- ROUTER ---------- */
const view = document.getElementById("view");
// Route from a variable, not location.hash, so links work inside sandboxed previews too.
let current = location.hash || "#/";
let countdownTimers = [];
function go(hash) {
  current = hash;
  try { window.history.replaceState(null, "", hash); } catch {}
  route();
}
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#/"]');
  if (!a) return;
  e.preventDefault();
  go(a.getAttribute("href"));
});
function route() {
  stopGame();
  countdownTimers.forEach(t => { clearTimeout(t); clearInterval(t); }); countdownTimers = [];
  document.removeEventListener("keydown", cardKeys);
  const parts = (current.replace(/^#\/?/, "") || "home").split("/");
  const section = parts[0] === "play" ? "home" : parts[0];
  document.querySelectorAll("header [data-route], footer [data-route]").forEach(a => {
    const on = a.dataset.route === section;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  closeMenu();
  window.scrollTo(0, 0);
  if (parts[0] === "codes" && parts[1]) return renderDetail(Number(parts[1]));
  ({ home: renderHome, play: renderPlay, learn: renderLearn, codes: renderCodes, history: renderHistory, about: renderAbout }[parts[0]] || renderHome)();
}
window.addEventListener("hashchange", () => { if (location.hash !== current) { current = location.hash; route(); } });

/* ---------- HOME ---------- */
const BOARD = [404, 503, 301];
const WHERE = { 1: "Wait", 2: "All good", 3: "Follow the redirect", 4: "Check the request", 5: "Check our side" };
const DOT = { 1: "var(--c1)", 2: "var(--c2)", 3: "var(--c3)", 4: "var(--c4)", 5: "var(--c5)" };

function renderHome(animate = true) {
  const pb = m => best(r => modeOf(r) === m && r.diff === settings.diff) || "none yet";
  view.innerHTML = `
    <div class="page home">
      <section>
        <h1>Read the sign before it lands.</h1>
        <p class="lede">Status codes are directions for every API call. Learn all ${CODES.length} by playing: names and codes fall, and you answer before they hit the floor.</p>
        <div class="board" aria-label="Sample status codes">
          <div class="board-head"><span>Code</span><span>Status</span><span>Where to look</span></div>
          ${BOARD.map(c => `<div class="board-row">
            <span class="flap code" data-text="${c}"></span>
            <span class="flap msg" data-text="${BY_CODE[c].n}"></span>
            <span class="where"><i style="background:${DOT[cls(c)]}"></i>${WHERE[cls(c)]}</span>
          </div>`).join("")}
        </div>
      </section>
      <section class="start" aria-labelledby="startTitle">
        <h2 id="startTitle">Start a round</h2>
        <p class="muted">Pick a level, then a way to play.</p>
        <div class="levels" role="group" aria-label="Level">
          ${Object.keys(DIFFS).map(d => `<button class="${settings.diff === d ? "on" : ""}" data-diff="${d}" aria-pressed="${settings.diff === d}">${d}<small>${DIFFS[d].length} codes</small></button>`).join("")}
        </div>
        <button class="mode" data-mode="code"><span class="plate">404</span><span><b>Type the code</b><span class="desc">A name falls. Type its three digits.</span></span></button>
        <button class="mode" data-mode="name"><span class="plate">Aa</span><span><b>Type the name</b><span class="desc">A code falls. Spell out its name.</span></span></button>
        <div class="start-foot">
          <span class="muted">Best on ${settings.diff}: code ${pb("code")}, name ${pb("name")}</span>
          <a href="#/history">History</a>
        </div>
      </section>
    </div>`;
  view.querySelectorAll("[data-diff]").forEach(b => b.onclick = () => { settings.diff = b.dataset.diff; save("sd_settings", settings); renderHome(false); });
  view.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => {
    settings.mode = b.dataset.mode; save("sd_settings", settings);
    autoStart = true; go("#/play");
  });
  flapBoard(animate);
}

// Split-flap settle: each character spins through letters, then lands. Runs once per visit.
function flapBoard(animate) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const reduce = !animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  view.querySelectorAll(".flap").forEach((el, row) => {
    const text = el.dataset.text;
    el.innerHTML = text.split(" ").map(w => `<span class="w">${[...w].map(ch => `<span>${ch}</span>`).join("")}</span>`).join("");
    if (reduce) return;
    const letters = text.replace(/ /g, "");
    [...el.querySelectorAll(".w > span")].forEach((span, i) => {
      const target = letters[i];
      let n = 0;
      const stop = 5 + Math.floor(row / 2) * 2 + Math.min(i, 10);
      const t = setInterval(() => {
        span.textContent = ++n >= stop ? target : chars[Math.floor(Math.random() * chars.length)];
        if (n >= stop) clearInterval(t);
      }, 45);
      countdownTimers.push(t);
    });
  });
}

/* ---------- PLAY ---------- */
const MAX_ACTIVE = 2, START_SPEED = 45, SPEED_STEP = 2.5, RESPAWN_MS = 500;
let G = null, autoStart = false;

function renderPlay() {
  const nameMode = settings.mode === "name";
  view.innerHTML = `
    <div class="page">
      <div class="play-top">
        <h1 class="what">${settings.diff}, ${MODES[settings.mode].toLowerCase()} <a href="#/">Change</a></h1>
      </div>
      <div>
          <div class="scoreline">
            <div class="lights" id="lights" role="img" aria-label="3 lives left"><span class="light"></span><span class="light"></span><span class="light"></span></div>
            <div class="score-side"><button class="pause" id="pauseBtn" aria-label="Pause" title="Pause (Esc)" disabled><span></span><span></span></button><div class="score">Score <b id="score">0</b></div></div>
          </div>
          <div class="arena" id="arena">
            <div class="overlay" id="overlay">
              <div class="overlay-card" id="ovCard">
                <h2>${MODES[settings.mode]}</h2>
                <p>${nameMode
                  ? "Codes fall. Type the full name before each one lands. Capitals don't matter. Spelling, hyphens, and apostrophes do."
                  : "Names fall. Type the three-digit code before each one lands."} Two fall at a time. Three misses ends the round.</p>
                <button class="btn" id="startBtn">Start</button>
              </div>
            </div>
          </div>
          <div class="answer-row">${nameMode
            ? `<input id="answer" class="wide" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type the name" aria-label="Your answer" disabled>`
            : `<input id="answer" inputmode="numeric" maxlength="3" autocomplete="off" placeholder="000" aria-label="Your answer" disabled>`}</div>
          ${nameMode ? `<p class="hint">It clears as soon as the name is right. Press Enter to wipe a wrong guess.</p>` : ""}
      </div>
    </div>`;
  document.getElementById("startBtn").onclick = countdown;
  document.getElementById("arena").onclick = () => { if (G && G.running) document.getElementById("answer").focus(); };
  const input = document.getElementById("answer");
  input.addEventListener("input", onAnswer);
  input.addEventListener("keydown", e => {
    if (e.key !== "Enter" || !G || !G.running || G.mode !== "name" || !input.value.trim()) return;
    wrongGuess(input);
  });
  document.getElementById("pauseBtn").onclick = pauseGame;
  if (autoStart) { autoStart = false; countdown(); }
}

/* ---------- PAUSE ---------- */
function onPauseKey(e) {
  if (e.key !== "Escape" || !G) return;
  if (G.paused) resumeGame(); else if (G.running) pauseGame();
}
document.addEventListener("keydown", onPauseKey);

function pauseGame() {
  if (!G || !G.running || G.paused) return;
  G.paused = true;
  G.pausedAt = performance.now();
  document.getElementById("arena").classList.add("is-paused");
  document.getElementById("answer").disabled = true;
  const wrap = document.createElement("div");
  wrap.className = "backdrop";
  wrap.id = "pauseModal";
  wrap.innerHTML = `
    <div class="modal pausebox" role="dialog" aria-modal="true" aria-labelledby="pTitle">
      <button class="modal-x" data-act="resume" aria-label="Close and resume">&times;</button>
      <h3 id="pTitle">Paused</h3>
      <p>You have ${G.lives} ${G.lives === 1 ? "life" : "lives"} left. The blocks are frozen until you press Resume.</p>
      <div class="pause-actions">
        <button class="btn" data-act="resume">Resume</button>
        <button class="btn quiet" data-act="restart">Start over</button>
        <button class="btn quiet" data-act="quit">Quit to home</button>
      </div>
      <p class="muted small">Start over and Quit don't save this round.</p>
    </div>`;
  wrap.addEventListener("click", e => {
    const act = (e.target.closest("[data-act]") || {}).dataset?.act;
    if (e.target === wrap || act === "resume") resumeGame();
    if (act === "restart") { closePause(); autoStart = true; go("#/play"); }
    if (act === "quit") { closePause(); go("#/"); }
  });
  document.body.appendChild(wrap);
  wrap.querySelector('.btn[data-act="resume"]').focus();
}

function closePause() {
  const m = document.getElementById("pauseModal");
  if (m) m.remove();
}

function resumeGame() {
  if (!G || !G.paused) return;
  closePause();
  G.started += performance.now() - G.pausedAt;   // paused time doesn't count as time survived
  G.paused = false;
  G.last = 0;                                      // no jump in the first frame back
  document.getElementById("arena").classList.remove("is-paused");
  const input = document.getElementById("answer");
  input.disabled = false; input.focus();
  for (let i = G.blocks.length; i < MAX_ACTIVE; i++) G.timers.push(setTimeout(spawn, 300 + i * 900));
  requestAnimationFrame(tick);
}

function countdown() {
  const card = document.getElementById("ovCard");
  card.style.background = "transparent"; card.style.border = "none";
  [3, 2, 1].forEach((n, i) => countdownTimers.push(setTimeout(() => { card.innerHTML = `<div class="count">${n}</div>`; }, i * 600)));
  countdownTimers.push(setTimeout(startGame, 1800));
}

function startGame() {
  const nameMode = settings.mode === "name";
  G = {
    running: true, blocks: [], score: 0, lives: 3,
    // names take longer to type, so they fall slower and speed up gently
    speed: nameMode ? START_SPEED * 0.6 : START_SPEED,
    step: nameMode ? SPEED_STEP * 0.6 : SPEED_STEP,
    last: 0, started: performance.now(), missed: [], timers: [],
    pool: DIFFS[settings.diff], diff: settings.diff, mode: settings.mode
  };
  document.getElementById("overlay").style.display = "none";
  document.getElementById("pauseBtn").disabled = false;
  const input = document.getElementById("answer");
  input.disabled = false; input.value = ""; input.focus();
  spawn();
  G.timers.push(setTimeout(spawn, 1400));
  requestAnimationFrame(tick);
}

function stopGame() {
  closePause();
  if (!G) return;
  G.running = false;
  G.timers.forEach(clearTimeout);
  G = null;
}

function spawn() {
  if (!G || !G.running || G.paused || G.blocks.length >= MAX_ACTIVE) return;
  const arena = document.getElementById("arena");
  const taken = new Set(G.blocks.map(b => b.code));
  const options = G.pool.filter(x => !taken.has(x.c));
  const pick = options[Math.floor(Math.random() * options.length)];
  const el = document.createElement("div");
  el.className = G.mode === "name" ? "block num" : "block";
  el.textContent = G.mode === "name" ? String(pick.c) : pick.n;
  arena.appendChild(el);
  const maxX = Math.max(arena.clientWidth - el.offsetWidth - 16, 16);
  let x, tries = 0;
  do { x = 16 + Math.random() * (maxX - 16); tries++; }
  while (tries < 20 && G.blocks.some(b => Math.abs(b.x - x) < el.offsetWidth));
  const b = { code: pick.c, name: pick.n, el, x, y: -el.offsetHeight };
  place(b);
  G.blocks.push(b);
}

function place(b) {
  const pos = `translate(${b.x}px, ${b.y}px)`;
  b.el.style.transform = pos;
  b.el.style.setProperty("--pos", pos);
}

function removeBlock(b, how) {
  G.blocks = G.blocks.filter(x => x !== b);
  b.el.classList.add(how);
  if (how === "hit") b.el.classList.add(`k${cls(b.code)}c`);
  setTimeout(() => b.el.remove(), how === "hit" ? 280 : 400);
  G.timers.push(setTimeout(spawn, RESPAWN_MS));
}

function tick(t) {
  if (!G || !G.running || G.paused) return;
  const dt = G.last ? (t - G.last) / 1000 : 0;
  G.last = t;
  const floor = document.getElementById("arena").clientHeight - 10;
  for (const b of [...G.blocks]) {
    b.y += G.speed * dt;
    place(b);
    if (b.y + b.el.offsetHeight >= floor) {
      G.missed.push(b.code);
      removeBlock(b, "miss");
      G.lives--;
      document.querySelectorAll(".light").forEach((l, i) => l.classList.toggle("out", i >= G.lives));
      document.getElementById("lights").setAttribute("aria-label", `${G.lives} ${G.lives === 1 ? "life" : "lives"} left`);
      if (G.lives <= 0) return endGame();
    }
  }
  requestAnimationFrame(tick);
}

function onAnswer(e) {
  const input = e.target;
  if (!G || !G.running) return;
  if (G.mode === "code") {
    input.value = input.value.replace(/\D/g, "");
    const match = G.blocks.find(b => b.code === Number(input.value));
    if (match) return hit(match, input);
    if (input.value.length === 3) wrongGuess(input);
    return;
  }
  const typed = norm(input.value);
  const match = G.blocks.find(b => norm(b.name) === typed);
  if (match) return hit(match, input);
  // red border once the text can't become any falling name
  const possible = !typed || G.blocks.some(b => norm(b.name).startsWith(typed));
  input.classList.toggle("off", !possible);
}

function hit(block, input) {
  removeBlock(block, "hit");
  G.score++;
  G.speed += G.step;
  document.getElementById("score").textContent = G.score;
  input.value = "";
  input.classList.remove("off");
}

function wrongGuess(input) {
  input.classList.remove("off");
  input.classList.add("wrong");
  setTimeout(() => { input.classList.remove("wrong"); input.value = ""; }, 250);
}

function endGame() {
  const seconds = Math.round((performance.now() - G.started) / 1000);
  const prevBest = best(r => r.diff === G.diff && modeOf(r) === G.mode);
  const round = { at: new Date().toISOString(), diff: G.diff, mode: G.mode, score: G.score, seconds, missed: G.missed };
  rounds.unshift(round);
  save("sd_history", rounds);
  refreshBar();
  stopGame();
  renderResults(round, prevBest);
}

function renderResults(r, prevBest) {
  const isNew = r.score > prevBest && r.score > 0;
  const same = rounds.filter(x => x.diff === r.diff && modeOf(x) === r.mode);
  const rank = [...same].sort((a, b) => b.score - a.score).indexOf(r) + 1;
  const avg = r.score ? (r.seconds / r.score).toFixed(1) + "s" : "none";
  view.innerHTML = `
    <div class="page result">
      <h1>Round over</h1>
      <p class="muted">${r.diff}, ${MODES[r.mode].toLowerCase()}</p>
      <div class="result-grid">
        <div class="stat big"><small>Score</small><b>${r.score}</b></div>
        <div class="stat"><small>Personal best</small><b>${Math.max(prevBest, r.score)}${isNew ? '<span class="new">New</span>' : ""}</b></div>
        <div class="stat"><small>Rank in your rounds</small><b>${rank} of ${same.length}</b></div>
        <div class="stat"><small>Time survived</small><b>${r.seconds}s</b></div>
        <div class="stat"><small>Average per code</small><b>${avg}</b></div>
      </div>
      <h2>Landed before you answered</h2>
      <div>${r.missed.length ? r.missed.map(tagChip).join("") : '<p class="muted">Nothing. Clean round.</p>'}</div>
      ${r.missed.length ? `<p class="muted" style="margin-top:12px">These are now in your misses deck on <a href="#/learn">Learn</a>.</p>` : ""}
      <div class="result-actions">
        <button class="btn" id="again">Play again</button>
        <a class="btn quiet" href="#/">Change level or mode</a>
        <a class="btn quiet" href="#/history">History</a>
      </div>
    </div>`;
  document.getElementById("again").onclick = () => { autoStart = true; go("#/play"); };
}

/* ---------- CODES ---------- */
function renderCodes() {
  view.innerHTML = `
    <div class="page">
      <h1 style="font-size:48px">Every code, by class</h1>
      <p class="lede" style="margin-top:10px">Color tells you the class. Open any code for what it means and how it shows up in a support ticket.</p>
      <div class="dir-tools"><input class="search" id="q" placeholder="Search by number or name, like 5 or timeout" aria-label="Search codes"></div>
      <div class="dir" id="list"></div>
    </div>`;
  const draw = q => {
    q = q.trim().toLowerCase();
    document.getElementById("list").innerHTML = CLASSES.map(k => {
      const rows = CODES.filter(x => cls(x.c) === k.k && (!q || String(x.c).startsWith(q) || x.n.toLowerCase().includes(q)));
      if (!rows.length) return "";
      return `<section class="dir-group">
        <div class="dir-band k${k.k}"><b>${k.k}xx ${k.label}</b><button class="band-btn" data-practice="${k.k}xx">Practice these</button></div>
        ${rows.map(x => `<a class="dir-row" href="#/codes/${x.c}"><b>${x.c}</b><span>${x.n}</span><em>${x.u ? "unofficial" : x.tier === "E" ? "common" : ""}</em></a>`).join("")}
      </section>`;
    }).join("") || '<p class="muted">No codes match. Try a number like 4, or a word like gateway.</p>';
  };
  document.getElementById("q").oninput = e => draw(e.target.value);
  document.getElementById("list").addEventListener("click", e => {
    const b = e.target.closest("[data-practice]");
    if (!b) return;
    buildDeck(b.dataset.practice);
    go("#/learn");
  });
  draw("");
}

function renderDetail(code) {
  const x = BY_CODE[code];
  if (!x) return go("#/codes");
  const i = CODES.indexOf(x), prev = CODES[i - 1], next = CODES[i + 1];
  const k = CLASS_BY_K[cls(code)];
  const levels = x.tier === "E" ? "Easy, Medium, and Hard" : x.tier === "M" ? "Medium and Hard" : "Hard";
  view.innerHTML = `
    <div class="page narrow">
      <a class="back" href="#/codes">All codes</a>
      <div><h1 class="plate-big k${k.k}"><b>${x.c}</b><span>${x.n}</span></h1></div>
      <p class="class-line">${k.k}xx ${k.label.toLowerCase()}: ${k.short.toLowerCase()}.${x.u ? " Not part of the HTTP standard." : ""}</p>
      <p class="def">${x.d}</p>
      ${x.t ? `<div class="note"><b>In a support ticket</b>${x.t}</div>` : ""}
      <div class="ref">${x.py ? `Python <code>http.HTTPStatus.${x.py}</code>` : `<span class="muted">No Python standard library constant.</span>`}</div>
      <p class="muted" style="margin-top:14px">Appears on ${levels}.</p>
      <div class="pager">
        ${prev ? `<a href="#/codes/${prev.c}">${chip(prev.c)}${prev.n}</a>` : "<span></span>"}
        ${next ? `<a href="#/codes/${next.c}">${next.n}${chip(next.c)}</a>` : "<span></span>"}
      </div>
    </div>`;
}

/* ---------- LEARN ---------- */
let deck = [], card = 0, flipped = false, deckName = "Common", known = 0, front = "name";

function missedCodes() {
  const counts = {};
  rounds.forEach(r => r.missed.forEach(c => counts[c] = (counts[c] || 0) + 1));
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([c]) => BY_CODE[c]).filter(Boolean);
}

// Study decks don't overlap: each one is new material. (Game levels still stack.)
const STUDY = {
  "Common": CODES.filter(x => x.tier === "E"),
  "Less common": CODES.filter(x => x.tier === "M"),
  "Rare": CODES.filter(x => x.tier === "H")
};
const DECKS = [...Object.keys(STUDY), "Misses"];
const deckSize = d => d === "Misses" ? missedCodes().length : STUDY[d].length;
function buildDeck(name) {
  deckName = name;
  const src = name === "Misses" ? missedCodes()
    : /^\dxx$/.test(name) ? CODES.filter(x => cls(x.c) === Number(name[0]))
    : STUDY[name];
  deck = [...src].sort(() => Math.random() - .5);
  card = 0; flipped = false; known = 0;
}

function renderLearn() {
  if (!deck.length) buildDeck(deckName);
  view.innerHTML = `
    <div class="page">
      <h1 style="font-size:48px">Learn the codes</h1>
      <p class="lede" style="margin-top:10px">Drill with flashcards. The classes and the pairs people mix up are below.</p>
      <p class="newhere">New here? <button class="linkish" id="toBasics">Read how the first digit works below.</button></p>

      <div class="deck-tools" id="drill">
        <div class="seg wrap" role="group" aria-label="Deck">
          ${DECKS.map(d => `<button class="${deckName === d ? "on" : ""}" data-deck="${d}">${d} <span class="cnt">${deckSize(d)}</span></button>`).join("")}
          ${/^\dxx$/.test(deckName) ? `<button class="on" data-deck="Common" aria-label="Stop studying ${deckName}, back to Common">${deckName} ${CLASS_BY_K[deckName[0]].label.toLowerCase()} <span class="cnt">${deck.length}</span> &times;</button>` : ""}
        </div>
        <div class="seg" role="group" aria-label="Show first">
          <button class="${front === "name" ? "on" : ""}" data-front="name">Name first</button>
          <button class="${front === "code" ? "on" : ""}" data-front="code">Code first</button>
        </div>
      </div>
      <div class="progress"><i id="prog"></i></div>
      <div id="cardWrap"></div>

      <h2 id="basics" tabindex="-1">The first digit tells you where to look</h2>
      <div class="ladder">${CLASSES.map(k => `<div class="rung"><span class="chip k${k.k}">${k.k}xx</span><strong>${k.short}</strong><p>${k.d}</p></div>`).join("")}</div>

      <h2>Pairs people mix up</h2>
      <div class="pairs">${PAIRS.map(p => `<div class="pair"><h3>${p.t}</h3><p>${p.d}</p></div>`).join("")}</div>
    </div>`;
  document.getElementById("toBasics").onclick = () => {
    const h = document.getElementById("basics");
    h.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    h.focus({ preventScroll: true });
  };
  view.querySelectorAll("[data-deck]").forEach(b => b.onclick = () => { buildDeck(b.dataset.deck); renderLearn(); });
  view.querySelectorAll("[data-front]").forEach(b => b.onclick = () => { front = b.dataset.front; flipped = false; renderLearn(); });
  document.addEventListener("keydown", cardKeys);
  drawCard(true);
}

function drawCard(entering) {
  const wrap = document.getElementById("cardWrap");
  const prog = document.getElementById("prog");
  if (!wrap) return;
  prog.style.width = deck.length ? `${Math.min(known / deck.length, 1) * 100}%` : "0";
  if (!deck.length) {
    wrap.innerHTML = `<div class="flipcard"><div class="inner"><div class="face"><p class="prompt" style="font-size:26px">No misses yet</p><p>Codes that hit the floor in a round land here. <a href="#/">Play a round</a>.</p></div></div></div>`;
    return;
  }
  if (card >= deck.length) {
    wrap.innerHTML = `<div class="flipcard"><div class="inner"><div class="face"><p class="prompt">Deck finished</p><p>You marked ${known} cards as known on ${deckName}.</p><button class="btn" id="redo">Shuffle and go again</button></div></div></div>`;
    document.getElementById("redo").onclick = () => { buildDeck(deckName); drawCard(true); };
    return;
  }
  const x = deck[card];
  const nameFace = `<span class="prompt">${x.n}</span>`;
  const codeFace = `<span class="chip k${cls(x.c)}" style="font-size:64px;padding:12px 20px 6px;border-radius:10px">${x.c}</span>`;
  wrap.innerHTML = `
    <div class="flipcard ${flipped ? "flipped" : ""} ${entering ? "enter" : ""}" id="fc" role="button" tabindex="0" aria-label="Flip card">
      <div class="inner">
        <div class="face">${front === "name" ? nameFace : codeFace}<span class="tap">Say it out loud, then flip</span></div>
        <div class="face back">
          <div class="ans">${chip(x.c)}<span>${x.n}</span></div>
          <p>${x.d}</p>
          ${x.t ? `<p class="muted">${x.t}</p>` : ""}
        </div>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn quiet" id="again2">Still learning</button>
      <button class="btn" id="got">Got it</button>
    </div>
    <p class="kbd">Card ${card + 1} of ${deck.length}. <kbd>Space</kbd> flips, <kbd>1</kbd> still learning, <kbd>2</kbd> got it.</p>`;
  document.getElementById("fc").onclick = flip;
  document.getElementById("got").onclick = () => nextCard(true);
  document.getElementById("again2").onclick = () => nextCard(false);
}

function flip() {
  const fc = document.getElementById("fc");
  if (!fc) return;
  flipped = !flipped;
  fc.classList.remove("enter");
  fc.classList.toggle("flipped", flipped);
}

let leaving = false;
function nextCard(gotIt) {
  const fc = document.getElementById("fc");
  if (!fc || leaving) return;
  leaving = true;
  fc.classList.remove("enter");
  if (!flipped) { flipped = true; fc.classList.add("flipped"); }
  if (gotIt) known++; else deck.push(deck[card]);
  fc.classList.add(gotIt ? "leave-r" : "leave-l");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setTimeout(() => { leaving = false; card++; flipped = false; drawCard(true); }, reduce ? 0 : 230);
}

function cardKeys(e) {
  if (!document.getElementById("fc") || e.target.tagName === "INPUT") return;
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
  if (e.key === "1") nextCard(false);
  if (e.key === "2") nextCard(true);
}

/* ---------- HISTORY ---------- */
const PER_PAGE = 5;
let histPage = 1;
function renderHistory(page = 1) {
  const pages = Math.max(1, Math.ceil(rounds.length / PER_PAGE));
  histPage = Math.min(Math.max(1, page), pages);
  const shown = rounds.slice((histPage - 1) * PER_PAGE, histPage * PER_PAGE);
  const bestOf = (d, m) => best(r => r.diff === d && modeOf(r) === m);
  const total = rounds.reduce((s, r) => s + r.score, 0);
  const allMisses = missedCodes();
  const misses = allMisses.slice(0, 8);
  view.innerHTML = `
    <div class="page">
      <h1 style="font-size:48px">History</h1>
      <p class="lede" style="margin-top:10px">Every round, newest first. Saved in this browser.</p>
      <h2>Totals</h2>
      <div class="tiles">
        <div class="stat"><small>Rounds</small><b>${rounds.length}</b></div>
        <div class="stat"><small>Codes answered</small><b>${total}</b></div>
        <div class="stat"><small>Best, type the code</small><b>${best(r => modeOf(r) === "code")}</b></div>
        <div class="stat"><small>Best, type the name</small><b>${best(r => modeOf(r) === "name")}</b></div>
      </div>
      <h2>Most missed${allMisses.length > 8 ? ` <span class="muted" style="font-weight:600;font-size:16px">top 8 of ${allMisses.length}</span>` : ""}</h2>
      <div>${misses.length ? misses.map(x => tagChip(x.c)).join("") + `<p style="margin-top:12px"><a href="#/learn" id="drillLink">${allMisses.length > 8 ? `Drill all ${allMisses.length} as flashcards` : `Drill ${allMisses.length === 1 ? "this one" : `these ${allMisses.length}`} as flashcards`}</a></p>` : '<p class="muted">No misses yet.</p>'}</div>
      <h2 id="roundsTitle" tabindex="-1">Rounds${rounds.length > PER_PAGE ? ` <span class="muted" style="font-weight:600;font-size:16px">${rounds.length} total</span>` : ""}</h2>
      <div class="log">
        <div class="log-row head"><span>When</span><span>Level and mode</span><span>Score</span><span class="hide-sm">Time</span><span class="hide-sm">Per code</span></div>
        ${rounds.length ? shown.map(r => {
          const pb = r.score > 0 && r.score === bestOf(r.diff, modeOf(r));
          return `<div class="log-row">
            <span>${new Date(r.at).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
            <span>${r.diff}, ${modeOf(r) === "name" ? "name" : "code"}</span>
            <span><b>${r.score}</b>${pb ? '<span class="pb">Best</span>' : ""}</span>
            <span class="hide-sm">${r.seconds}s</span>
            <span class="hide-sm">${r.score ? (r.seconds / r.score).toFixed(1) + "s" : "none"}</span>
            ${r.missed.length ? `<div class="log-miss">${r.missed.map(tagChip).join("")}</div>` : ""}
          </div>`;
        }).join("") : '<div class="log-row"><span class="muted" style="grid-column:1/-1">No rounds yet. <a href="#/">Play your first one</a>.</span></div>'}
      </div>
      ${pages > 1 ? `<nav class="hpager" aria-label="Rounds pages">
        <button class="btn quiet" id="prevPage" ${histPage === 1 ? "disabled" : ""}>Newer</button>
        <span aria-live="polite">Page ${histPage} of ${pages}</span>
        <button class="btn quiet" id="nextPage" ${histPage === pages ? "disabled" : ""}>Older</button>
      </nav>` : ""}
      ${rounds.length ? `<p style="margin-top:20px"><button class="btn quiet" id="clear">Clear history</button></p>` : ""}
    </div>`;
  const turn = p => {
    renderHistory(p);
    const h = document.getElementById("roundsTitle");
    h.scrollIntoView({ block: "start" }); h.focus({ preventScroll: true });
  };
  const prev = document.getElementById("prevPage"), next = document.getElementById("nextPage");
  if (prev) prev.onclick = () => turn(histPage - 1);
  if (next) next.onclick = () => turn(histPage + 1);
  const drill = document.getElementById("drillLink");
  if (drill) drill.addEventListener("click", () => buildDeck("Misses"), true);
  const clear = document.getElementById("clear");
  if (clear) clear.onclick = () => confirmModal({
    title: "Clear all history?",
    text: `This deletes ${rounds.length} round${rounds.length === 1 ? "" : "s"}, your best scores, and your misses deck. You can't undo this.`,
    confirmLabel: "Clear history",
    onConfirm: () => { rounds = []; save("sd_history", rounds); refreshBar(); renderHistory(); }
  });
}

/* ---------- ABOUT ---------- */
function renderAbout() {
  view.innerHTML = `
    <div class="page narrow about">
      <h1>Why this exists</h1>
      <p class="opener">A customer writes in: "the API is broken." The first question is always the same: what status code did you get? A ${chip(401)} and a ${chip(403)} send you down completely different paths. So does a ${chip(502)} versus a ${chip(504)}.</p>
      <p>Reading that code correctly is the fastest way to a fix. Status Drop turns that skill into a game: codes fall, and you answer before they land. Miss one, and it lands in your flashcard deck until you know it.</p>

      <h2>What's here</h2>
      <p><a href="#/">The game</a>, <a href="#/learn">flashcards</a> built from your misses, and <a href="#/codes">a reference for all ${CODES.length} codes</a> with notes on how each one shows up in a support ticket.</p>

      <h2>The details</h2>
      <p>Definitions are written for this game, based on <a href="https://www.rfc-editor.org/rfc/rfc9110" target="_blank" rel="noopener">RFC 9110</a> and related RFCs. Unofficial codes are marked. Plain HTML, CSS, and JavaScript. No tracking. Scores stay in your browser.</p>
    </div>`;
}

/* ---------- MODAL ---------- */
function confirmModal({ title, text, confirmLabel, onConfirm }) {
  const wrap = document.createElement("div");
  wrap.className = "backdrop";
  wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle">
      <h3 id="mTitle">${title}</h3>
      <p>${text}</p>
      <div class="modal-actions">
        <button class="btn quiet" data-act="cancel">Cancel</button>
        <button class="btn stop" data-act="ok">${confirmLabel}</button>
      </div>
    </div>`;
  const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = e => { if (e.key === "Escape") close(); };
  wrap.addEventListener("click", e => {
    if (e.target === wrap || e.target.dataset.act === "cancel") close();
    if (e.target.dataset.act === "ok") { close(); onConfirm(); }
  });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(wrap);
  wrap.querySelector('[data-act="cancel"]').focus();
}

document.getElementById("brand").innerHTML = logoSVG(36) + "<span>Status Drop</span>";
if (REPO_URL) { const r = document.getElementById("repoLink"); r.href = REPO_URL; r.hidden = false; }
refreshBar();
route();
