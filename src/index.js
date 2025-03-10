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

  addProjectClick() {
    const addProjectButton = document.querySelector(".add-project");
    addProjectButton.addEventListener("click", () => {
      addProjectButton.disabled = true;
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

    document.querySelector(".add-project").disabled = false;
    newProjectForm.reset();
    ui.renderProjects(this.projects);
  },

  attachProjectFormButtonEventListeners(newProjectForm) {
    const confirmButton = newProjectForm.querySelector(".confirm-button");
    const cancelButton = newProjectForm.querySelector(".cancel-button");

    confirmButton.addEventListener("click", () => {
      if (newProjectForm.checkValidity()) {
        newProjectForm.requestSubmit();
      } else {
        newProjectForm.reportValidity();
      }
    });

    cancelButton.addEventListener("click", () => {
      newProjectForm.remove();
      document.querySelector(".add-project").disabled = false;
    });
  },

  editProjectName() { // fix
    const projectList = document.querySelector(".project-list");
    projectList.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-project-btn")) {

        console.log("Edit button clicked!"); // Debugging log

        const addProjectButton = document.querySelector(".add-project");
        addProjectButton.disabled = true;

        const projectIndex = event.target.dataset.index;
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

    const addProjectButton = document.querySelector(".add-project");
    addProjectButton.disabled = false;

    editProjectNameForm.reset(); //Is this necessary?
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
