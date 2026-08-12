# React + TypeScript One-Page Application

A minimal, scalable single-page application built with **Vite**, **React**, and **TypeScript**.

## Features

- ⚡ **Fast Development** with Vite HMR (Hot Module Replacement)
- 🎯 **TypeScript** with strict mode enabled for type safety
- 🎨 **Plain CSS** with a modern responsive design
- 📦 **Lightweight** dependencies for quick builds
- 🔍 **ESLint & Prettier** pre-configured for code quality
- 📂 **Organized folder structure** ready to scale

## Project Structure

```
.
├── src/
│   ├── components/
│   │   └── App.tsx              # Main application component
│   ├── styles/
│   │   ├── index.css            # Global styles
│   │   └── App.css              # Component-specific styles
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces and types
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts            # Vite type definitions
├── index.html                   # HTML template
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── .prettierrc                  # Prettier formatting rules
├── .editorconfig                # Editor configuration
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- **Node.js** 16+ and **npm** (or yarn/pnpm)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Available Scripts

- `npm run dev` — Start Vite development server with HMR
- `npm run build` — Build for production (output: `dist/`)
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint (add after configuring ESLint)
- `npm run format` — Format code with Prettier

## Development

### Create a New Component

1. Create a file in `src/components/`, e.g., `src/components/Button.tsx`:

```typescript
interface ButtonProps {
  label: string;
  onClick?: () => void;
}

function Button({ label, onClick }: ButtonProps): JSX.Element {
  return <button onClick={onClick}>{label}</button>;
}

export default Button;
```

2. Import and use it in `App.tsx`:

```typescript
import Button from '@/components/Button';
```

### Add Types

Define your types in `src/types/index.ts`:

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```

Then import them in your components:

```typescript
import type { User } from '@/types';
```

### Add Styles

Create a new CSS file in `src/styles/` or add styles directly in components:

```typescript
import '@/styles/MyComponent.css';
```

## Configuration

### TypeScript

Strict mode is enabled in `tsconfig.json`. To learn more, see the [TypeScript documentation](https://www.typescriptlang.org/docs).

### Vite

The `vite.config.ts` file includes:
- React plugin with HMR support
- Path alias `@/` for cleaner imports
- Development server running on port `5173`

### Code Quality

- **Prettier**: Automatically formats code on save (if integrated with your editor)
- **ESLint**: Configure further in `.eslintrc.json` (file can be added as needed)

## Building for Production

```bash
npm run build
```

The optimized build outputs to the `dist/` directory. You can preview it with:

```bash
npm run preview
```

## Deployment

The `dist/` folder is ready to be deployed to:

- **Vercel**: Simply connect your Git repository
- **Netlify**: Drag and drop the `dist/` folder or connect Git
- **GitHub Pages**: Push the `dist/` folder to a `gh-pages` branch
- **Any static hosting**: Upload the contents of `dist/`

## Next Steps

- Add a state management library (e.g., Zustand, Jotai) if needed
- Integrate with an API using `fetch` or a library like `axios`
- Add routing with **React Router** if you need multiple pages
- Set up testing with **Vitest** or **Jest**
- Deploy to your preferred hosting platform

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## License

This project is licensed under the ISC License.
