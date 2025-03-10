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

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  buttonContainer.appendChild(cancelButton);

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.classList.add("confirm-button");
  buttonContainer.appendChild(confirmButton);

  return newProjectForm;
}

function editProjectNameForm(projectName) {
  const editProjectForm = createProjectForm()
  const projectNameInput = editProjectForm.querySelector(".project-name-input");
  projectNameInput.value = projectName;
  return editProjectForm;
}

function createDeleteModal(projectName, projectIndex) {
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

export const ui = { renderProjects, createProjectForm, editProjectNameForm, createDeleteModal };
