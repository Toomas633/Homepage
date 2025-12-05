# Contributing to Toomas633's Dungeon

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Documentation](#documentation)

---

## Code of Conduct

This project follows a simple code of conduct:

- Be respectful and constructive
- Welcome newcomers and help others learn
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18+ (24+ LTS recommended)
- **npm**: 8+
- **Git**: Latest version
- **VS Code**: (Optional but recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/homepage.git
cd homepage
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/Toomas633/homepage.git
```

## Development Setup

### Initial Setup

1. **Open the workspace** in VS Code:
   ```bash
   code Homepage.code-workspace
   ```

2. **Setup Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   ```

3. **Setup Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with SMTP credentials (optional for local dev)
   npm install
   ```

### Running the Application

**Frontend**:
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Backend**:
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

## Making Changes

### Branch Naming Convention

Use descriptive branch names following this pattern:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or modifications

Example:
```bash
git checkout -b feature/add-dark-mode
```

### Commit Message Guidelines

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(frontend): add dark mode toggle
fix(backend): resolve email validation issue
docs(readme): update deployment instructions
test(frontend): add unit tests for MapComponent
```

### Keep Your Fork Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git checkout develop
git merge upstream/develop
```

## Coding Standards

### Frontend (Vue 3 + TypeScript)

- Use **Composition API** with `<script setup>`
- Follow **TypeScript strict mode** - no `any` types
- Use **Vuetify components** for UI consistency
- Component files use **PascalCase** (e.g., `MyComponent.vue`)
- Utility files use **camelCase** (e.g., `emailService.ts`)
- Use **SCSS** for custom styles
- Follow the existing **project structure**

**Example Component**:
```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

interface Emits {
  (e: 'update', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<Emits>()
</script>

<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>Count: {{ count }}</v-card-text>
  </v-card>
</template>
```

### Backend (Node.js + Express + TypeScript)

- Use **TypeScript strict mode** - proper type annotations
- Use **ESM modules** - `.js` extensions in imports
- Follow **modular architecture** - separate routes, services, middleware
- Use **async/await** - no callbacks
- Implement proper **error handling**
- Add **JSDoc comments** for complex functions

**Example Route**:
```typescript
import type { Request, Response } from 'express'
import { Router } from 'express'

const router = Router()

router.get('/example', async (req: Request, res: Response) => {
  try {
    // Implementation
    res.status(200).json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ success: false, error: message })
  }
})

export default router
```

### Code Quality

Before committing, ensure:

**Frontend**:
```bash
npm run lint        # ESLint check
npm run stylelint   # CSS/SCSS lint
npm run prettier    # Format code
npm run type-check  # TypeScript check
npm run test        # Run tests
```

**Backend**:
```bash
npm run lint        # ESLint check
npm run prettier    # Format code
npm run type-check  # TypeScript check
npm run test        # Run tests
```

## Testing

### Writing Tests

**Frontend** (Vitest + Vue Test Utils):
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders with props', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

**Backend** (Vitest + Supertest):
```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('GET /health', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('healthy')
  })
})
```

### Running Tests

```bash
# Watch mode (interactive)
npm run test

# Coverage report
npm run test:coverage
```

### Test Coverage

- Aim for **80%+ coverage** for new code
- All new features should include tests
- Bug fixes should include regression tests

## Submitting Changes

### Pull Request Process

1. **Update your branch** with latest upstream:
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

2. **Run all checks**:
   ```bash
   npm run lint
   npm run test
   npm run type-check
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature
   ```

4. **Create Pull Request**:
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### Pull Request Guidelines

- **Title**: Use descriptive title (e.g., "Add dark mode support")
- **Description**: Explain what changes you made and why
- **Screenshots**: Include for UI changes
- **Testing**: Describe how you tested the changes
- **Breaking Changes**: Clearly mark any breaking changes
- **Link Issues**: Reference related issues (e.g., "Fixes #123")

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Add new configuration options
- Update dependencies with breaking changes
- Add new environment variables

### Documentation Files

- **README.md** - Project overview and quick start
- **frontend/README.md** - Frontend-specific documentation
- **backend/README.md** - Backend-specific documentation
- **CONTRIBUTING.md** - This file
- **docs/** - Additional documentation
- **.github/copilot-instructions.md** - Copilot AI instructions

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Add links to external resources
- Keep formatting consistent
- Update version numbers where applicable

## Questions?

If you have questions or need help:

1. Check existing [Issues](https://github.com/Toomas633/homepage/issues)
2. Check the [Discussions](https://github.com/Toomas633/homepage/discussions)
3. Open a new issue with the `question` label
4. Contact the maintainer at info@toomas633.com

---

Thank you for contributing! 🎉
