/* =========================================================
   CHATBOT — API Mistral
   ========================================================= */
const MISTRAL_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-small-latest'; // gratuit & performant

const CHAT_KEY_STORAGE = 'ti616-mistral-key-v1';
let chatHistory = []; // {role, content}
let chatStreaming = false;
let pendingAutoPrompt = null; // prompt à envoyer dès que la clé API est prête

// Construit le contexte du cours à partir des données existantes
function buildCourseContext() {
  let ctx = '# CONTENU DU COURS TI616 - NUMÉRIQUE DURABLE\n\n';
  MODULES.forEach(mod => {
    ctx += `## Module ${mod.num} — ${mod.title}\n`;
    ctx += `${mod.subtitle}\n\n`;
    mod.sections.forEach(s => {
      ctx += `### ${s.heading}\n`;
      s.points.forEach(p => {
        // Strip HTML tags for cleaner context
        const cleanV = p.v.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        ctx += `- **${p.k}** : ${cleanV}\n`;
      });
      ctx += '\n';
    });
  });
  ctx += '\n# GLOSSAIRE / FLASHCARDS\n\n';
  FLASHCARDS.forEach(c => {
    ctx += `- **${c.term}** (${c.tag}) : ${c.def}\n`;
  });
  return ctx;
}

const SYSTEM_PROMPT = `Tu es Eco·Assistant, un assistant pédagogique pour un étudiant qui révise son cours TI616 "Numérique Durable" à l'EFREI (cours de Yvan Guifo, 2025/2026).

Ton rôle :
- Aider à comprendre les concepts du cours (Green IT, IT for Green, éco-conception, code efficace, Green Web).
- Répondre aux questions de manière claire, pédagogique et synthétique.
- Donner des exemples concrets quand c'est utile.
- Quand tu cites un chiffre ou une définition, t'appuyer sur le contenu du cours fourni ci-dessous.

Style :
- Tutoie l'étudiant.
- Sois concis : pas de blabla, va à l'essentiel.
- Utilise du markdown léger (gras, listes, code inline) pour structurer.
- Si une question sort du cadre du cours, tu peux y répondre brièvement, mais ramène vers le cours quand pertinent.
- Si tu ne sais pas, dis-le honnêtement.

${buildCourseContext()}`;

// Charge la clé API
function getApiKey() {
  return localStorage.getItem(CHAT_KEY_STORAGE);
}
function setApiKey(k) {
  localStorage.setItem(CHAT_KEY_STORAGE, k);
}
function clearApiKey() {
  localStorage.removeItem(CHAT_KEY_STORAGE);
}

// Markdown → HTML via marked.js (titres, tableaux, code, listes, etc.)
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,      // \n → <br>
    gfm: true,         // GitHub flavored (tables, ~~strike~~, etc.)
    headerIds: false,
    mangle: false,
    silent: true
  });
}
function md(text) {
  if (typeof marked === 'undefined') {
    // Fallback minimal si marked n'est pas chargé
    let h = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    h = h.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    return h.split(/\n\n+/).map(p => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');
  }
  let html = marked.parse(text);
  // Wrap tables dans un conteneur scrollable horizontal
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  return html;
}

function showChatPanel(panel) {
  // panel = 'setup' | 'chat'
  document.getElementById('chatSetup').classList.toggle('hidden', panel !== 'setup');
  document.getElementById('chatMessages').classList.toggle('hidden', panel !== 'chat');
  document.getElementById('chatSuggestions').classList.toggle('hidden', panel !== 'chat' || chatHistory.length > 0);
  document.getElementById('chatInputArea').classList.toggle('hidden', panel !== 'chat');
}

function openChat() {
  document.getElementById('chatPanel').classList.add('open');
  document.getElementById('chatFab').classList.add('hidden');
  if (!getApiKey()) {
    showChatPanel('setup');
  } else {
    showChatPanel('chat');
    if (chatHistory.length === 0) showWelcome();
    setTimeout(() => document.getElementById('chatInput').focus(), 350);
  }
}

function closeChat() {
  document.getElementById('chatPanel').classList.remove('open');
  document.getElementById('chatFab').classList.remove('hidden');
}

function showWelcome() {
  const messages = document.getElementById('chatMessages');
  messages.innerHTML = `
    <div class="chat-msg bot">
      <p>Salut ! 🌱 Je suis ton assistant pour réviser le cours TI616.</p>
      <p>Je connais les <strong>5 modules</strong>, les définitions, les chiffres-clés, les bonnes pratiques d'éco-conception... Pose-moi tes questions, ou clique sur une suggestion ci-dessous.</p>
    </div>
  `;
}

function addMessage(role, content, opts = {}) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + role + (opts.error ? ' error' : '');
  if (role === 'bot') {
    div.innerHTML = content ? md(content) : '<div class="typing-dots"><span></span><span></span><span></span></div>';
  } else {
    div.textContent = content;
  }
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  // Hide suggestions once user starts conversation
  if (role === 'user') document.getElementById('chatSuggestions').classList.add('hidden');
  return div;
}

async function sendMessage(userText) {
  if (chatStreaming) return;
  const text = userText.trim();
  if (!text) return;
  const apiKey = getApiKey();
  if (!apiKey) { showChatPanel('setup'); return; }

  // Add user msg
  addMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  // Add bot placeholder
  const botEl = addMessage('bot', null);
  chatStreaming = true;
  document.getElementById('chatSend').disabled = true;

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory
    ];

    const response = await fetch(MISTRAL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: messages,
        stream: true,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      let errText = 'Erreur HTTP ' + response.status;
      try {
        const errJson = await response.json();
        if (errJson.message) errText = errJson.message;
        else if (errJson.error?.message) errText = errJson.error.message;
      } catch (e) {}
      if (response.status === 401) errText = 'Clé API invalide. Vérifie ta clé Mistral dans les réglages.';
      else if (response.status === 429) errText = 'Trop de requêtes. Mistral limite le free tier — attends un instant.';
      throw new Error(errText);
    }

    // Streaming SSE
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Parse SSE lines
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            botEl.innerHTML = md(fullText);
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
          }
        } catch (e) {
          // ignore parse errors on partial chunks
        }
      }
    }

    if (!fullText) {
      botEl.innerHTML = md('Hmm, je n\'ai rien reçu en réponse. Réessaie ?');
    } else {
      chatHistory.push({ role: 'assistant', content: fullText });
      // Trim history if too long (garder les 12 derniers échanges)
      if (chatHistory.length > 24) chatHistory = chatHistory.slice(-24);
    }
  } catch (err) {
    botEl.classList.add('error');
    botEl.innerHTML = md('⚠️ ' + (err.message || 'Erreur inconnue. Vérifie ta connexion ou ta clé API.'));
  } finally {
    chatStreaming = false;
    document.getElementById('chatSend').disabled = document.getElementById('chatInput').value.trim().length === 0;
  }
}

// Wiring
document.getElementById('chatFab').addEventListener('click', openChat);
document.getElementById('chatClose').addEventListener('click', closeChat);

document.getElementById('saveApiKey').addEventListener('click', () => {
  const v = document.getElementById('apiKeyInput').value.trim();
  if (!v) { showToast('Colle d\'abord ta clé'); return; }
  setApiKey(v);
  document.getElementById('apiKeyInput').value = '';
  showChatPanel('chat');
  showWelcome();
  showToast('Clé enregistrée 🔑');
  // Si une question était en attente (clic sur ✨), on l'envoie maintenant
  if (pendingAutoPrompt) {
    const p = pendingAutoPrompt;
    pendingAutoPrompt = null;
    setTimeout(() => sendMessage(p), 300);
  } else {
    setTimeout(() => document.getElementById('chatInput').focus(), 100);
  }
});

/* =========================================================
   PROMPT AUTOMATIQUE depuis les modules
   ========================================================= */
window.askAboutConcept = function (key, value, moduleTitle) {
  // Nettoyer le HTML de la valeur pour le prompt
  const clean = String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const ctx = moduleTitle ? `(Module : ${moduleTitle})` : '';
  const prompt = `Peux-tu m'expliquer plus en détail le concept suivant du cours ${ctx} :

**${key}**

Voici la définition donnée dans le cours :
> ${clean}

Approfondis le sujet : donne des exemples concrets, le contexte, des analogies si utile, et tout ce qui peut m'aider à bien le retenir pour mon examen. Sois pédagogue mais reste synthétique.`;

  openChat();

  if (!getApiKey()) {
    pendingAutoPrompt = prompt;
    return;
  }
  // Laisser le panel s'ouvrir avant d'envoyer
  setTimeout(() => sendMessage(prompt), 300);
};

document.getElementById('chatSettings').addEventListener('click', () => {
  if (confirm('Veux-tu réinitialiser ta clé API et la conversation ?')) {
    clearApiKey();
    chatHistory = [];
    document.getElementById('chatMessages').innerHTML = '';
    showChatPanel('setup');
  }
});

const chatInputEl = document.getElementById('chatInput');
const chatSendEl = document.getElementById('chatSend');

chatInputEl.addEventListener('input', () => {
  chatSendEl.disabled = chatInputEl.value.trim().length === 0 || chatStreaming;
  // auto-resize
  chatInputEl.style.height = 'auto';
  chatInputEl.style.height = Math.min(chatInputEl.scrollHeight, 120) + 'px';
});

chatInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!chatSendEl.disabled) chatSendEl.click();
  }
});

chatSendEl.addEventListener('click', () => {
  const text = chatInputEl.value.trim();
  if (!text) return;
  chatInputEl.value = '';
  chatInputEl.style.height = 'auto';
  chatSendEl.disabled = true;
  sendMessage(text);
});

document.querySelectorAll('.chat-sugg').forEach(btn => {
  btn.addEventListener('click', () => {
    sendMessage(btn.dataset.prompt);
  });
});

// Permettre coller la clé avec Enter
document.getElementById('apiKeyInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('saveApiKey').click();
});

/* ===== Redimensionnement & expand/collapse ===== */
const CHAT_SIZE_KEY = 'ti616-chat-size-v1';
const SIZE_DEFAULT = { w: 420, h: 620 };
const SIZE_LARGE = { w: 720, h: 780 };
const SIZE_MIN = { w: 360, h: 460 };

const chatPanelEl = document.getElementById('chatPanel');
const resizeHandleEl = document.getElementById('chatResize');
const expandBtnEl = document.getElementById('chatExpand');
const iconExpandEl = document.getElementById('iconExpand');
const iconCollapseEl = document.getElementById('iconCollapse');

function applyChatSize(w, h, animate = false) {
  const maxW = Math.min(w, window.innerWidth - 32);
  const maxH = Math.min(h, window.innerHeight - 32);
  const finalW = Math.max(SIZE_MIN.w, maxW);
  const finalH = Math.max(SIZE_MIN.h, maxH);
  if (!animate) chatPanelEl.classList.add('resizing'); // disable size transition
  chatPanelEl.style.width = finalW + 'px';
  chatPanelEl.style.height = finalH + 'px';
  if (!animate) {
    requestAnimationFrame(() => chatPanelEl.classList.remove('resizing'));
  }
  updateExpandIcon(finalW);
}

function updateExpandIcon(currentW) {
  // Si on est >= 600px, le bouton propose de réduire (icône collapse)
  const isLarge = currentW >= 600;
  iconExpandEl.classList.toggle('hidden', isLarge);
  iconCollapseEl.classList.toggle('hidden', !isLarge);
}

function saveChatSize() {
  localStorage.setItem(CHAT_SIZE_KEY, JSON.stringify({
    w: chatPanelEl.offsetWidth,
    h: chatPanelEl.offsetHeight
  }));
}

function loadChatSize() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_SIZE_KEY));
    if (saved && saved.w && saved.h) {
      applyChatSize(saved.w, saved.h, false);
      return;
    }
  } catch (e) {}
  applyChatSize(SIZE_DEFAULT.w, SIZE_DEFAULT.h, false);
}

// Expand / collapse toggle
expandBtnEl.addEventListener('click', () => {
  const currentW = chatPanelEl.offsetWidth;
  const target = currentW >= 600 ? SIZE_DEFAULT : SIZE_LARGE;
  applyChatSize(target.w, target.h, true);
  setTimeout(saveChatSize, 400);
});

// Drag to resize
let resizing = false;
let resizeStart = null;

function startResize(clientX, clientY) {
  resizing = true;
  resizeStart = {
    x: clientX, y: clientY,
    w: chatPanelEl.offsetWidth,
    h: chatPanelEl.offsetHeight
  };
  chatPanelEl.classList.add('resizing');
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'nwse-resize';
}

function moveResize(clientX, clientY) {
  if (!resizing) return;
  const dx = resizeStart.x - clientX; // drag à gauche → dx > 0 → on agrandit
  const dy = resizeStart.y - clientY; // drag en haut → dy > 0 → on agrandit
  const newW = Math.max(SIZE_MIN.w, Math.min(window.innerWidth - 32, resizeStart.w + dx));
  const newH = Math.max(SIZE_MIN.h, Math.min(window.innerHeight - 32, resizeStart.h + dy));
  chatPanelEl.style.width = newW + 'px';
  chatPanelEl.style.height = newH + 'px';
  updateExpandIcon(newW);
}

function endResize() {
  if (!resizing) return;
  resizing = false;
  chatPanelEl.classList.remove('resizing');
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  saveChatSize();
}

resizeHandleEl.addEventListener('mousedown', (e) => {
  e.preventDefault();
  startResize(e.clientX, e.clientY);
});
document.addEventListener('mousemove', (e) => {
  if (resizing) moveResize(e.clientX, e.clientY);
});
document.addEventListener('mouseup', endResize);

// Touch
resizeHandleEl.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    e.preventDefault();
    startResize(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });
document.addEventListener('touchmove', (e) => {
  if (resizing && e.touches.length === 1) {
    e.preventDefault();
    moveResize(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });
document.addEventListener('touchend', endResize);
document.addEventListener('touchcancel', endResize);

// Re-clamp si la fenêtre du navigateur est redimensionnée
window.addEventListener('resize', () => {
  const w = chatPanelEl.offsetWidth;
  const h = chatPanelEl.offsetHeight;
  applyChatSize(w, h, false);
});

// Charger la taille sauvegardée au démarrage
loadChatSize();
