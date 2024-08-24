import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';


// https://vitejs.dev/config/
export default defineConfig((props) => {
  const env = loadEnv(props.mode, "./vite/env")
  console.log(env)
  return {
    plugins: [react()],
    build: { outDir: env.VITE_BUILD_OUT_DIR },
    server: {
      host: true,
      cors: true,

      proxy: {
        '^/site/.+': {
          target: `http://localhost:${env.VITE_DEV_PORT}/`,
          changeOrigin: true
        },
        '^/.+Hub/.+': {
          target: `http://localhost:${env.VITE_DEV_PORT}/`,
          changeOrigin: true,
          ws: true
        }
      }
    },
  }
})
