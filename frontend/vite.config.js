import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxyOnError = (proxy) => {
  const originalOn = proxy.on;
  const originalOnce = proxy.once;
  let errorListenerRegistered = false;

  const customOn = function (event, listener) {
    if (event === 'error') {
      if (!errorListenerRegistered) {
        errorListenerRegistered = true;
        return originalOn.call(this, 'error', (err, req, res) => {
          console.warn(`[vite proxy] Backend offline: ${req.url} (${err.code || err.message})`);
          if (res && typeof res.writeHead === 'function' && !res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Backend server is down.');
          }
        });
      }
      return this; // Skip registering subsequent error listeners (like Vite's default logger)
    }
    return originalOn.apply(this, arguments);
  };

  const customOnce = function (event, listener) {
    if (event === 'error') {
      if (!errorListenerRegistered) {
        errorListenerRegistered = true;
        return originalOnce.call(this, 'error', (err, req, res) => {
          console.warn(`[vite proxy] Backend offline: ${req.url} (${err.code || err.message})`);
          if (res && typeof res.writeHead === 'function' && !res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Backend server is down.');
          }
        });
      }
      return this;
    }
    return originalOnce.apply(this, arguments);
  };

  proxy.on = customOn;
  proxy.addListener = customOn;
  proxy.once = customOnce;
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: proxyOnError,
      },
      '/danzup-logo.png': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: proxyOnError,
      },
      '/hardik.png': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: proxyOnError,
      },
      '/akash.png': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: proxyOnError,
      },
      '/hero-dancer.jpeg': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: proxyOnError,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
