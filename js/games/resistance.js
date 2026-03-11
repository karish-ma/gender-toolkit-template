/**
 * Activity 6 — Hold the Room: Resistance Response Simulator
 * Self-contained, data embedded
 */

const GAME_ID = 'resistance';
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

function charBadge(initials, color) {
  return `<div class="char-badge char-badge-lg" style="background:${color}">${initials}</div>`;
}

// ─── CUSTOMISE THIS ──────────────────────────────────────────────────────────
// Replace this DATA object with the output from Task 6 of CUSTOMISE.md
// typeColor values are fixed: #E74C3C (Ideological), #E67E22 (Protectionist), #8E44AD (Fatalist)
// ─────────────────────────────────────────────────────────────────────────────
const DATA = {
  scenarios: [
    {
      id: 'r1', type: 'Ideological', typeColor: '#E74C3C',
      typeDesc: 'Replace with a one-sentence definition of Ideological resistance in plain language.',
      participant: '[Role of participant]',
      participantInitials: 'XX', participantColor: '#2980B9',
      statement: "'Replace with a resistance statement rooted in cultural, religious, or political beliefs — written in first person, sounding like a real person with coherent internal logic.'",
      context: 'Replace with one sentence describing when and where this is said.',
      options: [
        { id: 'o1', text: 'Replace with the BEST response — must ask a question or find shared values, not lecture or cite data.', quality: 'best', explanation: 'Explain why this response works.' },
        { id: 'o2', text: 'Replace with a PARTIAL response — genuinely helpful but with a specific limitation.', quality: 'partial', explanation: 'Explain what it achieves and where it falls short.' },
        { id: 'o3', text: 'Replace with an INEFFECTIVE response — plausibly tempting but counterproductive.', quality: 'ineffective', explanation: 'Explain why this fails.' }
      ],
      coachingNote: 'Replace with a paragraph of facilitation guidance for handling Ideological resistance in your context.'
    },
    {
      id: 'r2', type: 'Protectionist', typeColor: '#E67E22',
      typeDesc: 'Replace with a one-sentence definition of Protectionist resistance in plain language.',
      participant: '[Role of participant]',
      participantInitials: 'XX', participantColor: '#8E44AD',
      statement: "'Replace with a resistance statement from someone who succeeded without support and sees structural barriers as overstated — their experience is real and their logic is internally consistent.'",
      context: 'Replace with one sentence describing when and where this is said.',
      options: [
        { id: 'o1', text: 'Replace with the BEST response — validate their experience, then widen the lens to others without dismissing them.', quality: 'best', explanation: 'Explain why this response works.' },
        { id: 'o2', text: 'Replace with a PARTIAL response.', quality: 'partial', explanation: 'Explain what it achieves and where it falls short.' },
        { id: 'o3', text: 'Replace with an INEFFECTIVE response.', quality: 'ineffective', explanation: 'Explain why this fails.' }
      ],
      coachingNote: 'Replace with a paragraph of facilitation guidance for handling Protectionist resistance in your context.'
    },
    {
      id: 'r3', type: 'Fatalist', typeColor: '#8E44AD',
      typeDesc: 'Replace with a one-sentence definition of Fatalist resistance in plain language.',
      participant: '[Role of participant]',
      participantInitials: 'XX', participantColor: '#27AE60',
      statement: "'Replace with a resistance statement from someone who agrees with the goals but names a specific, real institutional barrier and feels powerless. They genuinely care.'",
      context: 'Replace with one sentence describing when and where this is said.',
      options: [
        { id: 'o1', text: 'Replace with the BEST response — acknowledge the real barrier, then shift focus to what is within their sphere of control.', quality: 'best', explanation: 'Explain why this response works.' },
        { id: 'o2', text: 'Replace with a PARTIAL response.', quality: 'partial', explanation: 'Explain what it achieves and where it falls short.' },
        { id: 'o3', text: 'Replace with an INEFFECTIVE response.', quality: 'ineffective', explanation: 'Explain why this fails.' }
      ],
      coachingNote: 'Replace with a paragraph of facilitation guidance for handling Fatalist resistance in your context.'
    }
  ]
};

let currentScenario = 0;
let choices = [];
let chosen = false;

function init() { renderScenario(); }

function renderScenario() {
  const s = DATA.scenarios[currentScenario];
  if (!s) return;
  chosen = false;

  const stage = document.getElementById('gameStage');
  if (!stage) return;

  stage.innerHTML = `
    <div class="step-dots mb-3" id="stepDots"></div>
    <div style="margin-bottom:0.75rem">
      <span class="resistance-type-badge" style="background:${s.typeColor}22;color:${s.typeColor};border-left:3px solid ${s.typeColor}">${s.type} Resistance</span>
      <span class="badge badge-teal" style="margin-left:0.5rem">Scenario ${currentScenario + 1} of ${DATA.scenarios.length}</span>
    </div>
    <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.75rem;padding-left:0.25rem">${s.typeDesc}
    </div>
    <div class="vignette-character" style="margin-bottom:0.75rem">
      ${charBadge(s.participantInitials, s.participantColor)}
      <div>
        <div class="char-info-name">${s.participant}</div>
        <div class="char-info-role">Says, in a workshop you are facilitating:</div>
      </div>
    </div>
    <div class="quote-block">${s.statement}</div>
    <div class="scenario-context">${s.context}</div>
    <h3 style="color:var(--teal-dark);margin:1rem 0 0.75rem">What do you do?</h3>
    <div class="intervention-options" id="optionsList"></div>
    <div id="revealArea" class="hidden"></div>
    <div id="nextBtnWrap" class="hidden mt-3">
      ${currentScenario + 1 < DATA.scenarios.length
        ? `<button id="nextBtn" class="btn btn-primary">Next Scenario →</button>`
        : `<button id="nextBtn" class="btn btn-coral">See Your Summary →</button>`
      }
    </div>
  `;

  renderStepDots();
  renderOptions(s);
}

function renderStepDots() {
  const dotsEl = document.getElementById('stepDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = DATA.scenarios.map((_, i) =>
    `<div class="step-dot ${i < currentScenario ? 'done' : i === currentScenario ? 'active' : ''}"></div>`
  ).join('');
}

function renderOptions(s) {
  const list = document.getElementById('optionsList');
  if (!list) return;
  s.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'intervention-option';
    btn.dataset.optId = opt.id;
    btn.textContent = opt.text;
    btn.addEventListener('click', () => handleChoice(s, opt));
    list.appendChild(btn);
  });
}

function handleChoice(scenario, chosen_opt) {
  if (chosen) return;
  chosen = true;
  choices.push({ scenarioId: scenario.id, optionId: chosen_opt.id, quality: chosen_opt.quality });

  document.querySelectorAll('.intervention-option').forEach(btn => {
    const opt = scenario.options.find(o => o.id === btn.dataset.optId);
    btn.disabled = true;
    btn.style.cursor = 'default';
    if (opt.id === chosen_opt.id) {
      btn.classList.add(chosen_opt.quality === 'best' ? 'selected-best' : chosen_opt.quality === 'partial' ? 'selected-partial' : 'selected-ineffective');
    }
  });

  const revealArea = document.getElementById('revealArea');
  if (revealArea) {
    revealArea.classList.remove('hidden');
    const qualityLabel = chosen_opt.quality === 'best' ? '✓ Most Effective Response' : chosen_opt.quality === 'partial' ? '~ Partially Effective' : '✗ Not Effective';
    const qualityColor = chosen_opt.quality === 'best' ? '#27AE60' : chosen_opt.quality === 'partial' ? '#F39C12' : '#E74C3C';
    const bestOpt = scenario.options.find(o => o.quality === 'best');

    revealArea.innerHTML = `
      <div style="border-radius:var(--radius-md);padding:1.25rem;margin-top:0.75rem;background:rgba(0,0,0,0.03);border:1px solid var(--border)">
        <div style="font-weight:700;color:${qualityColor};margin-bottom:0.75rem;font-size:0.9rem">${qualityLabel}</div>
        <div style="margin-bottom:0.75rem"><strong>Why this response:</strong><div style="font-size:0.9rem;color:var(--text-secondary);margin-top:0.25rem">${chosen_opt.explanation}</div></div>
        ${chosen_opt.quality !== 'best' && bestOpt ? `
          <div style="margin-bottom:0.75rem;padding:0.75rem;background:rgba(39,174,96,0.08);border-radius:var(--radius-sm);border:1px solid rgba(39,174,96,0.2)">
            <div style="font-size:0.8rem;font-weight:700;color:#27AE60;margin-bottom:0.3rem">MOST EFFECTIVE RESPONSE:</div>
            <div style="font-size:0.9rem;color:var(--text-primary)">${bestOpt.text}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.4rem">${bestOpt.explanation}</div>
          </div>
        ` : ''}
        <div class="coaching-note">
          <div class="coaching-label">Facilitator Coaching Note</div>
          <div class="coaching-text">${scenario.coachingNote}</div>
        </div>
      </div>
    `;
  }

  document.getElementById('nextBtnWrap').classList.remove('hidden');
  document.getElementById('nextBtn').addEventListener('click', () => {
    currentScenario++;
    if (currentScenario >= DATA.scenarios.length) showResults();
    else renderScenario();
  });
}

function showResults() {
  const stage = document.getElementById('gameStage');
  const bestCount = choices.filter(c => c.quality === 'best').length;
  const total = choices.length;
  markComplete(GAME_ID, bestCount);

  stage.innerHTML = `
    <div class="text-center mb-4">
      <h2 style="color:var(--teal-dark)">You held the room</h2>
      <p class="text-muted">${bestCount} of ${total} responses were the most effective choice.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem">
      ${choices.map((c, i) => {
        const s = DATA.scenarios.find(sc => sc.id === c.scenarioId);
        const opt = s?.options.find(o => o.id === c.optionId);
        const icon = c.quality === 'best' ? '✓' : c.quality === 'partial' ? '~' : '✗';
        const color = c.quality === 'best' ? '#27AE60' : c.quality === 'partial' ? '#F39C12' : '#E74C3C';
        return `
          <div class="card" style="border-left:4px solid ${s?.typeColor || '#888'}">
            <div style="display:flex;align-items:flex-start;gap:0.75rem">
              <span style="font-size:1.4rem;color:${color};font-weight:700;flex-shrink:0">${icon}</span>
              <div>
                <div style="font-weight:700;margin-bottom:0.25rem">${s?.type} Resistance</div>
                <div style="font-size:0.85rem;color:var(--text-secondary)">${opt?.text}</div>
                <div class="coaching-note mt-2" style="font-size:0.82rem">
                  <div class="coaching-label">Key principle</div>
                  <div class="coaching-text">${s?.coachingNote}</div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="card" style="background:rgba(27,79,114,0.06);margin-bottom:1.5rem">
      <div style="font-weight:700;color:var(--teal-dark);margin-bottom:0.5rem">Take it further</div>
      <div style="font-size:0.9rem;color:var(--text-secondary)">Think of the most challenging form of resistance you have personally faced in gender mainstreaming work. Which type was it — Ideological, Protectionist, or Fatalist? What worked? What would you do differently?</div>
    </div>
    <div class="flex-between flex-wrap gap-2">
      <button id="playAgainBtn" class="btn btn-outline">↩ Try again</button>
      <a href="../index.html" class="btn btn-primary">Back to Hub →</a>
    </div>
  `;

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    currentScenario = 0; choices = []; chosen = false; renderScenario();
  });
}

document.addEventListener('DOMContentLoaded', init);
