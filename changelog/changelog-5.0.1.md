# Release Notes - v5.0.1

**Release Date:** November 23, 2025

## Overview

This patch release focuses on project reorganization, GitHub workflow improvements, and infrastructure updates. The project has been moved to its dedicated homepage repository with updated branding and documentation.

## 🔄 Major Changes

### Project Reorganization

- **Repository Migration**: Moved project from main repository to dedicated `homepage` repository
- **Workspace Rename**: Renamed workspace from `Toomas633.code-workspace` to `Homepage.code-workspace`
- **Documentation Cleanup**: Removed `DEVELOPMENT.md` in favor of module-specific README files

### Infrastructure Updates

- **PM2 Configuration**: Fixed PM2 ecosystem configuration for improved process management
- **Docker Improvements**: Updated Dockerfile with enhanced build process and optimizations
- **SonarCloud**: Updated project configuration to reflect new repository structure

## 🛠️ GitHub Workflows

### Updated Workflows

- **test-build.yml**: Enhanced build and test automation workflow
- **docker.yml**: Improved Docker build and deployment pipeline
- **codeql.yml**: Updated CodeQL security scanning configuration
- **epic-manager.yml**: Comprehensive updates to epic management workflow

### Workflow Cleanup

- Removed deprecated `stale.yml` workflow file

## 📚 Documentation

### Copilot Instructions

- **Root Instructions**: Updated project overview and structure documentation
- **Frontend Instructions**: Enhanced Vue 3 + TypeScript patterns and conventions
- **Backend Instructions**: Improved Node.js + Express architecture guidelines

### README Updates

- **Main README**: Comprehensive update with new repository information (889 lines added)
- **Frontend README**: Updated module-specific documentation
- **Backend README**: Enhanced backend setup and development guides

## 🔧 Configuration

### Files Modified

- `ecosystem.config.cjs` - PM2 process management configuration
- `sonar-project.properties` - SonarCloud project settings
- Module-specific configurations updated across frontend and backend

## 📊 Statistics

- **16 files changed**
- **1,329 insertions (+)**
- **902 deletions (-)**
- **4 commits** since v5.0.0

## 🏷️ Version Information

- **Frontend**: v4.3.0 (unchanged)
- **Backend**: v2.0.0 (unchanged)
- **Overall Project**: v5.0.1

## 🔗 Links

- **Repository**: [Toomas633/homepage](https://github.com/Toomas633/homepage)
- **Previous Release**: [v5.0.0](https://github.com/Toomas633/homepage/releases/tag/5.0.0)

## 🙏 Contributors

- @Toomas633

---

**Full Changelog**: https://github.com/Toomas633/homepage/compare/5.0.0...5.0.1
