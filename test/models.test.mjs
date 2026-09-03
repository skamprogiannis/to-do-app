import assert from "node:assert/strict";
import test from "node:test";

import Project from "../src/Project.js";
import Task from "../src/Task.js";

test("a project owns and removes tasks", () => {
  const project = new Project("Portfolio", [], "project-1");
  const firstTask = new Task(
    project.id,
    "Write documentation",
    "Explain the project",
    "2026-09-03",
    "High",
    false,
    "task-1"
  );
  const secondTask = new Task(
    project.id,
    "Add CI",
    "Run checks on pushes",
    "2026-09-04",
    "Medium",
    false,
    "task-2"
  );

  project.addTask(firstTask);
  project.addTask(secondTask);
  assert.deepEqual(project.tasks, [firstTask, secondTask]);

  project.removeTask("Write documentation");
  assert.deepEqual(project.tasks, [secondTask]);
});

test("task edits and completion state are explicit", () => {
  const task = new Task(
    "project-1",
    "Draft README",
    "First pass",
    "2026-09-03",
    "Low",
    false,
    "task-1"
  );

  task.editTitle("Polish README");
  task.editDescription("Final pass");
  task.editDueDate("2026-09-05");
  task.editPriority("High");
  task.toggleCompleted();

  assert.deepEqual(
    {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      completed: task.completed,
    },
    {
      title: "Polish README",
      description: "Final pass",
      dueDate: "2026-09-05",
      priority: "High",
      completed: true,
    }
  );
});
