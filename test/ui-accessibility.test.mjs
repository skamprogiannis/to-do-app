import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { JSDOM } from "jsdom";

import { ui } from "../src/ui.js";

const template = await readFile(
  new URL("../src/template.html", import.meta.url),
  "utf8"
);

function installDocument(markup) {
  const dom = new JSDOM(markup);
  globalThis.document = dom.window.document;
  return dom;
}

test("the static application controls have accessible names", () => {
  const dom = installDocument(template);
  const sidebarToggle = dom.window.document.querySelector("#toggle-sidebar");
  const surprise = dom.window.document.querySelector(".shia-surprise");

  assert.equal(sidebarToggle.getAttribute("aria-label"), "Toggle sidebar");
  assert.equal(sidebarToggle.getAttribute("aria-controls"), "sidebar");
  assert.equal(sidebarToggle.getAttribute("aria-expanded"), "true");
  assert.equal(surprise.tagName, "BUTTON");

  for (const image of dom.window.document.querySelectorAll("img")) {
    assert.ok(image.hasAttribute("alt"), "every image declares alt text");
  }
});

test("rendered task controls identify the task they affect", () => {
  const dom = installDocument('<div class="tasks-container"></div>');
  const task = {
    id: "task-1",
    title: "Review responsive layout",
    dueDate: "2026-09-03",
    priority: "High",
    completed: false,
  };

  ui.renderTask(task);

  const row = dom.window.document.querySelector(".task-row");
  assert.equal(
    row.querySelector(".task-checkbox").getAttribute("aria-label"),
    "Mark Review responsive layout complete"
  );
  assert.equal(row.querySelector(".task-title").textContent, task.title);
  assert.equal(
    row.querySelector(".task-due-date").textContent,
    "Due: 2026-09-03"
  );
  assert.equal(row.querySelectorAll('img[alt=""]').length, 2);
});

test("task forms and dialogs expose their purpose", () => {
  installDocument("");

  const form = ui.createNewTaskForm();
  const details = ui.createTaskDetailsModal({
    id: "task-1",
    title: "Document behavior",
    description: "Keep the README accurate.",
  });
  const deletion = ui.createDeleteProjectModal("Portfolio", 0);

  assert.equal(
    form.querySelector(".priority-selector").getAttribute("aria-label"),
    "Priority"
  );
  assert.equal(details.querySelector("[role=dialog]")?.getAttribute("aria-modal"), "true");
  assert.equal(
    details.querySelector(".details-textarea").getAttribute("aria-label"),
    "Task description"
  );
  assert.equal(deletion.querySelector("[role=alertdialog]")?.getAttribute("aria-modal"), "true");
});

test("project names remain text inside the deletion warning", () => {
  installDocument("");
  const projectName = '<img src=x onerror="alert(1)">';

  const deletion = ui.createDeleteProjectModal(projectName, 0);
  const warning = deletion.querySelector(".modal-body p");

  assert.equal(warning.querySelector("img"), null);
  assert.match(warning.textContent, /<img src=x onerror="alert\(1\)">/);
});

test("editing a task refreshes the accessible control names", () => {
  const dom = installDocument('<div class="tasks-container"></div>');
  const task = {
    id: "task-1",
    title: "Draft title",
    dueDate: "2026-09-03",
    priority: "Low",
    completed: false,
  };
  ui.renderTask(task);

  task.title = "Final title";
  task.dueDate = "2026-09-04";
  task.priority = "High";
  const row = dom.window.document.querySelector(".task-row");
  ui.updateTaskRow(task, row);

  assert.equal(
    row.querySelector(".task-checkbox").getAttribute("aria-label"),
    "Mark Final title complete"
  );
  assert.equal(
    row.querySelector(".details-task-btn").getAttribute("aria-label"),
    "View details for Final title"
  );
  assert.equal(
    row.querySelector(".edit-task-btn").getAttribute("aria-label"),
    "Edit Final title"
  );
  assert.equal(
    row.querySelector(".delete-task-btn").getAttribute("aria-label"),
    "Delete Final title"
  );
});
