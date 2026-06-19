# Release Notes - v5.3.1

**Release Date:** June 19, 2026

## Overview

This minor release delivers significant bug fixes including email configuration handling and asset loading in production. It also ships  dependency upgrades across both modules.

## 🐛 Bug Fixes

### Backend

- **Backend startup errors**: Disable erroring out if email config is not present, allowing the server to start and handle contact form errors gracefully instead of crashing

### Frontend

- **Asset loading**: Fixed production asset loading issues by correcting Vite configuration.

## 📦 Dependency Updates

Major version bumps in both modules. See `frontend/package.json` and `backend/package.json` for exact pinned versions.

### Frontend Dependencies (v4.5.0)

**Production**
- `axios` 1.16.1 → **1.18.0**
- `vue` 3.5.34 → **3.5.38**
- `vue-router` 5.0.7 → **5.1.0**
- `vuetify` 4.0.7 → **4.1.2**

**Development**
- `@types/node` 25.9.1 → **26.0.0** *(major)*
- `@typescript-eslint/eslint-plugin` 8.60.0 → **8.61.1**
- `@typescript-eslint/parser` 8.60.0 → **8.61.1**
- `@vitest/coverage-v8` 4.1.7 → **4.1.9**
- `@vue/test-utils` 2.4.10 → **2.4.11**
- `eslint` 10.4.0 → **10.5.0**
- `eslint-plugin-prettier*` 5.5.5 → **5.5.6**
- `eslint-plugin-vue` 10.9.1 → **10.9.2**
- `happy-dom` 20.9.0 → **20.10.6**
- `prettier` 3.8.3 → **3.8.4**
- `sass` 1.100.0 → **1.101.0**
- `stylelint` 17.12.0 → **17.13.0**
- `stylelint-scss` 7.1.1 → **7.2.0**
- `unplugin-imagemin` 0.7.0 *(removed)*
- `vite` 8.0.14 → **8.0.16**
- `vite-plugin-image-optimizer` **2.0.3** *(added)*
- `vite-plugin-imagemin` **0.6.1** *(added)*
- `vite-plugin-vue-devtools` 8.1.2 → **8.1.3**
- `vitest` 4.1.7 → **4.1.9**
- `vue-eslint-parser` 10.4.0 → **10.4.1**
- `vue-tsc` 3.3.2 → **3.3.5**

### Backend Dependencies (v2.1.1)

**Production**
- `axios` 1.16.1 → **1.18.1**
- `body-parser` 2.2.2 → **8.3.0**
- `js-yaml` 4.1.1 → **4.2.0**
- `nodemailer` 8.0.9 → **9.0.1** *(major)*

**Development**
- `@types/node` 25.9.1 → **26.0.0** *(major)*
- `@types/nodemailer` 8.0.0 → **8.0.1**
- `@typescript-eslint/eslint-plugin` 8.60.0 → **8.61.1**
- `@typescript-eslint/parser` 8.60.0 → **8.61.1**
- `@vitest/coverage-v8` 4.1.7 → **4.1.9**
- `esbuild` 0.28.0 → **0.28.1**
- `eslint` 10.4.0 → **10.5.0**
- `eslint-plugin-prettier` 5.5.5 → **5.5.6**
- `prettier` 3.8.3 → **3.8.4**
- `tsx` 4.22.3 → **4.22.4**
- `vitest` 4.1.7 → **4.1.9**

## 📊 Statistics

- **13 files changed**
- **9,057 insertions (+)**
- **3,771 deletions (-)**
- **5 commits** since v5.3.0

### Key File Changes

- **Frontend**: 3 files
- **Backend**: 6 files
- **Dependencies**: 4 files (package.json + lockfiles for both modules)

## 🏷️ Version Information

- **Frontend**: v4.5.1
- **Backend**: v2.1.2
- **Overall Project**: v5.3.1

## 📝 Migration Notes

### Upgrading from v5.3.0

No breaking changes. Pull the latest code and rebuild:

```bash
# Pull latest changes
git pull origin main

# Frontend
cd frontend
npm install
npm run build

# Backend
cd ../backend
npm install
npm run build

# Docker (if using containerized deployment)
docker-compose down
docker-compose up -d --build
```

## 🔗 Links

- **Repository**: [Toomas633/homepage](https://github.com/Toomas633/homepage)
- **Previous Release**: [v5.3.0](https://github.com/Toomas633/homepage/releases/tag/5.3.0)
- **Full Changelog**: [5.3.0...5.3.1](https://github.com/Toomas633/homepage/compare/5.3.0...5.3.1)
- **Live Site**: [toomas633.com](https://toomas633.com)
- **SonarCloud**: [Project Dashboard](https://sonarcloud.io/project/overview?id=Toomas633_Homepage)

## 🙏 Contributors

- @Toomas633

---
