# ============================================================
# Q-FM Cities — Multi-stage Docker Build
# ============================================================

# ---- Build args (injected at build time via CI/CD) ----
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build args as env vars for Vite build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy dependency manifests first (for layer caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /var/www/q-fm-cities/dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
