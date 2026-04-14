import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './'
  // server: {
  //   host: true,        // απαραίτητο για LAN access
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.1.2:8080',  // backend LAN IP
  //       changeOrigin: true
  //     }
  //   }
  // }
})