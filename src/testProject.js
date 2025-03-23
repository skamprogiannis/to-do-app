import Project from "./Project.js";
import Task from "./tasks.js";
import { stateManager } from './index.js';

export function meta() {
  if (stateManager.projects.length === 0) {
    const meta = new Project("meta");
    const shia = new Task("shia", "", "2025-03-13", "High");
    shia.toggleCompleted();
    const theme = new Task("Add Theme Toggle", "", "2025-03-13", "Low");
    const validationTask = new Task(
      "Add validation to project and task creation forms",
      "",
      "2025-03-20",
      "Medium"
    );
    const darkModeTask = new Task(
      "Implement Dark Mode",
      "",
      "2025-03-20",
      "Medium"
    );
    const backendTask = new Task("Add backend", "", "2025-03-25", "High");
    const responsiveDesignTask = new Task(
      "Make design responsive",
      "",
      "2025-03-25",
      "Medium"
    );
    const readmeTask = new Task("Write README", "", "2025-03-30", "Low");
    const sidebarToggleTask = new Task(
      "Add CSS effects for sidebar toggle",
      "",
      "2025-03-30",
      "Low"
    );
    const refactorRenderingTask = new Task(
      "Refactor project rendering",
      "Instead of always deleting all projects and re-rendering them, it should be possible to add/remove a single project from the dom from the DOM",
      "2025-03-30",
      "High"
    );
    const accessibilityTask = new Task(
      "Improve accessibility",
      "",
      "2025-03-30",
      "Medium"
    );
    const authTask = new Task(
      "Add user profiles and Authentication",
      "",
      "2025-04-05",
      "High"
    );

    meta.addTask(shia);
    meta.addTask(theme);
    meta.addTask(validationTask);
    meta.addTask(darkModeTask);
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
