import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 4173,
    watch: { usePolling: true },
    strictPort: true, // Fail if port isn't available
    logLevel: "info"  // Provide detailed logs
  }
})
