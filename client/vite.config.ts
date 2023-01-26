import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Import paths aliases:
// Keep this entry in sync with compilerOptions.paths.* in ./tsconfig.json
let sharedModuleSettings = {
  resolve: {
    alias: {
      'shared': `../shared`,
    },
  },
  server: {
    host: 'localhost',
    port: 4000,
    fs: {
      allow: ['./src', `../shared`],
    },
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  ...{ plugins: [react()] },
  ...sharedModuleSettings,
})
