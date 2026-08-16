const STORAGE_KEY = "mis-tareas-v1";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let filter = "all";

const $ = (id) => document.getElementById(id);
const form = $("taskForm"), input = $("taskInput"), priority = $("priorityInput"), category = $("categoryInput"), date = $("dateInput");
const list = $("taskList"), empty = $("emptyState"), search = $("searchInput");

const todayISO = () => new Date().toISOString().slice(0, 10);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
const formatDate = (value) => value ? new Date(value + "T00:00:00").toLocaleDateString("es-CO", {day:"2-digit", month:"short"}) : "Sin fecha";

$("today").textContent = new Date().toLocaleDateString("es-CO", {weekday:"long", day:"numeric", month:"long", year:"numeric"});
date.value = todayISO();

function render() {
  const query = search.value.trim().toLowerCase();
  let visible = tasks.filter(t => filter === "all" || (filter === "done" ? t.done : !t.done));
  if (query) visible = visible.filter(t => `${t.title} ${t.category}`.toLowerCase().includes(query));
  visible.sort((a,b) => Number(a.done)-Number(b.done) || (a.date || "9999").localeCompare(b.date || "9999"));

  list.innerHTML = visible.map(t => `
    <article class="task ${t.done ? "done" : ""}" data-id="${t.id}">
      <button class="check" aria-label="${t.done ? "Marcar pendiente" : "Completar tarea"}" data-action="toggle">${t.done ? "✓" : ""}</button>
      <div>
        <p class="title">${escapeHtml(t.title)}</p>
        <div class="meta">
          <span class="tag">${escapeHtml(t.category)}</span>
          <span class="tag ${t.priority === "alta" ? "high" : t.priority === "baja" ? "low" : ""}">${t.priority[0].toUpperCase()+t.priority.slice(1)}</span>
          <span>📅 ${formatDate(t.date)}</span>
        </div>
      </div>
      <div class="actions">
        <button class="icon-btn" title="Eliminar" data-action="delete">🗑️</button>
      </div>
    </article>`).join("");

  empty.classList.toggle("hidden", visible.length > 0);
  $("totalCount").textContent = tasks.length;
  $("pendingCount").textContent = tasks.filter(t => !t.done).length;
  $("doneCount").textContent = tasks.filter(t => t.done).length;
  $("highCount").textContent = tasks.filter(t => !t.done && t.priority === "alta").length;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  tasks.push({ id: crypto.randomUUID(), title: input.value.trim(), priority: priority.value, category: category.value, date: date.value, done:false });
  save(); form.reset(); date.value = todayISO(); input.focus(); render();
});

list.addEventListener("click", (e) => {
  const button = e.target.closest("button"); if (!button) return;
  const item = button.closest(".task"); const id = item?.dataset.id;
  const task = tasks.find(t => t.id === id); if (!task) return;
  if (button.dataset.action === "toggle") task.done = !task.done;
  if (button.dataset.action === "delete") tasks = tasks.filter(t => t.id !== id);
  save(); render();
});

document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  btn.classList.add("active"); filter = btn.dataset.filter; render();
}));
search.addEventListener("input", render);
$("clearCompleted").addEventListener("click", () => { tasks = tasks.filter(t => !t.done); save(); render(); });
render();
