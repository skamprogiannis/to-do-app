import "./styles.css";
import Task from "./Task.js";
import Project from "./Project.js";
import { ui } from "./ui.js";
import { addMetaTestProject } from "./testProject.js";
import { format, isBefore, addDays } from "date-fns";

export const stateManager = {
  projects: [],

  initialize() {
    this.loadProjectsFromLocalStorage();
    this.shiaSurprise();
    this.addProjectClick();
    this.editProjectName();
    this.deleteProject();
    this.toggleSidebar();
    this.selectProject();
    this.selectImportantTasks();
    this.selectTodayTasks();
    this.selectNext7DaysTasks();
    this.selectAllTasks();
  },

  loadProjectsFromLocalStorage() {
    const storedProjectsData = localStorage.getItem("projects");
    console.log(
      "loadProjectsFromLocalStorage: storedProjectsData:",
      storedProjectsData
    );
    if (storedProjectsData) {
      this.projects = JSON.parse(storedProjectsData).map(
        (projectData) =>
          new Project(
            projectData.name,
            projectData.tasks.map(
              (task) =>
                new Task(
                  task.projectID,
                  task.title,
                  task.description,
                  task.dueDate,
                  task.priority,
                  task.completed,
                  task.id
                )
            ),
            projectData.id
          )
      );
      console.log(
        "loadProjectsFromLocalStorage: parsed projects:",
        this.projects
      );
      if (this.projects.length > 0 && this.projects[0].tasks.length > 0) {
        console.log(
          "loadProjectsFromLocalStorage: first task completed:",
          this.projects[0].tasks[0].completed
        );
      }
    } else {
      this.projects = [];
    }
    ui.renderProjects(this.projects);
  },

  saveProjectData(newProject) {
    this.projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  editProjectData(project) {
    const projectIndex = this.projects.findIndex((p) => p.id === project.id);
    this.projects[projectIndex].name = project.name;
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  removeProjectData(projectID) {
    const projectIndex = this.projects.findIndex(
      (project) => project.id === projectID
    );
    this.projects.splice(projectIndex, 1);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  saveNewTaskData(newTask) {

    console.log("Saving task:", newTask);
    console.log("Projects:", this.projects);
    const project = this.projects.find(
      (project) => project.id === newTask.projectID
    );
    if (!project) {
      console.log("Project not found when saving task.");
      return;
    }

    project.tasks.push(newTask);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  editTaskData(updatedTask) {
    console.log("editTaskData: updatedTask before:", updatedTask);
    const project = this.projects.find(
      (project) => project.id === updatedTask.projectID
    );
    if (!project) {
      console.log("Project not found");
      return;
    }
    const task = project.tasks.find((task) => task.id === updatedTask.id);
    if (!task) {
      console.log("Task not found");
      return;
    }
    console.log("editTaskData: task before assign:", task);
    Object.assign(task, updatedTask);
    console.log("editTaskData: task after assign:", task);
    console.log("editTaskData: projects before localStorage:", this.projects);
    localStorage.setItem("projects", JSON.stringify(this.projects));
    console.log(
      "editTaskData: localStorage after:",
      localStorage.getItem("projects")
    );
  },

  toggleSidebar() {
    const toggleSidebarButton = document.querySelector("#toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");

    toggleSidebarButton.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
    });
  },

  addProjectClick() {
    const addProjectButton = document.querySelector(".add-project");
    addProjectButton.addEventListener("click", () => {
      this.disableProjectButtons(true);
      const projectList = document.querySelector(".project-list");
      const newProjectForm = ui.createNewProjectForm();
      projectList.appendChild(newProjectForm);

      const projectNameInput = newProjectForm.querySelector("input");
      projectNameInput.focus();

      newProjectForm.addEventListener("submit", (event) =>
        this.handleNewProjectFormSubmit(event)
      );
      this.attachProjectFormButtonEventListeners(newProjectForm);
    });
  },

  handleNewProjectFormSubmit(event) {
    event.preventDefault();
    const newProjectForm = event.target;
    const projectNameInput = newProjectForm.querySelector("input");
    const newProject = new Project(projectNameInput.value.trim());
    this.saveProjectData(newProject);

    this.disableProjectButtons(false);
    newProjectForm.reset();
    ui.renderProjects(this.projects);
  },

  attachProjectFormButtonEventListeners(projectForm) {
    const confirmButton = projectForm.querySelector(".confirm-button");
    const cancelButton = projectForm.querySelector(".cancel-button");

    confirmButton.addEventListener("click", () => {
      if (projectForm.checkValidity()) {
        projectForm.requestSubmit();
      } else {
        projectForm.reportValidity();
      }
    });

    cancelButton.addEventListener("click", () => {
      projectForm.remove();
      this.disableProjectButtons(false);
      ui.renderProjects(this.projects);
    });
  },

  editProjectName() {
    const projectList = document.querySelector(".project-list");
    projectList.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("edit-project-btn") ||
        event.target.parentElement.classList.contains("edit-project-btn")
      ) {
        const editButton = event.target.classList.contains("edit-project-btn")
          ? event.target
          : event.target.parentElement;

        this.disableProjectButtons(true);

        const projectID = editButton.closest("li").dataset.id;
        const linkedProject = this.projects.find(
          (project) => project.id === projectID
        );
        const currentProjectName = linkedProject.name;
        const editProjectNameForm =
          ui.createEditProjectNameForm(currentProjectName);

        const projectListItems = document.querySelectorAll(".project-list li");
        const projectItem = Array.from(projectListItems).find(
          (item) => item.dataset.id === projectID
        );
        projectItem.replaceWith(editProjectNameForm);

        const projectNameInput = editProjectNameForm.querySelector("input");
        projectNameInput.focus();

        editProjectNameForm.addEventListener("submit", (event) =>
          this.handleEditProjectFormSubmit(event, projectID)
        );
        this.attachProjectFormButtonEventListeners(editProjectNameForm);
      }
    });
  },

  handleEditProjectFormSubmit(event, projectID) {
    event.preventDefault();
    const editProjectNameForm = event.target;
    const projectNameInput = editProjectNameForm.querySelector("input");
    const updatedProjectName = projectNameInput.value.trim();
    const projectToEdit = this.projects.find(
      (project) => project.id === projectID
    );

    projectToEdit.editName(updatedProjectName);
    this.editProjectData(projectToEdit);

    this.disableProjectButtons(false);
    ui.renderProjects(this.projects);
  },

  disableProjectButtons(boolean) {
    const addProjectButton = document.querySelector(".add-project");
    const editProjectButtons = document.querySelectorAll(".edit-project-btn");
    const deleteProjectButtons = document.querySelectorAll(
      ".delete-project-btn"
    );

    addProjectButton.disabled = boolean;
    editProjectButtons.forEach((button) => (button.disabled = boolean));
    deleteProjectButtons.forEach((button) => (button.disabled = boolean));
  },

  deleteProject() {
    const projectList = document.querySelector(".project-list");
    projectList.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("delete-project-btn") ||
        event.target.parentElement.classList.contains("delete-project-btn")
      ) {
        const deleteButton = event.target.classList.contains(
          "delete-project-btn"
        )
          ? event.target
          : event.target.parentElement;

        const projectItem = deleteButton.closest("li");
        const projectID = projectItem.dataset.id;
        const linkedProject = this.projects.find(
          (project) => project.id === projectID
        );
        const projectName = linkedProject.name;

        const deleteModal = ui.createDeleteProjectModal(projectName, projectID);
        document.body.appendChild(deleteModal);

        this.attachDeleteProjectModalEventListeners(deleteModal, projectID);
      }
    });
  },

  attachDeleteProjectModalEventListeners(deleteModal, projectID) {
    // Close modal when clicking on overlay
    deleteModal.addEventListener("click", (event) => {
      if (event.target === deleteModal) {
        deleteModal.remove();
      }
    });

    const cancelButton = deleteModal.querySelector(".cancel-button");
    const confirmDeleteButton = deleteModal.querySelector(
      ".delete-confirm-button"
    );

    cancelButton.addEventListener("click", () => {
      deleteModal.remove();
    });

    confirmDeleteButton.addEventListener("click", () => {
      this.handleDeleteProjectConfirmation(projectID);
      deleteModal.remove();
    });
  },

  handleDeleteProjectConfirmation(projectID) {
    this.removeProjectData(projectID);
    ui.renderProjects(this.projects);
  },

  selectProject() {
    const projectList = document.querySelector(".project-list");
    projectList.addEventListener("click", (event) => {
      if (event.target.classList.contains("project-name-btn")) {
        const selectProjectButton = event.target;
        const projectID = selectProjectButton.parentElement.dataset.id;
        const project = this.projects.find((p) => p.id === projectID);

        ui.renderTasksByProject(project);
        this.attachAddTaskEventListener(project);
        project.tasks.forEach((task) => {
          this.attachTaskRowEventListeners(task);
        });
      }
    });
  },

  attachAddTaskEventListener(project) {
    const addTaskButton = document.querySelector(".add-task-button");
    addTaskButton.addEventListener("click", () => {
      const createTaskForm = ui.createNewTaskForm();
      const tasksSection = document.querySelector(".tasks-section");
      tasksSection.appendChild(createTaskForm);

      createTaskForm.addEventListener("submit", (event) =>
        this.handleNewTaskFormSubmit(event, project)
      );
      this.attachTaskFormEventListeners(createTaskForm);
    });
  },

  handleNewTaskFormSubmit(event, project) {
    event.preventDefault();
    const newTaskForm = event.target;
    const taskNameInput = newTaskForm.querySelector(".task-name-input");
    const taskDescriptionInput = newTaskForm.querySelector(
      ".task-description-input"
    );
    const dueDateInput = newTaskForm.querySelector(".due-date-input");
    const prioritySelector = newTaskForm.querySelector(".priority-selector");
    const projectID = project.id;

    const isValidDate = this.validateDateInput(dueDateInput);
    if (!isValidDate) {
      return;
    }

    const newTask = new Task(
      projectID,
      taskNameInput.value.trim(),
      taskDescriptionInput.value.trim(),
      dueDateInput.value,
      prioritySelector.value
    );

    this.saveNewTaskData(newTask);
    ui.renderTask(newTask);
    this.attachTaskRowEventListeners(newTask);
  },

  attachTaskRowEventListeners(task) {
    const taskRow = document.querySelector(`[data-id="${task.id}"]`);
    if (!taskRow) {
      console.log("Task row not found for task ID:", task.id);
      return;
    }

    const checkbox = taskRow.querySelector(".task-checkbox");
    if (!checkbox) {
      console.log("Checkbox not found for task ID:", task.id);
      return;
    }

    console.log("Checkbox found:", checkbox); // Log the checkbox element

    if (!checkbox.hasAttribute("data-listener-attached")) {
      checkbox.addEventListener("change", () => {
        console.log("Checkbox clicked for task ID:", task.id);
        console.log("Before toggle, task.completed:", task.completed);
        task.toggleCompleted();
        console.log("After toggle, task.completed:", task.completed);
        this.editTaskData(task);
      });

      checkbox.setAttribute("data-listener-attached", "true");
    }
  },

  attachTaskFormEventListeners(createTaskForm) {
    const confirmButton = createTaskForm.querySelector(".confirm-button");
    const cancelButton = createTaskForm.querySelector(".cancel-button");
    const dueDateInput = createTaskForm.querySelector(".due-date-input");

    dueDateInput.addEventListener("change", () => {
      dueDateInput.setCustomValidity("");
    });

    confirmButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (createTaskForm.checkValidity()) {
        createTaskForm.requestSubmit();
      } else {
        createTaskForm.reportValidity();
      }
    });

    cancelButton.addEventListener("click", () => {
      createTaskForm.remove();
    });
  },

  selectTodayTasks() {
    const todayButton = document.querySelector(".today-btn");
    todayButton.addEventListener("click", () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const tasksForToday = this.projects
        .map((project) => project.tasks)
        .flat()
        .filter((task) => task.dueDate === today);

      ui.renderTodayTasks(tasksForToday);
      tasksForToday.forEach((task) => {
        this.attachTaskRowEventListeners(task);
      });
    });
  },

  selectNext7DaysTasks() {
    const next7DaysButton = document.querySelector(".next-7-days-btn");
    next7DaysButton.addEventListener("click", () => {
      const next7Days = [];
      for (let i = 0; i < 7; i++) {
        next7Days.push(format(addDays(new Date(), i), "yyyy-MM-dd"));
      }
      const tasksForNext7Days = this.projects
        .map((project) => project.tasks)
        .flat()
        .filter((task) => next7Days.includes(task.dueDate));

      ui.renderNext7DaysTasks(tasksForNext7Days);
      tasksForNext7Days.forEach((task) => {
        this.attachTaskRowEventListeners(task);
      });
    });
  },

  selectAllTasks() {
    const allTasksButton = document.querySelector(".all-tasks-btn");
    allTasksButton.addEventListener("click", () => {
      const allTasks = this.projects.map((project) => project.tasks).flat();

      ui.renderAllTasks(allTasks);
      allTasks.forEach((task) => {
        this.attachTaskRowEventListeners(task);
      });
    });
  },

  selectImportantTasks() {
    const importantButton = document.querySelector(".important-btn");
    importantButton.addEventListener("click", () => {
      const importantTasks = this.projects
        .map((project) => project.tasks)
        .flat()
        .filter((task) => task.priority === "High");

      ui.renderImportantTasks(importantTasks);
      importantTasks.forEach((task) => {
        this.attachTaskRowEventListeners(task);
      });
    });
  },

  validateDateInput(dueDateInput) {
    if (!dueDateInput.value) {
      dueDateInput.setCustomValidity("Please select a due date.");
      dueDateInput.reportValidity();
      return false;
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const dueDate = dueDateInput.value;

    if (isBefore(new Date(dueDate), new Date(today))) {
      dueDateInput.setCustomValidity(
        "The due date must be today or in the future."
      );
      dueDateInput.reportValidity();
      return false;
    }
    return true;
  },

  shiaSurprise() {
    const shiaVideoLink = document.querySelector(".shia-surprise");
    const tasksSection = document.querySelector(".tasks-section");

    shiaVideoLink.addEventListener("click", function (event) {
      event.preventDefault();
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/ZXsQAXx_ao0?autoplay=1";
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.allow = "autoplay;";

      tasksSection.innerHTML = "";
      tasksSection.appendChild(iframe);
    });
  },
};

stateManager.initialize();
addMetaTestProject();
