/**
 * Game 1 — Sort the Cards: PGN vs SGI
 * Self-contained, no imports needed
 */

const GAME_ID = 'pgn-sgi';
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
// Replace this DATA object with the output from Task 1 of CUSTOMISE.md
// Run the prompt at claude.ai to generate scenarios for your industry/context
// ─────────────────────────────────────────────────────────────────────────────
const DATA = {
  cards: [
    {
      id: 'c1', title: '[PGN Example]',
      scenario: 'Replace this with a scenario describing a practical, immediate intervention that removes a barrier for women without challenging the underlying power structure.',
      correct: 'PGN',
      explanation: 'Explain why this is a Practical Gender Need — what immediate barrier it addresses, and what it does not change structurally.'
    },
    {
      id: 'c2', title: '[SGI Example]',
      scenario: 'Replace this with a scenario describing an intervention that challenges a structural norm, power relation, or institutional practice.',
      correct: 'SGI',
      explanation: 'Explain why this is a Strategic Gender Interest — what structural norm it challenges, and how it aims to shift power.'
    },
    {
      id: 'c3', title: '[PGN Example]',
      scenario: 'Replace this with a second Practical Gender Need scenario set in your industry context.',
      correct: 'PGN',
      explanation: 'Explain why this is a Practical Gender Need.'
    },
    {
      id: 'c4', title: '[SGI Example]',
      scenario: 'Replace this with a second Strategic Gender Interest scenario set in your industry context.',
      correct: 'SGI',
      explanation: 'Explain why this is a Strategic Gender Interest.'
    },
    {
      id: 'c5', title: '[PGN Example]',
      scenario: 'Replace this with a third Practical Gender Need scenario set in your industry context.',
      correct: 'PGN',
      explanation: 'Explain why this is a Practical Gender Need.'
    },
    {
      id: 'c6', title: '[SGI Example]',
      scenario: 'Replace this with a third Strategic Gender Interest scenario set in your industry context.',
      correct: 'SGI',
      explanation: 'Explain why this is a Strategic Gender Interest.'
    }
  ]
};

let placements = {};
let draggedId = null;
let checked = false;

function init() {
  renderSourceCards();
  setupColumns();
  setupActions();
}

function renderSourceCards() {
  const container = document.getElementById('sourceCards');
  if (!container) return;
  container.innerHTML = DATA.cards.map(card => `
    <div class="sort-card draggable" id="card-${card.id}" draggable="true" data-card="${card.id}">
      <div class="sort-card-title">${card.title}</div>
      <div class="sort-card-text">${card.scenario}</div>
    </div>
  `).join('');
  container.querySelectorAll('.sort-card').forEach(el => {
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('dragend', onDragEnd);
  });
}

function setupColumns() {
  document.querySelectorAll('.sort-column').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (!draggedId || checked) return;
      placeCard(draggedId, col.dataset.col);
    });
  });
}

function onDragStart(e) {
  draggedId = e.currentTarget.dataset.card;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onDragEnd(e) { e.currentTarget.classList.remove('dragging'); }

function placeCard(cardId, colId) {
  placements[cardId] = colId;
  const cardEl = document.getElementById(`card-${cardId}`);
  const col = document.querySelector(`[data-col="${colId}"] .sort-column-cards`);
  if (cardEl && col) {
    col.appendChild(cardEl);
    cardEl.classList.add('placed');
  }
  const allPlaced = DATA.cards.every(c => placements[c.id]);
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

  DATA.cards.forEach(card => {
    const isCorrect = placements[card.id] === card.correct;
    if (isCorrect) correct++;
    const cardEl = document.getElementById(`card-${card.id}`);
    if (cardEl) {
      cardEl.style.borderColor = isCorrect ? '#27AE60' : '#E74C3C';
      cardEl.style.backgroundColor = isCorrect ? 'rgba(39,174,96,0.06)' : 'rgba(231,76,60,0.06)';
      const exp = document.createElement('div');
      exp.style.cssText = 'font-size:0.78rem;margin-top:0.5rem;color:#555;border-top:1px solid #eee;padding-top:0.4rem;';
      exp.textContent = card.explanation;
      cardEl.appendChild(exp);
    }
  });

  const scoreEl = document.getElementById('scorePanel');
  if (scoreEl) {
    scoreEl.classList.remove('hidden');
    scoreEl.querySelector('.score-number').textContent = correct;
    scoreEl.querySelector('.score-denom').textContent = ` / ${DATA.cards.length}`;
    const msg = scoreEl.querySelector('.score-message');
    if (msg) msg.textContent = correct === DATA.cards.length
      ? 'Perfect! You clearly understand the PGN/SGI distinction.'
      : correct >= 4
        ? 'Good work! Check the highlighted cards to see where the distinction gets tricky.'
        : 'Review the highlighted cards — the PGN/SGI distinction often hinges on whether root causes are being addressed.';
  }

  const descPanel = document.getElementById('catDescriptions');
  if (descPanel) descPanel.classList.remove('hidden');

  document.querySelectorAll('.sort-card').forEach(el => {
    el.setAttribute('draggable', 'false');
    el.style.cursor = 'default';
  });

  markComplete(GAME_ID, correct);
  document.getElementById('checkBtn').disabled = true;
}

function resetGame() {
  placements = {};
  draggedId = null;
  checked = false;
  const scoreEl = document.getElementById('scorePanel');
  if (scoreEl) scoreEl.classList.add('hidden');
  const descPanel = document.getElementById('catDescriptions');
  if (descPanel) descPanel.classList.add('hidden');
  init();
}

document.addEventListener('DOMContentLoaded', init);
