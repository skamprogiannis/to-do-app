function renderProjects(projects) {
  const projectList = document.querySelector(".project-list");
  projectList.innerHTML = "";
  projects.forEach((project, index) => {
    const listItem = document.createElement("li");
    listItem.dataset.index = index;
    const projectButton = document.createElement("button");
    projectButton.textContent = project.name;
    projectButton.classList.add("project-name-btn");
    listItem.appendChild(projectButton);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("project-actions-container");

    const editButton = document.createElement("button");
    editButton.innerHTML = '<img src="/images/edit_note_32dp.png">';
    editButton.classList.add("edit-project-btn");
    editButton.dataset.index = index;
    editButton.setAttribute("aria-label", `Edit ${project.name}`);
    buttonContainer.appendChild(editButton);


    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img src="/images/delete_32dp.png">';
    deleteButton.classList.add("delete-project-btn");
    deleteButton.dataset.index = index;
    deleteButton.setAttribute("aria-label", `Delete ${project.name}`);
    buttonContainer.appendChild(deleteButton);

    listItem.appendChild(buttonContainer);
    projectList.appendChild(listItem);
  });
}

function createProjectForm() {
  const newProjectForm = document.createElement("form");
  const projectNameInput = document.createElement("input");
  projectNameInput.setAttribute("type", "text");
  projectNameInput.setAttribute("required", "true");
  projectNameInput.setAttribute("placeholder", "Enter Project Name");
  projectNameInput.setAttribute("maxLength", "32");
  projectNameInput.setAttribute("minLength", "1");
  projectNameInput.setAttribute("aria-label", "Project Name");
  projectNameInput.classList.add("project-name-input")

  newProjectForm.appendChild(projectNameInput);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  newProjectForm.appendChild(buttonContainer);

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.classList.add("confirm-button");
  buttonContainer.appendChild(confirmButton);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  buttonContainer.appendChild(cancelButton);

  return newProjectForm;
}

function editProjectNameForm(projectName) {
  const editProjectForm = createProjectForm()
  const projectNameInput = editProjectForm.querySelector(".project-name-input");
  projectNameInput.value = projectName;
  return editProjectForm;
}

export const ui = { renderProjects, createProjectForm, editProjectNameForm };
