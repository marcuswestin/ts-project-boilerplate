import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-ignore
const dirname = __dirname

// Import paths aliases:
// Keep this entry in sync with compilerOptions.paths.* in ./tsconfig.json
let sharedModuleSettings = {
  resolve: {
    alias: {
      'shared': `${dirname}/../shared`,
    },
  },
  server: {
    host: 'localhost',
    port: 4000,
    fs: {
      allow: ['./src', `${dirname}/../shared`],
    },
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  ...{ plugins: [react()] },
  ...sharedModuleSettings,
})
