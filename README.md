# Recovery Tracker Frontend

A comprehensive React-based frontend application for tracking patient recovery progress after medical procedures, built with modern web technologies.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Redux Toolkit with RTK Query
- **UI Library**: Chakra UI for consistent, accessible components
- **Routing**: React Router v6 for client-side navigation
- **HTTP Client**: Axios for API communication
- **Form Handling**: React Hook Form with Yup validation
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Styling**: CSS-in-JS with Chakra UI's styling system
- **Development**: ESLint + TypeScript for code quality

## 📁 Project Structure

```
frontend/web/src/
├── api/                    # API layer and data fetching
│   ├── auth/              # Authentication API
│   ├── brochures/         # Brochure content API
│   ├── symptoms/          # Symptom tracking API
│   └── axios.ts           # Axios configuration
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── brochure/          # Brochure-related components
│   ├── profile/           # Profile management components
│   └── symptom-tracker/   # Symptom tracking components
├── features/              # Feature-specific code
├── hooks/                 # Custom React hooks
├── layouts/               # Layout components
├── pages/                 # Page components
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and profile pages
│   └── welcome/           # Welcome/landing page
├── routes/                # Routing configuration
├── store/                 # Redux store and slices
├── styles/                # Global styles
├── utils/                 # Utility functions
│   ├── recovery-calculator.ts
│   └── validations/       # Form validation schemas
└── main.tsx              # Application entry point
```

## 🏗️ Architecture Overview

### State Management

- **Redux Toolkit**: Manages global application state (auth, user data, UI state)
- **RTK Query**: Handles server state and API caching
- **React Query**: Additional data fetching for complex scenarios

### Component Architecture

- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Container/Presentational**: Separates business logic from UI presentation
- **Custom Hooks**: Encapsulates reusable logic and state management

### Data Flow

1. **API Layer**: Centralized API calls with proper error handling
2. **State Management**: Redux for global state, React Query for server state
3. **Component Updates**: Reactive UI updates based on state changes
4. **Form Handling**: Controlled forms with validation and error states

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

```bash
# Navigate to frontend directory
cd frontend/web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the frontend/web directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Recovery Tracker
```

## 🎯 Key Features

### Authentication System

- **Sign Up/Sign In**: User registration and login
- **Protected Routes**: Route-level authentication guards
- **Session Management**: Automatic token refresh and logout
- **Profile Management**: User profile updates and password changes

### Dashboard

- **Recovery Progress**: Visual progress tracking with charts
- **Quick Actions**: Easy access to key features
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on all device sizes

### Brochure System

- **Interactive Content**: Step-by-step recovery guides
- **Progress Tracking**: Mark completed items and add notes
- **Section Navigation**: Easy browsing through different topics
- **Export Functionality**: Download progress as Excel files

### Symptom Tracker

- **Daily Logging**: Track pain levels and symptoms
- **Trend Analysis**: Visualize recovery patterns
- **Medication Tracking**: Log medications and dosages
- **Export Data**: Download symptom history

### Profile Management

- **User Information**: Update personal details
- **Surgery Date**: Set and modify surgery dates
- **Password Changes**: Secure password updates
- **Data Export**: Download all recovery data

## 🛠️ Development Guidelines

### Code Style

- **TypeScript**: Strict typing for all components and functions
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **Component Naming**: PascalCase for components, camelCase for functions

### Component Structure

```tsx
// Example component structure
import React from 'react';
import { ComponentProps } from './types';

interface Props {
  // Define component props
}

export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### State Management Patterns

```tsx
// Redux slice example
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  // Define state shape
}

const initialState: State = {
  // Initial state
};

export const sliceName = createSlice({
  name: 'sliceName',
  initialState,
  reducers: {
    // Define actions
  },
});
```

### API Integration

```tsx
// API hook example
import { useQuery } from '@tanstack/react-query';

export const useData = () => {
  return useQuery({
    queryKey: ['data'],
    queryFn: api.getData,
  });
};
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking

# Testing (if configured)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 📦 Dependencies

### Core Dependencies

- `react`: 18.x - UI framework
- `react-dom`: 18.x - DOM rendering
- `react-router-dom`: 6.x - Client-side routing
- `@reduxjs/toolkit`: 2.x - State management
- `react-redux`: 9.x - React-Redux integration
- `@tanstack/react-query`: 5.x - Data fetching
- `@chakra-ui/react`: 2.x - UI component library
- `react-hook-form`: 7.x - Form handling
- `@hookform/resolvers`: 3.x - Form validation
- `yup`: 1.x - Schema validation
- `axios`: 1.x - HTTP client

### Development Dependencies

- `@types/react`: TypeScript definitions
- `@types/react-dom`: TypeScript definitions
- `@vitejs/plugin-react`: Vite React plugin
- `typescript`: Type checking
- `eslint`: Code linting
- `prettier`: Code formatting

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Variables

Ensure all required environment variables are set in your production environment:

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_APP_NAME`: Application name

## 🔍 Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `npm run type-check` to identify issues
2. **Linting Errors**: Run `npm run lint:fix` to auto-fix issues
3. **Build Failures**: Check for missing dependencies or type errors
4. **API Connection**: Verify backend server is running and accessible

### Development Tips

- Use React DevTools for component debugging
- Use Redux DevTools for state management debugging
- Use Network tab for API request debugging
- Check console for runtime errors

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Chakra UI Documentation](https://chakra-ui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Follow the established code style and patterns
2. Write TypeScript for all new code
3. Add proper error handling and loading states
4. Test your changes thoroughly
5. Update documentation as needed

---

Built with ❤️ using modern web technologies for better patient care and recovery tracking.
