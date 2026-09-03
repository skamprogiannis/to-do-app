# Do It

A client-side task manager built with vanilla JavaScript for [The Odin Project's Todo List assignment](https://www.theodinproject.com/lessons/node-path-javascript-todo-list). It focuses on explicit state management, DOM rendering, browser persistence, and responsive, keyboard-accessible interactions without a UI framework.

[Try the live demo](https://skamprogiannis.github.io/to-do-app/)

## What it does

- Creates, renames, and deletes projects.
- Creates, edits, completes, and deletes tasks with descriptions, due dates, and priorities.
- Filters tasks into Today, Next 7 Days, All Tasks, and Important views.
- Persists projects and tasks in the browser with `localStorage`.
- Offers an optional demo project for first-time visitors.
- Adapts the sidebar, task rows, and dialogs for narrow screens.
- Names icon controls, task checkboxes, and dialogs for keyboard and assistive-technology users.

All data stays in the current browser profile. There is no account system, server, or cross-device synchronization.

## Architecture

The application keeps data and rendering responsibilities separate:

- [`src/Task.js`](src/Task.js) and [`src/Project.js`](src/Project.js) define the domain objects.
- [`src/index.js`](src/index.js) owns application state, persistence, filtering, and interaction handlers.
- [`src/ui.js`](src/ui.js) creates and updates DOM elements.
- [`src/testProject.js`](src/testProject.js) builds the optional first-run demo.
- [`src/template.html`](src/template.html) and [`src/styles.css`](src/styles.css) provide the document structure and responsive visual system.

Webpack bundles the modules and copies the local icon assets into `dist/`.

## Run locally

Node.js 22.15 or newer is required by the development server.

```bash
npm ci
npm run dev
```

Open the local URL printed by webpack. To create a static bundle:

```bash
npm run build
```

## Tests

The project uses Node's built-in test runner, with JSDOM for DOM-level assertions.

```bash
npm test
npm run check
```

`npm run check` runs the model and accessibility tests, then verifies that webpack can build the application. The same command runs in GitHub Actions.

## Project status

This is a completed learning project, not a hosted service. Its deliberately small scope is a single-user browser application; clearing site data removes its locally stored projects. A dedicated GitHub Actions workflow builds and publishes the current `main` branch to GitHub Pages after CI succeeds.

## Credits and licensing

- Assignment: [The Odin Project](https://www.theodinproject.com/)
- Icons: [Material Icons by Google](https://developers.google.com/fonts/docs/material_icons), available under the Apache License 2.0

This repository does not currently include a license for the project source code.
