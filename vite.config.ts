import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');
  
  // Ensure PDF worker directory exists in public
  const pdfWorkerDir = resolve(__dirname, 'public', 'pdf-worker');
  if (!fs.existsSync(pdfWorkerDir)) {
    fs.mkdirSync(pdfWorkerDir, { recursive: true });
  }

  return {
    base: '/',
    plugins: [
      react(),
      // Custom plugin to fix MIME types and reduce header size
      {
        name: 'mime-fix',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            
            // Clear potentially large headers to prevent 431 error
            delete req.headers['x-forwarded-for'];
            delete req.headers['x-real-ip'];
            
            // Handle CSS files specifically
            if (url.endsWith('.css') || url.includes('.css')) {
              res.setHeader('Content-Type', 'text/css');
              res.setHeader('Cache-Control', 'public, max-age=3600');
            } 
            // Handle JavaScript files
            else if (url.endsWith('.js') || url.endsWith('.mjs') || url.includes('.js') || url.includes('.mjs')) {
              res.setHeader('Content-Type', 'application/javascript');
              res.setHeader('Cache-Control', 'public, max-age=3600');
            }
            // Handle assets folder specifically
            else if (url.startsWith('/assets/')) {
              if (url.includes('.css')) {
                res.setHeader('Content-Type', 'text/css');
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
              } else if (url.includes('.js') || url.includes('.mjs')) {
                res.setHeader('Content-Type', 'application/javascript');
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
              }
            }
            
            next();
          });
        }
      }
    ],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@radix-ui/react-tabs',
        '@supabase/supabase-js',
        'clsx',
        'tailwind-merge'
      ],
      esbuildOptions: {
        target: 'esnext'
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Force ALL React imports to use the exact same instance
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime')
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
      conditions: ['import', 'module', 'browser', 'default']
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      },
      modulePreload: {
        polyfill: true
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          inlineDynamicImports: false,
          manualChunks: (id) => {
            // Single vendor chunk for all node_modules — prevents circular chunk
            // dependencies caused by Rollup's interop helper deduplication across chunks.
            if (id.includes('node_modules/')) {
              // PDF.js is huge; keep it separate so it only loads on pages that need it
              if (id.includes('pdfjs-dist')) return 'pdfjs';
              return 'vendor';
            }
          }
        }
      },
      // Increase chunk size warning limit to avoid warnings for intentionally large chunks
      chunkSizeWarningLimit: 3000,
      outDir: 'dist',
    },
    css: {
      postcss: './postcss.config.js',
    },
    server: {
      fs: {
        allow: ['..'],
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
      },
      middlewareMode: false,
      hmr: {
        overlay: true
      },
      // Replit environment configuration
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      allowedHosts: true
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : mode),
      __API_CONFIG__: {
        GROQ_API_KEY: JSON.stringify(env.VITE_GROQ_API_KEY),
        TOGETHER_API_KEY: JSON.stringify(env.VITE_TOGETHER_API_KEY),
        SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL),
        SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
        OPENAI_API_KEY: JSON.stringify(env.VITE_OPENAI_API_KEY),
        PINECONE_API_KEY: JSON.stringify(env.VITE_PINECONE_API_KEY),
        PINECONE_ENVIRONMENT: JSON.stringify(env.VITE_PINECONE_ENVIRONMENT),
      }
    },
  };
});
