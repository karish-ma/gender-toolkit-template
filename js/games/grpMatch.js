/**
 * Game 3 — Match the Principle: GRP Card Sort
 * Self-contained, data embedded
 */

const GAME_ID = 'grp-match';
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

// ─── CUSTOMISE THIS ──────────────────────────────────────────────────────────
// Replace this DATA object with the output from Task 3 of CUSTOMISE.md
// The 'correct' field in each strip must match a principle id exactly
// ─────────────────────────────────────────────────────────────────────────────
const DATA = {
  principles: [
    { id: 'principle1', label: '[Principle Name]', color: '#2980B9', icon: '🤝', description: 'Replace with a one-sentence definition of this principle in training practice.' },
    { id: 'principle2', label: '[Principle Name]', color: '#27AE60', icon: '🗣️', description: 'Replace with a one-sentence definition.' },
    { id: 'principle3', label: '[Principle Name]', color: '#F39C12', icon: '🎯', description: 'Replace with a one-sentence definition.' },
    { id: 'principle4', label: '[Principle Name]', color: '#E74C3C', icon: '⚡', description: 'Replace with a one-sentence definition.' },
    { id: 'principle5', label: '[Principle Name]', color: '#8E44AD', icon: '🛡️', description: 'Replace with a one-sentence definition.' },
    { id: 'principle6', label: '[Principle Name]', color: '#1B4F72', icon: '🔄', description: 'Replace with a one-sentence definition.' }
  ],
  strips: [
    { id: 'st1', text: 'Replace with a concrete training scenario — something a facilitator does or a programme design choice.', correct: 'principle1', explanation: 'Replace with 1–2 sentences explaining why this matches the principle.' },
    { id: 'st2', text: 'Replace with a second scenario.', correct: 'principle2', explanation: 'Replace with explanation.' },
    { id: 'st3', text: 'Replace with a third scenario, set in your specific industry context.', correct: 'principle3', explanation: 'Replace with explanation.' },
    { id: 'st4', text: 'Replace with a fourth scenario.', correct: 'principle4', explanation: 'Replace with explanation.' },
    { id: 'st5', text: 'Replace with a fifth scenario involving an active facilitator intervention.', correct: 'principle5', explanation: 'Replace with explanation.' },
    { id: 'st6', text: 'Replace with a sixth scenario.', correct: 'principle6', explanation: 'Replace with explanation.' },
    { id: 'st7', text: 'Replace with a seventh scenario — a second strip for one of the principles.', correct: 'principle1', explanation: 'Replace with explanation.' },
    { id: 'st8', text: 'Replace with an eighth scenario.', correct: 'principle2', explanation: 'Replace with explanation.' },
    { id: 'st9', text: 'Replace with a ninth scenario.', correct: 'principle3', explanation: 'Replace with explanation.' },
    { id: 'st10', text: 'Replace with a tenth scenario, set in your specific industry context.', correct: 'principle4', explanation: 'Replace with explanation.' },
    { id: 'st11', text: 'Replace with an eleventh scenario involving an active facilitator intervention.', correct: 'principle5', explanation: 'Replace with explanation.' },
    { id: 'st12', text: 'Replace with a twelfth scenario.', correct: 'principle6', explanation: 'Replace with explanation.' }
  ]
};

let placements = {};
let draggedId = null;
let checked = false;

function init() {
  renderStrips();
  renderPrincipleBoxes();
  setupActions();
}

function renderStrips() {
  const container = document.getElementById('stripsPanel');
  if (!container) return;
  container.innerHTML = DATA.strips.map(strip => `
    <div class="strip-card draggable" id="strip-${strip.id}" draggable="true" data-strip="${strip.id}">${strip.text}</div>
  `).join('');
  container.querySelectorAll('.strip-card').forEach(el => {
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('dragend', onDragEnd);
  });
}

function renderPrincipleBoxes() {
  const container = document.getElementById('principleBoxes');
  if (!container) return;
  container.innerHTML = DATA.principles.map(p => `
    <div class="principle-box" id="box-${p.id}" data-principle="${p.id}">
      <div class="principle-box-header" style="color:${p.color}">${p.icon} ${p.label}</div>
      <div class="principle-desc" style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:0.5rem">${p.description}</div>
      <div class="principle-strips" id="strips-${p.id}">
        <div class="drop-hint" style="font-size:0.75rem;color:var(--text-light);font-style:italic">Drop strips here…</div>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.principle-box').forEach(box => {
    box.addEventListener('dragover', e => { e.preventDefault(); box.classList.add('drag-over'); });
    box.addEventListener('dragleave', () => box.classList.remove('drag-over'));
    box.addEventListener('drop', e => {
      e.preventDefault();
      box.classList.remove('drag-over');
      if (!draggedId || checked) return;
      placeStrip(draggedId, box.dataset.principle);
    });
  });
}

function onDragStart(e) {
  draggedId = e.currentTarget.dataset.strip;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onDragEnd(e) { e.currentTarget.classList.remove('dragging'); }

function placeStrip(stripId, principleId) {
  const prev = placements[stripId];
  if (prev) {
    const prevSlot = document.getElementById(`strips-${prev}`);
    const existing = prevSlot?.querySelector(`[data-strip="${stripId}"]`);
    if (existing) existing.remove();
  }
  placements[stripId] = principleId;

  const slot = document.getElementById(`strips-${principleId}`);
  if (!slot) return;
  const hint = slot.querySelector('.drop-hint');
  if (hint) hint.remove();

  const mini = document.createElement('div');
  mini.dataset.strip = stripId;
  mini.className = 'strip-card';
  mini.style.cssText = 'font-size:0.78rem;padding:0.4rem 0.6rem;cursor:grab;';
  const strip = DATA.strips.find(s => s.id === stripId);
  mini.textContent = strip?.text?.substring(0, 60) + (strip?.text?.length > 60 ? '…' : '');
  mini.title = strip?.text || '';
  mini.draggable = true;
  mini.addEventListener('dragstart', onDragStart);
  mini.addEventListener('dragend', onDragEnd);
  slot.appendChild(mini);

  const source = document.getElementById(`strip-${stripId}`);
  if (source) source.style.display = 'none';

  const allPlaced = DATA.strips.every(s => placements[s.id]);
  const checkBtn = document.getElementById('checkBtn');
  if (checkBtn) checkBtn.disabled = !allPlaced;
}

function setupActions() {
  const checkBtn = document.getElementById('checkBtn');
  const resetBtn = document.getElementById('resetBtn');
  if (checkBtn) checkBtn.addEventListener('click', revealAnswers);
  if (resetBtn) resetBtn.addEventListener('click', resetGame);
}

function revealAnswers() {
  if (checked) return;
  checked = true;
  let correct = 0;

  DATA.strips.forEach(strip => {
    const placed = placements[strip.id];
    const isCorrect = placed === strip.correct;
    if (isCorrect) correct++;

    const slot = document.getElementById(`strips-${placed}`);
    if (!slot) return;
    const miniEl = slot.querySelector(`[data-strip="${strip.id}"]`);
    if (miniEl) {
      miniEl.style.borderColor = isCorrect ? '#27AE60' : '#E74C3C';
      miniEl.style.background = isCorrect ? 'rgba(39,174,96,0.08)' : 'rgba(231,76,60,0.08)';
      miniEl.draggable = false;
      miniEl.style.cursor = 'default';
      if (!isCorrect) {
        const correctPrinciple = DATA.principles.find(p => p.id === strip.correct);
        const corrNote = document.createElement('span');
        corrNote.style.cssText = 'font-size:0.7rem;color:#C0392B;display:block;margin-top:0.2rem;';
        corrNote.textContent = `→ Should be: ${correctPrinciple?.label}`;
        miniEl.appendChild(corrNote);
      }
    }
  });

  const scoreEl = document.getElementById('scorePanel');
  if (scoreEl) {
    scoreEl.classList.remove('hidden');
    scoreEl.querySelector('.score-number').textContent = correct;
    scoreEl.querySelector('.score-denom').textContent = ` / ${DATA.strips.length}`;
    const msg = scoreEl.querySelector('.score-message');
    if (msg) msg.textContent = correct === DATA.strips.length
      ? 'Perfect match! You have a strong grasp of GRP principles.'
      : correct >= 8
        ? 'Great work. Check the highlighted strips to see where the distinctions get subtle.'
        : 'Review the highlighted strips — many principles overlap, so focus on what makes each one distinct.';
  }

  markComplete(GAME_ID, correct);
  document.getElementById('checkBtn').disabled = true;
}

function resetGame() {
  placements = {};
  draggedId = null;
  checked = false;
  const scoreEl = document.getElementById('scorePanel');
  if (scoreEl) scoreEl.classList.add('hidden');
  init();
}

document.addEventListener('DOMContentLoaded', init);
