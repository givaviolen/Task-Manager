// Task Manager - Iterasi 2
// Perbaikan: validasi input, reset form, persistensi localStorage,
// pencegahan XSS (textContent), dan fitur hapus tugas.

const STORAGE_KEY = 'taskManager.tasks';

// Daftar prioritas yang diizinkan -> nama kelas CSS (whitelist)
const PRIORITY_CLASS = {
  Tinggi: 'priority-high',
  Sedang: 'priority-medium',
  Rendah: 'priority-low'
};

// Elemen DOM
const form = document.getElementById('task-form');
const nameInput = document.getElementById('task-name');
const priorityInput = document.getElementById('task-priority');
const deadlineInput = document.getElementById('task-deadline');
const errorBox = document.getElementById('form-error');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');

// Satu-satunya sumber data (single source of truth)
let tasks = loadTasks();

// ---------- Penyimpanan (localStorage) ----------

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
  tasks.push({ id: createId(), name: name, priority: priority, deadline: deadline });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

// ---------- Tampilan (DOM) ----------

function createTaskElement(task) {
  const li = document.createElement('li');

  const info = document.createElement('div');
  info.className = 'task-info';

  const title = document.createElement('strong');
  title.textContent = task.name; // aman: diperlakukan sebagai teks

  const meta = document.createElement('span');
  meta.className = 'task-meta';
  meta.textContent = 'Deadline: ' + task.deadline;

  const badge = document.createElement('span');
  badge.className = 'badge ' + (PRIORITY_CLASS[task.priority] || 'priority-low');
  badge.textContent = task.priority;

  info.append(title, meta);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Hapus';
  deleteBtn.setAttribute('aria-label', 'Hapus tugas: ' + task.name);
  deleteBtn.addEventListener('click', function () {
    deleteTask(task.id);
  });

  li.append(badge, info, deleteBtn);
  return li;
}

function renderTasks() {
  taskList.replaceChildren();
  tasks.forEach(function (task) {
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

  // Reset form setelah berhasil
  nameInput.value = '';
  priorityInput.value = 'Tinggi';
  deadlineInput.value = '';
  nameInput.focus();
});

// Tampilkan data tersimpan saat halaman dimuat
renderTasks();