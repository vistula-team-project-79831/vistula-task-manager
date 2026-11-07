let config = null;
let editingId = null;

const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descriptionInput = document.getElementById('task-description');
const submitButton = document.getElementById('task-submit');
const cancelButton = document.getElementById('task-cancel');
const taskList = document.getElementById('task-list');
const statusMessage = document.getElementById('status-message');

function showStatus(text, isError = false) {
  statusMessage.textContent = text;
  statusMessage.className = isError ? 'error' : 'success';
}

function apiUrl(query = '') {
  return `${config.supabaseUrl}/rest/v1/${config.tableName}${query}`;
}

async function api(method, query = '', body = null) {
  const options = {
    method,
    headers: {
      apikey: config.supabasePublishableKey,
      Authorization: `Bearer ${config.supabasePublishableKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(apiUrl(query), options);
  if (!response.ok) {
    let details = response.statusText;
    try {
      const err = await response.json();
      details = err.message || details;
    } catch (e) {}
    throw new Error(`${method} failed (${response.status}): ${details}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function loadTasks() {
  try {
    const tasks = await api('GET', '?select=*&order=id.asc');
    renderTasks(tasks);
  } catch (error) {
    showStatus(`Could not load tasks: ${error.message}`, true);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty">No tasks yet.</p>';
    return;
  }

  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item' + (task.completed ? ' completed' : '');
    item.dataset.id = task.id;

    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.title;

    const description = document.createElement('p');
    description.className = 'task-description';
    description.textContent = task.description || '';

    const status = document.createElement('span');
    status.className = 'task-status';
    status.textContent = task.completed ? 'Completed' : 'Not completed';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-task';
    toggleBtn.textContent = task.completed ? 'Mark incomplete' : 'Mark complete';
    toggleBtn.addEventListener('click', () => toggleTask(task));

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-task';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEdit(task));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-task';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.append(toggleBtn, editBtn, deleteBtn);

    item.append(title, description, status, actions);
    taskList.appendChild(item);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showStatus('Task title is required.', true);
    return;
  }

  try {
    if (editingId === null) {
      await api('POST', '', { title, description, completed: false });
      showStatus('Task added.');
    } else {
      await api('PATCH', `?id=eq.${editingId}`, { title, description });
      showStatus('Task updated.');
    }
    resetForm();
    await loadTasks();
  } catch (error) {
    showStatus(`Could not save task: ${error.message}`, true);
  }
});

function startEdit(task) {
  editingId = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || '';
  submitButton.textContent = 'Save changes';
  cancelButton.hidden = false;
  titleInput.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  submitButton.textContent = 'Add task';
  cancelButton.hidden = true;
}

cancelButton.addEventListener('click', resetForm);

async function toggleTask(task) {
  try {
    await api('PATCH', `?id=eq.${task.id}`, { completed: !task.completed });
    showStatus('Task status changed.');
    await loadTasks();
  } catch (error) {
    showStatus(`Could not change status: ${error.message}`, true);
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  try {
    await api('DELETE', `?id=eq.${id}`);
    if (editingId === id) resetForm();
    showStatus('Task deleted.');
    await loadTasks();
  } catch (error) {
    showStatus(`Could not delete task: ${error.message}`, true);
  }
}

async function init() {
  try {
    const response = await fetch('config.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    config = await response.json();
  } catch (error) {
    showStatus(`Could not load config.json: ${error.message}`, true);
    return;
  }
  await loadTasks();
}

init();
