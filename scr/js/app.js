// Task Manager - Iterasi 3
// Tambahan: pengurutan, format tanggal Indonesia, tandai selesai,
// konfirmasi hapus, dan penanda deadline terlewat.

const STORAGE_KEY = 'taskManager.tasks';

// Prioritas yang diizinkan -> nama kelas CSS (whitelist)
const PRIORITY_CLASS = {
  Tinggi: 'priority-high',
  Sedang: 'priority-medium',
  Rendah: 'priority-low'
};

// Urutan prioritas: angka lebih kecil = tampil lebih atas
const PRIORITY_RANK = {
  Tinggi: 0,
  Sedang: 1,
  Rendah: 2
};

// Elemen DOM
const form = document.getElementById('task-form');
const nameInput = document.getElementById('task-name');
const priorityInput = document.getElementById('task-priority');
const deadlineInput = document.getElementById('task-deadline');
const errorBox = document.getElementById('form-error');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');

// ---------- Tanggal dan pengurutan (fungsi murni, tanpa DOM) ----------

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

// Ubah string 'YYYY-MM-DD' menjadi Date pada zona waktu LOKAL.
// Sengaja tidak memakai new Date('YYYY-MM-DD') karena string itu
// ditafsirkan sebagai UTC dan bisa bergeser satu hari di zona waktu lain.
function parseLocalDate(value) {
  const parts = String(value).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const date = new Date(year, month - 1, day);

  // Tolak tanggal yang "meluber" (misalnya 2026-02-31 menjadi Maret)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function formatDate(value) {
  const date = parseLocalDate(value);
  return date ? dateFormatter.format(date) : String(value);
}

// Terlambat = belum selesai DAN deadline sebelum hari ini (jam diabaikan)
function isOverdue(task) {
  if (task.done) return false;
  const deadline = parseLocalDate(task.deadline);
  if (!deadline) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadline < today;
}

function priorityRank(priority) {
  return priority in PRIORITY_RANK ? PRIORITY_RANK[priority] : 99;
}

// Pembanding untuk Array.sort: prioritas dulu, lalu deadline terdekat
function compareTasks(a, b) {
  const rankDiff = priorityRank(a.priority) - priorityRank(b.priority);
  if (rankDiff !== 0) return rankDiff;

  // Format ISO 'YYYY-MM-DD' bisa dibandingkan langsung sebagai string
  const da = String(a.deadline);
  const db = String(b.deadline);
  if (da < db) return -1;
  if (da > db) return 1;
  return 0;
}

// ---------- Penyimpanan (localStorage) ----------

// Satu-satunya sumber data (single source of truth)
let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Gagal membaca data tersimpan:', error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    showError('Data tidak bisa disimpan di browser ini.');
  }
}

// ---------- Logika data ----------

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function addTask(name, priority, deadline) {
  tasks.push({
    id: createId(),
    name: name,
    priority: priority,
    deadline: deadline,
    done: false
  });
  saveTasks();
  renderTasks();
}

function toggleDone(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (!task) return;

  task.done = !task.done;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (!task) return;

  // Nama tugas hanya dimasukkan ke teks dialog (bukan HTML), jadi aman
  const confirmed = window.confirm('Hapus tugas "' + task.name + '"?');
  if (!confirmed) return;

  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });
  saveTasks();
  renderTasks();
}

// ---------- Tampilan (DOM) ----------

function createTaskElement(task) {
  const li = document.createElement('li');
  const done = Boolean(task.done); // data lama tanpa field done dianggap belum selesai
  if (done) li.classList.add('done');

  const badge = document.createElement('span');
  badge.className = 'badge ' + (PRIORITY_CLASS[task.priority] || 'priority-low');
  badge.textContent = task.priority;

  const info = document.createElement('div');
  info.className = 'task-info';

  const title = document.createElement('strong');
  title.className = 'task-title';
  title.textContent = task.name; // aman: diperlakukan sebagai teks

  const meta = document.createElement('span');
  meta.className = 'task-meta';
  const overdue = isOverdue(task);
  if (overdue) meta.classList.add('overdue');
  meta.textContent =
    'Deadline: ' + formatDate(task.deadline) + (overdue ? ' (terlambat)' : '');

  info.append(title, meta);

  const doneLabel = document.createElement('label');
  doneLabel.className = 'done-toggle';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = done;
  checkbox.addEventListener('change', function () {
    toggleDone(task.id);
  });

  doneLabel.append(checkbox, document.createTextNode(' Selesai'));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Hapus';
  deleteBtn.setAttribute('aria-label', 'Hapus tugas: ' + task.name);
  deleteBtn.addEventListener('click', function () {
    deleteTask(task.id);
  });

  li.append(badge, info, doneLabel, deleteBtn);
  return li;
}

function renderTasks() {
  taskList.replaceChildren();

  // Salin dulu supaya urutan asli di array 'tasks' tidak berubah
  const sorted = tasks.slice().sort(compareTasks);
  sorted.forEach(function (task) {
    taskList.appendChild(createTaskElement(task));
  });

  emptyState.hidden = tasks.length > 0;
}

function showError(message) {
  errorBox.textContent = message;
}

// ---------- Event ----------

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;

  if (name === '') {
    showError('Nama tugas tidak boleh kosong.');
    nameInput.focus();
    return;
  }
  if (deadline === '') {
    showError('Deadline wajib diisi.');
    deadlineInput.focus();
    return;
  }

  showError('');
  addTask(name, priority, deadline);

  nameInput.value = '';
  priorityInput.value = 'Tinggi';
  deadlineInput.value = '';
  nameInput.focus();
});

// Tampilkan data tersimpan saat halaman dimuat
renderTasks();