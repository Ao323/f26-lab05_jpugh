# Setup

New toolchain this week: Node and npm instead of Java and Maven. TypeScript and the test
runner both arrive through `npm install`, so there is nothing to install by hand beyond Node.

## 1. Node

- Node 20 or newer. Check with `node --version`.
- npm comes with Node. Check with `npm --version`.

If you are below 20, install a current release from nodejs.org, or use a version manager
such as `nvm` or `fnm`.

## 2. Install dependencies

From this directory:

```
npm install
```

This creates `node_modules/` (gitignored) from the versions pinned in `package-lock.json`.
Run it once.

## 3. Run the tests and the typechecker

```
npm test
npm run typecheck
```

`npm test` runs vitest, which executes the TypeScript directly. `npm run typecheck` runs
`tsc --noEmit`, which compiles nothing and only reports type errors. Both should be green
before you start, and both have to be green when you finish.

## 4. Editor

Any editor works. VS Code has TypeScript support built in, so errors show up as you type
once you open this folder as the project root. If you use something else, make sure it picks
up `tsconfig.json` from this directory.

## 5. Continuous integration

CI is configured in `.github/workflows/ci.yml`. It runs `npm ci`, `npm run typecheck`,
and `npm test` on every push. GitHub disables workflows on a fresh fork, so enable them
from the Actions tab if you want it running.
