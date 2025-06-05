# Development Setup Guide

This guide describes the development environment setup for the TimeMarket
project.

## 🛠️ Prerequisites

- Node.js 18+
- npm 8+
- VS Code (recommended)

## 📦 Initial Setup

1. Clone the repository:

```bash
git clone https://github.com/workmorph/TimeMarket.git
cd TimeMarket
```

2. Install dependencies:

```bash
npm install
```

3. Set up Git hooks:

```bash
npm run prepare
```

## 🔧 Development Tools

### ESLint

Strict TypeScript and security-focused linting configuration.

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Prettier

Automatic code formatting for consistent style.

```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check
```

### TypeScript

Type checking without compilation.

```bash
npm run type-check
```

### Pre-commit Hooks

Automatically runs linting and formatting on staged files before commit.

- ESLint fix for JS/TS files
- Prettier formatting for all supported files
- Conventional commit message validation

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system or external dependencies
- `ci`: CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

Examples:

```bash
feat: add new payment integration
fix(auth): resolve login issue
docs: update README with setup instructions
```

## 🆚 VS Code Setup

1. Install recommended extensions:

   - Open Command Palette (Cmd/Ctrl + Shift + P)
   - Run "Extensions: Show Recommended Extensions"
   - Install all recommended extensions

2. Settings are automatically applied from `.vscode/settings.json`

### Key Features:

- Auto-format on save
- ESLint auto-fix on save
- Import organization on save
- TypeScript workspace version
- Consistent formatting across the team

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run all checks (lint, format, type-check)
npm run lint && npm run format:check && npm run type-check
```

## 📋 Code Quality Rules

### TypeScript Strict Mode

- No `any` types
- Explicit function return types
- Strict boolean expressions
- No floating promises
- Consistent type imports

### Security Rules

- No eval or implied eval
- Object injection detection
- Safe regex patterns
- No hardcoded credentials

### Code Complexity

- Max function complexity: 15
- Max file lines: 300
- Max nesting depth: 4
- Prefer const and arrow functions

## 🔍 Troubleshooting

### ESLint not working

```bash
# Clear ESLint cache
rm -rf .eslintcache
npm run lint
```

### Prettier conflicts with ESLint

The configuration includes `eslint-config-prettier` to disable conflicting
rules.

### Husky hooks not running

```bash
# Re-install husky
npm run prepare
```

### VS Code not formatting on save

1. Check that Prettier extension is installed
2. Reload VS Code window
3. Check output panel for errors

## 📚 Additional Resources

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
