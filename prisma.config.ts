// prisma.config.ts
import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'prisma/config' // 1. Import defineConfig

// Automatically loads .env, .env.local, .env.development, etc.
loadEnvConfig(process.cwd())

// 2. Wrap your object inside defineConfig()
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.DIRECT_URL,
  },
})
