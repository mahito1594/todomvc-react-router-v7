# TodoMVC:  React Router (v7)

This is my [TodoMVC](https://todomvc.com/) implementation written by [React Router (v7)](https://reactrouter.com/).

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

> [!NOTE]
> See [pnpm.io](https://pnpm.io/installation) to install `pnpm`.

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173/todomvc-react-router-v7`.

> [!TIP]
> Because the author deploy to GitHub pages,
> we set `base` in [vite.config.ts](./vite.config.ts) and `basename` in [react-router.config.ts](./react-router.config.ts) to `/todomvc-react-router-v7`,
> which is the repository name.

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

### GitHub Pages

See [github-pages.yml](./.github/workflows/github-pages.yml).

### DIY Deployment

If you're familiar with deploying Node applications, use [http-server](https://www.npmjs.com/package/http-server) for example.
