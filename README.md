# Gender Mainstreaming Toolkit — Template

A customisable interactive learning toolkit for gender mainstreaming trainers. Fork this repo, generate your own scenarios using the included Claude prompt, and deploy a live site in under an hour — no coding required.

Built on the original [Gender Mainstreaming in Practice](https://karish-ma.github.io/gender-mainstreaming-toolkit/) toolkit, developed from Training of Trainers materials for TVET systems.

---

## What's in the toolkit

Six interactive activities covering the core concepts and facilitation skills for gender mainstreaming work:

| Activity | What it covers |
|---|---|
| Sort the Cards | PGN vs SGI — distinguishing practical needs from strategic interests |
| Power Walk | Structural privilege — visualising intersecting advantages and disadvantages |
| Match the Principle | Gender-Responsive Pedagogy — connecting principles to practice |
| Forum Theater | Facilitation skills — choosing effective interventions in real scenarios |
| Climb the Ladder | Longwe Framework — mapping interventions to levels of empowerment |
| Hold the Room | Resistance — responding to Ideological, Protectionist, and Fatalist pushback |

---

## How to customise it

### Step 1 — Fork this repo

Click **Use this template** (or Fork) at the top of this page. Then enable GitHub Pages: Settings → Pages → Deploy from branch → main / root → Save.

Your site will be live at `https://YOUR-USERNAME.github.io/REPO-NAME/`

### Step 2 — Generate your scenarios

Open [CUSTOMISE.md](./CUSTOMISE.md) and copy the full prompt. Paste it into [claude.ai](https://claude.ai), filling in these four lines at the top:

```
Industry/Sector: [e.g. healthcare / banking / civil service / agriculture]
Country/Region: [e.g. Rwanda / Southeast Asia / West Africa]
Organisation type: [e.g. NGO / government ministry / private sector]
Participant profile: [e.g. mid-level managers / frontline staff / trainers]
```

Claude will output 6 code blocks — one per activity.

### Step 3 — Paste the output

For each activity, open the corresponding JS file and replace the `DATA = { ... }` object with Claude's output:

| Task | File to edit |
|---|---|
| Task 1 — PGN vs SGI | `js/games/cardSort.js` |
| Task 2 — Power Walk | `js/games/powerWalk.js` |
| Task 3 — GRP Principles | `js/games/grpMatch.js` |
| Task 4 — Forum Theater | `js/games/forumTheater.js` |
| Task 5 — Longwe Framework | `js/games/longwe.js` |
| Task 6 — Resistance | `js/games/resistance.js` |

Each file has a comment at the top of the DATA block marking exactly what to replace.

### Step 4 — Update the site text

In `index.html`, update the masthead title/description and the "About this project" section to reflect your context.

### Step 5 — Push to GitHub

```bash
git add .
git commit -m "Customise for [your context]"
git push
```

Your site updates automatically within a minute.

---

## Customising further

**Want to change colours or fonts?** All design tokens are in `css/style.css` at the top of the file.

**Want to add a language?** All text is in the JS data files and `index.html` — no build step required.

**Want to change the number of scenarios?** The games expect specific counts (6 cards, 5 characters, 4 vignettes, etc.) — sticking to these keeps the layout intact.

---

## Technical notes

- Pure HTML, CSS, and JavaScript — no framework, no build step
- Progress saved in browser localStorage — no server, no database
- Works fully offline once loaded
- Tested on Chrome, Firefox, Safari, and mobile

---

## Licence

MIT. Use it, adapt it, redistribute it. A credit back to the original is appreciated but not required.

---

## Original project

The scenarios in this template are placeholders. The full working version — built for TVET systems in Bangladesh — is at [karish-ma.github.io/gender-mainstreaming-toolkit](https://karish-ma.github.io/gender-mainstreaming-toolkit/).
