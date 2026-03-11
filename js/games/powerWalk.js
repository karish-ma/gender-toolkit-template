/**
 * Activity 2 — Power Walk: Step Forward, Step Back
 * Self-contained, data embedded
 */

const GAME_ID = 'power-walk';
const STORAGE_KEY = 'giz_gm_progress';
const SCORES_KEY  = 'giz_gm_scores';

function markComplete(id, score) {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    p[id] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    if (score !== undefined) {
      const s = JSON.parse(localStorage.getItem(SCORES_KEY)) || {};
      s[id] = score;
      localStorage.setItem(SCORES_KEY, JSON.stringify(s));
    }
  } catch(e) {}
}

// Renders a coloured circle with initials instead of an emoji
function charBadge(initials, color, large) {
  const cls = large ? 'char-badge char-badge-lg' : 'char-badge';
  return `<div class="${cls}" style="background:${color}">${initials}</div>`;
}

// Maps position -5..+5 to 10%..90% of track width
function trackPct(pos) {
  return 10 + ((Math.max(-5, Math.min(5, pos)) + 5) / 10) * 80;
}

// ─── CUSTOMISE THIS ──────────────────────────────────────────────────────────
// Replace this DATA object with the output from Task 2 of CUSTOMISE.md
// Character ids used in direction objects must match the ids in DATA.characters
// ─────────────────────────────────────────────────────────────────────────────
const DATA = {
  characters: [
    {
      id: 'char1', name: '[Name]', role: '[Role in your organisation]',
      initials: 'C1',
      description: 'Replace with a 2–3 sentence profile including age, background, and one structural detail about their position.',
      color: '#E74C3C'
    },
    {
      id: 'char2', name: '[Name]', role: '[Role in your organisation]',
      initials: 'C2',
      description: 'Replace with a 2–3 sentence profile. This character should have significant structural advantages.',
      color: '#2980B9'
    },
    {
      id: 'char3', name: '[Name]', role: '[Role in your organisation]',
      initials: 'C3',
      description: 'Replace with a 2–3 sentence profile.',
      color: '#8E44AD'
    },
    {
      id: 'char4', name: '[Name]', role: '[Role in your organisation]',
      initials: 'C4',
      description: 'Replace with a 2–3 sentence profile.',
      color: '#27AE60'
    },
    {
      id: 'char5', name: '[Name]', role: '[Role in your organisation]',
      initials: 'C5',
      description: 'Replace with a 2–3 sentence profile. This character should have multiple intersecting disadvantages.',
      color: '#D35400'
    }
  ],
  statements: [
    {
      id: 's1',
      text: 'Step forward if [replace with a statement specific to your industry context].',
      direction: { char1: 'back', char2: 'forward', char3: 'stay', char4: 'forward', char5: 'back' },
      reflection: 'Replace with 2–3 sentences explaining the gender or power logic behind who moved and who did not.',
      principle: '[Principle Name]'
    },
    {
      id: 's2',
      text: 'Step forward if [replace with a second statement].',
      direction: { char1: 'back', char2: 'forward', char3: 'back', char4: 'forward', char5: 'back' },
      reflection: 'Replace with reflection text.',
      principle: '[Principle Name]'
    },
    {
      id: 's3',
      text: 'Step forward if [replace with a third statement].',
      direction: { char1: 'back', char2: 'forward', char3: 'stay', char4: 'forward', char5: 'back' },
      reflection: 'Replace with reflection text.',
      principle: '[Principle Name]'
    },
    {
      id: 's4',
      text: 'Step forward if [replace with a fourth statement].',
      direction: { char1: 'back', char2: 'forward', char3: 'back', char4: 'forward', char5: 'back' },
      reflection: 'Replace with reflection text.',
      principle: '[Principle Name]'
    },
    {
      id: 's5',
      text: 'Step forward if [replace with a fifth statement].',
      direction: { char1: 'forward', char2: 'forward', char3: 'forward', char4: 'forward', char5: 'back' },
      reflection: 'Replace with reflection text.',
      principle: '[Principle Name]'
    }
  ],
  finalMessage: 'Replace with a one-sentence reflection prompt for participants after seeing everyone\'s final positions.'
};

let selectedChar = null;
let currentStatement = 0;
let positions = {};
let decisions = [];
let gamePhase = 'select';

function init() {
  DATA.characters.forEach(c => { positions[c.id] = 0; });
  renderPhase();
}

function renderPhase() {
  if (gamePhase === 'select') renderSelect();
  else if (gamePhase === 'play') renderPlay();
  else if (gamePhase === 'reveal') renderReveal();
}

// ─── Select ─────────────────────────────────────────────────────────────────

function renderSelect() {
  const stage = document.getElementById('gameStage');
  if (!stage) return;
  stage.innerHTML = `
    <h2 class="mb-2" style="color:var(--teal-dark)">Choose your character</h2>
    <p class="text-muted mb-3">You will experience the power walk from their perspective. Each character occupies a different position in the same institution.</p>
    <div id="charGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;"></div>
  `;
  const grid = document.getElementById('charGrid');
  DATA.characters.forEach(char => {
    const card = document.createElement('button');
    card.className = 'char-select-card';
    card.dataset.charId = char.id;
    card.style.cssText = `background:white;border:2px solid var(--border);border-radius:var(--radius-md);padding:1.25rem;cursor:pointer;text-align:left;font-family:inherit;transition:all var(--transition);width:100%;`;
    card.innerHTML = `
      <div style="margin-bottom:0.75rem">${charBadge(char.initials, char.color, true)}</div>
      <div style="font-weight:700;color:var(--teal-dark);margin-bottom:0.2rem">${char.name}</div>
      <div style="font-size:0.8rem;color:var(--coral);font-weight:600;margin-bottom:0.5rem">${char.role}</div>
      <div style="font-size:0.85rem;color:var(--text-secondary)">${char.description}</div>
    `;
    card.addEventListener('mouseover', () => {
      card.style.borderColor = char.color;
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = 'var(--shadow-md)';
    });
    card.addEventListener('mouseout', () => {
      if (selectedChar?.id !== char.id) {
        card.style.borderColor = 'var(--border)';
        card.style.transform = '';
        card.style.boxShadow = '';
      }
    });
    card.addEventListener('click', () => selectChar(char, card));
    grid.appendChild(card);
  });
}

function selectChar(char, cardEl) {
  selectedChar = char;
  document.querySelectorAll('.char-select-card').forEach(c => {
    c.style.borderColor = 'var(--border)';
    c.style.transform = '';
    c.style.boxShadow = '';
    c.style.background = 'white';
  });
  cardEl.style.borderColor = char.color;
  cardEl.style.background = `${char.color}10`;
  cardEl.style.boxShadow = 'var(--shadow-md)';

  let startBtn = document.getElementById('startWalkBtn');
  if (!startBtn) {
    startBtn = document.createElement('button');
    startBtn.id = 'startWalkBtn';
    startBtn.className = 'btn btn-primary btn-lg mt-4';
    document.getElementById('gameStage').appendChild(startBtn);
  }
  startBtn.textContent = `Start as ${char.name}  →`;
  startBtn.onclick = () => { gamePhase = 'play'; currentStatement = 0; renderPhase(); };
}

// ─── Play ────────────────────────────────────────────────────────────────────

function renderPlay() {
  const stage = document.getElementById('gameStage');
  const stmt = DATA.statements[currentStatement];
  const total = DATA.statements.length;

  stage.innerHTML = `
    <div class="step-dots mb-3" id="stepDots"></div>
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap">
      ${charBadge(selectedChar.initials, selectedChar.color, false)}
      <div>
        <div style="font-weight:700;color:var(--teal-dark)">${selectedChar.name}</div>
        <div style="font-size:0.8rem;color:var(--text-secondary)">${selectedChar.role}</div>
      </div>
      <span class="badge badge-teal" style="margin-left:auto">Statement ${currentStatement + 1} of ${total}</span>
    </div>
    <div class="statement-card">
      <div class="statement-text">"${stmt.text}"</div>
      <div style="font-size:0.8rem;color:var(--text-light)">Does this apply to you? How does it affect your position?</div>
    </div>
    <div class="step-buttons mt-3">
      <button class="btn btn-primary" data-action="forward">Step Forward</button>
      <button class="btn" style="background:var(--sand);color:var(--text-primary);border:2px solid var(--border)" data-action="stay">Stay</button>
      <button class="btn btn-coral" data-action="back">Step Back</button>
    </div>
    <div class="walk-track-container mt-3">
      <div class="walk-track-labels">
        <span>← Step Back</span>
        <span>Step Forward →</span>
      </div>
      <div class="walk-track-bar" id="walkTrackBar">
        <div class="walk-track-center-mark"></div>
        <div class="walk-track-dot" id="walkDot" style="background:${selectedChar.color};left:calc(${trackPct(positions[selectedChar.id])}% - 20px)">${selectedChar.initials}</div>
      </div>
    </div>
    <div id="stmtReveal" class="reveal-panel reveal-info hidden mt-3">
      <div class="reveal-label">Reflection</div>
      <div id="stmtReflection"></div>
      <div class="mt-2"><strong>Structural dimension:</strong> <span id="stmtPrinciple" class="badge badge-teal"></span></div>
    </div>
    <div id="nextBtnWrap" class="hidden mt-3">
      <button id="nextBtn" class="btn btn-primary">${currentStatement + 1 < total ? 'Next Statement →' : 'See Results →'}</button>
    </div>
  `;

  renderStepDots(total);
  stage.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => handleStep(btn.dataset.action, stmt)));
}

function renderStepDots(total) {
  const dotsEl = document.getElementById('stepDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
    `<div class="step-dot ${i < currentStatement ? 'done' : i === currentStatement ? 'active' : ''}"></div>`
  ).join('');
}

function handleStep(action, stmt) {
  decisions.push({ statementId: stmt.id, action });
  if (action === 'forward') positions[selectedChar.id]++;
  else if (action === 'back') positions[selectedChar.id]--;

  // Disable buttons immediately
  document.querySelectorAll('[data-action]').forEach(b => b.disabled = true);

  // Flash the clicked button
  const clickedBtn = document.querySelector(`[data-action="${action}"]`);
  if (clickedBtn) {
    const flash = action === 'forward' ? '#27AE60' : action === 'back' ? '#E74C3C' : '#555';
    const orig = clickedBtn.style.background || '';
    clickedBtn.style.background = flash;
    clickedBtn.style.transform = 'scale(1.06)';
    setTimeout(() => { clickedBtn.style.background = orig; clickedBtn.style.transform = ''; }, 300);
  }

  // Animate the walk track dot
  const dot = document.getElementById('walkDot');
  if (dot) {
    const newPct = trackPct(positions[selectedChar.id]);
    dot.style.left = `calc(${newPct}% - 20px)`;

    // Pulse the dot
    dot.style.transform = 'scale(1.3)';
    setTimeout(() => { dot.style.transform = 'scale(1)'; }, 350);

    // Floating +1 / -1 / · label
    if (action !== 'stay') {
      const float = document.createElement('div');
      float.className = 'walk-float-label';
      float.textContent = action === 'forward' ? '+1' : '−1';
      float.style.color = action === 'forward' ? '#27AE60' : '#E74C3C';
      float.style.left = `calc(${newPct}% - 10px)`;
      dot.parentElement.appendChild(float);
      setTimeout(() => float.remove(), 700);
    } else {
      dot.style.animation = 'dotWobble 0.4s ease';
      setTimeout(() => { dot.style.animation = ''; }, 400);
    }
  }

  // Reveal reflection after animation has time to register
  setTimeout(() => {
    const reveal = document.getElementById('stmtReveal');
    if (reveal) {
      reveal.classList.remove('hidden');
      document.getElementById('stmtReflection').textContent = stmt.reflection;
      document.getElementById('stmtPrinciple').textContent = stmt.principle;
    }
    document.getElementById('nextBtnWrap').classList.remove('hidden');
    document.getElementById('nextBtn').addEventListener('click', () => {
      currentStatement++;
      if (currentStatement >= DATA.statements.length) { gamePhase = 'reveal'; markComplete(GAME_ID, 1); }
      renderPhase();
    });
  }, 500);
}

// ─── Reveal ──────────────────────────────────────────────────────────────────

function renderReveal() {
  const stage = document.getElementById('gameStage');

  const allPositions = {};
  DATA.characters.forEach(c => {
    let pos = 0;
    DATA.statements.forEach(stmt => {
      const dir = stmt.direction[c.id];
      if (dir === 'forward') pos++;
      else if (dir === 'back') pos--;
    });
    allPositions[c.id] = pos;
  });
  // Override selected character with actual player decisions
  allPositions[selectedChar.id] = positions[selectedChar.id];

  stage.innerHTML = `
    <h2 class="mb-1" style="color:var(--teal-dark)">Where did everyone land?</h2>
    <p class="text-muted mb-3">${DATA.finalMessage}</p>
    <div class="power-walk-room">
      <div class="room-spectrum-bar">
        <span>← Disadvantaged</span>
        <span>Privileged →</span>
      </div>
      <div class="character-track" id="charTrack"></div>
    </div>
    <div class="card mt-3" style="background:rgba(27,79,114,0.06)">
      <h3 class="mb-2" style="color:var(--teal-dark)">Your journey as ${selectedChar.name}</h3>
      <div id="decisionSummary"></div>
    </div>
    <div class="mt-4 flex-between flex-wrap gap-2">
      <button id="playAgainBtn" class="btn btn-outline">Try as another character</button>
      <a href="../index.html" class="btn btn-primary">Back to Hub →</a>
    </div>
  `;

  const track = document.getElementById('charTrack');
  DATA.characters.forEach(char => {
    const pos = allPositions[char.id];
    const pct = 10 + ((pos + 4) / 8) * 78;
    const row = document.createElement('div');
    row.className = 'character-row';
    row.innerHTML = `
      ${charBadge(char.initials, char.color, false)}
      <span class="char-name" style="color:${char.color}">${char.name}</span>
      <div class="char-bar">
        <div class="char-dot" style="background:${char.color};left:calc(${pct}% - 14px)">
          ${pos >= 0 ? '+' : ''}${pos}
        </div>
      </div>
    `;
    if (char.id === selectedChar.id) row.style.fontWeight = '700';
    track.appendChild(row);
  });

  const summary = document.getElementById('decisionSummary');
  if (summary) {
    summary.innerHTML = decisions.map((d, i) => {
      const stmt = DATA.statements.find(s => s.id === d.statementId);
      const label = d.action === 'forward' ? 'Step Forward' : d.action === 'back' ? 'Step Back' : 'Stayed';
      const color = d.action === 'forward' ? '#27AE60' : d.action === 'back' ? '#E74C3C' : '#888';
      return `<div style="display:flex;gap:0.75rem;align-items:flex-start;margin-bottom:0.5rem;">
        <span style="color:${color};font-weight:700;font-size:0.8rem;flex-shrink:0;padding-top:0.1rem;min-width:80px;">${label}</span>
        <div style="font-size:0.9rem">"${stmt?.text}"</div>
      </div>`;
    }).join('');
  }

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    selectedChar = null;
    positions = {};
    decisions = [];
    currentStatement = 0;
    gamePhase = 'select';
    DATA.characters.forEach(c => { positions[c.id] = 0; });
    renderPhase();
  });
}

document.addEventListener('DOMContentLoaded', init);
