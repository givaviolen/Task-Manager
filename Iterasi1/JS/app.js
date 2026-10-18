// Task Manager - Iterasi 1

function addTask() {
  const name = document.getElementById('task-name').value;
  const priority = document.getElementById('task-priority').value;
  const deadline = document.getElementById('task-deadline').value;

  const taskList = document.getElementById('task-list');

  const li = document.createElement('li');
  li.innerHTML =
    '<strong>' + name + '</strong><br>' +
    'Prioritas: ' + priority + ' | Deadline: ' + deadline;

  taskList.appendChild(li);
}