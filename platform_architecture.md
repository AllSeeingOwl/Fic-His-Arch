# Platform Architecture: Fictional History Archive

This document serves as the structural blueprints and data schema for the Fictional History Archive, deployed via Vercel and managed via GitHub. All engineering agents must adhere to these technical specifications.

## 1. Directory Structure (Astro / Next.js Static Setup)

```text
├── .github/workflows/      # Automated deployment/validation tasks
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ArticleCard.jsx # Card preview for main page lists
│   │   ├── TimelineToggle.jsx # Multiversal perspective switcher
│   │   └── CitationBlock.jsx  # Mandatory footer citation system
│   ├── layouts/
│   │   └── Layout.astro    # Base HTML template (Microfilm/Museum theme)
│   ├── pages/
│   │   ├── index.astro     # Homepage archive roll
│   │   └── archive/
│   │       └── [slug].astro # Individual dynamic historical reports
│   └── content/
│       └── archive/        # The flat-file markdown database
│           ├── death-star-explosion.md
│           └── jfk-assassination-112263.md
├── public/                 # Static asset folder (Images/Artifact scans)
├── platform_architecture.md # This file (System Blueprint)
└── archivists_handbook.md   # Editorial guidelines and rules
```
