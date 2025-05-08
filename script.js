let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      let currentFilter = "all";

      const dueDateInput = document.getElementById("dueDate");
      dueDateInput.min = new Date().toISOString().split("T")[0];

      function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }

      function addTask() {
        const text = document.getElementById("taskInput").value.trim();
        const due = dueDateInput.value;
        const priority = document.getElementById("priority").value;
        if (!text || !due) return;
        tasks.push({ id: Date.now(), text, due, priority, completed: false });
        document.getElementById("taskInput").value = "";
        dueDateInput.value = "";
        saveTasks();
        renderTasks();
      }

      function deleteTask(id) {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        renderTasks();
      }

      function toggleComplete(id) {
        tasks = tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveTasks();
        renderTasks();
      }

      function filterTasks(filter) {
        currentFilter = filter;
        document
          .querySelectorAll(".filter-btn")
          .forEach((btn) => btn.classList.remove("active"));
        event.target.classList.add("active");
        renderTasks();
      }

      function renderTasks() {
        const list = document.getElementById("taskList");
        let filtered = tasks;
        if (currentFilter === "completed")
          filtered = tasks.filter((t) => t.completed);
        else if (["low", "medium", "high"].includes(currentFilter))
          filtered = tasks.filter((t) => t.priority === currentFilter);
        list.innerHTML = filtered
          .map(
            (t) => `
                <li class="task-item ${t.priority} ${
              t.completed ? "completed" : ""
            }">
                    <input type="checkbox" ${
                      t.completed ? "checked" : ""
                    } onchange="toggleComplete(${t.id})">
                    <div class="task-content">
                        <div class="task-title">${t.text}</div>
                        <div class="task-due">📅 ${t.due}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteTask(${t.id})">
                      <i class="fas fa-trash"></i>
                    </button>
                </li>
            `
          )
          .join("");
      }

      renderTasks();

      setInterval(
        () => (dueDateInput.min = new Date().toISOString().split("T")[0]),
        60000
      );
   