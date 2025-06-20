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
        '@radix-ui/react-tabs',
        '@supabase/supabase-js',
        'clsx',
        'tailwind-merge',
        'react',
        'react-dom'
      ],
      esbuildOptions: {
        target: 'esnext'
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      dedupe: ['react', 'react-dom'],
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
          manualChunks: (id) => {
            // PDF.js - Large PDF processing library
            if (id.includes('pdfjs-dist')) {
              return 'pdfjs';
            }
            
            // Chart libraries - Heavy visualization dependencies
            if (id.includes('chart.js') || id.includes('react-chartjs-2') || id.includes('recharts')) {
              return 'charts';
            }
            
            // UI component libraries - Large UI dependencies
            if (id.includes('@radix-ui') || id.includes('framer-motion')) {
              return 'ui-components';
            }
            
            // Table and virtualization - Heavy data handling
            if (id.includes('@tanstack/react-table') || id.includes('react-virtualized') || id.includes('react-window')) {
              return 'data-tables';
            }
            
            // Authentication and API - Supabase and related
            if (id.includes('@supabase') || id.includes('@tanstack/react-query') || id.includes('axios')) {
              return 'api-auth';
            }
            
            // Form handling and validation
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('react-dropzone')) {
              return 'forms';
            }
            
            // Routing - React Router and related
            if (id.includes('react-router-dom')) {
              return 'routing';
            }
            
            // Utilities and smaller libraries
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('lucide-react')) {
              return 'utilities';
            }
            
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            
            // Large individual page components for lazy loading
            if (id.includes('/pages/') && (
              id.includes('AnalyticsPage') || 
              id.includes('ATSOptimizationPage') || 
              id.includes('ResumeAnalyzerPage') ||
              id.includes('ResultsPage') ||
              id.includes('ProfilePage')
            )) {
              return 'heavy-pages';
            }
            
            // All other node_modules as vendor
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      },
      // Increase chunk size warning limit to avoid warnings for intentionally large chunks
      chunkSizeWarningLimit: 600,
      outDir: 'frontend-build',
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
      // Fix for 431 Request Header Fields Too Large
      host: true,
      port: 5173,
      strictPort: false
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
