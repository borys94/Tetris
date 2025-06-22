import { defineConfig, type HttpServer } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fullReloadOnTSChange()],
})

function fullReloadOnTSChange() {
  return {
    name: 'full-reload-on-ts-change',
    handleHotUpdate({ file, server }: { file: string; server: HttpServer }) {
      if (file.endsWith('.ts')) {
        server.ws.send({ type: 'full-reload' })
      }
    },
  }
}
