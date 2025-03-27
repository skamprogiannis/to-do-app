function renderProjects(projects) {
  const projectList = document.querySelector(".project-list");
  projectList.innerHTML = "";
  projects.forEach((project) => {
    const listItem = document.createElement("li");
    listItem.dataset.id = project.id;
    const projectButton = document.createElement("button");
    projectButton.textContent = project.name;
    projectButton.setAttribute("aria-label", `View ${project.name}`);
    projectButton.setAttribute("id", `project-${project.name}`);
    projectButton.classList.add("project-name-btn");
    listItem.appendChild(projectButton);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("project-actions-container");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<img src="./images/edit_note_32dp.png">';
    editButton.classList.add("edit-project-btn");
    editButton.setAttribute("aria-label", `Edit ${project.name}`);
    buttonContainer.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img src="./images/delete_32dp.png">';
    deleteButton.classList.add("delete-project-btn");
    deleteButton.setAttribute("aria-label", `Delete ${project.name}`);
    buttonContainer.appendChild(deleteButton);

    listItem.appendChild(buttonContainer);
    projectList.appendChild(listItem);
  });
}

function createNewProjectForm() {
  const newProjectForm = document.createElement("form");
  const projectNameInput = document.createElement("input");
  projectNameInput.setAttribute("type", "text");
  projectNameInput.setAttribute("required", "true");
  projectNameInput.setAttribute("placeholder", "Enter Project Name");
  projectNameInput.setAttribute("maxLength", "32");
  projectNameInput.setAttribute("minLength", "1");
  projectNameInput.setAttribute("aria-label", "Project Name");
  projectNameInput.classList.add("project-name-input");

  newProjectForm.appendChild(projectNameInput);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  newProjectForm.appendChild(buttonContainer);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  cancelButton.setAttribute("type", "button");
  buttonContainer.appendChild(cancelButton);

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.classList.add("confirm-button");
  confirmButton.setAttribute("type", "submit");
  buttonContainer.appendChild(confirmButton);

  return newProjectForm;
}

function createEditProjectNameForm(projectName) {
  const editProjectForm = createNewProjectForm();
  const projectNameInput = editProjectForm.querySelector(".project-name-input");
  projectNameInput.value = projectName;
  return editProjectForm;
}

function createDeleteProjectModal(projectName, projectIndex) {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("delete-modal");
  modalContainer.dataset.projectIndex = projectIndex;

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = `Delete "${projectName}"`;
  modalHeader.appendChild(modalTitle);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  const warningMessage = document.createElement("p");
  warningMessage.innerHTML = `Are you sure you want to delete <strong>${projectName}</strong>?<br>All tasks in this project will be permanently removed.`;
  modalBody.appendChild(warningMessage);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  modalFooter.appendChild(cancelButton);
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Project";
  deleteButton.classList.add("delete-confirm-button");
  modalFooter.appendChild(deleteButton);

  modalContainer.appendChild(modalHeader);
  modalContainer.appendChild(modalBody);
  modalContainer.appendChild(modalFooter);
  modalOverlay.appendChild(modalContainer);

  return modalOverlay;
}

function renderTask(task) {
  const noTasksMessage = document.querySelector(".no-tasks-message");
  if (noTasksMessage) {
    noTasksMessage.remove();
  }

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = task.completed;
  checkbox.classList.add("task-checkbox");

  const title = document.createElement("span");
  title.textContent = task.title;

  const dueDate = document.createElement("span");
  dueDate.textContent = `Due: ${task.dueDate}`;

  const priority = document.createElement("span");
  priority.textContent = task.priority;
  priority.classList.add(`${priority.textContent.toLowerCase()}-priority`);

  const detailsButton = document.createElement("button");
  detailsButton.textContent = "Details";
  detailsButton.classList.add("details-task-btn");
  detailsButton.setAttribute("aria-label", `View details for ${task.title}`);

  const editButton = document.createElement("button");
  editButton.innerHTML = '<img src="./images/edit_note_32dp.png">';
  editButton.classList.add("edit-task-btn");
  editButton.setAttribute("aria-label", `Edit ${task.title}`);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<img src="./images/delete_32dp.png">';
  deleteButton.classList.add("delete-task-btn");
  deleteButton.setAttribute("aria-label", `Delete ${task.title}`);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("task-actions-container");
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  const taskDOM = document.createElement("div");
  taskDOM.classList.add("task-row");
  taskDOM.dataset.id = task.id;
  taskDOM.appendChild(checkbox);
  taskDOM.appendChild(title);
  taskDOM.appendChild(dueDate);
  taskDOM.appendChild(priority);
  taskDOM.appendChild(detailsButton);
  taskDOM.appendChild(buttonContainer);
  
  const tasksContainer = document.querySelector(".tasks-container");
  tasksContainer.appendChild(taskDOM);
}

function derenderTask(task) {
  const taskDOM = document.querySelector(`.task-row[data-id="${task.id}"]`);
  taskDOM.remove();
}

function renderTasks(title, tasks, showAddButton = false) {
  const tasksSection = document.querySelector(".tasks-section");
  tasksSection.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = title;
  tasksSection.appendChild(heading);

  if (showAddButton) {
    const addTaskButton = document.createElement("button");
    addTaskButton.textContent = "＋ Add Task";
    addTaskButton.classList.add("add-task-button");
    tasksSection.appendChild(addTaskButton);
  }

  const tasksContainer = document.createElement("div");
  tasksContainer.classList.add("tasks-container");
  tasksSection.appendChild(tasksContainer);

  if (tasks.length === 0) {
    const noTasksMessage = document.createElement("p");
    noTasksMessage.textContent = "No tasks to show.";
    noTasksMessage.classList.add("no-tasks-message");
    tasksContainer.appendChild(noTasksMessage);
    return tasksSection;
  }
  
  tasks.forEach((task) => {
    renderTask(task);
  });
  
  return tasksSection;
}

function renderTasksByProject(project) {
  return renderTasks(project.name, project.tasks, true);
}

function renderImportantTasks(tasks) {
  return renderTasks("Important", tasks);
}

function renderTodayTasks(tasks) {
  return renderTasks("Today", tasks);
}

function renderNext7DaysTasks (tasks) {
  return renderTasks("Next 7 Days", tasks);
}

function renderAllTasks(tasks) {
  return renderTasks("All Tasks", tasks);
}

function createNewTaskForm() {
  const taskNameInput = document.createElement("input");
  taskNameInput.setAttribute("type", "text");
  taskNameInput.setAttribute("required", "true");
  taskNameInput.setAttribute("placeholder", "Task Name");
  taskNameInput.setAttribute("maxLength", "22");
  taskNameInput.setAttribute("minLength", "1");
  taskNameInput.setAttribute("aria-label", "Task Name");
  taskNameInput.classList.add("task-name-input");

  const taskDescriptionInput = document.createElement("textarea");
  taskDescriptionInput.setAttribute("placeholder", "Description (Optional)");
  taskDescriptionInput.setAttribute("aria-label", "Task Description");
  taskDescriptionInput.classList.add("task-description-input");

  const dueDateInput = document.createElement("input");
  dueDateInput.setAttribute("type", "date");
  dueDateInput.setAttribute("aria-label", "Due Date");
  dueDateInput.classList.add("due-date-input");

  const prioritySelector = document.createElement("select");
  dueDateInput.setAttribute("aria-label", "Priority");
  prioritySelector.classList.add("priority-selector");
  const low = document.createElement("option");
  low.innerText = "Low";
  prioritySelector.appendChild(low);
  const medium = document.createElement("option");
  medium.innerText = "Medium";
  prioritySelector.appendChild(medium);
  const high = document.createElement("option");
  high.innerText = "High";
  prioritySelector.appendChild(high);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  cancelButton.setAttribute("type", "button");
  buttonContainer.appendChild(cancelButton);
  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.classList.add("confirm-button");
  buttonContainer.appendChild(confirmButton);

  const newTaskForm = document.createElement("form");
  newTaskForm.appendChild(taskNameInput);
  newTaskForm.appendChild(taskDescriptionInput);
  newTaskForm.appendChild(dueDateInput);
  newTaskForm.appendChild(prioritySelector);
  newTaskForm.appendChild(buttonContainer);

  return newTaskForm;
}

function createTaskDetailsModal(task) {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");
  
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("details-modal");
  modalContainer.dataset.taskId = task.id;

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = `Task Details - ${task.title}`;
  modalHeader.appendChild(modalTitle);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  const detailsTextarea = document.createElement("textarea");
  detailsTextarea.classList.add("details-textarea");
  detailsTextarea.value = task.description;
  modalBody.appendChild(detailsTextarea);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  modalFooter.appendChild(cancelButton);
  
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("save-button");
  modalFooter.appendChild(saveButton);

  modalContainer.appendChild(modalHeader);
  modalContainer.appendChild(modalBody);
  modalContainer.appendChild(modalFooter);
  modalOverlay.appendChild(modalContainer);

  return modalOverlay;
}

function createEditTaskForm(task) {
  const editTaskForm = createNewTaskForm();
  
  // Pre-populate the form
  editTaskForm.querySelector('.task-name-input').value = task.title;
  editTaskForm.querySelector('.task-description-input').value = task.description;
  editTaskForm.querySelector('.due-date-input').value = task.dueDate;
  editTaskForm.querySelector('.priority-selector').value = task.priority;
  
  return editTaskForm;
}

function updateTaskRow(task, taskRow) {
  taskRow.querySelector('span:nth-child(2)').textContent = task.title;
  taskRow.querySelector('span:nth-child(3)').textContent = `Due: ${task.dueDate}`;
  const prioritySpan = taskRow.querySelector('span:nth-child(4)');
  prioritySpan.textContent = task.priority;
  prioritySpan.className = `${task.priority.toLowerCase()}-priority`;
}

export const ui = {
  renderProjects,
  createNewProjectForm,
  createEditProjectNameForm,
  createDeleteProjectModal,
  renderTasksByProject,
  createNewTaskForm,
  renderTask,
  derenderTask,
  renderImportantTasks,
  renderTodayTasks,
  renderNext7DaysTasks,
  renderAllTasks,
  createTaskDetailsModal,
  createEditTaskForm,
  updateTaskRow
};
