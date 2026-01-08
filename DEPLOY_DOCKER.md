# FlockMaster — Docker deployment (Nginx serving static build)

Quick steps to build and run locally or on a server:

1. Build the image and run (single host):

   docker compose up --build -d

   or (without docker compose):

   docker build -t flockmaster:latest .
   docker run -d -p 80:80 --name flockmaster flockmaster:latest

2. Confirm the container is serving the app at http://your-server/

Notes & tips
- The Dockerfile uses a multi-stage build: Node builds the Vite output into `dist/`, then Nginx serves `/usr/share/nginx/html`.
- For a non-root base path (e.g., serving from `/app/`), set `base` in `vite.config.ts` and rebuild:

  export default defineConfig({ base: '/app/', ... })

- For HTTPS / production-grade deployments, put this container behind a reverse proxy (nginx on host, Traefik, or load balancer) and obtain certificates (Let's Encrypt).
- If you want Docker to handle TLS automatically, consider replacing the Nginx service with Traefik in a compose stack.

If you want, I can:
- Build and push the image to a registry and prepare a `docker-compose.prod.yml` for your server, or
- Prepare a small systemd unit that pulls the image and runs it on boot.
