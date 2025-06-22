import { defineConfig } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('react')) {
              return 'react'
            } else if (id.includes('firebase')) {
              return 'firebase'
            } else if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      }
    },
    plugins: [TanStackRouterVite(), tailwindcss(), react(), viteTsconfigPaths()],
    manualChunks(id) {
      console.log(id)
      if (id.includes('node_modules')) {
        return id.toString().split('node_modules/')[1].split('/')[0].toString()
      }
    }
  }
})
