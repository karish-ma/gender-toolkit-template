# Gender Mainstreaming Toolkit — Customisation Prompt

Use this prompt with Claude (claude.ai) to generate a fully customised version of this toolkit for your industry, country, and context. The output is ready-to-paste JavaScript data — no coding required.

---

## How to use this

1. Copy the full prompt below
2. Fill in the four lines under **YOUR CONTEXT**
3. Paste the whole thing into Claude at claude.ai
4. Claude will output 6 code blocks — one per activity
5. In your forked repo, open each JS file listed and replace the `DATA = { ... }` object with Claude's output
6. Push to GitHub — your customised site is live

---

## The Prompt

---

You are generating scenario data for a gender mainstreaming interactive learning toolkit. The toolkit has 6 activities. Your task is to generate all 6 data objects, fully adapted to the context below. The output must be valid JavaScript, ready to paste directly into the files specified. Do not include any explanation outside the code blocks.

**YOUR CONTEXT**
- Industry/Sector: [e.g. healthcare / banking / civil service / agriculture / hospitality]
- Country/Region: [e.g. Rwanda / Southeast Asia / West Africa / Eastern Europe]
- Organisation type: [e.g. NGO / government ministry / private sector company / UN agency]
- Participant profile: [e.g. mid-level managers / frontline staff / trainers / HR professionals]

---

**QUALITY REQUIREMENTS — apply to all 6 tasks**

1. All scenarios must reflect realistic situations in the specified industry and context — not generic or hypothetical.
2. All character names must be culturally appropriate for the specified country or region.
3. Resistance statements must sound like a real person who genuinely holds that view — not a caricature or straw man.
4. "Best" responses must model skilled facilitation: they ask questions, reframe, or invite reflection — they do not lecture, cite data, or win arguments.
5. "Partial" responses must have genuine merit but a clear and specific limitation.
6. "Ineffective" responses must be plausibly tempting but demonstrably counterproductive.
7. All explanations must be specific to the scenario — not generic coaching language that could apply to any situation.
8. No scenario may work for two categories simultaneously — distinctions must be analytically unambiguous.

---

### Task 1 — PGN vs SGI Card Sort
*Output file: `js/games/cardSort.js` — replace the `DATA.cards` array*

Generate 6 scenario cards — exactly 3 Practical Gender Needs (PGN) and 3 Strategic Gender Interests (SGI) — drawn from the specified industry and context.

For each card, provide:
- `id`: string, "c1" through "c6"
- `title`: 2–4 word label for the card
- `scenario`: one sentence describing a concrete intervention or policy (max 25 words)
- `correct`: "PGN" or "SGI"
- `explanation`: 2 sentences — first, why this is PGN or SGI; second, what it does or does not change structurally (max 50 words total)

Constraints:
- PGN scenarios must address a real, immediate barrier women face in this sector — arising from existing gender roles
- SGI scenarios must directly challenge a structural norm, power relation, or institutional practice specific to this sector
- The distinction between PGN and SGI must be clear enough that a well-intentioned but non-expert trainer could argue either way — making the card genuinely instructive
- All 6 scenarios must be set in the same industry and country context

Output format:
```javascript
// Paste into js/games/cardSort.js — replace the existing DATA.cards array
const DATA = {
  cards: [
    { id: 'c1', title: '...', scenario: '...', correct: 'PGN', explanation: '...' },
    // ... 5 more
  ]
};
```

---

### Task 2 — Power Walk
*Output file: `js/games/powerWalk.js` — replace `DATA.characters`, `DATA.statements`, and `DATA.finalMessage`*

Generate 5 characters and 5 statements for a Power Walk exercise set in the specified context.

**For each character, provide:**
- `id`: lowercase string (e.g. "amara")
- `name`: first name only
- `role`: job title or role in the organisation (max 5 words)
- `initials`: 1–2 characters shown in the avatar circle
- `description`: 2–3 sentences giving age, background, and one structural detail that affects their position (max 45 words)
- `color`: a distinct hex color code

**For each statement, provide:**
- `id`: "s1" through "s5"
- `text`: the statement read aloud to participants, beginning with "Step forward if..." or "Step back if..." (max 35 words)
- `direction`: an object with a key for each character id, each with value "forward", "back", or "stay"
- `reflection`: 2–3 sentences explaining the gender or power logic behind who moved and who didn't (max 60 words)
- `principle`: 2–4 word label for the underlying concept (e.g. "Mobility & Safety", "Voice & Recognition")

**`finalMessage`:** one sentence for participants to read after seeing everyone's final positions (max 30 words)

Constraints:
- Characters must span the privilege spectrum — include at least one person with significant structural advantages and at least one with multiple intersecting disadvantages
- No two characters may have identical movement patterns across all 5 statements
- At least 2 statements must produce different responses from characters of the same gender (showing that gender is not the only axis)
- Statements must be specific to the industry and country — not transferable to any generic workplace
- At least one statement must relate to a structural advantage that is invisible to those who hold it

Output format:
```javascript
// Paste into js/games/powerWalk.js — replace the existing DATA object
const DATA = {
  characters: [ ... ],
  statements: [ ... ],
  finalMessage: '...'
};
```

---

### Task 3 — GRP Principles Match
*Output file: `js/games/grpMatch.js` — replace `DATA.principles` and `DATA.strips`*

Generate 6 Gender-Responsive Pedagogy principles and 12 scenario strips (2 per principle).

**For each principle, provide:**
- `id`: lowercase string with no spaces (e.g. "safespace")
- `label`: 2–4 word name of the principle
- `color`: a distinct hex color code
- `icon`: a single relevant emoji
- `description`: one sentence defining what this principle means in training practice (max 25 words)

**For each strip, provide:**
- `id`: "st1" through "st12"
- `text`: a concrete training scenario — something a facilitator does, a programme design choice, or a moment in a workshop (max 45 words)
- `correct`: the `id` of the principle this strip exemplifies
- `explanation`: 1–2 sentences explaining why this strip matches that principle (max 35 words)

Constraints:
- Principles must cover distinct dimensions — do not create two principles that address the same concept
- Each strip must clearly exemplify exactly one principle — not two
- At least 4 strips must be set in the specified industry context (not generic training scenarios)
- Strips must include both design-level choices (curriculum, scheduling, materials) and facilitation-level choices (in-room behaviour, responses to participants)
- At least 2 strips must involve a moment where the facilitator has to actively intervene — not just passively design

Output format:
```javascript
// Paste into js/games/grpMatch.js — replace the existing DATA object
const DATA = {
  principles: [ ... ],
  strips: [ ... ]
};
```

---

### Task 4 — Forum Theater
*Output file: `js/games/forumTheater.js` — replace `DATA.vignettes`*

Generate 4 Forum Theater vignettes set in the specified industry and context.

**For each vignette, provide:**
- `id`: "v1" through "v4"
- `title`: 3–5 word title naming the central injustice or situation
- `character`: first name of the protagonist (the person facing the injustice)
- `characterRole`: their role in the organisation (max 5 words)
- `charInitials`: 1–2 characters
- `charColor`: hex color
- `scene`: a paragraph describing the situation in concrete, observable terms — what was said, by whom, in what setting (max 80 words). Write it as a third-person narrative. The injustice must be clear but not cartoonish.
- `question`: the question posed to the learner (max 20 words)
- `options`: array of exactly 3 options:
  - `id`: "o1", "o2", "o3"
  - `text`: what the learner does (max 35 words)
  - `quality`: "best", "partial", or "ineffective"
  - `principle`: the GRP principle id this option relates to (or `null` for ineffective)
  - `principleLabel`: the principle label (or `null`)
  - `outcome`: what happens as a result (max 35 words)
  - `feedback`: why this works or fails (max 40 words)
- `reflection`: one paragraph for facilitators summarising the key learning (max 50 words)

Constraints:
- Each vignette must depict a different type of gender injustice: e.g. voice/visibility, assessment bias, promotion, workplace harassment — do not repeat the same mechanism across vignettes
- The "ineffective" option must be something a well-intentioned person would genuinely consider — not obviously wrong
- The "partial" option must be genuinely helpful but fall short in a specific, nameable way
- The "best" option must use a formal or structural mechanism — not just interpersonal courage
- At least 2 vignettes must involve a bystander role (the learner witnesses the injustice and must decide whether and how to intervene)
- All character names must be culturally appropriate for the specified country

Output format:
```javascript
// Paste into js/games/forumTheater.js — replace the existing DATA.vignettes array
const DATA = {
  vignettes: [ ... ]
};
```

---

### Task 5 — Longwe Framework Ladder
*Output file: `js/games/longwe.js` — replace `DATA.interventions` and `DATA.finalPrompt`*

The 5 levels of Longwe's framework are fixed. Generate 5 intervention cards — one per level — and a final reflection prompt, all set in the specified industry and context.

The 5 levels are:
1. **Welfare** — meeting immediate material needs without addressing causes
2. **Access** — equalising access to resources, services, or opportunities
3. **Conscientisation** — raising awareness that inequality is socially constructed
4. **Participation** — women actively influencing decisions on equal terms
5. **Control** — equal control over resources and benefits; balanced power

**For each intervention card, provide:**
- `id`: "i1" through "i5"
- `title`: 3–6 word name of the intervention or policy
- `description`: one sentence describing what the intervention does in concrete terms (max 30 words)
- `correct`: the level number (1–5) this intervention belongs to
- `explanation`: 2 sentences — first, why this belongs at this level; second, what it achieves and what it does not (max 50 words total)

**`finalPrompt`:** one reflective question for participants, referencing the specified industry and context (max 40 words)

Constraints:
- All 5 interventions must relate to the same thematic issue within the specified sector (e.g. women in leadership, training access, pay equity, procurement) — they form a progression, not 5 unrelated examples
- The distinction between levels must be analytically clear — a Level 2 intervention must not be arguable as Level 3
- The Level 4 and Level 5 interventions must feel genuinely ambitious — not just slightly better than Level 3

Output format:
```javascript
// Paste into js/games/longwe.js — replace DATA.interventions and DATA.finalPrompt
const DATA = {
  levels: [
    { id: 1, name: 'Welfare', description: "Meeting women's basic material needs — without addressing the causes of inequality.", color: '#E74C3C', icon: '🍚' },
    { id: 2, name: 'Access', description: "Improving women's access to resources — education, land, credit — on equal terms with men.", color: '#E67E22', icon: '🚪' },
    { id: 3, name: 'Conscientisation', description: 'Raising awareness that gender disadvantage is socially constructed — not natural or inevitable.', color: '#F1C40F', icon: '💡' },
    { id: 4, name: 'Participation', description: 'Women actively influencing decisions — in projects, institutions, and policy — on equal terms.', color: '#2ECC71', icon: '🗳️' },
    { id: 5, name: 'Control', description: 'Women and men having equal control over resources and benefits — a balance of power achieved through empowerment.', color: '#1B4F72', icon: '⚖️' }
  ],
  interventions: [ ... ],
  finalPrompt: '...'
};
```

---

### Task 6 — Resistance Response Simulator
*Output file: `js/games/resistance.js` — replace `DATA.scenarios`*

Generate 3 resistance scenarios — one Ideological, one Protectionist, one Fatalist — set in the specified industry and context.

**For each scenario, provide:**
- `id`: "r1", "r2", "r3"
- `type`: "Ideological", "Protectionist", or "Fatalist"
- `typeColor`: use exactly #E74C3C for Ideological, #E67E22 for Protectionist, #8E44AD for Fatalist
- `typeDesc`: one sentence defining this resistance type in plain language (max 20 words)
- `participant`: role or title of the person speaking (max 6 words)
- `participantInitials`: 2 characters
- `participantColor`: a distinct hex color
- `statement`: the resistance statement, written in first person and in quotation marks (40–70 words). It must sound like a real, thoughtful person — not a villain. The person should have a coherent internal logic even if their conclusion is wrong.
- `context`: one sentence saying when and where this is said (max 20 words)
- `options`: array of exactly 3 options:
  - `id`: "o1", "o2", "o3"
  - `text`: the facilitator's response — written as direct speech or a clear description of what the facilitator does (40–70 words)
  - `quality`: "best", "partial", or "ineffective"
  - `explanation`: why this response works or fails — specific to this scenario, not generic (max 45 words)
- `coachingNote`: one paragraph of facilitation guidance for handling this type of resistance (max 65 words)

Constraints:
- The "best" response must not cite data, lecture, or argue. It must either ask a question that invites reflection, find shared values, or shift the frame — without dismissing the concern.
- The Ideological resistance must be grounded in a real cultural, religious, or political context relevant to the specified country — not a generic objection.
- The Protectionist resistance must come from someone with genuine credibility: they succeeded, their experience is real, their logic is internally consistent.
- The Fatalist resistance must name a specific, real institutional barrier — not vague pessimism. The person must genuinely care about the goals.
- The "ineffective" option must be something a well-trained facilitator might reach for under pressure (e.g. citing evidence, appealing to authority) — not obviously wrong.

Output format:
```javascript
// Paste into js/games/resistance.js — replace the existing DATA.scenarios array
const DATA = {
  scenarios: [ ... ]
};
```

---

*End of prompt. Output all 6 code blocks in order, Task 1 through Task 6. No text outside the code blocks.*
