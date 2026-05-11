/* =========================================================
   ÉTAT (localStorage) — scopé au profil actif
   ========================================================= */
function defaultState() {
  return {
    cardsKnown: [],          // ids cards connues
    conceptsChecked: [],     // ids concepts (mod-section-idx) cochés
    glossaryMastered: [],    // termes maitrisés
    quizBest: null,
    lastVisit: null,
    streak: 0,
    dark: false
  };
}

function hasActiveProfile() {
  return !!(window.EcoAuth && window.EcoAuth.getCurrentProfile());
}

function currentStateKey() {
  if (window.EcoAuth) {
    const p = window.EcoAuth.getCurrentProfile();
    if (p) return window.EcoAuth.getStateKey(p.id);
  }
  return null;
}

function loadState() {
  const key = currentStateKey();
  if (!key) return defaultState();
  try {
    return Object.assign(defaultState(), JSON.parse(localStorage.getItem(key)) || {});
  } catch {
    return defaultState();
  }
}

let state = loadState();

function saveState() {
  const key = currentStateKey();
  if (key) localStorage.setItem(key, JSON.stringify(state));
  updateProgress();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2200);
}

/* =========================================================
   DARK MODE
   ========================================================= */
const darkBtn = document.getElementById('darkToggle');
function applyDark() {
  document.documentElement.classList.toggle('dark', state.dark);
  document.getElementById('iconSun').classList.toggle('hidden', state.dark);
  document.getElementById('iconMoon').classList.toggle('hidden', !state.dark);
}
darkBtn.addEventListener('click', () => {
  state.dark = !state.dark;
  applyDark();
  saveState();
});
applyDark();

/* =========================================================
   STREAK (jours consécutifs)
   ========================================================= */
(function checkStreak() {
  const today = new Date().toDateString();
  if (state.lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastVisit === yesterday) state.streak = (state.streak || 0) + 1;
    else state.streak = 1;
    state.lastVisit = today;
    saveState();
  }
})();

/* =========================================================
   PROGRESS
   ========================================================= */
function updateProgress() {
  const totalConcepts = MODULES.reduce((acc, m) => acc + m.sections.reduce((a, s) => a + s.points.length, 0), 0);
  const totalCards = FLASHCARDS.length;
  const totalGlossary = FLASHCARDS.length; // glossaire = flashcards
  const allTotal = totalConcepts + totalCards + totalGlossary;
  const done = (state.conceptsChecked.length || 0) + (state.cardsKnown.length || 0) + (state.glossaryMastered.length || 0);
  const pct = Math.round((done / allTotal) * 100);

  document.getElementById('progressPct').textContent = pct + '%';
  const ring = document.getElementById('progressRing');
  const C = 2 * Math.PI * 42;
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C * (1 - pct / 100);

  document.getElementById('statCards').textContent = (state.cardsKnown.length || 0) + ' / ' + totalCards;
  document.getElementById('statQuiz').textContent = state.quizBest !== null ? state.quizBest + ' / ' + 15 : '—';
  document.getElementById('statGlossary').textContent = (state.glossaryMastered.length || 0) + ' / ' + totalGlossary;
  document.getElementById('statStreak').textContent = '🔥 ' + (state.streak || 0);
  document.getElementById('quizBest').textContent = state.quizBest !== null ? state.quizBest + ' / 15' : '—';
}

/* =========================================================
   MODULES — render
   ========================================================= */
function renderModules() {
  const c = document.getElementById('modulesContainer');
  c.innerHTML = '';
  MODULES.forEach((mod, mi) => {
    const totalPoints = mod.sections.reduce((a, s) => a + s.points.length, 0);
    const checkedPoints = mod.sections.reduce((a, s, si) =>
      a + s.points.filter((_, pi) => state.conceptsChecked.includes(`${mod.id}-${si}-${pi}`)).length, 0);
    const pct = Math.round(checkedPoints / totalPoints * 100);

    const div = document.createElement('div');
    div.className = 'reveal bg-paper border border-line rounded-2xl overflow-hidden';
    div.innerHTML = `
      <button class="w-full flex items-stretch gap-6 p-6 text-left hover:bg-bg2/50 transition module-toggle">
        <div class="module-num text-7xl md:text-8xl text-accent w-24 flex-shrink-0">${mod.num}</div>
        <div class="flex-1 min-w-0">
          <div class="text-[11px] font-mono ink-2 uppercase tracking-widest mb-1">Module ${mod.num}</div>
          <h3 class="font-serif text-2xl md:text-3xl ink leading-tight">${mod.title}</h3>
          <p class="text-sm ink-2 mt-2">${mod.subtitle}</p>
        </div>
        <div class="flex-shrink-0 flex flex-col items-end justify-center gap-2">
          <div class="text-xs font-mono ink-2">${checkedPoints} / ${totalPoints}</div>
          <div class="w-24 h-1.5 bg-bg2 rounded-full overflow-hidden">
            <div class="h-full bg-accent transition-all" style="width:${pct}%"></div>
          </div>
          <svg class="ink-2 chevron transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>
      <div class="module-content hidden divider px-6 md:px-12 py-8 space-y-10">
        ${mod.sections.map((s, si) => `
          <div>
            <div class="flex items-center gap-3 mb-5">
              <div class="text-[11px] font-mono text-accent uppercase tracking-widest">§ ${si + 1}</div>
              <h4 class="font-serif text-xl ink">${s.heading}</h4>
            </div>
            <div class="space-y-3">
              ${s.points.map((p, pi) => {
                const cid = `${mod.id}-${si}-${pi}`;
                const checked = state.conceptsChecked.includes(cid);
                return `
                  <div class="flex items-start gap-4 p-4 rounded-lg hover:bg-bg2 transition group">
                    <span class="check ${checked ? 'checked' : ''}" data-cid="${cid}"></span>
                    <div class="flex-1">
                      <div class="font-medium ink mb-1">${p.k}</div>
                      <div class="text-sm ink-2 leading-relaxed">${p.v}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    c.appendChild(div);
  });

  // listeners
  c.querySelectorAll('.module-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const chev = btn.querySelector('.chevron');
      content.classList.toggle('hidden');
      chev.style.transform = content.classList.contains('hidden') ? 'rotate(0)' : 'rotate(180deg)';
    });
  });
  c.querySelectorAll('.check').forEach(chk => {
    chk.addEventListener('click', (e) => {
      e.stopPropagation();
      const cid = chk.dataset.cid;
      const idx = state.conceptsChecked.indexOf(cid);
      const wasChecked = idx >= 0;
      if (wasChecked) state.conceptsChecked.splice(idx, 1);
      else {
        state.conceptsChecked.push(cid);
        showToast('Concept maîtrisé ✓');
      }
      saveState();
      // Mise à jour locale (pas de re-render complet, on garde le module ouvert)
      chk.classList.toggle('checked', !wasChecked);
      // Mettre à jour le compteur + la barre de progression du module concerné
      const modId = cid.split('-')[0];
      const mod = MODULES.find(m => m.id === modId);
      if (mod) {
        const totalPoints = mod.sections.reduce((a, s) => a + s.points.length, 0);
        const checkedPoints = mod.sections.reduce((a, s, si) =>
          a + s.points.filter((_, pi) => state.conceptsChecked.includes(`${mod.id}-${si}-${pi}`)).length, 0);
        const pct = Math.round(checkedPoints / totalPoints * 100);
        const moduleBlock = chk.closest('.bg-paper');
        if (moduleBlock) {
          const counter = moduleBlock.querySelector('.module-toggle .text-xs.font-mono');
          const bar = moduleBlock.querySelector('.module-toggle .h-full.bg-accent');
          if (counter) counter.textContent = `${checkedPoints} / ${totalPoints}`;
          if (bar) bar.style.width = pct + '%';
        }
      }
    });
  });
}
renderModules();

/* =========================================================
   FLASHCARDS
   ========================================================= */
let flashIdx = 0;
let flashFilter = 'all';
function getFilteredCards() {
  return flashFilter === 'all' ? FLASHCARDS : FLASHCARDS.filter(c => c.mod === flashFilter);
}
function renderFlash() {
  const cards = getFilteredCards();
  if (cards.length === 0) return;
  flashIdx = ((flashIdx % cards.length) + cards.length) % cards.length;
  const card = cards[flashIdx];
  document.getElementById('flashTag').textContent = card.tag;
  document.getElementById('flashTerm').textContent = card.term;
  document.getElementById('flashDef').textContent = card.def;
  document.getElementById('flashIndex').textContent = flashIdx + 1;
  document.getElementById('flashIndex2').textContent = flashIdx + 1;
  document.getElementById('flashTotal').textContent = cards.length;
  document.getElementById('flashTotal2').textContent = cards.length;

  // unflip
  document.querySelector('.card-inner').classList.remove('flipped');

  // mark known visually
  const known = state.cardsKnown.includes(card.term);
  const markBtn = document.getElementById('markKnown');
  markBtn.innerHTML = known
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Maîtrisée ✓'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Je maîtrise';
}
document.getElementById('flashcard').addEventListener('click', () => {
  document.querySelector('.card-inner').classList.toggle('flipped');
});
document.getElementById('prevCard').addEventListener('click', (e) => {
  e.stopPropagation();
  flashIdx--;
  renderFlash();
});
document.getElementById('nextCard').addEventListener('click', (e) => {
  e.stopPropagation();
  flashIdx++;
  renderFlash();
});
document.getElementById('markKnown').addEventListener('click', (e) => {
  e.stopPropagation();
  const cards = getFilteredCards();
  const card = cards[flashIdx];
  const idx = state.cardsKnown.indexOf(card.term);
  if (idx >= 0) {
    state.cardsKnown.splice(idx, 1);
    showToast('Card retirée des maîtrisées');
  } else {
    state.cardsKnown.push(card.term);
    showToast('Card maîtrisée 🌱');
  }
  saveState();
  renderFlash();
});
document.querySelectorAll('#flashcardFilters .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#flashcardFilters .filter-btn').forEach(b => {
      b.classList.remove('active', 'bg-paper');
    });
    btn.classList.add('active', 'bg-paper');
    flashFilter = btn.dataset.filter;
    flashIdx = 0;
    renderFlash();
  });
});
// Keyboard nav
document.addEventListener('keydown', (e) => {
  // Only when flashcard section is visible
  const rect = document.getElementById('flashcards').getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  if (document.activeElement.tagName === 'INPUT') return;
  if (e.key === 'ArrowLeft') { flashIdx--; renderFlash(); }
  else if (e.key === 'ArrowRight') { flashIdx++; renderFlash(); }
  else if (e.key === ' ') {
    e.preventDefault();
    document.querySelector('.card-inner').classList.toggle('flipped');
  }
});
renderFlash();

/* =========================================================
   QUIZ
   ========================================================= */
let quiz = { questions: [], idx: 0, score: 0, answers: [] };
const QUIZ_SIZE = 15;

function startQuiz() {
  // shuffle
  const pool = [...QUIZ_POOL].sort(() => Math.random() - 0.5).slice(0, QUIZ_SIZE);
  quiz = { questions: pool, idx: 0, score: 0, answers: [] };
  document.getElementById('quizIntro').classList.add('hidden');
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizQuestion').classList.remove('hidden');
  document.getElementById('qTotal').textContent = QUIZ_SIZE;
  showQuestion();
}

function showQuestion() {
  const q = quiz.questions[quiz.idx];
  document.getElementById('qIndex').textContent = quiz.idx + 1;
  document.getElementById('qScore').textContent = quiz.score;
  document.getElementById('qProgress').style.width = ((quiz.idx) / QUIZ_SIZE * 100) + '%';
  document.getElementById('qText').innerHTML = q.q;
  const ansContainer = document.getElementById('qAnswers');
  ansContainer.innerHTML = q.answers.map((a, i) => `
    <button data-i="${i}" class="answer-btn w-full text-left p-4 border border-line rounded-lg flex items-center gap-3">
      <span class="w-6 h-6 rounded-full border border-line flex items-center justify-center font-mono text-xs ink-2">${String.fromCharCode(65 + i)}</span>
      <span class="flex-1">${a}</span>
    </button>
  `).join('');
  document.getElementById('qExplain').classList.add('hidden');
  document.getElementById('qNext').classList.add('hidden');

  ansContainer.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => answerQuiz(parseInt(btn.dataset.i)));
  });
}

function answerQuiz(i) {
  const q = quiz.questions[quiz.idx];
  const ansContainer = document.getElementById('qAnswers');
  const buttons = ansContainer.querySelectorAll('.answer-btn');
  buttons.forEach((b, bi) => {
    b.disabled = true;
    if (bi === q.correct) b.classList.add('correct');
    else if (bi === i) b.classList.add('wrong');
  });
  if (i === q.correct) quiz.score++;
  quiz.answers.push({ q: q.q, picked: i, correct: q.correct, answers: q.answers, explain: q.explain });
  document.getElementById('qScore').textContent = quiz.score;

  const ex = document.getElementById('qExplain');
  ex.innerHTML = '<strong class="ink">' + (i === q.correct ? '✓ Correct ! ' : '✗ La bonne réponse est ' + String.fromCharCode(65 + q.correct) + '. ') + '</strong>' + q.explain;
  ex.classList.remove('hidden');
  document.getElementById('qNext').classList.remove('hidden');
}

document.getElementById('qNext').addEventListener('click', () => {
  quiz.idx++;
  if (quiz.idx >= QUIZ_SIZE) endQuiz();
  else showQuestion();
});

function endQuiz() {
  document.getElementById('quizQuestion').classList.add('hidden');
  document.getElementById('quizResult').classList.remove('hidden');
  document.getElementById('finalScore').textContent = quiz.score;
  document.getElementById('finalTotal').textContent = QUIZ_SIZE;

  const pct = quiz.score / QUIZ_SIZE;
  let emoji, msg;
  if (pct === 1) { emoji = '🌟'; msg = 'Sans-faute. Tu peux passer à autre chose.'; }
  else if (pct >= 0.85) { emoji = '🌳'; msg = 'Excellent. Quelques détails à peaufiner.'; }
  else if (pct >= 0.65) { emoji = '🌱'; msg = 'Bon socle. Quelques relectures et c\'est dans la poche.'; }
  else if (pct >= 0.4) { emoji = '🌿'; msg = 'Encore quelques modules à revoir avant de retenter.'; }
  else { emoji = '🪴'; msg = 'Pas de panique, retourne aux modules et reviens.'; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultMessage').textContent = msg;

  if (state.quizBest === null || quiz.score > state.quizBest) {
    state.quizBest = quiz.score;
    saveState();
    if (quiz.score === QUIZ_SIZE) showToast('🎉 Sans-faute débloqué !');
    else showToast('Nouveau record : ' + quiz.score + '/' + QUIZ_SIZE);
  }

  // review hidden
  const review = document.getElementById('quizReview');
  review.classList.add('hidden');
  review.innerHTML = quiz.answers.map((a, i) => `
    <div class="border border-line rounded-lg p-4">
      <div class="text-xs font-mono ink-2 mb-1">Question ${i + 1} ${a.picked === a.correct ? '✓' : '✗'}</div>
      <div class="font-medium ink mb-2">${a.q}</div>
      <div class="text-sm ink-2 mb-2">Ta réponse : <span class="${a.picked === a.correct ? 'text-accent' : 'text-warn'}">${a.answers[a.picked]}</span></div>
      ${a.picked !== a.correct ? '<div class="text-sm text-accent mb-2">Bonne réponse : ' + a.answers[a.correct] + '</div>' : ''}
      <div class="text-xs ink-2 italic">${a.explain}</div>
    </div>
  `).join('');
}

document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.getElementById('retryQuiz').addEventListener('click', startQuiz);
document.getElementById('reviewQuiz').addEventListener('click', () => {
  document.getElementById('quizReview').classList.toggle('hidden');
});

/* =========================================================
   GLOSSAIRE
   ========================================================= */
function renderGlossary(filter = '') {
  const grid = document.getElementById('glossaryGrid');
  const q = filter.toLowerCase().trim();
  // alphabétique
  const sorted = [...FLASHCARDS].sort((a, b) => a.term.localeCompare(b.term, 'fr'));
  const filtered = sorted.filter(c =>
    !q || c.term.toLowerCase().includes(q) || c.def.toLowerCase().includes(q)
  );
  if (filtered.length === 0) {
    grid.innerHTML = '';
    document.getElementById('noResults').classList.remove('hidden');
    return;
  }
  document.getElementById('noResults').classList.add('hidden');
  grid.innerHTML = filtered.map(c => {
    const mastered = state.glossaryMastered.includes(c.term);
    return `
      <div class="bg-paper border border-line rounded-xl p-5 hover:shadow-md transition group">
        <div class="flex items-start justify-between mb-2">
          <span class="text-[10px] font-mono uppercase tracking-widest text-accent">${c.tag}</span>
          <button class="glossary-master text-xs ink-2 hover:text-accent ${mastered ? 'text-accent' : ''}" data-term="${c.term.replace(/"/g, '&quot;')}">${mastered ? '★ acquis' : '☆ marquer'}</button>
        </div>
        <h4 class="font-serif text-xl ink mb-2">${c.term}</h4>
        <p class="text-sm ink-2 leading-relaxed">${c.def}</p>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.glossary-master').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const term = btn.dataset.term;
      const idx = state.glossaryMastered.indexOf(term);
      if (idx >= 0) state.glossaryMastered.splice(idx, 1);
      else {
        state.glossaryMastered.push(term);
        showToast('Terme acquis ★');
      }
      saveState();
      renderGlossary(document.getElementById('searchInput').value);
    });
  });
}
document.getElementById('searchInput').addEventListener('input', (e) => {
  renderGlossary(e.target.value);
});
renderGlossary();

/* =========================================================
   RESET
   ========================================================= */
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Réinitialiser toute ta progression ? (cards, concepts, quiz, glossaire)')) {
    state = {
      cardsKnown: [],
      conceptsChecked: [],
      glossaryMastered: [],
      quizBest: null,
      lastVisit: state.lastVisit,
      streak: state.streak,
      dark: state.dark
    };
    saveState();
    renderModules();
    renderFlash();
    renderGlossary(document.getElementById('searchInput').value);
    showToast('Progression réinitialisée');
  }
});

/* =========================================================
   REVEAL ON SCROLL
   ========================================================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* =========================================================
   INIT + RELOAD SUR CHANGEMENT DE PROFIL
   ========================================================= */
updateProgress();

window.reloadAppState = function () {
  state = loadState();
  applyDark();
  // Re-vérifie le streak du jour pour le nouveau profil
  const today = new Date().toDateString();
  if (state.lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastVisit === yesterday) state.streak = (state.streak || 0) + 1;
    else state.streak = 1;
    state.lastVisit = today;
    saveState();
  }
  renderModules();
  renderFlash();
  renderGlossary(document.getElementById('searchInput').value || '');
  // Reset quiz UI à l'intro
  document.getElementById('quizQuestion').classList.add('hidden');
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizIntro').classList.remove('hidden');
  updateProgress();
};
