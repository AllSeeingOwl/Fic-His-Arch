# Fictional History Archive (Fic-His-Arch)

![Astro](https://img.shields.io/badge/Astro-0C0E14?style=flat-square&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

Welcome to the **Fictional History Archive**—a repository of massive, culturally shifting events from fictional universes, presented as credible, real-world historical records. Our interface brings an institutional, microfilm-inspired digital-museum aesthetic to the world of fictional lore.

## 📖 Project Description

The Fictional History Archive treats fictional events (e.g., galactic wars, cataclysmic disruptions, fallen empires) as authentic historical records. The platform allows readers to browse through historical timelines, toggle between multiversal perspectives, and trace the activities of time travelers, all presented with a strict journalistic tone.

## ✨ Features

- **Multiversal Perspectives:** Seamlessly toggle between parallel historical records when different fictional universes address the exact same real-world historical event (e.g., November 22, 1963).
- **Time Traveler Case Chronicles:** Active sighting and missing persons reports for characters who manipulate time or move across centuries.
- **Mandatory Citation Framework:** Every entry features an unalterable Source Citation Block detailing provenance, publication medium, and narrative impact.
- **Microfilm/Museum Aesthetic:** A visual theme built with Tailwind CSS, utilizing a deep obsidian desk matte background, typewriter/microfilm text (Courier Prime), and aged gold institutional accents.
- **Flat-File Markdown Database:** Content is organized using Astro Content Collections with a strict Zod schema validation.

## 🛠️ Tech Stack

The project utilizes a dual-stack architecture:

- **Frontend:** [Astro](https://astro.build/) (Static Site Generation), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Express](https://expressjs.com/) server managed with `ts-node`
- **Package Management:** `pnpm`
- **Testing:** Jest (Unit), Playwright & Cypress (E2E)

## 🏗️ Architecture

```text
├── .github/workflows/      # Automated deployment/validation tasks
├── src/
│   ├── components/         # Reusable UI components (React/Astro)
│   ├── layouts/            # Base HTML template (Microfilm/Museum theme)
│   ├── pages/              # Astro routing pages
│   └── content/
│       └── archive/        # The flat-file markdown database
├── public/                 # Static asset folder (Images/Artifact scans)
├── server.ts               # Express backend server
└── platform_architecture.md # System Blueprint
```

## 🚀 Setup & Installation

The project requires **Node.js v22 or higher** and **pnpm**.

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd fic-his-arch
   ```

2. **Install dependencies:**
   _(Do not use npm or yarn to avoid modifying the lockfile.)_

   ```bash
   pnpm install
   ```

3. **Start the development servers:**
   - **Backend (Express):**
     ```bash
     pnpm run dev:server
     ```
   - **Frontend (Astro):**
     _(Requires a separate terminal)_
     ```bash
     npx astro dev
     ```

4. **Testing & Verification:**

   ```bash
   pnpm run test               # Run Jest unit tests
   pnpm run test:e2e:playwright # Run Playwright E2E tests
   pnpm run typecheck          # TypeScript validation
   pnpm run lint               # Run ESLint
   pnpm run format             # Run Prettier
   ```

5. **Build for Production:**
   ```bash
   pnpm run build:astro
   ```

## 🖋️ Editorial Guidelines & Contributing

All articles submitted to the database must comply with the protocols defined in the `archivists_handbook.md`.

### Core Principles

1. **Fictional Origin:** The source text must be a work of fiction.
2. **Journalistic Tone:** Entries must read like a credible news broadcast or newspaper report. First-person blogging or speculative fan theories are strictly forbidden.
3. **Narrative Impact:** Focus on massive, culturally shifting events that carry substantial narrative weight in their native lore.

### Content Organization

Entries are cataloged into two primary timelines:

- `On Earth`: Alternative-history variants or near-future projections on Earth.
- `Not On Earth`: Deep space, extraterrestrial colony worlds, or fantasy realms.
