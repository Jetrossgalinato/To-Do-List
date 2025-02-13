document.addEventListener("DOMContentLoaded", loadTasks);

const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

// Load dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark-mode");
  toggleButton.textContent = "☀️"; // Light mode icon
}

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    toggleButton.textContent = "☀️"; // Sun icon for light mode
  } else {
    localStorage.setItem("darkMode", "disabled");
    toggleButton.textContent = "🌙"; // Moon icon for dark mode
  }
});

let selectedTask = null; // Stores the selected task

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  let taskList = document.getElementById("taskList");
  let li = createTaskElement(taskText, false);

  taskList.appendChild(li);
  saveTasks();
  taskInput.value = ""; // Clear input field
}

function createTaskElement(taskText, isCompleted) {
  let li = document.createElement("li");
  li.draggable = true;
  li.classList.add("task-item");

  li.innerHTML = `
        <input type="checkbox" class="task-check" onclick="toggleTask(this)" ${
          isCompleted ? "checked" : ""
        }>
        <span class="task-text ${
          isCompleted ? "completed" : ""
        }">${taskText}</span>
    `;

  li.addEventListener("click", () => selectTask(li));
  addDragAndDropHandlers(li);
  return li;
}

function selectTask(li) {
  if (selectedTask) {
    selectedTask.classList.remove("selected");
  }

  if (selectedTask === li) {
    selectedTask = null;
  } else {
    selectedTask = li;
    li.classList.add("selected");
  }

  updateActionButtons();
}

function updateActionButtons() {
  document.getElementById("editTaskBtn").disabled = !selectedTask;
  document.getElementById("deleteTaskBtn").disabled = !selectedTask;
}

function toggleTask(checkbox) {
  let taskText = checkbox.nextElementSibling;
  taskText.classList.toggle("completed", checkbox.checked);
  saveTasks();
}

function editSelectedTask() {
  if (!selectedTask) return;

  let span = selectedTask.querySelector(".task-text");
  let newText = prompt("Edit your task:", span.innerText);

  if (newText !== null && newText.trim() !== "") {
    span.innerText = newText.trim();
    saveTasks();
  }
}

function removeSelectedTask() {
  if (!selectedTask) return;

  selectedTask.remove();
  selectedTask = null;
  updateActionButtons();
  saveTasks();
}

// **Local Storage Functions**
function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    let taskText = li.querySelector(".task-text").innerText;
    let isCompleted = li.querySelector(".task-check").checked;
    tasks.push({ text: taskText, completed: isCompleted });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    let li = createTaskElement(task.text, task.completed);
    taskList.appendChild(li);
  });
  updateActionButtons();
}

// **Drag-and-Drop Sorting**
function addDragAndDropHandlers(li) {
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", li.innerHTML);
    li.classList.add("dragging");
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  li.addEventListener("drop", (e) => {
    e.preventDefault();
    let draggedHTML = e.dataTransfer.getData("text/plain");
    li.insertAdjacentHTML("beforebegin", draggedHTML);
    document.querySelector(".dragging").remove();
    saveTasks();
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
  });
}

function clearCompletedTasks() {
  document
    .querySelectorAll("#taskList .task-check:checked")
    .forEach((checkbox) => {
      checkbox.parentElement.remove(); // Remove the entire task item
    });

  saveTasks(); // Save the updated task list
}
