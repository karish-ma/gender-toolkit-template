/**
 * Game 5 — Climb the Ladder: Longwe Level Analyzer
 * Self-contained, data embedded
 */

const GAME_ID = 'longwe';
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

const DATA = {
  levels: [
    { id: 1, name: 'Welfare', description: "Meeting women's basic material needs — without addressing the causes of inequality.", color: '#E74C3C', icon: '🍚' },
    { id: 2, name: 'Access', description: "Improving women's access to resources — education, land, credit — on equal terms with men.", color: '#E67E22', icon: '🚪' },
    { id: 3, name: 'Conscientisation', description: 'Raising awareness that gender disadvantage is socially constructed — not natural or inevitable.', color: '#F1C40F', icon: '💡' },
    { id: 4, name: 'Participation', description: 'Women actively influencing decisions — in projects, institutions, and policy — on equal terms.', color: '#2ECC71', icon: '🗳️' },
    { id: 5, name: 'Control', description: 'Women and men having equal control over resources and benefits — a balance of power achieved through empowerment.', color: '#1B4F72', icon: '⚖️' }
  ],
  // ─── CUSTOMISE THIS ────────────────────────────────────────────────────────
  // Replace interventions and finalPrompt with output from Task 5 of CUSTOMISE.md
  // The 'correct' field must be a number 1–5 matching a Longwe level above
  // ───────────────────────────────────────────────────────────────────────────
  interventions: [
    { id: 'i1', title: '[Level 1 Intervention]', description: 'Replace with a Welfare-level intervention set in your industry — meeting an immediate material need without addressing causes.', correct: 1, explanation: 'Explain why this is Welfare and what it does not change structurally.' },
    { id: 'i2', title: '[Level 2 Intervention]', description: 'Replace with an Access-level intervention — equalising access to resources or opportunities.', correct: 2, explanation: 'Explain why this is Access.' },
    { id: 'i3', title: '[Level 3 Intervention]', description: 'Replace with a Conscientisation-level intervention — building awareness that inequality is constructed.', correct: 3, explanation: 'Explain why this is Conscientisation.' },
    { id: 'i4', title: '[Level 4 Intervention]', description: 'Replace with a Participation-level intervention — women actively influencing decisions, not just attending.', correct: 4, explanation: 'Explain why this is Participation.' },
    { id: 'i5', title: '[Level 5 Intervention]', description: 'Replace with a Control-level intervention — women leading systemic change with real authority.', correct: 5, explanation: 'Explain why this is Control.' }
  ],
  finalPrompt: "Replace with a reflective question for participants, referencing your specific industry and context."
};

let placements = {};
let draggedId = null;
let checked = false;

function init() {
  renderLadder();
  renderInterventions();
  setupActions();
}

function renderLadder() {
  const container = document.getElementById('ladderVisual');
  if (!container) return;
  container.innerHTML = DATA.levels.map(level => `
    <div class="ladder-rung" id="rung-${level.id}" data-level="${level.id}" style="background:${level.color}22;border:2px dashed ${level.color}44;">
      <div class="rung-label" style="background:${level.color}">
        <div class="rung-icon">${level.icon}</div>
        <div class="rung-level-num">${level.id}</div>
        <div class="rung-level-name">${level.name}</div>
      </div>
      <div class="rung-drop" id="rung-drop-${level.id}">
        <div class="rung-desc" style="font-size:0.75rem;color:var(--text-secondary);font-style:italic;margin-bottom:0.25rem">${level.description}</div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.ladder-rung').forEach(rung => {
    rung.addEventListener('dragover', e => { e.preventDefault(); rung.classList.add('drag-over'); });
    rung.addEventListener('dragleave', () => rung.classList.remove('drag-over'));
    rung.addEventListener('drop', e => {
      e.preventDefault();
      rung.classList.remove('drag-over');
      if (!draggedId || checked) return;
      placeIntervention(draggedId, parseInt(rung.dataset.level));
    });
  });
}

function renderInterventions() {
  const container = document.getElementById('interventionCards');
  if (!container) return;
  container.innerHTML = DATA.interventions.map(iv => `
    <div class="intervention-card draggable" id="iv-${iv.id}" draggable="true" data-iv="${iv.id}">
      <div class="intervention-card-title">${iv.title}</div>
      <div class="intervention-card-desc">${iv.description}</div>
    </div>
  `).join('');
  container.querySelectorAll('.intervention-card').forEach(el => {
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('dragend', onDragEnd);
  });
}

function onDragStart(e) {
  draggedId = e.currentTarget.dataset.iv;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onDragEnd(e) { e.currentTarget.classList.remove('dragging'); }

function placeIntervention(ivId, levelId) {
  const prev = placements[ivId];
  if (prev !== undefined) {
    const prevDrop = document.getElementById(`rung-drop-${prev}`);
    const existing = prevDrop?.querySelector(`[data-iv="${ivId}"]`);
    if (existing) existing.remove();
  }
  placements[ivId] = levelId;

  const iv = DATA.interventions.find(i => i.id === ivId);
  const drop = document.getElementById(`rung-drop-${levelId}`);
  if (!drop || !iv) return;

  const placed = document.createElement('div');
  placed.dataset.iv = ivId;
  placed.className = 'intervention-card';
  placed.style.cssText = 'font-size:0.8rem;padding:0.4rem 0.6rem;margin-top:0.25rem;cursor:grab;';
  placed.draggable = true;
  placed.innerHTML = `<strong>${iv.title}</strong>`;
  placed.title = iv.description;
  placed.addEventListener('dragstart', onDragStart);
  placed.addEventListener('dragend', onDragEnd);
  drop.appendChild(placed);

  const source = document.getElementById(`iv-${ivId}`);
  if (source) source.style.display = 'none';

  const allPlaced = DATA.interventions.every(iv => placements[iv.id] !== undefined);
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

  DATA.interventions.forEach(iv => {
    const placed = placements[iv.id];
    const isCorrect = placed === iv.correct;
    if (isCorrect) correct++;

    const drop = document.getElementById(`rung-drop-${placed}`);
    if (!drop) return;
    const placedEl = drop.querySelector(`[data-iv="${iv.id}"]`);
    if (placedEl) {
      placedEl.style.borderColor = isCorrect ? '#27AE60' : '#E74C3C';
      placedEl.style.background = isCorrect ? 'rgba(39,174,96,0.08)' : 'rgba(231,76,60,0.08)';
      placedEl.style.cursor = 'default';
      placedEl.draggable = false;

      const expEl = document.createElement('div');
      expEl.style.cssText = 'font-size:0.75rem;margin-top:0.3rem;color:var(--text-secondary);';
      expEl.textContent = iv.explanation;
      placedEl.appendChild(expEl);

      if (!isCorrect) {
        const corrLevel = DATA.levels.find(l => l.id === iv.correct);
        const corrNote = document.createElement('div');
        corrNote.style.cssText = 'font-size:0.72rem;color:#C0392B;margin-top:0.2rem;font-weight:700;';
        corrNote.textContent = `→ Correct level: ${corrLevel?.id}. ${corrLevel?.name}`;
        placedEl.appendChild(corrNote);
      }
    }
  });

  const scoreEl = document.getElementById('scorePanel');
  if (scoreEl) {
    scoreEl.classList.remove('hidden');
    scoreEl.querySelector('.score-number').textContent = correct;
    scoreEl.querySelector('.score-denom').textContent = ` / ${DATA.interventions.length}`;
    const msg = scoreEl.querySelector('.score-message');
    if (msg) msg.textContent = DATA.finalPrompt;
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
