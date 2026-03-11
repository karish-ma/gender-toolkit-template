/**
 * Gender Mainstreaming in Practice — Hub Logic
 * Progress tracking, score encoding, shareable results URLs
 */

const STORAGE_KEY = 'giz_gm_progress';
const SCORES_KEY  = 'giz_gm_scores';

const GAMES = [
  'pgn-sgi', 'power-walk', 'grp-match',
  'forum-theater', 'longwe', 'resistance'
];

const GAME_META = {
  'pgn-sgi':       { label: 'Sort the Cards',     max: 6,    isSimulation: false },
  'power-walk':    { label: 'Power Walk',          max: null, isSimulation: true  },
  'grp-match':     { label: 'Match the Principle', max: 14,   isSimulation: false },
  'forum-theater': { label: 'Forum Theater',       max: 5,    isSimulation: false },
  'longwe':        { label: 'Climb the Ladder',    max: 5,    isSimulation: false },
  'resistance':    { label: 'Hold the Room',       max: 3,    isSimulation: false },
};

// Total scoreable points (excluding Power Walk simulation)
const TOTAL_POSSIBLE = 6 + 14 + 5 + 5 + 3; // = 33

function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function getScores() {
  try { return JSON.parse(localStorage.getItem(SCORES_KEY)) || {}; }
  catch { return {}; }
}

function completedCount() {
  return Object.values(getProgress()).filter(Boolean).length;
}

function allComplete() {
  return GAMES.every(id => getProgress()[id]);
}

function updateProgressBar() {
  const count = completedCount();
  const fill  = document.getElementById('progressFill');
  const countEl = document.getElementById('progressCount');
  if (fill) fill.style.width = Math.round((count / GAMES.length) * 100) + '%';
  if (countEl) countEl.textContent = `${count} / ${GAMES.length} complete`;
}

function updateGameCards() {
  GAMES.forEach(id => {
    const card = document.querySelector(`[data-game="${id}"]`);
    if (!card) return;
    if (getProgress()[id]) {
      card.classList.add('completed');
      const cta = card.querySelector('.card-cta');
      if (cta) cta.innerHTML = '<span class="card-done-badge">&#10003; Done</span>';
    }
  });
}

function showCertificate() {
  const cert = document.getElementById('certificate');
  if (cert && allComplete()) cert.classList.add('visible');
}

// ── Share URL ──────────────────────────────────────────────────────

function buildShareUrl() {
  const scores   = getScores();
  const progress = getProgress();
  const parts = GAMES.map(id => {
    if (!progress[id]) return '_';               // not played
    const score = scores[id];
    if (score === undefined || score === null) return '1'; // played, no numeric score
    return String(score);
  });
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('r', parts.join('-'));
  return url.toString();
}

function parseSharedResults(paramStr) {
  if (!paramStr) return null;
  const parts = paramStr.split('-');
  if (parts.length !== GAMES.length) return null;
  const result = {};
  GAMES.forEach((id, i) => {
    const val = parts[i];
    result[id] = (val === '_') ? null : parseInt(val, 10);
  });
  return result;
}

function renderSharedResults() {
  const params = new URLSearchParams(location.search);
  const r = params.get('r');
  if (!r) return;

  const shared = parseSharedResults(r);
  if (!shared) return;

  const banner = document.getElementById('sharedResultsBanner');
  if (!banner) return;

  const totalScored = GAMES.reduce((sum, id) => {
    const meta  = GAME_META[id];
    const score = shared[id];
    if (meta.isSimulation || score === null) return sum;
    return sum + score;
  }, 0);

  const playedCount = GAMES.filter(id => shared[id] !== null).length;

  const items = GAMES.map(id => {
    const meta  = GAME_META[id];
    const score = shared[id];
    let display, pct = 0;

    if (score === null) {
      display = '—';
    } else if (meta.isSimulation) {
      display = 'Played';
      pct = 100;
    } else {
      display = `${score}/${meta.max}`;
      pct = Math.round((score / meta.max) * 100);
    }

    return `
      <div class="shared-score-item">
        <div class="shared-score-num">${display}</div>
        <div class="shared-score-label">${meta.label}</div>
        ${(!meta.isSimulation && score !== null) ? `
          <div style="height:3px;background:rgba(255,255,255,0.15);border-radius:999px;margin-top:0.4rem;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--coral-light);border-radius:999px;"></div>
          </div>` : ''}
      </div>`;
  }).join('');

  banner.innerHTML = `
    <div class="container">
      <div class="shared-banner-header">
        <div>
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--coral-light);margin-bottom:0.3rem">Shared Results</div>
          <div style="font-weight:700;font-size:1.05rem;color:white">
            ${playedCount} of 6 activities completed &middot; ${totalScored}/${TOTAL_POSSIBLE} scored
          </div>
          <div style="font-size:0.8rem;color:rgba(255,255,255,0.5);margin-top:0.2rem">
            Someone shared their results with you. Try the activities yourself and compare.
          </div>
        </div>
        <a href="${location.pathname}" class="btn btn-ghost" style="font-size:0.82rem;white-space:nowrap">Start fresh &rarr;</a>
      </div>
      <div class="shared-scores-grid">${items}</div>
    </div>`;

  banner.classList.remove('hidden');
}

// ── Share buttons ──────────────────────────────────────────────────

function initShareResultsBtn() {
  const btn = document.getElementById('shareResultsBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const url = buildShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Link copied!';
      setTimeout(() => { btn.textContent = orig; }, 2500);
    }).catch(() => { prompt('Copy this link:', url); });
  });
}

function initShareBtn() {
  const btn = document.getElementById('shareBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const url = buildShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Link copied!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }).catch(() => { prompt('Copy this link:', url); });
  });
}

// ── Accordion ─────────────────────────────────────────────────────

function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel  = trigger.closest('.accordion-item').querySelector('.accordion-panel');
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.accordion-trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const p = t.closest('.accordion-item').querySelector('.accordion-panel');
        if (p) p.style.maxHeight = '0';
      });

      // Open this one if it was closed
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  updateProgressBar();
  updateGameCards();
  showCertificate();
  renderSharedResults();
  initAccordion();
  initShareResultsBtn();
  initShareBtn();

  const resetBtn = document.getElementById('resetProgress');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SCORES_KEY);
      location.reload();
    });
  }
});
