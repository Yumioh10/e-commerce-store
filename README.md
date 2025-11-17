E-commerce store:

1. Project Overview
   is modern e-commerce platform focused on selling cosmetics products. The core functionality include user accounts, product catalogs, shopping carts, secure checkout, and order processing, all designed to provide a smooth online shopping experience.

2. Project Workflow:
   - Phase 1: Project Initialization
     [ ] Initialize the Node.js project: npm init -y.

[ ] Create the basic folder structure: client, public, public/image, src, src/assets, src/ components, src/pages, sr## Features

- ⚡️ [Vite](https://vite.dev) - Fast build tool and dev server
- ⚛️ [React](https://react.dev) - UI library
- 🧭 [TanStack Router](https://tanstack.com/router) - Type-safe routing
- 📘 [TypeScript](https://www.typescriptlang.org) - Type safety
- 🔧 [ESLint](https://eslint.org) - Code linting
- 🛠️ [TanStack Router Devtools](https://tanstack.com/router) - Development tools

## Getting Started

### Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### Development

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

### Build

```bash
pnpm build
# or
npm run build
# or
yarn build
```

### Preview

```bash
pnpm preview
# or
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── routes/          # Route definitions
│   ├── __root.tsx   # Root route layout
│   ├── index.tsx    # Home route (/)
│   └── about.tsx    # About route (/about)
├── router.tsx       # Router configuration
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Adding Routes

Create new route files in the `src/routes/` directory. TanStack Router will automatically pick them up and generate the route tree.

Example: Create `src/routes/contact.tsx` for a `/contact` route.

## Learn More

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
