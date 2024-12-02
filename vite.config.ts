import { defineConfig } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build'
    },
    plugins: [TanStackRouterVite(), react(), viteTsconfigPaths()]
  }
})
