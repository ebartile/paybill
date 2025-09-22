# NOTE: It's highly recommended to use the new builder, Buildkit. https://docs.docker.com/build/buildkit/
## USAGE:
# Build:        docker build . -f Dockerfile --target production -t www:latest
# Run:          docker run -p 3000:3000 paybilldev/www
# Deploy:       docker push paybilldev/www:latest
# Clean build:
#    docker builder prune
#    docker build . -f Dockerfile --target production -t www:latest --no-cache

FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Fixes issues with Sentry CLI and SSL certificates during build
RUN apt-get update -qq && \
  apt-get install -y --no-install-recommends \
  git \
  python3 \
  ca-certificates \
  build-essential && \
  rm -rf /var/lib/apt/lists/* && \
  update-ca-certificates

RUN npm install -g pnpm@9.15.5

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Dev stage
FROM deps AS dev
COPY . .
ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 3000
CMD ["pnpm", "dev"]

# Compile Next.js
FROM dev AS builder
RUN pnpm exec next build

# Production stage
FROM base AS production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD node -e "fetch('http://localhost:3000/favicon.ico').then((r) => {if (r.status !== 200) throw new Error(r.status)})"
CMD ["node", "server.js"]
