# Recipe Browser

Recipe Browser is a lightweight recipe sharing web application that lets users discover, view, and manage recipes. It was created in collaboration with Andy Wang and Durukan Butan.

## Table of contents

- [Recipe Browser](#recipe-browser)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Tech stack](#tech-stack)
  - [Quick start](#quick-start)
  - [Project structure (high level)](#project-structure-high-level)
  - [Credits](#credits)

## Features

- Browse, create, view, review, and save recipes
- Detailed recipe search filtering
- Static frontend served from `public/` with a Node.js/Express backend

## Tech stack

- Node.js + Express
- Oracle DB via `oracledb` (see `package.json`)
- Static frontend in `public/` (HTML, CSS, JS)

## Quick start

Requirements: Node.js (14+), npm

Install dependencies:

```bash
npm install
```

Run locally (recommended):

```bash
./local-start.sh
```

Or run directly:

```bash
node server.js
```

Visit http://localhost:3000 (or the port printed by the server) and open the UI in `public/`.

## Project structure (high level)

- `server.js` — server entry point
- `appService.js`, `appController.js` — server-side helpers
- `public/` — static frontend pages and scripts (`index.html`, `recipe.html`, `allrecipes.html`, etc.)
- `scripts/` — helper shell scripts for local/remote tunnels and instant client setup
- `utils/envUtil.js` — environment helpers

## Credits

Built by Andy Wang, Durukan Butan, and Christian Sutton.
