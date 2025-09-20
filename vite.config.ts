import { defineConfig } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

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
    plugins: [tailwindcss(), react(), viteTsconfigPaths()],
    manualChunks(id: string) {
      if (id.includes('node_modules')) {
        return id.toString().split('node_modules/')[1].split('/')[0].toString()
      }
    }
  }
})
