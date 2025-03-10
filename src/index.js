import "./styles.css";
import ToDo from "./ToDo.js";
import Project from "./Project.js";
import { ui } from "./ui.js";

const projectManager = {
  projects: [],

  initialize() {
    this.loadProjectsFromLocalStorage();
    this.shiaSurprise();
    this.addProjectClick();
    this.editProjectName();
    this.deleteProject();
    this.toggleSidebar();
  },

  loadProjectsFromLocalStorage() {
    const storedProjectsData = localStorage.getItem("projects");
    this.projects = storedProjectsData
      ? JSON.parse(storedProjectsData).map(
          (projectData) => new Project(projectData.name)
        )
      : [];
    ui.renderProjects(this.projects);
  },

  saveProjectData(newProject) {
    this.projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  editProjectData(project, projectIndex) {
    this.projects[projectIndex].name = project.name;
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  removeProjectData(projectIndex) {
    this.projects.splice(projectIndex, 1);
    localStorage.setItem("projects", JSON.stringify(this.projects));
  },

  toggleSidebar() {
    const toggleSidebarButton = document.querySelector("#toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");
  
    let sidebarWidth = sidebar.offsetWidth + "px";
    let sidebarHeight = sidebar.offsetHeight + "px";
  
    toggleSidebarButton.addEventListener("click", () => {
      if (sidebar.style.width === "0px") {
        sidebar.style.transition = "width 0.3s ease, height 0.3s ease";
        sidebar.style.width = sidebarWidth;
        sidebar.style.height = sidebarHeight;
      } else {
        sidebar.style.transition = "width 0.3s ease, height 0.3s ease";
        sidebar.style.width = "0";
        sidebar.style.height = "0";
      }
    });
  },

  addProjectClick() {
    const addProjectButton = document.querySelector(".add-project");
    addProjectButton.addEventListener("click", () => {
      this.disableProjectButtons(true);
      const projectList = document.querySelector(".project-list");
      const newProjectForm = ui.createProjectForm();
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

        const projectIndex = editButton.dataset.index;
        const linkedProject = this.projects[projectIndex];
        const currentProjectName = linkedProject.name;
        const editProjectNameForm = ui.editProjectNameForm(currentProjectName);

        const projectListItems = document.querySelectorAll(".project-list li");
        const projectItem = projectListItems[projectIndex];
        projectItem.replaceWith(editProjectNameForm);

        const projectNameInput = editProjectNameForm.querySelector("input");
        projectNameInput.focus();

        editProjectNameForm.addEventListener("submit", (event) =>
          this.handleEditProjectFormSubmit(event, projectIndex)
        );
        this.attachProjectFormButtonEventListeners(editProjectNameForm);
      }
    });
  },

  handleEditProjectFormSubmit(event, projectIndex) {
    event.preventDefault();
    const editProjectNameForm = event.target;
    const projectNameInput = editProjectNameForm.querySelector("input");
    const updatedProjectName = projectNameInput.value.trim();
    const projectToEdit = this.projects[projectIndex];

    projectToEdit.editName(updatedProjectName);
    this.editProjectData(projectToEdit, projectIndex);

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

        const projectIndex = deleteButton.dataset.index;
        const linkedProject = this.projects[projectIndex];
        const projectName = linkedProject.name;

        const deleteModal = ui.createDeleteModal(projectName, projectIndex);
        document.body.appendChild(deleteModal);

        this.attachDeleteModalEventListeners(deleteModal, projectIndex);
      }
    });
  },

  attachDeleteModalEventListeners(deleteModal, projectIndex) {
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
      this.handleDeleteConfirmation(projectIndex);
      deleteModal.remove();
    });
  },

  handleDeleteConfirmation(projectIndex) {
    this.removeProjectData(projectIndex);
    ui.renderProjects(this.projects);
  },

  shiaSurprise() {
    const shiaVideoLink = document.querySelector(".shia-surprise");
    const todoContainer = document.querySelector(".todo-container");

    shiaVideoLink.addEventListener("click", function (event) {
      event.preventDefault();
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/ZXsQAXx_ao0?autoplay=1";
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.allow = "autoplay;";

      todoContainer.innerHTML = "";
      todoContainer.appendChild(iframe);
    });
  },
};

projectManager.initialize();
