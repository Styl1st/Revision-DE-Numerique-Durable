/* =========================================================
   PROFILS · CONNEXION RAPIDE LOCALE
   ========================================================= */
(function () {
  const PROFILES_KEY      = 'ti616-profiles-v1';
  const CURRENT_KEY       = 'ti616-current-profile-v1';
  const LEGACY_STATE_KEY  = 'ti616-revisions-state-v1';
  const AVATARS = ['🌱','🌿','🌳','🍀','🌵','🌾','🍃','🌻','🌼','🌷','🌍','♻️','🪴','🌲','🐢','🦋'];

  // ---------- Helpers ----------
  function rid() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
  function getStateKey(id) { return `ti616-state-${id}-v1`; }

  async function hashPin(pin) {
    if (!pin) return null;
    const data = new TextEncoder().encode('ti616:' + pin);
    const buf  = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getProfiles() {
    try { return JSON.parse(localStorage.getItem(PROFILES_KEY)) || []; }
    catch { return []; }
  }
  function setProfiles(list) { localStorage.setItem(PROFILES_KEY, JSON.stringify(list)); }
  function getCurrentId()    { return localStorage.getItem(CURRENT_KEY); }
  function setCurrentId(id)  { localStorage.setItem(CURRENT_KEY, id); }
  function clearCurrentId()  { localStorage.removeItem(CURRENT_KEY); }

  function getCurrentProfile() {
    const id = getCurrentId();
    if (!id) return null;
    return getProfiles().find(p => p.id === id) || null;
  }

  function touchProfile(id) {
    const list = getProfiles();
    const p = list.find(x => x.id === id);
    if (p) { p.lastActive = Date.now(); setProfiles(list); }
  }

  // ---------- Migration ancien état mono-utilisateur ----------
  function migrateLegacy() {
    const legacy   = localStorage.getItem(LEGACY_STATE_KEY);
    const profiles = getProfiles();
    if (legacy && profiles.length === 0) {
      const id = rid();
      const profile = {
        id, name: 'Moi', avatar: '🌱', pinHash: null,
        createdAt: Date.now(), lastActive: Date.now()
      };
      setProfiles([profile]);
      localStorage.setItem(getStateKey(id), legacy);
      setCurrentId(id);
      try { localStorage.removeItem(LEGACY_STATE_KEY); } catch {}
      return profile;
    }
    return null;
  }

  // ---------- CRUD profils ----------
  async function createProfile({ name, avatar, pin }) {
    const list = getProfiles();
    const profile = {
      id: rid(),
      name: (name || '').trim().slice(0, 24) || 'Anonyme',
      avatar: avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
      pinHash: pin ? await hashPin(pin) : null,
      createdAt: Date.now(),
      lastActive: Date.now()
    };
    list.push(profile);
    setProfiles(list);
    return profile;
  }

  async function updateProfile(id, patch) {
    const list = getProfiles();
    const p = list.find(x => x.id === id);
    if (!p) return null;
    if (patch.name !== undefined)    p.name   = patch.name.trim().slice(0, 24) || p.name;
    if (patch.avatar !== undefined)  p.avatar = patch.avatar;
    if (patch.pin !== undefined)     p.pinHash = patch.pin ? await hashPin(patch.pin) : null;
    setProfiles(list);
    return p;
  }

  async function verifyPin(profile, pin) {
    if (!profile.pinHash) return true;
    const h = await hashPin(pin || '');
    return h === profile.pinHash;
  }

  function deleteProfile(id) {
    const list = getProfiles().filter(p => p.id !== id);
    setProfiles(list);
    localStorage.removeItem(getStateKey(id));
    if (getCurrentId() === id) {
      if (list.length > 0) setCurrentId(list[0].id);
      else clearCurrentId();
    }
  }

  // ---------- Export / Import ----------
  function exportCurrent() {
    const p = getCurrentProfile();
    if (!p) return null;
    const raw = localStorage.getItem(getStateKey(p.id));
    return {
      app: 'ti616-revisions',
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: { name: p.name, avatar: p.avatar },
      state: raw ? JSON.parse(raw) : null
    };
  }

  async function importPayload(payload) {
    if (!payload || payload.app !== 'ti616-revisions' || payload.version !== 1) {
      throw new Error('Fichier de sauvegarde invalide.');
    }
    const profile = await createProfile({
      name:   (payload.profile && payload.profile.name)   || 'Importé',
      avatar: (payload.profile && payload.profile.avatar) || '📦',
      pin:    null
    });
    if (payload.state) {
      localStorage.setItem(getStateKey(profile.id), JSON.stringify(payload.state));
    }
    return profile;
  }

  // ---------- UI ----------
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function safeText(s) {
    return String(s || '').replace(/[&<>"']/g, ch => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }

  function relTime(ts) {
    if (!ts) return '—';
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1)    return 'à l\'instant';
    if (min < 60)   return `il y a ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24)     return `il y a ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 30)     return `il y a ${d} j`;
    return new Date(ts).toLocaleDateString('fr-FR');
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => t.style.opacity = '0', 2200);
  }

  // ---------- Modal ----------
  function closeOverlay() {
    const ov = document.getElementById('authOverlay');
    if (ov) ov.remove();
  }

  function openModal(mode) {
    closeOverlay();
    const profiles = getProfiles();
    const finalMode = mode || (profiles.length === 0 ? 'create' : 'select');
    const blocking  = !getCurrentId();

    const overlay = el(`
      <div id="authOverlay" class="auth-overlay" role="dialog" aria-modal="true">
        <div class="auth-modal">
          ${blocking ? '' : `
            <button id="authClose" class="auth-close" title="Fermer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>`}
          <div id="authBody"></div>
        </div>
      </div>
    `);
    document.body.appendChild(overlay);

    if (!blocking) {
      overlay.querySelector('#authClose').addEventListener('click', closeOverlay);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
    }
    document.addEventListener('keydown', escHandler);

    renderMode(finalMode);
  }

  function escHandler(e) {
    if (e.key === 'Escape' && getCurrentId()) {
      closeOverlay();
      document.removeEventListener('keydown', escHandler);
    }
  }

  function renderMode(mode, ctx) {
    const body = document.querySelector('#authOverlay #authBody');
    if (!body) return;
    if      (mode === 'select') renderSelect(body);
    else if (mode === 'create') renderCreate(body);
    else if (mode === 'pin')    renderPin(body, ctx);
    else if (mode === 'manage') renderManage(body);
  }

  // ---- Sélection profil ----
  function renderSelect(body) {
    const profiles = getProfiles().slice().sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));
    body.innerHTML = `
      <div class="auth-head">
        <div class="auth-eyebrow">// Eco·Lab TI616</div>
        <h2 class="auth-title">Qui révise ?</h2>
        <p class="auth-sub">Choisis ton profil pour reprendre ta progression.</p>
      </div>
      <div class="auth-grid">
        ${profiles.map(p => `
          <button class="auth-card" data-id="${p.id}">
            <div class="auth-avatar">${p.avatar || '🌱'}</div>
            <div class="auth-card-name">${safeText(p.name)}</div>
            <div class="auth-card-meta">
              ${p.pinHash ? '🔒 ' : ''}${relTime(p.lastActive)}
            </div>
          </button>
        `).join('')}
        <button class="auth-card auth-card-add" id="addProfileBtn">
          <div class="auth-avatar auth-avatar-add">+</div>
          <div class="auth-card-name">Nouveau profil</div>
          <div class="auth-card-meta">créer un compte local</div>
        </button>
      </div>
      <div class="auth-foot">
        <button class="auth-link" id="manageBtn">⚙ Gérer · exporter · importer</button>
      </div>
    `;
    body.querySelectorAll('.auth-card[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const profile = getProfiles().find(p => p.id === id);
        if (!profile) return;
        if (profile.pinHash) renderMode('pin', { profile });
        else selectProfile(profile);
      });
    });
    body.querySelector('#addProfileBtn').addEventListener('click', () => renderMode('create'));
    body.querySelector('#manageBtn').addEventListener('click', () => renderMode('manage'));
  }

  // ---- Vérification PIN ----
  function renderPin(body, ctx) {
    const profile = ctx.profile;
    body.innerHTML = `
      <div class="auth-head">
        <div class="auth-avatar auth-avatar-lg">${profile.avatar || '🌱'}</div>
        <h2 class="auth-title">${safeText(profile.name)}</h2>
        <p class="auth-sub">Entre ton code PIN pour déverrouiller ce profil.</p>
      </div>
      <form id="pinForm" class="auth-form" autocomplete="off">
        <input id="pinInput" class="auth-input auth-pin" type="password" inputmode="numeric" pattern="[0-9]*"
               maxlength="8" placeholder="••••" autofocus required>
        <div id="pinError" class="auth-error hidden">Code PIN incorrect.</div>
        <button type="submit" class="auth-btn auth-btn-primary">Déverrouiller</button>
        <button type="button" class="auth-link" id="backBtn">← Choisir un autre profil</button>
      </form>
    `;
    body.querySelector('#backBtn').addEventListener('click', () => renderMode('select'));
    body.querySelector('#pinForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = body.querySelector('#pinInput').value;
      const ok  = await verifyPin(profile, pin);
      if (!ok) {
        body.querySelector('#pinError').classList.remove('hidden');
        body.querySelector('#pinInput').value = '';
        return;
      }
      selectProfile(profile);
    });
  }

  // ---- Création profil ----
  function renderCreate(body) {
    const isFirst = getProfiles().length === 0;
    body.innerHTML = `
      <div class="auth-head">
        <div class="auth-eyebrow">// ${isFirst ? 'Bienvenue' : 'Nouveau profil'}</div>
        <h2 class="auth-title">${isFirst ? 'Crée ton profil' : 'Ajouter un profil'}</h2>
        <p class="auth-sub">Tes données restent sur cet appareil. Le PIN est optionnel.</p>
      </div>
      <form id="createForm" class="auth-form" autocomplete="off">
        <label class="auth-label">Pseudo</label>
        <input id="nameInput" class="auth-input" type="text" maxlength="24" placeholder="ex. Dennis" required autofocus>

        <label class="auth-label">Avatar</label>
        <div id="avatarGrid" class="auth-avatar-grid">
          ${AVATARS.map((a, i) => `
            <button type="button" class="auth-avatar-opt ${i===0?'selected':''}" data-av="${a}">${a}</button>
          `).join('')}
        </div>

        <label class="auth-label">Code PIN <span class="auth-label-opt">(optionnel · 4 à 8 chiffres)</span></label>
        <input id="pinInput" class="auth-input auth-pin" type="password" inputmode="numeric" pattern="[0-9]{4,8}"
               maxlength="8" placeholder="laisser vide pour aucun PIN">

        <div class="auth-actions">
          ${isFirst ? '' : '<button type="button" class="auth-btn auth-btn-ghost" id="cancelBtn">Annuler</button>'}
          <button type="submit" class="auth-btn auth-btn-primary">Créer mon profil</button>
        </div>
      </form>
    `;

    let pickedAvatar = AVATARS[0];
    body.querySelectorAll('.auth-avatar-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        body.querySelectorAll('.auth-avatar-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        pickedAvatar = btn.dataset.av;
      });
    });

    const cancel = body.querySelector('#cancelBtn');
    if (cancel) cancel.addEventListener('click', () => renderMode('select'));

    body.querySelector('#createForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = body.querySelector('#nameInput').value;
      const pin  = body.querySelector('#pinInput').value;
      if (pin && !/^\d{4,8}$/.test(pin)) {
        alert('Le PIN doit faire entre 4 et 8 chiffres.');
        return;
      }
      const profile = await createProfile({ name, avatar: pickedAvatar, pin });
      selectProfile(profile);
      toast('Profil créé · bienvenue ' + profile.name + ' ' + profile.avatar);
    });
  }

  // ---- Gestion / export / import ----
  function renderManage(body) {
    const profiles = getProfiles().slice().sort((a,b) => (b.lastActive||0) - (a.lastActive||0));
    const currentId = getCurrentId();
    body.innerHTML = `
      <div class="auth-head">
        <div class="auth-eyebrow">// Gestion</div>
        <h2 class="auth-title">Mes profils</h2>
      </div>
      <div class="auth-list">
        ${profiles.map(p => `
          <div class="auth-row ${p.id === currentId ? 'is-current' : ''}">
            <div class="auth-avatar">${p.avatar}</div>
            <div class="auth-row-info">
              <div class="auth-row-name">${safeText(p.name)} ${p.id === currentId ? '<span class="auth-tag">actif</span>' : ''}</div>
              <div class="auth-row-meta">${p.pinHash ? '🔒 PIN · ' : ''}${relTime(p.lastActive)}</div>
            </div>
            <div class="auth-row-actions">
              <button class="auth-icon-btn" data-action="export" data-id="${p.id}" title="Exporter">⬇</button>
              <button class="auth-icon-btn auth-danger" data-action="delete" data-id="${p.id}" title="Supprimer">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="auth-actions auth-actions-wrap">
        <button class="auth-btn auth-btn-ghost" id="newBtn">+ Nouveau profil</button>
        <label class="auth-btn auth-btn-ghost" style="cursor:pointer;">
          ⬆ Importer un fichier
          <input id="importFile" type="file" accept="application/json,.json" style="display:none">
        </label>
        ${currentId ? '<button class="auth-btn auth-btn-primary" id="switchBtn">Changer de profil</button>' : ''}
      </div>
      <div class="auth-foot">
        <span class="auth-hint">L'export crée un fichier .json à conserver ou à transférer sur un autre appareil.</span>
      </div>
    `;

    body.querySelectorAll('[data-action="export"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const cur = getCurrentId();
        if (cur !== id) setCurrentId(id);
        const data = exportCurrent();
        if (cur !== id) setCurrentId(cur);
        if (!data) return;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = `ecolab-${data.profile.name.replace(/\W+/g,'_')}-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        toast('Export téléchargé');
      });
    });

    body.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const p  = getProfiles().find(x => x.id === id);
        if (!p) return;
        if (!confirm(`Supprimer le profil « ${p.name} » et toute sa progression ? Cette action est définitive.`)) return;
        const wasCurrent = (id === getCurrentId());
        deleteProfile(id);
        if (wasCurrent) {
          // soit on bascule sur un autre, soit on retourne au select/create
          const remaining = getProfiles();
          if (remaining.length > 0) {
            const next = remaining[0];
            if (next.pinHash) { renderMode('select'); return; }
            selectProfile(next);
            renderMode('manage');
          } else {
            renderMode('create');
          }
        } else {
          renderMode('manage');
        }
      });
    });

    body.querySelector('#newBtn').addEventListener('click', () => renderMode('create'));

    const switchBtn = body.querySelector('#switchBtn');
    if (switchBtn) switchBtn.addEventListener('click', () => renderMode('select'));

    body.querySelector('#importFile').addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const payload = JSON.parse(text);
        const profile = await importPayload(payload);
        toast(`Profil importé · ${profile.name}`);
        renderMode('manage');
      } catch (err) {
        alert('Import impossible : ' + err.message);
      } finally {
        e.target.value = '';
      }
    });
  }

  // ---------- Bascule profil ----------
  function selectProfile(profile) {
    setCurrentId(profile.id);
    touchProfile(profile.id);
    closeOverlay();
    updateHeaderIndicator();
    // L'app peut être déjà initialisée → on recharge l'état
    if (typeof window.reloadAppState === 'function') {
      window.reloadAppState();
    }
    // Fire event pour les listeners éventuels
    document.dispatchEvent(new CustomEvent('profile:changed', { detail: { profile } }));
  }

  // ---------- Indicateur header ----------
  function updateHeaderIndicator() {
    const btn = document.getElementById('profileBtn');
    if (!btn) return;
    const p = getCurrentProfile();
    if (!p) {
      btn.innerHTML = `<span class="profile-btn-avatar">?</span>`;
      btn.title = 'Se connecter';
      return;
    }
    btn.innerHTML = `
      <span class="profile-btn-avatar">${p.avatar}</span>
      <span class="profile-btn-name">${safeText(p.name)}</span>
    `;
    btn.title = `Profil : ${p.name} · cliquer pour gérer`;
  }

  // ---------- Migration synchrone (avant app.js) ----------
  migrateLegacy();

  // ---------- Boot UI (après DOM) ----------
  function boot() {
    const btn = document.getElementById('profileBtn');
    if (btn) {
      btn.addEventListener('click', () => openModal('manage'));
    }

    updateHeaderIndicator();

    if (!getCurrentId()) {
      // Pas de profil actif → modal bloquante
      openModal();
    } else {
      touchProfile(getCurrentId());
    }
  }

  // ---------- Expose ----------
  window.EcoAuth = {
    getCurrentProfile,
    getStateKey,
    openModal,
    updateHeaderIndicator
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
