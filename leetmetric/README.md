# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 🚀 Deploying to Railway

This project is setup to run on Railway as a single Node service: the server serves the built Vite frontend from `dist` and exposes a small proxy endpoint (`/leetcode`).

Quick steps to deploy from GitHub on Railway:

1. Push your repository to GitHub (make sure `server.js` and `package.json` are on the default branch).
2. On Railway create a new project and choose **Deploy from GitHub** → select the repo.
3. Railway will run `npm install` and then `npm run build` (we include `postinstall` to build during install if needed). The service will then run `npm start` which executes `node server.js`.
4. Set environment variables (in the Railway service settings) as needed:
	- `ALLOWED_ORIGIN` — (optional) set to the URL that should be allowed for CORS. Defaults to `*`.
	- `PORT` — set by Railway automatically, you don't need to set this manually.

Notes / tips:
- The server already reads `process.env.PORT` and serves `dist/index.html` so the app will work without further changes.
- To control the Node version in Railway, the `engines.node` field in `package.json` is set to `18.x`.
- If you want to use Docker deployment instead, add a Dockerfile and use Railway's Docker deploy option.

If you'd like, I can add an optional `Dockerfile` or a `Procfile` to make deployments explicit — tell me which you prefer and I will add it.
