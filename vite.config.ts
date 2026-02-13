import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Filtrar advertencias repetitivas proviniendo de dependencias (por ejemplo: "use client")
      onwarn(warning, warn) {
        const msg = (warning && (warning as any).message) ? String((warning as any).message) : ''
        if (/Module level directives cause errors when bundled|"use client"/.test(msg)) return
        warn(warning)
      },
      output: {
        // Código de chunking manual para reducir tamaño de bundles principales
        manualChunks(id) {
          if (!id) return
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react'
            if (id.includes('recharts') || id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-charts'
            if (id.includes('@tanstack') || id.includes('axios') || id.includes('react-router')) return 'vendor-query'
            if (id.includes('sonner') || id.includes('lucide-react')) return 'vendor-ui'
            // Let Rollup handle uncategorized node_modules to avoid circular chunk references
            return null
          }
        }
      }
    }
  }
})
