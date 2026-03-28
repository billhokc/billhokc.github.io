# billhokc Nx Monorepo

This repository is configured as an Nx monorepo using the latest Angular and Angular Material.

## What is included

- `personal-site`: your landing page app (About, Projects, Contact)
- Nx workspace configuration for build, test, and lint orchestration
- GitHub Pages deployment workflow that builds with Nx

## Local development

Install dependencies:

```bash
npm install
```

Run the landing page:

```bash
npm run start
```

Build production assets:

```bash
npm run build
```

Build for GitHub Pages:

```bash
npm run build:pages
```

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` deploys the app using GitHub Actions.

In GitHub repository settings:

1. Open **Settings > Pages**.
2. Set **Source** to **GitHub Actions**.

The workflow uses the Nx build target:

```bash
nx build personal-site --configuration=github-pages
```

If your GitHub repository name changes, update `baseHref` in `personal-site/project.json`.

## Importing your existing project into this monorepo

Recommended path:

1. Generate an Angular app shell in Nx:

```bash
npx nx g @nx/angular:application imported-project --routing --style=scss
```

2. Copy source code from the old repo into the generated app folder.
3. Move reusable code into shared Nx libraries as needed:

```bash
npx nx g @nx/angular:library shared-ui
```

4. Run project validation:

```bash
npx nx graph
npx nx test imported-project
npx nx lint imported-project
```