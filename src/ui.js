function renderProjects(projects) {
  const projectList = document.querySelector("#project-list");
  projectList.innerHTML = "";
  projects.forEach((element) => {
    const listItem = document.createElement("li");
    listItem.textContent = element.name;
    projectList.appendChild(listItem);
  });
}

function createProjectForm() {
  const newProjectForm = document.createElement("form");
  const projectNameInput = document.createElement("INPUT");
  projectNameInput.setAttribute("type", "text");
  projectNameInput.setAttribute("placeholder", "Enter Project Name");
  projectNameInput.setAttribute("maxLength", "24");
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


export const ui = { renderProjects, createProjectForm };