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
          // Ensure proper chunk ordering - react MUST load first
          inlineDynamicImports: false,
          manualChunks: (id) => {
            // STEP 1: React core - MUST load FIRST
            // Only core React (not react-router, react-helmet, etc)
            if (id.includes('node_modules/react/index') || 
                id.includes('node_modules/react/jsx-runtime') ||
                id.includes('node_modules/react-dom/') ||
                (id.includes('node_modules/react/') && !id.includes('node_modules/react-'))) {
              return 'react-vendor';
            }
            
            // STEP 2: Non-React vendor packages (safe to load early)
            // These don't use React at all
            if (id.includes('node_modules/') && (
              id.includes('axios') ||
              id.includes('lodash') ||
              id.includes('clsx') ||
              id.includes('class-variance-authority') ||
              id.includes('tailwind-merge')
            )) {
              return 'vendor';
            }
            
            // STEP 3: React-dependent packages - load AFTER react-vendor
            
            // Zustand - state management (uses React context)
            if (id.includes('zustand')) {
              return 'state-management';
            }
            
            // UI component libraries - Large UI dependencies (depends on React)
            if (id.includes('@radix-ui') || id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-components';
            }
            
            // Routing - React Router and related (depends on React)
            if (id.includes('react-router-dom') || id.includes('react-helmet-async')) {
              return 'routing';
            }
            
            // Authentication and API - Supabase and related (depends on React)
            if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
              return 'api-auth';
            }
            
            // Chart libraries - Heavy visualization dependencies
            if (id.includes('recharts')) {
              return 'charts';
            }
            
            // PDF.js - Large PDF processing library
            if (id.includes('pdfjs-dist')) {
              return 'pdfjs';
            }
            
            // Form handling and validation
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('react-dropzone')) {
              return 'forms';
            }
            
            // Table and virtualization - Heavy data handling
            if (id.includes('@tanstack/react-table') || id.includes('react-virtualized') || id.includes('react-window')) {
              return 'data-tables';
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
            
            // All other React-related packages
            if (id.includes('node_modules/') && id.includes('react-')) {
              return 'react-deps';
            }
            
            // Remaining node_modules
            if (id.includes('node_modules/')) {
              return 'vendor-misc';
            }
          }
        }
      },
      // Increase chunk size warning limit to avoid warnings for intentionally large chunks
      chunkSizeWarningLimit: 600,
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
