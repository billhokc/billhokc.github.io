# Shared libraries

Use this folder for Nx libraries shared across apps.

Suggested structure:

- `libs/shared/ui`
- `libs/shared/data-access`
- `libs/shared/util`

Generate a shared Angular library:

```bash
npx nx g @nx/angular:library shared-ui --directory=shared/ui
```
