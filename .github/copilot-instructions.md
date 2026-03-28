# billhokc Workspace Instructions for Agents

This repository is an Nx monorepo with Angular and Angular Material.

## Primary Goals

- Keep the `personal-site` app building and deployable to GitHub Pages.
- Use Nx commands for all build, test, and lint operations.
- Preserve deployment compatibility with `.github/workflows/deploy-pages.yml`.

## Project Layout

- Main app: `personal-site`
- Nx config: `nx.json`
- App project config: `apps/personal-site/project.json`
- Deployment workflow: `.github/workflows/deploy-pages.yml`

## Required Tooling and Versions

- Node.js: 22 (matches GitHub Actions workflow)
- Nx: 22.x
- Angular: 21.x
- Angular Material is installed and used by the app.

## Canonical Commands

Run these from repository root:

- Install dependencies: `npm ci` (preferred in CI) or `npm install` (local)
- Serve app: `npm run start`
- Build app (production): `npm run build`
- Build app for GitHub Pages: `npm run build:pages`
- Unit tests: `npm run test -- --watch=false`
- Lint: `npm run lint`

Equivalent direct Nx commands:

- `nx serve personal-site`
- `nx build personal-site`
- `nx build personal-site --configuration=github-pages`
- `nx test personal-site`
- `nx lint personal-site`

## GitHub Pages Deployment Rules

- Deployment is handled by GitHub Actions in `.github/workflows/deploy-pages.yml`.
- Build command in workflow must remain:
  - `npx nx build personal-site --configuration=github-pages`
- Artifact path must remain:
  - `dist/personal-site`
- `apps/personal-site/project.json` contains a `build.configurations.github-pages` config.
- `build.configurations.github-pages.baseHref` must match repository name format:
  - `/<repo-name>/`
  - Current value: `/billhokc/`

If the GitHub repository name changes, update `baseHref` in `apps/personal-site/project.json`.

## Angular Material and Animations

- App uses Angular Material components.
- `@angular/animations` is required and must stay installed.
- App config uses `provideAnimationsAsync()` in `apps/personal-site/src/app/app.config.ts`.

## Expected Validation Before Finishing Changes

For changes that affect app behavior, build, or deployment, run:

1. `npm run build`
2. `npm run test -- --watch=false`
3. `npm run build:pages`

Only skip commands if unrelated to the touched area and explain why.

## Guidance for Adding Imported Projects

When importing another project into this monorepo:

- Prefer generating Nx project scaffolding first, then move code in.
- Keep `personal-site` and GitHub Pages flow working while adding new projects.
- Avoid breaking existing target names used in scripts/workflows.
- Add/update scripts only when they remain Nx-first and repo-root runnable.

## Safety Constraints

- Do not change deployment target names without updating scripts and workflow together.
- Do not change output path `dist/personal-site` unless workflow artifact path is updated too.
- Do not remove `github-pages` build configuration from `apps/personal-site/project.json`.
