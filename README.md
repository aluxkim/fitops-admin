# FitOps — fitness membership admin (prototype)

Desktop-style web app for a multi-location gym operator: memberships, classes, PT appointments, staff, retail, marketing UTMs, and AI-style insights. UI uses [Gestalt](https://gestalt.pinterest.systems/).

## Static HTML preview (no Node)

Open **`preview.html`** in your browser (double-click, drag onto the browser, or use the editor’s “Open with Live Preview”). It is a self-contained **browser-based SaaS-style shell** with the same flows (hash navigation, owner/manager, location scope). The **Overview** page includes a **time period** selector and, for **All locations** (owner), a **stylized US map** with a pin per club. No `npm install` required. Optional: Google Fonts load if you’re online.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Use **Owner** vs **Manager** and **Location scope** in the shell to exercise permissions (managers are limited to three sample locations).

## Build

```bash
npm run build
npm run preview
```
