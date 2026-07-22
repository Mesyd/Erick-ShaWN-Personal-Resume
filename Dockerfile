FROM node:22.13.1-bookworm-slim AS deps

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22.13.1-bookworm-slim AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV WRANGLER_LOG_PATH=".wrangler/wrangler.log"

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM node:22.13.1-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV="production"
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"
ENV WRANGLER_LOG_PATH=".wrangler/wrangler.log"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/.openai ./.openai
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/worker ./worker
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["pnpm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
