import Project from "./Project.js";
import Task from "./tasks.js";
import { ui } from "./ui.js";
import { stateManager } from "./index.js";

export function addMetaTestProject() {
  if (stateManager.projects.length === 0) {
    const meta = new Project("Meta");
    const shia = new Task(meta.id, "Shia", "", "2025-03-13", "High");
    shia.toggleCompleted();
    const theme = new Task(
      meta.id,
      "Add Theme Toggle",
      "Add the ability to change between Light and Dark mode",
      "2025-03-13",
      "Medium"
    );
    const validationTask = new Task(
      meta.id,
      "Add Validation to Project and Task Creation Forms",
      "The user should not be able to create projects or tasks without a name or with the same name as existing projects or tasks",
      "2025-03-30",
      "Low"
    );
    const backendTask = new Task(
      meta.id,
      "Add Backend",
      "Currently everything is stored in localStorage. Spin up a server with node.js",
      "2025-03-28",
      "High"
    );
    const responsiveDesignTask = new Task(
      meta.id,
      "Make Design More Responsive",
      "",
      "2025-03-26",
      "Medium"
    );
    const readmeTask = new Task(
      meta.id,
      "Write README",
      "",
      "2025-03-30",
      "Low"
    );
    const sidebarToggleTask = new Task(
      meta.id,
      "Add CSS Animations For Sidebar Toggle",
      "",
      "2025-03-30",
      "Low"
    );
    const refactorRenderingTask = new Task(
      meta.id,
      "Refactor Project Rendering Functions",
      "Instead of always deleting all projects and re-rendering them, it should be possible to add/remove a single project from the dom from the DOM",
      "2025-03-30",
      "Low"
    );
    const accessibilityTask = new Task(
      meta.id,
      "Improve Accessibility",
      "",
      "2025-03-30",
      "Medium"
    );
    const authTask = new Task(
      meta.id,
      "Add User Profiles and Authentication",
      "",
      "2025-04-05",
      "High"
    );

    meta.addTask(shia);
    meta.addTask(theme);
    meta.addTask(validationTask);
    meta.addTask(backendTask);
    meta.addTask(responsiveDesignTask);
    meta.addTask(readmeTask);
    meta.addTask(sidebarToggleTask);
    meta.addTask(refactorRenderingTask);
    meta.addTask(accessibilityTask);
    meta.addTask(authTask);

    stateManager.saveProjectData(meta);
    ui.renderProjects(stateManager.projects);
  }
}
