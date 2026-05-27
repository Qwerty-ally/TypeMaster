// app.js — Core auth, storage, and shared utilities
const TM = (function () {
  const SUPABASE_URL = 'https://ssrllwnyhfmudtnhionh.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcmxsd255aGZtdWR0bmhpb25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjgzNjksImV4cCI6MjA5NTQwNDM2OX0.UADsiTupx_OqcbmwYYesi5qXQVenmWlzqx2bHIzRVMk';
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // ── Storage helpers ──────────────────────────────────────────────
  function ls(key, def = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
  }
  function lsSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // ── Current user cache ────────────────────────────────────────────
  let _currentUser = null;

  function getCurrentUser() { return _currentUser; }

  // ── Init (async — call on every page load) ────────────────────────
  async function init() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      const meta = session.user.user_metadata || {};
      _currentUser = {
        id:         session.user.id,
        username:   meta.username || session.user.email.split('@')[0],
        email:      session.user.email,
        streak:     meta.streak     || 0,
        lastActive: meta.last_active || Date.now(),
      };
      localStorage.setItem('tm_uid', _currentUser.id);
      await _syncProgressFromCloud(_currentUser.id);
    } else {
      _currentUser = null;
      localStorage.removeItem('tm_uid');
    }
  }

  async function _syncProgressFromCloud(userId) {
    try {
      const { data } = await sb.from('progress').select('*').eq('user_id', userId);
      if (!data || data.length === 0) return;
      const prog = {};
      data.forEach(row => {
        prog[row.lesson_id] = {
          completed:    true,
          stars:        row.stars,
          bestWpm:      row.best_wpm,
          bestAccuracy: row.best_accuracy,
          attempts:     row.attempts,
          completedAt:  row.completed_at,
        };
      });
      lsSet('tm_progress_' + userId, prog);
    } catch (e) {}
  }

  // ── Auth ─────────────────────────────────────────────────────────
  async function register(username, email, password) {
    if (username.length < 3) return { error: 'Username must be at least 3 characters.' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' };

    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { username, streak: 0, last_active: Date.now() } },
    });

    if (error) return { error: error.message };

    _currentUser = {
      id:         data.user.id,
      username,
      email:      data.user.email,
      streak:     0,
      lastActive: Date.now(),
    };
    localStorage.setItem('tm_uid', _currentUser.id);
    return { user: _currentUser };
  }

  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Incorrect email or password.' };

    const meta = data.user.user_metadata || {};
    _currentUser = {
      id:         data.user.id,
      username:   meta.username || data.user.email.split('@')[0],
      email:      data.user.email,
      streak:     meta.streak     || 0,
      lastActive: meta.last_active || Date.now(),
    };
    localStorage.setItem('tm_uid', _currentUser.id);
    await _syncProgressFromCloud(_currentUser.id);
    _updateStreak();
    return { user: _currentUser };
  }

  async function logout() {
    await sb.auth.signOut();
    _currentUser = null;
    localStorage.removeItem('tm_uid');
    window.location.href = 'login.html';
  }

  function _updateStreak() {
    if (!_currentUser) return;
    const now = Date.now(), day = 86400000;
    const diff = now - (_currentUser.lastActive || 0);
    if (diff >= day && diff < 2 * day) _currentUser.streak = (_currentUser.streak || 0) + 1;
    else if (diff >= 2 * day) _currentUser.streak = 1;
    _currentUser.lastActive = now;
    sb.auth.updateUser({ data: { streak: _currentUser.streak, last_active: now } }).catch(() => {});
  }

  function requireAuth() {
    if (!_currentUser) { window.location.href = 'login.html'; return false; }
    return true;
  }

  // ── Progress ─────────────────────────────────────────────────────
  function getProgress(userId) { return ls('tm_progress_' + userId, {}); }

  function saveResult(userId, lessonId, wpm, accuracy) {
    const prog = getProgress(userId);
    const existing = prog[lessonId] || {};
    const stars = calcStars(lessonId, wpm, accuracy);
    prog[lessonId] = {
      completed:    true,
      stars:        Math.max(stars,    existing.stars        || 0),
      bestWpm:      Math.max(wpm,      existing.bestWpm      || 0),
      bestAccuracy: Math.max(accuracy, existing.bestAccuracy || 0),
      attempts:     (existing.attempts || 0) + 1,
      completedAt:  Date.now(),
    };
    lsSet('tm_progress_' + userId, prog);
    if (_currentUser) {
      sb.from('progress').upsert({
        user_id:      userId,
        lesson_id:    lessonId,
        stars:        prog[lessonId].stars,
        best_wpm:     prog[lessonId].bestWpm,
        best_accuracy:prog[lessonId].bestAccuracy,
        attempts:     prog[lessonId].attempts,
        completed_at: prog[lessonId].completedAt,
      }).catch(() => {});
    }
    return prog[lessonId];
  }

  async function resetProgress(userId) {
    localStorage.removeItem('tm_progress_' + userId);
    if (_currentUser) {
      await sb.from('progress').delete().eq('user_id', userId);
    }
  }

  function calcStars(lessonId, wpm, accuracy) {
    if (wpm === 0 || accuracy === 0) return 0;
    const lesson = window.LESSONS_DATA && window.LESSONS_DATA.find(l => l.id === lessonId);
    const goal = lesson ? lesson.wpmGoal : 40;
    if (accuracy >= 97 && wpm >= goal) return 3;
    if (accuracy >= 85 && wpm >= Math.round(goal * 0.6)) return 2;
    return 1;
  }

  function getOverallStats(userId) {
    const prog = getProgress(userId);
    const entries = Object.values(prog);
    const completed  = entries.filter(e => e.completed).length;
    const totalWpm   = entries.reduce((s, e) => s + (e.bestWpm      || 0), 0);
    const totalAcc   = entries.reduce((s, e) => s + (e.bestAccuracy || 0), 0);
    const totalStars = entries.reduce((s, e) => s + (e.stars        || 0), 0);
    return {
      completed,
      avgWpm:     completed > 0 ? Math.round(totalWpm  / completed) : 0,
      avgAcc:     completed > 0 ? Math.round(totalAcc  / completed) : 0,
      totalStars,
    };
  }

  function getRecentLessons(userId, limit = 8) {
    return Object.entries(getProgress(userId))
      .filter(([, v]) => v.completed)
      .sort((a, b) => b[1].completedAt - a[1].completedAt)
      .slice(0, limit)
      .map(([id, v]) => ({ id: parseInt(id), ...v }));
  }

  function getNextLesson(userId) {
    const prog = getProgress(userId);
    if (!window.LESSONS_DATA) return 1;
    for (const l of window.LESSONS_DATA) {
      if (!prog[l.id] || !prog[l.id].completed) return l.id;
    }
    return window.LESSONS_DATA[0].id;
  }

  // ── Theme ─────────────────────────────────────────────────────────
  const THEMES = [
    { id: 'dark',       label: 'Dark',       swatch: '#0a0a18', icon: '🌙' },
    { id: 'light',      label: 'Light',      swatch: '#f8fafc', icon: '☀️' },
    { id: 'matrix',     label: 'Matrix',     swatch: '#020d02', icon: '💚' },
    { id: 'midnight',   label: 'Midnight',   swatch: '#020617', icon: '🌌' },
    { id: 'sepia',      label: 'Sepia',      swatch: '#f4ede3', icon: '📜' },
    { id: 'ocean',      label: 'Ocean',      swatch: '#0a1628', icon: '🌊' },
    { id: 'sunset',     label: 'Sunset',     swatch: '#1a0a14', icon: '🌅' },
    { id: 'neon',       label: 'Neon',       swatch: '#03001c', icon: '⚡' },
    { id: 'rose',       label: 'Rose',       swatch: '#1a0a0f', icon: '🌸' },
    { id: 'forest',     label: 'Forest',     swatch: '#0a160a', icon: '🌿' },
    { id: 'dracula',    label: 'Dracula',    swatch: '#282a36', icon: '🧛' },
    { id: 'nord',       label: 'Nord',       swatch: '#2e3440', icon: '❄️' },
    { id: 'monokai',    label: 'Monokai',    swatch: '#272822', icon: '🎨' },
    { id: 'catppuccin', label: 'Catppuccin', swatch: '#1e1e2e', icon: '🐱' },
    { id: 'coffee',     label: 'Coffee',     swatch: '#1c1009', icon: '☕' },
    { id: 'amber',      label: 'Amber',      swatch: '#0d0900', icon: '🟡' },
    { id: 'synthwave',  label: 'Synthwave',  swatch: '#0d0221', icon: '🌆' },
    { id: 'arctic',     label: 'Arctic',     swatch: '#eceff4', icon: '🏔️' },
  ];

  function getThemeKey() {
    const user = getCurrentUser();
    return user ? 'tm_theme_' + user.id : 'tm_theme';
  }
  function getTheme() { return localStorage.getItem(getThemeKey()) || 'dark'; }
  function setTheme(id) {
    localStorage.setItem(getThemeKey(), id);
    document.documentElement.setAttribute('data-theme', id);
    document.querySelectorAll('.theme-option').forEach(el =>
      el.classList.toggle('active', el.dataset.themeId === id));
    const t = THEMES.find(x => x.id === id);
    const btn = document.querySelector('.theme-btn');
    if (t && btn) btn.textContent = t.icon;
  }
  function toggleThemePicker() {
    const dd = document.getElementById('theme-dropdown');
    if (dd) dd.classList.toggle('open');
  }
  document.addEventListener('click', function(e) {
    const dd = document.getElementById('theme-dropdown');
    if (dd && dd.classList.contains('open') && !e.target.closest('.theme-picker-wrap'))
      dd.classList.remove('open');
  });

  // ── Navbar ──────────────────────────────────────────────────────
  function renderNavbar(activePage) {
    const user = getCurrentUser();
    const nav  = document.getElementById('navbar');
    if (!nav) return;
    const currentTheme = THEMES.find(t => t.id === getTheme()) || THEMES[0];
    const isHome = activePage === 'home';
    const lightBg = ['light','sepia','arctic'];
    const themeOptions = THEMES.map(t => `
      <div class="theme-option ${t.id === getTheme() ? 'active' : ''}" data-theme-id="${t.id}" onclick="TM.setTheme('${t.id}')">
        <div class="theme-swatch" style="background:${t.swatch};border-color:${lightBg.includes(t.id)?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.2)'};"></div>
        ${t.icon} ${t.label}
      </div>`).join('');
    nav.innerHTML = `
      <a class="navbar-brand" href="${user ? 'dashboard.html' : 'index.html'}">
        <span class="navbar-logo">⌨️</span>Type<span>Master</span>
      </a>
      <div class="navbar-links">
        ${isHome ? '' : `<a href="dashboard.html" class="${activePage==='dashboard'?'active':''}">Dashboard</a>`}
        ${isHome ? '' : `<a href="lessons.html"   class="${activePage==='lessons'  ?'active':''}">Lessons</a>`}
        ${user ? '' : '<a href="login.html" class="btn btn-primary btn-sm">Get Started</a>'}
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="theme-picker-wrap">
          <button class="theme-btn" onclick="TM.toggleThemePicker()" title="Change theme">${currentTheme.icon}</button>
          <div class="theme-picker-dropdown" id="theme-dropdown">${themeOptions}</div>
        </div>
        ${user ? `
        <div class="navbar-user">
          <div class="user-badge" title="${user.username}">${user.username.slice(0,2).toUpperCase()}</div>
          <button class="btn-logout" onclick="TM.logout()">Logout</button>
        </div>` : ''}
      </div>`;
  }

  // ── Helpers ──────────────────────────────────────────────────────
  function starsHtml(count, size = '') {
    let html = '';
    for (let i = 1; i <= 3; i++)
      html += `<span class="star ${size}">${i <= count ? '★' : '☆'}</span>`;
    return html;
  }
  function diffBadge(diff) {
    return `<span class="lesson-diff diff-${diff}">${diff.charAt(0).toUpperCase() + diff.slice(1)}</span>`;
  }

  return {
    init,
    getCurrentUser, logout, register, login, requireAuth,
    getProgress, saveResult, resetProgress, calcStars,
    getOverallStats, getRecentLessons, getNextLesson,
    renderNavbar, starsHtml, diffBadge,
    getTheme, setTheme, toggleThemePicker, THEMES,
  };
})();

window.TM = TM;
