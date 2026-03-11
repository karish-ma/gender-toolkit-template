/**
 * Activity 4 — Forum Theater: Choose the Intervention
 * Self-contained, data embedded
 */

const GAME_ID = 'forum-theater';
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
// Replace this DATA object with the output from Task 4 of CUSTOMISE.md
// principle values must match ids from DATA.principles in grpMatch.js
// ─────────────────────────────────────────────────────────────────────────────
const DATA = {
  vignettes: [
    {
      id: 'v1', title: "Rashida's Dismissed Proposal",
      character: 'Rashida', characterRole: 'Female Senior Trainer',
      charInitials: 'R', charColor: '#E74C3C',
      scene: "Rashida presents a detailed proposal to redesign the welding curriculum to include safety equipment sized for women. The department head (male) says 'That's interesting, but I think we should focus on more practical matters first,' and moves on. Two minutes later, a male colleague suggests a similar equipment review — and the department head says 'Great idea, Mahmud — let's prioritise that.'",
      question: 'You witness this. What do you do?',
      options: [
        { id: 'o1', text: "Say nothing. It's not your place to intervene, and you don't want to create conflict.", quality: 'ineffective', principle: null, principleLabel: null, outcome: "The pattern continues. Rashida's contributions are repeatedly sidelined. She eventually stops making proposals. The curriculum goes unchanged.", feedback: 'Silence enables the pattern. Bystander inaction is itself a form of consent to the status quo.' },
        { id: 'o2', text: "Speak up in the meeting: 'I want to acknowledge that Rashida raised this point two minutes ago. Can we hear more about her proposal?'", quality: 'best', principle: 'power', principleLabel: 'Power & Privilege', outcome: "The room pauses. The department head looks slightly uncomfortable but acknowledges the point. Rashida's proposal gets a fair hearing. Others in the room take note.", feedback: "This is a direct, professional intervention that names the dynamic without attacking anyone. It restores voice and models allyship." },
        { id: 'o3', text: "Speak to Rashida privately after and tell her she should have been more assertive in claiming her idea.", quality: 'partial', principle: 'participation', principleLabel: 'Participation', outcome: 'Rashida feels blamed. The behaviour of the department head goes unchallenged. The structural dynamic remains.', feedback: "This puts the burden on the person who was wronged. While well-intentioned, it doesn't address the source of the problem." }
      ],
      reflection: "When women's contributions are 'stolen' or ignored, the problem is structural — not a skills deficit in the woman. Effective intervention challenges the system, not the symptom."
    },
    {
      id: 'v2', title: 'Farida the Invisible Expert',
      character: 'Farida', characterRole: 'Female Curriculum Specialist',
      charInitials: 'F', charColor: '#2980B9',
      scene: "Farida is the most qualified person in the room on gender-responsive curriculum design — she has a master's degree and five years of field experience. But during a workshop, the external (male) consultant keeps directing technical questions to her male colleague, who repeatedly defers: 'You should ask Farida, she's the expert.' The consultant says 'Yes, yes,' then turns back to the male colleague anyway.",
      question: 'Farida asks for your advice before the next session. What do you tell her?',
      options: [
        { id: 'o1', text: 'Tell her to dress more professionally and speak up louder to command respect.', quality: 'ineffective', principle: null, principleLabel: null, outcome: 'Farida feels judged. The advice is irrelevant to the actual problem. The consultant\'s behaviour doesn\'t change.', feedback: 'This shifts blame to Farida and ignores the structural gender dynamic. Her expertise — not her appearance or volume — is the issue.' },
        { id: 'o2', text: "Advise her to co-present with her male colleague, who explicitly introduces her as the lead expert and physically defers to her.", quality: 'best', principle: 'power', principleLabel: 'Power & Privilege', outcome: "The social cue shifts the consultant's perception. Farida is introduced as the decision-maker. She leads the session successfully.", feedback: "Using an ally's positional power to visibly redirect authority is effective. It works with, not against, the social dynamics in the room." },
        { id: 'o3', text: 'Suggest she send her CV to the consultant by email beforehand so he sees her credentials.', quality: 'partial', principle: 'relevance', principleLabel: 'Relevance', outcome: "The consultant glances at the email. He's slightly more attentive but still defaults to her male colleague in person.", feedback: "This is a reasonable step but doesn't address the in-room dynamic. Credentials on paper don't automatically change social behaviour." }
      ],
      reflection: "Expertise is not gender-neutral. Women often have to provide more evidence of competence to receive equal recognition. Good allyship uses positional power to make invisible expertise visible."
    },
    {
      id: 'v3', title: "Tania's Unfair Assessment",
      character: 'Tania', characterRole: 'Female Trainee, Electrical Trade',
      charInitials: 'T', charColor: '#27AE60',
      scene: "Tania is the only woman in an electrical installation class. After a practical assessment, she receives a score of 62% — a pass but below her male peers' scores of 70–85%. She is puzzled: her practical work was clean and met the brief. Her assessor's feedback says: 'Good effort for a female student — shows real commitment.' No technical errors are cited.",
      question: "As Tania's trainer and advocate, what action do you take?",
      options: [
        { id: 'o1', text: 'Tell Tania her score is fine and that she should focus on improving in the next assessment.', quality: 'ineffective', principle: null, principleLabel: null, outcome: "The bias goes unaddressed. Tania's official record reflects an unfair assessment. She begins to doubt her own abilities.", feedback: 'This accepts a biased outcome as fair. It compounds the harm by normalising a lower standard for women.' },
        { id: 'o2', text: "Request a formal re-marking of Tania's work against the standard rubric, citing that the feedback does not reference technical criteria.", quality: 'best', principle: 'transformative', principleLabel: 'Transformative Aim', outcome: "The re-marking reveals no technical errors. Tania's score is revised to 79%. The assessor is required to complete bias-awareness training.", feedback: 'Using formal systems to correct bias — and triggering structural accountability — is transformative action. It creates a record and changes behaviour.' },
        { id: 'o3', text: 'Give Tania additional tutoring sessions to ensure she performs even better next time.', quality: 'partial', principle: 'inclusivity', principleLabel: 'Inclusivity', outcome: "Tania improves further. But the original unfair grade remains on her record. The assessor continues to use non-technical criteria for female students.", feedback: "Supporting Tania is good. But it doesn't address the source — the biased assessor. The structural problem continues." }
      ],
      reflection: "Gendered language in assessments ('good for a female') is a red flag for bias, not encouragement. Advocacy means challenging the system, not just helping the individual navigate it."
    },
    {
      id: 'v4', title: "Nasreen's Denied Promotion",
      character: 'Nasreen', characterRole: 'Female Senior Training Officer',
      charInitials: 'N', charColor: '#8E44AD',
      scene: "Nasreen applies for the Deputy Director role. She is the most qualified applicant. The selection committee (all male) selects a male colleague with fewer qualifications and less experience. The informal feedback: 'Nasreen is excellent but she has young children — we weren't sure she could handle the travel demands.' Nasreen was never asked about this.",
      question: 'Nasreen shares this with you. What action do you recommend?',
      options: [
        { id: 'o1', text: "Tell her it's disappointing but perhaps she should wait until her children are older before applying again.", quality: 'ineffective', principle: null, principleLabel: null, outcome: 'The committee faces no accountability. The structural barrier to promotion is reinforced.', feedback: "This advice internalises the discrimination. It places the burden on Nasreen to manage others' biases rather than challenging them." },
        { id: 'o2', text: "Encourage Nasreen to formally document the feedback she received and file a complaint citing the assumption about her childcare responsibilities.", quality: 'best', principle: 'transformative', principleLabel: 'Transformative Aim', outcome: "HR reviews the decision. The committee is found to have used criteria not in the job description. The process is reopened. Nasreen is appointed.", feedback: 'Assumptions about a woman\'s family life as selection criteria are discriminatory. Formal complaints create accountability and set precedent.' },
        { id: 'o3', text: 'Advise Nasreen to speak directly to the committee chair and explain her childcare arrangements to reassure him.', quality: 'partial', principle: 'participation', principleLabel: 'Participation', outcome: "The chair listens politely but the decision stands. Nasreen has now implicitly accepted that her family situation is a legitimate criterion.", feedback: "This concedes that the criterion is legitimate — it isn't. It frames the problem as Nasreen's responsibility to resolve." }
      ],
      reflection: "Assumptions about women's family commitments as barriers to promotion are gender-based discrimination. Effective advocacy challenges the system, not the woman."
    },
    {
      id: 'v5', title: "Parveen Stops Coming Back",
      character: 'Parveen', characterRole: 'Transgender Female Trainee — Hospitality & Service Skills',
      charInitials: 'P', charColor: '#D35400',
      scene: "Parveen is in her second week of a hospitality skills training course — one of the first transgender women to formally enrol at the institute. During role-play exercises, the trainer consistently assigns her the role of 'the helper,' never the lead. He twice refers to her using masculine pronouns in front of the group. When Parveen quietly corrects him the second time, he says: 'I'm trying my best — you have to understand this is all new for us.' Other trainees have started mirroring his behaviour. Parveen did not return after the lunch break on Thursday.",
      question: "You are the institute coordinator responsible for this cohort. Parveen messages you to explain what has happened. What do you do?",
      options: [
        {
          id: 'o1',
          text: "Reply thanking her for letting you know, and tell her you will look into it. Take no further action this week — you want to give the trainer time to adjust.",
          quality: 'ineffective',
          principle: null, principleLabel: null,
          outcome: "Parveen reads the delayed, non-committal reply as a signal that the institute does not consider her situation urgent. She does not return. The trainer's behaviour continues with the next cohort.",
          feedback: "A vague acknowledgement without action signals to Parveen that the institution does not consider her experience serious. Delay in this situation is itself a decision — and one that lets harm continue."
        },
        {
          id: 'o2',
          text: "Contact the trainer the same afternoon. Name what happened specifically, explain that using a student's correct name and pronouns is a professional standard — not an optional courtesy — and tell him to address the class before the next session. Follow up directly with Parveen to let her know what has happened and confirm she is comfortable returning.",
          quality: 'best',
          principle: 'safespace',
          principleLabel: 'Safe Space',
          outcome: "The trainer addresses the class the following morning, apologises directly to Parveen, and commits to using her correct name. Parveen returns. The cohort completes the course together.",
          feedback: "Speed and specificity matter here. The trainer needs to understand this is a professional standard, not a cultural debate. And Parveen needs to hear directly that the institute has acted — not assume it has."
        },
        {
          id: 'o3',
          text: "Send a general reminder to all trainers about respectful language and raise it as a general discussion item at the next staff meeting.",
          quality: 'partial',
          principle: 'inclusivity',
          principleLabel: 'Inclusivity',
          outcome: "The circular goes out. The trainer who caused the harm receives no direct feedback. Parveen is not contacted. She does not return. The staff meeting discussion is abstract and no one connects it to Parveen's experience.",
          feedback: "A general response to a specific incident avoids accountability. Parveen is not contacted, so she has no reason to believe the situation has changed. Systemic communication matters — but it cannot substitute for direct action on a live case."
        }
      ],
      reflection: "Being misgendered by a trainer is not an interpersonal awkwardness — it is a structural signal that the institution does not consider transgender learners legitimate. The coordinator's role is to act with urgency: both to support Parveen's continued participation and to hold the trainer to a professional standard. Framing misgendering as 'still adjusting' shifts responsibility from the institution onto the person experiencing harm."
    }
  ]
};

let currentVignette = 0;
let choices = [];
let chosen = false;

function init() { renderVignette(); }

function renderVignette() {
  const v = DATA.vignettes[currentVignette];
  if (!v) return;
  chosen = false;

  const stage = document.getElementById('gameStage');
  if (!stage) return;

  stage.innerHTML = `
    <div class="step-dots mb-3" id="stepDots"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
      <span class="badge badge-teal">Scene ${currentVignette + 1} of ${DATA.vignettes.length}</span>
      <span style="font-size:1.1rem;font-weight:700;color:var(--teal-dark)">${v.title}</span>
    </div>
    <div class="vignette-card">
      <div class="vignette-character">
        ${charBadge(v.charInitials, v.charColor)}
        <div>
          <div class="char-info-name">${v.character}</div>
          <div class="char-info-role">${v.characterRole}</div>
        </div>
      </div>
      <div class="vignette-scene">${v.scene}</div>
    </div>
    <h3 style="color:var(--teal-dark);margin:1.25rem 0 0.75rem">${v.question}</h3>
    <div class="intervention-options" id="optionsList"></div>
    <div id="revealArea" class="hidden"></div>
    <div id="nextBtnWrap" class="hidden mt-3">
      ${currentVignette + 1 < DATA.vignettes.length
        ? `<button id="nextBtn" class="btn btn-primary">Next Scene →</button>`
        : `<button id="nextBtn" class="btn btn-coral">See Your Results →</button>`
      }
    </div>
  `;

  renderStepDots();
  renderOptions(v);
}

function renderStepDots() {
  const dotsEl = document.getElementById('stepDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = DATA.vignettes.map((_, i) =>
    `<div class="step-dot ${i < currentVignette ? 'done' : i === currentVignette ? 'active' : ''}"></div>`
  ).join('');
}

function renderOptions(v) {
  const list = document.getElementById('optionsList');
  if (!list) return;
  v.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'intervention-option';
    btn.dataset.optId = opt.id;
    btn.textContent = opt.text;
    btn.addEventListener('click', () => handleChoice(v, opt));
    list.appendChild(btn);
  });
}

function handleChoice(vignette, chosen_opt) {
  if (chosen) return;
  chosen = true;
  choices.push({ vignetteId: vignette.id, optionId: chosen_opt.id, quality: chosen_opt.quality });

  document.querySelectorAll('.intervention-option').forEach(btn => {
    const opt = vignette.options.find(o => o.id === btn.dataset.optId);
    btn.disabled = true;
    btn.style.cursor = 'default';
    if (opt.id === chosen_opt.id) {
      btn.classList.add(chosen_opt.quality === 'best' ? 'selected-best' : chosen_opt.quality === 'partial' ? 'selected-partial' : 'selected-ineffective');
    }
  });

  const revealArea = document.getElementById('revealArea');
  if (revealArea) {
    revealArea.classList.remove('hidden');
    const qualityLabel = chosen_opt.quality === 'best' ? '✓ Most Effective' : chosen_opt.quality === 'partial' ? '~ Partially Effective' : '✗ Ineffective';
    const qualityColor = chosen_opt.quality === 'best' ? '#27AE60' : chosen_opt.quality === 'partial' ? '#F39C12' : '#E74C3C';
    const bestOpt = vignette.options.find(o => o.quality === 'best');

    revealArea.innerHTML = `
      <div style="border-radius:var(--radius-md);padding:1.25rem;margin-top:0.75rem;background:rgba(0,0,0,0.03);border:1px solid var(--border)">
        <div style="font-weight:700;color:${qualityColor};margin-bottom:0.5rem;font-size:0.9rem">${qualityLabel}</div>
        <div style="margin-bottom:0.75rem"><strong>What happens:</strong><div style="font-size:0.9rem;color:var(--text-secondary);margin-top:0.25rem">${chosen_opt.outcome}</div></div>
        <div style="margin-bottom:0.75rem"><strong>Why:</strong><div style="font-size:0.9rem;color:var(--text-secondary);margin-top:0.25rem">${chosen_opt.feedback}</div></div>
        ${chosen_opt.principle ? `<div><strong>GRP Principle:</strong> <span class="badge badge-teal" style="margin-left:0.4rem">${chosen_opt.principleLabel}</span></div>` : ''}
        ${chosen_opt.quality !== 'best' ? `<div class="mt-2" style="font-size:0.85rem;color:var(--teal-dark)"><strong>Best response:</strong> ${bestOpt?.text}</div>` : ''}
        <div class="divider"></div>
        <div style="font-size:0.85rem;color:var(--text-secondary);font-style:italic"><strong style="color:var(--teal-dark)">Reflection:</strong> ${vignette.reflection}</div>
      </div>
    `;
  }

  document.getElementById('nextBtnWrap').classList.remove('hidden');
  document.getElementById('nextBtn').addEventListener('click', () => {
    currentVignette++;
    if (currentVignette >= DATA.vignettes.length) showResults();
    else renderVignette();
  });
}

function showResults() {
  const stage = document.getElementById('gameStage');
  const bestCount = choices.filter(c => c.quality === 'best').length;
  markComplete(GAME_ID, bestCount);
  const partialCount = choices.filter(c => c.quality === 'partial').length;
  const ineffCount = choices.filter(c => c.quality === 'ineffective').length;

  stage.innerHTML = `
    <div class="text-center mb-4">
      <h2 style="color:var(--teal-dark)">Your Intervention Record</h2>
      <p class="text-muted">Across ${DATA.vignettes.length} situations, here's how your choices played out.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.5rem 0;text-align:center">
      <div class="card"><div style="font-size:2rem;font-weight:700;color:#27AE60">${bestCount}</div><div style="font-size:0.8rem;color:var(--text-secondary)">Most Effective</div></div>
      <div class="card"><div style="font-size:2rem;font-weight:700;color:#F39C12">${partialCount}</div><div style="font-size:0.8rem;color:var(--text-secondary)">Partially Effective</div></div>
      <div class="card"><div style="font-size:2rem;font-weight:700;color:#E74C3C">${ineffCount}</div><div style="font-size:0.8rem;color:var(--text-secondary)">Ineffective</div></div>
    </div>
    <div class="card" style="background:rgba(27,79,114,0.06);margin-bottom:1.5rem">
      <div style="font-weight:700;color:var(--teal-dark);margin-bottom:0.5rem">Reflect</div>
      <div style="font-size:0.95rem;color:var(--text-secondary)">Think of a real situation you've witnessed where someone's contribution was dismissed or overlooked. What made it hard to intervene? What would have made it easier?</div>
    </div>
    <div class="flex-between flex-wrap gap-2">
      <button id="playAgainBtn" class="btn btn-outline">↩ Try again</button>
      <a href="resistance.html" class="btn btn-primary">Next: Hold the Room →</a>
    </div>
  `;

  document.getElementById('playAgainBtn').addEventListener('click', () => {
    currentVignette = 0; choices = []; chosen = false; renderVignette();
  });
}

document.addEventListener('DOMContentLoaded', init);
