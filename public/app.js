const listEl = document.getElementById("todo-list");
const formEl = document.getElementById("todo-form");
const titleInput = document.getElementById("title-input");
const descInput = document.getElementById("desc-input");
const errorEl = document.getElementById("error");
const emptyEl = document.getElementById("empty");

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = !message;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return body.data;
}

function renderTodo(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " completed" : "");
  li.dataset.id = todo.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-check";
  checkbox.checked = !!todo.completed;
  checkbox.setAttribute("aria-label", "Toggle completed");
  checkbox.addEventListener("change", () => toggleTodo(todo.id, checkbox.checked));

  const body = document.createElement("div");
  body.className = "todo-body";

  const title = document.createElement("div");
  title.className = "todo-title";
  title.textContent = todo.title;
  title.title = "Double-click to edit";
  title.addEventListener("dblclick", () => startEdit(li, todo));

  body.appendChild(title);

  if (todo.description) {
    const desc = document.createElement("div");
    desc.className = "todo-desc";
    desc.textContent = todo.description;
    body.appendChild(desc);
  }

  const del = document.createElement("button");
  del.className = "todo-delete";
  del.textContent = "×";
  del.setAttribute("aria-label", "Delete todo");
  del.addEventListener("click", () => deleteTodo(todo.id));

  li.append(checkbox, body, del);
  return li;
}

function startEdit(li, todo) {
  const body = li.querySelector(".todo-body");
  const oldTitle = body.querySelector(".todo-title");
  const input = document.createElement("input");
  input.className = "todo-edit-input";
  input.value = todo.title;
  input.maxLength = 200;

  let done = false;
  const finish = async (save) => {
    if (done) return;
    done = true;
    if (save && input.value.trim() && input.value.trim() !== todo.title) {
      try {
        await api(`/todo/${todo.id}`, {
          method: "PATCH",
          body: JSON.stringify({ title: input.value.trim() }),
        });
        await loadTodos();
      } catch (err) {
        showError(err.message);
        await loadTodos();
      }
    } else {
      await loadTodos();
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
  input.addEventListener("blur", () => finish(true));

  body.replaceChild(input, oldTitle);
  input.focus();
  input.select();
}

async function loadTodos() {
  try {
    showError("");
    const todos = await api("/todo");
    listEl.innerHTML = "";
    emptyEl.hidden = todos.length !== 0;
    todos.forEach((todo) => listEl.appendChild(renderTodo(todo)));
  } catch (err) {
    showError(err.message);
  }
}

async function toggleTodo(id, completed) {
  try {
    showError("");
    await api(`/todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
    await loadTodos();
  } catch (err) {
    showError(err.message);
    await loadTodos();
  }
}

async function deleteTodo(id) {
  try {
    showError("");
    await api(`/todo/${id}`, { method: "DELETE" });
    await loadTodos();
  } catch (err) {
    showError(err.message);
  }
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  try {
    showError("");
    await api("/todo", {
      method: "POST",
      body: JSON.stringify({
        title,
        description: descInput.value.trim(),
      }),
    });
    titleInput.value = "";
    descInput.value = "";
    await loadTodos();
  } catch (err) {
    showError(err.message);
  }
});

loadTodos();
