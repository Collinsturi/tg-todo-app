document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".Sun-icon");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.querySelector("#todo-list ul");
  const itemsLeft = document.querySelector(
    "#todo-list-container-bottom-menu-left p"
  );
  const filters = document.querySelectorAll(
    "#todo-list-container-bottom-menu-middle a"
  );
  const clearCompletedBtn = document.querySelector(
    "#todo-list-container-bottom-menu-right a"
  );
  const body = document.body;

  // Default Todos
  let todos = [
    { text: "Jog around the park 3x", completed: false },
    { text: "10 minutes meditation", completed: false },
    { text: "Read for 1 hour", completed: false },
    { text: "Pick up groceries", completed: false },
    { text: "Complete Todo App on Frontend Mentor", completed: false },
  ];

  // Theme Toggle
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    body.setAttribute("data-theme", newTheme);

    // Update icon
    themeToggle.src =
      newTheme === "light" ? "./images/icon-moon.svg" : "./images/icon-sun.svg";

    // Update background class
    body.classList.toggle("light-bg", newTheme === "light");
    body.classList.toggle("dark-bg", newTheme === "dark");
  });

  // Add Todo
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && todoInput.value.trim() !== "") {
      todos.push({ text: todoInput.value.trim(), completed: false });
      todoInput.value = "";
      renderTodos(currentFilter);
    }
  });

  // Render Todos
  function renderTodos(filter = "all") {
    todoList.innerHTML = "";

    let filtered = todos;
    if (filter === "active") filtered = todos.filter((t) => !t.completed);
    if (filter === "completed") filtered = todos.filter((t) => t.completed);

    filtered.forEach((todo) => {
      // Find its real index in the master todos[]
      const realIndex = todos.indexOf(todo);

      const li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.dataset.realIndex = realIndex; // ← store real index
      li.classList.toggle("completed", todo.completed);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todos[realIndex].completed = checkbox.checked;
        renderTodos(currentFilter);
      });

      const label = document.createElement("label");
      label.textContent = todo.text;

      li.append(checkbox, label);
      todoList.appendChild(li);
    });

    updateItemsLeft();
    enableDragAndDrop();
  }

  // Update Items Left
  function updateItemsLeft() {
    const activeCount = todos.filter((t) => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${
      activeCount !== 1 ? "s" : ""
    } left`;
  }

  // Filters
  let currentFilter = "all";
  filters.forEach((filter) => {
    filter.addEventListener("click", (e) => {
      e.preventDefault();
      currentFilter = filter.textContent.toLowerCase();
      filters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      renderTodos(currentFilter);
    });
  });

  // Clear Completed
  clearCompletedBtn.addEventListener("click", (e) => {
    e.preventDefault();
    todos = todos.filter((t) => !t.completed);
    renderTodos(currentFilter);
  });

  // Drag and Drop
  function enableDragAndDrop() {
    let draggedRealIndex;

    todoList.querySelectorAll("li").forEach((li) => {
      li.addEventListener("dragstart", () => {
        draggedRealIndex = +li.dataset.realIndex;
        li.classList.add("dragging");
      });
      li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
      });
      li.addEventListener("dragover", (e) => {
        e.preventDefault();
        const overLi = e.currentTarget;
        const overRealIndex = +overLi.dataset.realIndex;

        if (draggedRealIndex !== overRealIndex) {
          // Remove the dragged item...
          const [moved] = todos.splice(draggedRealIndex, 1);
          // Insert it before the item we’re hovering over
          todos.splice(overRealIndex, 0, moved);
          renderTodos(currentFilter);
        }
      });
    });
  }

  // Initialize
  body.setAttribute("data-theme", "light");
  body.classList.add("light-bg");
  filters.forEach((f) => {
    if (f.textContent.toLowerCase() === currentFilter)
      f.classList.add("active");
  });
  renderTodos(currentFilter);
});
