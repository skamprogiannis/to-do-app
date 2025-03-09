import "./styles.css";
import ToDo from "./ToDo.js";
import Project from "./Project.js";
import { ui } from "./ui.js";

const projectManager = {
  projects: [],

  addProjectButton: document.querySelector(".add-project"),

  initialize() {
    this.loadProjectsFromLocalStorage();
    this.shiaSurprise();
    this.addProjectButton.addEventListener("click", () =>
      this.handleAddProjectClick()
    );
  },

  loadProjectsFromLocalStorage() {
    const storedProjectsData = localStorage.getItem("projects");
    this.projects = storedProjectsData ? JSON.parse(storedProjectsData) : [];
    ui.renderProjects(this.projects);
  },

  handleAddProjectClick() {
    this.addProjectButton.disabled = true;
    const projectList = document.querySelector(".project-list");
    const newProjectForm = ui.createProjectForm();
    projectList.appendChild(newProjectForm);

    const projectNameInput = newProjectForm.querySelector("input");
    projectNameInput.focus();

    newProjectForm.addEventListener("submit", (event) =>
      this.handleProjectFormSubmit(event)
    );
    this.attachProjectFormButtonEventListeners(newProjectForm);
  },

  handleProjectFormSubmit(event) {
    event.preventDefault();
    const newProjectForm = event.target;
    const projectNameInput = newProjectForm.querySelector("input");
    const newProject = new Project(projectNameInput.value);
    this.saveProject(newProject);

    document.querySelector(".add-project").disabled = false;
    newProjectForm.reset();
    ui.renderProjects(this.projects);
  },

  attachProjectFormButtonEventListeners(newProjectForm) {
    const confirmButton = newProjectForm.querySelector(".confirm-button");
    const cancelButton = newProjectForm.querySelector(".cancel-button");

    confirmButton.addEventListener("click", () => {
      newProjectForm.dispatchEvent(new Event("submit"));
    });

    cancelButton.addEventListener("click", () => {
      newProjectForm.remove();
      document.querySelector(".add-project").disabled = false;
    });
  },

  saveProject(newProject) {
    this.projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(this.projects));
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
