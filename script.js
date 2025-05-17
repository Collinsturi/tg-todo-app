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
    else if (filter === "completed")
      filtered = todos.filter((t) => t.completed);

    filtered.forEach((todo, index) => {
      const li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.dataset.index = index;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todos[index].completed = checkbox.checked;
        renderTodos(currentFilter);
      });

      const label = document.createElement("label");
      label.textContent = todo.text;
      if (todo.completed) label.style.textDecoration = "line-through";

      li.appendChild(checkbox);
      li.appendChild(label);
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
    let draggedIndex;

    todoList.querySelectorAll("li").forEach((li, index) => {
      li.addEventListener("dragstart", () => {
        draggedIndex = index;
        li.classList.add("dragging");
      });

      li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
      });

      li.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingOver = [...todoList.children].indexOf(li);
        if (draggedIndex !== draggingOver) {
          const draggedItem = todos[draggedIndex];
          todos.splice(draggedIndex, 1);
          todos.splice(draggingOver, 0, draggedItem);
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
