# Project Setup Documentation

## UI Libraries & Styling

### Chakra UI (v2.x)

- **Installation**: `npm install @chakra-ui/react@^2.8.0 @emotion/react @emotion/styled framer-motion`
- **Purpose**: Component library for building accessible, reusable UI components
- **Why**: Provides pre-built components with consistent styling, accessibility features, and responsive design

### Tailwind CSS

- **Installation**: `npm install -D tailwindcss postcss autoprefixer`
- **Purpose**: Utility-first CSS framework for rapid UI development
- **Why**: Allows for quick styling with utility classes and custom design system

## Routing & Navigation

### React Router

- **Installation**: `npm install react-router-dom`
- **Purpose**: Client-side routing for single-page application navigation
- **Why**: Enables navigation between different views without page reloads

## Data Fetching & State Management

### Axios

- **Installation**: `npm install axios`
- **Purpose**: HTTP client for making API requests
- **Why**: Promise-based HTTP client with better error handling and request/response interceptors

### React Query (@tanstack/react-query)

- **Installation**: `npm install @tanstack/react-query`
- **Purpose**: Data fetching, caching, and synchronization library
- **Why**: Provides powerful caching, background updates, and optimistic updates for better UX

### Redux Toolkit

- **Installation**: `npm install @reduxjs/toolkit react-redux`
- **Purpose**: State management for complex application state
- **Why**: Centralized state management with predictable state updates and dev tools

### Redux Persist

- **Installation**: `npm install redux-persist`
- **Purpose**: Persist Redux state to localStorage
- **Why**: Maintains user progress and preferences across browser sessions

## Icons

### Lucide React

- **Installation**: `npm install lucide-react`
- **Purpose**: Beautiful & consistent icon library
- **Why**: Provides a comprehensive set of customizable icons that work well with React

## Code Quality & Tooling

### ESLint

- **Installation**: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks`
- **Purpose**: Code linting and quality enforcement
- **Why**: Catches errors, enforces coding standards, and improves code quality

### Prettier

- **Installation**: `npm install -D prettier`
- **Purpose**: Code formatting
- **Why**: Ensures consistent code formatting across the project

### Husky

- **Installation**: `npm install -D husky lint-staged`
- **Purpose**: Git hooks for pre-commit linting and formatting
- **Why**: Automates code quality checks before commits

## Build Tools

### Vite

- **Installation**: `npm install -D vite @vitejs/plugin-react vite-tsconfig-paths`
- **Purpose**: Fast build tool and development server
- **Why**: Provides fast hot module replacement and optimized builds

### TypeScript

- **Installation**: `npm install -D typescript @types/react @types/react-dom`
- **Purpose**: Type safety and better developer experience
- **Why**: Catches type errors at compile time and provides better IDE support
