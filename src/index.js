import "./styles.css";
import Task from "./Task.js";
import Project from "./Project.js";
import { ui } from "./ui.js";
import { demoProject } from "./testProject.js";
import { format, isBefore, addDays } from "date-fns";

export const stateManager = {
  projects: [],
  currentView: null,

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
    document.querySelector('.today-btn').click();
    demoProject.createDemoProjectModal();
  },

  loadProjectsFromLocalStorage() {
    const storedProjectsData = localStorage.getItem("projects");
    if (!storedProjectsData) {
      this.projects = [];
      ui.renderProjects(this.projects);
      return;
    }
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
    const project = this.projects.find(
      (project) => project.id === newTask.projectID
    );
    if (!project) {
      console.error("Project not found when saving task.");
      return;
    }

    project.tasks.push(newTask);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  editTaskData(updatedTask) {
    const project = this.projects.find(
      (project) => project.id === updatedTask.projectID
    );
    const task = project.tasks.find((task) => task.id === updatedTask.id);
    Object.assign(task, updatedTask);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  removeTaskData(task) {
    const project = this.projects.find(
      (project) => project.id === task.projectID
    );
    const taskIndex = project.tasks.findIndex((t) => t.id === task.id);
    project.tasks.splice(taskIndex, 1);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  toggleSidebar() {
    const toggleSidebarButton = document.querySelector("#toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");

    const updateSidebarState = (expanded) => {
      toggleSidebarButton.setAttribute("aria-expanded", String(expanded));
      sidebar.inert = !expanded;
    };

    if (window.matchMedia("(max-width: 700px)").matches) {
      sidebar.classList.add("hidden");
      updateSidebarState(false);
    }

    toggleSidebarButton.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
      updateSidebarState(!sidebar.classList.contains("hidden"));
    });
  },

  collapseSidebarOnMobile() {
    if (!window.matchMedia("(max-width: 700px)").matches) {
      return;
    }

    const sidebar = document.querySelector(".sidebar");
    const toggleSidebarButton = document.querySelector("#toggle-sidebar");
    sidebar.classList.add("hidden");
    sidebar.inert = true;
    toggleSidebarButton.setAttribute("aria-expanded", "false");
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

      newProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleNewProjectFormSubmit(event);
      });

      this.attachProjectFormButtonEventListeners(newProjectForm);
    });
  },

  handleNewProjectFormSubmit(event) {
    event.preventDefault();
    const newProjectForm = event.target;
    
    if (!newProjectForm.checkValidity()) {
      newProjectForm.reportValidity();
      return;
    }

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
      projectForm.requestSubmit();
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
      const deleteTrigger = event.target.closest(".delete-project-btn");
      if (deleteTrigger) {
        const projectLi = event.target.closest("li");
        const projectID = projectLi.dataset.id;
        const projectIndex = this.projects.findIndex((p) => p.id === projectID);
        const projectName = this.projects[projectIndex].name;
        
        const deleteModal = ui.createDeleteProjectModal(projectName, projectIndex);
        document.body.appendChild(deleteModal);
        
        const confirmButton = deleteModal.querySelector(".delete-confirm-button");
        const cancelButton = deleteModal.querySelector(".cancel-button");
        const closeModal = () => {
          deleteModal.remove();
          if (deleteTrigger.isConnected) {
            deleteTrigger.focus();
          }
        };

        cancelButton.focus();
        
        confirmButton.addEventListener("click", () => {
          this.removeProjectData(projectID);
          
          if (this.currentView && this.currentView.closest("li") === projectLi) {
            document.querySelector('.today-btn').click();
          }      
          ui.renderProjects(this.projects);
          closeModal();
        });
        
        cancelButton.addEventListener("click", closeModal);

        deleteModal.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            closeModal();
          }
        });
        
        deleteModal.addEventListener("click", (event) => {
          if (event.target === deleteModal) {
            closeModal();
          }
        });
      }
    });
  },

  selectProject() {
    const projectList = document.querySelector(".project-list");
    projectList.addEventListener("click", (event) => {
      if (event.target.classList.contains("project-name-btn")) {
        this.clearSelectedView();
        const selectProjectButton = event.target;
        const projectLi = selectProjectButton.closest("li");
        projectLi.classList.add("selected");
        this.currentView = projectLi;

        const projectID = selectProjectButton.parentElement.dataset.id;
        const project = this.projects.find((p) => p.id === projectID);

        ui.renderTasksByProject(project);
        this.collapseSidebarOnMobile();
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
      addTaskButton.disabled = true;
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

    const addTaskButton = document.querySelector(".add-task-button");
    addTaskButton.disabled = false;

    this.saveNewTaskData(newTask);
    ui.renderTask(newTask);
    newTaskForm.remove();
    this.attachTaskRowEventListeners(newTask);
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
      const addTaskButton = document.querySelector(".add-task-button");
      addTaskButton.disabled = false;
      createTaskForm.remove();
    });
  },

  attachTaskRowEventListeners(task) {
    const taskRow = document.querySelector(`[data-id="${task.id}"]`);
  
    const checkbox = taskRow.querySelector(".task-checkbox");
    checkbox.addEventListener("change", () => {
      task.toggleCompleted();
      this.editTaskData(task);
    });
  
    const detailsButton = taskRow.querySelector(".details-task-btn");
    detailsButton.addEventListener("click", () => {
      const detailsModal = ui.createTaskDetailsModal(task);
      document.body.appendChild(detailsModal);    
      this.attachTaskDetailsModalEventListeners(detailsModal, task, detailsButton);
      detailsModal.querySelector(".details-textarea").focus();
    });

    const editButton = taskRow.querySelector(".edit-task-btn");
    editButton.addEventListener("click", () => {
      const editTaskForm = ui.createEditTaskForm(task);
      taskRow.style.display = 'none';  // Hide the task row
      taskRow.parentNode.insertBefore(editTaskForm, taskRow);

      editTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const taskNameInput = editTaskForm.querySelector(".task-name-input");
        const taskDescriptionInput = editTaskForm.querySelector(".task-description-input");
        const dueDateInput = editTaskForm.querySelector(".due-date-input");
        const prioritySelector = editTaskForm.querySelector(".priority-selector");

        const isValidDate = this.validateDateInput(dueDateInput);
        if (!isValidDate) return;

        task.title = taskNameInput.value.trim();
        task.description = taskDescriptionInput.value.trim();
        task.dueDate = dueDateInput.value;
        task.priority = prioritySelector.value;

        this.editTaskData(task);
        editTaskForm.remove();
        taskRow.style.display = '';  // Show the task row again
        ui.updateTaskRow(task, taskRow);
      });

      const cancelButton = editTaskForm.querySelector(".cancel-button");
      cancelButton.addEventListener("click", () => {
        editTaskForm.remove();
        taskRow.style.display = '';  // Show the task row again
      });
    });

    const deleteButton = taskRow.querySelector(".delete-task-btn");
    deleteButton.addEventListener("click", () => {
      this.removeTaskData(task);
      ui.derenderTask(task);
    });
  },
  
  attachTaskDetailsModalEventListeners(detailsModal, task, detailsTrigger) {
    const closeModal = () => {
      detailsModal.remove();
      if (detailsTrigger.isConnected) {
        detailsTrigger.focus();
      }
    };

    // Close modal when clicking on overlay
    detailsModal.addEventListener("click", (event) => {
      if (event.target === detailsModal) {
        closeModal();
      }
    });

    detailsModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  
    const cancelButton = detailsModal.querySelector(".cancel-button");
    const saveButton = detailsModal.querySelector(".save-button");
    const detailsTextarea = detailsModal.querySelector(".details-textarea");
  
    cancelButton.addEventListener("click", closeModal);
  
    saveButton.addEventListener("click", () => {
      task.description = detailsTextarea.value;
      this.editTaskData(task);
      closeModal();
    });
  },

  selectTodayTasks() {
    const todayButton = document.querySelector(".today-btn");
    todayButton.addEventListener("click", () => {
      this.clearSelectedView();
      todayButton.classList.add("selected");
      this.currentView = todayButton;

      const today = format(new Date(), "yyyy-MM-dd");
      const tasksForToday = this.projects
        .map((project) => project.tasks)
        .flat()
        .filter((task) => task.dueDate === today);

      ui.renderTodayTasks(tasksForToday);
      this.collapseSidebarOnMobile();
      tasksForToday.forEach((task) => {
        this.attachTaskRowEventListeners(task);
      });
    });
  },

  selectNext7DaysTasks() {
    const next7DaysButton = document.querySelector(".next-7-days-btn");
    next7DaysButton.addEventListener("click", () => {
      this.clearSelectedView();
      next7DaysButton.classList.add("selected");
      this.currentView = next7DaysButton;

      const next7Days = [];
      for (let i = 0; i < 7; i++) {
        next7Days.push(format(addDays(new Date(), i), "yyyy-MM-dd"));
      }
      const tasksForNext7Days = this.projects
        .map((project) => project.tasks)
        .flat()
        .filter((task) => next7Days.includes(task.dueDate));

      ui.renderNext7DaysTasks(tasksForNext7Days);
      this.collapseSidebarOnMobile();
      tasksForNext7Days.forEach((task) => {
        this.attachTaskRowEventListeners(task);
      });
    });
  },

  selectAllTasks() {
    const allTasksButton = document.querySelector(".all-tasks-btn");
    allTasksButton.addEventListener("click", () => {
      this.clearSelectedView();
      allTasksButton.classList.add("selected");
      this.currentView = allTasksButton;

      const allTasks = this.projects.map((project) => project.tasks).flat();

      ui.renderAllTasks(allTasks);
      this.collapseSidebarOnMobile();
      allTasks.forEach((task) => {
        this.attachTaskRowEventListeners(task);
      });
    });
  },

  selectImportantTasks() {
    const importantButton = document.querySelector(".important-btn");
    importantButton.addEventListener("click", () => {
      this.clearSelectedView();
      importantButton.classList.add("selected");
      this.currentView = importantButton;

      const importantTasks = this.projects
        .map((project) => project.tasks)
        .flat()
        .filter((task) => task.priority === "High");

      ui.renderImportantTasks(importantTasks);
      this.collapseSidebarOnMobile();
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
      iframe.title = "Shia LaBeouf motivation video";

      tasksSection.innerHTML = "";
      tasksSection.appendChild(iframe);
    });
  },

  clearSelectedView() {
    const allViews = document.querySelectorAll('.home ul li button, .project-list li');
    allViews.forEach(view => {
      view.classList.remove('selected');
    });
  },
};

stateManager.initialize();
