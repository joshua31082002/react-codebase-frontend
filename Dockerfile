# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifest files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY src ./src
COPY public ./public
COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./

# Set environment variables
ENV PORT=8080 NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
